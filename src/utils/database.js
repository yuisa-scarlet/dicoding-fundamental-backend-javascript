const { Pool } = require("pg");
const config = require("./config");

let pool = null;

const getPool = () => {
  if (!pool) {
    pool = new Pool(config.database);
  }
  return pool;
};

const closePool = async () => {
  if (pool) {
    await pool.end();
    pool = null;
  }
};

module.exports = { getPool, closePool };
