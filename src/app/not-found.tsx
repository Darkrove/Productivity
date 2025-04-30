import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col gap-4 items-center justify-center">
      <h1 className="text-6xl sm:text-8xl font-black">4😢4</h1>
      <p className="text-balance px-6 text-center text-2xl font-medium">
        Page not found. Back to{" "}
        <Link
          href="/"
          className="text-muted-foreground underline underline-offset-4 hover:text-blue-500"
        >
          Homepage
        </Link>
        .
      </p>
    </div>
  );
}