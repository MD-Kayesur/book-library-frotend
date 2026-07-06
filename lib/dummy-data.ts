// ─────────────────────────────────────────────────────────────────────────────
// Backwards-compatibility barrel.
// Types live in  ->  lib/types/booksdata.type.ts
// Book data lives in  ->  lib/data/books.data.ts
// ─────────────────────────────────────────────────────────────────────────────

export type { Book } from "@/lib/types/booksdata.type";
export { DUMMY_BOOKS } from "@/lib/data/books.data";
