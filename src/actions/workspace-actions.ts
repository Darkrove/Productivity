'use server';

import { query } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { randomBytes } from 'crypto';

const workspaceSchema = z.object({
    name: z.string().min(1, 'Workspace name is required'),
});

export async function createWorkspace(formData: FormData) {
    const name = formData.get('name') as string;
    const userId = formData.get('userId') as string;

    if (!name || !userId) {
        return { error: 'Workspace name and user ID are required' };
    }

    try {
        // Create workspace
        const workspaceResult = await query(
            `INSERT INTO workspaces (name, owner_id)
         VALUES ($1, $2)
         RETURNING *`,
            [name, userId]
        );

        const workspace = workspaceResult[0];

        // Add creator as workspace member with owner role
        await query(
            `INSERT INTO workspace_members (workspace_id, user_id, role)
         VALUES ($1, $2, $3)`,
            [workspace.id, userId, 'owner']
        );

        redirect(`/dashboard/workspace/${workspace.id}`);
    } catch (error) {
        console.error('Error creating workspace:', error);
        return { error: 'Failed to create workspace' };
    }
}

export async function updateWorkspace(formData: FormData) {
    const workspaceId = Number.parseInt(formData.get('workspaceId') as string);
    const name = formData.get('name') as string;
    const userId = Number.parseInt(formData.get('userId') as string);

    try {
        const validatedFields = workspaceSchema.parse({
            name,
        });

        // Check if user has permission to update workspace
        const memberCheck = await query(
            `SELECT * FROM workspace_members 
       WHERE workspace_id = $1 AND user_id = $2 AND role IN ('owner', 'admin')`,
            [workspaceId, userId]
        );

        if (memberCheck.length === 0) {
            return { error: "You don't have permission to update this workspace" };
        }

        // Update workspace
        await query(
            `UPDATE workspaces 
       SET name = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
            [validatedFields.name, workspaceId]
        );

        revalidatePath(`/dashboard/workspace/${workspaceId}`);
        revalidatePath('/dashboard');
        return { success: 'Workspace updated successfully' };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { error: error.errors[0].message };
        }

        return { error: 'Failed to update workspace' };
    }
}

export async function deleteWorkspace(formData: FormData) {
    const workspaceId = Number.parseInt(formData.get('workspaceId') as string);
    const userId = Number.parseInt(formData.get('userId') as string);

    try {
        // Check if user is the owner of the workspace
        const workspaceCheck = await query(
            `SELECT * FROM workspaces 
       WHERE id = $1 AND owner_id = $2`,
            [workspaceId, userId]
        );

        if (workspaceCheck.length === 0) {
            return { error: "You don't have permission to delete this workspace" };
        }

        // Delete workspace (cascade will delete all related data)
        await query('DELETE FROM workspaces WHERE id = $1', [workspaceId]);

        revalidatePath('/dashboard');
        redirect('/dashboard');
    } catch (error) {
        console.error('Error deleting workspace:', error);
        return { error: 'Failed to delete workspace' };
    }
}

export async function inviteMember(formData: FormData) {
    const workspaceId = Number.parseInt(formData.get('workspaceId') as string);
    const email = formData.get('email') as string;
    const userId = Number.parseInt(formData.get('userId') as string);

    try {
        if (!email) {
            return { error: 'Email is required' };
        }

        // Check if user has permission to invite members
        const memberCheck = await query(
            `SELECT * FROM workspace_members 
       WHERE workspace_id = $1 AND user_id = $2 AND role IN ('owner', 'admin')`,
            [workspaceId, userId]
        );

        if (memberCheck.length === 0) {
            return { error: "You don't have permission to invite members" };
        }

        // Check if user already exists
        const userResult = await query('SELECT * FROM users WHERE email = $1', [email]);
        const user = userResult[0];

        // Check if invitation already exists
        const existingInvitation = await query(
            "SELECT * FROM workspace_invitations WHERE workspace_id = $1 AND email = $2 AND status = 'pending'",
            [workspaceId, email]
        );

        if (existingInvitation.length > 0) {
            return { error: 'Invitation already sent to this email' };
        }

        // If user exists and is already a member, return error
        if (user) {
            const existingMember = await query(
                'SELECT * FROM workspace_members WHERE workspace_id = $1 AND user_id = $2',
                [workspaceId, user.id]
            );

            if (existingMember.length > 0) {
                return { error: 'User is already a member of this workspace' };
            }
        }

        // Get workspace details
        const workspaceResult = await query('SELECT * FROM workspaces WHERE id = $1', [
            workspaceId,
        ]);
        const workspace = workspaceResult[0];

        // Get inviter details
        const inviterResult = await query('SELECT * FROM users WHERE id = $1', [userId]);
        const inviter = inviterResult[0];

        // Generate invitation token
        const token = randomBytes(32).toString('hex');

        // Create invitation
        await query(
            `INSERT INTO workspace_invitations (workspace_id, email, invited_by, token, status)
       VALUES ($1, $2, $3, $4, 'pending')`,
            [workspaceId, email, userId, token]
        );

        // In a real app, you would send an email here
        // For now, we'll just return success
        revalidatePath(`/dashboard/workspace/${workspaceId}/team`);
        return { success: 'Invitation sent successfully' };
    } catch (error) {
        console.error('Error inviting member:', error);
        return { error: 'Failed to send invitation' };
    }
}

// Get all work spaces
export async function getWorkspaces(userId: number) {
    try {
        const workspaces = await query(
            `SELECT w.* FROM workspaces w
       JOIN workspace_members wm ON w.id = wm.workspace_id
       WHERE wm.user_id = $1
       ORDER BY w.created_at DESC`,
            [userId]
        );

        return { workspaces };
    } catch (error) {
        console.error('Error fetching workspaces:', error);
        return { error: 'Failed to fetch workspaces' };
    }
}
