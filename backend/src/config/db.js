import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/ettios_vivienda";
  try {
    await mongoose.connect(uri);
    console.log(`✓ MongoDB conectado: ${mongoose.connection.host}/${mongoose.connection.name}`);
  } catch (err) {
    console.error("✗ Error conectando a MongoDB:", err.message);
    process.exit(1);
  }

  mongoose.connection.on("disconnected", () => console.warn("⚠ MongoDB desconectado"));
  mongoose.connection.on("error", (e) => console.error("MongoDB error:", e.message));
}

export default connectDB;
