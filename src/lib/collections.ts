import type { Department, Product } from "@/lib/product-types";

export type Collection = {
  slug: string;
  title: string;
  description: string;
  department: Department;
  image: string;
  productSlugs: string[];
};

export const collections: Collection[] = [
  {
    slug: "womens-wigs",
    title: "Women's wigs",
    description: "Natural-looking lace wigs, from everyday bobs to statement curls.",
    department: "hair",
    image: "/images/product-curly-wig.png",
    productSlugs: ["amara-body-wave", "naya-blunt-bob", "zola-deep-curl"],
  },
  {
    slug: "mens-hair",
    title: "Men's wigs & hair systems",
    description: "Textured, straight, wavy and salt-and-pepper hair systems with realistic hairlines.",
    department: "hair",
    image: "/images/product-mens-textured-hair-system.png",
    productSlugs: ["kairo-textured-hair-system", "atlas-salt-pepper-system", "noah-deep-wave-system", "eli-straight-fade-system", "micah-brown-wave-system", "zion-coily-crop-system"],
  },
  {
    slug: "bundles-attachments",
    title: "Bundles & attachments",
    description: "Build a style of your own with extensions, attachments and lace pieces.",
    department: "hair",
    image: "/images/product-auburn-attachment.png",
    productSlugs: ["silky-straight-bundles", "auburn-water-wave", "melt-hd-frontal"],
  },
  {
    slug: "hair-care",
    title: "Hair care & treatments",
    description: "Cleanse, moisturise and style with care for every routine.",
    department: "cosmetics",
    image: "/images/product-shampoo-set.png",
    productSlugs: ["nourish-growth-ritual", "silk-hold-edge-control", "gentle-relaxer-system", "moisture-wash-duo", "vanilla-hair-mist"],
  },
  {
    slug: "mens-hair-care",
    title: "Men's hair care",
    description: "Cleansing, scalp care, styling and maintenance for hair and hair systems.",
    department: "cosmetics",
    image: "/images/product-mens-wash-duo.png",
    productSlugs: ["mens-scalp-wash-duo", "mens-scalp-serum", "mens-daily-scalp-moisturiser", "mens-hair-system-cleanse-kit", "mens-curl-defining-cream", "mens-hair-beard-oil"],
  },
  {
    slug: "lashes-beauty",
    title: "Lashes & beauty",
    description: "A finishing touch for every expression of beauty.",
    department: "cosmetics",
    image: "/images/product-lashes.png",
    productSlugs: ["featherlight-lash-set"],
  },
];

export function getDepartmentCollections(department: Department) {
  return collections.filter((collection) => collection.department === department);
}

export function getCollectionProducts(products: Product[], collection: Collection) {
  return collection.productSlugs
    .map((slug) => products.find((product) => product.slug === slug))
    .filter((product): product is Product => Boolean(product));
}
