import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardFooter } from "./ui/card";
import { ImageIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { usePackOperations } from "@/hooks/usePackOperations";
import { usePackMetadata } from "@/hooks/usePackMetadata";
import { PackOpeningModal } from "./PackOpeningModal";

export const PackAmountTracker = () => {
  const { isConnected } = useAccount();
  const { toast } = useToast();
  const [selectedPacks, setSelectedPacks] = useState<number[]>([]);
  const { openPacks, isOpening } = usePackOperations();
  const { packMetadata, setPackMetadata, isLoading } = usePackMetadata();
  const [isOpeningAnimation, setIsOpeningAnimation] = useState(false);

  const handleTogglePack = (packId: number) => {
    setSelectedPacks(prev =>
      prev.includes(packId)
        ? prev.filter(id => id !== packId)
        : [...prev, packId]
    );
  };

  const handleOpenPack = async (packId: number) => {
    setIsOpeningAnimation(true);
    const success = await openPacks([packId]);
    if (success) {
      setPackMetadata(prev => prev.filter(pack => pack.id !== packId));
      setSelectedPacks([]);
      if (typeof window !== 'undefined' && (window as any).triggerCardRescan) {
        (window as any).triggerCardRescan();
      }
    }
  };

  const handleOpenSelected = async () => {
    if (selectedPacks.length === 0) {
      toast({
        title: "No packs selected",
        description: "Please select at least one pack to open",
      });
      return;
    }

    setIsOpeningAnimation(true);
    const success = await openPacks(selectedPacks);
    if (success) {
      setPackMetadata(prev => prev.filter(pack => !selectedPacks.includes(pack.id)));
      setSelectedPacks([]);
      if (typeof window !== 'undefined' && (window as any).triggerCardRescan) {
        (window as any).triggerCardRescan();
      }
    }
  };

  const handleOpenAll = async () => {
    const allPackIds = packMetadata.map(pack => pack.id);
    setIsOpeningAnimation(true);
    const success = await openPacks(allPackIds);
    if (success) {
      setPackMetadata([]);
      setSelectedPacks([]);
      if (typeof window !== 'undefined' && (window as any).triggerCardRescan) {
        (window as any).triggerCardRescan();
      }
    }
  };

  if (!isConnected) {
    return null;
  }

  if (packMetadata.length === 0 && !isLoading) {
    return null;
  }

  return (
    <div className="space-y-4">
      <PackOpeningModal 
        isOpen={isOpeningAnimation} 
        onOpenChange={setIsOpeningAnimation} 
      />
      <div className="flex gap-4">
        {selectedPacks.length > 0 && (
          <Button onClick={handleOpenSelected} disabled={isOpening}>
            Open Selected ({selectedPacks.length})
          </Button>
        )}
        {packMetadata.length > 0 && (
          <Button onClick={handleOpenAll} disabled={isOpening}>
            Open All ({packMetadata.length})
          </Button>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {packMetadata.map((pack) => (
          <Card key={pack.id} className="aspect-square hover:scale-105 transition-transform duration-200">
            <CardContent className="p-2 h-full flex flex-col items-center justify-center relative">
              <div className="absolute top-2 right-2 z-10">
                <Checkbox
                  checked={selectedPacks.includes(pack.id)}
                  onCheckedChange={() => handleTogglePack(pack.id)}
                />
              </div>
              {pack.image ? (
                <img 
                  src={pack.image} 
                  alt={pack.name || `Pack #${pack.id}`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted rounded-md">
                  <ImageIcon className="h-12 w-12 opacity-50" />
                </div>
              )}
            </CardContent>
            <CardFooter className="p-2">
              <Button 
                className="w-full" 
                onClick={() => handleOpenPack(pack.id)}
                disabled={isOpening}
              >
                Open Pack
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};