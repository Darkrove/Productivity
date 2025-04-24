import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { query } from '@/lib/db';
import { DashboardHeader } from '@/components/dashboard-header';
import { NoteCard, NoteCardProps } from '@/components/note-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Note = {
    id: number;
    title: string;
    content: string | null;
    color: string;
    category: string;
    created_by: number;
    creator_name: string;
    creator_image: string | null;
    created_at: string;
    workspace_id: number;
    workspace_name: string;
};

export default async function AllNotesPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/login');
    }

    const userId = Number.parseInt(session.user.id);

    // Get all notes from workspaces the user is a member of
    const notesResult = await query(
        `SELECT n.*, w.name as workspace_name, u.name as creator_name, u.image as creator_image 
     FROM notes n
     JOIN workspaces w ON n.workspace_id = w.id
     JOIN workspace_members wm ON w.id = wm.workspace_id
     JOIN users u ON n.created_by = u.id
     WHERE wm.user_id = $1
     ORDER BY n.created_at DESC`,
        [userId]
    );

    const notes = notesResult as Note[];

    // Filter notes by category
    const allNotes = notes;
    const importantNotes = notes.filter(note => note.category === 'important');
    const todoNotes = notes.filter(note => note.category === 'todo');

    return (
        <div className="flex flex-col gap-4">
            <DashboardHeader
                heading="All Notes"
                text={`${notes.length} note${notes.length !== 1 ? 's' : ''} across all workspaces`}
            />

            <Tabs defaultValue="all" className="w-full">
                <TabsList>
                    <TabsTrigger value="all">All ({allNotes.length})</TabsTrigger>
                    <TabsTrigger value="important">Important ({importantNotes.length})</TabsTrigger>
                    <TabsTrigger value="todo">To-do ({todoNotes.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="mt-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {allNotes.length > 0 ? (
                            allNotes.map(note => (
                                <NoteCard
                                    key={note.id}
                                    note={note}
                                    workspaceId={note.workspace_id}
                                    userId={userId}
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-8">
                                <p className="text-muted-foreground">No notes found.</p>
                            </div>
                        )}
                    </div>
                </TabsContent>
                <TabsContent value="important" className="mt-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {importantNotes.length > 0 ? (
                            importantNotes.map(note => (
                                <NoteCard
                                    key={note.id}
                                    note={note}
                                    workspaceId={note.workspace_id}
                                    userId={userId}
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-8">
                                <p className="text-muted-foreground">No important notes found.</p>
                            </div>
                        )}
                    </div>
                </TabsContent>
                <TabsContent value="todo" className="mt-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {todoNotes.length > 0 ? (
                            todoNotes.map(note => (
                                <NoteCard
                                    key={note.id}
                                    note={note}
                                    workspaceId={note.workspace_id}
                                    userId={userId}
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-8">
                                <p className="text-muted-foreground">No to-do notes found.</p>
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
