import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const wo = await prisma.workOrder.findFirst({ include: { finishedGood: true, bom: true } });
  console.log('WorkOrder OK:', wo?.id, wo?.finishedGood?.name);

  const bom = await prisma.bOM.findFirst({ include: { finishedGood: true, items: { include: { product: true } } } });
  console.log('BOM OK:', bom?.id, bom?.finishedGood?.name);

  const sm = await prisma.stockMovement.findFirst({ orderBy: { createdAt: 'desc' }, include: { product: true } });
  console.log('StockMovement OK:', sm?.id, sm?.createdAt, sm?.type);

  const products = await prisma.product.count();
  console.log('Products:', products);
}

main().catch(console.error).finally(() => prisma.$disconnect());
