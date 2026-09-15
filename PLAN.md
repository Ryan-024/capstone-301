# Operational Dashboard - Content Analytics

## What is this?
A single-page analytics dashboard showing content analytics.
Think social media analytics dashboard.

## Data
Generate a fake dataset as a JSON file (src/datametrics.json).
12 months of data (Jan-Dec 2025), each month containing:
- Content ( 3 new pieces of content each week, 1-5min videos)
    - Content views (Unique views and Subscriber views, the amount should have a wide range from 20k(more common) - 3Million (less common), how long did the viewer watch the content)
    - Ad Revenue ( only content that receive more than 50k views over all will receive ad revenue, base the amount of revenue off of total views on the piece of content)
    - Engagement (Likes, comments and shares)
- Subscriber (this should be a realistic number based off the amount of unique views received)

## Layout (Vuetify)

- V-app-bar at the top with Content Analytics as the title
- At the top is a filter selector ( 7 days, 30 days, 90 days, 365 days) 
- When a specific time period id selected all of the cards and charts filter to that filter selected.
- Below the filter selector is a row of 3 cards showing ( Over all views, Ad revenue and net subscribers)
- Below that is 2 interactive charts 
    - Engagement chart with a filter for (all, likes, comments and shares)
    - Viewer Chart with a filter for (Gender, Age and location)
- Below show me the top 5 pieces of content that have the best (engagement, ad revenue)
- Use v-container, v-row, v-col for responsive grid layout

## Interactions
- Cards show show a small up/down arrow or color indicating change from previous month

## Style
- Dark theme by default (Vuetify dark theme) toggle in the top right app bar for light and dark mode
- Clean, minimal, lots of whitespace
- Charts should use a cohesive color palette - not rainbow
- Mobile responsive - cards stack on small screens

## Tech
- Vue 3 + TypeScript + Vuetify 3
- Chart.js via vue-chartjs for all charts
- Fake data from a local JSON file (no API calls)
- Single page - no routing needed for this app