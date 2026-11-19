import { ArrowRight, Clock } from 'lucide-react'
import { Link, type MetaFunction } from 'react-router'
import { Reveal } from '@components/motion/reveal'
import { Button } from '@components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card'
import { bookingPath, paths } from '@config'
import { services } from '@constants'
import { buildMeta, formatDuration, formatPrice, localBusinessJsonLd } from '@utils'

export const meta: MetaFunction = () =>
  buildMeta({ path: paths.home, jsonLd: [localBusinessJsonLd()] })

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-24 sm:py-32">
        <Reveal>
          <p className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
            Premium car detailing
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="max-w-3xl font-heading text-4xl font-semibold tracking-tight sm:text-6xl">
            Every detail, perfected.
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="max-w-xl text-lg text-muted-foreground">
            Interior, exterior, paint correction and ceramic coating, done by people who obsess over
            the finish.
          </p>
        </Reveal>
        <Reveal delay={0.3} className="flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link to={paths.booking}>
              Book a detail <ArrowRight />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to={paths.contact}>Ask a question</Link>
          </Button>
        </Reveal>
      </section>

      {/* Services */}
      <section aria-labelledby="services-heading" className="border-t bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <Reveal className="flex items-end justify-between gap-4">
            <h2
              id="services-heading"
              className="font-heading text-3xl font-semibold tracking-tight"
            >
              Services
            </h2>
            <Button asChild variant="link" className="px-0">
              <Link to={paths.services}>
                All services <ArrowRight />
              </Link>
            </Button>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => (
              <Reveal key={service.id} delay={index * 0.08} className="h-full">
                <Card className="relative h-full transition-shadow hover:shadow-md">
                  <CardHeader>
                    <CardTitle>
                      <Link to={bookingPath(service.id)} className="after:absolute after:inset-0">
                        {service.name}
                      </Link>
                    </CardTitle>
                    <CardDescription>{service.summary}</CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto flex items-center justify-between text-sm">
                    <span className="font-medium">From {formatPrice(service.startingPrice)}</span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="size-3.5" /> {formatDuration(service.durationMinutes)}
                    </span>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-24 text-center">
        <Reveal className="flex flex-col items-center gap-4">
          <h2 className="font-heading text-3xl font-semibold tracking-tight">
            Ready for that showroom shine?
          </h2>
          <Button asChild size="lg">
            <Link to={paths.booking}>Pick a time slot</Link>
          </Button>
        </Reveal>
      </section>
    </>
  )
}
