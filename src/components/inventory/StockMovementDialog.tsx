import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export function StockMovementDialog({ open, onOpenChange, product, onSuccess }: any) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "IN",
    quantity: 1,
    reference: "",
  });

  useEffect(() => {
    if (open) {
      setFormData({ type: "IN", quantity: 1, reference: "" });
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/products/${product.id}/movements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to log movement");

      toast.success("Stock movement logged successfully");
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Stock Movement - {product.sku}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={formData.type} onValueChange={(val) => val && setFormData({ ...formData, type: val })}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IN">IN (Receive Stock)</SelectItem>
                <SelectItem value="OUT">OUT (Deduct Stock)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="qty">Quantity</Label>
            <Input
              id="qty"
              type="number"
              min={1}
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
              required
            />
            {formData.type === "OUT" && product.availableQty < formData.quantity && (
              <p className="text-sm text-red-500">Quantity exceeds available stock ({product.availableQty})</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="ref">Reference (Optional)</Label>
            <Input
              id="ref"
              placeholder="e.g. PO-1234 or WO-5678"
              value={formData.reference}
              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
            />
          </div>
          <div className="pt-4 space-x-2 flex justify-end">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading || (formData.type === "OUT" && product.availableQty < formData.quantity)}>
              {loading ? "Processing..." : "Confirm Movement"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
