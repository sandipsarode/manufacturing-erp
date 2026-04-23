import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

const prisma = new PrismaClient();

export async function POST(request: Request, context: any) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const { id } = context.params;
    const { type, quantity, reference } = await request.json();
    const numQty = Number(quantity);

    if (numQty <= 0) return NextResponse.json({ error: 'Quantity must be positive' }, { status: 400 });

    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({ where: { id } });
      if (!product) throw new Error('Product not found');

      if (type === 'OUT' && product.availableQty < numQty) {
        throw new Error(`Insufficient stock. Only ${product.availableQty} available.`);
      }

      const movement = await tx.stockMovement.create({
        data: {
          productId: id,
          type,
          quantity: numQty,
          reference
        }
      });

      const updatedProduct = await tx.product.update({
        where: { id },
        data: {
          availableQty: type === 'IN' 
            ? product.availableQty + numQty 
            : product.availableQty - numQty
        }
      });

      return { movement, updatedProduct };
    });

    await logAudit(session.id, 'STOCK_MOVEMENT', 'Product', id, { type, quantity: numQty, reference });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 400 });
  }
}
