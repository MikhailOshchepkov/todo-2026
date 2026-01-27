import { config } from "dotenv";
import express from "express";
import healthRouter from "./routes/health.router"

config();

function buildApp() {
   const app = express();
    
    app.use(express.json());

    app.use("/health", healthRouter);

    return app;
}

export default buildApp;