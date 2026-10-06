"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { profile } from "@/content/profile";
import { openPalette } from "./CommandPalette";
import { ChemName } from "./fx/ElementTile";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  ["journey", "Journey"],
  ["origins", "Origins"],
  ["inflection", "Straive"],
  ["work", "Work"],
  ["anshap", "Anshap"],
  ["agents", "Agents"],
  ["life", "Life"],
  ["pulse", "Now"],
] as const;

export function Nav() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    links.forEach(([id]) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled ? "border-b hairline bg-[var(--surface-2)] backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-8">
        <a href="#top" aria-label={profile.name} className="font-display text-[15px] font-semibold tracking-tight">
          T. <ChemName /> Kumar
        </a>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                active === id ? "bg-ink/[0.07] text-text" : "text-muted hover:text-text"
              }`}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={openPalette}
            aria-label="Open command palette"
            className="hidden items-center gap-1 rounded-full border border-ink/10 px-3 py-1.5 font-mono text-xs text-muted transition hover:border-ink/30 hover:text-text sm:flex"
          >
            ⌘K
          </button>
          <button onClick={openPalette} className="rounded-full border border-ink/10 px-3 py-1.5 text-sm text-muted sm:hidden">
            Menu
          </button>
          <a
            href="#contact"
            className="rounded-full border border-line-strong px-4 py-1.5 text-sm transition-colors hover:bg-ink hover:text-bg"
          >
            Contact
          </a>
        </div>
      </div>
      <motion.div className="h-px origin-left bg-gradient-to-r from-[#22D3EE] via-[#A78BFA] to-[#F472B6]" style={{ scaleX: progress }} />
    </header>
  );
}
