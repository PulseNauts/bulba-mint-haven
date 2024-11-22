import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface PackOpeningModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PackOpeningModal({ isOpen, onOpenChange }: PackOpeningModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-transparent border-none shadow-none">
        <video
          autoPlay
          muted
          onEnded={() => onOpenChange(false)}
          className="w-full h-full"
        >
          <source src="/pack-opening.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </DialogContent>
    </Dialog>
  );
}