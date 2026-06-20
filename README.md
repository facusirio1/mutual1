# Ettios · Plan Integral de Vivienda

Plataforma full-stack para el **Plan Integral de Vivienda** de la Mutual 24 de Octubre, tokenizado sobre **Ettios Blockchain** (Chain ID `2237`, token nativo `ETTIA`).

Cada cuota, préstamo y escritura del plan existe como un token verificable en cadena. El sistema combina tokenización por dm² (ERC-1155), escritura definitiva (ERC-721) y capital externo vía LP, Bond y Staking, con un marketplace secundario y un módulo de swap de stablecoins.

```
┌─────────────┐     /api/v1      ┌──────────────┐     mongoose     ┌──────────┐
│  Frontend   │  ───────────────▶│   Backend    │ ────────────────▶│ MongoDB  │
│ React + Vite│                  │ Node/Express │                  │          │
└─────────────┘                  └──────────────┘                  └──────────┘
       │                                 │
       └──── window.ethereum ────────────┴──── RPC ──▶ Ettios Blockchain (2237)
```

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 · Vite · TailwindCSS · lucide-react |
| Backend | Node.js · Express · Mongoose |
| Base de datos | MongoDB 7 |
| Infra | Docker · Docker Compose · Nginx |
| CI | GitHub Actions |

## Secciones de la app

- **Ecosistema** — overview, mecanismo central, mapa de tokens y feed de eventos on-chain en vivo.
- **Tipologías** — calculadora de plan de pagos por tipología (80/100/120 m², semiabierta/cerrada) con desglose 70/30 y etapas de obra.
- **Marketplace** — listados de NFT (dm², adjudicación, escritura, bond, stake) con compra que liquida fee 2.5%.
- **DeFi** — instrumentos de capital externo (LP, Bond, Staking) con simulador de rendimiento conectado al backend.
- **Swap** — conversión USDT/USDC ↔ ETTIA con cotización, fee de pool y slippage.
- **Mi cuenta** — posición del socio: progreso de adjudicación, estado de NFTs, KYC, lote asignado y balances on-chain.

## Estructura del repositorio

```
ettios-vivienda/
├── backend/
│   ├── src/
│   │   ├── config/        # db.js (Mongo), chain.js (Ettios + parámetros del plan)
│   │   ├── models/        # Tipologia, Socio, Listing, DefiInstrument, EventoChain, TokenMap
│   │   ├── controllers/   # plan, marketplace, socio, defi
│   │   ├── routes/        # router /api/v1
│   │   ├── middleware/    # manejo de errores y 404
│   │   ├── seed/          # data.js + seed.js
│   │   ├── app.js         # Express app
│   │   └── server.js      # entry point
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/    # ui.jsx (Pill, Card, SectionHeader)
│   │   ├── views/         # Ecosistema, Tipologias, Marketplace, Defi, Swap, Wallet (Mi cuenta)
│   │   ├── lib/           # api.js (cliente HTTP), constants.js (chain + fallbacks)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile + nginx.conf
│   └── package.json
├── docker-compose.yml
└── .github/workflows/ci.yml
```

## Arranque rápido con Docker (recomendado)

Requiere Docker y Docker Compose.

```bash
git clone https://github.com/<tu-usuario>/ettios-vivienda.git
cd ettios-vivienda
docker compose up --build
```

Luego, cargá los datos de referencia (en otra terminal):

```bash
docker compose exec backend npm run seed
```

- Frontend: http://localhost:8080
- API: http://localhost:4000/api/v1
- MongoDB: `mongodb://localhost:27017/ettios_vivienda`

## Arranque manual (sin Docker)

Necesitás Node.js 20+ y una instancia de MongoDB corriendo localmente.

**Backend**

```bash
cd backend
cp .env.example .env        # ajustá MONGO_URI si hace falta
npm install
npm run seed                # carga datos de referencia
npm run dev                 # http://localhost:4000
```

**Frontend**

```bash
cd frontend
cp .env.example .env
npm install
npm run dev                 # http://localhost:5173
```

El frontend usa el proxy de Vite (`/api` → `http://localhost:4000`), así que no necesitás configurar CORS en desarrollo. Si el backend no está disponible, la UI muestra datos de referencia (fallback) para que se pueda navegar igual.

## API

Base: `/api/v1`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/config` | Chain, contratos y parámetros del plan |
| GET | `/tipologias` | Lista de tipologías |
| GET | `/tipologias/:codigo` | Detalle de una tipología |
| GET | `/token-map` | Mapa de tokens del plan |
| GET | `/marketplace/listings` | Listados (`?token=` para filtrar) |
| POST | `/marketplace/listings` | Crear listado |
| POST | `/marketplace/listings/:id/comprar` | Ejecutar compra y liquidar fee |
| GET | `/socios` | Lista de socios |
| GET | `/socios/me` | Posición del socio (`?wallet=` o socio demo) |
| GET | `/socios/:socioID` | Detalle de un socio |
| POST | `/socios/:socioID/pagar-cuota` | Suma dm² y dispara adjudicación al 70% |
| GET | `/defi/instruments` | Instrumentos DeFi |
| POST | `/defi/simular` | Simular rendimiento `{ codigo, monto }` |
| GET | `/swap/cotizacion` | Cotizar swap `?from=&to=&amount=&slippage=` |
| GET | `/eventos` | Eventos on-chain indexados (`?limit=`) |

## Modelo de datos (MongoDB)

- **tipologias** — catálogo de viviendas con costos, cuotas y dm².
- **socios** — cuenta del socio: progreso dm², estado de NFTs, KYC, balances.
- **listings** — órdenes del marketplace con estado y comprador.
- **defiinstruments** — LP, Bond, Staking, Reserva con APY y TVL.
- **tokenmaps** — definición de cada token del plan (estándar, emisión, función).
- **eventochains** — log de eventos del ecosistema indexados off-chain.

## Parámetros del plan

| Parámetro | Valor |
|-----------|-------|
| Umbral de adjudicación | 70% de dm² acumulados |
| Tasa préstamo mutual | 6% anual |
| Fee marketplace | 2.5% (1.5% mutual · 0.5% liquidez · 0.5% quema ETTIA) |
| Fee pool de swap | 0.3% |

## Cuenta demo

Tras correr el seed, la sección **Mi cuenta** carga el socio demo `#18204` (tipología 100 m² Cerrada, 42% de avance hacia el 70%). El botón **Conectar wallet** usa `window.ethereum` si está disponible (agrega la red Ettios automáticamente) o entra en modo demo.

## Notas de integración on-chain

Las direcciones de contratos en `backend/src/config/chain.js` son placeholders hasta el deploy real. La UI está preparada para leer balances y eventos vía RPC (`rpc.ettiosblockchain.io`) y verificar transacciones en el explorer (`scan.ettiosblockchain.io`). Para producción, reemplazá las llamadas simuladas por integración con `wagmi`/`viem` apuntando a la chain `2237`.

## Licencia

MIT — ver [LICENSE](./LICENSE).
