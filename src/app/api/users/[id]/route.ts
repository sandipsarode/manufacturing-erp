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

    const targetUser = await prisma.user.findUnique({ where: { id }, include: { role: true } });
    if (!targetUser) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (targetUser.role.name === 'Admin' && (!data.active || data.roleId !== targetUser.roleId)) {
      const adminCount = await prisma.user.count({ where: { role: { name: 'Admin' }, active: true } });
      if (adminCount <= 1) {
        return NextResponse.json({ error: 'Cannot downgrade or deactivate the last Admin' }, { status: 400 });
      }
    }

    // Sync permissions
    if (data.modules) {
      await prisma.userPermission.deleteMany({ where: { userId: id } });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        roleId: data.roleId,
        companyId: data.companyId || null,
        language: data.language,
        timezone: data.timezone,
        active: data.active,
        permissions: {
          create: data.modules?.map((module: string) => ({
            permission: {
              connectOrCreate: {
                where: { module_action: { module, action: "all" } },
                create: { module, action: "all" }
              }
            }
          })) || []
        }
      },
      include: { role: true, permissions: { include: { permission: true } } }
    });

    await logAudit(session.id, 'UPDATED_USER', 'User', updatedUser.id, { changes: data });

    const { password, ...safeUser } = updatedUser;
    return NextResponse.json(safeUser);
  } catch (error: any) {
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
