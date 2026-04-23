import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

export function CreateBOMDialog({ open, onOpenChange, onSuccess }: any) {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    finishedGoodId: "",
    items: [{ productId: "", quantity: 1 }]
  });

  useEffect(() => {
    if (open) {
      fetch("/api/products").then(r => r.json()).then(setProducts);
      setFormData({ name: "", finishedGoodId: "", items: [{ productId: "", quantity: 1 }] });
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.finishedGoodId || formData.items.some(i => !i.productId || i.quantity <= 0)) {
      toast.error("Please fill in all valid details");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch(`/api/bom`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create BOM");

      toast.success("BOM created successfully");
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Bill of Materials</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4 max-h-[80vh] overflow-y-auto">
          <div className="space-y-2">
            <Label>BOM Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Finished Good</Label>
            <Select value={formData.finishedGoodId} onValueChange={(val) => val && setFormData({ ...formData, finishedGoodId: val })}>
              <SelectTrigger><SelectValue placeholder="Select final product" /></SelectTrigger>
              <SelectContent>
                {products.map((p: any) => (
                  <SelectItem key={p.id} value={p.id}>{p.name} ({p.sku})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="pt-4 border-t">
            <Label className="mb-2 block">Raw Materials</Label>
            {formData.items.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2 items-center">
                <Select value={item.productId} onValueChange={(val) => val && updateItem(index, "productId", val)}>
                  <SelectTrigger className="flex-1"><SelectValue placeholder="Select raw material" /></SelectTrigger>
                  <SelectContent>
                    {products.map((p: any) => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  min={0.1}
                  step={0.1}
                  className="w-24"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, "quantity", Number(e.target.value))}
                  required
                />
                <Button type="button" variant="ghost" size="icon" className="text-red-500" onClick={() => setFormData({ ...formData, items: formData.items.filter((_, i) => i !== index) })}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" className="mt-2 w-full text-xs" onClick={() => setFormData({ ...formData, items: [...formData.items, { productId: "", quantity: 1 }] })}>
              <Plus className="mr-2 h-3 w-3" /> Add Raw Material
            </Button>
          </div>

          <div className="pt-4 space-x-2 flex justify-end">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create BOM"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
