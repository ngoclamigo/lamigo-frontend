import Link from "next/link";

export default function DemoIndex() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">API Demo Pages</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/demo/learning-paths">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <h2 className="text-xl font-semibold mb-3">Learning Paths API</h2>
            <p className="text-gray-600">
              Interactive demo showcasing the Learning Paths endpoints and their responses.
            </p>
            <div className="mt-4 text-blue-500 font-medium">View Demo →</div>
          </div>
        </Link>
      </div>
    </div>
  );
}
