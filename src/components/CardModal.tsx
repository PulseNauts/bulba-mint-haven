import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion } from "framer-motion";

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  image?: string;
  name?: string;
}

export const CardModal = ({ isOpen, onClose, image, name }: CardModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[70vw] lg:max-w-[50vw] p-0 bg-transparent border-none">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative aspect-square w-full"
        >
          {image ? (
            <img
              src={image}
              alt={name || "Card"}
              className="w-full h-full object-contain rounded-lg"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg">
              <span className="text-muted-foreground">No image available</span>
            </div>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};