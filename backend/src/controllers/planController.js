import Tipologia from "../models/Tipologia.js";
import TokenMap from "../models/TokenMap.js";

export async function getTipologias(req, res, next) {
  try {
    const tipologias = await Tipologia.find().sort({ m2: 1, costoTotal: 1 });
    res.json(tipologias);
  } catch (err) {
    next(err);
  }
}

export async function getTipologia(req, res, next) {
  try {
    const tip = await Tipologia.findOne({ codigo: req.params.codigo });
    if (!tip) return res.status(404).json({ error: "Tipología no encontrada" });
    res.json(tip);
  } catch (err) {
    next(err);
  }
}

export async function getTokenMap(req, res, next) {
  try {
    const tokens = await TokenMap.find().sort({ orden: 1 });
    res.json(tokens);
  } catch (err) {
    next(err);
  }
}
