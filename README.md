# Uplist - Artist Booking Platform

A React-based platform for connecting artists with event organizers and clients.

## Features

- **Supabase Authentication**: Secure user authentication with email/password and Google OAuth
- **Role-based Access**: Support for users, artists, and admin roles
- **Artist Profiles**: Comprehensive artist profiles with booking capabilities
- **Booking System**: Secure booking and payment management
- **Admin Dashboard**: User and content moderation tools

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account
- Google Cloud Console account (for OAuth)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env` file in the root directory with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:

```bash
npm run dev
```

### Supabase Setup

1. Create a new project in the [Supabase Dashboard](https://supabase.com/dashboard)
2. Go to Settings > API to find your project URL and anon key
3. Add these to your `.env` file
4. Configure authentication settings in your Supabase dashboard:
   - Enable email authentication
   - Enable Google OAuth (see detailed setup in `docs/supabase-setup.md`)
   - Set up email templates (optional)
   - Configure redirect URLs if needed

## Authentication

The app uses Supabase Auth with the following features:

- **Email/Password Authentication**: Standard login and registration
- **Google OAuth**: One-click login with Google accounts
- **Role-based Access Control**: Users can register as regular users or artists
- **Email Confirmation**: New accounts require email verification
- **Password Reset**: Users can reset their passwords via email
- **Session Management**: Automatic session handling and persistence

### User Roles

- **User**: Can browse artists and make bookings
- **Artist**: Can create profiles and receive booking requests
- **Admin**: Can moderate users and content

## Development

### Project Structure

```
src/
├── components/     # Reusable UI components
├── hooks/         # Custom React hooks
├── lib/           # Utility libraries (Supabase client)
├── routes/        # Page components
├── store/         # Zustand state management
└── constants/     # Type definitions and constants
```

### Key Files

- `src/lib/supabase.ts` - Supabase client configuration
- `src/hooks/useAuth.ts` - Authentication hook
- `src/routes/Login.tsx` - Login/Register page
- `src/store/index.ts` - Global state management

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Supabase** - Backend and authentication
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **React Hook Form** - Form handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
