import express, { type Express, type NextFunction, type Request, type Response } from 'express';

const PORT = 3000;

const app: Express = express();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});
// ---------Routes---------

app.use((err: Error, req: Request, res: Response, next: NextFunction) =>{
    res.status(500).send("Something went wrong");
})
app.listen(PORT,(err) =>{
    if(err) console.log("Error starting the server");
    else console.log("Server listening on port " + PORT);
});