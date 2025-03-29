# LavSense

LavSense is a smart toilet monitoring dashboard designed to track cleanliness, occupancy, and maintenance needs in real-time. It provides an intuitive interface for monitoring toilet conditions, notifying cleaners when maintenance is required, and allowing users to submit feedback.

## Features

- **Real-time monitoring**: Displays cleanliness and occupancy status.
- **Automated notifications**: Alerts sent to maintenance staff when attention is needed.
- **User feedback system**: Allows users to report issues directly through the dashboard.
- **Interactive map integration**: Uses Google Maps API for location-based tracking.
- **AWS S3 integration**: Manages storage for relevant assets and logs.
- **Database-driven analytics**: Uses PostgreSQL with Drizzle ORM for efficient data management.

## Tech Stack

- **Frontend**: Next.js (React, TypeScript, TailwindCSS, Framer Motion)
- **Backend**: PostgreSQL, Drizzle ORM, NeonDB (serverless Postgres)
- **Cloud & APIs**: AWS S3, Google Maps API, Deepgram API (speech-to-text for voice commands)
- **State Management**: Tanstack React Query
- **Linting & Formatting**: ESLint, Prettier

## Prerequisites

Ensure you have the following installed before setting up the project:

- **Node.js** (LTS version recommended)
- **pnpm** (Package manager)
- **AWS account** (for S3 storage setup, if applicable)

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/EE4002D-LavSense/dashboard.git
   cd dashboard
   ```

2. Install dependencies:

   ```sh
   pnpm install
   ```

3. Create a `.env.local` file and add the required API keys:

   ```env
   NEXT_PUBLIC_GOOGLE_MAP_API=YOUR_GOOGLE_MAP_API_KEY
   DATABASE_URL=YOUR_DATABASE_URL
   AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY_ID
   AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_ACCESS_KEY
   AWS_REGION=YOUR_AWS_REGION
   AWS_BUCKET_NAME=YOUR_AWS_BUCKET_NAME
   DG_API_KEY=YOUR_DG_API_KEY
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR_NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
   CLERK_SECRET_KEY=YOUR_CLERK_SECRET_KEY
   SIGNING_SECRET=YOUR_SIGNING_SECRET

   ```

## Usage

### Development

Run the project locally:

```sh
pnpm dev
```

The app will be available at `http://localhost:3000`

### Production

Build the project:

```sh
pnpm build
```

Start the production server:

```sh
pnpm start
```

## Database Management

- **Generate migration files**: `pnpm db:generate`
- **Apply migrations**: `pnpm db:push`
- **Open database UI**: `pnpm db:studio`

## Linting & Code Formatting

- Run linting: `pnpm lint`
- Fix lint issues: `pnpm lint:fix`
