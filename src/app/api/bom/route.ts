import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const boms = await prisma.bOM.findMany({
    include: {
      finishedGood: true,
      items: { include: { product: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(boms);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const { name, description, finishedGoodId, items } = await request.json();

  try {
    const bom = await prisma.bOM.create({
      data: {
        name,
        description,
        finishedGoodId,
        items: {
          create: items.map((i: any) => ({
            productId: i.productId,
            quantity: Number(i.quantity)
          }))
        }
      },
      include: { items: true, finishedGood: true }
    });
    return NextResponse.json(bom);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create BOM' }, { status: 500 });
  }
}
