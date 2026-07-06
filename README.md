# BookLibrary – Premium Digital Catalog

A modern, fast, and responsive book library application built with **Next.js (App Router)**, **Tailwind CSS v4**, and **Framer Motion**. The application acts as a digital bookshelf showcasing software engineering classics, complete with live search, book overview/metadata modals, dynamic accent themes, and integrated inline PDF reading.

---

## 🚀 Key Features

- **Software Engineering Focus**: Curated catalog of essential development and computer science books (e.g., *Designing Data-Intensive Applications*, *Clean Code*, *The Pragmatic Programmer*).
- **Interactive Summary Modals**: Elegant book cards that open into a beautiful detailed modal containing full descriptions, copies availability, and customized action controls.
- **Dynamic Theme Accents**: The detail view modal dynamically adapts its primary buttons and accent color matching the specific cover color of the selected book.
- **Direct PDF Reader**: Integrated **"Read"** action button that seamlessly launches the book's PDF document directly in the browser.
- **Dark Mode Support**: Full light/dark mode styling integrated directly with Tailwind custom properties (variables), preventing screen flashes via an early-execution blocking script.

---

## 📁 File Structure

Below is the directory structure of the project:

```text
book-library/
├── app/
│   ├── books/
│   │   └── page.tsx           # Book catalog page (search grid, summary modal)
│   ├── favicon.ico
│   ├── globals.css            # Base Tailwind v4 config, theme variables, and custom classes
│   ├── layout.tsx             # Root layout with blocking script in head to prevent dark mode flash
│   └── page.tsx               # Home landing page (includes PopularBooks carousel)
├── components/
│   ├── ui/
│   │   ├── button.tsx         # Custom UI Button component
│   │   ├── card.tsx           # Custom UI Card layout components
│   │   ├── carousel.tsx       # Carousel slider framework
│   │   └── input.tsx          # Custom UI input search fields
│   ├── Footer.tsx             # Global application footer
│   ├── Hero.tsx               # Landing page hero banner
│   ├── Navbar.tsx             # Theme toggle & branding navigation header
│   ├── PopularBooks.tsx       # Fast-scrolling marquee slider of top books
│   └── ThemeProvider.tsx      # Theme context provider wrapping Next.js components
├── lib/
│   ├── data/
│   │   └── books.data.ts      # Main database array of software engineering books (DUMMY_BOOKS)
│   ├── types/
│   │   └── booksdata.type.ts  # Shared TypeScript interfaces (Book model definition)
│   ├── utils.ts               # Shared helper utilities (cn class merger)
│   └── dummy-data.ts
├── public/
│   ├── images/
│   │   └── covers/            # Dynamic PNG and custom SVG book cover thumbnails
│   ├── pdf/                   # Mapped book PDF documents (e.g., ddia.pdf, pragmatic-programmer.pdf)
│   ├── sample.pdf             # Default backup PDF viewer document
│   └── *.png, *.svg, *.mp4    # General branding assets and video clips
├── package.json               # Package dependencies & build/dev scripts
├── tsconfig.json              # TypeScript compilation rules
├── tailwind.config.ts         # Tailwind customization config
└── README.md                  # Project documentation (this file)
```

---

## 🎨 Theme & Dark Mode System

1. **Native CSS Variables (`app/globals.css`)**:
   - Light mode colors are configured under `:root`.
   - Dark mode variables are declared under the `.dark` class block, dynamically modifying variables like `--background`, `--foreground`, and `--card`.
2. **Tailwind v4 Variant Mapping**:
   - Custom `@custom-variant dark (&:is(.dark *));` is defined inside `globals.css` so that Tailwind classes (e.g., `dark:bg-zinc-950`) activate automatically when the `.dark` class is attached to the `<html>` root.
3. **Head Blocking Script (`app/layout.tsx`)**:
   - Prevents dark-to-light screen flashing by checking client-side `localStorage` synchronously during head parsing and instantly adding/removing `.dark` class list tags before hydration finishes.
4. **Theme Switcher (`components/Navbar.tsx`)**:
   - Client toggle swaps class bindings, updates React states, and persists user choice in local client cache.

---

## 💾 Book Data Model (`lib/types/booksdata.type.ts`)

Each book object in the data catalog supports the following fields:

```typescript
export interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  rating: number;
  total_copies: number;
  available_copies: number;
  description: string;
  color: string;           # Hex color code matching book cover, used for dynamic UI highlights
  cover: string;           # Image file path (e.g. /images/covers/clean-code.png)
  video: string;           # Dynamic video highlight clip URL
  summary: string;         # Deep summary paragraphs displayed in modal
  isLoanedBook?: boolean;  # Checked out state indicator
  pdfUrl?: string;         # Path to download/read PDF document
}
```

---

## ⚙️ Setup and Installation

### Prerequisites
- Node.js (version 18 or above recommended)
- npm or yarn

### Development Server
To launch the application in hot-reloading development mode:
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or the printed port) in your web browser.

### Build and Compilation
Verify typing safety and construct the optimized production build:
```bash
# Typecheck
npx tsc --noEmit

# Production Build
npm run build
```
