# MangoMix

MangoMix is a modern web application that helps you create better playlists with smarter mixing options from your Spotify library. It allows you to combine tracks from multiple playlists with customizable ratios, save your favorite mixes, and queue them directly to Spotify.

## Features

- **Smart Playlist Mixing**: Combine tracks from multiple playlists with customizable ratios
- **Save Mixes**: Save your favorite mix configurations for later use
- **Queue to Spotify**: Send your mixed playlists directly to your Spotify queue
- **Spotify Integration**: Seamless connection with your Spotify account
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode Support**: Toggle between light and dark themes

## Tech Stack

MangoMix is built with a modern tech stack:

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router and Server Components
- **Language**: [TypeScript](https://www.typescriptlang.org/) for type safety
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with a Neobrutalism design aesthetic
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) - A collection of reusable components
- **Authentication**: [Clerk](https://clerk.com/) for user authentication and management
- **Database**: [SingleStore](https://www.singlestore.com/) with [Drizzle ORM](https://orm.drizzle.team/)
- **State Management**: [React Query](https://tanstack.com/query) for state management
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for validation
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- A Spotify Developer account
- A Clerk account
- A SingleStore database

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/mangomix.git
   cd mangomix
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Copy the `.env.example` file to `.env.local` and fill in your environment variables:

   ```bash
   cp .env.example .env.local
   ```

4. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
mangomix/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── components/          # React components
│   │   │   ├── ui/              # UI components from shadcn/ui
│   │   │   └── ui/custom/       # Custom UI components
│   │   ├── hooks/               # Custom React hooks
│   │   ├── lib/                 # Utility functions and types
│   │   ├── server/              # Server-side code
│   │   │   ├── actions.ts       # Server actions
│   │   │   └── db/              # Database schema and configuration
│   │   └── styles/              # Global styles
│   ├── public/                  # Static assets
│   └── ...config files
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Spotify API](https://developer.spotify.com/documentation/web-api/) for providing the music data
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Neobrutalism design](https://github.com/ekmas/neobrutalism-components) for inspiration
