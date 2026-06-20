import React, { useEffect, useMemo, useState } from "react";
import { SectionHeader, Card } from "../components/ui.jsx";
import { api } from "../lib/api.js";
import { CONTRACTS, FALLBACK, fmtUSD } from "../lib/constants.js";

export default function DefiView() {
  const [instruments, setInstruments] = useState(FALLBACK.defi);
  const [active, setActive] = useState("lp");
  const [amount, setAmount] = useState(1000);
  const [serverProjection, setServerProjection] = useState(null);

  useEffect(() => {
    api.getDefiInstruments(FALLBACK.defi).then(setInstruments);
  }, []);

  const inst = instruments.find((d) => d.codigo === active) || instruments[0];

  // Cálculo local inmediato
  const projectedLocal = useMemo(() => {
    if (!amount || amount <= 0) return 0;
    return (amount * inst.apy) / 100;
  }, [amount, inst]);

  // Consulta al backend (si está disponible) con debounce
  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        const r = await api.simularDefi(active, amount);
        setServerProjection(r.rendimientoAnual);
      } catch {
        setServerProjection(null);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [active, amount]);

  const projected = serverProjection != null ? serverProjection : projectedLocal;

  return (
    <div className="space-y-8">
      <SectionHeader
        index="04"
        title="DeFi — ingreso de capital externo"
        subtitle="El pool de préstamos del 30% crece sin límite de capital propio de la mutual"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {instruments.map((d) => (
          <button
            key={d.codigo}
            onClick={() => setActive(d.codigo)}
            className={`text-left rounded-xl border p-4 transition-colors ${
              active === d.codigo
                ? "border-[#B8860B] bg-[#B8860B]/10"
                : "border-white/10 bg-white/[0.02] hover:border-white/20"
            }`}
          >
            <p className="font-mono text-2xl text-[#E9C46A]">{d.apy}%</p>
            <p className="mt-1 text-sm text-[#F4EFE3]">{d.nombre}</p>
            <p className="mt-1 font-mono text-[11px] text-[#7E8CB3]">{d.token}</p>
          </button>
        ))}
      </div>

      <Card className="grid gap-0 overflow-hidden p-0 lg:grid-cols-2">
        <div className="p-6">
          <h3 className="font-serif text-lg text-[#F4EFE3]">{inst.nombre}</h3>
          <p className="mt-1 text-sm text-[#9AA7C7]">{inst.uso}</p>

          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-[#7E8CB3]">APY</span>
              <span className="font-mono text-[#E9C46A]">{inst.apy}%</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-[#7E8CB3]">Depósito mínimo</span>
              <span className="font-mono text-[#E7ECF8]">{inst.minimo ? fmtUSD(inst.minimo) : "N/A — interno"}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-[#7E8CB3]">Liquidez</span>
              <span className="font-mono text-[#E7ECF8]">{inst.liquidez}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7E8CB3]">Token</span>
              <span className="font-mono text-[#E7ECF8]">{inst.token}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 bg-[#0E1830] p-6 lg:border-l lg:border-t-0">
          <p className="text-[11px] uppercase tracking-wide text-[#7E8CB3]">Simulador de rendimiento</p>
          <div className="mt-3">
            <label className="text-xs text-[#9AA7C7]">Monto a depositar (USD)</label>
            <input
              type="number"
              value={amount}
              min={inst.minimo || 0}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 font-mono text-[#E7ECF8] outline-none focus:border-[#B8860B]"
            />
          </div>
          <div className="mt-5 rounded-lg border border-[#B8860B]/30 bg-[#B8860B]/5 p-4">
            <p className="text-[11px] uppercase tracking-wide text-[#E9C46A]/70">Rendimiento anual estimado</p>
            <p className="mt-1 font-mono text-2xl text-[#E9C46A]">{fmtUSD(projected)}</p>
            <p className="mt-1 text-[11px] text-[#7E8CB3]">
              Pagado{" "}
              {active === "bond"
                ? "semestralmente en ETTIA"
                : active === "stake"
                ? "según vencimiento del paquete"
                : "mensualmente en ETTIA"}
              .
            </p>
          </div>
          <button className="mt-4 w-full rounded-lg bg-[#1B2A4A] py-2.5 font-mono text-sm text-[#E9C46A] transition-colors hover:bg-[#22345e]">
            Depositar en contrato{" "}
            {active === "lp"
              ? CONTRACTS.LP_TOKEN_DM2.slice(0, 10) + "…"
              : active === "bond"
              ? CONTRACTS.NFT_BOND.slice(0, 10) + "…"
              : CONTRACTS.STAKE_PRESTAMO.slice(0, 10) + "…"}
          </button>
        </div>
      </Card>
    </div>
  );
}
