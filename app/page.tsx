import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const DUMMY_BOOKS = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description: "A story of the wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    description: "The story of a young girl's coming-of-age in a sleepy Southern town.",
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
    description: "A dystopian social science fiction novel and cautionary tale.",
    cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    description: "An honest but poor young woman and a wealthy but proud man fall in love.",
    cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop",
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      {/* Section 1: Hero */}
      <section className="w-full py-20 px-6 md:px-12 flex flex-col items-center justify-center text-center bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Welcome to the Book Library
          </h1>
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400">
            Discover your next great read. Explore our collection of thousands of books across all genres.
          </p>
          <div className="flex w-full max-w-sm mx-auto items-center space-x-2 pt-4">
            <Input type="text" placeholder="Search for books..." className="bg-white dark:bg-zinc-950" />
            <Button type="submit">Search</Button>
          </div>
        </div>
      </section>

      {/* Section 2: Book Grid */}
      <section className="w-full max-w-6xl mx-auto py-16 px-6 md:px-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Featured Books
          </h2>
          <Button variant="outline">View All</Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {DUMMY_BOOKS.map((book) => (
            <Card key={book.id} className="overflow-hidden flex flex-col">
              <div className="relative w-full h-48">
                <Image
                  src={book.cover}
                  alt={book.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-1">{book.title}</CardTitle>
                <CardDescription>{book.author}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">
                  {book.description}
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="secondary">Borrow</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
