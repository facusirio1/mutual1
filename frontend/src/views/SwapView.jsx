import React, { useEffect, useMemo, useState } from "react";
import { ArrowRightLeft } from "lucide-react";
import { SectionHeader, Card } from "../components/ui.jsx";
import { api } from "../lib/api.js";
import { CHAIN, CONTRACTS, SWAP_TOKENS } from "../lib/constants.js";

export default function SwapView() {
  const [from, setFrom] = useState("USDT");
  const [to, setTo] = useState("ETTIA");
  const [amountIn, setAmountIn] = useState("1000");
  const [slippage, setSlippage] = useState(0.5);
  const [quote, setQuote] = useState(null);

  // Cálculo local inmediato (fallback)
  const local = useMemo(() => {
    const val = parseFloat(amountIn) || 0;
    let amountOut;
    if (from === to) amountOut = val;
    else if (from === "ETTIA") amountOut = val / SWAP_TOKENS.USDT.rateToEttia;
    else if (to === "ETTIA") amountOut = val * SWAP_TOKENS[from].rateToEttia;
    else amountOut = val;
    const fee = amountOut * 0.003;
    const minOut = (amountOut - fee) * (1 - slippage / 100);
    return { amountOut, fee, minOut };
  }, [amountIn, from, to, slippage]);

  // Cotización del backend con debounce
  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        const q = await api.cotizarSwap(from, to, parseFloat(amountIn) || 0, slippage);
        setQuote(q);
      } catch {
        setQuote(null);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [from, to, amountIn, slippage]);

  const amountOut = quote ? quote.amountOut : local.amountOut;
  const fee = quote ? quote.fee : local.fee;
  const minOut = quote ? quote.minOut : local.minOut;

  function swapDirection() {
    setFrom(to);
    setTo(from);
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        index="—"
        title="Swap"
        subtitle="Pagar cuotas y operaciones del plan convirtiendo USDT / USDC a ETTIA"
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <Card className="p-6">
          <p className="text-[11px] uppercase tracking-wide text-[#7E8CB3]">Estás pagando</p>
          <div className="mt-2 flex items-center gap-3 rounded-lg border border-white/10 bg-black/30 p-3">
            <input
              type="number"
              value={amountIn}
              onChange={(e) => setAmountIn(e.target.value)}
              className="w-full bg-transparent font-mono text-xl text-[#E7ECF8] outline-none"
            />
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="rounded-md border border-white/10 bg-[#1B2A4A] px-2 py-1.5 font-mono text-sm text-[#E9C46A] outline-none"
            >
              {Object.keys(SWAP_TOKENS).map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="my-3 flex justify-center">
            <button
              onClick={swapDirection}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#1B2A4A] text-[#E9C46A] transition-transform hover:rotate-180"
            >
              <ArrowRightLeft size={14} />
            </button>
          </div>

          <p className="text-[11px] uppercase tracking-wide text-[#7E8CB3]">Recibes (estimado)</p>
          <div className="mt-2 flex items-center gap-3 rounded-lg border border-white/10 bg-black/30 p-3">
            <p className="w-full truncate font-mono text-xl text-[#E7ECF8]">
              {amountOut.toLocaleString("en-US", { maximumFractionDigits: to === "ETTIA" ? 4 : 2 })}
            </p>
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="rounded-md border border-white/10 bg-[#1B2A4A] px-2 py-1.5 font-mono text-sm text-[#E9C46A] outline-none"
            >
              {Object.keys(SWAP_TOKENS).map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 space-y-1.5 font-mono text-[11px] text-[#7E8CB3]">
            <div className="flex justify-between">
              <span>Fee del pool (0.3%)</span>
              <span>
                {fee.toLocaleString("en-US", { maximumFractionDigits: 4 })} {to}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Slippage</span>
              <span>{slippage}%</span>
            </div>
            <div className="flex justify-between">
              <span>Mínimo recibido</span>
              <span>
                {minOut.toLocaleString("en-US", { maximumFractionDigits: 4 })} {to}
              </span>
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            {[0.1, 0.5, 1].map((s) => (
              <button
                key={s}
                onClick={() => setSlippage(s)}
                className={`rounded-md border px-2.5 py-1 text-[11px] font-mono ${
                  slippage === s ? "border-[#B8860B] text-[#E9C46A]" : "border-white/10 text-[#7E8CB3]"
                }`}
              >
                {s}%
              </button>
            ))}
          </div>

          <button className="mt-5 w-full rounded-lg bg-[#B8860B] py-3 font-mono text-sm font-semibold text-[#1B2A4A] transition-colors hover:bg-[#cf9b15]">
            Confirmar swap
          </button>
          <p className="mt-2 text-center text-[10px] text-[#5E6B8E]">
            Router: {CONTRACTS.SWAP_ROUTER.slice(0, 12)}… · Ettios Chain {CHAIN.id}
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="font-serif text-lg text-[#F4EFE3]">Cómo se usa este swap en el plan</h3>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-[#9AA7C7]">
            <p>
              <span className="font-mono text-[#E9C46A]">Cuotas de ahorro y obra</span>: el socio puede acreditar
              su cuota mensual en USDT o USDC; el contrato de pagos convierte automáticamente a ETTIA al recibirlo,
              según el tipo de cambio del DEX Ettios.
            </p>
            <p>
              <span className="font-mono text-[#E9C46A]">Depósitos DeFi</span>: inversores externos depositan
              USDT/USDC en la Liquidity Pool dm² o suscriben NFT-BOND; el swap convierte el valor a ETTIA para
              acreditar la posición y calcular el APY.
            </p>
            <p>
              <span className="font-mono text-[#E9C46A]">Compras en Marketplace</span>: las órdenes de compra de
              NFT-DM2, NFT-ADJUDICACIÓN o NFT-ESCRITURA admiten pago en stablecoins; el router convierte a ETTIA
              antes de liquidar la operación y aplicar el fee 2.5%.
            </p>
          </div>
          <div className="mt-6 rounded-lg border border-white/10 bg-black/20 p-4 font-mono text-[11px] text-[#7E8CB3]">
            Pares disponibles: USDT/ETTIA · USDC/ETTIA · USDT/USDC
            <br />
            Liquidez provista por: Fondo de liquidez del pool (0.5% del fee de marketplace)
          </div>
        </Card>
      </div>
    </div>
  );
}
