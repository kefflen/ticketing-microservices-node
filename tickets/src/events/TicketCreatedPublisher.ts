import { Publisher } from "../libs/events/Publisher"
import { TicketCreatedEvent } from "../libs/events/TicketCreatedEvent"
import { Subjects } from "../libs/events/subjects"

export class TicketCreatedPulbisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated
}