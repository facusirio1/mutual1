import mongoose from "mongoose";

const socioSchema = new mongoose.Schema(
  {
    socioID: { type: Number, required: true, unique: true, index: true },
    nombre: { type: String, default: "" },
    email: { type: String, default: "" },
    wallet: { type: String, required: true, unique: true, index: true },
    tipologiaCodigo: { type: String, required: true }, // FK lógica a Tipologia.codigo
    barrio: { type: String, default: "" },
    lote: { type: String, default: "" },

    // Progreso de tokenización
    dm2Acumulados: { type: Number, default: 0 },
    dm2Total: { type: Number, required: true },
    avanceObra: { type: Number, default: 0 }, // 0-100

    // Estado de NFTs
    nftMembresia: { type: Boolean, default: false },
    nftAdjudicacion: { type: Boolean, default: false },
    nftPrestamo: { type: Boolean, default: false },
    nftEscritura: { type: Boolean, default: false },

    // Balances on-chain (cache off-chain; en prod se leen vía RPC)
    balanceETTIA: { type: Number, default: 0 },
    balanceUSDT: { type: Number, default: 0 },
    balanceUSDC: { type: Number, default: 0 },

    kyc: {
      estado: { type: String, enum: ["pendiente", "aprobado", "rechazado"], default: "pendiente" },
      verificadoEn: { type: Date },
    },
  },
  { timestamps: true }
);

// Campo virtual: % de progreso hacia la meta del 70%
socioSchema.virtual("porcentajeAdjudicacion").get(function () {
  if (!this.dm2Total) return 0;
  return Math.round((this.dm2Acumulados / this.dm2Total) * 100);
});

socioSchema.set("toJSON", { virtuals: true });
socioSchema.set("toObject", { virtuals: true });

export default mongoose.model("Socio", socioSchema);
