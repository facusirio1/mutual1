import mongoose from "mongoose";

const eventoSchema = new mongoose.Schema(
  {
    tipo: { type: String, required: true, index: true }, // Inscripcion, CuotaPagada, etc.
    descripcion: { type: String, required: true },
    viviendaID: { type: Number, default: null },
    socioID: { type: Number, default: null },
    txHash: { type: String, default: null },
    blockNumber: { type: Number, default: null },
  },
  { timestamps: true }
);

eventoSchema.index({ createdAt: -1 });

export default mongoose.model("EventoChain", eventoSchema);
