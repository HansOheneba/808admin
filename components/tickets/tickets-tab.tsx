"use client";

import { Event } from "@/lib/types";
import dayjs from "dayjs";

interface TicketsTabProps {
  event: Event;
}

export function TicketsTab({ event }: TicketsTabProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Ticket Types</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="p-2">Name</th>
            <th className="p-2">Price</th>
            <th className="p-2">Available</th>
            <th className="p-2">Sold</th>
            <th className="p-2">Max/Person</th>
            <th className="p-2">Sales Window</th>
          </tr>
        </thead>
        <tbody>
          {event.ticket_types.map((ticket) => (
            <tr key={ticket.id} className="border-b hover:bg-gray-50">
              <td className="p-2">{ticket.name}</td>
              <td className="p-2">
                {ticket.price} {ticket.currency}
              </td>
              <td className="p-2">{ticket.quantity_available}</td>
              <td className="p-2">{ticket.quantity_sold}</td>
              <td className="p-2">{ticket.max_per_person ?? "-"}</td>
              <td className="p-2 text-sm text-gray-500">
                {ticket.sales_start
                  ? dayjs(ticket.sales_start).format("MMM D, YYYY")
                  : "—"}{" "}
                →{" "}
                {ticket.sales_end
                  ? dayjs(ticket.sales_end).format("MMM D, YYYY")
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
