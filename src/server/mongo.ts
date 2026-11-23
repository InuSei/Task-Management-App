import { MongoClient, type Db } from 'mongodb';

// One client per server process, kept on globalThis so dev hot reloads don't open new connections.
const cache = globalThis as typeof globalThis & { mongoClient?: Promise<MongoClient> };

export async function getDb(): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set. Add it to .env.local (see .env.example).');
  cache.mongoClient ??= new MongoClient(uri).connect().catch((error: unknown) => {
    cache.mongoClient = undefined; // let the next request retry instead of caching the failure
    throw error;
  });
  return (await cache.mongoClient).db(process.env.MONGODB_DB || 'task-manager');
}
