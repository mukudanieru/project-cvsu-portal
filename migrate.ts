import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import { migrate } from 'drizzle-orm/neon-http/migrator'
import { config } from 'dotenv'

config({ path: '.env' })

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql)

async function main() {
  try {
    console.log('Applying migrations...')
    await migrate(db, { migrationsFolder: './drizzle' })
    console.log('Migrations applied successfully!')
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

main()
