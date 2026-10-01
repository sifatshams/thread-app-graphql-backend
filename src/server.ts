import 'dotenv/config';
import app, { startGqlServer } from './app';

// dotenv
const PORT = process.env.PORT || 8000;

// start server
const startServer = async () => {
  await startGqlServer();

  app.listen(PORT, () => {
    console.log(`Server is running on port:${PORT}`);
  });
};

startServer();
