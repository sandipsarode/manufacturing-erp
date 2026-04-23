import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 7-day window
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const [
      totalProducts,
      allProducts,
      activeWorkOrders,
      completedToday,
      recentMovements,
      recentWorkOrders,
      woStatusGroup,
      inventoryUsageRaw,
      allWorkOrders,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.findMany({ select: { availableQty: true, minStockLevel: true } }),
      prisma.workOrder.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.workOrder.count({ where: { status: 'COMPLETED', updatedAt: { gte: today } } }),
      prisma.stockMovement.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { product: { select: { name: true, sku: true } } }
      }),
      prisma.workOrder.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { finishedGood: { select: { name: true } } }
      }),
      prisma.workOrder.groupBy({ by: ['status'], _count: true }),
      prisma.stockMovement.groupBy({
        by: ['productId'],
        where: { type: 'OUT' },
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 6
      }),
      prisma.workOrder.findMany({
        where: { status: 'COMPLETED', createdAt: { gte: sevenDaysAgo } },
        select: { createdAt: true, producedQty: true }
      }),
    ]);

    const lowStockItems = allProducts.filter(p => p.availableQty < p.minStockLevel).length;

    // Build production trend over last 7 days
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const trendMap: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      trendMap[key] = 0;
    }
    for (const wo of allWorkOrders) {
      const d = new Date(wo.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      if (key in trendMap) trendMap[key] += wo.producedQty || 1;
    }
    const productionTrend = Object.entries(trendMap).map(([key, completed]) => {
      const parts = key.split('-');
      const d = new Date(Number(parts[0]), Number(parts[1]), Number(parts[2]));
      return { name: days[d.getDay()], completed };
    });

    // Resolve product names for inventory usage
    const inventoryUsage = await Promise.all(
      inventoryUsageRaw.map(async (item) => {
        const p = await prisma.product.findUnique({ where: { id: item.productId }, select: { name: true } });
        return { name: p?.name || 'Unknown', quantity: item._sum.quantity || 0 };
      })
    );

    const workOrderStatus = woStatusGroup.map(g => ({
      name: g.status.replace('_', ' '),
      value: g._count
    }));

    return NextResponse.json({
      kpis: { totalProducts, lowStockItems, activeWorkOrders, completedToday },
      charts: { productionTrend, inventoryUsage, workOrderStatus },
      recentActivity: { movements: recentMovements, workOrders: recentWorkOrders }
    });

  } catch (error: any) {
    console.error('[Dashboard API Error]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
