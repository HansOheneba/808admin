export interface TicketType {
  id: string;
  name: string;
  price: number;
  currency: string;
  quantity_available: number;
  quantity_sold: number;
  max_per_person?: number;
}

export interface EventAnalytics {
  total_tickets: number;
  tickets_sold: number;
  revenue_generated: number;
  buyers_count: number;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  venue: string;
  banner_image_url: string;
  start_date: string;
  end_date: string;
  status: "draft" | "published" | "completed" | "canceled";
  ticket_types: TicketType[];
  analytics: EventAnalytics;
  created_by: string;
  created_at: string;
  updated_at: string;
}
