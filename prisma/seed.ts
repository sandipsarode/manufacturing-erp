import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- 🚀 Starting Advanced Seed ---');

  // 1. Roles
  console.log('Upserting roles...');
  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: { name: 'Admin', description: 'Full access to all modules' },
  });

  const managerRole = await prisma.role.upsert({
    where: { name: 'Manager' },
    update: {},
    create: { name: 'Manager', description: 'Department level access' },
  });

  const operatorRole = await prisma.role.upsert({
    where: { name: 'Operator' },
    update: {},
    create: { name: 'Operator', description: 'Limited execution access' },
  });

  // 2. Users
  console.log('Upserting users...');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@erp.com' },
    update: {},
    create: {
      name: 'System Admin',
      email: 'admin@erp.com',
      password: hashedPassword,
      roleId: adminRole.id,
      active: true,
    },
  });

  const operatorUser = await prisma.user.upsert({
    where: { email: 'operator@erp.com' },
    update: {},
    create: {
      name: 'John Operator',
      email: 'operator@erp.com',
      password: hashedPassword,
      roleId: operatorRole.id,
      active: true,
    },
  });

  // 3. Products (Large Set)
  console.log('Creating products...');
  
  // Clear existing operational data to avoid duplicates/conflicts during heavy seed
  await prisma.stockMovement.deleteMany({});
  await prisma.workOrder.deleteMany({});
  await prisma.bOMItem.deleteMany({});
  await prisma.bOM.deleteMany({});
  await prisma.product.deleteMany({});

  const productsData = [
    // Finished Goods
    { name: 'Quantum Processor X1', sku: 'FG-QP-X1', availableQty: 45, minStockLevel: 20 },
    { name: 'Neural Link Module', sku: 'FG-NL-M1', availableQty: 12, minStockLevel: 25 }, // Low Stock
    { name: 'Fusion Battery Cell', sku: 'FG-FB-C5', availableQty: 89, minStockLevel: 40 },
    { name: 'Titanium Chassis S', sku: 'FG-TC-S', availableQty: 5, minStockLevel: 10 },  // Low Stock
    { name: 'Optic Sensor Array', sku: 'FG-OS-A', availableQty: 150, minStockLevel: 50 },
    
    // Sub-Assemblies
    { name: 'Control Board Rev-B', sku: 'SA-CB-RB', availableQty: 300, minStockLevel: 50 },
    { name: 'Power Converter Sub', sku: 'SA-PC-01', availableQty: 42, minStockLevel: 20 },
    
    // Raw Materials / Components
    { name: 'Silicon Wafer 8"', sku: 'COMP-SIL-8', availableQty: 1200, minStockLevel: 200 },
    { name: 'Gold Wiring 0.5mm', sku: 'COMP-GLD-W', availableQty: 5000, minStockLevel: 500 },
    { name: 'Liquid Cooling Gel', sku: 'COMP-LC-G', availableQty: 250, minStockLevel: 50 },
    { name: 'Titanium Alloy Plate', sku: 'COMP-TI-ALP', availableQty: 80, minStockLevel: 100 }, // Low Stock
    { name: 'M3 Hex Bolt', sku: 'COMP-BOLT-M3', availableQty: 15000, minStockLevel: 2000 },
    { name: 'Fiber Optic Cable 1m', sku: 'COMP-FOC-1', availableQty: 600, minStockLevel: 100 },
  ];

  const createdProducts: any = {};
  for (const p of productsData) {
    const prod = await prisma.product.create({ data: p });
    createdProducts[p.sku] = prod;
  }

  // 4. BOMs
  console.log('Creating BOMs...');
  const bom1 = await prisma.bOM.create({
    data: {
      name: 'Quantum Processor X1 BOM',
      finishedGoodId: createdProducts['FG-QP-X1'].id,
      items: {
        create: [
          { productId: createdProducts['SA-CB-RB'].id, quantity: 1 },
          { productId: createdProducts['COMP-SIL-8'].id, quantity: 2 },
          { productId: createdProducts['COMP-GLD-W'].id, quantity: 5 },
        ]
      }
    }
  });

  const bom2 = await prisma.bOM.create({
    data: {
      name: 'Fusion Battery Cell BOM',
      finishedGoodId: createdProducts['FG-FB-C5'].id,
      items: {
        create: [
          { productId: createdProducts['SA-PC-01'].id, quantity: 1 },
          { productId: createdProducts['COMP-LC-G'].id, quantity: 0.5 },
          { productId: createdProducts['COMP-BOLT-M3'].id, quantity: 12 },
        ]
      }
    }
  });

  // 5. Work Orders (History & Present)
  console.log('Creating work orders...');
  const statuses = ['COMPLETED', 'IN_PROGRESS', 'DRAFT'];
  const now = new Date();

  // Create 25 work orders spread over 30 days
  for (let i = 0; i < 25; i++) {
    const status = i < 15 ? 'COMPLETED' : i < 22 ? 'IN_PROGRESS' : 'DRAFT';
    const finishedGood = i % 2 === 0 ? createdProducts['FG-QP-X1'] : createdProducts['FG-FB-C5'];
    const bom = i % 2 === 0 ? bom1 : bom2;
    
    const createdAt = new Date();
    createdAt.setDate(now.getDate() - (i % 30)); // Spread over 30 days
    
    await prisma.workOrder.create({
      data: {
        bomId: bom.id,
        finishedGoodId: finishedGood.id,
        plannedQty: Math.floor(Math.random() * 50) + 10,
        producedQty: status === 'COMPLETED' ? Math.floor(Math.random() * 50) + 10 : 0,
        status: status,
        assignedToId: adminUser.id,
        createdAt: createdAt,
        updatedAt: status === 'COMPLETED' ? createdAt : now,
      }
    });
  }

  // 6. Stock Movements (Rich Analytics)
  console.log('Creating stock movements...');
  const skus = Object.keys(createdProducts);
  
  for (let i = 0; i < 60; i++) {
    const randomSku = skus[Math.floor(Math.random() * skus.length)];
    const type = Math.random() > 0.3 ? 'IN' : 'OUT';
    const createdAt = new Date();
    createdAt.setDate(now.getDate() - (i % 30));

    await prisma.stockMovement.create({
      data: {
        productId: createdProducts[randomSku].id,
        type: type,
        quantity: Math.floor(Math.random() * 200) + 1,
        reference: type === 'IN' ? `PO-${1000 + i}` : `SO-${2000 + i}`,
        createdAt: createdAt,
      }
    });
  }

  console.log('--- ✅ Seed Complete: The ERP is now BUSY! ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
