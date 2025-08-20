import type { Appeal } from '@/constants/types';

export const appeals: Appeal[] = [
  {
    id: 'appeal-1',
    artistId: 'artist-4',
    status: 'pending',
    message: 'I am a professional singer-songwriter with over 5 years of experience performing at weddings and private events. I have a strong portfolio and positive reviews from previous clients. I believe I meet all the requirements to be an approved artist on UPlist.',
    portfolioLinks: [
      'https://youtube.com/@emmawilson',
      'https://soundcloud.com/emmawilson',
      'https://instagram.com/emmawilson',
    ],
    submittedAt: '2024-12-01T10:00:00Z',
  },
  {
    id: 'appeal-2',
    artistId: 'artist-5',
    status: 'rejected',
    message: 'I am a blues guitarist with extensive experience in the local music scene. I have performed at numerous venues and have a dedicated following. I would like to be considered for approval.',
    portfolioLinks: [
      'https://youtube.com/@jamesbrown',
      'https://instagram.com/jamesbrown',
    ],
    submittedAt: '2024-11-20T14:30:00Z',
    reviewedAt: '2024-11-25T09:15:00Z',
    reviewedBy: 'admin-1',
  },
];
