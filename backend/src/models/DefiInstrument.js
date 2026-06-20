import mongoose from "mongoose";

const defiSchema = new mongoose.Schema(
  {
    codigo: { type: String, required: true, unique: true, index: true }, // lp, bond, stake, reserva
    nombre: { type: String, required: true },
    token: { type: String, required: true },
    apy: { type: Number, required: true },
    minimo: { type: Number, default: null },
    liquidez: { type: String, default: "" },
    uso: { type: String, default: "" },
    tvl: { type: Number, default: 0 }, // total value locked (referencial)
  },
  { timestamps: true }
);

export default mongoose.model("DefiInstrument", defiSchema);
