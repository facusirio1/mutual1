import React, { useEffect, useState } from "react";
import { Coins, FileCheck, Hammer, Store, Shield, Activity, ArrowRightLeft } from "lucide-react";
import { Pill, Card, SectionHeader } from "../components/ui.jsx";
import { api } from "../lib/api.js";
import { CHAIN, FALLBACK } from "../lib/constants.js";

export default function EcosistemaView() {
  const [tokenMap, setTokenMap] = useState(FALLBACK.tokenMap);
  const [eventFeed, setEventFeed] = useState(FALLBACK.eventos.slice(0, 4));

  useEffect(() => {
    api.getTokenMap(FALLBACK.tokenMap).then(setTokenMap);
  }, []);

  // Polling del feed de eventos on-chain
  useEffect(() => {
    let cancel = false;
    async function poll() {
      const ev = await api.getEventos(6, FALLBACK.eventos);
      if (!cancel) setEventFeed(ev.map((e) => e.descripcion || e));
    }
    poll();
    const interval = setInterval(poll, 6000);
    return () => {
      cancel = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="space-y-10">
      <Card className="overflow-hidden">
        <div className="grid gap-0 lg:grid-cols-[1.3fr_1fr]">
          <div className="p-6 sm:p-10">
            <Pill tone="gold">Ecosistema 100% NFT + Marketplace + DeFi</Pill>
            <h1 className="mt-4 font-serif text-3xl leading-tight text-[#F4EFE3] sm:text-4xl">
              Cada cuota, préstamo y escritura existe como un token verificable en{" "}
              <span className="text-[#E9C46A]">scan.ettiosblockchain.io</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#AEB9D6] sm:text-base">
              Tokenización por dm² (ERC-1155), escritura definitiva (ERC-721) y capital externo vía LP,
              Bond y Staking sobre Ettios Blockchain. Dirigido a propietarios de lotes en barrios privados
              sin acceso a crédito bancario.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Adjudicación", value: "70% dm²" },
                { label: "Préstamo mutual", value: "6% anual" },
                { label: "Fee marketplace", value: "2.5%" },
                { label: "Mejor APY DeFi", value: "9% NFT-BOND" },
              ].map((s) => (
                <div key={s.label} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                  <p className="font-mono text-lg text-[#E9C46A]">{s.value}</p>
                  <p className="mt-0.5 text-[11px] uppercase tracking-wide text-[#7E8CB3]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-white/10 bg-[#0E1830] p-6 sm:p-8 lg:border-l lg:border-t-0">
            <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-widest text-[#7E8CB3]">
              <Activity size={13} className="text-[#E9C46A]" /> Feed de eventos on-chain
            </div>
            <div className="space-y-2 font-mono text-[11px] leading-relaxed">
              {eventFeed.map((e, i) => (
                <div
                  key={e + i}
                  className={`rounded border border-white/5 bg-black/30 p-2.5 text-[#9AA7C7] transition-opacity ${
                    i === 0 ? "opacity-100" : "opacity-70"
                  }`}
                >
                  <span className="text-[#E9C46A]">▸</span> {e}
                </div>
              ))}
            </div>
            <p className="mt-4 text-[10px] text-[#5E6B8E]">
              * En producción se conecta a logs de eventos del contrato vía RPC {CHAIN.rpc}.
            </p>
          </div>
        </div>
      </Card>

      <section>
        <SectionHeader index="01" title="Mecanismo central" subtitle="Cómo se mueve un socio dentro del ecosistema" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Coins, title: "Acumulación dm²", text: "El socio paga cuotas y recibe tokens ERC-1155 NFT-DM2, 1 token = 1 dm²." },
            { icon: FileCheck, title: "Adjudicación 70%", text: "Al llegar al 70% del total de dm², se emite NFT-ADJUDICACIÓN y comienza la obra." },
            { icon: Hammer, title: "Préstamo 30%", text: "La mutual presta el 30% restante (NFT-PRÉSTAMO, 6% anual), cancelable en 12 cuotas." },
            { icon: Store, title: "Mercado secundario", text: "Todos los NFT transables cotizan en Ettios Marketplace con fee del 2.5%." },
          ].map((step, idx) => (
            <Card key={step.title} className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1B2A4A] text-[#E9C46A]">
                  <step.icon size={16} />
                </div>
                <span className="font-mono text-xs text-[#5E6B8E]">0{idx + 1}</span>
              </div>
              <h3 className="font-serif text-base text-[#F4EFE3]">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[#9AA7C7]">{step.text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader
          index="02"
          title="Mapa de tokens del plan"
          subtitle="ERC-1155 para instancias múltiples · ERC-721 para derechos únicos · ERC-20 para liquidez"
        />
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider text-[#7E8CB3]">
                <th className="px-4 py-3 font-medium">Token</th>
                <th className="px-4 py-3 font-medium">Estándar</th>
                <th className="px-4 py-3 font-medium">Emisión</th>
                <th className="px-4 py-3 font-medium">Función</th>
                <th className="px-4 py-3 font-medium">Marketplace</th>
              </tr>
            </thead>
            <tbody>
              {tokenMap.map((t) => (
                <tr key={t.token} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-mono text-[#E9C46A]">{t.token}</td>
                  <td className="px-4 py-3">
                    <Pill tone="ghost">{t.std}</Pill>
                  </td>
                  <td className="px-4 py-3 text-[#AEB9D6]">{t.emision}</td>
                  <td className="px-4 py-3 text-[#AEB9D6]">{t.funcion}</td>
                  <td className="px-4 py-3 text-[#9AA7C7]">{t.mkt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </section>

      <section>
        <SectionHeader index="03" title="Integración técnica" subtitle="Stack: Ettios Blockchain + backend Node/Express + MongoDB" />
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-5">
            <Shield size={16} className="text-[#E9C46A]" />
            <h3 className="mt-2 font-serif text-base text-[#F4EFE3]">On-chain — Ettios</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-[#9AA7C7]">
              Contratos ERC-721/1155/20 desplegados en Chain ID {CHAIN.id}. La UI lee balances, eventos y
              precios de marketplace vía RPC y verifica en {CHAIN.explorer}.
            </p>
          </Card>
          <Card className="p-5">
            <Activity size={16} className="text-[#E9C46A]" />
            <h3 className="mt-2 font-serif text-base text-[#F4EFE3]">Off-chain — MongoDB</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-[#9AA7C7]">
              Colecciones: <code className="font-mono text-[#E9C46A]">socios</code>,{" "}
              <code className="font-mono text-[#E9C46A]">listings</code>,{" "}
              <code className="font-mono text-[#E9C46A]">tipologias</code>,{" "}
              <code className="font-mono text-[#E9C46A]">eventos</code> — indexan eventos del contrato para
              búsquedas rápidas y KYC.
            </p>
          </Card>
          <Card className="p-5">
            <ArrowRightLeft size={16} className="text-[#E9C46A]" />
            <h3 className="mt-2 font-serif text-base text-[#F4EFE3]">Swap & Marketplace</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-[#9AA7C7]">
              Router de swap USDT/USDC → ETTIA para pagos de cuota, y Marketplace con fee 2.5% (1.5% mutual /
              0.5% liquidez / 0.5% quema ETTIA).
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
}
