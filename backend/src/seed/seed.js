import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Tipologia from "../models/Tipologia.js";
import TokenMap from "../models/TokenMap.js";
import DefiInstrument from "../models/DefiInstrument.js";
import Listing from "../models/Listing.js";
import Socio from "../models/Socio.js";
import EventoChain from "../models/EventoChain.js";
import { TIPOLOGIAS, TOKEN_MAP, DEFI_INSTRUMENTS, LISTINGS, SOCIOS, EVENTOS } from "./data.js";

async function seed() {
  await connectDB();
  console.log("→ Limpiando colecciones…");
  await Promise.all([
    Tipologia.deleteMany({}),
    TokenMap.deleteMany({}),
    DefiInstrument.deleteMany({}),
    Listing.deleteMany({}),
    Socio.deleteMany({}),
    EventoChain.deleteMany({}),
  ]);

  console.log("→ Insertando datos de referencia…");
  await Tipologia.insertMany(TIPOLOGIAS);
  await TokenMap.insertMany(TOKEN_MAP);
  await DefiInstrument.insertMany(DEFI_INSTRUMENTS);
  await Listing.insertMany(LISTINGS);
  await Socio.insertMany(SOCIOS);
  await EventoChain.insertMany(EVENTOS);

  console.log("✓ Seed completado:");
  console.log(`  - ${TIPOLOGIAS.length} tipologías`);
  console.log(`  - ${TOKEN_MAP.length} tokens en el mapa`);
  console.log(`  - ${DEFI_INSTRUMENTS.length} instrumentos DeFi`);
  console.log(`  - ${LISTINGS.length} listings de marketplace`);
  console.log(`  - ${SOCIOS.length} socios (demo)`);
  console.log(`  - ${EVENTOS.length} eventos on-chain`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("✗ Error en seed:", err);
  process.exit(1);
});
