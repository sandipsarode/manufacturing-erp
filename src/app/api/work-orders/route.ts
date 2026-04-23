import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const orders = await prisma.workOrder.findMany({
    include: {
      bom: true,
      finishedGood: true,
      assignedTo: { select: { id: true, name: true, email: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const { bomId, assignedToId, plannedQty } = await request.json();

  try {
    const bom = await prisma.bOM.findUnique({ where: { id: bomId } });
    if (!bom) return NextResponse.json({ error: 'BOM not found' }, { status: 404 });

    const order = await prisma.workOrder.create({
      data: {
        bomId,
        finishedGoodId: bom.finishedGoodId,
        assignedToId: assignedToId || null,
        plannedQty: Number(plannedQty),
        status: 'DRAFT'
      },
      include: { bom: true, finishedGood: true }
    });
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create Work Order' }, { status: 500 });
  }
}
