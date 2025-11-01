"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { TicketDialog } from "./ticketsDialog";

interface Ticket {
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
}

interface TicketsApiResponse {
  data: Ticket[];
  success?: boolean;
  error?: string;
}

export function TicketsTab() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterChecked, setFilterChecked] = useState<string>("all");
  const [searchCode, setSearchCode] = useState("");

  // Calculate totals using useMemo for performance
  const { totalRevenue, totalTickets, paidTickets, pendingRevenue } =
    useMemo(() => {
      let revenue = 0;
      let ticketsCount = 0;
      let paidCount = 0;
      let pendingRev = 0;

      tickets.forEach((ticket) => {
        const price =
          parseFloat(ticket.final_price) || parseFloat(ticket.price) || 0;
        const quantity = ticket.quantity || 1;

        ticketsCount += quantity;

        if (ticket.payment_status === "paid") {
          revenue += price * quantity;
          paidCount += quantity;
        } else if (ticket.payment_status === "pending") {
          pendingRev += price * quantity;
        }
      });

      return {
        totalRevenue: revenue,
        totalTickets: ticketsCount,
        paidTickets: paidCount,
        pendingRevenue: pendingRev,
      };
    }, [tickets]);

  const handleTicketCheckIn = (
    ticket_code: string,
    checked_in_by: string,
    checked_in_at: string
  ) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.ticket_code === ticket_code
          ? {
              ...ticket,
              checked_in: 1,
              checked_in_at,
              checked_in_by,
            }
          : ticket
      )
    );
  };

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/tickets`
        );
        const data: TicketsApiResponse = await res.json();

        if (!res.ok || !data.data)
          throw new Error(data.error || "Failed to fetch tickets");

        setTickets(data.data);
      } catch (err: unknown) {
        console.error(err);
        if (err instanceof Error) setError(err.message);
        else setError("An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  if (loading) return <p>Loading tickets...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!tickets.length) return <p>No tickets found.</p>;

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

  // Filter tickets
  const filteredTickets = tickets.filter((ticket) => {
    const matchType = filterType === "all" || ticket.ticket_type === filterType;
    const matchStatus =
      filterStatus === "all" || ticket.payment_status === filterStatus;
    const matchChecked =
      filterChecked === "all" ||
      (filterChecked === "yes"
        ? ticket.checked_in === 1
        : ticket.checked_in === 0);

    const matchSearch =
      searchCode === "" ||
      ticket.ticket_code.toLowerCase().includes(searchCode.toLowerCase());

    return matchType && matchStatus && matchChecked && matchSearch;
  });

  return (
    <div className="bg-white shadow rounded-lg p-4 overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4">Tickets</h2>

      {/* Revenue and Ticket Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-sm font-medium text-green-800">
            Total Revenue
          </div>
          <div className="text-2xl font-bold text-green-900">
            {totalRevenue.toFixed(2)} GHS
          </div>
          <div className="text-xs text-green-600">
            {paidTickets} paid tickets
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm font-medium text-blue-800">Total Tickets</div>
          <div className="text-2xl font-bold text-blue-900">{totalTickets}</div>
          <div className="text-xs text-blue-600">All ticket types</div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-sm font-medium text-yellow-800">
            Pending Revenue
          </div>
          <div className="text-2xl font-bold text-yellow-900">
            {pendingRevenue.toFixed(2)} GHS
          </div>
          <div className="text-xs text-yellow-600">From pending payments</div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-800">
            Filtered Tickets
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {filteredTickets.length}
          </div>
          <div className="text-xs text-gray-600">Currently showing</div>
        </div>
      </div>

      {/* Filters + Search */}
      <div className="flex gap-4 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="Search by Ticket Code (e.g., MM-...)"
          className="border rounded px-3 py-2 w-60 text-sm"
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
        />

        {/* Ticket Type */}
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="early_bird">Early Bird</SelectItem>
            <SelectItem value="regular">Regular</SelectItem>
            <SelectItem value="late">Late</SelectItem>
          </SelectContent>
        </Select>

        {/* Payment Status */}
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by Payment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>

        {/* Checked In */}
        <Select value={filterChecked} onValueChange={setFilterChecked}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by Checked In" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Checkin Stats</SelectItem>
            <SelectItem value="yes">Checked In</SelectItem>
            <SelectItem value="no">Not Checked In</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tickets Table */}
      <table className="w-full min-w-[600px] text-sm border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="p-2">Ticket Code</th>
            <th className="p-2">Type</th>
            <th className="p-2">Price</th>
            <th className="p-2">Quantity</th>
            <th className="p-2">Payment Status</th>
            <th className="p-2">Checked In</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTickets.map((ticket) => (
            <tr key={ticket.id} className="border-b hover:bg-gray-50">
              <td className="p-2 font-mono">{ticket.ticket_code}</td>
              <td className="p-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${typeBadge(
                    ticket.ticket_type
                  )}`}
                >
                  {ticket.ticket_type.replace("_", " ").toUpperCase()}
                </span>
              </td>
              <td className="p-2">{ticket.price} GHS</td>
              <td className="p-2">{ticket.quantity}</td>
              <td className="p-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${statusBadge(
                    ticket.payment_status
                  )}`}
                >
                  {ticket.payment_status.toUpperCase()}
                </span>
              </td>
              <td className="p-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${checkedInBadge(
                    ticket.checked_in
                  )}`}
                >
                  {ticket.checked_in ? "YES" : "NO"}
                </span>
              </td>
              <td className="p-2">
                <TicketDialog
                  ticket_code={ticket.ticket_code}
                  onCheckIn={handleTicketCheckIn}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
