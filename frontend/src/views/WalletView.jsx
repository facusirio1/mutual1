import React, { useEffect, useState } from "react";
import { Wallet, ExternalLink, Home, ShieldCheck, MapPin } from "lucide-react";
import { SectionHeader, Card, Pill } from "../components/ui.jsx";
import { api, API_BASE } from "../lib/api.js";
import { CHAIN, FALLBACK } from "../lib/constants.js";

export default function WalletView({ walletConnected, connectWallet, wallet }) {
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!walletConnected) return;
    setLoading(true);
    api
      .getSocioMe(wallet, FALLBACK.socio)
      .then(setPosition)
      .finally(() => setLoading(false));
  }, [walletConnected, wallet]);

  if (!walletConnected) {
    return (
      <Card className="flex flex-col items-center gap-4 p-12 text-center">
        <Wallet size={28} className="text-[#E9C46A]" />
        <h3 className="font-serif text-xl text-[#F4EFE3]">Conectá tu wallet</h3>
        <p className="max-w-sm text-sm text-[#9AA7C7]">
          Para ver tu posición de dm², NFT y balances en Ettios Chain {CHAIN.id}, conectá tu wallet.
        </p>
        <button
          onClick={connectWallet}
          className="rounded-lg bg-[#B8860B] px-5 py-2.5 font-mono text-sm font-semibold text-[#1B2A4A]"
        >
          Conectar wallet
        </button>
      </Card>
    );
  }

  if (loading || !position)
    return <Card className="p-10 text-center text-sm text-[#7E8CB3]">Cargando posición…</Card>;

  const pct = Math.round((position.dm2Acumulados / position.dm2Total) * 100);
  const adjudicado = pct >= 70;
  const kycEstado = position.kyc?.estado || "pendiente";

  return (
    <div className="space-y-8">
      <SectionHeader
        index="—"
        title="Mi cuenta"
        subtitle={`Socio #${position.socioID} · ${position.tipologia || position.tipologiaCodigo}`}
      />

      {/* Fila superior: identidad + KYC + ubicación */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-center gap-2 text-[#E9C46A]">
            <Home size={16} />
            <span className="text-[11px] uppercase tracking-wide text-[#7E8CB3]">Plan</span>
          </div>
          <p className="mt-2 font-serif text-base text-[#F4EFE3]">{position.tipologia || position.tipologiaCodigo}</p>
          <p className="mt-1 font-mono text-[11px] text-[#9AA7C7]">{position.dm2Total?.toLocaleString()} dm² totales</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 text-[#E9C46A]">
            <ShieldCheck size={16} />
            <span className="text-[11px] uppercase tracking-wide text-[#7E8CB3]">KYC</span>
          </div>
          <div className="mt-2">
            <Pill tone={kycEstado === "aprobado" ? "green" : "ghost"}>{kycEstado}</Pill>
          </div>
          <p className="mt-2 font-mono text-[11px] text-[#9AA7C7] break-all">
            {position.wallet || wallet || "0x71...4fA2"}
          </p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 text-[#E9C46A]">
            <MapPin size={16} />
            <span className="text-[11px] uppercase tracking-wide text-[#7E8CB3]">Lote</span>
          </div>
          <p className="mt-2 font-serif text-base text-[#F4EFE3]">{position.barrio || "Barrio asignado"}</p>
          <p className="mt-1 font-mono text-[11px] text-[#9AA7C7]">{position.lote || "—"}</p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <p className="text-[11px] uppercase tracking-wide text-[#7E8CB3]">Progreso de adjudicación</p>
          <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-white/5">
            <div className="bg-gradient-to-r from-[#B8860B] to-[#E9C46A]" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-2 flex justify-between font-mono text-xs text-[#9AA7C7]">
            <span>
              {position.dm2Acumulados.toLocaleString()} / {position.dm2Total.toLocaleString()} dm²
            </span>
            <span className={adjudicado ? "text-emerald-300" : ""}>
              {pct}% — {adjudicado ? "adjudicado ✓" : "meta 70%"}
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "NFT-MEMBRESÍA", value: position.nftMembresia ? "Activo" : "—" },
              { label: "NFT-ADJUDICACIÓN", value: position.nftAdjudicacion ? "Emitido" : "Pendiente" },
              { label: "NFT-PRÉSTAMO", value: position.nftPrestamo ? "Activo" : "N/A" },
              { label: "Avance obra", value: `${position.avanceObra}%` },
            ].map((m) => (
              <div key={m.label} className="rounded-lg border border-white/10 bg-white/[0.02] p-3 text-center">
                <p className="font-mono text-sm text-[#E9C46A]">{m.value}</p>
                <p className="mt-1 text-[10px] uppercase tracking-wide text-[#7E8CB3]">{m.label}</p>
              </div>
            ))}
          </div>

          {position.nftEscritura && (
            <div className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 text-center font-mono text-xs text-emerald-300">
              NFT-ESCRITURA emitido — propiedad titulada en {CHAIN.explorer}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <p className="text-[11px] uppercase tracking-wide text-[#7E8CB3]">Balances</p>
          <div className="mt-3 space-y-3">
            {[
              { sym: "ETTIA", val: position.balanceETTIA },
              { sym: "USDT", val: position.balanceUSDT },
              { sym: "USDC", val: position.balanceUSDC },
            ].map((b) => (
              <div
                key={b.sym}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 p-3"
              >
                <span className="font-mono text-sm text-[#E7ECF8]">{b.sym}</span>
                <span className="font-mono text-sm text-[#E9C46A]">{(b.val ?? 0).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <a
            href={CHAIN.explorer}
            target="_blank"
            rel="noreferrer"
            className="mt-4 flex items-center justify-center gap-1.5 rounded-lg border border-white/10 py-2 text-xs font-mono text-[#9AA7C7] hover:text-[#E9C46A]"
          >
            Ver en explorer <ExternalLink size={12} />
          </a>
        </Card>
      </div>

      <Card className="p-5">
        <p className="font-mono text-[11px] text-[#5E6B8E]">
          Backend: <code className="text-[#E9C46A]">GET {API_BASE}/socios/me</code> combina el documento de la
          colección <code className="text-[#E9C46A]">socios</code> (MongoDB) con balances leídos on-chain (contratos
          NFT-DM2, NFT-MEMBRESÍA, NFT-PRÉSTAMO, NFT-AVANCE-OBRA) vía {CHAIN.rpc}.
        </p>
      </Card>
    </div>
  );
}
