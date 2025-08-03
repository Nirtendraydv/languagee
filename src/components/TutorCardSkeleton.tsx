
import { Skeleton } from '@/components/ui/skeleton';

export const TutorCardSkeleton = () => (
    <div className="flex flex-col h-full bg-card/80 backdrop-blur-sm border-2 border-primary/10 rounded-xl overflow-hidden p-6 space-y-4">
        <div className="flex flex-col items-center">
            <Skeleton className="w-32 h-32 rounded-full mb-4" />
            <Skeleton className="h-8 w-1/2 mb-2" />
            <Skeleton className="h-4 w-1/3" />
        </div>
         <Skeleton className="h-20 w-full" />
         <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-12 w-full rounded-full" />
    </div>
);
