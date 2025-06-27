require("dotenv").config();
const ConsumerService = require("./src/services/rabbitmq/ConsumerService");
const MailSender = require("./src/services/rabbitmq/MailSender");
const PlaylistService = require("./src/services/postgres/PlaylistService");

const init = async () => {
  const consumerService = new ConsumerService();
  const mailSender = new MailSender();
  const playlistService = new PlaylistService();

  try {
    await consumerService.init();
    console.log("Consumer service initialized");

    await consumerService.consumeMessage("export:playlist", async (message) => {
      try {
        const { playlistId, targetEmail } = JSON.parse(
          message.content.toString()
        );

        console.log(
          `Processing export for playlist ${playlistId} to ${targetEmail}`
        );

        const playlistData = await playlistService.getPlaylistForExport(
          playlistId
        );

        const result = await mailSender.sendEmail(
          targetEmail,
          JSON.stringify(playlistData, null, 2)
        );

        console.log("Export email sent successfully:", result);
      } catch (error) {
        console.error("Failed to process export message:", error);
      }
    });

    console.log("Consumer is waiting for messages...");
  } catch (error) {
    console.error("Failed to initialize consumer:", error);
    process.exit(1);
  }
};

init();

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down consumer...");
  process.exit(0);
});
