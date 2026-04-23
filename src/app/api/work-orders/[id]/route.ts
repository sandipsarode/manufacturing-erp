import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@/lib/auth';

const prisma = new PrismaClient();

export async function PUT(request: Request, context: any) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const { id } = context.params;
  const { status, producedQty } = await request.json();

  try {
    const order = await prisma.workOrder.findUnique({
      where: { id },
      include: { bom: { include: { items: true } } }
    });

    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (order.status === 'COMPLETED') return NextResponse.json({ error: 'Already completed' }, { status: 400 });

    if (status === 'COMPLETED') {
      const finalQty = producedQty ? Number(producedQty) : order.plannedQty;

      const result = await prisma.$transaction(async (tx) => {
        // 1. Deduct raw materials
        for (const item of order.bom.items) {
          const totalRequired = item.quantity * finalQty;
          
          const product = await tx.product.findUnique({ where: { id: item.productId } });
          if (!product || product.availableQty < totalRequired) {
            throw new Error(`Insufficient stock for raw material ${product?.name || item.productId}`);
          }

          await tx.stockMovement.create({
            data: { productId: item.productId, type: 'OUT', quantity: totalRequired, reference: `WO-${order.id}` }
          });

          await tx.product.update({
            where: { id: item.productId },
            data: { availableQty: product.availableQty - totalRequired }
          });
        }

        // 2. Increase finished good
        await tx.stockMovement.create({
          data: { productId: order.finishedGoodId, type: 'IN', quantity: finalQty, reference: `WO-${order.id}` }
        });

        const fg = await tx.product.findUnique({ where: { id: order.finishedGoodId }});
        if (fg) {
           await tx.product.update({
             where: { id: order.finishedGoodId },
             data: { availableQty: fg.availableQty + finalQty }
           });
        }

        // 3. Mark completed
        return await tx.workOrder.update({
          where: { id },
          data: { status: 'COMPLETED', producedQty: finalQty }
        });
      });

      return NextResponse.json(result);
    } else {
      const updated = await prisma.workOrder.update({
        where: { id },
        data: { status }
      });
      return NextResponse.json(updated);
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update' }, { status: 400 });
  }
}
