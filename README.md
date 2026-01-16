# XPay Dashboard

A real-time payment monitoring dashboard built with [Next.js](https://nextjs.org), featuring live transaction feeds, data visualization, and SSE (Server-Sent Events) integration.

## Features

- **Real-time Updates**: Live transaction stream using Server-Sent Events (SSE).
- **Interactive Dashboard**: Metric cards, distribution charts, and a virtualized live table.
- **Performance**: Optimized rendering with `react-virtual` for handling large lists and `zustand` for state management.
- **Tech Stack**: Next.js, React, TailwindCSS, Recharts, Framer Motion, Tanstack virtual

## Prerequisites

- **Node.js**: v18.17.0 or higher
- **npm**: v9.0.0 or higher (or compatible package manager like yarn/pnpm/bun)

## Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Sandstorm831/xpay.git
    cd xpay
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Configuration:**
    Create a `.env` file in the root directory and add the following required variables:

    ```env
    # The base URL for the SSE events endpoint
    NEXT_PUBLIC_BASE_URL=https://your-api-domain.com

    # The email address used for accessing on the stream
    NEXT_PUBLIC_EMAIL=your-email@example.com
    ```
    > **Note:** These variables are critical for connecting to the live data stream.

## Running the Project

### Development Server
To start the application in development mode with Turbopack:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
To build and start the production version:

```bash
npm run build
npm run start
```

## Project Structure

```
├── app
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── eslint.config.mjs
├── next.config.ts
├── next-env.d.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── README.md
├── src
│   ├── components
│   │   ├── ChartWrapper.tsx
│   │   ├── CountryDistribution.tsx
│   │   ├── Dashboard.tsx
│   │   ├── LiveTable.tsx
│   │   ├── MethodDistribution.tsx
│   │   └── Metrics.tsx
│   ├── lib
│   │   └── utils.ts
│   ├── store
│   │   └── usePaymentStore.ts
│   └── types
│       └── payment.ts
└── tsconfig.json

8 directories, 26 files

```

## Key Scripts

- `npm run dev`: Start dev server with fast refresh.
- `npm run build`: Build the application for production.
- `npm run start`: Run the built production server.
- `npm run lint`: Run ESLint checks.

> Assignment Link : https://www.notion.so/xpaycheckout/Frontend-Take-Home-Assignment-2e753c9859848096a038f789a28f0cd8