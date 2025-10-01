"use client";
import { events } from "@/lib/events";
import { Event } from "@/lib/types";
import dayjs from "dayjs";
import Image from "next/image";
import React from "react";

interface EventPageProps {
  params: Promise<{ eventId: string }>;
}

export default function EventPage({ params }: EventPageProps) {
  const { eventId } = React.use(params);
  const event: Event | undefined = events.find((e) => e.id === eventId);

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

      {/* Analytics */}
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

      {/* Ticket Types */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Ticket Types</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">Name</th>
              <th className="p-2">Price</th>
              <th className="p-2">Available</th>
              <th className="p-2">Sold</th>
              <th className="p-2">Max per Person</th>
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
                <td className="p-2">{ticket.max_per_person}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Metadata */}
      <div className="bg-white shadow rounded-lg p-6 text-sm text-gray-600">
        <p>
          <span className="font-semibold">Created by:</span> {event.created_by}
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
    </div>
  );
}
