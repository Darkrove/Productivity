import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default function DashboardLoading() {
  return (
    <>
      <Skeleton className="h-22 w-full rounded-lg" />
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Skeleton className="h-screen w-full rounded-lg" />
          <Skeleton className="h-screen w-full rounded-lg" />
        </div>
      </div>
    </>
  );
}