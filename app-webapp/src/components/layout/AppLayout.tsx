import AppHeader from "../AppHeader";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <AppHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-1 items-center px-6 pb-52">
        {children}
      </main>
    </div>
  );
}
