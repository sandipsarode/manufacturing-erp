import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAdmin } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

const prisma = new PrismaClient();

export async function PUT(request: Request, context: any) {
  try {
    const session = await requireAdmin();
    const data = await request.json();
    const { id } = context.params;

    const existing = await prisma.product.findUnique({ where: { sku: data.sku } });
    if (existing && existing.id !== id) {
      return NextResponse.json({ error: 'SKU already exists' }, { status: 400 });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        sku: data.sku,
        minStockLevel: Number(data.minStockLevel),
      }
    });

    await logAudit(session.id, 'UPDATED_PRODUCT', 'Product', id, data);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: any) {
  try {
    const session = await requireAdmin();
    const { id } = context.params;

    await prisma.product.delete({ where: { id } });
    await logAudit(session.id, 'DELETED_PRODUCT', 'Product', id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Cannot delete product currently in use' }, { status: 400 });
  }
}
