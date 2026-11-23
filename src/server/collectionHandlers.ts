import { NextResponse } from 'next/server';
import { getDb } from './mongo';

type IdContext = { params: Promise<{ id: string }> };
/** Stored documents use our own string id as `_id` rather than an ObjectId. */
export type StoredDoc = { _id: string } & Record<string, unknown>;

export const fail = (status: number, error: string) => NextResponse.json({ error }, { status });

/** Turns database/config errors into a JSON 500; details stay in the server log, not the response. */
export async function guarded(run: () => Promise<Response>): Promise<Response> {
  try {
    return await run();
  } catch (error) {
    console.error('[api]', error);
    return fail(500, 'Database unavailable');
  }
}

export async function readBody<T>(request: Request, isValid: (value: unknown) => value is T): Promise<T | null> {
  try {
    const body: unknown = await request.json();
    return isValid(body) ? body : null;
  } catch {
    return null;
  }
}

/**
 * CRUD route handlers for one collection. Documents use the item id as `_id`;
 * every write is validated here because the request body is untrusted.
 */
export function collectionHandlers<T extends { id: string }>(name: string, isValid: (value: unknown) => value is T) {
  const collection = async () => (await getDb()).collection<StoredDoc>(name);

  return {
    list: () =>
      guarded(async () => NextResponse.json(await (await collection()).find({}, { projection: { _id: 0 } }).toArray())),

    create: (request: Request) =>
      guarded(async () => {
        const item = await readBody(request, isValid);
        if (!item) return fail(400, `Invalid ${name} item`);
        await (await collection()).insertOne({ ...item, _id: item.id });
        return new Response(null, { status: 201 });
      }),

    update: (request: Request, { params }: IdContext) =>
      guarded(async () => {
        const { id } = await params;
        const item = await readBody(request, isValid);
        if (!item || item.id !== id) return fail(400, `Invalid ${name} item`);
        const result = await (await collection()).replaceOne({ _id: id }, item);
        return result.matchedCount === 0 ? fail(404, `${id} not found`) : new Response(null, { status: 204 });
      }),

    remove: (_request: Request, { params }: IdContext) =>
      guarded(async () => {
        const { id } = await params;
        await (await collection()).deleteOne({ _id: id });
        return new Response(null, { status: 204 });
      }),
  };
}
