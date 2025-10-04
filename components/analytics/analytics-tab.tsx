"use client";

import { Event } from "@/lib/types";

interface AnalyticsTabProps {
  event: Event;
}

export function AnalyticsTab({ event }: AnalyticsTabProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Analytics</h2>
      <ul className="space-y-2 text-sm">
        <li>Total Tickets: {event.analytics.total_tickets}</li>
        <li>Tickets Sold: {event.analytics.tickets_sold}</li>
        <li>
          Revenue: {event.analytics.revenue_generated.toLocaleString()}{" "}
          {event.ticket_types[0].currency}
        </li>
        <li>Unique Buyers: {event.analytics.buyers_count}</li>
      </ul>
    </div>
  );
}
