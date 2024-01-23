import { KafkaService } from "../KafkaService"
import { Event } from "../models/Event"

export abstract class Listener<T extends Event> {
  abstract subject: T['subject']
  abstract onMessage(data: T['data'], message: any): void
  private kafkaService: KafkaService

  constructor(kafkaService: KafkaService) {
    this.kafkaService = kafkaService
  }

  async subscribe() {
    await this.kafkaService.consumeMessage(this.subject, (message) => {
      this.onMessage(JSON.parse(message.value), message)
    })
  }

  async publish(data: T['data']) {
    await this.kafkaService.sendMessage(this.subject, JSON.stringify(data))
  }
}