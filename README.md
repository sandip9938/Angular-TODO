# My App Angular

My App Angular is a single-page Todo application built with Angular 22. It provides a login-first flow and task management features including priorities, due dates, filters, and browser-based persistence.

## Project overview

The app starts at the login page. After a successful demo login, the user is routed to the Todo page. The Todo page supports creating, editing, completing, and removing tasks. Tasks and the demo login session are saved in the browser's `localStorage`, so they remain after a refresh in the same browser.

### Login flow

1. Open the app at `/` or `/login`.
2. Enter the demo ID and password below.
3. On successful login, the app opens `/todos`.
4. Refreshing the page keeps the demo session in that browser.
5. Selecting **Log out** ends the local demo session and returns to the login page.

### Todo features

- Add tasks with a title, optional due date, and Low / Medium / High priority.
- Edit the title, priority, and due date of an existing task.
- Mark tasks complete or active.
- Delete an individual task or clear all completed tasks.
- Filter the list by All, Active, or Completed.
- See total, active, and completed task counts.
- See the creation date and time for tasks created after timestamps were introduced.
- See an **Overdue** indicator for incomplete tasks whose due date is before today.
- Keep tasks in browser storage, separated by the signed-in demo ID.

## Demo credentials

- **ID:** `sandip`
- **Password:** `sandip123`

> **Security:** This is a learning/demo login, not real authentication. The credentials and login check are in client-side code and are visible in the source and browser bundle. The route guard only controls client-side navigation; it does not protect data. Do not use this login to protect sensitive information. A production app needs a trusted authentication backend or identity provider, with authorization enforced server-side.

## Technology

- Angular 22 with standalone components and Angular Router
- TypeScript
- Angular signals for Todo state
- SCSS for component styling
- Browser `localStorage` for the demo session and Todo data
- Vitest through the Angular CLI for unit tests

## Project structure

```text
src/
├── app/
│   ├── app.config.ts          # Application providers and router setup
│   ├── app.routes.ts          # Login and protected Todo routes
│   ├── app.ts / app.html      # Root component and router outlet
│   ├── auth/
│   │   ├── auth.guard.ts      # Client-side route guards
│   │   └── auth.service.ts    # Demo login session
│   ├── login/                 # Login page component, template, and styles
│   ├── models/
│   │   └── todo.model.ts      # Todo and priority types
│   ├── services/
│   │   └── todo.service.ts    # Todo state and localStorage persistence
│   └── to-do-list/            # Todo screen component, template, styles, tests
├── styles.scss                # Global styles
└── main.ts                    # Angular bootstrap
```

## Requirements

- Node.js compatible with the installed Angular CLI
- npm

## Run locally

From this project directory, install dependencies and start the development server:

```bash
npm install
npm start
```

Open [http://localhost:4200](http://localhost:4200) and sign in with the demo credentials. The development server reloads when source files change.

## Build

```bash
npm run build
```

The production build is generated in `dist/`.

## Tests

```bash
npm test
```

## Data and limitations

- Data is stored only in the current browser. It is not synced across devices or browsers.
- Clearing browser site data removes the local demo session and tasks.
- The app currently has one configured demo account; it is not a user-registration system.
- Tasks created before the creation timestamp field was added may show **Date not recorded**.
- The app uses browser storage rather than a server-side database.

## Useful commands

```bash
npm start                              # Run locally
npm run build                          # Create production build
npm test                               # Run unit tests
npx ng generate component name         # Generate an Angular component
```

More Angular CLI information is available in the [Angular CLI documentation](https://angular.dev/tools/cli).
