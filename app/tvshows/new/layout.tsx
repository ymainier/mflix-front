export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-3xl px-6 pt-12 pb-32 sm:px-12">
      {children}
    </main>
  );
}
