require("dotenv").config();

const Hapi = require("@hapi/hapi");
const Jwt = require("@hapi/jwt");
const { closePool } = require("./utils/database");
const config = require("./utils/config");
const TokenManager = require("./tokenize/TokenManager");

const ClientError = require("./exceptions/ClientError");

const albums = require("./api/albums");
const AlbumService = require("./services/postgres/AlbumService");
const AlbumValidator = require("./validator/album");

const songs = require("./api/songs");
const SongService = require("./services/postgres/SongService");
const SongValidator = require("./validator/song");

const users = require("./api/users");
const UserService = require("./services/postgres/UserService");
const UserValidator = require("./validator/user");

const authentications = require("./api/authentications");
const AuthenticationService = require("./services/postgres/AuthenticationService");
const AuthenticationValidator = require("./validator/authentication");

const playlists = require("./api/playlists");
const PlaylistService = require("./services/postgres/PlaylistService");
const PlaylistValidator = require("./validator/playlist");

const init = async () => {
  const albumService = new AlbumService();
  const songService = new SongService();
  const userService = new UserService();
  const authenticationService = new AuthenticationService();
  const playlistService = new PlaylistService();

  const server = Hapi.server({
    port: config.server.port,
    host: config.server.host,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  // External plugin
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  // Authentication strategy
  server.auth.strategy("openmusic_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  // Register Albums
  await server.register({
    plugin: albums,
    options: {
      service: albumService,
      validator: AlbumValidator,
    },
  });

  // Register Songs
  await server.register({
    plugin: songs,
    options: {
      service: songService,
      validator: SongValidator,
    },
  });

  // Register Users
  await server.register({
    plugin: users,
    options: {
      service: userService,
      validator: UserValidator,
    },
  });

  // Register Authentications
  await server.register({
    plugin: authentications,
    options: {
      authenticationService: authenticationService,
      userService: userService,
      tokenManager: TokenManager,
      validator: AuthenticationValidator,
    },
  });

  // Register Playlists
  await server.register({
    plugin: playlists,
    options: {
      service: playlistService,
      validator: PlaylistValidator,
    },
  });

  server.ext("onPreResponse", (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: "fail",
          message: response.message,
        });

        newResponse.code(response.statusCode);
        return newResponse;
      }

      if (!response.isServer) {
        return h.continue;
      }

      const newResponse = h.response({
        status: "error",
        message: "Internal Server Error",
      });

      newResponse.code(500);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server running at ${server.info.uri}`);

  // Graceful shutdown
  process.on("SIGINT", async () => {
    console.log("Shutting down gracefully...");
    await server.stop();
    await closePool();
    process.exit(0);
  });
};

init();
