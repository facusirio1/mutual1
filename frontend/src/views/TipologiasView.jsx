import React, { useEffect, useState } from "react";
import { SectionHeader, Card } from "../components/ui.jsx";
import { api } from "../lib/api.js";
import { FALLBACK, fmtUSD } from "../lib/constants.js";

export default function TipologiasView() {
  const [tipologias, setTipologias] = useState(FALLBACK.tipologias);
  const [selected, setSelected] = useState(FALLBACK.tipologias[2].codigo);

  useEffect(() => {
    api.getTipologias(FALLBACK.tipologias).then((data) => {
      setTipologias(data);
      if (data.length && !data.find((t) => t.codigo === selected)) setSelected(data[2]?.codigo || data[0].codigo);
    });
  }, []);

  const tip = tipologias.find((t) => t.codigo === selected) || tipologias[0];
  const totalSocio = tip.meta70 + tip.prestamo30;

  return (
    <div className="space-y-8">
      <SectionHeader
        index="—"
        title="Tipologías y plan de pagos"
        subtitle="Selecciona una tipología para ver su estructura de tokenización por dm²"
      />

      <div className="flex flex-wrap gap-2">
        {tipologias.map((t) => (
          <button
            key={t.codigo}
            onClick={() => setSelected(t.codigo)}
            className={`rounded-lg border px-4 py-2 text-sm font-mono transition-colors ${
              selected === t.codigo
                ? "border-[#B8860B] bg-[#B8860B]/15 text-[#E9C46A]"
                : "border-white/10 bg-white/[0.02] text-[#9AA7C7] hover:border-white/20"
            }`}
          >
            {t.nombre}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <h3 className="font-serif text-lg text-[#F4EFE3]">{tip.nombre}</h3>
          <p className="mt-1 text-sm text-[#9AA7C7]">
            Costo total {fmtUSD(tip.costoTotal)} · {tip.dm2.toLocaleString()} dm² · {fmtUSD(tip.usdDm2)} por dm²
          </p>

          <div className="mt-6">
            <div className="mb-1.5 flex justify-between font-mono text-xs text-[#7E8CB3]">
              <span>Meta 70% — {fmtUSD(tip.meta70)}</span>
              <span>Préstamo 30% — {fmtUSD(tip.prestamo30)}</span>
            </div>
            <div className="flex h-3 overflow-hidden rounded-full bg-white/5">
              <div className="bg-gradient-to-r from-[#B8860B] to-[#E9C46A]" style={{ width: "70%" }} />
              <div className="bg-[#3A5BFF]/60" style={{ width: "30%" }} />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Cuota ahorro", value: fmtUSD(tip.cuotaAhorro), sub: `${tip.mesesAhorro} meses` },
              { label: "Cuota obra", value: fmtUSD(tip.cuotaObra), sub: `${tip.mesesObra} meses` },
              { label: "Préstamo", value: fmtUSD(tip.prestamo30), sub: "6% anual USD" },
              { label: "Total socio", value: fmtUSD(totalSocio), sub: "ahorro + préstamo" },
            ].map((m) => (
              <div key={m.label} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                <p className="font-mono text-base text-[#E9C46A]">{m.value}</p>
                <p className="mt-0.5 text-[11px] uppercase tracking-wide text-[#7E8CB3]">{m.label}</p>
                <p className="text-[11px] text-[#5E6B8E]">{m.sub}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-lg border border-[#B8860B]/30 bg-[#B8860B]/5 p-4 font-mono text-xs text-[#E9C46A]">
            tokenID NFT-DM2 = (viviendaID &lt;&lt; 128) | dm2Index — ejemplo: emisión #{tip.dm2.toLocaleString()} mintea
            hasta dm²Index {tip.dm2 - 1}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-serif text-lg text-[#F4EFE3]">Etapas de obra</h3>
          <p className="mt-1 text-sm text-[#9AA7C7]">NFT-AVANCE-OBRA por etapa certificada</p>
          <div className="mt-4 space-y-3">
            {[
              { etapa: "Etapa 0", desc: "Excavación, fundaciones, replanteo", pct: 15 },
              { etapa: "Etapa 1", desc: "Estructura completa, mampostería", pct: 25 },
              { etapa: "Etapa 2", desc: "Cubierta, instalaciones, contrapisos", pct: 25 },
              { etapa: "Etapa 3", desc: "Cielorraso, revoques, pisos, pintura", pct: 25 },
              { etapa: "Etapa 4", desc: "Baños, carpintería, limpieza final", pct: 10 },
            ].map((e) => (
              <div key={e.etapa}>
                <div className="flex justify-between text-xs text-[#9AA7C7]">
                  <span className="font-mono text-[#E9C46A]">{e.etapa}</span>
                  <span>{e.pct}%</span>
                </div>
                <p className="text-[11px] text-[#7E8CB3]">{e.desc}</p>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full bg-[#E9C46A]/70" style={{ width: `${e.pct * 4}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
