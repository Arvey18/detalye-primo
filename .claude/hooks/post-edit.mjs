// Claude Code PostToolUse hook (Edit/Write/MultiEdit).
// Formats the edited file with Prettier, then runs oxlint --fix on it.
// Lint errors that can't be auto-fixed are sent back to Claude (exit code 2)
// so they get fixed right away. Your own VS Code edits are not affected.
import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { extname, isAbsolute, relative, resolve } from 'node:path'

// Git Bash on Windows may hand over POSIX-style paths (/w/project); convert them.
const toNative = (p) =>
  process.platform === 'win32' ? p.replace(/^\/([a-zA-Z])\//, (_, d) => `${d.toUpperCase()}:/`) : p

const projectDir = toNative(process.env.CLAUDE_PROJECT_DIR || process.cwd())
const LINTABLE = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'])

function readInput() {
  try {
    return JSON.parse(readFileSync(0, 'utf8') || '{}')
  } catch {
    return {}
  }
}

function run(script, args) {
  return spawnSync(process.execPath, [resolve(projectDir, script), ...args], {
    cwd: projectDir,
    encoding: 'utf8',
  })
}

const input = readInput()
const rawPath = input.tool_response?.filePath ?? input.tool_input?.file_path
if (!rawPath) process.exit(0)
const filePath = toNative(rawPath)

const absolute = isAbsolute(filePath) ? filePath : resolve(projectDir, filePath)
const rel = relative(projectDir, absolute)
// Only files inside the project, and only ones that still exist.
if (rel.startsWith('..') || isAbsolute(rel) || !existsSync(absolute)) process.exit(0)

const problems = []

// 1. Prettier (respects .prettierignore; skips file types it doesn't know).
const prettier = run('node_modules/prettier/bin/prettier.cjs', [
  '--write',
  '--ignore-unknown',
  '--log-level',
  'warn',
  absolute,
])
if (prettier.status !== 0) {
  problems.push(`Prettier could not format ${rel}:\n${(prettier.stderr || prettier.stdout).trim()}`)
}

// 2. oxlint --fix (uses .oxlintrc.json, including the accessibility rules).
if (LINTABLE.has(extname(absolute))) {
  const oxlint = run('node_modules/oxlint/bin/oxlint', ['--fix', absolute])
  if (oxlint.status !== 0) {
    problems.push(`oxlint found problems in ${rel}:\n${(oxlint.stdout + oxlint.stderr).trim()}`)
  }
}

if (problems.length > 0) {
  process.stderr.write(`${problems.join('\n\n')}\n\nFix these before continuing.\n`)
  process.exit(2)
}
