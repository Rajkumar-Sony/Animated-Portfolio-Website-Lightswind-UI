import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CircleCheck, Loader2, Send, X } from "lucide-react";
import { AnimatedArrowButtonContent } from "@/components/ui/AnimatedArrowButtonContent";
import { Button } from "@/components/ui/Button";
import { profile } from "@/data/portfolio";
import { cn } from "@/lib/cn";
import { visitorEmailDeliverabilityError } from "@/lib/emailDeliverability";

type Status = "idle" | "sending" | "sent" | "error";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputStyles =
  "w-full rounded-sm border border-line bg-surface-sunken px-4 text-sm text-fg placeholder:text-fg-subtle " +
  "transition-[border-color,box-shadow,background-color] duration-150 hover:border-line-strong " +
  "focus-visible:border-focus focus-visible:bg-surface focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus/20 " +
  "aria-invalid:border-danger aria-invalid:ring-danger/15 disabled:opacity-60";

type ResumeRequestModalProps = {
  open: boolean;
  onClose: () => void;
};

/**
 * Popup that collects a visitor's email to request the latest resume.
 * When `VITE_RESUME_REQUEST_ENDPOINT` is set, the owner gets a Zoho Mail
 * approval message; the visitor receives the resume only after approval.
 */
export function ResumeRequestModal({ open, onClose }: ResumeRequestModalProps) {
  const uid = useId();
  const emailId = `${uid}-email`;
  const errorId = `${uid}-email-error`;
  const inputRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  // Focus the email field and lock page scroll while the popup is open.
  useEffect(() => {
    if (!open) return;
    setStatus("idle");
    setTouched(false);
    setError(undefined);
    inputRef.current?.focus();
    const { overflow, paddingRight } = document.body.style;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [open]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const usesApprovalFlow = Boolean(import.meta.env.VITE_RESUME_REQUEST_ENDPOINT);

  const submitRequest = async (value: string) => {
    const endpoint = import.meta.env.VITE_RESUME_REQUEST_ENDPOINT;

    if (endpoint) {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email: value, source: "resume-request", resumeUrl: profile.resumeUrl }),
      });
      const payload = (await response.json().catch(() => null)) as { error?: string; mock?: boolean } | null;
      if (!response.ok) {
        throw new Error(payload?.error || `Request failed with status ${response.status}`);
      }
      if (import.meta.env.DEV && payload?.mock) {
        console.warn(
          "[resume] Server is in MOCK mode — no email was sent to Zoho. Set ZOHO_MAIL_APP_PASSWORD in .env.local and restart npm run dev:resume-server.",
        );
      }
      return;
    }

    // No endpoint configured — fall back to a prefilled email to the owner.
    const subject = encodeURIComponent("Resume request");
    const body = encodeURIComponent(`Hi ${profile.name.split(" ")[0]},\n\nPlease send me your latest resume.\n\n— Sent from your portfolio`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = email.trim();
    if (!EMAIL_PATTERN.test(value)) {
      setTouched(true);
      setError("Please enter a valid email address.");
      inputRef.current?.focus();
      return;
    }
    const deliverability = visitorEmailDeliverabilityError(value);
    if (deliverability) {
      setTouched(true);
      setError(deliverability);
      inputRef.current?.focus();
      return;
    }

    setStatus("sending");
    try {
      await submitRequest(value);
      setStatus("sent");
      setEmail("");
      setTouched(false);
      setError(undefined);
    } catch {
      setStatus("error");
    }
  };

  const sending = status === "sending";

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
            aria-labelledby={`${uid}-title`}
            aria-describedby={`${uid}-description`}
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

            {status === "sent" ? (
              <div className="flex flex-col items-center py-6 text-center" aria-live="polite">
                <CircleCheck aria-hidden className="size-12 text-success" />
                <h2 id={`${uid}-title`} className="mt-4 text-xl font-semibold">
                  Request sent!
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  {usesApprovalFlow
                    ? "Thanks! I received your request and will email you the latest resume once I approve it — as soon as possible."
                    : "Thanks! Check your email app to send the request, or reach out to me directly."}
                </p>
                <Button onClick={onClose} className="mt-6">
                  Done
                </Button>
              </div>
            ) : (
              <>
                <div aria-hidden className="bg-gradient-accent pointer-events-none absolute -top-24 -right-24 size-48 rounded-full opacity-10 blur-3xl" />
                <h2 id={`${uid}-title`} className="text-xl font-semibold tracking-tight">
                  Get the <span className="text-gradient">Latest Resume</span>
                </h2>
                <p id={`${uid}-description`} className="mt-2 text-sm leading-relaxed text-fg-muted">
                  Enter your email to request my latest resume. I&apos;ll review the request and send it to you from my Zoho Mail after approval.
                </p>

                <form noValidate onSubmit={onSubmit} className="mt-6">
                  <label htmlFor={emailId} className="text-sm font-medium">
                    Your Email
                  </label>
                  <input
                    ref={inputRef}
                    id={emailId}
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    disabled={sending}
                    aria-invalid={touched && error ? true : undefined}
                    aria-describedby={errorId}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (touched) setError(EMAIL_PATTERN.test(e.target.value.trim()) ? undefined : error);
                      if (status === "error") setStatus("idle");
                    }}
                    onBlur={() => {
                      setTouched(true);
                      setError(EMAIL_PATTERN.test(email.trim()) ? undefined : "Please enter a valid email address.");
                    }}
                    className={cn(inputStyles, "mt-1.5 h-11")}
                  />
                  <p id={errorId} className="min-h-5 text-xs text-danger" aria-live="polite">
                    {touched ? error : undefined}
                  </p>

                  <Button type="submit" className="mt-2 w-full" aria-busy={sending} disabled={sending}>
                    {sending ? (
                      <>
                        <Loader2 aria-hidden className="size-4 animate-spin" /> Sending request…
                      </>
                    ) : (
                      <AnimatedArrowButtonContent icon={Send}>Send Request for Resume/CV</AnimatedArrowButtonContent>
                    )}
                  </Button>

                  {status === "error" && (
                    <p aria-live="polite" className="mt-3 text-xs text-danger">
                      Could not send your request right now. Email me directly at{" "}
                      <a href={`mailto:${profile.email}`} className="underline underline-offset-2 hover:text-fg">
                        {profile.email}
                      </a>
                      .
                    </p>
                  )}
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
