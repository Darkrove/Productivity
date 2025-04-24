import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { query } from '@/lib/db';

// Get workspace details
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const workspaceId = Number.parseInt(id);

        // Check if user is a member of the workspace
        const memberCheck = await query(
            `SELECT * FROM workspace_members 
       WHERE workspace_id = $1 AND user_id = $2`,
            [workspaceId, session.user.id]
        );

        if (memberCheck.length === 0) {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        }

        // Get workspace details
        const workspaceResult = await query(
            `SELECT w.*, u.name as owner_name, u.email as owner_email
       FROM workspaces w
       JOIN users u ON w.owner_id = u.id
       WHERE w.id = $1`,
            [workspaceId]
        );

        if (workspaceResult.length === 0) {
            return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
        }

        // Get workspace members
        const membersResult = await query(
            `SELECT u.id, u.name, u.email, u.image, wm.role
       FROM workspace_members wm
       JOIN users u ON wm.user_id = u.id
       WHERE wm.workspace_id = $1`,
            [workspaceId]
        );

        const workspace = workspaceResult[0];
        const members = membersResult;

        return NextResponse.json({ workspace, members });
    } catch (error) {
        console.error('Error fetching workspace:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// Update workspace
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const workspaceId = Number.parseInt(id);
        const body = await req.json();
        const { name } = body;

        if (!name) {
            return NextResponse.json({ error: 'Workspace name is required' }, { status: 400 });
        }

        // Check if user is the owner or admin of the workspace
        const memberCheck = await query(
            `SELECT * FROM workspace_members 
       WHERE workspace_id = $1 AND user_id = $2 AND role IN ('owner', 'admin')`,
            [workspaceId, session.user.id]
        );

        if (memberCheck.length === 0) {
            return NextResponse.json(
                { error: "You don't have permission to update this workspace" },
                { status: 403 }
            );
        }

        // Update workspace
        await query(
            `UPDATE workspaces 
       SET name = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
            [name, workspaceId]
        );

        return NextResponse.json({ success: true, message: 'Workspace updated successfully' });
    } catch (error) {
        console.error('Error updating workspace:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// Delete workspace
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const workspaceId = Number.parseInt(id);

        // Check if user is the owner of the workspace
        const workspaceCheck = await query(
            `SELECT * FROM workspaces 
       WHERE id = $1 AND owner_id = $2`,
            [workspaceId, session.user.id]
        );

        if (workspaceCheck.length === 0) {
            return NextResponse.json(
                { error: "You don't have permission to delete this workspace" },
                { status: 403 }
            );
        }

        // Delete workspace (cascade will delete all related data)
        await query('DELETE FROM workspaces WHERE id = $1', [workspaceId]);

        return NextResponse.json({ success: true, message: 'Workspace deleted successfully' });
    } catch (error) {
        console.error('Error deleting workspace:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
