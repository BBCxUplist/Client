import type { User } from "@/constants/types";

export const users: User[] = [
  {
    id: "user-1",
    name: "John Smith",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    description: "Music enthusiast and event organizer",
    socials: {
      instagram: "https://instagram.com/johnsmith",
      twitter: "https://twitter.com/johnsmith",
    },
    role: "user",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "user-2",
    name: "Sarah Johnson",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    description: "Wedding planner and music lover",
    socials: {
      instagram: "https://instagram.com/sarahjohnson",
    },
    role: "user",
    createdAt: "2024-02-20T14:30:00Z",
  },
  {
    id: "artist-1",
    name: "Alex Rivera",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    description: "Professional DJ and music producer",
    socials: {
      instagram: "https://instagram.com/alexrivera",
      youtube: "https://youtube.com/@alexrivera",
      spotify: "https://open.spotify.com/artist/alexrivera",
    },
    role: "artist",
    createdAt: "2024-01-10T09:00:00Z",
  },
  {
    id: "artist-2",
    name: "Maria Garcia",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    description: "Classical violinist and composer",
    socials: {
      instagram: "https://instagram.com/mariagarcia",
      youtube: "https://youtube.com/@mariagarcia",
    },
    role: "artist",
    createdAt: "2024-02-05T11:15:00Z",
  },
  {
    id: "artist-3",
    name: "David Chen",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    description: "Jazz saxophonist and band leader",
    socials: {
      instagram: "https://instagram.com/davidchen",
      spotify: "https://open.spotify.com/artist/davidchen",
    },
    role: "artist",
    createdAt: "2024-01-25T16:45:00Z",
  },
  {
    id: "artist-4",
    name: "Emma Wilson",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    description: "Singer-songwriter and acoustic guitarist",
    socials: {
      instagram: "https://instagram.com/emmawilson",
      youtube: "https://youtube.com/@emmawilson",
      soundcloud: "https://soundcloud.com/emmawilson",
    },
    role: "artist",
    createdAt: "2024-03-01T13:20:00Z",
  },
  {
    id: "admin-1",
    name: "Admin User",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    description: "Platform administrator",
    role: "admin",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "user-banned",
    name: "Banned User",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    description: "This user has been banned",
    role: "user",
    banned: true,
    createdAt: "2024-01-20T12:00:00Z",
  },
];
