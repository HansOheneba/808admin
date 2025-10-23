"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

interface PromoCode {
  id: number;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  max_uses: number;
  used_count: number;
  valid_until: string;
  created_at: string;
}

export function PromoCodesTab() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [creating, setCreating] = useState(false);

  const [newPromo, setNewPromo] = useState<{
    code: string;
    discount_type: "percentage" | "fixed";
    discount_value: number;
    max_uses: number;
    valid_until: string;
  }>({
    code: "",
    discount_type: "percentage",
    discount_value: 0,
    max_uses: 1,
    valid_until: dayjs().add(30, "day").format("YYYY-MM-DD"),
  });

  // Fetch all promo codes
  useEffect(() => {
    const fetchPromoCodes = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/promo-codes`
        );
        const data = await res.json();

        if (!res.ok)
          throw new Error(data.error || "Failed to fetch promo codes");
        setPromoCodes(data.data);
      } catch (err: unknown) {
        console.error(err);
        if (err instanceof Error) setError(err.message);
        else setError("An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchPromoCodes();
  }, []);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!newPromo.code.trim()) {
      errors.code = "Promo code is required";
    } else if (newPromo.code.length < 3) {
      errors.code = "Promo code must be at least 3 characters";
    }

    if (!newPromo.discount_value || newPromo.discount_value <= 0) {
      errors.discount_value = "Discount value must be greater than 0";
    } else if (
      newPromo.discount_type === "percentage" &&
      newPromo.discount_value > 100
    ) {
      errors.discount_value = "Percentage discount cannot exceed 100%";
    }

    if (!newPromo.max_uses || newPromo.max_uses < 1) {
      errors.max_uses = "Max uses must be at least 1";
    }

    if (!newPromo.valid_until) {
      errors.valid_until = "Valid until date is required";
    } else if (dayjs(newPromo.valid_until).isBefore(dayjs(), "day")) {
      errors.valid_until = "Valid until date must be in the future";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreatePromo = async () => {
    if (!validateForm()) {
      return;
    }

    setCreating(true);
    setFormErrors({});

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/promo-codes`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newPromo),
        }
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to create promo code");

      setSuccessMessage(data.message || "Promo code created successfully");

      // Update local state with the actual response data
      if (data.data) {
        setPromoCodes((prev) => [data.data, ...prev]);
      } else {
        // Fallback if no data returned
        setPromoCodes((prev) => [
          ...prev,
          {
            ...newPromo,
            id: Date.now(),
            used_count: 0,
            created_at: dayjs().toISOString(),
          } as PromoCode,
        ]);
      }

      // Reset form and close dialog
      setNewPromo({
        code: "",
        discount_type: "percentage",
        discount_value: 0,
        max_uses: 1,
        valid_until: dayjs().add(30, "day").format("YYYY-MM-DD"),
      });

      setDialogOpen(false);
    } catch (err: unknown) {
      console.error(err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create promo code";
      setFormErrors({ submit: errorMessage });
    }
  };

  const handleInputChange = (
    field: keyof typeof newPromo,
    value: string | number
  ) => {
    setNewPromo((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (loading) return <p>Loading promo codes...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white shadow rounded-lg p-4 overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Promo Codes</h2>

        {/* Create Promo Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create New Promo</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Promo Code</DialogTitle>
            </DialogHeader>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Code <span className="text-red-500">*</span>
                </label>
                <Input
                  value={newPromo.code}
                  onChange={(e) => handleInputChange("code", e.target.value)}
                  placeholder="e.g. EARLY10"
                  className={formErrors.code ? "border-red-500" : ""}
                />
                {formErrors.code && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.code}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Discount Type <span className="text-red-500">*</span>
                </label>
                <Select
                  value={newPromo.discount_type}
                  onValueChange={(value) =>
                    handleInputChange("discount_type", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount (GHS)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Discount Value <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  value={newPromo.discount_value}
                  onChange={(e) =>
                    handleInputChange("discount_value", Number(e.target.value))
                  }
                  className={formErrors.discount_value ? "border-red-500" : ""}
                  min="0"
                  step={newPromo.discount_type === "percentage" ? "1" : "0.01"}
                />
                {formErrors.discount_value && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.discount_value}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {newPromo.discount_type === "percentage"
                    ? "Enter percentage value (e.g., 10 for 10%)"
                    : "Enter fixed amount in GHS (e.g., 15 for 15 GHS)"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Max Uses <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  value={newPromo.max_uses}
                  onChange={(e) =>
                    handleInputChange("max_uses", Number(e.target.value))
                  }
                  className={formErrors.max_uses ? "border-red-500" : ""}
                  min="1"
                />
                {formErrors.max_uses && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.max_uses}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Set to 0 for unlimited uses
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Valid Until <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={newPromo.valid_until}
                  onChange={(e) =>
                    handleInputChange("valid_until", e.target.value)
                  }
                  className={formErrors.valid_until ? "border-red-500" : ""}
                  min={dayjs().format("YYYY-MM-DD")}
                />
                {formErrors.valid_until && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.valid_until}
                  </p>
                )}
              </div>

              {formErrors.submit && (
                <p className="text-red-500 text-sm">{formErrors.submit}</p>
              )}

              <Button
                className="mt-2 w-full"
                onClick={handleCreatePromo}
                disabled={creating}
              >
                {creating ? "Creating..." : "Create Promo"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b text-left">
            <th className="p-2">Code</th>
            <th className="p-2">Type</th>
            <th className="p-2">Discount</th>
            <th className="p-2">Max Uses</th>
            <th className="p-2">Used</th>
            <th className="p-2">Valid Until</th>
          </tr>
        </thead>
        <tbody>
          {promoCodes.map((promo) => (
            <tr key={promo.id} className="border-b hover:bg-gray-50">
              <td className="p-2 font-mono">{promo.code}</td>
              <td className="p-2">{promo.discount_type.toUpperCase()}</td>
              <td className="p-2">
                {promo.discount_value}
                {promo.discount_type === "percentage" ? "%" : " GHS"}
              </td>
              <td className="p-2">
                {promo.max_uses === 0 ? "Unlimited" : promo.max_uses}
              </td>
              <td className="p-2">{promo.used_count}</td>
              <td className="p-2">
                {dayjs(promo.valid_until).format("MMM D, YYYY")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
