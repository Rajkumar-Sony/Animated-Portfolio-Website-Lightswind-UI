import { AnimatePresence, motion } from "framer-motion";
import { CircleCheck, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

type MessageSentModalProps = {
  open: boolean;
  /** Visitor's name, used to personalise the acknowledgement. */
  name?: string;
  onClose: () => void;
};

/**
 * Popup shown right after the contact form is delivered: confirms receipt and
 * promises a reply as soon as possible.
 */
export function MessageSentModal({ open, name, onClose }: MessageSentModalProps) {
  const firstName = name?.trim().split(/\s+/)[0];

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-surface-inverse/60 backdrop-blur-sm dark:bg-surface-inverse/10"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="message-sent-title"
            aria-describedby="message-sent-description"
            className="relative w-full max-w-md rounded-lg border border-line bg-surface-raised p-6 shadow-soft sm:p-8"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="absolute top-4 right-4 rounded-full p-1.5 text-fg-muted transition-colors duration-150 hover:bg-surface-sunken hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              <X aria-hidden className="size-4" />
            </button>

            <div className="flex flex-col items-center py-6 text-center" aria-live="polite">
              <CircleCheck aria-hidden className="size-12 text-success" />
              <h2 id="message-sent-title" className="mt-4 text-xl font-semibold">
                Message sent!
              </h2>
              <p id="message-sent-description" className="mt-2 text-sm leading-relaxed text-fg-muted">
                Thank you{firstName ? `, ${firstName}` : ""}! I received your message and a confirmation
                email is on its way to your inbox. I will get back to you as soon as possible.
              </p>
              <Button onClick={onClose} className="mt-6">
                Done
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
