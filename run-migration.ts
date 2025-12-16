import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function runMigration() {
  const client = await pool.connect();
  try {
    console.log('Reading migration file...');
    
    // Correct folder name with hyphen
    const migrationsDir = path.join(process.cwd(), 'better-auth_migrations');
    
    console.log('Looking in:', migrationsDir);
    
    // Check if directory exists
    if (!fs.existsSync(migrationsDir)) {
      console.error('❌ better-auth_migrations folder not found');
      console.log('Current directory:', process.cwd());
      return;
    }
    
    // Find all SQL files
    const files = fs.readdirSync(migrationsDir);
    console.log('Found files:', files);
    
    const sqlFile = files.find(f => f.endsWith('.sql'));
    
    if (!sqlFile) {
      console.error('❌ No SQL file found in better-auth_migrations folder');
      return;
    }
    
    console.log('Using migration file:', sqlFile);
    const sql = fs.readFileSync(path.join(migrationsDir, sqlFile), 'utf8');
    
    console.log('Running migration...');
    await client.query(sql);
    
    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Error running migration:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();