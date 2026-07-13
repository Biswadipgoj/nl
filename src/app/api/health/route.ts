import { NextResponse } from 'next/server'

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || 'NOT SET'
  const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET'
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET (hidden)' : 'NOT SET'
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'NOT SET'

  // Mask password in DB URL for safe display
  const maskedDbUrl = dbUrl.replace(/:([^@]+)@/, ':***@')

  let dbStatus = 'untested'
  try {
    const { Pool } = await import('pg')
    const pool = new Pool({
      connectionString: dbUrl,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000,
    })
    const client = await pool.connect()
    const result = await client.query('SELECT 1 as ok')
    client.release()
    await pool.end()
    dbStatus = result.rows[0]?.ok === 1 ? '✅ Connected successfully' : '❌ Query failed'
  } catch (err: any) {
    dbStatus = `❌ ${err.message}`
  }

  return NextResponse.json({
    env: {
      DATABASE_URL: maskedDbUrl,
      NEXT_PUBLIC_SUPABASE_URL: supaUrl,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: anonKey,
      NEXT_PUBLIC_BASE_URL: baseUrl,
      NODE_ENV: process.env.NODE_ENV,
    },
    database: dbStatus,
    timestamp: new Date().toISOString(),
  }, { status: 200 })
}
