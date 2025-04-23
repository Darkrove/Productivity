"use server"

import { query } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  workspaceId: z.number(),
  dueDate: z.string().optional().nullable(),
  duration: z.number().optional().nullable(),
  assignedTo: z.number().optional().nullable(),
  priority: z.string().optional(),
  status: z.string().optional(),
})

export async function createTask(formData: FormData) {
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const workspaceId = Number.parseInt(formData.get("workspaceId") as string)
  const dueDate = (formData.get("dueDate") as string) || null
  const duration = formData.get("duration") ? Number.parseInt(formData.get("duration") as string) : null
  const assignedTo = formData.get("assignedTo") ? Number.parseInt(formData.get("assignedTo") as string) : null
  const priority = (formData.get("priority") as string) || "medium"
  const userId = Number.parseInt(formData.get("userId") as string)

  try {
    const validatedFields = taskSchema.parse({
      title,
      description,
      workspaceId,
      dueDate,
      duration,
      assignedTo,
      priority,
    })

    const result = await query(
      `INSERT INTO tasks (title, description, workspace_id, created_by, assigned_to, due_date, duration, priority)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        validatedFields.title,
        validatedFields.description,
        validatedFields.workspaceId,
        userId,
        validatedFields.assignedTo,
        validatedFields.dueDate,
        validatedFields.duration,
        validatedFields.priority,
      ],
    )

    revalidatePath(`/dashboard/workspace/${workspaceId}`)
    return { success: "Task created successfully", task: result[0] }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }

    return { error: "Failed to create task" }
  }
}

export async function updateTaskStatus(formData: FormData) {
  const taskId = Number.parseInt(formData.get("taskId") as string)
  const status = formData.get("status") as string
  const workspaceId = Number.parseInt(formData.get("workspaceId") as string)

  try {
    await query(
      `UPDATE tasks SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [status, taskId],
    )

    revalidatePath(`/dashboard/workspace/${workspaceId}`)
    return { success: "Task status updated" }
  } catch (error) {
    console.error("Error updating task status:", error)
    return { error: "Failed to update task status" }
  }
}
