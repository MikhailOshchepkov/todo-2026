import { config } from "dotenv";
import express from "express";
import healthRouter from "./routes/health.router"
import { Server } from "node:http";

config();

function buildApp() {
   const app = express();
    
    app.use(express.json());

    app.use("/health", healthRouter);

    app.use((req, res) => {
        res.status(404).json(
            {
                status: 'Not found',
            }
        );
    });


    app.use((err: unknown, _req: express.Request, res: express.Response) => {

        console.error(err);

        if(err instanceof Error)
        {
            return res.status(500).json({
                status: 'Internal Server Error',
                message: err.message
            });
        } else if(typeof err === 'string')
        {
            return res.status(500).json({
                status: 'Internal Server Error',
                message: err,
            });
        }else {
            res.status(500).json({
                status: 'Error',
                message: 'Internal Server Error',
            });
        }
        });

    return app;
}

export default buildApp;