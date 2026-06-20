import DefiInstrument from "../models/DefiInstrument.js";
import EventoChain from "../models/EventoChain.js";
import { PLAN, CHAIN } from "../config/chain.js";

const SWAP_RATES = { USDT: 4.2, USDC: 4.2, ETTIA: 1 };

export async function getDefiInstruments(req, res, next) {
  try {
    const instrumentos = await DefiInstrument.find().sort({ apy: -1 });
    res.json(instrumentos);
  } catch (err) {
    next(err);
  }
}

// POST /api/v1/defi/simular  { codigo, monto }
export async function simularDefi(req, res, next) {
  try {
    const { codigo, monto } = req.body;
    const inst = await DefiInstrument.findOne({ codigo });
    if (!inst) return res.status(404).json({ error: "Instrumento no encontrado" });
    const m = Number(monto) || 0;
    const rendimientoAnual = (m * inst.apy) / 100;
    res.json({
      instrumento: inst.nombre,
      apy: inst.apy,
      monto: m,
      rendimientoAnual,
      rendimientoMensual: rendimientoAnual / 12,
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/v1/swap/cotizacion?from=USDT&to=ETTIA&amount=1000&slippage=0.5
export async function cotizarSwap(req, res, next) {
  try {
    const { from = "USDT", to = "ETTIA", amount = 0, slippage = 0.5 } = req.query;
    const val = parseFloat(amount) || 0;
    let amountOut;
    if (from === to) amountOut = val;
    else if (from === "ETTIA") amountOut = val / SWAP_RATES.USDT;
    else if (to === "ETTIA") amountOut = val * (SWAP_RATES[from] || 1);
    else amountOut = val; // USDT <-> USDC ~1:1

    const fee = amountOut * PLAN.feeSwapPool;
    const minOut = (amountOut - fee) * (1 - Number(slippage) / 100);

    res.json({
      from,
      to,
      amountIn: val,
      amountOut,
      fee,
      slippage: Number(slippage),
      minOut,
      chainId: CHAIN.id,
    });
  } catch (err) {
    next(err);
  }
}

export async function getEventos(req, res, next) {
  try {
    const limit = Math.min(Number(req.query.limit) || 8, 50);
    const eventos = await EventoChain.find().sort({ createdAt: -1 }).limit(limit);
    res.json(eventos);
  } catch (err) {
    next(err);
  }
}
