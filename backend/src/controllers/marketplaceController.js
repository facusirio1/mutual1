import Listing from "../models/Listing.js";
import EventoChain from "../models/EventoChain.js";
import { CONTRACTS, CHAIN, PLAN } from "../config/chain.js";

export async function getListings(req, res, next) {
  try {
    const { token, estado = "activo" } = req.query;
    const filtro = { estado };
    if (token && token !== "Todos") filtro.token = token;
    const listings = await Listing.find(filtro).sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    next(err);
  }
}

export async function getListing(req, res, next) {
  try {
    const listing = await Listing.findOne({ listingId: req.params.id });
    if (!listing) return res.status(404).json({ error: "Listing no encontrado" });
    res.json(listing);
  } catch (err) {
    next(err);
  }
}

export async function createListing(req, res, next) {
  try {
    const data = req.body;
    if (!data.listingId) {
      data.listingId = "lst-" + Date.now().toString(36);
    }
    const listing = await Listing.create(data);

    await EventoChain.create({
      tipo: "NuevoListing",
      descripcion: `Listing ${listing.token} creado por ${listing.vendedor} → ${listing.tokenId}`,
    });

    res.status(201).json(listing);
  } catch (err) {
    next(err);
  }
}

// Simula la ejecución de una compra: marca vendido, registra evento con fee distribuido
export async function buyListing(req, res, next) {
  try {
    const { comprador } = req.body;
    const listing = await Listing.findOne({ listingId: req.params.id, estado: "activo" });
    if (!listing) return res.status(404).json({ error: "Listing no disponible" });

    listing.estado = "vendido";
    listing.comprador = comprador || "0x000...comprador";
    await listing.save();

    const total = listing.total;
    const fee = total * PLAN.feeMarketplace;

    await EventoChain.create({
      tipo: "VentaMKT",
      descripcion: `VentaMKT(${listing.token}, vendedor=${listing.vendedor}, comprador=${listing.comprador}) → Fee ${(
        PLAN.feeMarketplace * 100
      ).toFixed(1)}% distribuido`,
    });

    res.json({
      listing,
      liquidacion: {
        total,
        fee,
        distribucion: {
          mutual: total * PLAN.feeDistribucion.mutual,
          liquidez: total * PLAN.feeDistribucion.liquidez,
          quema: total * PLAN.feeDistribucion.quema,
        },
        contrato: CONTRACTS.MARKETPLACE,
        chainId: CHAIN.id,
      },
    });
  } catch (err) {
    next(err);
  }
}
