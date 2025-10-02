"use client";

import { events } from "@/lib/events";
import { Event } from "@/lib/types";
import dayjs from "dayjs";
import Image from "next/image";
import React, { useState } from "react";

interface EventPageProps {
  params: Promise<{ eventId: string }> | { eventId: string };
}

export default function EventPage({ params }: EventPageProps) {
  type Thenable<T> = { then: (onfulfilled?: (value: T) => unknown) => unknown };
  let resolvedParams: { eventId: string };
  if (
    params &&
    typeof (params as Thenable<{ eventId: string }>).then === "function"
  ) {
    
    // while avoiding complex type plumbing in this simple page.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolvedParams = React.use(params as any) as { eventId: string };
  } else {
    resolvedParams = params as { eventId: string };
  }
  const { eventId } = resolvedParams;
  const event: Event | undefined = events.find((e) => e.id === eventId);

  const [activeTab, setActiveTab] = useState("overview");

  if (!event) {
    return <div className="p-6">Event not found</div>;
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Image
          width={160}
          height={96}
          src={event.banner_image_url}
          alt={event.title}
          className="w-40 h-24 object-cover rounded-lg shadow"
        />
        <div>
          <h1 className="text-3xl font-bold">{event.title}</h1>
          <p className="text-gray-600">{event.description}</p>
          <p className="text-sm text-gray-500">
            {event.venue} •{" "}
            {dayjs(event.start_date).format("MMM D, YYYY h:mm A")} –{" "}
            {dayjs(event.end_date).format("MMM D, YYYY h:mm A")}
          </p>
          <span
            className={`mt-2 inline-block px-3 py-1 text-sm rounded-full ${
              event.status === "published"
                ? "bg-green-100 text-green-700"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {event.status}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6">
          {["overview", "tickets", "analytics", "metadata"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
      )}

      {activeTab === "tickets" && (
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
      )}

      {activeTab === "analytics" && (
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
      )}

      {activeTab === "metadata" && (
        <div className="bg-white shadow rounded-lg p-6 text-sm text-gray-600">
          <p>
            <span className="font-semibold">Created by:</span>{" "}
            {event.created_by}
          </p>
          <p>
            <span className="font-semibold">Created at:</span>{" "}
            {dayjs(event.created_at).format("MMM D, YYYY h:mm A")}
          </p>
          <p>
            <span className="font-semibold">Updated at:</span>{" "}
            {dayjs(event.updated_at).format("MMM D, YYYY h:mm A")}
          </p>
        </div>
      )}
    </div>
  );
}
