import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import joinRequestRoutes from "./routes/joinRequest.routes.js";
import membershipPlanRoutes from "./routes/membershipplan.routes.js";
import memberRoutes from "./routes/member.routes.js";
import trainerRoutes from "./routes/trainer.routes.js";
import membershipRoutes from "./routes/membership.routes.js";
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
app.use("/api/membership-plans", membershipPlanRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/trainers", trainerRoutes);
app.use("/api/memberships", membershipRoutes);
export default app;