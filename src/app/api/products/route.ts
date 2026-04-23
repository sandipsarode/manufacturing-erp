import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAdmin, getSession } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    const products = await prisma.product.findMany({
      where: search ? {
        OR: [
          { name: { contains: search } },
          { sku: { contains: search } },
        ]
      } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAdmin(); // or Manager
    const data = await request.json();

    const existing = await prisma.product.findUnique({ where: { sku: data.sku } });
    if (existing) {
      return NextResponse.json({ error: 'SKU already exists' }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        sku: data.sku,
        minStockLevel: Number(data.minStockLevel) || 0,
      }
    });

    await logAudit(session.id, 'CREATED_PRODUCT', 'Product', product.id, data);
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
