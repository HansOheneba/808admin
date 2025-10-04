"use client";

import { WaitlistEntry } from "@/lib/types/waitlist";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface WaitlistTableProps {
  data: WaitlistEntry[];
}

export function WaitlistTable({ data }: WaitlistTableProps) {
  return (
    <div className="rounded-md border mx-10 shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead className="font-semibold">Name</TableHead>
            <TableHead className="font-semibold">Email</TableHead>
            <TableHead className="font-semibold">Phone</TableHead>
            <TableHead className="font-semibold hidden sm:table-cell">
              Referral
            </TableHead>
            <TableHead className="font-semibold">Joined</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((entry, index) => (
            <TableRow
              key={entry.id}
              className={`transition-colors hover:bg-lime-50 ${
                index % 2 === 0 ? "bg-gray-50/30" : "bg-white"
              }`}
            >
              <TableCell className="font-medium">{entry.name}</TableCell>
              <TableCell title={entry.email} className="truncate max-w-[180px]">
                {entry.email}
              </TableCell>
              <TableCell>{entry.phone}</TableCell>
              <TableCell className="hidden sm:table-cell text-gray-500">
                {entry.referral || "-"}
              </TableCell>
              <TableCell className="text-gray-500">
                {dayjs(entry.created_at).fromNow()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
