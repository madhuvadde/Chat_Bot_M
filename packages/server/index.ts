import express from 'express';
import path from 'path';
import router from './routes';

import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

// API routes
app.use(router);

// Only serve React app in production
if (process.env.NODE_ENV === 'production') {
   // Serve static files from the React app build directory
   app.use(express.static(path.join(__dirname, '../../client/dist')));

   // Handle React routing, return all requests to React app
   app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
   });
}

const port = process.env.PORT || 3000;

app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`);
});
