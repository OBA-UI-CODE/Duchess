import Image from "next/image";
import { Heart, Plus } from "lucide-react";

type Product = {
  name: string;
  category: string;
  price: string;
  imageClass: string;
  image: string;
  badge?: string;
};

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <div className={`product-image ${product.imageClass}`}>
        <Image src={product.image} alt={product.name} fill sizes="(min-width: 1100px) 25vw, (min-width: 600px) 33vw, 50vw" />
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <button className="wishlist" aria-label={`Save ${product.name}`}><Heart /></button>
      </div>
      <div className="product-copy">
        <p className="eyebrow">{product.category}</p>
        <h3>{product.name}</h3>
        <div className="product-row">
          <p>{product.price}</p>
          <button aria-label={`Choose options for ${product.name}`}><Plus /></button>
        </div>
      </div>
    </article>
  );
}
