import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ImageIcon } from "lucide-react";
import type { NFT } from "@/hooks/useNFTs";
import { Skeleton } from "@/components/ui/skeleton";

interface NFTGridProps {
  nfts: NFT[];
  isLoading: boolean;
}

export const NFTGrid = ({ nfts, isLoading }: NFTGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="relative">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-48 w-full rounded-md" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <div className="col-span-full text-center p-8">
        <ImageIcon className="mx-auto h-12 w-12 mb-4 opacity-50" />
        <h3 className="text-xl font-semibold mb-2">No NFTs Found</h3>
        <p className="text-muted-foreground">
          You don't have any NFTs in your wallet yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {nfts.map((nft) => (
        <Card key={nft.id.toString()} className="relative hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center space-x-4">
              <ImageIcon className="h-8 w-8" />
              <h3 className="font-semibold">NFT #{nft.id.toString()}</h3>
            </div>
          </CardHeader>
          <CardContent>
            {nft.image ? (
              <img 
                src={nft.image} 
                alt={nft.name || `NFT #${nft.id.toString()}`}
                className="w-full h-48 object-cover rounded-md"
              />
            ) : (
              <div className="w-full h-48 bg-muted rounded-md flex items-center justify-center">
                <ImageIcon className="h-12 w-12 opacity-50" />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};