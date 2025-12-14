# Offline-First Notes App

## Architecture Overview

This application uses an **Offline-First** architecture designed to ensure full functionality without an internet connection, while seamlessly syncing data when connectivity is restored.

### Core Principles

1.  **Local Storage as Single Source of Truth**: The UI reads only from local state (initialized from LocalStorage). It never waits for a network response to update the UI.
2.  **Optimistic Updates**: Changes are applied immediately to the local state and persisted to disk.
3.  **Background Synchronization**: A separate service layer handles network communication. It uploads "dirty" records (flagged with `synced: false`) whenever the app is online.

### Layer Separation

-   **UI Layer (`components/`)**: Pure React components. They receive data via props and emit events. They are unaware of storage mechanisms.
-   **Business Logic Layer (`hooks/`)**:
    -   `useNotes`: Acts as the controller. It manages the React state, calls `StorageService` to persist changes, and triggers `SyncService`.
    -   `useAuth`: Manages user session persistence.
-   **Data Layer (`services/storage.ts`)**: Wraps `localStorage` to provide a clean API for persisting Notes and User objects.
-   **Network Layer (`services/syncService.ts`)**: Simulates a backend API. It includes random latency and failure simulation to demonstrate robustness.

## Sync Strategy

1.  **Creation/Update**:
    -   When a note is created or updated, it is saved locally with `synced: false`.
    -   The `lastUpdated` timestamp is refreshed.
2.  **Triggering Sync**:
    -   Sync is triggered on: App mount, Note modification (debounced), and the `online` window event.
3.  **Process**:
    -   The app identifies notes where `synced === false`.
    -   It sends this batch to the `SyncService`.
    -   If successful, the local records are updated to `synced: true`.
    -   If failed (offline or server error), the `synced` flag remains `false`, and the note stays in the queue for the next attempt.

## Bonus Features
-   **Search**: Real-time filtering of notes by title, content, or tags.
-   **Tags**: Ability to add tags to notes for organization.

## How to Run
1.  Install dependencies: `npm install`
2.  Run dev server: `npm start`
