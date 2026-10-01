import Link from "next/link";
import { Header } from "@/components/Header";
export function PolicyPage({ eyebrow, title, updated, children }: { eyebrow: string; title: string; updated: string; children: React.ReactNode }) { return <main><Header /><article className="policy-page"><p className="eyebrow purple">{eyebrow}</p><h1>{title}</h1><p className="policy-updated">Last updated {updated}</p>{children}<Link className="text-link" href="/shop">Return to the shop</Link></article></main>; }
