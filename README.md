# Calendar React App


This is a React-based calendar application designed to display events, modify them, and provide a smooth user experience using modern tools and libraries. The project is currently a **Work In Progress (WIP)**.

## Features
- Display events on a calendar.
- Add, edit, and remove events.
- Interactive animations for a dynamic user experience.
- Responsive design for various screen sizes.
- Tooltips and notifications for better UX.

## Tech Stack
The project leverages the following technologies and libraries:

### Core Technologies
- **React**: For building the user interface.
- **TypeScript**: Ensuring type safety and better developer experience.
- **Vite**: For a fast development environment and optimized builds.

### UI/Styling
- **@mui/material**: For pre-designed UI components.
- **@emotion/react** and **@emotion/styled**: For styling components.
- **Sass**: For managing custom styles efficiently.

### State Management
- **Zustand**: For managing application state with simplicity and scalability.

### Utilities
- **date-fns**: For working with dates and times.
- **lodash**: For utility functions.

### Additional Libraries
- **framer-motion**: For animations and transitions.
- **react-toastify**: For displaying notifications.
- **react-tooltip**: For creating tooltips.
- **react-router**: For navigation within the app.

### Vite Plugins
- **@vitejs/plugin-react**: Vite plugin for React support.
- **vite-tsconfig-paths**: Vite plugin for TypeScript path alias support.

### Highlight
- **[Calendarific API](https://calendarific.com/supported-countries)**: Fetch public events for respective countries.

## Installation
To set up the project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/vengateshkarthick/watcher
   ```

2. Navigate to the project directory:
   ```bash
   cd calendar-react-app
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open the app in your browser at `http://localhost:3000`.

## Scripts
- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run preview`: Previews the production build locally.
- `npm run lint`: Lints the codebase.

## Roadmap
- [x] Created UI for date view and month view
- [x] Use Zustand to properly update date for respective year and month
- [x] Display public events in tooltip
- [ ] Add event creation and editing functionalities.
- [ ] Enhance calendar UI and add support for recurring events.
- [ ] Optimize performance for large event datasets and Multi browser comptabilities.



## License
This project is licensed under the [MIT License](LICENSE).

## Dependencies
Below is a list of dependencies used in the project:
```json
{
  "@emotion/react": "^11.11.1",
  "@emotion/styled": "^11.11.0",
  "@mui/material": "^5.14.20",
  "@vitejs/plugin-react": "^4.2.1",
  "date-fns": "^2.30.0",
  "framer-motion": "^10.16.16",
  "lodash": "^4.17.5",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router": "^6.20.1",
  "react-toastify": "^9.1.3",
  "react-tooltip": "^5.25.0",
  "sass": "^1.69.5",
  "typescript": "^4.6.4",
  "vite": "^5.0.7",
  "vite-tsconfig-paths": "^4.2.2",
  "zustand": "^4.4.7"
}
```

---


