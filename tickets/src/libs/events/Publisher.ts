import { KafkaService } from "../KafkaService"
import { Event } from "../models/Event"

export abstract class Publisher<T extends Event> {
  abstract subject: T['subject']
  private kafkaService: KafkaService

  constructor(kafkaService: KafkaService) {
    this.kafkaService = kafkaService
  }

  async publish(data: T['data']) {
    await this.kafkaService.sendMessage(this.subject, JSON.stringify(data))
  }
}