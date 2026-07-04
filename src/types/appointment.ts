import { Appointment } from "@prisma/client"

export type AppointmentWithCustomer = Appointment & {
  customer: {
    name: string
    phone: string
  }
}
