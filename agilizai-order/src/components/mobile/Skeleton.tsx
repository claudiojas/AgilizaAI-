import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "bg-muted/50 rounded-lg animate-pulse",
        className
      )}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="card-product">
      <Skeleton className="aspect-[4/3] rounded-none rounded-t-2xl" />
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
        </div>
        <Skeleton className="h-6 w-24" />
      </div>
    </div>
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl p-4 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-1.5 flex-1 rounded-full" />
        <Skeleton className="h-1.5 flex-1 rounded-full" />
        <Skeleton className="h-1.5 flex-1 rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
      <div className="pt-3 border-t border-border flex justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-20" />
      </div>
    </div>
  );
}

export function CategoryTabsSkeleton() {
  return (
    <div className="flex items-center gap-2 px-4 py-3 overflow-x-auto hide-scrollbar">
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="h-10 w-24 rounded-full flex-shrink-0" />
      ))}
    </div>
  );
}
