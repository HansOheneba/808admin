"use client";
import { SignedIn, RedirectToSignIn, SignedOut, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { events } from "@/lib/events";

export default function EventsPage() {
  const { user } = useUser();
  console.log(user);
  return (
    <>
      <SignedIn>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">All Events</h1>
          <ul className="space-y-2">
            {events.map((event) => (
              <li key={event.id}>
                <Link
                  href={`/events/${event.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {event.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
