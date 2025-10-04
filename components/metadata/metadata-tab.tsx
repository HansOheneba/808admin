"use client";

import { Event } from "@/lib/types";
import dayjs from "dayjs";

interface MetadataTabProps {
  event: Event;
}

export function MetadataTab({ event }: MetadataTabProps) {
  return (
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
  );
}
