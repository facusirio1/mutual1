import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 4000;

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`✓ API Ettios Vivienda escuchando en http://localhost:${PORT}`);
    console.log(`  → Health:  http://localhost:${PORT}/health`);
    console.log(`  → API:     http://localhost:${PORT}/api/v1`);
  });
}

start();
