"use client";

import { Event } from "@/lib/types";

interface OverviewTabProps {
  event: Event;
}

export function OverviewTab({ event }: OverviewTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-sm text-gray-500">Total Tickets</h2>
        <p className="text-xl font-bold">{event.analytics.total_tickets}</p>
      </div>
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-sm text-gray-500">Tickets Sold</h2>
        <p className="text-xl font-bold">{event.analytics.tickets_sold}</p>
      </div>
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-sm text-gray-500">Revenue</h2>
        <p className="text-xl font-bold">
          {event.analytics.revenue_generated.toLocaleString()}{" "}
          {event.ticket_types[0].currency}
        </p>
      </div>
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-sm text-gray-500">Buyers</h2>
        <p className="text-xl font-bold">{event.analytics.buyers_count}</p>
      </div>
    </div>
  );
}
