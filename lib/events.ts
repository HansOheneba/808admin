import { Event } from "./types";

export const events: Event[] = [
  {
    id: "1",
    title: "Midnight Madness",
    slug: "midnight-madness",
    description: "The biggest party of the year...",
    venue: "Accra International Conference Center",
    banner_image_url: "/images/midnight.jpg",
    start_date: "2025-11-15T20:00:00Z",
    end_date: "2025-11-16T04:00:00Z",
    status: "published",
    ticket_types: [
      {
        id: "t1",
        name: "Regular",
        price: 100,
        currency: "GHS",
        quantity_available: 500,
        quantity_sold: 320,
        max_per_person: 5,
      },
      {
        id: "t2",
        name: "VIP",
        price: 250,
        currency: "GHS",
        quantity_available: 100,
        quantity_sold: 70,
        max_per_person: 2,
      },
    ],
    analytics: {
      total_tickets: 600,
      tickets_sold: 390,
      revenue_generated: 68500,
      buyers_count: 360,
    },
    created_by: "admin123",
    created_at: "2025-09-01T10:00:00Z",
    updated_at: "2025-09-15T12:00:00Z",
  },
];
