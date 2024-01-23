import { KafkaService } from "../KafkaService"
import { Event } from "../models/Event"

//TODO: Listener and Publsher should receive PubSubService instead of KafkaService. So that we can use any PubSubService we want and to make more easy to test
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