"use client"
// create a button to create a new workspace
import { useState } from 'react';
import { useSession } from 'next-auth/react';

import { CreateWorkspaceDialog } from '@/components/create-workspace-dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ShineBorder } from '@/components/ui/shine-border';

export function CreateWorkspaceButton() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { data: session } = useSession();

  const handleCreateWorkspace = () => {
    setIsCreateDialogOpen(true);
  };

  return (
    <>
      <Button size="sm" variant="outline" onClick={handleCreateWorkspace} className='relative overflow-hidden'>
      <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
        <Plus className="h-4 w-4" />
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Create Workspace</span>
      </Button>
      <CreateWorkspaceDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        userId={Number.parseInt(session?.user?.id || '0')}
      />
    </>
  );
}
