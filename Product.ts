import { Schema, models, model } from "mongoose";

const SizeOptionSchema = new Schema(
  {
    label: { type: String, required: true }, // "5x8 ft"
    widthFt: { type: Number, required: true },
    heightFt: { type: Number, required: true },
    priceModifier: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
  },
  { _id: false }
);

const ColorOptionSchema = new Schema(
  {
    name: { type: String, required: true },
    hex: { type: String, required: true },
    imageIndex: { type: Number, default: 0 },
  },
  { _id: false }
);

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: { type: String, required: true, index: true }, // category slug
    description: { type: String, required: true },
    materialDetails: { type: String, required: true },
    careInstructions: String,
    images: { type: [String], required: true },
    basePrice: { type: Number, required: true }, // INR, base currency
    compareAtPrice: Number,
    sizes: { type: [SizeOptionSchema], required: true },
    colors: { type: [ColorOptionSchema], required: true },
    tags: { type: [String], default: [] }, // "best-seller" | "new-arrival" | "featured"
    ratingAverage: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    totalStock: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    seoTitle: String,
    seoDescription: String,
  },
  { timestamps: true }
);

ProductSchema.index({ name: "text", description: "text", tags: "text" });

export default models.Product || model("Product", ProductSchema);
