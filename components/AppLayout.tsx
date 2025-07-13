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
                src="/brand-full.png"
                alt="Lamigo Logo"
                width={148}
                height={40}
                className="h-10 w-auto"
              />
              {/* <span className="ml-2 font-bold text-xl text-primary">Lamigo</span> */}
            </Link>
          </div>

          <nav className="flex items-center space-x-8">
            <Link
              href="/programs"
              className="text-gray-700 hover:text-primary font-medium transition-colors"
            >
              Programs
            </Link>
            <Link
              href="/scenarios"
              className="text-gray-700 hover:text-primary font-medium transition-colors"
            >
              Scenarios
            </Link>
            {/* <Link
              href="/admin"
              className="text-gray-700 hover:text-primary font-medium transition-colors"
            >
              Admin
            </Link> */}
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
