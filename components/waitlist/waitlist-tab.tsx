"use client";

import { useEffect, useState } from "react";
import { WaitlistEntry, WaitlistResponse } from "@/lib/types/waitlist";
import { WaitlistTable } from "./waitlist-table";

export function WaitlistTab() {
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWaitlist = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
          throw new Error("API URL not configured");
        }

        const response = await fetch(`${apiUrl}/waitlist`);
        if (!response.ok) {
          throw new Error("Failed to fetch waitlist");
        }

        const data: WaitlistResponse = await response.json();
        if (!data.success) {
          throw new Error("API returned unsuccessful response");
        }

        setWaitlist(data.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load waitlist"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWaitlist();
  }, []);

  if (loading) {
    return <div className="p-6">Loading waitlist...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Waitlist</h2>
        <span className="text-sm text-gray-500">
          {waitlist.length} {waitlist.length === 1 ? "entry" : "entries"}
        </span>
      </div>
      <WaitlistTable data={waitlist} />
    </div>
  );
}
