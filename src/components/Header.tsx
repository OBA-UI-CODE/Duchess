"use client";

import Link from "next/link";
import { Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";

const links = [
  ["Hair", "#hair"],
  ["Cosmetics", "#cosmetics"],
  ["New arrivals", "#new"],
  ["Our story", "#story"],
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.body.style.overflow = open ? "hidden" : "";
    document.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  return (
    <>
      <div className="announcement">Free delivery in Lagos on orders over ₦75,000</div>
      <header className="site-header">
        <button className="icon-button mobile-only" onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu aria-hidden="true" />
        </button>
        <Link className="wordmark" href="/" aria-label="Duchess home">Duchess</Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
        <div className="header-actions">
          <button className="search-button" aria-label="Search products"><Search aria-hidden="true" /><span>Search</span></button>
          <Link className="icon-button tablet-up" href="#account" aria-label="Your account"><UserRound aria-hidden="true" /></Link>
          <Link className="bag-button" href="#cart" aria-label="Shopping bag, 0 items"><ShoppingBag aria-hidden="true" /><span>0</span></Link>
        </div>
      </header>
      <div className={`mobile-menu ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <div className="mobile-menu-top">
          <span className="wordmark light">Duchess</span>
          <button className="icon-button light" onClick={() => setOpen(false)} aria-label="Close menu"><X /></button>
        </div>
        <nav aria-label="Mobile navigation">
          {links.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
        </nav>
        <Link className="menu-account" href="#account" onClick={() => setOpen(false)}><UserRound /> Sign in or create account</Link>
      </div>
    </>
  );
}
