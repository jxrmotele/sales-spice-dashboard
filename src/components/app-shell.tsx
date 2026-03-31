"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  Users,
  Inbox,
  Menu,
  X,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { useState, useEffect } from "react";

interface AppShellProps {
  children: React.ReactNode;
  unmatchedCount?: number;
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clients", label: "Clients", icon: Users },
];

export function AppShell({ children, unmatchedCount = 0 }: AppShellProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [count, setCount] = useState(unmatchedCount);

  useEffect(() => {
    // Fetch unmatched count periodically
    async function fetchCount() {
      try {
        const res = await fetch("/api/unmatched/count");
        if (res.ok) {
          const data = await res.json();
          setCount(data.count);
        }
      } catch {
        // ignore
      }
    }
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top nav bar */}
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="flex h-14 items-center px-4 md:px-6">
          <button
            className="mr-2 md:hidden"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
          >
            {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link href="/dashboard" className="font-bold text-lg mr-8">
            CoachView
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname.startsWith(item.href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
            <Link
              href="/inbox"
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                pathname.startsWith("/inbox")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Inbox className="h-4 w-4" />
              Inbox
              {count > 0 && (
                <span className="ml-1 inline-flex items-center justify-center rounded-full bg-destructive px-2 py-0.5 text-xs font-medium text-destructive-foreground">
                  {count}
                </span>
              )}
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1">
                  <span className="hidden sm:inline">{session?.user?.name}</span>
                  <span className="inline sm:hidden">
                    {session?.user?.name?.split(" ").map((n) => n[0]).join("")}
                  </span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-2 py-1.5 text-sm">
                  <p className="font-medium">{session?.user?.name}</p>
                  <p className="text-muted-foreground text-xs">{session?.user?.email}</p>
                  <p className="text-muted-foreground text-xs capitalize">
                    {session?.user?.role?.toLowerCase()}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileNavOpen && (
          <nav className="border-t px-4 py-2 md:hidden space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileNavOpen(false)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium",
                  pathname.startsWith(item.href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
            <Link
              href="/inbox"
              onClick={() => setMobileNavOpen(false)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium",
                pathname.startsWith("/inbox")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground"
              )}
            >
              <Inbox className="h-4 w-4" />
              Inbox
              {count > 0 && (
                <span className="ml-1 inline-flex items-center justify-center rounded-full bg-destructive px-2 py-0.5 text-xs font-medium text-destructive-foreground">
                  {count}
                </span>
              )}
            </Link>
          </nav>
        )}
      </header>

      <main className="p-4 md:p-6 max-w-7xl mx-auto">{children}</main>
    </div>
  );
}
