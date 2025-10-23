"use client";

import { useState } from "react";
import dayjs from "dayjs";
import { useUser } from "@clerk/nextjs"; // Clerk hook
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TicketDetail {
  id: number;
  name: string;
  ticket_type: string;
  price: string;
  quantity: number;
  total_price: string;
  final_price: string;
  discount_amount: string;
  ticket_code: string;
  payment_status: string;
  checked_in: number;
  checked_in_at: string | null;
  checked_in_by: string | null;
  created_at: string;
  phone: string;
  email: string;
  promo_code: string | null;
}

interface TicketDialogProps {
  ticket_code: string;
}

interface TicketDialogProps {
  ticket_code: string;
  onCheckIn?: (
    ticket_code: string,
    checked_in_by: string,
    checked_in_at: string
  ) => void;
}


export function TicketDialog({ ticket_code, onCheckIn }: TicketDialogProps) {
  const [selectedTicket, setSelectedTicket] = useState<TicketDetail | null>(
    null
  );
  const [modalLoading, setModalLoading] = useState(false);
  const [checkInLoading, setCheckInLoading] = useState(false);

  const { user } = useUser(); // Clerk user
  const adminName = user?.firstName || user?.fullName || "admin";

  const typeBadge = (type: string) => {
    const types: Record<string, string> = {
      early_bird: "bg-green-100 text-green-800",
      regular: "bg-blue-100 text-blue-800",
      late: "bg-red-100 text-red-800",
    };
    return types[type] || "bg-gray-100 text-gray-800";
  };

  const statusBadge = (status: string) => {
    const statuses: Record<string, string> = {
      paid: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
    };
    return statuses[status] || "bg-gray-100 text-gray-800";
  };

  const checkedInBadge = (checked_in: number) =>
    checked_in ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800";

  const fetchTicketDetails = async () => {
    setModalLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/check-ticket/${ticket_code}`
      );
      const data = await res.json();
      setSelectedTicket(data.data);
    } catch (err) {
      console.error(err);
      setSelectedTicket(null);
    } finally {
      setModalLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!selectedTicket || selectedTicket.checked_in) return;

    setCheckInLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/check-in/${ticket_code}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ checked_in_by: adminName }),
        }
      );

      if (!res.ok) throw new Error("Failed to check in ticket");

      const now = new Date().toISOString();

      // Update modal state
      setSelectedTicket({
        ...selectedTicket,
        checked_in: 1,
        checked_in_at: now,
        checked_in_by: adminName,
      });

      // Notify parent to update table immediately
      if (onCheckIn) onCheckIn(ticket_code, adminName, now);
    } catch (err) {
      console.error(err);
      alert("Failed to check in ticket. Try again.");
    } finally {
      setCheckInLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
          onClick={fetchTicketDetails}
        >
          View
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ticket Details</DialogTitle>
        </DialogHeader>

        {modalLoading ? (
          <p>Loading...</p>
        ) : selectedTicket ? (
          <div className="space-y-4 text-sm">
            {/* General Info */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">General Info</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <p>
                  <strong>Name:</strong> {selectedTicket.name}
                </p>
                <p>
                  <strong>Ticket Type:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${typeBadge(
                      selectedTicket.ticket_type
                    )}`}
                  >
                    {selectedTicket.ticket_type.replace("_", " ").toUpperCase()}
                  </span>
                </p>
                <p>
                  <strong>Ticket Code:</strong> {selectedTicket.ticket_code}
                </p>
                <p>
                  <strong>Created At:</strong>{" "}
                  {dayjs(selectedTicket.created_at).format("MMM D, YYYY HH:mm")}
                </p>
              </div>
            </div>

            {/* Payment Info */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Payment Info</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <p>
                  <strong>Price:</strong> {selectedTicket.price} GHS
                </p>
                <p>
                  <strong>Quantity:</strong> {selectedTicket.quantity}
                </p>
                <p>
                  <strong>Total Price:</strong> {selectedTicket.total_price} GHS
                </p>
                <p>
                  <strong>Discount:</strong> {selectedTicket.discount_amount}{" "}
                  GHS
                </p>
                <p>
                  <strong>Final Price:</strong> {selectedTicket.final_price} GHS
                </p>
                <p>
                  <strong>Payment Status:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${statusBadge(
                      selectedTicket.payment_status
                    )}`}
                  >
                    {selectedTicket.payment_status.toUpperCase()}
                  </span>
                </p>
              </div>
            </div>

            {/* Check-In Info */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">
                Check-In Info
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <p>
                  <strong>Checked In:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${checkedInBadge(
                      selectedTicket.checked_in
                    )}`}
                  >
                    {selectedTicket.checked_in ? "YES" : "NO"}
                  </span>
                </p>
                <p>
                  <strong>Checked In By:</strong>{" "}
                  {selectedTicket.checked_in_by || "-"}
                </p>
                <p>
                  <strong>Checked In At:</strong>{" "}
                  {selectedTicket.checked_in_at
                    ? dayjs(selectedTicket.checked_in_at).format(
                        "MMM D, YYYY HH:mm"
                      )
                    : "-"}
                </p>
              </div>

              {/* Check-In Button */}
              {selectedTicket.payment_status === "paid" &&
                !selectedTicket.checked_in && (
                  <button
                    onClick={handleCheckIn}
                    disabled={checkInLoading}
                    className={`mt-3 w-full px-3 py-2 rounded text-white font-semibold ${
                      checkInLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {checkInLoading ? "Checking In..." : "Check In Ticket"}
                  </button>
                )}
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Contact Info</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <p>
                  <strong>Email:</strong> {selectedTicket.email}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedTicket.phone}
                </p>
                <p>
                  <strong>Promo Code:</strong>{" "}
                  {selectedTicket.promo_code || "-"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-red-500">Failed to load ticket details</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
