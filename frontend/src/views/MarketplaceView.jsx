import React, { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { SectionHeader, Card, Pill } from "../components/ui.jsx";
import { api, API_BASE } from "../lib/api.js";
import { CHAIN, CONTRACTS, FALLBACK, fmtUSD } from "../lib/constants.js";

function ListingCard({ listing, onBuy, comprando }) {
  const total = listing.cantidad > 1 ? listing.precioUnit * listing.cantidad : listing.precioUnit;
  const vendido = listing.estado === "vendido";
  return (
    <Card className="flex flex-col p-5">
      <div className="flex items-start justify-between">
        <Pill tone="gold">{listing.token}</Pill>
        {listing.avance != null && <Pill tone="ghost">{listing.avance}% obra</Pill>}
      </div>
      <h3 className="mt-3 font-serif text-base text-[#F4EFE3]">{listing.tipologia}</h3>
      <p className="mt-1 font-mono text-[11px] text-[#7E8CB3]">tokenID: {listing.tokenId}</p>

      <div className="mt-4 space-y-1.5 text-sm">
        {listing.cantidad > 1 && (
          <div className="flex justify-between text-[#9AA7C7]">
            <span>Cantidad</span>
            <span className="font-mono text-[#E7ECF8]">{listing.cantidad.toLocaleString()} dm²</span>
          </div>
        )}
        <div className="flex justify-between text-[#9AA7C7]">
          <span>{listing.cantidad > 1 ? "Precio / dm²" : "Precio"}</span>
          <span className="font-mono text-[#E7ECF8]">{fmtUSD(listing.precioUnit)}</span>
        </div>
        <div className="flex justify-between text-[#9AA7C7]">
          <span>Vendedor</span>
          <span className="font-mono text-[#E7ECF8]">{listing.vendedor}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-[#7E8CB3]">Total</p>
          <p className="font-mono text-lg text-[#E9C46A]">{fmtUSD(total)}</p>
        </div>
        <button
          disabled={vendido || comprando}
          onClick={() => onBuy(listing)}
          className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-mono transition-colors ${
            vendido
              ? "bg-emerald-500/10 text-emerald-300 cursor-default"
              : "bg-[#B8860B]/15 text-[#E9C46A] hover:bg-[#B8860B]/25"
          }`}
        >
          {vendido ? "Vendido" : comprando ? "Procesando…" : "Comprar"} {!vendido && <ChevronRight size={14} />}
        </button>
      </div>
    </Card>
  );
}

export default function MarketplaceView({ wallet }) {
  const [listings, setListings] = useState([]);
  const [filter, setFilter] = useState("Todos");
  const [loading, setLoading] = useState(true);
  const [comprandoId, setComprandoId] = useState(null);

  async function cargar(token) {
    setLoading(true);
    const data = await api.getListings(token, FALLBACK.listings);
    setListings(data);
    setLoading(false);
  }

  useEffect(() => {
    cargar("Todos");
  }, []);

  const tokens = ["Todos", ...Array.from(new Set(FALLBACK.listings.map((l) => l.token)))];

  function setFiltro(t) {
    setFilter(t);
    cargar(t);
  }

  async function onBuy(listing) {
    setComprandoId(listing.listingId);
    try {
      await api.comprarListing(listing.listingId, wallet || "0x000...demo");
      await cargar(filter);
    } catch {
      // si no hay backend, marcamos localmente como vendido
      setListings((prev) =>
        prev.map((l) => (l.listingId === listing.listingId ? { ...l, estado: "vendido" } : l))
      );
    } finally {
      setComprandoId(null);
    }
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        index="—"
        title="Ettios Marketplace"
        subtitle="Fee 2.5% por transacción: 1.5% mutual · 0.5% fondo de liquidez · 0.5% quema ETTIA"
      />

      <div className="flex flex-wrap gap-2">
        {tokens.map((t) => (
          <button
            key={t}
            onClick={() => setFiltro(t)}
            className={`rounded-full border px-3 py-1 text-xs font-mono transition-colors ${
              filter === t
                ? "border-[#B8860B] bg-[#B8860B]/15 text-[#E9C46A]"
                : "border-white/10 text-[#9AA7C7] hover:border-white/20"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <Card className="p-10 text-center text-sm text-[#7E8CB3]">Cargando listados…</Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((l) => (
            <ListingCard key={l.listingId} listing={l} onBuy={onBuy} comprando={comprandoId === l.listingId} />
          ))}
        </div>
      )}

      <Card className="p-5">
        <p className="font-mono text-[11px] text-[#5E6B8E]">
          Backend: <code className="text-[#E9C46A]">GET/POST {API_BASE}/marketplace/listings</code> → colección
          MongoDB <code className="text-[#E9C46A]">listings</code>. Cada compra emite{" "}
          <code className="text-[#E9C46A]">VentaMKT(tokenID, vendedor, comprador)</code> en el contrato{" "}
          <code className="text-[#E9C46A]">{CONTRACTS.MARKETPLACE}</code> sobre Ettios Chain {CHAIN.id}.
        </p>
      </Card>
    </div>
  );
}
