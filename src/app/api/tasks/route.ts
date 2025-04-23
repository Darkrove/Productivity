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

    const tasks = await query(
      `SELECT t.*, u.name as assigned_to_name, u.image as assigned_to_image 
       FROM tasks t
       LEFT JOIN users u ON t.assigned_to = u.id
       WHERE t.workspace_id = $1
       ORDER BY t.created_at DESC`,
      [workspaceId],
    )

    return NextResponse.json(tasks)
  } catch (error) {
    console.error("Error fetching tasks:", error)
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
    const { title, description, workspaceId, dueDate, duration, assignedTo, priority } = body

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
      `INSERT INTO tasks (title, description, workspace_id, created_by, assigned_to, due_date, duration, priority)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [title, description, workspaceId, session.user.id, assignedTo, dueDate, duration, priority],
    )

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating task:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
