// Claude Code Stop hook: before Claude finishes a turn, run the typecheck and
// the unit tests. If either fails, Claude is blocked from stopping and gets
// the errors to fix. Skipped when no source/config file changed since the last
// passing run, so question-only turns stay instant.
import { spawnSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const toNative = (p) =>
  process.platform === 'win32' ? p.replace(/^\/([a-zA-Z])\//, (_, d) => `${d.toUpperCase()}:/`) : p

const projectDir = toNative(process.env.CLAUDE_PROJECT_DIR || process.cwd())
const stateFile = resolve(projectDir, '.claude/hooks/.verify-state.json')
const MAX_CONSECUTIVE_BLOCKS = 3

// What counts as "the code changed".
const WATCHED_DIRS = ['src']
const WATCHED_FILES = [
  'package.json',
  'package-lock.json',
  'vite.config.ts',
  'react-router.config.ts',
  'tsconfig.json',
  'tsconfig.app.json',
  'tsconfig.node.json',
  '.oxlintrc.json',
  '.env',
]

function readJson(path, fallback) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch {
    return fallback
  }
}

function newestMtime() {
  let newest = 0
  const visit = (path) => {
    if (!existsSync(path)) return
    const stat = statSync(path)
    // Folder mtimes change when files are added, renamed or deleted, so they count too.
    if (stat.mtimeMs > newest) newest = stat.mtimeMs
    if (stat.isDirectory()) {
      for (const entry of readdirSync(path)) visit(join(path, entry))
    }
  }
  for (const dir of WATCHED_DIRS) visit(resolve(projectDir, dir))
  for (const file of WATCHED_FILES) visit(resolve(projectDir, file))
  return newest
}

function npmRun(script) {
  const result = spawnSync('npm', ['run', '--silent', script], {
    cwd: projectDir,
    encoding: 'utf8',
    shell: true,
  })
  return { ok: result.status === 0, output: `${result.stdout}${result.stderr}`.trim() }
}

const tail = (text, lines = 60) => text.split('\n').slice(-lines).join('\n')

let input = {}
try {
  input = JSON.parse(readFileSync(0, 'utf8') || '{}')
} catch {
  // no input is fine
}

const state = readJson(stateFile, { lastPassed: 0, blocks: 0 })
const changedAt = newestMtime()

if (changedAt <= state.lastPassed) process.exit(0) // nothing changed since the last green run

const failures = []
for (const script of ['typecheck', 'test:run']) {
  const { ok, output } = npmRun(script)
  if (!ok) failures.push(`npm run ${script} failed:\n${tail(output)}`)
}

if (failures.length === 0) {
  writeFileSync(stateFile, JSON.stringify({ lastPassed: Date.now(), blocks: 0 }))
  process.exit(0)
}

// Loop guard: after several blocked attempts in a row, let Claude stop and tell the user.
const blocks = input.stop_hook_active ? state.blocks + 1 : 1
writeFileSync(stateFile, JSON.stringify({ lastPassed: state.lastPassed, blocks }))

if (blocks > MAX_CONSECUTIVE_BLOCKS) {
  writeFileSync(stateFile, JSON.stringify({ lastPassed: state.lastPassed, blocks: 0 }))
  console.log(
    JSON.stringify({
      systemMessage: `Typecheck/tests still failing after ${MAX_CONSECUTIVE_BLOCKS} attempts — please review.`,
    }),
  )
  process.exit(0)
}

console.log(
  JSON.stringify({
    decision: 'block',
    reason: `Before finishing, fix these failures:\n\n${failures.join('\n\n')}`,
  }),
)
