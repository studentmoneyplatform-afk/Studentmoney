import { waLink } from "@/lib/whatsapp";

/** The WhatsApp glyph. Drawn rather than placed so it inherits currentColor. */
function WaGlyph({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.13h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.22 8.22 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.25-8.24a8.2 8.2 0 0 1 8.24 8.25c0 4.54-3.7 8.21-8.24 8.21Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.22.25-.85.84-.85 2.03 0 1.2.87 2.35.99 2.51.12.16 1.71 2.61 4.14 3.66.58.25 1.03.4 1.38.51.58.19 1.11.16 1.53.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  );
}

/**
 * A button that opens WhatsApp with the message already written.
 *
 * Renders nothing when no owner number is configured — a chat button that
 * opens an empty WhatsApp is worse than no button, and the site already
 * promises WhatsApp contact in several places.
 */
export function WhatsAppButton({
  message,
  children,
  variant = "solid",
  size = "md",
  className = "",
}: {
  message: string;
  children: React.ReactNode;
  variant?: "solid" | "ghost" | "light" | "wa";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const href = waLink(message);
  if (!href) return null;

  const sizing = {
    sm: "px-4 py-2 text-caption",
    md: "px-5 py-2.5 text-[0.9375rem]",
    lg: "px-7 py-3.5 text-[1.0625rem]",
  }[size];

  const look = {
    solid: "bg-forest text-paper hover:bg-forest-deep",
    ghost: "border border-forest/30 text-forest hover:border-forest hover:bg-green-wash/60",
    light: "bg-paper text-forest hover:bg-white",
    wa: "bg-[#25D366] text-[#07371d] hover:brightness-95",
  }[variant];

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2.5 rounded-full font-bold transition-colors ${sizing} ${look} ${className}`}
    >
      <WaGlyph size={size === "lg" ? 20 : 18} />
      {children}
    </a>
  );
}

/**
 * The persistent chat button. Sits clear of the bottom edge so it does not
 * cover a phone's own home indicator.
 */
export function WhatsAppFloat({ message, label = "Chat with us" }: { message: string; label?: string }) {
  const href = waLink(message);
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="fixed bottom-6 right-5 z-[60] inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-4 py-3.5 font-bold text-[#07371d] shadow-[0_14px_38px_-10px_rgba(7,55,29,0.55)] transition-transform hover:scale-[1.04] sm:bottom-8 sm:right-8 sm:px-5"
    >
      <WaGlyph size={22} />
      <span className="hidden text-[0.9375rem] sm:inline">{label}</span>
    </a>
  );
}
