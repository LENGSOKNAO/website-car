import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

const socials = [
  {
    name: "Facebook",
    path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
  },
  {
    name: "Twitter",
    path: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",
  },
  {
    name: "Instagram",
    path: "M9 2h6a7 7 0 0 1 7 7v6a7 7 0 0 1-7 7H9a7 7 0 0 1-7-7V9a7 7 0 0 1 7-7zm0 2a5 5 0 0 0-5 5v6a5 5 0 0 0 5 5h6a5 5 0 0 0 5-5V9a5 5 0 0 0-5-5zm3 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm4.5-.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2z",
  },
  {
    name: "Linkedin",
    path: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z",
  },
];

const shopLinks = [
  { label: "Browse Cars", href: "/listings" },
  { label: "New Cars", href: "/listings?condition=new" },
  { label: "Used Cars", href: "/listings?condition=used" },
  { label: "Certified Pre-Owned", href: "/listings?condition=certified" },
  { label: "Sell Your Car", href: "/sell" },
];

const resourceLinks = [
  { label: "Financing", href: "/financing" },
  { label: "Trade-In", href: "/trade-in" },
  { label: "Test Drive", href: "/test-drive" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-white border-neutral-200 text-neutral-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-10">
          <div className="lg:col-span-2 space-y-5">
            <span className="text-lg font-bold text-neutral-900">
              {APP_NAME}
            </span>
            <p className="text-sm leading-relaxed max-w-sm text-neutral-500">
              Your premium marketplace for buying and selling quality vehicles.
              Connecting buyers with verified dealers nationwide.
            </p>
            <div className="flex gap-2.5 pt-2">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href="#"
                  aria-label={s.name}
                  className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center hover:bg-blue-50 hover:text-blue-500 transition-all duration-200 group"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4 text-neutral-500 group-hover:text-blue-500 transition-colors"
                  >
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-neutral-800 font-semibold text-xs tracking-widest uppercase mb-5">
              Shop
            </h3>
            <ul className="space-y-3">
              {shopLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.href}
                    className="group inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-blue-600 transition-colors duration-200"
                  >
                    {l.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-neutral-800 font-semibold text-xs tracking-widest uppercase mb-5">
              Resources
            </h3>
            <ul className="space-y-3">
              {resourceLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.href}
                    className="group inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-blue-600 transition-colors duration-200"
                  >
                    {l.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-neutral-800 font-semibold text-xs tracking-widest uppercase mb-5">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-neutral-500">
              <li className="flex items-start gap-2.5">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="w-4 h-4 mt-0.5 text-neutral-400 shrink-0"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                123 Auto Street, NY 10001
              </li>
              <li className="flex items-center gap-2.5">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="w-4 h-4 text-neutral-400 shrink-0"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                (555) 123-4567
              </li>
              <li className="flex items-center gap-2.5">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="w-4 h-4 text-neutral-400 shrink-0"
                >
                  <path d="M22 6 12 13 2 6" />
                  <path d="M2 6h20v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6Z" />
                </svg>
                info@drivemarket.com
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-neutral-500">
          <p>
            &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="hover:text-blue-600 transition-colors duration-200"
            >
              Privacy
            </a>
            <a
              href="#"
              className="hover:text-blue-600 transition-colors duration-200"
            >
              Terms
            </a>
            <a
              href="#"
              className="hover:text-blue-600 transition-colors duration-200"
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
