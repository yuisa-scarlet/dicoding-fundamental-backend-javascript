const amqp = require("amqplib");

class ConsumerService {
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
      console.error("Failed to initialize RabbitMQ consumer:", error);
      throw error;
    }
  }

  async consumeMessage(queue, callback) {
    try {
      if (!this._channel) {
        await this.init();
      }

      await this._channel.consume(queue, callback, { noAck: true });
    } catch (error) {
      console.error("Failed to consume message:", error);
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
      console.error("Failed to close RabbitMQ consumer connection:", error);
    }
  }
}

module.exports = ConsumerService;
