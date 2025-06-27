const amqp = require("amqplib");

class ProducerService {
  constructor() {
    this._connection = null;
    this._channel = null;
  }

  async init() {
    try {
      const rabbitmqServer = process.env.RABBITMQ_SERVER;
      this._connection = await amqp.connect(rabbitmqServer);
      this._channel = await this._connection.createChannel();

      await this._channel.assertQueue("export:playlist", {
        durable: true,
      });
    } catch (error) {
      console.error("Failed to initialize RabbitMQ:", error);
      throw error;
    }
  }

  async sendMessage(queue, message) {
    try {
      if (!this._channel) {
        await this.init();
      }

      return this._channel.sendToQueue(queue, Buffer.from(message), {
        persistent: true,
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      throw error;
    }
  }

  async close() {
    try {
      if (this._channel) {
        await this._channel.close();
      }
      if (this._connection) {
        await this._connection.close();
      }
    } catch (error) {
      console.error("Failed to close RabbitMQ connection:", error);
    }
  }
}

module.exports = ProducerService;
