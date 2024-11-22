import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Package } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import type { PackData } from "@/hooks/usePackData";
import { Skeleton } from "@/components/ui/skeleton";

interface PackGridProps {
  packs: PackData[];
  selectedPacks: number[];
  onTogglePack: (packId: number) => void;
  onOpenSinglePack: (packId: number) => void;
  isOpening: boolean;
  isLoading: boolean;
}

export const PackGrid = ({
  packs,
  selectedPacks,
  onTogglePack,
  onOpenSinglePack,
  isOpening,
  isLoading
}: PackGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="relative">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-full mt-4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!packs || packs.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {packs.map((pack) => (
        <Card key={pack.id} className="relative card-hover pack-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center space-x-4">
              <Package className="h-8 w-8" />
              <h3 className="font-semibold">Pack #{pack.id}</h3>
            </div>
            <Checkbox
              checked={selectedPacks.includes(pack.id)}
              onCheckedChange={() => onTogglePack(pack.id)}
            />
          </CardHeader>
          <CardContent>
            <Button
              className="w-full mt-4"
              onClick={() => onOpenSinglePack(pack.id)}
              disabled={isOpening}
            >
              {isOpening ? 'Opening...' : 'Open Pack'}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};