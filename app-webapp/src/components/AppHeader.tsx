import { LogOut } from "lucide-react";
import { AppLogo } from "@/components/ui/svgs/appLogo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores/auth.store";
import { useNavigate } from "react-router";
import AppRoutes from "@/routes/app-routes";

function Avatar({
  name,
  avatarUrl,
  className = "h-8 w-8 text-xs",
}: {
  name: string | null;
  avatarUrl: string | null;
  className?: string;
}) {
  const initials = name
    ? name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
    : "?";

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name ?? "User"}
        className={`${className} rounded-full object-cover`}
      />
    );
  }

  return (
    <div
      className={`${className} flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 font-semibold text-white`}
    >
      {initials}
    </div>
  );
}

export default function AppHeader() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-6">
        <div
          className="cursor-pointer"
          onClick={() => {
            navigate(AppRoutes.HOME);
          }}
        >
          <AppLogo size={32} />
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                aria-label="Open user menu"
                className="rounded-full ring-indigo-300 ring-offset-2 transition-shadow outline-none focus-visible:ring-2"
              >
                <Avatar name={user?.name ?? null} avatarUrl={user?.avatarUrl ?? null} />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={10}
              className="w-56 overflow-hidden rounded-2xl border border-slate-100 bg-white p-0 shadow-[0_8px_32px_-4px_rgba(0,0,0,0.10)]"
            >
              {/* Identity card */}
              <div className="flex items-center gap-3 px-4 py-4">
                <Avatar
                  name={user?.name ?? null}
                  avatarUrl={user?.avatarUrl ?? null}
                  className="h-9 w-9 text-sm"
                />
                <div className="min-w-0">
                  <p className="truncate text-[13px] leading-snug font-semibold text-slate-900">
                    {user?.name ?? "User"}
                  </p>
                  <p className="truncate text-[11px] leading-snug text-slate-400">{user?.email}</p>
                </div>
              </div>

              <DropdownMenuSeparator className="m-0 bg-slate-100" />

              <div className="p-1.5">
                <DropdownMenuItem
                  onClick={logout}
                  className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium text-slate-500 transition-colors outline-none focus:bg-red-50 focus:text-red-500"
                >
                  <LogOut className="h-3.5 w-3.5 shrink-0" />
                  Sign out
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
