import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import joinRequestRoutes from "./routes/joinRequest.routes.js";
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Vyayamshala API is running",
  });
});

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Health check successful",
  });
});
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/join-requests", joinRequestRoutes);
export default app;