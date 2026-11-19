export type ServiceId = 'exterior' | 'interior' | 'full-detail' | 'ceramic'

export interface Service {
  id: ServiceId
  name: string
  summary: string
  includes: string[]
  durationMinutes: number
  startingPrice: number
}

// Placeholder catalog — replace names, prices and durations with the real menu.
export const services: Service[] = [
  {
    id: 'exterior',
    name: 'Exterior Detail',
    summary: 'Hand wash, decontamination, wheels, tires and a protective sealant.',
    includes: [
      'Foam pre-wash and hand wash',
      'Clay bar decontamination',
      'Wheels and tires',
      'Paint sealant',
    ],
    durationMinutes: 120,
    startingPrice: 1500,
  },
  {
    id: 'interior',
    name: 'Interior Detail',
    summary: 'Deep vacuum, shampoo, leather care and full cabin sanitizing.',
    includes: [
      'Deep vacuum',
      'Seat and carpet shampoo',
      'Leather clean and condition',
      'Cabin sanitizing',
    ],
    durationMinutes: 150,
    startingPrice: 1800,
  },
  {
    id: 'full-detail',
    name: 'Full Detail',
    summary: 'The complete inside-and-out treatment for a showroom finish.',
    includes: [
      'Everything in Exterior Detail',
      'Everything in Interior Detail',
      'Engine bay wipe-down',
    ],
    durationMinutes: 240,
    startingPrice: 3000,
  },
  {
    id: 'ceramic',
    name: 'Ceramic Coating',
    summary: 'Paint correction plus long-lasting ceramic protection and gloss.',
    includes: [
      'Single-stage paint correction',
      'Ceramic coating application',
      'Wheel and glass coating',
    ],
    durationMinutes: 480,
    startingPrice: 12000,
  },
]

export const vehicleTypes = ['Sedan', 'Hatchback', 'SUV', 'Pickup', 'Van'] as const
export type VehicleType = (typeof vehicleTypes)[number]

export const timeSlots = ['08:00', '10:00', '13:00', '15:00'] as const

export function getService(id: string | null | undefined): Service | undefined {
  return services.find((service) => service.id === id)
}
