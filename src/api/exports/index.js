const ExportHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "exports",
  version: "1.0.0",
  register: async (server, { producerService, playlistService, validator }) => {
    const exportHandler = new ExportHandler(
      producerService,
      playlistService,
      validator
    );
    server.route(routes(exportHandler));
  },
};
