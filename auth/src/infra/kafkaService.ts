import { Kafka, Producer, Consumer } from "kafkajs"

//TODO: create a monorepo so that kafkaService can be imported as a lib from the monorepo
class KafkaService {
  private kafka: Kafka
  private producer: Producer
  private consumer: Consumer

  constructor() {
    this.kafka = new Kafka({
      clientId: 'auth-service',
      brokers: ['localhost:9092'],
    })

    this.producer = this.kafka.producer()
    this.consumer = this.kafka.consumer({ groupId: 'auth-service-group' })
  }

  async connect() {
    await Promise.all([
      this.producer.connect(),
      this.consumer.connect()
    ])
  }

  async disconnect() {
    await Promise.all([
      this.producer.disconnect(),
      this.consumer.disconnect()
    ])
  }

  async sendMessage(topic: string, message: string) {
    await this.producer.send({
      topic,
      messages: [{ value: message }],
    })
  }

  async consumeMessage(topic: string, callback: (message: any) => void) {
    await this.consumer.subscribe({ topic, fromBeginning: true })

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        callback(message)
      },
    })
  }
}

export const kafkaService = new KafkaService()