import { Skeleton } from '@/components/ui/skeleton';

export default function NotesLoading() {
  return (
    <>
      <Skeleton className="mb-4 h-18 w-full rounded-lg" />
      <Skeleton className="mb-4 h-10 w-1/2 rounded-lg" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-72 w-full rounded-lg" />
        <Skeleton className="h-72 w-full rounded-lg" />
        <Skeleton className="h-72 w-full rounded-lg" />
      </div>
    </>
  );
}
