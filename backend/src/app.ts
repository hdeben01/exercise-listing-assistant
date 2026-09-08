import express, { type Express, type NextFunction, type Request, type Response } from 'express';
import cors from 'cors';
import router_assistant from './routes/assistant.ts';

const app: Express = express();

const corsOptions = {
    origin: process.env.ORIGIN ? process.env.ORIGIN : 'http://localhost:4200',
}

app.use(express.json())
app.use(cors(corsOptions));

// ---------Routes---------
app.use('/api/assistant', router_assistant);

app.use((req: Request, res: Response) => {
    res.status(404).send(`Resource ${req.path} not found`);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err);
    res.status(500).send("Something went wrong");
});

export default app;