import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ArtistEditDraft {
  bio: string;
  displayName: string;
  username: string;
  avatar: string;
  phone: string;
  location: string;
  socials: {
    twitter: string;
    instagram: string;
    spotify: string;
    soundcloud: string;
    youtube: string;
  };
  genres: string[];
  price: number;
  embeds: {
    youtube: string[];
    soundcloud: string[];
    spotify: string[];
    custom: { title: string; url: string }[];
  };
  photos: string[];
  lastSaved?: string;
}

interface ArtistEditStore {
  draft: ArtistEditDraft | null;
  hasDraft: boolean;
  saveDraft: (data: ArtistEditDraft) => void;
  loadDraft: () => ArtistEditDraft | null;
  clearDraft: () => void;
  updateDraftField: (field: string, value: any) => void;
}

export const useArtistEditStore = create<ArtistEditStore>()(
  persist(
    (set, get) => ({
      draft: null,
      hasDraft: false,

      saveDraft: (data: ArtistEditDraft) => {
        set({
          draft: {
            ...data,
            lastSaved: new Date().toISOString(),
          },
          hasDraft: true,
        });
      },

      loadDraft: () => {
        return get().draft;
      },

      clearDraft: () => {
        set({
          draft: null,
          hasDraft: false,
        });
      },

      updateDraftField: (field: string, value: any) => {
        const currentDraft = get().draft;
        if (currentDraft) {
          set({
            draft: {
              ...currentDraft,
              [field]: value,
              lastSaved: new Date().toISOString(),
            },
          });
        }
      },
    }),
    {
      name: 'artist-edit-draft',
    }
  )
);
