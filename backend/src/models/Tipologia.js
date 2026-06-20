import mongoose from "mongoose";

const tipologiaSchema = new mongoose.Schema(
  {
    codigo: { type: String, required: true, unique: true, index: true }, // ej. "100-cerr"
    nombre: { type: String, required: true },
    m2: { type: Number, required: true },
    costoTotal: { type: Number, required: true },
    meta70: { type: Number, required: true },
    prestamo30: { type: Number, required: true },
    cuotaAhorro: { type: Number, required: true },
    cuotaObra: { type: Number, required: true },
    mesesAhorro: { type: Number, required: true },
    mesesObra: { type: Number, required: true },
    dm2: { type: Number, required: true },
    usdDm2: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Tipologia", tipologiaSchema);
