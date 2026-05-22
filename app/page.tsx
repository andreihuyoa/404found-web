"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

import StepCard from "../components/ui/StepCard";
import FeatureCard from "../components/ui/FeatureCard";
import SearchExperience from "../components/SearchExperience";

import {
  Brain,
  Shield,
  Clock,
  Users,
  TrendingUp,
  Menu,
  X,
  ChevronRight,
  Star,
  MapPin,
  Heart,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Reusable press-bounce for links and buttons
  const animatePress = useCallback((el: HTMLElement | null) => {
    if (!el) return;
    gsap.fromTo(
      el,
      { scale: 0.91 },
      { scale: 1, duration: 0.4, ease: "back.out(3)" },
    );
  }, []);

  const scrollToSection = useCallback(
    (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      animatePress(e.currentTarget);
      gsap.to(window, {
        duration: 0.9,
        scrollTo: { y: id, offsetY: 72 },
        ease: "power3.inOut",
      });
    },
    [animatePress],
  );

  const toggleMenu = useCallback(() => {
    const menu = mobileMenuRef.current;
    const btn = hamburgerRef.current;

    // Spin the icon during swap
    if (btn) {
      gsap.fromTo(
        btn,
        { rotate: isMenuOpen ? -45 : 45, scale: 0.8 },
        { rotate: 0, scale: 1, duration: 0.25, ease: "back.out(2.5)" },
      );
    }

    if (!isMenuOpen) {
      setIsMenuOpen(true);
      // Slide down
      gsap.fromTo(
        menu,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.3, ease: "power3.out" },
      );
    } else {
      // Slide up, then unmount
      gsap.to(menu, {
        height: 0,
        opacity: 0,
        duration: 0.25,
        ease: "power3.in",
        onComplete: () => setIsMenuOpen(false),
      });
    }
  }, [isMenuOpen]);

  return (
    <div className="bg-background text-text min-h-screen cursor-default">
      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-background/60 shadow-md backdrop-blur-lg"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-2">
            <button
              className="flex min-w-0 cursor-pointer items-center gap-2"
              onClick={(e) => {
                animatePress(e.currentTarget);
                gsap.to(window, {
                  duration: 0.9,
                  scrollTo: 0,
                  ease: "power3.inOut",
                });
              }}
            >
              <div className="bg-primary rounded-lg p-2">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="text-primary truncate text-base font-semibold sm:text-lg md:text-xl">
                Hilom
              </span>
            </button>

            <div className="hidden items-center gap-8 md:flex">
              <a
                href="#features"
                className="text-text/90 hover:text-primary font-medium transition-colors"
                onClick={scrollToSection("#features")}
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-text/90 hover:text-primary font-medium transition-colors"
                onClick={scrollToSection("#how-it-works")}
              >
                How It Works
              </a>
              <a
                href="#about"
                className="text-text/90 hover:text-primary font-medium transition-colors"
                onClick={scrollToSection("#about")}
              >
                About
              </a>
              <a
                href="#demo"
                className="bg-primary rounded-lg px-6 py-2 font-medium text-white transition-all duration-200 hover:shadow-md hover:brightness-95"
                onClick={scrollToSection("#demo")}
              >
                Try The Demo
              </a>
            </div>

            <button
              ref={hamburgerRef}
              className="text-text md:hidden"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Always mounted so GSAP can animate height in/out */}
        <div
          ref={mobileMenuRef}
          className="bg-background border-secondary/50 overflow-hidden border-t shadow-md md:hidden"
          style={{ height: 0, opacity: 0 }}
        >
          <div className="space-y-3 px-4 py-4">
            <a
              href="#features"
              className="text-text/90 hover:text-primary block font-medium transition-colors"
              onClick={scrollToSection("#features")}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-text/90 hover:text-primary block font-medium transition-colors"
              onClick={scrollToSection("#how-it-works")}
            >
              How It Works
            </a>
            <a
              href="#about"
              className="text-text/90 hover:text-primary block font-medium transition-colors"
              onClick={scrollToSection("#about")}
            >
              About
            </a>
            <button
              className="bg-primary w-full rounded-lg px-6 py-2 font-medium text-white"
              onClick={() => {
                setIsMenuOpen(false);
                gsap.to(window, {
                  duration: 0.9,
                  scrollTo: { y: "#demo", offsetY: 72 },
                  ease: "power3.inOut",
                });
              }}
            >
              Try The Demo
            </button>
          </div>
        </div>
      </nav>

      <section className="px-4 pt-24 pb-14 sm:px-6 sm:pt-28 sm:pb-16 lg:px-8 lg:pt-32 lg:pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-4xl text-center sm:mb-16">
            <div className="bg-accent/30 text-text mb-5 inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium sm:mb-6 sm:px-4 sm:text-sm">
              <Brain className="h-4 w-4" />
              <span>AI-Powered Healthcare Recommendations</span>
            </div>

            <h1 className="text-primary mb-4 text-5xl leading-tight font-semibold text-balance sm:mb-6 sm:text-4xl lg:text-7xl xl:text-8xl">
              Find Your Perfect Healthcare Provider
            </h1>

            <p className="text-text/80 mb-6 text-sm leading-relaxed sm:mb-8 sm:text-base lg:text-lg">
              Hilom is a thesis project, a healthcare facility finder that helps
              Filipinos discover nearby hospitals based on their medical service
              needs. Using a model we developed that combines machine learning
              with other algorithms, Hilom provides personalized recommendations
              ranked by professional expertise, medical services offered, and
              relevance, distance, and other factors to help you find the best
              healthcare provider near you.
            </p>

            <div className="border-secondary/50 mx-auto mb-8 max-w-2xl rounded-xl border bg-white p-4 text-left sm:p-6">
              <div className="mb-4 flex gap-3">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <AlertCircle className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <h4 className="text-text text-base font-semibold sm:text-lg">
                      Current Coverage: Ermita, Manila
                    </h4>
                  </div>
                  <p className="text-text/80 text-xs">
                    This application currently provides recommendations for
                    healthcare facilities in Ermita, Manila. Location permission
                    and at least one medical service selection are required to
                    use this application.
                    {/* We&apos;re actively expanding our
                    coverage to other areas. */}
                  </p>
                </div>
              </div>
              <div className="text-text/90 grid gap-3 text-sm sm:grid-cols-2">
                <div className="flex gap-2">
                  <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                  <span>Up to 5 top-ranked results</span>
                </div>
                <div className="flex gap-2">
                  <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                  <span>ML-powered ranking system</span>
                </div>
                <div className="flex gap-2">
                  <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                  <span>Service filtering included</span>
                </div>
                <div className="flex gap-2">
                  <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                  <span>Distance-based matching</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
              <a
                href="#demo"
                className="group bg-primary flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold text-white transition-all duration-200 hover:shadow-lg hover:brightness-95 sm:w-auto sm:px-8 sm:py-4"
                onClick={scrollToSection("#demo")}
              >
                Start Finding Providers
                <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
              <button
                disabled
                className="text-text border-secondary hover:border-primary w-full rounded-xl border-2 bg-white px-6 py-3 font-semibold transition-all duration-200 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-8 sm:py-4"
              >
                Watch Demo
              </button>
            </div>

            <div className="text-text/80 mt-10 flex flex-col items-start justify-center gap-4 text-sm sm:mt-12 sm:flex-row sm:flex-wrap sm:items-center sm:gap-8">
              <div className="flex items-center gap-2">
                <Star className="text-accent fill-accent h-5 w-5" />
                <span>
                  <strong className="text-text">20+</strong> Verified Healthcare
                  Providers
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="text-primary h-5 w-5" />
                <span>
                  <strong className="text-text">10+</strong> Happy Patients
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="text-secondary h-5 w-5" />
                <span>
                  <strong className="text-text">1</strong> City Covered
                </span>
              </div>
            </div>
          </div>

          <div id="demo" className="relative mt-12 scroll-mt-24 sm:mt-16">
            <div className="border-secondary/50 relative overflow-hidden rounded-2xl border bg-white shadow-lg">
              <div className="bg-text flex items-center gap-2 px-4 py-3">
                <div className="flex gap-2">
                  <div className="bg-primary h-3 w-3 rounded-full"></div>
                  <div className="bg-accent h-3 w-3 rounded-full"></div>
                  <div className="bg-secondary h-3 w-3 rounded-full"></div>
                </div>
                <div className="flex-1 text-center text-sm text-white/80">
                  Try the demo
                </div>
              </div>
              <div className="bg-background h-[min(860px,calc(100svh-1.5rem))] min-h-[640px] overflow-hidden sm:min-h-[700px] lg:aspect-video lg:h-auto lg:min-h-[680px]">
                <SearchExperience />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center sm:mb-12 lg:mb-16">
            <h2 className="text-text mb-3 text-2xl font-semibold sm:mb-4 sm:text-3xl lg:text-4xl">
              How to Use the Project
            </h2>
            <p className="text-text/80 mx-auto max-w-2xl text-sm sm:text-base lg:text-lg">
              Simple steps to find the best healthcare facilities near you
            </p>
          </div>

          <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            <FeatureCard
              icon={<Brain className="h-8 w-8" />}
              title="Select Medical Services"
              description="Choose one or more medical services you need from the dropdown menu. Hold Ctrl (Windows/Linux) or Cmd (Mac) to select multiple services."
            />
            <FeatureCard
              icon={<MapPin className="h-8 w-8" />}
              title="Enable Location Access"
              description="Grant location permission to the application. We use your GPS data to find hospitals near you."
            />
            <FeatureCard
              icon={<TrendingUp className="h-8 w-8" />}
              title="Get ML-Ranked Results"
              description="Our machine learning algorithm analyze distance, service match, and other factors to rank up the 5 best healthcare facilities for you."
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8" />}
              title="View Interactive Map"
              description="See your location (blue marker) and recommended hospitals (red markers) on an interactive map. Click markers for more details."
            />
            <FeatureCard
              icon={<Clock className="h-8 w-8" />}
              title="Review Hospital Details"
              description="Access comprehensive information including address, distance, phone number, operating hours, services, and insurance coverage."
            />
            <FeatureCard
              icon={<Users className="h-8 w-8" />}
              title="Compare Insurance Options"
              description="See available insurance coverage including PhilHealth, HMO plans, and other providers accepted at each facility."
            />
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center sm:mb-12 lg:mb-16">
            <h2 className="text-text mb-3 text-2xl font-semibold sm:mb-4 sm:text-3xl lg:text-4xl">
              Understanding Your Results
            </h2>
            <p className="text-text/80 mx-auto max-w-2xl text-sm sm:text-base lg:text-lg">
              What you&apos;ll see after your search
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
            <StepCard
              number="1"
              title="Hospital Information"
              description="Each result shows the hospital name, classification (Public/Private), full address, contact number, and distance from your location."
            />
            <StepCard
              number="2"
              title="Service Details"
              description="Your selected services are highlighted in blue. Other available services appear in gray. Hover over '+X more' to see additional services."
            />
            <StepCard
              number="3"
              title="Insurance & Hours"
              description="View accepted insurance including PhilHealth, HMO plans, operating hours, and other location details for easy contact and visit planning."
            />
          </div>
        </div>
      </section>

      <section
        id="about"
        className="bg-primary/80 px-4 py-14 text-white sm:px-6 sm:py-16 lg:px-8 lg:py-20"
      >
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-2xl font-semibold text-white/90 sm:mb-6 sm:text-3xl lg:text-4xl">
            Ready to Find Your Perfect Healthcare Match?
          </h2>
          <p className="mb-6 text-sm text-white/90 sm:mb-8 sm:text-base lg:text-lg">
            Join thousands of patients who have found better healthcare through
            intelligent recommendations.
          </p>
          <a
            href="#"
            className="text-primary hover:text-primary/80 inline-flex w-full items-center justify-center rounded-xl bg-white px-6 py-3 font-semibold transition-all duration-200 hover:shadow-lg hover:brightness-95 sm:w-auto sm:px-8 sm:py-4"
          >
            Get Started for Free
          </a>
        </div>
      </section>

      <footer className="bg-text px-4 py-12 text-white/80 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="bg-primary rounded-lg p-2">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">Hilom</span>
              </div>
              <p className="text-sm text-white/70">
                Connecting patients with the best healthcare providers through
                AI-powered recommendations.
              </p>
            </div>

            <div>
              <h3 className="mb-3 text-base font-semibold text-white sm:text-lg">
                Product
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    For Providers
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3 text-base font-semibold text-white sm:text-lg">
                Company
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3 text-base font-semibold text-white sm:text-lg">
                Legal
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    HIPAA Compliance
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 text-center text-sm text-white/60">
            <p>&copy; 2026 Andrei Huyo-a. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
