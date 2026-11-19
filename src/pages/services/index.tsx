import { Check, Clock } from 'lucide-react'
import { Link, type MetaFunction } from 'react-router'
import { Reveal } from '@components/motion/reveal'
import { Button } from '@components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@components/ui/card'
import { bookingPath, paths } from '@config'
import { services } from '@constants'
import { buildMeta, formatDuration, formatPrice, serviceCatalogJsonLd } from '@utils'

export const meta: MetaFunction = () =>
  buildMeta({
    title: 'Services',
    description:
      'Exterior and interior detailing, full details and ceramic coating. See what each package includes, how long it takes and starting prices.',
    path: paths.services,
    jsonLd: [serviceCatalogJsonLd(services)],
  })

export default function ServicesPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 py-20">
        <Reveal>
          <h1 className="font-heading text-4xl font-semibold tracking-tight">Services</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            From a quick refresh to full paint protection. Prices vary by vehicle size and
            condition; the final quote is confirmed before we start.
          </p>
        </Reveal>

        <ul className="mt-12 grid gap-6 md:grid-cols-2">
          {services.map((service, index) => (
            <li key={service.id} className="h-full">
              <Reveal delay={index * 0.08} className="h-full">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-xl">
                      <h2>{service.name}</h2>
                    </CardTitle>
                    <CardDescription>{service.summary}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <ul className="grid gap-2 text-sm">
                      {service.includes.map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <Check className="size-4 text-muted-foreground" aria-hidden />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="mt-auto flex items-center justify-between gap-4">
                    <div className="text-sm">
                      <p className="font-medium">From {formatPrice(service.startingPrice)}</p>
                      <p className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="size-3.5" aria-hidden />
                        {formatDuration(service.durationMinutes)}
                      </p>
                    </div>
                    <Button asChild>
                      <Link to={bookingPath(service.id)} aria-label={`Book ${service.name}`}>
                        Book this
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
