import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBus, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { Footer } from "@/components/layout/footer";

const SECTIONS = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    body: `By accessing and using the C&C Transport campus bus booking platform, you confirm that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services. These terms apply to all users including students, staff, and campus visitors who book travel through our platform.`,
  },
  {
    id: "booking",
    title: "2. Booking & Reservations",
    body: `All seat bookings are subject to availability at the time of purchase. A booking is only confirmed once payment has been successfully processed through Paystack and you have received an email confirmation with your ticket number. C&C Transport reserves the right to cancel or reschedule any departure due to operational, safety, or unforeseen circumstances, in which case a full refund will be issued.`,
  },
  {
    id: "payment",
    title: "3. Payment & Pricing",
    body: `All fares are displayed in Ghana Cedis (GH₵) and are inclusive of all applicable charges. Payments are processed securely via Paystack. C&C Transport does not store your card details — all payment data is handled directly by Paystack in compliance with PCI-DSS standards. Prices may change without prior notice, but any change will not affect a booking already confirmed and paid for.`,
  },
  {
    id: "cancellations",
    title: "4. Cancellations & Refunds",
    body: `Cancellations made more than 24 hours before the scheduled departure time are eligible for a full refund, minus a processing fee of GH₵5.00. Cancellations made within 24 hours of departure are non-refundable. No-shows (failure to board at the designated pickup point) are non-refundable. To request a cancellation, contact our support team at support@ccbooking.com with your ticket number.`,
  },
  {
    id: "passenger",
    title: "5. Passenger Responsibilities",
    body: `Passengers are required to arrive at the designated pickup point at least 15 minutes before the scheduled departure time. C&C Transport is not liable for passengers who miss their bus due to late arrival. You must present your booking confirmation (digital or printed) to board. Passengers are expected to behave respectfully toward staff and other travellers. C&C Transport reserves the right to refuse boarding to any passenger who is disruptive or poses a safety risk.`,
  },
  {
    id: "luggage",
    title: "6. Luggage & Storage",
    body: `Each passenger is permitted one standard carry-on bag that fits in the overhead compartment at no additional charge. Extra small cargo bags may be stored in the under-bus compartment for an additional fee of GH₵2,000. Heavy trunks or boxes qualify for the priority terminal check-in option at GH₵5,000. C&C Transport is not responsible for any loss, theft, or damage to luggage unless caused directly by our staff's negligence.`,
  },
  {
    id: "liability",
    title: "7. Limitation of Liability",
    body: `C&C Transport's total liability to any passenger shall not exceed the fare paid for the specific journey in question. We are not liable for any indirect, incidental, or consequential damages arising out of the use of our services, including but not limited to missed academic commitments, connecting transport, or delays caused by traffic, weather, or other events beyond our reasonable control.`,
  },
  {
    id: "privacy",
    title: "8. Privacy & Data",
    body: `We collect personal information (name, email address, phone number) solely for the purposes of processing your booking, sending your ticket confirmation, and providing customer support. We do not sell or share your data with third parties except as required to process payment (Paystack) or comply with applicable Ghanaian law. For full details, please refer to our Privacy Policy.`,
  },
  {
    id: "changes",
    title: "9. Changes to These Terms",
    body: `C&C Transport reserves the right to update these Terms and Conditions at any time. Changes take effect immediately upon being posted on this page. Continued use of the platform after any changes constitutes your acceptance of the revised terms. We encourage you to review this page periodically.`,
  },
  {
    id: "governing",
    title: "10. Governing Law",
    body: `These Terms and Conditions are governed by and construed in accordance with the laws of the Republic of Ghana. Any disputes arising from or in connection with these terms shall be subject to the exclusive jurisdiction of the courts of Ghana.`,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-[#E5E7EB] bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/cnc_logo.png" alt="C&C Transport" width={40} height={40} className="object-contain" />
            <div className="leading-tight">
              <span className="block text-[10px] font-bold uppercase tracking-[0.25em] text-[#425066]">C&C Transport</span>
              <span className="block text-sm font-bold text-[#425066]">Campus Bus Booking</span>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            <Link href="/" className="text-sm font-medium text-[#425066] hover:text-[#425066] transition-colors">Home</Link>
            <Link href="/booking" className="text-sm font-medium text-[#425066] hover:text-[#425066] transition-colors">Book</Link>
          </nav>

          <Link
            href="/booking"
            className="rounded-full bg-[#FF6F00] px-5 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#F57C00] hover:scale-[1.03]"
          >
            Book Now
          </Link>
        </div>
      </header>

      <main>
        {/* Hero */}
        <div className="border-b border-[#E5E7EB] bg-[#F8F9FA] px-4 py-14 text-center sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs text-[#80868B]">
              <Link href="/" className="hover:text-[#425066] transition-colors">Home</Link>
              <FontAwesomeIcon icon={faChevronRight} className="h-2.5 w-2.5" />
              <span className="text-[#425066] font-medium">Terms & Conditions</span>
            </div>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#425066] sm:text-5xl">
              Terms & Conditions
            </h1>
            <p className="mt-4 text-base leading-7 text-[#425066]">
              Please read these terms carefully before using C&C Transport booking services. By booking a seat, you agree to these terms.
            </p>
            <p className="mt-3 text-xs text-[#80868B]">Last updated: June 2026</p>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8 animate-fade-in">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[200px_1fr] lg:items-start lg:gap-12">

            {/* Sticky sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-20 rounded-2xl border border-[#E5E7EB] bg-[#F8F9FA] p-5">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#80868B]">Contents</p>
                <ul className="space-y-1">
                  {SECTIONS.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="block rounded-lg px-3 py-1.5 text-xs text-[#425066] transition hover:bg-white hover:text-[#425066]"
                      >
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* Sections */}
            <div className="space-y-6">
              {/* Intro */}
              <div className="rounded-2xl border border-[#c5cdd9] bg-[#f5f7fa] p-6">
                <p className="text-sm leading-7 text-[#425066]">
                  Welcome to <span className="font-bold text-[#425066]">C&C Transport</span>. These terms govern your use of our campus bus booking platform. Questions? Reach us at{" "}
                  <a href="mailto:support@ccbooking.com" className="font-medium text-[#425066] hover:underline">
                    support@ccbooking.com
                  </a>.
                </p>
              </div>

              {SECTIONS.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-20 rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-card transition-all hover:border-[#425066]/30 hover:shadow-card-hover"
                >
                  <h2 className="mb-3 text-base font-bold text-[#425066]">{section.title}</h2>
                  <p className="text-sm leading-7 text-[#425066]">{section.body}</p>
                </section>
              ))}

              {/* CTA */}
              <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8F9FA] p-6 text-center">
                <p className="mb-5 text-sm text-[#425066]">
                  Questions about these terms? Get in touch before booking.
                </p>
                <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <a
                    href="mailto:support@ccbooking.com"
                    className="rounded-full border border-[#E5E7EB] bg-white px-5 py-2.5 text-sm font-semibold text-[#425066] transition-all hover:bg-[#F3F4F6] hover:scale-[1.03]"
                  >
                    Contact Support
                  </a>
                  <Link
                    href="/booking"
                    className="rounded-full bg-[#FF6F00] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#F57C00] hover:scale-[1.03]"
                  >
                    Book a Seat
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
