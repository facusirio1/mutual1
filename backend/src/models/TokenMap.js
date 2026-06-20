import mongoose from "mongoose";

const tokenMapSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true, index: true },
    std: { type: String, required: true }, // ERC-721 / ERC-1155 / ERC-20
    emision: { type: String, required: true },
    funcion: { type: String, required: true },
    mkt: { type: String, required: true },
    orden: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("TokenMap", tokenMapSchema);
