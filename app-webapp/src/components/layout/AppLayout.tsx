import AppHeader from "../AppHeader";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50">
      <AppHeader />
      <div className="flex flex-1 flex-col overflow-y-auto">
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6">{children}</main>
      </div>
    </div>
  );
}
