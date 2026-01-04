import Link from "next/link";
import { LayoutDashboard, Dumbbell, Settings, Users } from "lucide-react";
import { AdminUserButton } from "@/components/admin/admin-user-button";
import { getSession } from "@/lib/auth-admin";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the current pathname
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  // Skip auth check for login page
  const isLoginPage = pathname === "/admin/login";

  // If it's the login page, just render children without layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Check if user is authenticated
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Admin Navigation */}
      <nav className="bg-white border-b shadow-sm sticky z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CS</span>
                </div>
                <span className="font-bold text-lg">Admin</span>
              </div>

              <div className="hidden md:flex items-center gap-4">
                <Link
                  href="/admin/schede"
                  className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-primary/5"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Schede
                </Link>
                <Link
                  href="/admin/clienti"
                  className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-primary/5"
                >
                  <Users className="h-4 w-4" />
                  Clienti
                </Link>
                <Link
                  href="/admin/esercizi"
                  className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-primary/5"
                >
                  <Dumbbell className="h-4 w-4" />
                  Esercizi
                </Link>
                <Link
                  href="/admin/impostazioni"
                  className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-primary/5"
                >
                  <Settings className="h-4 w-4" />
                  Impostazioni
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Torna al sito
              </Link>
              <AdminUserButton session={session} />
            </div>
          </div>
        </div>
      </nav>

      {/* Admin Content */}
      <main>{children}</main>
    </div>
  );
}
