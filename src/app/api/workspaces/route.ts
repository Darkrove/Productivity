import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const workspaces = await query(
            `SELECT w.* FROM workspaces w
       JOIN workspace_members wm ON w.id = wm.workspace_id
       WHERE wm.user_id = $1
       ORDER BY w.created_at DESC`,
            [session.user.id]
        );

        return NextResponse.json(workspaces);
    } catch (error) {
        console.error('Error fetching workspaces:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { name } = body;

        if (!name) {
            return NextResponse.json({ error: 'Workspace name is required' }, { status: 400 });
        }

        // Create workspace
        const workspaceResult = await query(
            `INSERT INTO workspaces (name, owner_id)
       VALUES ($1, $2)
       RETURNING *`,
            [name, session.user.id]
        );

        const workspace = workspaceResult[0];

        // Add creator as workspace member with owner role
        await query(
            `INSERT INTO workspace_members (workspace_id, user_id, role)
       VALUES ($1, $2, $3)`,
            [workspace.id, session.user.id, 'owner']
        );

        return NextResponse.json(workspace);
    } catch (error) {
        console.error('Error creating workspace:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
