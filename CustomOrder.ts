import { Schema, models, model } from "mongoose";

const CustomOrderSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    widthFt: { type: Number, required: true },
    heightFt: { type: Number, required: true },
    material: { type: String, required: true },
    referenceImage: String,
    notes: String,
    estimatedPrice: { type: Number, required: true },
    status: { type: String, enum: ["new", "reviewing", "quoted", "closed"], default: "new" },
  },
  { timestamps: true }
);

export default models.CustomOrder || model("CustomOrder", CustomOrderSchema);
