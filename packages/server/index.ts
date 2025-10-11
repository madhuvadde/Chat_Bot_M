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
   const clientDistPath = path.join(__dirname, '../../client/dist');
   console.log('Serving static files from:', clientDistPath);

   app.use(express.static(clientDistPath));

   // Handle React routing, return all requests to React app
   app.get('*', (req, res) => {
      console.log('Serving index.html for route:', req.path);
      res.sendFile(path.join(clientDistPath, 'index.html'));
   });
}

const port = process.env.PORT || 3000;

app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`);
});
