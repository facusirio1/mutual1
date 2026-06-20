import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    listingId: { type: String, required: true, unique: true, index: true },
    token: {
      type: String,
      required: true,
      enum: [
        "NFT-MEMBRESÍA",
        "NFT-DM2",
        "NFT-ADJUDICACIÓN",
        "NFT-PRÉSTAMO",
        "NFT-ESCRITURA",
        "NFT-BOND",
        "STAKE-PRÉSTAMO",
        "LP-TOKEN-DM2",
      ],
      index: true,
    },
    tipologia: { type: String, default: "" },
    cantidad: { type: Number, default: 1 },
    avance: { type: Number, default: null }, // % de obra, null si no aplica
    precioUnit: { type: Number, required: true },
    vendedor: { type: String, required: true },
    tokenId: { type: String, required: true },
    estado: {
      type: String,
      enum: ["activo", "vendido", "cancelado"],
      default: "activo",
      index: true,
    },
    comprador: { type: String, default: null },
  },
  { timestamps: true }
);

listingSchema.virtual("total").get(function () {
  return this.cantidad > 1 ? this.precioUnit * this.cantidad : this.precioUnit;
});

listingSchema.set("toJSON", { virtuals: true });
listingSchema.set("toObject", { virtuals: true });

export default mongoose.model("Listing", listingSchema);
