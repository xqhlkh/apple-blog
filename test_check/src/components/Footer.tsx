export default function Footer() {
  return (
    <footer className="border-t border-black/5 dark:border-white/5 bg-white/50 dark:bg-dark-card/30">
      <div className="max-w-5xl mx-auto px-5 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-apple-secondary dark:text-dark-secondary">
          &copy; {new Date().getFullYear()} MLZB Blog. Built with care.
        </p>
        <div className="flex items-center gap-6">
          <a href="/admin/login" className="text-xs text-apple-secondary dark:text-dark-secondary hover:text-apple-text dark:hover:text-dark-text transition-colors">
            管理后台
          </a>
        </div>
      </div>
    </footer>
  );
}
