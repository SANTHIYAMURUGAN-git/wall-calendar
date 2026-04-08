# Interactive Wall Calendar

A polished, interactive wall calendar component built with React, inspired by the classic physical wall calendar aesthetic.

## Live Demo

 https://wall-calendar-c73q.vercel.app/

## Why I Built It This Way

When I looked at the reference image, the first thing that struck me was how physical wall calendars have this very intentional visual hierarchy — the photo dominates the top, draws you in emotionally, and then your eye naturally travels down to the dates. I wanted to preserve that feeling in the digital version rather than just making a flat calendar widget.

The blue zigzag/diagonal shape separating the hero image from the calendar grid was something I specifically tried to replicate using inline SVG, because it gives the calendar that distinctive editorial magazine feel. I chose to keep the notes section on the left side (mirroring the reference) because it creates a natural reading flow — jot a thought, glance at the date.

For the extra features, I added:
- Smooth slide animation when flipping between months
- Each month gets its own unique adventure/nature photograph
- Holiday markers (Indian national holidays) shown as small amber dots
- Green dot indicators on dates that have saved notes
- Dark/light mode wasn't added to keep the design faithful to the physical calendar look

## Features

- **Wall Calendar Aesthetic** — Portrait layout with spiral binding, hero image, and blue diagonal shape exactly matching the reference design
- **Month-specific Hero Images** — Each of the 12 months has a unique landscape/adventure photograph
- **Date Range Selector** — Click a start date, then an end date; the range highlights in blue with distinct start/end markers
- **Integrated Notes** — Click any date to attach a note; notes appear as small text on the ruled lines in the notes section
- **Holiday Markers** — Indian national holidays marked with amber dots on the calendar grid
- **Flip Animation** — Smooth transition when navigating between months
- **Fully Responsive** — Works on mobile (stacked layout) and desktop (portrait card layout)

## Tech Stack

- React 18 (Create React App)
- Pure CSS-in-JS (no external styling libraries)
- No backend, no database — all state managed in React, notes persist in component state

## Project Structure
src/
├── App.js              # Root component
├── WallCalendar.js     # Main calendar component (all logic + UI)
├── index.js            # React entry point
└── index.css           # Global reset + body styles

## How to Run Locally

### Prerequisites
- Node.js v18 or above
- npm

### Steps

```bash
# Clone the repository
git clone https://github.com/SANTHIYAMURUGAN-git/wall-calendar.git

# Navigate into the project
cd wall-calendar

# Install dependencies
npm install

# Start the development server
npm start
```

Open your browser at **http://localhost:3000**

## How to Use

1. **Browse months** — Use the left/right arrows on the hero image to navigate
2. **Select a date range** — Click any date as the start, then click another date as the end; the range will highlight
3. **Add a note** — Click any date, type in the notes panel below the calendar, click Save
4. **View saved notes** — Notes appear both in the ruled lines on the left side of the calendar and in the notes panel below
5. **Holiday markers** — Hover over any date with an amber dot to see the holiday name

## Deployment

Deployed on Vercel with automatic deployments on every push to the `main` branch.

## Final vercel link :
https://wall-calendar-c73q.vercel.app/
