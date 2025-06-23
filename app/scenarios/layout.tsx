export default function RoomLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid grid-rows-[60px_1fr_50px] h-screen gap-0">
      {/* Header */}
      <div className="bg-background z-10">
        <div className="h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/brand.svg" alt="Brand icon" className="h-8" />
            <span className="text-brand-600 font-bold text-lg">Lamigo AI</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-neutral-50 p-4 overflow-y-auto">{children}</div>

      {/* Footer */}
      <div className="bg-background border-t border-background p-3">
        <div className="flex justify-between items-center">
          <span className="text-sm">© 2025 Lamigo Dashboard. All rights reserved.</span>
        </div>
      </div>
    </div>
  );
}
