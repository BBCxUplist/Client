import type { Report } from "@/constants/types";

export const reports: Report[] = [
  {
    id: "report-1",
    reporterId: "user-1",
    targetId: "artist-5",
    targetType: "artist",
    reason: "Inappropriate behavior",
    details:
      "The artist was unprofessional during our initial conversation and made inappropriate comments.",
    status: "open",
    createdAt: "2024-12-05T16:20:00Z",
  },
  {
    id: "report-2",
    reporterId: "user-2",
    targetId: "user-1",
    targetType: "user",
    reason: "Spam",
    details: "This user is sending multiple unsolicited messages and requests.",
    status: "closed",
    createdAt: "2024-11-28T11:45:00Z",
    closedAt: "2024-12-01T14:30:00Z",
    closedBy: "admin-1",
  },
  {
    id: "report-3",
    reporterId: "artist-1",
    targetId: "user-banned",
    targetType: "user",
    reason: "Harassment",
    details:
      "The user has been sending harassing messages and making inappropriate requests.",
    status: "open",
    createdAt: "2024-12-06T09:15:00Z",
  },
];
