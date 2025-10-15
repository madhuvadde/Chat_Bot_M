import express, {
   type Request,
   type Response,
   type NextFunction,
} from 'express';
import path from 'path';
import { existsSync } from 'fs';
import router from './routes';

import dotenv from 'dotenv';

// Load environment variables based on NODE_ENV
const envFile =
   process.env.NODE_ENV === 'production'
      ? '.env.production'
      : '.env.development';
dotenv.config({ path: path.join(__dirname, envFile) });
dotenv.config(); // Also load default .env if it exists

// Set default NODE_ENV if not set
if (!process.env.NODE_ENV) {
   process.env.NODE_ENV = 'development';
}

console.log('Environment:', process.env.NODE_ENV);
console.log('Port:', process.env.PORT || 3000);

const app = express();
app.use(express.json());

// API routes
app.use(router);

// Serve React app based on environment
if (process.env.NODE_ENV === 'production') {
   // Production: Serve static files from the React app build directory
   console.log('Running in PRODUCTION mode - serving static files');

   const possiblePaths = [
      path.join(__dirname, '../../client/dist'), // Local development
      path.join(__dirname, '../client/dist'), // Railway deployment
      path.join(process.cwd(), 'packages/client/dist'), // Alternative path
      path.join(process.cwd(), 'client/dist'), // Root level build
   ];

   let clientDistPath = null;
   for (const possiblePath of possiblePaths) {
      if (existsSync(possiblePath)) {
         clientDistPath = possiblePath;
         break;
      }
   }

   if (clientDistPath) {
      console.log('Serving static files from:', clientDistPath);
      app.use(express.static(clientDistPath));

      // Handle React routing, but only for non-API routes
      app.use((req, res) => {
         // Skip API routes - they should be handled by the router above
         if (req.path.startsWith('/api')) {
            return res.status(404).json({ error: 'API endpoint not found' });
         }

         console.log('Serving index.html for route:', req.path);
         res.sendFile(path.join(clientDistPath, 'index.html'));
      });
   } else {
      console.log(
         'Client build directory not found. Available paths checked:',
         possiblePaths
      );
      // Fallback: serve a simple message if client build is not found
      app.use((req, res) => {
         // Skip API routes - they should be handled by the router above
         if (req.path.startsWith('/api')) {
            return res.status(404).json({ error: 'API endpoint not found' });
         }

         res.send(
            'Client build not found. Please ensure the client is built before deployment.'
         );
      });
   }
} else {
   // Development: Only serve API routes, let Vite handle the frontend
   console.log('Running in DEVELOPMENT mode - API only');

   // Health check endpoint
   app.get('/', (req, res) => {
      res.json({
         message: 'Chat Bot API Server',
         environment: 'development',
         status: 'running',
         client_url: 'http://localhost:5173',
         api_endpoints: ['/api/hello', '/api/chat', '/api/generate-image'],
      });
   });

   // Catch-all for non-API routes in development
   app.use((req, res, next) => {
      if (req.path.startsWith('/api')) {
         return res.status(404).json({ error: 'API endpoint not found' });
      }

      res.send(`
         <html>
            <head>
               <title>Chat Bot - Development Mode</title>
               <style>
                  body { font-family: Arial, sans-serif; margin: 40px; }
                  .container { max-width: 600px; }
                  .code { background: #f4f4f4; padding: 10px; border-radius: 4px; }
                  a { color: #007bff; text-decoration: none; }
                  a:hover { text-decoration: underline; }
               </style>
            </head>
            <body>
               <div class="container">
                  <h1>🤖 Chat Bot Server</h1>
                  <p><strong>Status:</strong> Running in development mode</p>
                  
                  <h2>Next Steps:</h2>
                  <ol>
                     <li>Start the client development server:</li>
                     <div class="code">cd packages/client && bun run dev</div>
                     <li>Visit the frontend: <a href="http://localhost:5173" target="_blank">http://localhost:5173</a></li>
                  </ol>
                  
                  <h2>API Endpoints:</h2>
                  <ul>
                     <li><a href="/api/hello">/api/hello</a> - Test endpoint</li>
                     <li><a href="/api/chat">/api/chat</a> - Chat endpoint (POST)</li>
                     <li><a href="/api/generate-image">/api/generate-image</a> - Image generation endpoint (POST)</li>
                  </ul>
                  
                  <p><em>This page is only shown in development mode.</em></p>
               </div>
            </body>
         </html>
      `);
   });
}

// 404 handler for unmatched routes
app.use((req, res) => {
   res.status(404).json({
      error: 'Not found',
      message: `Route ${req.path} not found`,
   });
});

// Error handling middleware - must be last
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
   console.error('Error:', err);
   res.status(500).json({
      error: 'Internal server error',
      message: err.message,
   });
});

// const port = process.env.PORT || 3000;
const port = process.env.PORT || 11434;

app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`);
});
