import Fastify from 'fastify';
import path from 'path';
import fastifyStatic from '@fastify/static';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fastifyRateLimit from '@fastify/rate-limit';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const port = 3000;

const fastify = Fastify({ logger: false });

fastify.register(fastifyStatic, {
  root: path.join(__dirname, './public'),
  prefix: '/',  // Serve static files from the root URL (e.g., /index.html, /style.css)
});

// Rate limiting setup (e.g., 100 requests per IP per 15 minutes)
fastify.register(fastifyRateLimit, {
  max: 100,
  timeWindow: '15 minutes',
});

// Register the src directory to serve JS files (make sure you use a different prefix)
fastify.register(fastifyStatic, {
  root: path.join(__dirname, './src'),
  prefix: '/src/',
  decorateReply: false,
});

fastify.get('/', (request, reply) => {
  reply.sendFile('index.html');
});

fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);
  reply.status(500).send({
    message: 'Internal Server Error',
    error: error.message,
  });
});

const startServer = async () => {
  try {
    await fastify.listen({ port });
  } catch (err) {
    fastify.log.error('Error starting server: ', err);
    process.exit(1);
  }
};

startServer();
