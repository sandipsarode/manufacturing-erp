import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession, requireAdmin } from '@/lib/auth';
import { logAudit } from '@/lib/audit';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role');
    const status = searchParams.get('status');

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ];
    }
    if (role && role !== 'all') {
      where.role = { name: role };
    }
    if (status && status !== 'all') {
      where.active = status === 'active';
    }

    const users = await prisma.user.findMany({
      where,
      include: {
        role: true,
        company: true,
        permissions: {
          include: { permission: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    const safeUsers = users.map(u => {
      const { password, ...rest } = u;
      return rest;
    });

    return NextResponse.json(safeUsers);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAdmin();
    const data = await request.json();

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        roleId: data.roleId,
        companyId: data.companyId || null,
        language: data.language || "English",
        timezone: data.timezone || "UTC",
        active: true,
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

    await logAudit(session.id, 'CREATED_USER', 'User', user.id, { email: user.email, role: user.role.name });

    const { password, ...safeUser } = user;
    return NextResponse.json(safeUser);
  } catch (error: any) {
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
