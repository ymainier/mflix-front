export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-3xl px-4 pt-8 pb-32 sm:px-8">
      {children}
    </main>
  );
}
