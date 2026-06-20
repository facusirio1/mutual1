export const TIPOLOGIAS = [
  { codigo: "80-semi", nombre: "80 m² Semiabierta", m2: 80, costoTotal: 58528, meta70: 40970, prestamo30: 17558, cuotaAhorro: 1138, cuotaObra: 1551, mesesAhorro: 36, mesesObra: 12, dm2: 8000, usdDm2: 7.316 },
  { codigo: "80-cerr", nombre: "80 m² Cerrada", m2: 80, costoTotal: 61360, meta70: 42952, prestamo30: 18408, cuotaAhorro: 1193, cuotaObra: 1626, mesesAhorro: 36, mesesObra: 12, dm2: 8000, usdDm2: 7.670 },
  { codigo: "100-semi", nombre: "100 m² Semiabierta", m2: 100, costoTotal: 71980, meta70: 50386, prestamo30: 21594, cuotaAhorro: 1200, cuotaObra: 1907, mesesAhorro: 42, mesesObra: 12, dm2: 10000, usdDm2: 7.198 },
  { codigo: "100-cerr", nombre: "100 m² Cerrada", m2: 100, costoTotal: 75520, meta70: 52864, prestamo30: 22656, cuotaAhorro: 1259, cuotaObra: 2001, mesesAhorro: 42, mesesObra: 12, dm2: 10000, usdDm2: 7.552 },
  { codigo: "120-semi", nombre: "120 m² Semiabierta", m2: 120, costoTotal: 84960, meta70: 59472, prestamo30: 25488, cuotaAhorro: 1239, cuotaObra: 2251, mesesAhorro: 48, mesesObra: 12, dm2: 12000, usdDm2: 7.080 },
  { codigo: "120-cerr", nombre: "120 m² Cerrada", m2: 120, costoTotal: 89208, meta70: 62446, prestamo30: 26762, cuotaAhorro: 1301, cuotaObra: 2364, mesesAhorro: 48, mesesObra: 12, dm2: 12000, usdDm2: 7.434 },
];

export const TOKEN_MAP = [
  { token: "NFT-MEMBRESÍA", std: "ERC-721", emision: "Pago inscripción", funcion: "Condición de socio. Plan, lote y barrio en metadata IPFS.", mkt: "Sí — a socio calificado", orden: 1 },
  { token: "NFT-DM2", std: "ERC-1155", emision: "Cada cuota pagada", funcion: "1 token = 1 dm². 70% dispara adjudicación.", mkt: "Sí — mín. 100 dm²", orden: 2 },
  { token: "NFT-ADJUDICACIÓN", std: "ERC-721", emision: "Al 70% dm²", funcion: "Habilita inicio de obra. Planos en IPFS.", mkt: "Sí — con asunción deuda", orden: 3 },
  { token: "NFT-PRÉSTAMO", std: "ERC-721", emision: "Con adjudicación", funcion: "Deuda 30%. Tasa 6%, garantía dm² embebida.", mkt: "No — intransferible", orden: 4 },
  { token: "NFT-CUOTA-OBRA", std: "ERC-1155", emision: "Cada pago obra", funcion: "Registro cancelación mensual préstamo.", mkt: "No — registro interno", orden: 5 },
  { token: "NFT-AVANCE-OBRA", std: "ERC-1155", emision: "Firma inspector", funcion: "5 etapas. Habilita siguiente desembolso.", mkt: "No — certificado técnico", orden: 6 },
  { token: "NFT-ESCRITURA", std: "ERC-721", emision: "100% pago + obra", funcion: "Título definitivo de propiedad.", mkt: "Sí — mercado libre", orden: 7 },
  { token: "NFT-BOND", std: "ERC-721", emision: "Emisión institucional", funcion: "Bono de deuda mutual. 9% anual. Capital DeFi.", mkt: "Sí — mercado libre DeFi", orden: 8 },
  { token: "LP-TOKEN-DM2", std: "ERC-20", emision: "Depósito LP", funcion: "Participación pool dm². 8.5% APY en ETTIA.", mkt: "Sí — DEX Ettios", orden: 9 },
  { token: "STAKE-PRÉSTAMO", std: "ERC-1155", emision: "Empaquetado cartera", funcion: "Fracción cartera NFT-PRÉSTAMO. 7% APY.", mkt: "Sí — vía contrato staking", orden: 10 },
];

