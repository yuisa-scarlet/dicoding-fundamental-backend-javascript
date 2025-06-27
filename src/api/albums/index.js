const AlbumHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "albums",
  version: "1.0.0",
  register: async (
    server,
    { service, validator, storageService, cacheService }
  ) => {
    const albumHandler = new AlbumHandler(
      service,
      validator,
      storageService,
      cacheService
    );
    server.route(routes(albumHandler));
  },
};
