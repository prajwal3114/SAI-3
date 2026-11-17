import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';

const links = [
  { to: '/', label: 'Home' },
  { to: '/providers', label: 'Providers' },
  { to: '/about', label: 'About Us' },
];

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 text-sm font-medium transition-colors rounded-md ${
      isActive ? 'bg-primary text-white' : 'text-slate-600 hover:text-primary'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="rounded bg-primary px-2 py-1 text-sm font-semibold text-white">Service</span>
          <span className="text-lg font-semibold text-slate-800">Snaps</span>
        </Link>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="hidden items-center gap-2 lg:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClass}>
              {link.label}
            </NavLink>
          ))}
          {isAuthenticated && (
            <NavLink to="/add-provider" className={navLinkClass}>
              Add Provider
            </NavLink>
          )}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {isAuthenticated ? (
            <>
              <span className="text-sm font-medium text-slate-600">Hi, {user?.name?.split(' ')[0] || 'User'}</span>
              <button
                onClick={handleLogout}
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      {open && (
        <div className="border-t border-slate-200 bg-white shadow-lg lg:hidden">
          <div className="space-y-1 px-4 py-3">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `block rounded-md px-3 py-2 text-sm font-medium ${
                    isActive ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
                onClick={() => setOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            {isAuthenticated && (
              <NavLink
                to="/add-provider"
                className={({ isActive }) =>
                  `block rounded-md px-3 py-2 text-sm font-medium ${
                    isActive ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
                onClick={() => setOpen(false)}
              >
                Add Provider
              </NavLink>
            )}
            <div className="mt-4 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <span className="text-sm font-medium text-slate-600">Logged in as {user?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
                    onClick={() => setOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
                    onClick={() => setOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

