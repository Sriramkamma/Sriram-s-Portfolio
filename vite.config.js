import { defineConfig } from 'vite';
import { loadEnv } from 'vite';
import { Buffer } from 'node:buffer';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import tailwindcss from "@tailwindcss/vite";

function assistantApi() {
  return {
    name: 'assistant-api',
    configureServer(server) {
      server.middlewares.use('/api/assistant', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        try {
          const chunks = [];
          for await (const chunk of req) chunks.push(chunk);
          req.body = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');

          const { default: handler } = await server.ssrLoadModule('/api/assistant.js');
          const response = {
            statusCode: 200,
            setHeader(name, value) {
              res.setHeader(name, value);
              return this;
            },
            status(code) {
              this.statusCode = code;
              return this;
            },
            json(payload) {
              res.statusCode = this.statusCode;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(payload));
              return this;
            },
          };

          await handler(req, response);
        } catch (error) {
          if (res.headersSent) return;
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: error.message || 'Invalid assistant request.' }));
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  if (env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY) {
    process.env.GEMINI_API_KEY = env.GEMINI_API_KEY;
  }

  return {
  plugins: [assistantApi(), react(),tailwindcss()],
  resolve: {
   alias: {
    "@": fileURLToPath(new URL('./src', import.meta.url)),
   }, 
  },
  };
});