export const DEFI_INSTRUMENTS = [
  { codigo: "lp", nombre: "Liquidity Pool dm²", token: "LP-TOKEN-DM2 (ERC-20)", apy: 8.5, minimo: 500, liquidez: "Alta — DEX Ettios", uso: "Adelanto dm² a socios en fase ahorro", tvl: 1250000 },
  { codigo: "bond", nombre: "NFT-BOND mutual", token: "NFT-BOND (ERC-721)", apy: 9.0, minimo: 5000, liquidez: "Media — Marketplace", uso: "Pool préstamos 30% adjudicación", tvl: 980000 },
  { codigo: "stake", nombre: "Staking de cartera", token: "STAKE-PRÉSTAMO (ERC-1155)", apy: 7.0, minimo: 1000, liquidez: "Media — Marketplace", uso: "Flujo cuotas de obra socios adjudicados", tvl: 540000 },
  { codigo: "reserva", nombre: "Yield fondo de reserva", token: "Interno", apy: 6.0, minimo: null, liquidez: "No disponible externamente", uso: "Optimización y crecimiento fondo de reserva", tvl: 320000 },
];

export const LISTINGS = [
  { listingId: "lst-001", token: "NFT-DM2", tipologia: "100 m² Cerrada", cantidad: 1500, avance: 40, precioUnit: 8.3, vendedor: "0x71...4fA2", tokenId: "(118<<128)|3500" },
  { listingId: "lst-002", token: "NFT-ADJUDICACIÓN", tipologia: "120 m² Semiabierta", cantidad: 1, avance: 70, precioUnit: 64500, vendedor: "0x9c...11Be", tokenId: "viviendaID 204" },
  { listingId: "lst-003", token: "NFT-ESCRITURA", tipologia: "80 m² Cerrada", cantidad: 1, avance: 100, precioUnit: 71200, vendedor: "0x4a...88D1", tokenId: "viviendaID 097" },
  { listingId: "lst-004", token: "NFT-BOND", tipologia: "Bono institucional 36m", cantidad: 1, avance: null, precioUnit: 5000, vendedor: "Mutual 24 de Octubre", tokenId: "BOND-2026-014" },
  { listingId: "lst-005", token: "NFT-DM2", tipologia: "80 m² Semiabierta", cantidad: 800, avance: 22, precioUnit: 7.55, vendedor: "0x2d...9aC4", tokenId: "(045<<128)|0800" },
  { listingId: "lst-006", token: "STAKE-PRÉSTAMO", tipologia: "Paquete 10 préstamos", cantidad: 1, avance: null, precioUnit: 12000, vendedor: "Mutual 24 de Octubre", tokenId: "STAKE-PKG-007" },
];

export const SOCIOS = [
  {
    socioID: 18204, nombre: "Demo Socio", email: "socio@mutual24.coop",
    wallet: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    tipologiaCodigo: "100-cerr", barrio: "Los Árboles", lote: "Mz 12 Lt 7",
    dm2Acumulados: 4200, dm2Total: 10000, avanceObra: 0,
    nftMembresia: true, nftAdjudicacion: false, nftPrestamo: false, nftEscritura: false,
    balanceETTIA: 1280.5, balanceUSDT: 0, balanceUSDC: 500,
    kyc: { estado: "aprobado", verificadoEn: new Date() },
  },
  {
    socioID: 18205, nombre: "María González", email: "maria@example.com",
    wallet: "0x4a3b2c1d88D1aE0f9c8b7a6d5e4f3a2b1c0d9eE2",
    tipologiaCodigo: "80-cerr", barrio: "Las Calandrias", lote: "Mz 4 Lt 19",
    dm2Acumulados: 8000, dm2Total: 8000, avanceObra: 60,
    nftMembresia: true, nftAdjudicacion: true, nftPrestamo: true, nftEscritura: false,
    balanceETTIA: 320, balanceUSDT: 1200, balanceUSDC: 0,
    kyc: { estado: "aprobado", verificadoEn: new Date() },
  },
];

export const EVENTOS = [
  { tipo: "Inscripcion", descripcion: "Inscripcion(socioID=18204, planID=120-semi) → Mint NFT-MEMBRESÍA", socioID: 18204 },
  { tipo: "CuotaPagada", descripcion: "CuotaPagada(viviendaID=204, monto=1239) → +169 NFT-DM2", viviendaID: 204 },
  { tipo: "Adjudicacion", descripcion: "Adjudicacion(viviendaID=204) → Mint NFT-ADJUDICACIÓN + NFT-PRÉSTAMO 30%", viviendaID: 204 },
  { tipo: "EtapaObra", descripcion: "EtapaObra(viviendaID=097, etapa=3) → Mint NFT-AVANCE-OBRA", viviendaID: 97 },
  { tipo: "VentaMKT", descripcion: "VentaMKT(NFT-DM2, vendedor=0x2d..9aC4) → Fee 2.5% distribuido" },
  { tipo: "EmisionBond", descripcion: "EmisionBond(monto=250000, plazo=36) → Mint NFT-BOND x50" },
  { tipo: "StakingPrestamo", descripcion: "StakingPrestamo(paqueteID=007) → Mint STAKE-PRÉSTAMO" },
  { tipo: "Escrituracion", descripcion: "Escrituracion(viviendaID=097) → Burn NFT-PRÉSTAMO · Mint NFT-ESCRITURA", viviendaID: 97 },
];
