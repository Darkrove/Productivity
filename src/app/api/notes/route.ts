import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { query } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const workspaceId = searchParams.get("workspaceId")
    const category = searchParams.get("category")

    if (!workspaceId) {
      return NextResponse.json({ error: "Workspace ID is required" }, { status: 400 })
    }

    // Check if user is a member of the workspace
    const memberCheck = await query(
      `SELECT * FROM workspace_members 
       WHERE workspace_id = $1 AND user_id = $2`,
      [workspaceId, session.user.id],
    )

    if (memberCheck.length === 0) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    let sql = `
      SELECT n.*, u.name as creator_name, u.image as creator_image 
      FROM notes n
      JOIN users u ON n.created_by = u.id
      WHERE n.workspace_id = $1
    `

    const params = [workspaceId]

    if (category) {
      sql += ` AND n.category = $2`
      params.push(category)
    }

    sql += ` ORDER BY n.created_at DESC`

    const notes = await query(sql, params)

    return NextResponse.json(notes)
  } catch (error) {
    console.error("Error fetching notes:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { title, content, workspaceId, color, category } = body

    if (!title || !workspaceId) {
      return NextResponse.json({ error: "Title and workspace ID are required" }, { status: 400 })
    }

    // Check if user is a member of the workspace
    const memberCheck = await query(
      `SELECT * FROM workspace_members 
       WHERE workspace_id = $1 AND user_id = $2`,
      [workspaceId, session.user.id],
    )

    if (memberCheck.length === 0) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const result = await query(
      `INSERT INTO notes (title, content, workspace_id, created_by, color, category)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title, content, workspaceId, session.user.id, color, category],
    )

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating note:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
