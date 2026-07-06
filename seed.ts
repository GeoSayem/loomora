// Seeds the database with an admin account, categories, and sample
// products so the storefront isn't empty on first run.
// Usage: npm run seed   (requires .env.local with MONGODB_URI + JWT_SECRET set)

import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Category from "../models/Category";
import Product from "../models/Product";
import User from "../models/User";

const MONGODB_URI = process.env.MONGODB_URI as string;

const categories = [
  { name: "Hand Tufted Carpets", slug: "hand-tufted-carpets" },
  { name: "Handmade Rugs", slug: "handmade-rugs" },
  { name: "Modern Rugs", slug: "modern-rugs" },
  { name: "Persian Style Rugs", slug: "persian-style-rugs" },
  { name: "Custom Rugs", slug: "custom-rugs" },
  { name: "Luxury Carpets", slug: "luxury-carpets" },
];

const sampleImages = [
  "https://images.unsplash.com/photo-1600166898405-da9535204843?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1584589167171-541ce45f1eea?q=80&w=1200&auto=format&fit=crop",
];

const products = [
  {
    name: "Amara Hand-Knotted Wool Rug",
    category: "handmade-rugs",
    description:
      "A richly textured hand-knotted rug in warm ivory and camel tones, knotted by master artisans over six weeks.",
    materialDetails: "100% hand-carded wool, cotton foundation, hand-knotted (80 knots per sq inch).",
    images: sampleImages,
    basePrice: 24999,
    compareAtPrice: 29999,
    sizes: [
      { label: "4x6 ft", widthFt: 4, heightFt: 6, priceModifier: 0, stock: 8 },
      { label: "5x8 ft", widthFt: 5, heightFt: 8, priceModifier: 12000, stock: 6 },
      { label: "8x10 ft", widthFt: 8, heightFt: 10, priceModifier: 32000, stock: 3 },
    ],
    colors: [{ name: "Ivory", hex: "#F1E9D8" }, { name: "Camel", hex: "#B8874B" }],
    tags: ["best-seller", "featured"],
  },
  {
    name: "Meridian Modern Tufted Rug",
    category: "modern-rugs",
    description: "Bold geometric linework in a low-pile modern tuft, designed for contemporary living rooms.",
    materialDetails: "Hand-tufted New Zealand wool with viscose highlights.",
    images: sampleImages,
    basePrice: 18999,
    sizes: [
      { label: "5x8 ft", widthFt: 5, heightFt: 8, priceModifier: 0, stock: 10 },
      { label: "8x10 ft", widthFt: 8, heightFt: 10, priceModifier: 15000, stock: 4 },
    ],
    colors: [{ name: "Charcoal", hex: "#241E17" }, { name: "Gold", hex: "#AD8347" }],
    tags: ["new-arrival", "featured"],
  },
  {
    name: "Shiraz Persian-Style Medallion Rug",
    category: "persian-style-rugs",
    description: "A traditional central medallion design inspired by classic Shiraz weaves, in deep reds and indigo.",
    materialDetails: "Hand-knotted wool and silk blend, 120 knots per sq inch.",
    images: sampleImages,
    basePrice: 45999,
    sizes: [
      { label: "6x9 ft", widthFt: 6, heightFt: 9, priceModifier: 0, stock: 5 },
      { label: "9x12 ft", widthFt: 9, heightFt: 12, priceModifier: 38000, stock: 2 },
    ],
    colors: [{ name: "Deep Red", hex: "#6B2B22" }, { name: "Indigo", hex: "#2C3E56" }],
    tags: ["best-seller"],
  },
  {
    name: "Alba Luxury Silk Carpet",
    category: "luxury-carpets",
    description: "An heirloom-quality silk carpet with a subtle sheen, hand-knotted for exceptional detail.",
    materialDetails: "100% mulberry silk, hand-knotted, 300+ knots per sq inch.",
    images: sampleImages,
    basePrice: 89999,
    sizes: [{ label: "6x9 ft", widthFt: 6, heightFt: 9, priceModifier: 0, stock: 2 }],
    colors: [{ name: "Pearl", hex: "#F1E9D8" }],
    tags: ["featured", "new-arrival"],
  },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  // Admin user
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@loomoraco.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await User.create({ name: "Loomora Admin", email: adminEmail, passwordHash, role: "admin" });
    console.log(`Created admin user: ${adminEmail} / ${adminPassword} (change this password immediately)`);
  } else {
    console.log("Admin user already exists, skipping.");
  }

  // Categories
  for (const cat of categories) {
    await Category.findOneAndUpdate({ slug: cat.slug }, cat, { upsert: true });
  }
  console.log(`Seeded ${categories.length} categories.`);

  // Products
  for (const p of products) {
    const slug = p.name.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");
    const totalStock = p.sizes.reduce((sum, s) => sum + s.stock, 0);
    await Product.findOneAndUpdate({ slug }, { ...p, slug, totalStock }, { upsert: true });
  }
  console.log(`Seeded ${products.length} sample products.`);

  await mongoose.disconnect();
  console.log("Done.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
