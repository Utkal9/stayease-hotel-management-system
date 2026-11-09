import Logo from "../components/Logo";
import RoadmapList from "../components/RoadmapList";
import SystemStatusCard from "../components/SystemStatusCard";
import { roadmapPhases } from "./landingContent";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-navy-950">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Logo />
          <p className="hidden text-sm text-neutral-300 sm:block">Hotel Booking &amp; Operations Management</p>
        </div>
      </header>

      <main className="flex-1">
        <section className="bg-navy-950 pb-16 pt-10 text-white sm:pb-24 sm:pt-16">
          <div className="mx-auto grid max-w-6xl items-start gap-12 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div>
              <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
                Bookings and daily hotel operations in one system.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-300">
                StayEase is a booking and operations platform for hotels. This build is the project foundation: the web app, the API and a development
                database setup are in place. Booking features arrive in the phases below.
              </p>
            </div>

            <SystemStatusCard />
          </div>
        </section>

        <section aria-labelledby="roadmap-heading" className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <h2 id="roadmap-heading" className="font-display text-3xl font-semibold tracking-tight text-navy-950">
            What is being built next
          </h2>
          <p className="mt-3 max-w-xl text-neutral-600">
            The first five phases are listed here. Later phases cover bookings, payments, staff and admin tools, and testing.
          </p>
          <div className="mt-8">
            <RoadmapList phases={roadmapPhases} />
          </div>
        </section>
      </main>

      <footer className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-6xl px-6 py-6 text-sm text-neutral-600">StayEase foundation build, Phase 1.</div>
      </footer>
    </div>
  );
}
