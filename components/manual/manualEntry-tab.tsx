"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";

interface ManualPayment {
  id: number;
  user_email: string;
  name: string;
  phone: string;
  ticket_type: string;
  quantity: number;
  price: string;
  total_price: string;
  final_price: string;
  discount_amount: string;
  promo_code: string | null;
  reference_code: string;
  payment_status: "pending" | "confirmed" | "rejected";
  momo_number: string;
  admin_notes: string | null;
  confirmed_by: string | null;
  confirmed_at: string | null;
  created_at: string;
}

interface ManualPaymentsApiResponse {
  data: ManualPayment[];
  success?: boolean;
  error?: string;
}

export function ManualEntryTab() {
  const [payments, setPayments] = useState<ManualPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState<{ [key: string]: string }>({});

  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchCode, setSearchCode] = useState("");

  const { user } = useUser();
  const adminName = user?.firstName || user?.fullName || "admin";

  useEffect(() => {
    fetchManualPayments();
  }, []);

  const fetchManualPayments = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/manual-payments`
      );
      const data: ManualPaymentsApiResponse = await res.json();

      if (!res.ok || !data.data)
        throw new Error(data.error || "Failed to fetch manual payments");

      setPayments(data.data);
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) setError(err.message);
      else setError("An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async (referenceCode: string) => {
    setProcessing(referenceCode);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/confirm-manual-payment/${referenceCode}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            confirmed_by: adminName,
            admin_notes: adminNotes[referenceCode] || "",
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        await fetchManualPayments(); // Refresh the list
        alert(`Payment confirmed! Ticket code: ${data.ticket_code}`);
      } else {
        alert(data.error || "Failed to confirm payment");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while confirming payment");
    } finally {
      setProcessing(null);
    }
  };

  const handleRejectPayment = async (referenceCode: string) => {
    setProcessing(referenceCode);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/reject-manual-payment/${referenceCode}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            confirmed_by: adminName,
            admin_notes: adminNotes[referenceCode] || "Payment rejected",
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        await fetchManualPayments(); // Refresh the list
        alert("Payment rejected successfully");
      } else {
        alert(data.error || "Failed to reject payment");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while rejecting payment");
    } finally {
      setProcessing(null);
    }
  };

  const statusBadge = (status: string) => {
    const statuses: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return statuses[status] || "bg-gray-100 text-gray-800";
  };

  const typeBadge = (type: string) => {
    const types: Record<string, string> = {
      early_bird: "bg-green-100 text-green-800",
      regular: "bg-blue-100 text-blue-800",
      late: "bg-red-100 text-red-800",
    };
    return types[type] || "bg-gray-100 text-gray-800";
  };

  // Filter payments
  const filteredPayments = payments.filter((payment) => {
    const matchStatus =
      filterStatus === "all" || payment.payment_status === filterStatus;
    const matchSearch =
      searchCode === "" ||
      payment.reference_code.toLowerCase().includes(searchCode.toLowerCase()) ||
      payment.name.toLowerCase().includes(searchCode.toLowerCase()) ||
      payment.user_email.toLowerCase().includes(searchCode.toLowerCase());

    return matchStatus && matchSearch;
  });

  if (loading) return <p>Loading manual payments...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white shadow rounded-lg p-6 overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4">Manual Payments</h2>

      {/* Filters + Search */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <Input
          type="text"
          placeholder="Search by reference, name, or email..."
          className="border rounded px-3 py-2 w-80 text-sm"
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
        />

        {/* Status Filter */}
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <Button
          onClick={fetchManualPayments}
          variant="outline"
          className="ml-auto"
        >
          Refresh
        </Button>
      </div>

      {/* Payments Table */}
      {filteredPayments.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No manual payments found.
        </p>
      ) : (
        <table className="w-full min-w-[800px] text-sm border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="p-3">Reference</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Type</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((payment) => (
              <tr key={payment.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-mono text-xs">
                  {payment.reference_code}
                </td>
                <td className="p-3">
                  <div>
                    <p className="font-medium">{payment.name}</p>
                    <p className="text-gray-500 text-xs">{payment.phone}</p>
                  </div>
                </td>
                <td className="p-3 text-sm">{payment.user_email}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${typeBadge(
                      payment.ticket_type
                    )}`}
                  >
                    {payment.ticket_type.replace("_", " ").toUpperCase()}
                  </span>
                </td>
                <td className="p-3">
                  <div>
                    <p className="font-medium">₵{payment.final_price}</p>
                    {parseFloat(payment.discount_amount) > 0 && (
                      <p className="text-xs text-green-600">
                        -₵{payment.discount_amount} discount
                      </p>
                    )}
                  </div>
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${statusBadge(
                      payment.payment_status
                    )}`}
                  >
                    {payment.payment_status.toUpperCase()}
                  </span>
                </td>
                <td className="p-3 text-sm">
                  {new Date(payment.created_at).toLocaleDateString()}
                </td>
                <td className="p-3">
                  {payment.payment_status === "pending" && (
                    <div className="flex flex-col gap-2">
                      <Input
                        placeholder="Admin notes (optional)"
                        value={adminNotes[payment.reference_code] || ""}
                        onChange={(e) =>
                          setAdminNotes({
                            ...adminNotes,
                            [payment.reference_code]: e.target.value,
                          })
                        }
                        className="text-xs w-32"
                        size={1}
                      />
                      <div className="flex gap-1">
                        <Button
                          onClick={() =>
                            handleConfirmPayment(payment.reference_code)
                          }
                          disabled={processing === payment.reference_code}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white text-xs"
                        >
                          {processing === payment.reference_code
                            ? "..."
                            : "Confirm"}
                        </Button>
                        <Button
                          onClick={() =>
                            handleRejectPayment(payment.reference_code)
                          }
                          disabled={processing === payment.reference_code}
                          size="sm"
                          variant="destructive"
                          className="text-xs"
                        >
                          {processing === payment.reference_code
                            ? "..."
                            : "Reject"}
                        </Button>
                      </div>
                    </div>
                  )}
                  {payment.payment_status === "confirmed" && (
                    <span className="text-green-600 text-xs">✓ Confirmed</span>
                  )}
                  {payment.payment_status === "rejected" && (
                    <span className="text-red-600 text-xs">✗ Rejected</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-4 gap-4 text-sm">
        <div className="bg-gray-50 p-3 rounded border">
          <p className="font-semibold">Total</p>
          <p className="text-2xl">{payments.length}</p>
        </div>
        <div className="bg-yellow-50 p-3 rounded border">
          <p className="font-semibold">Pending</p>
          <p className="text-2xl">
            {payments.filter((p) => p.payment_status === "pending").length}
          </p>
        </div>
        <div className="bg-green-50 p-3 rounded border">
          <p className="font-semibold">Confirmed</p>
          <p className="text-2xl">
            {payments.filter((p) => p.payment_status === "confirmed").length}
          </p>
        </div>
        <div className="bg-red-50 p-3 rounded border">
          <p className="font-semibold">Rejected</p>
          <p className="text-2xl">
            {payments.filter((p) => p.payment_status === "rejected").length}
          </p>
        </div>
      </div>
    </div>
  );
}
