"use client";

import { events } from "@/lib/events";
import { Event } from "@/lib/types";
import dayjs from "dayjs";
import React, { useState } from "react";
import { OverviewTab } from "@/components/overview/overview-tab";
import { TicketsTab } from "@/components/tickets/tickets-tab";
import { AnalyticsTab } from "@/components/analytics/analytics-tab";
import { MetadataTab } from "@/components/metadata/metadata-tab";
import { WaitlistTab } from "@/components/waitlist/waitlist-tab";
import { useUser } from "@clerk/nextjs";
import { CalendarIcon, MapPinIcon } from "lucide-react";
import { PromoCodesTab } from "@/components/promo/promoCodesTab";
import { ManualEntryTab } from "@/components/manual/manualEntry-tab";

interface EventPageProps {
  params: { eventId: string } | Promise<{ eventId: string }>;
}

export default function EventPage({ params }: EventPageProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resolvedParams = React.use(params as any) as { eventId: string };
  const { eventId } = resolvedParams;
  const event: Event | undefined = events.find((e) => e.id === eventId);

  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useUser();

  if (!event) {
    return <div className="p-6">Event not found</div>;
  }

  const tabs = ["overview", "tickets", "analytics", "metadata", "waitlist", "promotion","manual"];

  return (
    <div className="flex flex-col h-screen">
      {/* Top Header */}
      <div className="px-4 py-3 border-b bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Title and Status */}
            <div className="flex items-center space-x-3">
              <h1 className="text-lg font-semibold">{event.title}</h1>
              <span
                className={`px-2 py-0.5 text-xs rounded-full ${
                  event.status === "published"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {event.status}
              </span>
            </div>

            {/* Venue and Date */}
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <MapPinIcon className="w-4 h-4 mr-1.5 text-gray-400" />
                {event.venue}
              </div>
              <div className="flex items-center">
                <CalendarIcon className="w-4 h-4 mr-1.5 text-gray-400" />
                {dayjs(event.start_date).format("MMM D, YYYY")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Tabs */}
        <div className="w-48 border-r bg-white p-4 flex flex-col justify-between">
          {/* Tabs at the top */}
          <nav className="flex flex-col space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-left px-3 py-2 rounded-md font-medium capitalize ${
                  activeTab === tab
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>

          {/* User Info at bottom */}
          <div className="border-t pt-4 mt-4">
            {user && (
              <div className="mb-3">
                <p className="text-sm font-medium">{user.firstName}</p>
                <p className="text-xs text-gray-500 truncate">
                  {user.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
          {activeTab === "overview" && <OverviewTab event={event} />}
          {activeTab === "tickets" && <TicketsTab />}
          {activeTab === "analytics" && <AnalyticsTab event={event} />}
          {activeTab === "metadata" && <MetadataTab event={event} />}
          {activeTab === "waitlist" && <WaitlistTab />}
          {activeTab === "promotion" && <PromoCodesTab />}
          {activeTab === "manual" && <ManualEntryTab />}
        </div>
      </div>
    </div>
  );
}
