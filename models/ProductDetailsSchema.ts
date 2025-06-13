import mongoose from "mongoose";

const ProductDetailsSchema = new mongoose.Schema(
  {
    company_instagram_id: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    text_content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000, // Reasonable limit for text content
    },
  },
  {
    timestamps: true,
    // Create compound index for efficient queries
    indexes: [{ company_instagram_id: 1, createdAt: -1 }],
  }
);

export const ProductDetails =
  mongoose.models.ProductDetails ||
  mongoose.model("ProductDetails", ProductDetailsSchema);
