import React, { useState } from "react";
import { ArrowRightLeft, LayoutGrid, Store, Wallet, TrendingUp, Hammer } from "lucide-react";
import EcosistemaView from "./views/EcosistemaView.jsx";
import TipologiasView from "./views/TipologiasView.jsx";
import MarketplaceView from "./views/MarketplaceView.jsx";
import DefiView from "./views/DefiView.jsx";
import SwapView from "./views/SwapView.jsx";
import WalletView from "./views/WalletView.jsx";
import { CHAIN } from "./lib/constants.js";

const NAV = [
  { id: "ecosistema", label: "Ecosistema", icon: LayoutGrid },
  { id: "tipologias", label: "Tipologías", icon: Hammer },
  { id: "marketplace", label: "Marketplace", icon: Store },
  { id: "defi", label: "DeFi", icon: TrendingUp },
  { id: "swap", label: "Swap", icon: ArrowRightLeft },
  { id: "wallet", label: "Mi cuenta", icon: Wallet },
];

export default function App() {
  const [active, setActive] = useState("ecosistema");
  const [walletConnected, setWalletConnected] = useState(false);
  const [wallet, setWallet] = useState(null);

  async function connectWallet() {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x" + CHAIN.id.toString(16),
                chainName: CHAIN.name,
                nativeCurrency: { name: "ETTIA", symbol: "ETTIA", decimals: 18 },
                rpcUrls: [CHAIN.rpc],
                blockExplorerUrls: [CHAIN.explorer],
              },
            ],
          });
        } catch (_) {
          /* red ya configurada o usuario rechazó */
        }
        setWallet(accounts?.[0] || null);
        setWalletConnected(true);
      } catch (_) {
        setWalletConnected(false);
      }
    } else {
      // Sin proveedor inyectado: modo demo
      setWallet("0x71C7656EC7ab88b098defB751B7401B5f6d8976F");
      setWalletConnected(true);
    }
  }

  const shortWallet = wallet ? `${wallet.slice(0, 6)}…${wallet.slice(-4)}` : "0x71...4fA2";

  return (
    <div className="min-h-screen w-full bg-[#0B1224] text-[#E7ECF8] font-sans">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, #B8860B 0, transparent 35%), radial-gradient(circle at 80% 0%, #3A5BFF 0, transparent 30%)",
        }}
      />

      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0B1224]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#B8860B]/40 bg-[#1B2A4A] font-mono text-sm font-bold text-[#E9C46A]">
              ⌬
            </div>
            <div className="leading-tight">
              <p className="font-serif text-base text-[#F4EFE3] sm:text-lg">Plan Integral de Vivienda</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#7E8CB3]">
                Mutual 24 de Octubre · Ettios Chain {CHAIN.id}
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => setActive(n.id)}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors ${
                  active === n.id
                    ? "bg-[#1B2A4A] text-[#E9C46A]"
                    : "text-[#9AA7C7] hover:bg-white/5 hover:text-[#E7ECF8]"
                }`}
              >
                <n.icon size={14} />
                {n.label}
              </button>
            ))}
          </div>
          <button
            onClick={connectWallet}
            className={`flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-mono transition-colors ${
              walletConnected
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                : "border-[#B8860B]/40 bg-[#B8860B]/10 text-[#E9C46A] hover:bg-[#B8860B]/20"
            }`}
          >
            <Wallet size={14} />
            {walletConnected ? shortWallet : "Conectar wallet"}
          </button>
        </div>
        <div className="flex gap-1 overflow-x-auto border-t border-white/5 px-4 py-2 lg:hidden">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => setActive(n.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs ${
                active === n.id ? "bg-[#1B2A4A] text-[#E9C46A]" : "text-[#9AA7C7]"
              }`}
            >
              <n.icon size={13} />
              {n.label}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {active === "ecosistema" && <EcosistemaView />}
        {active === "tipologias" && <TipologiasView />}
        {active === "marketplace" && <MarketplaceView wallet={wallet} />}
        {active === "defi" && <DefiView />}
        {active === "swap" && <SwapView />}
        {active === "wallet" && (
          <WalletView walletConnected={walletConnected} connectWallet={connectWallet} wallet={wallet} />
        )}
      </main>

      <footer className="border-t border-white/10 px-4 py-6 text-center font-mono text-[11px] text-[#5E6B8E] sm:px-6">
        Ettios Blockchain — Chain ID {CHAIN.id} · {CHAIN.rpc} · {CHAIN.explorer} · Token nativo {CHAIN.nativeToken}
      </footer>
    </div>
  );
}
