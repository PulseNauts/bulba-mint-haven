import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  image?: string;
  name?: string;
}

export const CardModal = ({ isOpen, onClose, image, name }: CardModalProps) => {
  const isVideo = image?.toLowerCase().endsWith('.mp4');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[70vw] lg:max-w-[50vw] p-0 bg-transparent border-none">
        <DialogTitle className="sr-only">{name || "Card View"}</DialogTitle>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative aspect-square w-full"
        >
          {image ? (
            isVideo ? (
              <video
                src={image}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-contain rounded-lg"
                controls
              />
            ) : (
              <img
                src={image}
                alt={name || "Card"}
                className="w-full h-full object-contain rounded-lg"
              />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg">
              <span className="text-muted-foreground">No media available</span>
            </div>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};