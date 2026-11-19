import { Mail, MapPin, Phone } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import type { MetaFunction } from 'react-router'
import { Reveal } from '@components/motion/reveal'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import { Textarea } from '@components/ui/textarea'
import { paths, siteConfig } from '@config'
import { buildMeta } from '@utils'

export const meta: MetaFunction = () =>
  buildMeta({
    title: 'Contact Us',
    description: `Questions about car detailing, pricing or your vehicle? Call, email or message ${siteConfig.name}.`,
    path: paths.contact,
  })

// Contact details live in src/config/site.ts.
const contactDetails = [
  { icon: Phone, label: 'Phone', value: siteConfig.contact.phone },
  { icon: Mail, label: 'Email', value: siteConfig.contact.email },
  { icon: MapPin, label: 'Shop', value: siteConfig.contact.address },
]

export default function ContactPage() {
  const [sent, setSent] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // TODO: send to backend / email service.
    setSent(true)
  }

  return (
    <>
      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-20 lg:grid-cols-2">
        <Reveal className="flex flex-col gap-6">
          <h1 className="font-heading text-4xl font-semibold tracking-tight">Contact us</h1>
          <p className="text-muted-foreground">
            Questions about a service, pricing or your vehicle? Send us a message and we&apos;ll get
            back to you.
          </p>
          <ul className="flex flex-col gap-4">
            {contactDetails.map(({ icon: Icon, label, value }) => (
              <li key={label} className="flex items-center gap-3">
                <Icon className="size-5 text-muted-foreground" aria-hidden />
                <span className="sr-only">{label}:</span>
                {value}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          {sent ? (
            <output className="block rounded-lg border p-6">
              Thanks! Your message has been sent. We&apos;ll reply soon.
            </output>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" aria-label="Contact form">
              <div className="grid gap-2">
                <Label htmlFor="contact-name">Name</Label>
                <Input id="contact-name" name="name" required autoComplete="name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact-email">Email</Label>
                <Input id="contact-email" name="email" type="email" required autoComplete="email" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact-message">Message</Label>
                <Textarea id="contact-message" name="message" required rows={5} />
              </div>
              <Button type="submit" className="self-start">
                Send message
              </Button>
            </form>
          )}
        </Reveal>
      </section>
    </>
  )
}
