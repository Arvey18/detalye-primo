import { useState, type FormEvent } from 'react'
import { useSearchParams, type MetaFunction } from 'react-router'
import { Reveal } from '@components/motion/reveal'
import { Button } from '@components/ui/button'
import { Calendar } from '@components/ui/calendar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select'
import { Textarea } from '@components/ui/textarea'
import { paths } from '@config'
import { getService, services, timeSlots, vehicleTypes } from '@constants'
import { useIsClient } from '@hooks'
import { buildMeta, formatPrice } from '@utils'

interface Booking {
  serviceId: string
  vehicleType: string
  date?: Date
  time: string
  name: string
  phone: string
  notes: string
}

const emptyBooking: Booking = {
  serviceId: '',
  vehicleType: '',
  date: undefined,
  time: '',
  name: '',
  phone: '',
  notes: '',
}

function startOfToday() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
}

export const meta: MetaFunction = () =>
  buildMeta({
    title: 'Book a Detail',
    description:
      'Book your car detailing online. Pick a service, your vehicle type and a time slot that works for you.',
    path: paths.booking,
  })

export default function BookingPage() {
  const isClient = useIsClient()
  const [searchParams] = useSearchParams()
  const [booking, setBooking] = useState<Booking>(emptyBooking)
  const [error, setError] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  // Preselect the service from a "Book this" link (/booking?service=ceramic).
  // The page is prerendered without a query string, so this only applies after
  // hydration to keep the server HTML and first client render identical.
  const preselectedId = isClient ? (getService(searchParams.get('service'))?.id ?? '') : ''
  const serviceId = booking.serviceId || preselectedId

  const update = <K extends keyof Booking>(key: K, value: Booking[K]) =>
    setBooking((current) => ({ ...current, [key]: value }))

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!serviceId || !booking.vehicleType || !booking.date || !booking.time) {
      setError('Please choose a service, vehicle type, date and time.')
      return
    }
    setError(null)
    // TODO: persist booking via backend.
    setConfirmed(true)
  }

  const selectedService = getService(serviceId)

  if (confirmed && selectedService && booking.date) {
    return (
      <section className="mx-auto max-w-xl px-4 py-24">
        <Reveal>
          <Card>
            <CardHeader>
              <CardTitle>Booking request received</CardTitle>
              <CardDescription>We&apos;ll contact you to confirm your appointment.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-1 text-sm">
              <p>
                <strong>{selectedService.name}</strong> for your {booking.vehicleType}
              </p>
              <p>
                {booking.date.toLocaleDateString(undefined, { dateStyle: 'full' })} at{' '}
                {booking.time}
              </p>
            </CardContent>
          </Card>
        </Reveal>
      </section>
    )
  }

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 py-20">
        <Reveal>
          <h1 className="font-heading text-4xl font-semibold tracking-tight">Book a detail</h1>
          <p className="mt-2 text-muted-foreground">
            Choose your service and a time that works for you.
          </p>
        </Reveal>

        <form
          onSubmit={handleSubmit}
          aria-label="Booking form"
          className="mt-10 grid gap-10 lg:grid-cols-2"
          noValidate
        >
          <Reveal delay={0.1} className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="booking-service">Service</Label>
              <Select value={serviceId} onValueChange={(value) => update('serviceId', value)}>
                <SelectTrigger id="booking-service" className="w-full">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} — from {formatPrice(service.startingPrice)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="booking-vehicle">Vehicle type</Label>
              <Select
                value={booking.vehicleType}
                onValueChange={(value) => update('vehicleType', value)}
              >
                <SelectTrigger id="booking-vehicle" className="w-full">
                  <SelectValue placeholder="Select your vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {vehicleTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="booking-name">Name</Label>
              <Input
                id="booking-name"
                autoComplete="name"
                value={booking.name}
                onChange={(event) => update('name', event.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="booking-phone">Phone</Label>
              <Input
                id="booking-phone"
                type="tel"
                autoComplete="tel"
                value={booking.phone}
                onChange={(event) => update('phone', event.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="booking-notes">Notes (optional)</Label>
              <Textarea
                id="booking-notes"
                rows={3}
                value={booking.notes}
                onChange={(event) => update('notes', event.target.value)}
              />
            </div>
          </Reveal>

          <Reveal delay={0.2} className="flex flex-col gap-6">
            <fieldset className="grid gap-2">
              <legend className="mb-2 text-sm font-medium">Date</legend>
              {/* Built around the visitor's "today", so it renders after hydration only. */}
              {isClient ? (
                <Calendar
                  mode="single"
                  selected={booking.date}
                  onSelect={(date) => update('date', date)}
                  disabled={{ before: startOfToday() }}
                  className="rounded-lg border"
                />
              ) : (
                <div
                  aria-hidden
                  className="h-[296px] w-[250px] animate-pulse rounded-lg border bg-muted/40"
                />
              )}
            </fieldset>

            <fieldset className="grid gap-2">
              <legend className="mb-2 text-sm font-medium">Time</legend>
              <div className="flex flex-wrap gap-2">
                {timeSlots.map((slot) => (
                  <Button
                    key={slot}
                    type="button"
                    variant={booking.time === slot ? 'default' : 'outline'}
                    aria-pressed={booking.time === slot}
                    onClick={() => update('time', slot)}
                    className="min-w-20"
                  >
                    {slot}
                  </Button>
                ))}
              </div>
            </fieldset>

            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" className="self-start">
              Request booking
            </Button>
          </Reveal>
        </form>
      </section>
    </>
  )
}
