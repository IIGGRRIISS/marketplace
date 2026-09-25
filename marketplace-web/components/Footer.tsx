export default function Footer() {
  return (
    <footer className="sticky bottom-0 z-30 mt-16 border-t border-zinc-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 py-6 text-center">
        <p className="text-sm text-zinc-700 dark:text-zinc-300">
          Built with Next.js, Prisma &amp; PostgreSQL by{" "}
          <a
            href="https://github.com/IIGGRRIISS"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-zinc-900 dark:text-zinc-50 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          >
            SYED IBRAHIM ALI
          </a>{" "}
          💙❤️
        </p>
      </div>
    </footer>
  );
}