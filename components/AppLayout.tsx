import Image from "next/image";
import Link from "next/link";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 bg-white shadow-md z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/brand.svg"
                alt="Lamigo Logo"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
              <span className="ml-2 font-bold text-xl text-brand-600">Lamigo</span>
            </Link>
          </div>

          <nav className="flex items-center space-x-8">
            <Link
              href="/learning-paths"
              className="text-gray-700 hover:text-brand-600 font-medium transition-colors"
            >
              Learning
            </Link>
            <Link
              href="/scenarios"
              className="text-gray-700 hover:text-brand-600 font-medium transition-colors"
            >
              Scenarios
            </Link>
            <Link
              href="/topics"
              className="text-gray-700 hover:text-brand-600 font-medium transition-colors"
            >
              Topics
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
