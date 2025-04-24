import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { query } from '@/lib/db';

// Get note details
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const noteId = Number.parseInt(id);

        // Get note details
        const noteResult = await query(
            `SELECT n.*, w.name as workspace_name, u.name as creator_name, u.image as creator_image 
       FROM notes n
       JOIN workspaces w ON n.workspace_id = w.id
       JOIN users u ON n.created_by = u.id
       WHERE n.id = $1`,
            [noteId]
        );

        if (noteResult.length === 0) {
            return NextResponse.json({ error: 'Note not found' }, { status: 404 });
        }

        const note = noteResult[0];

        // Check if user is a member of the workspace
        const memberCheck = await query(
            `SELECT * FROM workspace_members 
       WHERE workspace_id = $1 AND user_id = $2`,
            [note.workspace_id, session.user.id]
        );

        if (memberCheck.length === 0) {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        }

        return NextResponse.json(note);
    } catch (error) {
        console.error('Error fetching note:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// Update note
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const noteId = Number.parseInt(id);
        const body = await req.json();
        const { title, content, color, category } = body;

        // Get note details to check permissions
        const noteResult = await query('SELECT * FROM notes WHERE id = $1', [noteId]);

        if (noteResult.length === 0) {
            return NextResponse.json({ error: 'Note not found' }, { status: 404 });
        }

        const note = noteResult[0];

        // Check if user is a member of the workspace
        const memberCheck = await query(
            `SELECT * FROM workspace_members 
       WHERE workspace_id = $1 AND user_id = $2`,
            [note.workspace_id, session.user.id]
        );

        if (memberCheck.length === 0) {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        }

        // Update note
        await query(
            `UPDATE notes 
       SET title = COALESCE($1, title), 
           content = COALESCE($2, content), 
           color = COALESCE($3, color), 
           category = COALESCE($4, category),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5`,
            [title, content, color, category, noteId]
        );

        return NextResponse.json({ success: true, message: 'Note updated successfully' });
    } catch (error) {
        console.error('Error updating note:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// Delete note
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const noteId = Number.parseInt(id);

        // Get note details to check permissions
        const noteResult = await query('SELECT * FROM notes WHERE id = $1', [noteId]);

        if (noteResult.length === 0) {
            return NextResponse.json({ error: 'Note not found' }, { status: 404 });
        }

        const note = noteResult[0];

        // Check if user is a member of the workspace
        const memberCheck = await query(
            `SELECT * FROM workspace_members 
       WHERE workspace_id = $1 AND user_id = $2`,
            [note.workspace_id, session.user.id]
        );

        if (memberCheck.length === 0) {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        }

        // Delete note
        await query('DELETE FROM notes WHERE id = $1', [noteId]);

        return NextResponse.json({ success: true, message: 'Note deleted successfully' });
    } catch (error) {
        console.error('Error deleting note:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
