import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Edit2, ArrowUpDown, Trash2 } from "lucide-react";

export function ProductsDataTable({ products, onEdit, onMovement, onDelete }: any) {
  return (
    <div className="rounded-md border bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50/50">
          <TableRow>
            <TableHead>SKU</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Available Qty</TableHead>
            <TableHead className="text-right">Reserved Qty</TableHead>
            <TableHead className="text-right">Min Level</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product: any) => {
            const isLowStock = product.availableQty < product.minStockLevel;
            return (
              <TableRow key={product.id} className="hover:bg-gray-50/80 transition-colors">
                <TableCell className="font-mono text-xs">{product.sku}</TableCell>
                <TableCell className="font-medium text-gray-900">{product.name}</TableCell>
                <TableCell className="text-right">
                  <Badge variant={isLowStock ? "destructive" : "default"} className={isLowStock ? "bg-red-100 text-red-800 hover:bg-red-200 border-red-200" : "bg-blue-50 text-blue-800 hover:bg-blue-100 border-blue-200"}>
                    {product.availableQty}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-gray-500">{product.reservedQty}</TableCell>
                <TableCell className="text-right text-gray-500">{product.minStockLevel}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onMovement(product)}>
                        <ArrowUpDown className="mr-2 h-4 w-4 text-blue-500" /> Stock Movement
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(product)}>
                        <Edit2 className="mr-2 h-4 w-4 text-gray-500" /> Edit Product
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(product)} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4 text-red-500" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
          {products.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="h-32 text-center text-gray-500">
                No products found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
