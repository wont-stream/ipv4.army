import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Welcome to S€TH @ IPv4 Army</h1>
      <p className="text-lg text-gray-600 mb-8">
        Redirecting to documentation...
      </p>
      <Link href="/docs" className="text-blue-500 hover:underline">
        Go to Docs
      </Link>
    </div>
  );
}
