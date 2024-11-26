export const MintControls = ({
  mintAmount,
  setMintAmount,
  isConnected,
  isMinting,
  onMint,
  onConnect,
  maxMintAmount,
  tier,
  freePacks,
  discountedPacks,
}: MintControlsProps) => {
  console.log('MintControls Props:', { tier, freePacks, discountedPacks, mintAmount, isConnected });

  const getBenefitsDisplay = () => {
    if (!tier) {
      console.warn('No tier detected, skipping benefits display.');
      return null;
    }

    if (tier === 'whale') {
      console.log('Rendering Whale Benefits:', { freePacks, discountedPacks });
      return (
        <Alert className="bg-purple-500/10 border-purple-500/20">
          <Crown className="h-5 w-5 text-purple-500" />
          <AlertDescription>
            <strong>Whale Benefits Active:</strong>
            <p>Free Packs: {freePacks}</p>
            <p>Discounted Packs: {discountedPacks}</p>
          </AlertDescription>
        </Alert>
      );
    }

    if (tier === 'holder') {
      console.log('Rendering Holder Benefits:', { discountedPacks });
      return (
        <Alert className="bg-cyan-500/10 border-cyan-500/20">
          <Fish className="h-5 w-5 text-cyan-500" />
          <AlertDescription>
            <strong>Holder Benefits Active:</strong>
            <p>Discounted Packs: {discountedPacks}</p>
          </AlertDescription>
        </Alert>
      );
    }

    console.log('No benefits to display.');
    return null;
  };

  const getMintButtonText = () => {
    if (!isConnected) return 'Connect Wallet';

    const packText = mintAmount > 1 ? 'Packs' : 'Pack';
    if (tier === 'whale' && mintAmount <= freePacks) {
      return `Mint ${mintAmount} FREE ${packText}`;
    }
    return `Mint ${mintAmount} ${packText}`;
  };

  return (
    <div>
      {getBenefitsDisplay()}

      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={() => setMintAmount(Math.max(1, mintAmount - 1))}
          disabled={mintAmount <= 1}
        >
          -
        </Button>
        <span>{mintAmount}</span>
        <Button
          variant="outline"
          onClick={() => setMintAmount(Math.min(maxMintAmount, mintAmount + 1))}
          disabled={mintAmount >= maxMintAmount}
        >
          +
        </Button>
      </div>

      <Button
        onClick={isConnected ? onMint : onConnect}
        disabled={isMinting}
      >
        {isMinting ? 'Minting...' : getMintButtonText()}
      </Button>
    </div>
  );
};
