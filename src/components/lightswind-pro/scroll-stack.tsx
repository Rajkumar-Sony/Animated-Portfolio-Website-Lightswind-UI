"use client";
import React, { useEffect, useRef, useState } from "react";

export interface ScrollStackCard {
  title: string;
  subtitle?: string;
  badge?: string;
  backgroundImage?: string;
  content?: React.ReactNode;
}

interface ScrollStackProps {
  cards: ScrollStackCard[];
  /** Pinned together with the cards, so it stays attached while they stack. */
  header?: React.ReactNode;
  cardHeight?: number;
  scrollPerCard?: number;
  /** Distance from the viewport top the cards never pin above; must clear the fixed header. */
  pinTop?: number;
  className?: string;
}

const HINT_SPACE = 56;
/** Gap kept below the stack when it pins, so the floating dock doesn't cover it. */
const BOTTOM_GAP = 24;

/**
 * Panel top (viewport px) at which the stack pins: header + cards centred between the nav and the
 * bottom gap. When they don't fit, it pins as soon as they're fully on screen; on short screens the
 * header may scroll under the nav.
 */
const pinAtFor = (viewportH: number, headerH: number, stackH: number, pinTop: number) => {
  const panelH = headerH + stackH;
  const centred = pinTop + (viewportH - pinTop - BOTTOM_GAP - panelH) / 2;
  return Math.max(pinTop - headerH, Math.min(centred, viewportH - panelH - BOTTOM_GAP));
};

