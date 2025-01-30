import Link from "next/link"
import { Button } from "@/components/ui/button"

const navItems = [
  { label: "Home", href: "/" },
  { label: "Challenge & Hackthons", href: "/challenges" },
  { label: "For Educational Institutions", href: "/institutions" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
]

export function Navigation() {
  return (
    <nav className="flex items-center justify-between py-4 px-6 md:px-8 max-w-7xl mx-auto">
      <Link href="/" className="flex items-center gap-2">
        <div className="text-[#2D6CDF]">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M20 4C11.16 4 4 11.16 4 20C4 28.84 11.16 36 20 36C28.84 36 36 28.84 36 20C36 11.16 28.84 4 20 4ZM20 32C13.37 32 8 26.63 8 20C8 13.37 13.37 8 20 8C26.63 8 32 13.37 32 20C32 26.63 26.63 32 20 32Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <span className="text-xl font-semibold">Umurava</span>
      </Link>

      <div className="hidden md:flex items-center gap-6">
        {navItems.map((item) => (
          <Link key={item.label} href={item.href} className="text-gray-700 hover:text-[#2D6CDF] transition-colors">
            {item.label}
          </Link>
        ))}
        <Button className="bg-[#001141] hover:bg-[#001141]/90 text-white rounded-md">Join the Program</Button>
      </div>
    </nav>
  )
}

