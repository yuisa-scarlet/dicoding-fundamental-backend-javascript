require("dotenv").config();
const amqp = require("amqplib");
const PlaylistService = require("./PlaylistService");
const MailSender = require("./MailSender");

const init = async () => {
  const playlistService = new PlaylistService();
  const mailSender = new MailSender();

  try {
    // Connect to RabbitMQ
    const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
    const channel = await connection.createChannel();

    const queue = "export:playlist";

    await channel.assertQueue(queue, {
      durable: true,
    });

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

    channel.consume(queue, async (message) => {
      const content = JSON.parse(message.content.toString());
      const { playlistId, targetEmail } = content;

      console.log(
        " [x] Received export request for playlist %s to %s",
        playlistId,
        targetEmail
      );

      try {
        // Get playlist data
        const playlistData = await playlistService.getPlaylistForExport(
          playlistId
        );

        // Send email
        const result = await mailSender.sendEmail(
          targetEmail,
          JSON.stringify(playlistData, null, 2)
        );

        console.log(" [✓] Export email sent successfully to %s", targetEmail);
        console.log(" [i] Email info:", result.messageId);
      } catch (error) {
        console.error(" [✗] Failed to process export:", error.message);
      }

      // Acknowledge the message
      channel.ack(message);
    });
  } catch (error) {
    console.error("Failed to start consumer:", error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n [!] Shutting down consumer gracefully...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n [!] Received SIGTERM, shutting down...");
  process.exit(0);
});

init();
