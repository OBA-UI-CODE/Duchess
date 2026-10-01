import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Headphones, PackageCheck, ShieldCheck } from "lucide-react";
import { Header } from "@/components/Header";
import { DuchessMark } from "@/components/Icons";
import { ProductCard } from "@/components/ProductCard";
import { getProducts } from "@/lib/products";
import { getDepartmentCollections } from "@/lib/collections";

type Department = "hair" | "cosmetics";

const content = {
  hair: {
    eyebrow: "Hair | Accessories", title: "Wear your crown, your way.",
    body: "Premium wigs, bundles and finishing pieces selected for natural movement, effortless styling and unmistakable confidence.",
    image: "/images/duchess-hair-hero.png", alt: "Model wearing a long dark body-wave wig",
    edit: "The signature hair edit", editTitle: "Made to move. Chosen to last.",
    storyTitle: "Find the texture that feels like you.",
    storyBody: "From everyday units to statement lengths, our collection makes it easier to compare textures, lengths and finishes before you choose.",
    products: [
      { name: "The Amara Body Wave", category: "Premium wig · 24 inch", price: "₦185,000", imageClass: "wig-one", image: "/images/product-body-wave.png", badge: "Bestseller" },
      { name: "Silky Straight Bundle", category: "Human hair · 20 inch", price: "₦68,500", imageClass: "wig-two", image: "/images/product-straight-bundles.png" },
      { name: "The Zuri Closure", category: "HD lace · Natural black", price: "₦42,000", imageClass: "wig-one", image: "/images/product-straight-bundles.png", badge: "New" },
      { name: "Soft Curl Attachment", category: "Lightweight fibre · 24 inch", price: "₦16,500", imageClass: "wig-two", image: "/images/product-body-wave.png" },
    ],
  },
  cosmetics: {
    eyebrow: "Hair Care & Cosmetics", title: "Care for every version of your crown.",
    body: "Growth oils, nourishing treatments, lashes and beauty essentials made to support healthy routines and everyday confidence.",
    image: "/images/duchess-cosmetics-hero.png", alt: "Hair creams, growth oil and cosmetics arranged on warm stone plinths",
    edit: "The daily ritual edit", editTitle: "Good care, beautifully simple.",
    storyTitle: "Know what your hair actually needs.",
    storyBody: "Duchess pairs carefully selected formulas with clear guidance, helping you build a routine around your texture, condition and goals.",
    products: [
      { name: "Nourish Growth Oil", category: "Hair treatment · 100ml", price: "₦12,500", imageClass: "care-one", image: "/images/product-hair-care.png", badge: "Bestseller" },
      { name: "Repair & Restore Mask", category: "Deep conditioner · 300ml", price: "₦18,000", imageClass: "care-two", image: "/images/product-hair-care.png" },
      { name: "Silk Hold Edge Cream", category: "Styling care · 120ml", price: "₦8,500", imageClass: "care-two", image: "/images/product-hair-care.png", badge: "New" },
      { name: "Featherlight Lash Set", category: "Reusable lashes · 3 pairs", price: "₦9,000", imageClass: "care-one", image: "/images/product-lashes.png" },
    ],
  },
} as const;

