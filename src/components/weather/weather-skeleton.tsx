import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function WeatherSkeleton() {
  return <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
    <Card className="p-7 lg:col-span-7"><Skeleton className="h-[260px] w-full" /></Card>
    <Card className="p-7 lg:col-span-5"><div className="grid grid-cols-2 gap-3">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-20" />)}</div></Card>
    <Card className="p-7 lg:col-span-12"><Skeleton className="h-36" /></Card>
    <Card className="p-7 lg:col-span-7"><Skeleton className="h-80" /></Card>
    <Card className="p-7 lg:col-span-5"><Skeleton className="h-80" /></Card>
  </div>;
}
