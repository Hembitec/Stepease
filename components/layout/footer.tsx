import Link from "next/link"
import Image from "next/image"
import { Twitter, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand + Newsletter */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image
                  src="/icon-bg.png"
                  alt="Stepease"
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">Stepease</span>
            </div>
            <p className="text-sm text-slate-400 max-w-xs mb-6">
              Turn tribal knowledge into structured SOPs. Built for ops teams.
            </p>

            {/* Newsletter */}
            <div className="max-w-xs">
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="you@company.com"
                  className="flex-1 min-w-0 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
                />
                <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white px-4">
                  Subscribe
                </Button>
              </form>
              <p className="text-[10px] text-slate-600 mt-1">Product updates. No spam.</p>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Product</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="#features" className="hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Get Started
                </Link>
              </li>
              <li>
                <a
                  href="https://stepease.app/changelog"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  Changelog
                </a>
              </li>
            </ul>
          </div>

          {/* Legal + Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms
                </Link>
              </li>
              <li>
                <a href="mailto:hello@stepease.app" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
              <li className="pt-2">
                <div className="flex gap-3">
                  <a
                    href="https://linkedin.com/company/stepease"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-500 hover:text-white transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a
                    href="https://twitter.com/stepease"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-500 hover:text-white transition-colors"
                    aria-label="Twitter"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-600">
            &copy; {new Date().getFullYear()} Stepease
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full" />
            <span className="text-xs text-slate-600">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
