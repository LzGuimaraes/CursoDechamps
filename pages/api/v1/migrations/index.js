import migrationRunner from "node-pg-migrate";
import { join } from "node:path";

export default async function migrations(request, response) {
  const defaultMigrationOptions = {
    databaseUrl: process.env.DATABASE_URL,
    dryRun: true,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  if (request.method === "GET") {
    const pendingmigrations = await migrationRunner(defaultMigrationOptions);
    return response.status(200).json(pendingmigrations);
  }

  if (request.method === "POST") {
    const migrateMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dryRun: false,
    });

    if (migrateMigrations.length > 0) {
      return response.status(201).json(migrateMigrations);
    }
    return response.status(200).json(migrateMigrations);
  }

  response.status(405).end();
}
