import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET() {
  if (!await getSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const companies = await prisma.company.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(companies);
}

export async function POST(req: Request) {
  if (!await getSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const data = await req.json();
    const company = await prisma.company.create({
      data: {
        name: data.name,
        address: data.address,
        taxId: data.taxId,
        city: data.city,
        state: data.state,
        country: data.country,
        currency: data.currency || "USD",
        fiscalYearStart: data.fiscalYearStart || "January",
        multiCurrency: data.multiCurrency || false,
        uomAdvanced: data.uomAdvanced || false,
        logo: data.logo,
        isPrimary: data.isPrimary || false,
      }
    });
    return NextResponse.json(company, { status: 201 });
  } catch (error: any) {
    console.error("Error creating company:", error);
    return NextResponse.json({ error: 'Failed to create company' }, { status: 500 });
  }
}
