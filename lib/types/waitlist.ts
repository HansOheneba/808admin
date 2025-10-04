export interface WaitlistEntry {
  created_at: string;
  email: string;
  id: number;
  name: string;
  phone: string;
  referral: string | null;
}

export interface WaitlistResponse {
  data: WaitlistEntry[];
  success: boolean;
}
