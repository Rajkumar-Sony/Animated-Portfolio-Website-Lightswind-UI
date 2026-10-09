import { useId, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Mail, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AnimatedArrowButtonContent } from "@/components/ui/AnimatedArrowButtonContent";
import { MessageSentModal } from "@/components/ui/MessageSentModal";
import WorldMap, { DEFAULT_ARCS, DEFAULT_MARKERS } from "@/components/lightswind/world-map";
import { Section } from "@/components/ui/Section";
import { contact, profile } from "@/data/portfolio";
import { cn } from "@/lib/cn";
import { fadeUp, stagger } from "@/lib/motion";
import { visitorEmailDeliverabilityError } from "@/lib/emailDeliverability";

type Fields = { name: string; email: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;
type Status = "idle" | "sending" | "sent" | "error";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Server endpoint that thanks the sender and forwards the message to the owner's Zoho inbox. */
const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT;

function validate(fields: Fields): Errors {
  const errors: Errors = {};
  if (fields.name.trim().length < 2) errors.name = "Please enter your name.";
  if (!EMAIL_PATTERN.test(fields.email.trim())) errors.email = "Please enter a valid email address.";
  else {
    const deliverability = visitorEmailDeliverabilityError(fields.email.trim());
    if (deliverability) errors.email = deliverability;
  }
  if (fields.message.trim().length < 10) errors.message = "Please write at least 10 characters.";
  return errors;
}

const inputStyles =
  "w-full rounded-sm border border-line bg-surface-sunken px-4 text-sm text-fg placeholder:text-fg-subtle " +
  "transition-[border-color,box-shadow,background-color] duration-150 hover:border-line-strong " +
  "focus-visible:border-focus focus-visible:bg-surface focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus/20 " +
  "aria-invalid:border-danger aria-invalid:ring-danger/15 disabled:opacity-60";

function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <p id={id} className="min-h-5 text-xs text-danger" aria-live="polite">
      {message}
    </p>
  );
}

const contactRows = [
  { icon: Mail, label: profile.email, href: `mailto:${profile.email}` },
  { icon: MapPin, label: profile.location },
];

