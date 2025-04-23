"use server"

import { hash } from "bcrypt"
import { query } from "@/lib/db"
import { redirect } from "next/navigation"
import { z } from "zod"

const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  
  try {
    const validatedFields = userSchema.parse({
      name,
      email,
      password,
    })
    
    // Check if user already exists
    const existingUser = await query("SELECT * FROM users WHERE email = $1", [validatedFields.email])
    
    if (existingUser.length > 0) {
      return { error: "User with this email already exists" }
    }

    // Hash password
    const hashedPassword = await hash(validatedFields.password, 10)

    // Create user
    await query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3)", [
      validatedFields.name,
      validatedFields.email,
      hashedPassword,
    ])

    return { success: "User registered successfully" }
  } catch (error) {
    console.log("Error creating new user", error)
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }

    return { error: "Something went wrong. Please try again." }
  }
}

export async function createWorkspace(formData: FormData) {
  const name = formData.get("name") as string
  const userId = formData.get("userId") as string

  if (!name || !userId) {
    return { error: "Workspace name and user ID are required" }
  }

  try {
    // Create workspace
    const workspaceResult = await query(
      `INSERT INTO workspaces (name, owner_id)
       VALUES ($1, $2)
       RETURNING *`,
      [name, userId],
    )

    const workspace = workspaceResult[0]

    // Add creator as workspace member with owner role
    await query(
      `INSERT INTO workspace_members (workspace_id, user_id, role)
       VALUES ($1, $2, $3)`,
      [workspace.id, userId, "owner"],
    )

    redirect(`/dashboard/workspace/${workspace.id}`)
  } catch (error) {
    console.error("Error creating workspace:", error)
    return { error: "Failed to create workspace" }
  }
}
