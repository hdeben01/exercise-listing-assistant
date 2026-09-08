import app from './app.ts';

const PORT = 3000;

app.listen(PORT,(err) =>{
    if(err) console.log("Error starting the server");
    else console.log("Server listening on port " + PORT);
});