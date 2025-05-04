import { Skeleton } from "@/components/ui/skeleton";

export default function TaskLoading() {
  return (
    <>
      <Skeleton className="h-18 w-full rounded-lg mb-4" />
      <Skeleton className="h-10 w-1/2 rounded-lg mb-4" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-40 w-full rounded-lg" />
        <Skeleton className="h-40 w-full rounded-lg" />
        <Skeleton className="h-40 w-full rounded-lg" />
        <Skeleton className="h-40 w-full rounded-lg" />
        <Skeleton className="h-40 w-full rounded-lg" />
        <Skeleton className="h-40 w-full rounded-lg" />
        </div>
    </>
  );
}