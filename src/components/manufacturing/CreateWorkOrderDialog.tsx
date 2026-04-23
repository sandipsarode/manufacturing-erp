import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export function CreateWorkOrderDialog({ open, onOpenChange, boms, onSuccess }: any) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bomId: "",
    plannedQty: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.bomId || formData.plannedQty <= 0) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/work-orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create Work Order");

      toast.success("Work Order created successfully");
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Work Order</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Bill of Materials (BOM)</Label>
            <Select value={formData.bomId} onValueChange={(val) => val && setFormData({ ...formData, bomId: val })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a BOM" />
              </SelectTrigger>
              <SelectContent>
                {boms.map((bom: any) => (
                  <SelectItem key={bom.id} value={bom.id}>{bom.name} ({bom.finishedGood?.name})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Planned Quantity</Label>
            <Input
              type="number"
              min={1}
              value={formData.plannedQty}
              onChange={(e) => setFormData({ ...formData, plannedQty: Number(e.target.value) })}
              required
            />
          </div>
          <div className="pt-4 space-x-2 flex justify-end">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading || !formData.bomId}>
              {loading ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
