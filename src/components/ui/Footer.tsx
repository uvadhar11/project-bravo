import { Link } from "react-router-dom";
// Import brand svg files since lucide-react deprecated brand icons to avoid legal issues
import {
  LinkedInIcon,
  InstagramIcon,
  FacebookIcon,
  XIcon,
  GithubIcon,
} from "../BrandIcons";

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Left: Copyright */}
        <div className="text-sm text-slate-500">
          © {new Date().getFullYear()} Expense Tracker. All rights reserved.
        </div>

        {/* Center: Internal Links */}
        <div className="flex items-center gap-6">
          <Link
            to="/about"
            className="text-sm text-slate-600 hover:text-blue-600 transition-colors"
          >
            About
          </Link>
          <Link
            to="/credits"
            className="text-sm text-slate-600 hover:text-blue-600 transition-colors"
          >
            Credits
          </Link>
          <Link
            to="/contact"
            className="text-sm text-slate-600 hover:text-blue-600 transition-colors"
          >
            Contact
          </Link>
        </div>

        {/* Right: Social Media Icons */}
        <div className="flex items-center gap-4">
          <a
            href="https://www.linkedin.com/in/expense-tracker-a45b67396/"
            target="_blank"
            rel="noreferrer"
            className="text-slate-400 hover:text-[#0077b5] transition-colors"
            aria-label="LinkedIn"
          >
            <LinkedInIcon className="w-5 h-5" />
          </a>

          <a
            href="https://www.instagram.com/bravotracker"
            target="_blank"
            rel="noreferrer"
            className="text-slate-400 hover:text-[#E1306C] transition-colors"
            aria-label="Instagram"
          >
            <InstagramIcon className="w-5 h-5" />
          </a>

          <a
            href="https://www.facebook.com/profile.php?id=61583750832371"
            target="_blank"
            rel="noreferrer"
            className="text-slate-400 hover:text-[#1877F2] transition-colors"
            aria-label="Facebook"
          >
            <FacebookIcon className="w-5 h-5" />
          </a>

          <a
            href="https://www.x.com/bravotracker2"
            target="_blank"
            rel="noreferrer"
            className="text-slate-400 hover:text-black transition-colors"
            aria-label="X (Twitter)"
          >
            <XIcon className="w-5 h-5" />
          </a>

          <a
            href="https://github.com/SparshSaraiya/project-bravo"
            target="_blank"
            rel="noreferrer"
            className="text-slate-400 hover:text-black transition-colors"
            aria-label="GitHub"
          >
            <GithubIcon className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
