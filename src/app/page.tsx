import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Home() {
  return (
    <main className="gateway-shell">
      <h1 className="sr-only">Choose a Duchess shopping department</h1>
      <Link className="gateway-panel gateway-hair" href="/hair" aria-label="Enter Hair and Accessories">
        <Image src="/images/duchess-hair-hero.png" alt="Model wearing long, dark body-wave hair" fill priority sizes="(min-width: 600px) 50vw, 100vw" />
        <span className="gateway-overlay" />
        <span className="gateway-copy">
          <span className="gateway-kicker">Duchess collection 01</span>
          <span className="gateway-title">Hair &amp;<br />Accessories</span>
          <span className="gateway-enter">Enter the collection <ArrowUpRight aria-hidden="true" /></span>
        </span>
      </Link>
      <Link className="gateway-panel gateway-cosmetics" href="/cosmetics" aria-label="Enter Hair Care and Cosmetics">
        <Image src="/images/duchess-cosmetics-hero.png" alt="Hair care and cosmetic products arranged on stone plinths" fill priority sizes="(min-width: 600px) 50vw, 100vw" />
        <span className="gateway-overlay" />
        <span className="gateway-copy">
          <span className="gateway-kicker">Duchess collection 02</span>
          <span className="gateway-title">Hair Care &amp;<br />Cosmetics</span>
          <span className="gateway-enter">Enter the collection <ArrowUpRight aria-hidden="true" /></span>
        </span>
      </Link>
    </main>
  );
}
