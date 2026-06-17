# 🖥️ Video Streaming Angular Frontend

Welcome to the Frontend application for the Video Streaming Platform. This client is a premium, modern single-page application (SPA) built using **Angular 21** and **Tailwind CSS 4**. It provides a highly responsive, interactive, and gorgeous user interface for discovering, watching, and uploading videos.

---

## ✨ Features

- **🔑 Secure Authentication & Route Guards:** Built-in registration, login, and JWT token management with automated routing security guards (`authGuard`).
- **🏠 Discover & Home Dashboard:** Vibrant home layout equipped with categories/chips filters (e.g. Frontend, Backend, System Design, Cloud) and quick search capabilities.
- **🎥 Interactive Video Player:** Custom-designed streaming player tailored for high-quality, buffer-free playback.
- **📤 Easy Video Uploads:** User-friendly workflow to publish videos, upload files, and input metadata.
- **📁 My Videos Catalog:** Dedicated workspace for users to manage, preview, and review their uploaded video collection.
- **👤 User Profile Management:** View personal stats, upload history, and settings.

---

## 🛠️ Tech Stack & Styling

- **Framework:** Angular 21.x (Standalone Components, signals, control flow)
- **Styling:** Tailwind CSS 4.x (via `@tailwindcss/postcss`)
- **Routing:** Component-based lazy loading with guards
- **Testing:** Vitest (Modern, blazing fast unit testing)
- **State Management:** Reactive Extensions (RxJS) & Angular Signals

---

## 📁 Key Directories & Architecture

The Angular source code is organized cleanly inside the `src/` directory:

- **`app/`**: Root component configuration, routes, and global styling.
  - **`auth/`**: Login, registration, interceptors, and security guards (`auth.guard.ts`).
  - **`home/`**: Home page catalog, filter chips, and search logic.
  - **`profile/`**: User profile card and settings component.
  - **`shared/`**: Reusable components like navigation bars, loaders, buttons, and custom pipes.
  - **`upload/`**: Drag-and-drop file uploaders and metadata forms.
  - **`video/`**: Video player components and the personal video dashboard (`my-videos`).
  - **`services/`**: API clients for interacting with Backend microservices through the API Gateway on port `8082`.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v20+ recommended)
- **npm** (v10+ package manager)

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install all development and production dependencies:
   ```bash
   npm install
   ```

### Running the Development Server

To start the local development server with hot-reloading:

```bash
npm run start
```
Once initialized, open your browser and visit **`http://localhost:4200/`**.

---

## 🧪 Development Commands

| Command | Action | Description |
| :--- | :--- | :--- |
| **`npm run start`** | `ng serve` | Runs local dev server on port `4200` |
| **`npm run build`** | `ng build` | Compiles the project and outputs optimized bundle to `dist/` |
| **`npm run test`** | `ng test` | Executes unit tests with Vitest |
| **`ng generate component <name>`** | Scaffolding | Generates a new standalone component |

---

## 🎨 Design System & Styling Details

The UI is built with a highly cohesive color palette and a dark-mode-first aesthetic inspiration:
- Custom gradient accents (`violet-600` to `fuchsia-500` to `indigo-600`).
- Sleek interactive micro-interactions (hover zooms, glowing borders, active state indicator chips).
- Modern layouts optimized for both mobile screens and wide desktop displays.
