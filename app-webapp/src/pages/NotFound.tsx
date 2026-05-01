export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-8xl font-bold text-primary">404</h1>
      <p className="text-muted-foreground">Page not found</p>
      <a href="/" className="text-sm text-primary underline underline-offset-4">
        Go home
      </a>
    </div>
  );
}
