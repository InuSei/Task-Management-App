import { NextResponse } from 'next/server';
import { DEFAULT_WEEKS, isWeekContext } from '@/domain/week';
import { fail, guarded, readBody, type StoredDoc } from '@/server/collectionHandlers';
import { getDb } from '@/server/mongo';

// The shared week list lives in one settings document.
const weeksDoc = async () => ({ collection: (await getDb()).collection<StoredDoc>('settings'), filter: { _id: 'weeks' } });

export const GET = () =>
  guarded(async () => {
    const { collection, filter } = await weeksDoc();
    const doc: unknown = await collection.findOne(filter, { projection: { _id: 0 } });
    return NextResponse.json(isWeekContext(doc) ? doc : DEFAULT_WEEKS);
  });

export const PUT = (request: Request) =>
  guarded(async () => {
    const weeks = await readBody(request, isWeekContext);
    if (!weeks) return fail(400, 'Invalid week list');
    const { collection, filter } = await weeksDoc();
    await collection.replaceOne(filter, { ...weeks }, { upsert: true });
    return new Response(null, { status: 204 });
  });
