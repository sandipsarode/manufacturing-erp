import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  context: any
) {
  const { id } = context.params;
  if (!await getSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  try {
    const company = await prisma.company.findUnique({
      where: { id: id }
    });
    
    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }
    
    return NextResponse.json(company);
  } catch (error) {
    console.error("Error fetching company:", error);
    return NextResponse.json({ error: 'Failed to fetch company' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  context: any
) {
  const { id } = context.params;
  if (!await getSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  try {
    const data = await req.json();
    const company = await prisma.company.update({
      where: { id: id },
      data: {
        name: data.name,
        address: data.address,
        taxId: data.taxId,
        city: data.city,
        state: data.state,
        country: data.country,
        currency: data.currency,
        fiscalYearStart: data.fiscalYearStart,
        multiCurrency: data.multiCurrency,
        uomAdvanced: data.uomAdvanced,
        logo: data.logo,
        isPrimary: data.isPrimary,
      }
    });
    
    return NextResponse.json(company);
  } catch (error) {
    console.error("Error updating company:", error);
    return NextResponse.json({ error: 'Failed to update company' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  context: any
) {
  const { id } = context.params;
  if (!await getSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  try {
    await prisma.company.delete({
      where: { id: id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting company:", error);
    return NextResponse.json({ error: 'Failed to delete company' }, { status: 500 });
  }
}
