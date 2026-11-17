const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
        <p>&copy; {new Date().getFullYear()} Service Snaps. All rights reserved.</p>
        <div className="flex flex-wrap items-center gap-4">
          <a href="mailto:hello@servicesnaps.com" className="hover:text-primary">Contact</a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-primary">
            GitHub
          </a>
          <span className="hidden md:inline">Empowering local service professionals.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

