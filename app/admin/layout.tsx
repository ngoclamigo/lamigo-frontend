import { BookOpen, FileText, Home, Upload } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: Home,
  },
  {
    title: "Documents",
    href: "/admin/documents",
    icon: FileText,
  },
  {
    title: "Upload Document",
    href: "/admin/documents/upload",
    icon: Upload,
  },
  {
    title: "Learning Paths",
    href: "/admin/learning-paths",
    icon: BookOpen,
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40 w-64">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link className="flex items-center gap-2 font-semibold" href="/admin">
              <FileText className="h-6 w-6" />
              <span>Lamigo Admin</span>
            </Link>
          </div>
          <ScrollArea className="flex-1 px-3">
            <div className="flex flex-col gap-2 p-2">
              {sidebarNavItems.map((item, index) => (
                <Button key={index} variant="ghost" className="w-full justify-start gap-2" asChild>
                  <Link href={item.href}>
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
          <h1 className="text-lg font-semibold">Administration Panel</h1>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
