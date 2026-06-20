import { Router } from "express";
import { getTipologias, getTipologia, getTokenMap } from "../controllers/planController.js";
import {
  getListings,
  getListing,
  createListing,
  buyListing,
} from "../controllers/marketplaceController.js";
import { getMe, getSocio, listSocios, pagarCuota } from "../controllers/socioController.js";
import {
  getDefiInstruments,
  simularDefi,
  cotizarSwap,
  getEventos,
} from "../controllers/defiController.js";
import { CHAIN, CONTRACTS, PLAN } from "../config/chain.js";

const router = Router();

// Meta / config pública del ecosistema
router.get("/config", (req, res) => {
  res.json({ chain: CHAIN, contracts: CONTRACTS, plan: PLAN });
});

// Plan
router.get("/tipologias", getTipologias);
router.get("/tipologias/:codigo", getTipologia);
router.get("/token-map", getTokenMap);

// Marketplace
router.get("/marketplace/listings", getListings);
router.get("/marketplace/listings/:id", getListing);
router.post("/marketplace/listings", createListing);
router.post("/marketplace/listings/:id/comprar", buyListing);

// Socios (Mi cuenta)
router.get("/socios", listSocios);
router.get("/socios/me", getMe);
router.get("/socios/:socioID", getSocio);
router.post("/socios/:socioID/pagar-cuota", pagarCuota);

// DeFi
router.get("/defi/instruments", getDefiInstruments);
router.post("/defi/simular", simularDefi);

// Swap
router.get("/swap/cotizacion", cotizarSwap);

// Eventos on-chain
router.get("/eventos", getEventos);

export default router;
