import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';

const fastify = Fastify({ logger: true });

await fastify.register(cors, {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
});

fastify.post('/api/trigger-flow', async (request, reply) => {
  try {
    const response = await fetch(process.env.FLOWS_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'workspaces': process.env.FLOWS_WORKSPACE_ID,
        'x-api-key': process.env.FLOWS_API_KEY
      },
      body: JSON.stringify(request.body)
    })

    const text = await response.text()
    try {
      return JSON.parse(text)
    } catch {
      return { success: true, response: text }
    }
  } catch (error) {
    fastify.log.error(error)
    reply.status(500).send({ error: error.message })
  }
})

const start = async () => {
  try {
    await fastify.listen({ port: 3001 });
    console.log('Backend in ascolto su http://localhost:3001');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
