import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { query } from "@/lib/db"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { NoteCard, NoteCardProps } from "@/components/note-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateNoteDialog } from "@/components/create-note-dialog"

type NotesPageProps = {
  params: Promise<{ id: string }>
}

export default async function NotesPage({params}: NotesPageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const workspaceId = Number.parseInt(id)

  // Check if user is a member of the workspace
  const memberCheck = await query(
    `SELECT * FROM workspace_members 
     WHERE workspace_id = $1 AND user_id = $2`,
    [workspaceId, session.user.id],
  )

  if (memberCheck.length === 0) {
    redirect("/dashboard")
  }

  // Get workspace details
  const workspaceResult = await query("SELECT * FROM workspaces WHERE id = $1", [workspaceId])

  const workspace = workspaceResult[0]

  // Get workspace notes
  const notesResult = await query(
    `SELECT n.*, u.name as creator_name, u.image as creator_image 
     FROM notes n
     JOIN users u ON n.created_by = u.id
     WHERE n.workspace_id = $1
     ORDER BY n.created_at DESC`,
    [workspaceId],
  )

  const notes = notesResult as NoteCardProps["note"][]

  // Filter notes by category
  const allNotes = notes
  const importantNotes = notes.filter((note) => note.category === "important")
  const todoNotes = notes.filter((note) => note.category === "todo")

  return (
    <div className="flex flex-col gap-4">
      <DashboardHeader
        heading="Notes"
        text={`${workspace.name} · ${notes.length} note${notes.length !== 1 ? "s" : ""}`}
      >
        <CreateNoteDialog workspaceId={workspaceId} userId={Number.parseInt(session.user.id)} />
      </DashboardHeader>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All ({allNotes.length})</TabsTrigger>
          <TabsTrigger value="important">Important ({importantNotes.length})</TabsTrigger>
          <TabsTrigger value="todo">To-do ({todoNotes.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {allNotes.length > 0 ? (
              allNotes.map((note) => <NoteCard key={note.id} note={note} />)
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">No notes found.</p>
                <Button variant="outline" className="mt-4" asChild>
                  <CreateNoteDialog workspaceId={workspaceId} userId={Number.parseInt(session.user.id)}>
                    <div className="flex items-center gap-1">
                      <Plus className="h-4 w-4" />
                      Create a note
                    </div>
                  </CreateNoteDialog>
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="important" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {importantNotes.length > 0 ? (
              importantNotes.map((note) => <NoteCard key={note.id} note={note} />)
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
              todoNotes.map((note) => <NoteCard key={note.id} note={note} />)
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">No to-do notes found.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
