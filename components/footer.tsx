export function Footer() {
  return (
    <footer className="py-4 border-t bg-card text-card-foreground">
      <div className="container max-w-5xl mx-auto px-4 flex flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
        <div className="flex flex-col gap-1 items-center sm:items-start">
          <p>© {new Date().getFullYear()} Rafi Hasan.</p>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/Joker666"
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
