import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0E2D1B] text-white pt-12 pb-6 mt-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        
        {/* ---------- Column 1: Brand ---------- */}
        <div>
          <h2 className="text-2xl font-bold text-[#E58E26]">TriGardening</h2>
          <p className="text-gray-300 mt-2 text-sm">Your Slogan goes here</p>
        </div>

        {/* ---------- Column 2: Quick Links ---------- */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-[#E58E26]">Quick Links</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>
              <Link href="/about" className="hover:text-white transition">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/shipping" className="hover:text-white transition">
                Shippings
              </Link>
            </li>
            <li>
              <Link href="/referral" className="hover:text-white transition">
                Referral Program
              </Link>
            </li>
          </ul>
        </div>

        {/* ---------- Column 3: Categories ---------- */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-[#E58E26]">Categories</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>
              <Link href="/plants" className="hover:text-white transition">
                Plants
              </Link>
            </li>
            <li>
              <Link href="/tools" className="hover:text-white transition">
                Tools
              </Link>
            </li>
            <li>
              <Link href="/fertilizers" className="hover:text-white transition">
                Fertilizers
              </Link>
            </li>
            <li>
              <Link href="/pesticides" className="hover:text-white transition">
                Pesticides
              </Link>
            </li>
          </ul>
        </div>

        {/* ---------- Column 4: Connect With Us ---------- */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-[#E58E26]">Connect With Us</h3>

          {/* Social Icons */}
          <div className="flex items-center gap-4 mb-4">
            {[
              {
                href: "https://facebook.com",
                icon: "M18 2h-3a4 4 0 00-4 4v3H8v4h3v8h4v-8h3l1-4h-4V6a1 1 0 011-1h3z",
              },
              {
                href: "https://instagram.com",
                icon: "M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2a3 3 0 013 3v10a3 3 0 01-3 3H7a3 3 0 01-3-3V7a3 3 0 013-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm6.5-1a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z",
              },
              {
                href: "https://twitter.com",
                icon: "M8 19c11 0 14-9 14-14v-.64A9.72 9.72 0 0024 2a9.59 9.59 0 01-2.828.775A4.932 4.932 0 0023.337.364a9.864 9.864 0 01-3.127 1.196A4.918 4.918 0 0016.616 0c-2.73 0-4.944 2.215-4.944 4.944 0 .387.044.764.128 1.125A13.97 13.97 0 011.671 1.149a4.935 4.935 0 00-.667 2.483c0 1.713.872 3.229 2.197 4.116A4.936 4.936 0 01.964 7.1v.062c0 2.392 1.701 4.385 3.957 4.836a4.936 4.936 0 01-2.224.084c.628 1.956 2.444 3.379 4.6 3.422A9.88 9.88 0 010 17.55a13.957 13.957 0 007.548 2.212",
              },
              {
                href: "https://youtube.com",
                icon: "M10 15l5.19-3L10 9v6zm12-3c0-3.866-3.582-7-8-7H10C5.582 5 2 8.134 2 12s3.582 7 8 7h4c4.418 0 8-3.134 8-7z",
              },
            ].map((social) => (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                className="p-2 rounded-full bg-white/10 hover:bg-[#E58E26] transition-all duration-300"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d={social.icon} />
                </svg>
              </a>
            ))}
          </div>

          {/* Contact Info */}
          <p className="text-gray-300 text-sm mb-1">
            support@trigardening.com
          </p>
          <p className="text-sm">
            <span className="text-[#E58E26] font-medium">Call Now:</span> +8801234567890
          </p>
        </div>
      </div>

      {/* ---------- Divider Line ---------- */}
      <div className="border-t border-white/10 mt-10 pt-6 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} <span className="text-white font-medium">TriGardening</span>. All Rights Reserved.
      </div>
    </footer>
  );
}
