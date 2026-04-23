"use client";

import { useEffect, useState } from "react";
import { ProductsDataTable } from "@/components/inventory/ProductsDataTable";
import { ProductFormDialog } from "@/components/inventory/ProductFormDialog";
import { StockMovementDialog } from "@/components/inventory/StockMovementDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Package, AlertTriangle, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { toast, Toaster } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isMovementDialogOpen, setIsMovementDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/products?search=${search}`);
      if (res.ok) setProducts(await res.json());
    } catch { toast.error("Failed to fetch products"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [search]);

  const lowStock = (products as any[]).filter((p: any) => p.availableQty < p.minStockLevel).length;
  const totalQty  = (products as any[]).reduce((s: number, p: any) => s + p.availableQty, 0);

  const handleDelete = async (product: any) => {
    if (!confirm(`Delete ${product.name}?`)) return;
    const res = await fetch(`/api/products/${product.id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) { toast.error(data.error); return; }
    toast.success("Product deleted");
    fetchData();
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Inventory Management</h2>
          <p className="text-sm text-gray-500 mt-0.5">Track products, stock levels, and movements</p>
        </div>
        <Button onClick={() => { setSelectedProduct(null); setIsProductDialogOpen(true); }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-md shadow-indigo-200">
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Products", value: products.length, icon: Package, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Low Stock",      value: lowStock,         icon: AlertTriangle, color: "text-red-600",    bg: "bg-red-50" },
          { label: "Total IN Units", value: totalQty,         icon: ArrowDownRight, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Out of Stock",   value: (products as any[]).filter((p: any) => p.availableQty === 0).length, icon: ArrowUpRight, color: "text-amber-600", bg: "bg-amber-50" },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <div className={`${c.bg} ${c.color} h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0`}>
              <c.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{c.value}</p>
              <p className="text-xs text-gray-500">{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by SKU or name..."
            className="pl-9 rounded-xl border-gray-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-2">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}</div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <ProductsDataTable
            products={products}
            onEdit={(p: any) => { setSelectedProduct(p); setIsProductDialogOpen(true); }}
            onMovement={(p: any) => { setSelectedProduct(p); setIsMovementDialogOpen(true); }}
            onDelete={handleDelete}
          />
        </div>
      )}

      <ProductFormDialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen} product={selectedProduct} onSuccess={fetchData} />
      <StockMovementDialog open={isMovementDialogOpen} onOpenChange={setIsMovementDialogOpen} product={selectedProduct} onSuccess={fetchData} />
      <Toaster position="top-right" />
    </div>
  );
}