export async function StoreLanding({ department }: { department: Department }) {
  const page = content[department];
  const products = await getProducts(department);
  const collections = getDepartmentCollections(department);
  return (
    <main>
      <Header department={department} />
      <section className={`department-hero department-${department}`} aria-labelledby="department-title">
        <Image src={page.image} alt={page.alt} fill priority sizes="100vw" />
        <div className="department-shade" />
        <div className="department-hero-copy">
          <p className="hero-kicker">{page.eyebrow}</p><h1 id="department-title">{page.title}</h1><p>{page.body}</p>
          <Link className="button button-light" href="#shop">Shop the collection <ArrowRight /></Link>
        </div>
        <p className="hero-index">Duchess / {department === "hair" ? "01" : "02"}</p>
      </section>
      <section className="trust-strip" aria-label="Shopping benefits">
        <div><PackageCheck /><span><strong>Nationwide delivery</strong>Carefully packed, wherever you are</span></div>
        <div><ShieldCheck /><span><strong>Thoughtful checkout</strong>Clear pricing before you place an order</span></div>
        <div><Headphones /><span><strong>Beauty support</strong>Real help before and after you buy</span></div>
      </section>
      <section className="section landing-collections" aria-labelledby="landing-collections-title">
        <div className="section-heading"><div><p className="eyebrow purple">Find your way in</p><h2 id="landing-collections-title">Shop by category.</h2></div><Link href={`/collections/${department}`}>View all categories <ArrowRight /></Link></div>
        <div className="landing-collection-grid">{collections.map((collection, index) => <Link className="landing-collection-card" href={`/collections/${collection.slug}`} key={collection.slug}><span className="landing-collection-image"><Image src={collection.image} alt="" fill sizes="(max-width: 599px) 100vw, (max-width: 1099px) 50vw, 33vw" /></span><span className="landing-collection-number" aria-hidden="true">0{index + 1} / 0{collections.length}</span><span className="landing-collection-label"><span><strong>{collection.title}</strong><span className="landing-collection-description">{collection.description}</span></span><span className="landing-collection-arrow"><ArrowRight aria-hidden="true" /></span></span></Link>)}</div>
        <Link className="landing-more-link landing-category-more" href={`/collections/${department}`}>View all categories <ArrowRight aria-hidden="true" /></Link>
      </section>
      <section id="shop" className="section products-section">
        <div className="section-heading"><div><p className="eyebrow purple">{page.edit}</p><h2>{page.editTitle}</h2></div><Link href={`/collections/${department}`}>View all products <ArrowRight /></Link></div>
        <div className="product-grid">{products.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} />)}</div>
        <Link className="landing-more-link" href={`/collections/${department}`}>View all {department === "hair" ? "hair" : "care & cosmetics"} products <ArrowRight aria-hidden="true" /></Link>
      </section>
      <section className="care-story" id="story">
        <div className="care-art story-photo"><Image src={department === "hair" ? "/images/story-hair-portrait.jpg" : "/images/story-cosmetics-care.jpg"} alt={department === "hair" ? "Woman with natural curly hair smiling" : "Woman caring for her hair during a self-care routine"} fill loading="eager" sizes="(max-width: 599px) 100vw, (max-width: 1099px) 50vw, 55vw" /></div>
        <div className="care-copy"><p className="eyebrow purple">Duchess guidance</p><h2>{page.storyTitle}</h2><p>{page.storyBody}</p><Link className="text-link" href="/journal">Explore the journal <ArrowRight /></Link></div>
      </section>
      <section className="newsletter">
        <DuchessMark className="newsletter-mark" /><p className="eyebrow">The private list</p><h2>New drops, care notes<br />and a little Duchess treatment.</h2>
        <form><label className="sr-only" htmlFor={`${department}-email`}>Email address</label><input id={`${department}-email`} type="email" placeholder="Your email address" /><button type="submit">Join us <ArrowRight /></button></form>
        <small>By subscribing, you agree to receive Duchess updates. Unsubscribe anytime.</small>
      </section>
      <footer>
        <div className="footer-brand"><span className="wordmark light">Duchess</span><p>Hair, care and beauty for every expression of you.</p></div>
        <div><h3>Departments</h3><Link href="/hair">Hair | Accessories</Link><Link href="/cosmetics">Hair Care &amp; Cosmetics</Link><Link href="/">Choose a department</Link></div>
        <div><h3>Help</h3><Link href="/shipping-returns">Delivery &amp; returns</Link><Link href="mailto:hello@duchess.ng">Contact us</Link><Link href="/terms">Terms</Link></div>
        <div><h3>Follow</h3><Link href="#instagram">Instagram</Link><Link href="#tiktok">TikTok</Link><Link href="#whatsapp">WhatsApp</Link></div>
        <p className="copyright">© 2026 Duchess. All rights reserved.</p>
      </footer>
    </main>
  );
}
