import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
  faTwitter,
  faInstagram,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";

export function Footer() {
  return (
    <footer className="border-t border-[#E5E7EB] bg-[#F8F9FA]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <Image src="/cnc_logo.png" alt="C&C Transport" width={40} height={40} className="object-contain" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#425066]">C&C Transport</p>
                <p className="text-sm font-bold text-[#425066]">Campus Bus Booking</p>
              </div>
            </div>
            <p className="text-sm leading-6 text-[#425066]">
              Comfortable, reliable, and affordable campus transport across Ghana. Book your seat in seconds.
            </p>
            <div className="flex items-center gap-2">
              {[
                { href: "https://twitter.com", icon: faTwitter, label: "Twitter" },
                { href: "https://instagram.com", icon: faInstagram, label: "Instagram" },
                { href: "https://wa.me", icon: faWhatsapp, label: "WhatsApp" },
              ].map(({ href, icon, label }) => (
                <a
                  key={label}
                  href={href}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#425066] transition-all hover:border-[#425066] hover:text-[#425066]"
                  aria-label={label}
                >
                  <FontAwesomeIcon icon={icon} className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#425066]">Quick Links</p>
            <ul className="space-y-3">
              {[
                { label: "Home", href: "/" },
                { label: "Book a Seat", href: "/booking" },
                { label: "Terms & Conditions", href: "/terms" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#425066] transition hover:text-[#425066]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#425066]">Services</p>
            <ul className="space-y-3 text-sm text-[#425066]">
              <li>Campus Shuttle Booking</li>
              <li>Seat Selection</li>
              <li>Secure Paystack Checkout</li>
              <li>Email Confirmation</li>
              <li>Luggage Storage Options</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#425066]">Contact</p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#425066]" />
                <span className="text-sm text-[#425066]">University of Ghana, Legon, Accra, Ghana</span>
              </li>
              <li className="flex items-center gap-3">
                <FontAwesomeIcon icon={faPhone} className="h-3.5 w-3.5 shrink-0 text-[#425066]" />
                <span className="text-sm text-[#425066]">+233 24 000 0000</span>
              </li>
              <li className="flex items-center gap-3">
                <FontAwesomeIcon icon={faEnvelope} className="h-3.5 w-3.5 shrink-0 text-[#425066]" />
                <span className="text-sm text-[#425066]">support@ccbooking.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#E5E7EB] pt-8 sm:flex-row">
          <p className="text-xs text-[#80868B]">
            &copy; {new Date().getFullYear()} C&C Transport. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="text-xs text-[#80868B] transition hover:text-[#425066]">
              Terms & Conditions
            </Link>
            <span className="text-[#E5E7EB]">|</span>
            <span className="text-xs text-[#80868B]">Payments secured by Paystack</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
