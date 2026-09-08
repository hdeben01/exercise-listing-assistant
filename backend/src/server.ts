import app from './app.ts';

const PORT = Number(process.env.PORT) || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
server.on('error', (err) => {
  console.error('Error starting server:', err);
});