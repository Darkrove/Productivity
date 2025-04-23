import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

// Create a SQL client with the connection string
export const sql = neon(process.env.DATABASE_URL!)

// Create a drizzle client
export const db = drizzle(sql)

// Helper function for SQL queries
export async function query(sqlText: string, params: any[] = []) {
  try {
    return await sql.query(sqlText, params)
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}