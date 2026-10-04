import { Skeleton } from '@/components/ui/skeleton';

export default function NotesLoading() {
  return (
    <>
      <Skeleton className="mb-4 h-18 w-full rounded-lg" />
      <Skeleton className="mb-4 h-10 w-1/2 rounded-lg" />
      <div className="columns-1 gap-4 md:columns-2 lg:columns-3">
        <Skeleton className="mb-4 h-52 w-full break-inside-avoid rounded-lg" />
        <Skeleton className="mb-4 h-72 w-full break-inside-avoid rounded-lg" />
        <Skeleton className="mb-4 h-60 w-full break-inside-avoid rounded-lg" />
        <Skeleton className="mb-4 h-64 w-full break-inside-avoid rounded-lg" />
        <Skeleton className="mb-4 h-48 w-full break-inside-avoid rounded-lg" />
        <Skeleton className="mb-4 h-72 w-full break-inside-avoid rounded-lg" />
      </div>
    </>
  );
}
