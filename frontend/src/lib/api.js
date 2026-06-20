// Cliente HTTP centralizado para la API del backend
const API_BASE = import.meta.env.VITE_API_BASE || "/api/v1";

async function request(path, options = {}, fallback = null) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    if (fallback !== null) return fallback; // datos de referencia mientras no haya backend
    throw err;
  }
}

export const api = {
  getConfig: (fb) => request("/config", {}, fb),
  getTipologias: (fb) => request("/tipologias", {}, fb),
  getTokenMap: (fb) => request("/token-map", {}, fb),
  getDefiInstruments: (fb) => request("/defi/instruments", {}, fb),
  simularDefi: (codigo, monto) =>
    request("/defi/simular", { method: "POST", body: JSON.stringify({ codigo, monto }) }),
  getListings: (token, fb) =>
    request(`/marketplace/listings${token && token !== "Todos" ? `?token=${encodeURIComponent(token)}` : ""}`, {}, fb),
  comprarListing: (id, comprador) =>
    request(`/marketplace/listings/${id}/comprar`, { method: "POST", body: JSON.stringify({ comprador }) }),
  cotizarSwap: (from, to, amount, slippage) =>
    request(`/swap/cotizacion?from=${from}&to=${to}&amount=${amount}&slippage=${slippage}`),
  getSocioMe: (wallet, fb) =>
    request(`/socios/me${wallet ? `?wallet=${wallet}` : ""}`, {}, fb),
  getEventos: (limit, fb) => request(`/eventos?limit=${limit || 8}`, {}, fb),
};

export { API_BASE };