const ScrollStack: React.FC<ScrollStackProps> = ({
  cards,
  header,
  cardHeight = 420,
  scrollPerCard = 300,
  pinTop = 96,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyPanelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(0);
  const [vpH, setVpH] = useState(800);
  const [headerH, setHeaderH] = useState(0);
  const headerHRef = useRef(0);

  const scrollParentRef = useRef<Element | null>(null);
  const containerOffsetRef = useRef(0);

  const list = cards.slice(0, 5);
  const N = list.length;
  const totalScrollZone = N * scrollPerCard;
  const stackH = cardHeight + HINT_SPACE;

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      headerHRef.current = el.offsetHeight;
      setHeaderH(el.offsetHeight);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let scrollParent: Element | null = null;
    let node: Element | null = el.parentElement;
    while (node) {
      const s = window.getComputedStyle(node);
      if (/auto|scroll/.test(s.overflow) || /auto|scroll/.test(s.overflowY)) {
        scrollParent = node;
        break;
      }
      node = node.parentElement;
    }
    scrollParentRef.current = scrollParent;

    const measure = () => {
      const sp = scrollParentRef.current;
      const elRect = el.getBoundingClientRect();
      if (sp) {
        const spRect = sp.getBoundingClientRect();
        containerOffsetRef.current = elRect.top - spRect.top + sp.scrollTop;
        setVpH(sp.clientHeight);
      } else {
        containerOffsetRef.current = elRect.top + window.scrollY;
        setVpH(window.innerHeight);
      }
    };

    const measureTimer = window.setTimeout(measure, 100);

    let animId: number | null = null;
    const update = () => {
      if (animId) cancelAnimationFrame(animId);
      animId = requestAnimationFrame(() => {
        const sp = scrollParentRef.current;
        const pinAt = pinAtFor(
          sp ? sp.clientHeight : window.innerHeight,
          headerHRef.current,
          stackH,
          pinTop,
        );
        // Window scrolling reads the live position: content above (images, fonts) can shift after mount.
        const currentScrolled = sp
          ? Math.max(0, sp.scrollTop - containerOffsetRef.current + pinAt)
          : Math.max(0, pinAt - el.getBoundingClientRect().top);

        // Moved directly so the panel tracks the scrollbar without React render lag.
        if (stickyPanelRef.current) {
          const innerTop = Math.min(currentScrolled, totalScrollZone);
          stickyPanelRef.current.style.transform = `translateY(${innerTop}px)`;
        }

        setScrolled(currentScrolled);
      });
    };

    const targets: (Element | Window)[] = [window];
    let n: Element | null = el.parentElement;
    while (n) {
      const s = window.getComputedStyle(n);
      if (/auto|scroll/.test(s.overflow) || /auto|scroll/.test(s.overflowY)) {
        targets.push(n);
      }
      n = n.parentElement;
    }

    const onResize = () => {
      measure();
      update();
    };

    targets.forEach((t) => t.addEventListener("scroll", update, { passive: true }));
    window.addEventListener("resize", onResize, { passive: true });
    update();

    return () => {
      targets.forEach((t) => t.removeEventListener("scroll", update));
      window.removeEventListener("resize", onResize);
      window.clearTimeout(measureTimer);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [totalScrollZone, pinTop, stackH, headerH]);

  const cardsTop = pinAtFor(vpH, headerH, stackH, pinTop) + headerH;
  const enterDistance = Math.max(vpH - cardsTop, cardHeight);
  /** 0 → 1 as card `i` slides up from the viewport bottom; the first card starts in place. */
  const progressOf = (i: number) =>
    i === 0 ? 1 : Math.min(1, Math.max(0, (scrolled - (i - 1) * scrollPerCard) / scrollPerCard));

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className}`}
      style={{ height: headerH + stackH + totalScrollZone }}
    >
      <div
        ref={stickyPanelRef}
        className="absolute inset-x-0 top-0"
        style={{ height: headerH + stackH, willChange: "transform" }}
      >
        <div ref={headerRef} className="flow-root">
          {header}
        </div>

        <div className="relative w-full" style={{ height: cardHeight }}>
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "56rem",
              margin: "0 auto",
              padding: "0 1rem",
              height: cardHeight,
            }}
          >
            {list.map((card, index) => {
              const entryProgress = progressOf(index);
              let above = 0;
              for (let j = index + 1; j < N; j++) if (progressOf(j) >= 1) above += 1;

              const entryY = (1 - entryProgress) * enterDistance;
              const pushY = above * 12;
              const scale = 1 - above * 0.03;
              const opacity = entryProgress > 0 ? Math.max(0.6, 1 - above * 0.1) : 0;

              return (
                <div
                  key={index}
                  className="absolute inset-x-0 overflow-hidden rounded-2xl shadow-2xl"
                  style={{
                    height: cardHeight,
                    top: 0,
                    zIndex: 10 + index,
                    transform: `translateY(${entryY - pushY}px) scale(${scale})`,
                    opacity,
                    transition: "transform 0.15s ease-out, opacity 0.3s ease",
                    willChange: "transform, opacity",
                    transformOrigin: "center top",
                  }}
                >
                  {card.backgroundImage ? (
                    <img
                      src={card.backgroundImage}
                      alt=""
                      width={1600}
                      height={900}
                      loading={index === 0 ? "eager" : "lazy"}
                      decoding={index === 0 ? "sync" : "async"}
                      fetchPriority={index === 0 ? "high" : "low"}
                      className="absolute inset-0 size-full object-cover"
                    />
                  ) : (
                    <div className="bg-gradient-accent absolute inset-0" />
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/55 to-black/10" />

                  {card.badge && (
                    <div className="absolute top-5 right-5 z-10">
                      <span className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-sm font-medium border border-white/30">
                        {card.badge}
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 flex items-end p-6 sm:p-10 z-10">
                    {card.content ?? (
                      <div className="max-w-lg">
                        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
                          {card.title}
                        </h3>
                        {card.subtitle && (
                          <p className="text-white/70 text-sm sm:text-base leading-relaxed line-clamp-3">
                            {card.subtitle}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="absolute bottom-5 right-6 z-10 text-white/40 text-xs font-mono tracking-widest">
                    {String(index + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute right-5 top-1/2 -translate-y-1/2 flex flex-col gap-2.5 z-50">
            {list.map((_, i) => {
              const active = progressOf(i) >= 1;
              return (
                <div
                  key={i}
                  className={`rounded-full transition-all duration-300 ${active ? "bg-fg shadow-[0_0_6px_var(--accent-ink)]" : "bg-fg-subtle/40"}`}
                  style={{ width: active ? 8 : 5, height: active ? 8 : 5 }}
                />
              );
            })}
          </div>
        </div>

        {scrolled < 20 && (
          <div className="absolute bottom-2 inset-x-0 flex justify-center z-50 pointer-events-none">
            <p className="text-xs text-fg-muted tracking-[0.2em] uppercase animate-bounce motion-reduce:animate-none">
              scroll to explore
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScrollStack;
