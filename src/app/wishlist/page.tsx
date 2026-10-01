import type { Metadata } from "next";
import { WishlistView } from "@/components/WishlistView";

export const metadata: Metadata = { title: "Wishlist", description: "Your saved Duchess hair and beauty products." };
export default function WishlistPage() { return <WishlistView />; }
