import Socio from "../models/Socio.js";
import Tipologia from "../models/Tipologia.js";
import EventoChain from "../models/EventoChain.js";
import { CHAIN, PLAN } from "../config/chain.js";

// GET /api/v1/socios/me?wallet=0x...  (o /socios/me devuelve socio demo si no hay wallet)
export async function getMe(req, res, next) {
  try {
    const wallet = req.query.wallet;
    let socio;
    if (wallet) {
      socio = await Socio.findOne({ wallet });
    } else {
      socio = await Socio.findOne().sort({ createdAt: 1 }); // socio demo
    }
    if (!socio) return res.status(404).json({ error: "Socio no encontrado" });

    const tipologia = await Tipologia.findOne({ codigo: socio.tipologiaCodigo });
    res.json({
      ...socio.toJSON(),
      tipologia: tipologia ? tipologia.nombre : socio.tipologiaCodigo,
      chainId: CHAIN.id,
    });
  } catch (err) {
    next(err);
  }
}

export async function getSocio(req, res, next) {
  try {
    const socio = await Socio.findOne({ socioID: Number(req.params.socioID) });
    if (!socio) return res.status(404).json({ error: "Socio no encontrado" });
    res.json(socio);
  } catch (err) {
    next(err);
  }
}

export async function listSocios(req, res, next) {
  try {
    const socios = await Socio.find().sort({ socioID: 1 });
    res.json(socios);
  } catch (err) {
    next(err);
  }
}

// Registra una cuota pagada: suma dm² y, si cruza el 70%, emite adjudicación + préstamo
export async function pagarCuota(req, res, next) {
  try {
    const { dm2 = 0 } = req.body;
    const socio = await Socio.findOne({ socioID: Number(req.params.socioID) });
    if (!socio) return res.status(404).json({ error: "Socio no encontrado" });

    socio.dm2Acumulados = Math.min(socio.dm2Acumulados + Number(dm2), socio.dm2Total);

    await EventoChain.create({
      tipo: "CuotaPagada",
      socioID: socio.socioID,
      descripcion: `CuotaPagada(socioID=${socio.socioID}) → +${dm2} NFT-DM2`,
    });

    const ratio = socio.dm2Acumulados / socio.dm2Total;
    if (ratio >= PLAN.umbralAdjudicacion && !socio.nftAdjudicacion) {
      socio.nftAdjudicacion = true;
      socio.nftPrestamo = true;
      await EventoChain.create({
        tipo: "Adjudicacion",
        socioID: socio.socioID,
        descripcion: `Adjudicacion(socioID=${socio.socioID}) → Mint NFT-ADJUDICACIÓN + NFT-PRÉSTAMO 30%`,
      });
    }

    await socio.save();
    res.json(socio);
  } catch (err) {
    next(err);
  }
}
