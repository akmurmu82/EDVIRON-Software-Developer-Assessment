import express from 'express';

const server = express();
const PORT = process.env.PORT || 3000;

server.get('/', (req, res) => {
  res.send('Welcome to the Edviron Backend Server!');
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});