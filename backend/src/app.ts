import express, { type Express, type NextFunction, type Request, type Response } from 'express';
import router_assistant from './routes/assistant.ts';

const PORT = 3000;

const app: Express = express();

app.use(express.json())

// ---------Routes---------
app.use('/assistant', router_assistant);

app.use((err: Error, req: Request, res: Response, next: NextFunction) =>{
    console.log(err);
    res.status(500).send("Something went wrong");
})
app.listen(PORT,(err) =>{
    if(err) console.log("Error starting the server");
    else console.log("Server listening on port " + PORT);
});