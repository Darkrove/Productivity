"use server"

import { query } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const noteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
  workspaceId: z.number(),
  color: z.string().optional(),
  category: z.string().optional(),
})

export async function createNote(formData: FormData) {
  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const workspaceId = Number.parseInt(formData.get("workspaceId") as string)
  const color = (formData.get("color") as string) || "default"
  const category = (formData.get("category") as string) || "general"
  const userId = Number.parseInt(formData.get("userId") as string)

  try {
    const validatedFields = noteSchema.parse({
      title,
      content,
      workspaceId,
      color,
      category,
    })

    const result = await query(
      `INSERT INTO notes (title, content, workspace_id, created_by, color, category)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        validatedFields.title,
        validatedFields.content,
        validatedFields.workspaceId,
        userId,
        validatedFields.color,
        validatedFields.category,
      ],
    )

    revalidatePath(`/dashboard/workspace/${workspaceId}/notes`)
    return { success: "Note created successfully", note: result[0] }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }

    return { error: "Failed to create note" }
  }
}

export async function updateNote(formData: FormData) {
  const noteId = Number.parseInt(formData.get("noteId") as string)
  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const workspaceId = Number.parseInt(formData.get("workspaceId") as string)
  const color = formData.get("color") as string
  const category = formData.get("category") as string

  try {
    await query(
      `UPDATE notes 
       SET title = $1, content = $2, color = $3, category = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5`,
      [title, content, color, category, noteId],
    )

    revalidatePath(`/dashboard/workspace/${workspaceId}/notes`)
    return { success: "Note updated successfully" }
  } catch (error) {
    console.error("Error updating note:", error)
    return { error: "Failed to update note" }
  }
}
