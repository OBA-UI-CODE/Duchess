import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Headphones, PackageCheck, ShieldCheck, Sparkles } from "lucide-react";
import { Header } from "@/components/Header";
import { DuchessMark } from "@/components/Icons";
import { ProductCard } from "@/components/ProductCard";

const products = [
  { name: "The Amara Body Wave", category: "Premium wig · 24 inch", price: "₦185,000", imageClass: "wig-one", badge: "Bestseller" },
  { name: "Silky Straight Bundle", category: "Human hair · 20 inch", price: "₦68,500", imageClass: "wig-two" },
  { name: "Nourish Growth Oil", category: "Hair treatment · 100ml", price: "₦12,500", imageClass: "care-one", badge: "New" },
  { name: "Repair & Restore Mask", category: "Deep conditioner · 300ml", price: "₦18,000", imageClass: "care-two" },
];

export default function Home() {
  return (
    <main>
      <Header />

      <section className="split-hero" aria-labelledby="hero-title">
        <h1 id="hero-title" className="sr-only">Duchess hair and cosmetics</h1>
        <article id="hair" className="hero-panel hero-hair">
          <Image src="/images/duchess-hair-hero.png" alt="Model wearing a long dark body-wave wig" fill priority sizes="(min-width: 600px) 50vw, 100vw" />
          <div className="hero-shade" />
          <div className="hero-content light-copy">
            <p className="hero-kicker">Your crown, your way</p>
            <h2>Hair that<br />moves with you.</h2>
            <p>Wigs, attachments and textures selected to make every look feel unmistakably yours.</p>
            <Link className="button button-light" href="#new">Shop hair <ArrowRight /></Link>
          </div>
        </article>
        <article id="cosmetics" className="hero-panel hero-care">
          <Image src="/images/duchess-cosmetics-hero.png" alt="Hair creams, growth oil and lashes arranged on warm stone plinths" fill priority sizes="(min-width: 600px) 50vw, 100vw" />
          <div className="hero-shade care" />
          <div className="hero-content dark-copy">
            <p className="hero-kicker">Rituals worth keeping</p>
            <h2>Care made<br />for your crown.</h2>
            <p>Growth oils, treatments, relaxers and beauty essentials for healthy hair and everyday confidence.</p>
            <Link className="button button-dark" href="#new">Shop cosmetics <ArrowRight /></Link>
          </div>
        </article>
        <div className="hero-seal" aria-hidden="true"><DuchessMark /></div>
      </section>

      <section className="trust-strip" aria-label="Shopping benefits">
        <div><PackageCheck /><span><strong>Nationwide delivery</strong>Carefully packed, wherever you are</span></div>
        <div><ShieldCheck /><span><strong>Secure payments</strong>Protected checkout with Paystack</span></div>
        <div><Headphones /><span><strong>Beauty support</strong>Real help before and after you buy</span></div>
      </section>

      <section id="new" className="section products-section">
        <div className="section-heading">
          <div><p className="eyebrow purple">The Duchess edit</p><h2>Beautifully chosen.<br />Ready for you.</h2></div>
          <Link href="#catalogue">Shop all products <ArrowRight /></Link>
        </div>
        <div className="product-grid">
          {products.map((product) => <ProductCard key={product.name} product={product} />)}
        </div>
      </section>

      <section className="care-story" id="story">
        <div className="care-art" aria-hidden="true">
          <div className="arch arch-one" /><div className="arch arch-two" />
          <div className="bottle tall" /><div className="bottle short" /><Sparkles className="sparkles" />
        </div>
        <div className="care-copy">
          <p className="eyebrow purple">More than beauty</p>
          <h2>Know what your hair actually needs.</h2>
          <p>Great hair days start with the right knowledge. Duchess pairs carefully chosen products with simple guidance for your texture, routine and goals.</p>
          <Link className="text-link" href="#journal">Explore the hair journal <ArrowRight /></Link>
        </div>
      </section>

      <section className="newsletter">
        <DuchessMark className="newsletter-mark" />
        <p className="eyebrow">The private list</p>
        <h2>New drops, care notes<br />and a little Duchess treatment.</h2>
        <form><label className="sr-only" htmlFor="email">Email address</label><input id="email" type="email" placeholder="Your email address" /><button type="submit">Join us <ArrowRight /></button></form>
        <small>By subscribing, you agree to receive Duchess updates. Unsubscribe anytime.</small>
      </section>

      <footer>
        <div className="footer-brand"><span className="wordmark light">Duchess</span><p>Hair, care and beauty for every expression of you.</p></div>
        <div><h3>Shop</h3><Link href="#hair">Hair</Link><Link href="#cosmetics">Cosmetics</Link><Link href="#new">New arrivals</Link></div>
        <div><h3>Help</h3><Link href="#delivery">Delivery & returns</Link><Link href="#contact">Contact us</Link><Link href="#faq">FAQs</Link></div>
        <div><h3>Follow</h3><Link href="#instagram">Instagram</Link><Link href="#tiktok">TikTok</Link><Link href="#whatsapp">WhatsApp</Link></div>
        <p className="copyright">© 2026 Duchess. All rights reserved.</p>
      </footer>
    </main>
  );
}
