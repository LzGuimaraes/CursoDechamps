import { Client } from "pg";

async function query(queryObjetct) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValues(),
  });

  try {
    await client.connect();
    const result = await client.query(queryObjetct);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await client.end();
  }
}

export default {
  query: query,
};

function getSSLValues() {
  if (process.env.PORSGRES_CA) {
    return {
      cs: process.env.PORSGRES_CA,
    };
  }

  return process.env.NODE_ENV === "prouction" ? true : false;
}
