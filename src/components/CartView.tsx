"use client";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Header } from "@/components/Header";
import { useCommerce } from "@/components/CommerceProvider";
import { formatNaira } from "@/lib/product-types";

export function CartView() {
  const { cart, subtotal, setQuantity, removeFromCart } = useCommerce();
  return <main><Header /><section className="commerce-page"><div className="page-intro"><p className="eyebrow purple">Your selection</p><h1>Shopping bag</h1></div>{cart.length === 0 ? <div className="empty-state"><ShoppingBag /><h2>Your bag is ready when you are.</h2><p>Explore the collection and add something you love.</p><Link className="primary-action" href="/shop">Continue shopping</Link></div> : <div className="cart-layout"><div className="cart-list">{cart.map((item) => <article className="cart-item" key={`${item.product.id}-${item.option}`}><div className="cart-thumb"><Image src={item.product.image} alt={item.product.name} fill sizes="120px" /></div><div className="cart-item-copy"><p className="eyebrow">{item.product.category}</p><h2><Link href={`/products/${item.product.slug}`}>{item.product.name}</Link></h2><p>{item.option}</p><div className="quantity"><button onClick={() => setQuantity(item.product.id,item.option,item.quantity-1)} aria-label="Decrease quantity"><Minus /></button><span>{item.quantity}</span><button onClick={() => setQuantity(item.product.id,item.option,item.quantity+1)} aria-label="Increase quantity"><Plus /></button></div></div><div className="cart-line-price"><strong>{formatNaira(item.product.priceKobo * item.quantity)}</strong><button onClick={() => removeFromCart(item.product.id,item.option)} aria-label={`Remove ${item.product.name}`}><Trash2 /></button></div></article>)}</div><aside className="order-summary"><h2>Order summary</h2><div><span>Subtotal</span><strong>{formatNaira(subtotal)}</strong></div><div><span>Delivery</span><span>Calculated at checkout</span></div><div className="summary-total"><span>Total</span><strong>{formatNaira(subtotal)}</strong></div><Link className="primary-action" href="/checkout">Continue to checkout</Link><Link className="continue-link" href="/shop">Continue shopping</Link></aside></div>}</section></main>;
}
