require("dotenv").config();

const config = {
  server: {
    port: process.env.PORT || 5000,
    host: process.env.HOST || "localhost",
  },
  database: {
    host: process.env.PGHOST || "localhost",
    port: process.env.PGPORT || 5432,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
  },
};

module.exports = config;