export function Contact() {
  const uid = useId();
  const [fields, setFields] = useState<Fields>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [senderName, setSenderName] = useState("");

  const update = (key: keyof Fields) => (value: string) => {
    const next = { ...fields, [key]: value };
    setFields(next);
    if (touched[key]) setErrors(validate(next));
    if (status === "sent") setStatus("idle");
  };

  const blur = (key: keyof Fields) => () => {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors(validate(fields));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validate(fields);
    setErrors(found);
    setTouched({ name: true, email: true, message: true });
    const firstInvalid = (Object.keys(found) as (keyof Fields)[])[0];
    if (firstInvalid) {
      document.getElementById(`${uid}-${firstInvalid}`)?.focus();
      return;
    }

    setStatus("sending");

    // With the server configured, the message is delivered over SMTP: the sender
    // gets a thank-you email and the owner a notification with the visitor's text.
    if (CONTACT_ENDPOINT) {
      try {
        const response = await fetch(CONTACT_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            name: fields.name.trim(),
            email: fields.email.trim(),
            message: fields.message.trim(),
          }),
        });
        const payload = (await response.json().catch(() => null)) as { error?: string; mock?: boolean } | null;
        if (!response.ok) throw new Error(payload?.error || `Contact failed with status ${response.status}`);
        if (import.meta.env.DEV && payload?.mock) {
          console.warn(
            "[contact] Server is in MOCK mode — no email was sent. Set ZOHO_MAIL_APP_PASSWORD in .env.local and restart npm run dev:resume-server.",
          );
        }
        setSenderName(fields.name);
        setStatus("sent");
        setFields({ name: "", email: "", message: "" });
        setTouched({});
      } catch {
        setStatus("error");
      }
      return;
    }

    // No endpoint configured — fall back to a prefilled email to the owner.
    const subject = encodeURIComponent(`Portfolio enquiry from ${fields.name.trim()}`);
    const body = encodeURIComponent(`${fields.message.trim()}\n\n— ${fields.name.trim()} (${fields.email.trim()})`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    window.setTimeout(() => {
      setStatus("sent");
      setFields({ name: "", email: "", message: "" });
      setTouched({});
    }, 600);
  };

  const fieldProps = (key: keyof Fields) => ({
    id: `${uid}-${key}`,
    name: key,
    value: fields[key],
    disabled: status === "sending",
    "aria-invalid": touched[key] && errors[key] ? true : undefined,
    "aria-describedby": `${uid}-${key}-error`,
    onBlur: blur(key),
  });

  return (
    <Section id="contact">
      <motion.div
        variants={stagger(0.1)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="relative grid gap-10 overflow-hidden rounded-lg border border-line bg-surface-raised p-6 shadow-soft sm:p-8 md:grid-cols-2 md:p-10"
      >
        <div aria-hidden className="bg-gradient-accent absolute -bottom-32 -left-32 size-80 rounded-full opacity-10 blur-3xl" />

        <motion.div variants={fadeUp} className="relative">
          <h2 id="contact-title" className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Let&apos;s <span className="text-gradient">Connect</span>
          </h2>
          <p className="mt-4 max-w-sm leading-relaxed text-fg-muted">{contact.intro}</p>
          <ul className="mt-8 flex flex-col gap-3">
            {contactRows.map(({ icon: Icon, label, href }) => {
              const content = (
                <>
                  <span className="grid size-11 shrink-0 place-items-center rounded-full border border-line bg-surface shadow-sm">
                    <Icon aria-hidden className="size-4" />
                  </span>
                  <span className="text-sm text-fg-muted transition-colors duration-150 group-hover:text-fg">{label}</span>
                </>
              );
              return (
                <li key={label}>
                  {href ? (
                    <a href={href} className="group inline-flex items-center gap-4 rounded-full pr-3">
                      {content}
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-4">{content}</span>
                  )}
                </li>
              );
            })}
          </ul>
          <div className="relative mt-2 hidden aspect-[2/1] w-full overflow-visible lg:block">
            <WorldMap
              role="img"
              aria-label="World map showing a route from Bihar, India to Osaka, Japan"
              markers={DEFAULT_MARKERS}
              arcs={DEFAULT_ARCS}
              pulse={true}
              markerColor="#3B82F6"
              enableTooltips={true}
            />
          </div>
        </motion.div>

        <motion.form
          variants={fadeUp}
          noValidate
          onSubmit={onSubmit}
          aria-labelledby="contact-title"
          className="relative flex flex-col gap-1 rounded-md border border-line bg-surface p-5 shadow-sm sm:p-6"
        >
          <label htmlFor={`${uid}-name`} className="text-sm font-medium">
            Your Name
          </label>
          <input
            {...fieldProps("name")}
            type="text"
            autoComplete="name"
            placeholder="John Doe"
            onChange={(e) => update("name")(e.target.value)}
            className={cn(inputStyles, "mt-1.5 h-11")}
          />
          <FieldError id={`${uid}-name-error`} message={touched.name ? errors.name : undefined} />

          <label htmlFor={`${uid}-email`} className="mt-1 text-sm font-medium">
            Your Email
          </label>
          <input
            {...fieldProps("email")}
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="john@example.com"
            onChange={(e) => update("email")(e.target.value)}
            className={cn(inputStyles, "mt-1.5 h-11")}
          />
          <FieldError id={`${uid}-email-error`} message={touched.email ? errors.email : undefined} />

          <label htmlFor={`${uid}-message`} className="mt-1 text-sm font-medium">
            Message
          </label>
          <textarea
            {...fieldProps("message")}
            rows={5}
            placeholder="Tell me about the role or project…"
            onChange={(e) => update("message")(e.target.value)}
            className={cn(inputStyles, "mt-1.5 resize-y py-3")}
          />
          <FieldError id={`${uid}-message-error`} message={touched.message ? errors.message : undefined} />

          <Button type="submit" className="mt-2 w-full" aria-busy={status === "sending"} disabled={status === "sending"}>
            {status === "sending" ? (
              <>
                <Loader2 aria-hidden className="size-4 animate-spin" /> Sending your message…
              </>
            ) : (
              <AnimatedArrowButtonContent icon={Send}>Send Message</AnimatedArrowButtonContent>
            )}
          </Button>

          <div aria-live="polite" className="min-h-6">
            <AnimatePresence>
              {status === "error" && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-3 text-center text-sm text-danger"
                >
                  Could not send your message right now. Please try again, or email me at{" "}
                  <a href={`mailto:${profile.email}`} className="underline underline-offset-2 hover:text-fg">
                    {profile.email}
                  </a>
                  .
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.form>

        <MessageSentModal open={status === "sent"} name={senderName} onClose={() => setStatus("idle")} />
      </motion.div>
    </Section>
  );
}
