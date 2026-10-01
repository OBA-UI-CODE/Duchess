import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "The journal",
  description: "Straightforward guides to choosing wigs, caring for hair, and making your beauty routine work for you.",
};

const guides = [
  {
    id: "choose-your-wig",
    category: "Hair guide",
    title: "Find a wig that fits your everyday life",
    image: "/images/product-bob-wig.png",
    imageAlt: "Natural-looking short bob wig",
    intro: "Start with the shape and upkeep you actually enjoy. The most beautiful unit is one you feel comfortable wearing and maintaining.",
    tips: [
      "Choose the cap size before the length. Measure around your hairline and compare it with the unit's fit information.",
      "Think about texture and routine together. Straight styles tend to need heat protection; curls need moisture and gentle detangling.",
      "Check the parting and lace finish in natural light. A good fit around the hairline matters more than extra length.",
    ],
    shopHref: "/shop",
    shopLabel: "Explore hair pieces",
  },
  {
    id: "care-routine",
    category: "Care guide",
    title: "Build a simple wash-day routine",
    image: "/images/product-shampoo-set.png",
    imageAlt: "Shampoo and conditioner bottles",
    intro: "A useful routine starts with what your scalp and hair need today, then stays simple enough to repeat.",
    tips: [
      "Cleanse the scalp thoroughly and rinse well. Product buildup can make even a moisturising routine feel heavy.",
      "Condition the lengths, then detangle gently from ends toward roots. Give textured hair extra slip and time.",
      "Add a light leave-in or sealant only where needed. Adjust the amount before adding more products to the routine.",
    ],
    shopHref: "/cosmetics",
    shopLabel: "Explore hair care",
  },
  {
    id: "protect-your-style",
    category: "Styling guide",
    title: "Help your style last between wears",
    image: "/images/product-hair-mist.png",
    imageAlt: "Hair mist bottle on a warm neutral background",
    intro: "A few small habits help keep a finished look fresh without starting over each morning.",
    tips: [
      "Store wigs on a stand or in a clean satin bag to help preserve their shape and keep fibres from tangling.",
      "Use heat only within the product's care guidance, and test styling products on a small section first.",
      "Refresh curls and edges with a little product at a time. Too much can dull the finish and build up quickly.",
    ],
    shopHref: "/shop",
    shopLabel: "Shop styling essentials",
  },
] as const;

export default function JournalPage() {
  return (
    <main>
      <Header />
      <section className="catalogue-page journal-page" aria-labelledby="journal-title">
        <p className="eyebrow purple">The Duchess journal</p>
        <h1 id="journal-title">Good beauty advice, kept simple.</h1>
        <p>Practical notes for finding your fit, caring for your hair and keeping your style looking its best.</p>
        <nav className="journal-index" aria-label="Journal guides">
          {guides.map((guide) => <a key={guide.id} href={`#${guide.id}`}>{guide.category}: {guide.title}<ArrowRight aria-hidden="true" /></a>)}
        </nav>
        <div className="journal-guides">
          {guides.map((guide) => (
            <article className="journal-guide" id={guide.id} key={guide.id}>
              <div className="journal-guide-image"><Image src={guide.image} alt={guide.imageAlt} fill sizes="(max-width: 700px) 100vw, 40vw" /></div>
              <div className="journal-guide-copy">
                <p className="eyebrow purple">{guide.category}</p>
                <h2>{guide.title}</h2>
                <p>{guide.intro}</p>
                <ul>{guide.tips.map((tip) => <li key={tip}>{tip}</li>)}</ul>
                <Link className="text-link" href={guide.shopHref}>{guide.shopLabel}<ArrowRight aria-hidden="true" /></Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
