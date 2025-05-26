# AI-Driven Data Visualization Frontend

This is the frontend application for the AI-Driven Data Visualization system. It provides a modern, responsive interface for interacting with Claude AI to generate dynamic data visualizations.

## Features

- Real-time chat interface with Claude AI
- Dynamic data visualization generation
- Dark mode support
- Responsive design
- Modern UI components using shadcn/ui

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui components
- next-themes for dark mode

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

The application is built with Next.js and uses the App Router. Key directories:

- `src/app`: Main application pages and layouts
- `src/components`: Reusable UI components
- `src/lib`: Utility functions and shared code

### Component Structure

- `ui/`: shadcn/ui components
- `theme-provider.tsx`: Dark mode support
- `page.tsx`: Main chat interface

## API Integration

The frontend communicates with the backend API at `/api/v1/claude/chat` for:

- Sending prompts to Claude
- Receiving AI responses
- Handling tool execution results

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
