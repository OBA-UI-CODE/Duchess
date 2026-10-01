"use client";

import Link from "next/link";
import { Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCommerce } from "@/components/CommerceProvider";

const links = [
  ["Hair & Accessories", "/hair"],
  ["Hair Care & Cosmetics", "/cosmetics"],
  ["New arrivals", "#shop"],
  ["Our story", "#story"],
] as const;

export function Header({ department }: { department?: "hair" | "cosmetics" }) {
  const [open, setOpen] = useState(false);
  const { cartCount } = useCommerce();

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
        <Link className="wordmark" href="/" aria-label="Return to the Duchess department selection">Duchess</Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([label, href]) => <Link key={href} href={href} aria-current={href === `/${department}` ? "page" : undefined}>{label}</Link>)}
        </nav>
        <div className="header-actions">
          <Link className="search-button" href="/shop" aria-label="Search products"><Search aria-hidden="true" /><span>Search</span></Link>
          <Link className="icon-button tablet-up" href="/login" aria-label="Sign in to your account"><UserRound aria-hidden="true" /></Link>
          <Link className="bag-button" href="/cart" aria-label={`Shopping bag, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}><ShoppingBag aria-hidden="true" />{cartCount > 0 && <span>{cartCount}</span>}</Link>
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
        <Link className="menu-account" href="/login" onClick={() => setOpen(false)}><UserRound /> Sign in or create account</Link>
      </div>
    </>
  );
}
