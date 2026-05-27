#!/usr/bin/env node
import fs from 'fs';
import { Client } from 'pg';

async function main() {
  const sqlPath = process.argv[2];
  if (!sqlPath) {
    console.error('Usage: node apply_migration.js path/to/migration.sql');
    process.exit(1);
  }

  const dbUrl = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('Please set SUPABASE_DB_URL or DATABASE_URL environment variable with your Postgres connection string.');
    process.exit(1);
  }

  const sql = fs.readFileSync(sqlPath, 'utf-8');

  const client = new Client({ connectionString: dbUrl });
  try {
    await client.connect();
    console.log('Connected to database, executing migration:', sqlPath);
    await client.query(sql);
    console.log('Migration executed successfully.');
  } catch (err) {
    console.error('Error running migration:', err);
    process.exitCode = 2;
  } finally {
    await client.end();
  }
}

main();
