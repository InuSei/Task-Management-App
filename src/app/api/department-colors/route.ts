import { NextResponse } from 'next/server';
import { DEFAULT_DEPARTMENT_COLORS, isDepartmentColors } from '@/domain/roleColor';
import { fail, guarded, readBody, type StoredDoc } from '@/server/collectionHandlers';
import { getDb } from '@/server/mongo';

// Shared department colours live in one settings document, next to the week list.
const colorsDoc = async () => ({
  collection: (await getDb()).collection<StoredDoc>('settings'),
  filter: { _id: 'departmentColors' },
});

export const GET = () =>
  guarded(async () => {
    const { collection, filter } = await colorsDoc();
    const doc: unknown = await collection.findOne(filter, { projection: { _id: 0 } });
    return NextResponse.json(isDepartmentColors(doc) ? doc : DEFAULT_DEPARTMENT_COLORS);
  });

export const PUT = (request: Request) =>
  guarded(async () => {
    const colors = await readBody(request, isDepartmentColors);
    if (!colors) return fail(400, 'Invalid department colors');
    const { collection, filter } = await colorsDoc();
    await collection.replaceOne(filter, { ...colors }, { upsert: true });
    return new Response(null, { status: 204 });
  });
