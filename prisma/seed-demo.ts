import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

async function main() {
  console.log('🌱 Seeding demo data...');

  // 1. Ensure company exists
  const company = await prisma.company.upsert({
    where: { name: 'Acme Manufacturing' },
    update: {},
    create: { name: 'Acme Manufacturing', address: '123 Industrial Park, Mumbai, IN' }
  });

  // 2. Create raw materials
  const rawMaterials = [
    { name: 'Steel Rod (6mm)', sku: 'RM-STEEL-001', minStockLevel: 50 },
    { name: 'Aluminum Sheet', sku: 'RM-ALUM-002', minStockLevel: 30 },
    { name: 'Rubber Gasket', sku: 'RM-RUBB-003', minStockLevel: 100 },
    { name: 'Copper Wire (Roll)', sku: 'RM-COPP-004', minStockLevel: 20 },
    { name: 'Bearing Assembly', sku: 'RM-BEAR-005', minStockLevel: 25 },
    { name: 'Plastic Housing', sku: 'RM-PLAS-006', minStockLevel: 40 },
  ];

  const finishedGoods = [
    { name: 'Motor Assembly Unit', sku: 'FG-MOTR-001', minStockLevel: 10 },
    { name: 'Pump Housing Kit', sku: 'FG-PUMP-002', minStockLevel: 5 },
    { name: 'Control Panel Module', sku: 'FG-CTRL-003', minStockLevel: 8 },
  ];

  console.log('  Creating products...');
  const createdRMs: any[] = [];
  for (const rm of rawMaterials) {
    const p = await prisma.product.upsert({
      where: { sku: rm.sku },
      update: {},
      create: { ...rm, availableQty: 0 }
    });
    createdRMs.push(p);
  }

  const createdFGs: any[] = [];
  for (const fg of finishedGoods) {
    const p = await prisma.product.upsert({
      where: { sku: fg.sku },
      update: {},
      create: { ...fg, availableQty: 0 }
    });
    createdFGs.push(p);
  }

  // 3. Stock IN movements for raw materials (spread over last 7 days)
  console.log('  Creating stock movements...');
  const stockIns = [
    { productId: createdRMs[0].id, quantity: 200, daysBack: 6 },
    { productId: createdRMs[1].id, quantity: 150, daysBack: 5 },
    { productId: createdRMs[2].id, quantity: 400, daysBack: 5 },
    { productId: createdRMs[3].id, quantity: 80,  daysBack: 4 },
    { productId: createdRMs[4].id, quantity: 60,  daysBack: 3 },
    { productId: createdRMs[5].id, quantity: 120, daysBack: 2 },
  ];

  for (const s of stockIns) {
    await prisma.stockMovement.create({
      data: { productId: s.productId, type: 'IN', quantity: s.quantity, reference: 'PO-DEMO', date: daysAgo(s.daysBack), createdAt: daysAgo(s.daysBack) }
    });
    await prisma.product.update({
      where: { id: s.productId },
      data: { availableQty: { increment: s.quantity } }
    });
  }

  // 4. Create BOMs
  console.log('  Creating BOMs...');
  const bom1 = await prisma.bOM.upsert({
    where: { id: 'bom-motor-001' },
    update: {},
    create: {
      id: 'bom-motor-001',
      name: 'Motor Assembly BOM',
      description: 'Standard motor assembly recipe',
      finishedGoodId: createdFGs[0].id,
      items: {
        create: [
          { productId: createdRMs[0].id, quantity: 5 },
          { productId: createdRMs[3].id, quantity: 2 },
          { productId: createdRMs[4].id, quantity: 3 },
        ]
      }
    }
  });

  const bom2 = await prisma.bOM.upsert({
    where: { id: 'bom-pump-001' },
    update: {},
    create: {
      id: 'bom-pump-001',
      name: 'Pump Housing BOM',
      description: 'Pump assembly with gaskets',
      finishedGoodId: createdFGs[1].id,
      items: {
        create: [
          { productId: createdRMs[1].id, quantity: 3 },
          { productId: createdRMs[2].id, quantity: 8 },
          { productId: createdRMs[5].id, quantity: 2 },
        ]
      }
    }
  });

  // 5. Create Work Orders (some completed, some in-progress, some draft)
  console.log('  Creating work orders...');

  // Completed last 7 days (to populate chart)
  const completedWOs = [
    { daysBack: 6, qty: 10, bom: bom1, fg: createdFGs[0] },
    { daysBack: 5, qty: 8,  bom: bom2, fg: createdFGs[1] },
    { daysBack: 4, qty: 15, bom: bom1, fg: createdFGs[0] },
    { daysBack: 3, qty: 12, bom: bom2, fg: createdFGs[1] },
    { daysBack: 2, qty: 20, bom: bom1, fg: createdFGs[0] },
    { daysBack: 1, qty: 7,  bom: bom2, fg: createdFGs[1] },
    { daysBack: 0, qty: 18, bom: bom1, fg: createdFGs[0] },
  ];

  for (const wo of completedWOs) {
    const workOrder = await prisma.workOrder.create({
      data: {
        bomId: wo.bom.id,
        finishedGoodId: wo.fg.id,
        plannedQty: wo.qty,
        producedQty: wo.qty,
        status: 'COMPLETED',
        createdAt: daysAgo(wo.daysBack),
        updatedAt: daysAgo(wo.daysBack),
      }
    });

    // Deduct raw materials and create OUT movements
    const bomItems = await prisma.bOMItem.findMany({ where: { bomId: wo.bom.id } });
    for (const item of bomItems) {
      const totalQty = item.quantity * wo.qty;
      await prisma.stockMovement.create({
        data: { productId: item.productId, type: 'OUT', quantity: totalQty, reference: `WO-${workOrder.id.slice(-6).toUpperCase()}`, date: daysAgo(wo.daysBack), createdAt: daysAgo(wo.daysBack) }
      });
      await prisma.product.update({
        where: { id: item.productId },
        data: { availableQty: { decrement: totalQty } }
      });
    }

    // Add finished good
    await prisma.stockMovement.create({
      data: { productId: wo.fg.id, type: 'IN', quantity: wo.qty, reference: `WO-${workOrder.id.slice(-6).toUpperCase()}`, date: daysAgo(wo.daysBack), createdAt: daysAgo(wo.daysBack) }
    });
    await prisma.product.update({
      where: { id: wo.fg.id },
      data: { availableQty: { increment: wo.qty } }
    });
  }

  // Active (IN_PROGRESS) WOs
  await prisma.workOrder.create({
    data: {
      bomId: bom1.id, finishedGoodId: createdFGs[0].id,
      plannedQty: 25, producedQty: 0, status: 'IN_PROGRESS',
    }
  });
  await prisma.workOrder.create({
    data: {
      bomId: bom2.id, finishedGoodId: createdFGs[1].id,
      plannedQty: 10, producedQty: 0, status: 'IN_PROGRESS',
    }
  });

  // Draft WOs
  await prisma.workOrder.create({
    data: {
      bomId: bom1.id, finishedGoodId: createdFGs[0].id,
      plannedQty: 50, producedQty: 0, status: 'DRAFT',
    }
  });

  // Make one item low-stock intentionally for the KPI indicator
  await prisma.product.update({
    where: { id: createdRMs[3].id }, // Copper Wire
    data: { availableQty: 3 }        // below minStockLevel of 20
  });
  await prisma.product.update({
    where: { id: createdRMs[4].id }, // Bearing Assembly
    data: { availableQty: 5 }        // below minStockLevel of 25
  });

  console.log('✅ Demo data seeded successfully!');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
