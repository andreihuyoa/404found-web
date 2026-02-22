"use client";

import { useEffect, useState } from "react";

import StepCard from "../components/ui/StepCard";
import FeatureCard from "../components/ui/FeatureCard";

import {
  Stethoscope,
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
import Link from "next/link";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-text">
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-background/60 backdrop-blur-lg shadow-md" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="bg-primary p-2 rounded-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-base sm:text-lg md:text-xl font-semibold text-primary truncate">
                CSRP404 Thesis Project
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-text/90 hover:text-primary transition-colors font-medium"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-text/90 hover:text-primary transition-colors font-medium"
              >
                How It Works
              </a>
              <a
                href="#about"
                className="text-text/90 hover:text-primary transition-colors font-medium"
              >
                About
              </a>
              <Link
                href="/search"
                className="bg-primary text-white px-6 py-2 rounded-lg hover:shadow-md hover:brightness-95 transition-all duration-200 font-medium"
              >
                Try The Demo
              </Link>
            </div>

            <button className="md:hidden text-text" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-background border-t border-secondary/50 shadow-md">
            <div className="px-4 py-4 space-y-3">
              <a
                href="#features"
                className="block text-text/90 hover:text-primary transition-colors font-medium"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="block text-text/90 hover:text-primary transition-colors font-medium"
              >
                How It Works
              </a>
              <a
                href="#about"
                className="block text-text/90 hover:text-primary transition-colors font-medium"
              >
                About
              </a>
              <button className="w-full bg-primary text-white px-6 py-2 rounded-lg font-medium">
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      <section className="pt-24 sm:pt-28 lg:pt-32 pb-14 sm:pb-16 lg:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-accent/30 text-text px-3 sm:px-4 py-2 rounded-full mb-5 sm:mb-6 font-medium text-xs sm:text-sm">
              <Brain className="w-4 h-4" />
              <span>AI-Powered Healthcare Recommendations</span>
            </div>

            <h1 className="text-5xl sm:text-4xl lg:text-7xl xl:text-8xl font-semibold mb-4 sm:mb-6 text-primary leading-tight text-balance">
              Find Your Perfect Healthcare Provider
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-text/80 mb-6 sm:mb-8 leading-relaxed">
              CSRP404 Thesis Project is a healthcare facility finder that helps you discover nearby
              hospitals based on your location and specific medical service needs. Using machine
              learning algorithm, we provide personalized recommendations ranked by relevance,
              distance, and service availability.
            </p>

            <div className="bg-white border border-secondary/50 rounded-xl p-4 sm:p-6 mb-8 text-left max-w-2xl mx-auto">
              <div className="flex gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <h4 className="text-base sm:text-lg font-semibold text-text">
                      Current Coverage: Ermita, Manila
                    </h4>
                  </div>
                  <p className="text-text/80 text-sm">
                    This application currently provides recommendations for healthcare facilities in
                    Ermita, Manila. We&apos;re actively expanding our coverage to other areas.
                    Location permission and at least one medical service selection are required to
                    use this application.
                  </p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3 text-sm text-text/90">
                <div className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Up to 5 top-ranked results</span>
                </div>
                <div className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>ML-powered ranking system</span>
                </div>
                <div className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Service filtering included</span>
                </div>
                <div className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Distance-based matching</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center">
              <Link
                href="/search"
                className="group w-full sm:w-auto bg-primary text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:shadow-lg hover:brightness-95 transition-all duration-200 font-semibold flex items-center justify-center gap-2"
              >
                Start Finding Providers
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                disabled
                className="w-full sm:w-auto bg-white text-text px-6 sm:px-8 py-3 sm:py-4 rounded-xl border-2 border-secondary hover:border-primary hover:shadow-md transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Watch Demo
              </button>
            </div>

            <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center justify-center gap-4 sm:gap-8 text-sm text-text/80">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-accent fill-accent" />
                <span>
                  <strong className="text-text">20+</strong> Verified Providers
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span>
                  <strong className="text-text">10+</strong> Happy Patients
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-secondary" />
                <span>
                  <strong className="text-text">1</strong> City Covered
                </span>
              </div>
            </div>
          </div>

          <div className="relative mt-12 sm:mt-16">
            <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-secondary/50">
              <div className="bg-text px-4 py-3 flex items-center gap-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <div className="w-3 h-3 rounded-full bg-accent"></div>
                  <div className="w-3 h-3 rounded-full bg-secondary"></div>
                </div>
                <div className="flex-1 text-center text-white/80 text-sm">
                  HealthMatch AI Platform
                </div>
              </div>
              <div className="aspect-video bg-background flex items-center justify-center">
                <div className="text-center p-4 sm:p-8">
                  <Stethoscope className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-primary mx-auto mb-3 sm:mb-4" />
                  <p className="text-text/80">Interactive Platform Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-14 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-3 sm:mb-4 text-text">
              How to Use the Project
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-text/80 max-w-2xl mx-auto">
              Simple steps to find the best healthcare facilities near you
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            <FeatureCard
              icon={<Brain className="w-8 h-8" />}
              title="Select Medical Services"
              description="Choose one or more medical services you need from the dropdown menu. Hold Ctrl (Windows/Linux) or Cmd (Mac) to select multiple services."
            />
            <FeatureCard
              icon={<MapPin className="w-8 h-8" />}
              title="Enable Location Access"
              description="Grant location permission to the application. We use your GPS data to find hospitals near you."
            />
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8" />}
              title="Get ML-Ranked Results"
              description="Our machine learning algorithm analyze distance, service match, and other factors to rank up the 5 best healthcare facilities for you."
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="View Interactive Map"
              description="See your location (blue marker) and recommended hospitals (red markers) on an interactive map. Click markers for more details."
            />
            <FeatureCard
              icon={<Clock className="w-8 h-8" />}
              title="Review Hospital Details"
              description="Access comprehensive information including address, distance, phone number, operating hours, services, and insurance coverage."
            />
            <FeatureCard
              icon={<Users className="w-8 h-8" />}
              title="Compare Insurance Options"
              description="See available insurance coverage including PhilHealth, HMO plans, and other providers accepted at each facility."
            />
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-14 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-3 sm:mb-4 text-text">
              Understanding Your Results
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-text/80 max-w-2xl mx-auto">
              What you&apos;ll see after your search
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
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
        className="py-14 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-primary/80 text-white"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-4 sm:mb-6 text-white/90">
            Ready to Find Your Perfect Healthcare Match?
          </h2>
          <p className="text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 text-white/90">
            Join thousands of patients who have found better healthcare through intelligent
            recommendations.
          </p>
          <Link
            href="#"
            className="inline-flex w-full sm:w-auto items-center justify-center bg-white text-primary px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:shadow-lg hover:brightness-95 transition-all duration-200 font-semibold hover:text-primary/80"
          >
            Get Started for Free
          </Link>
        </div>
      </section>

      <footer className="bg-text text-white/80 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-primary p-2 rounded-lg">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">CSRP404 Thesis Project</span>
              </div>
              <p className="text-sm text-white/70">
                Connecting patients with the best healthcare providers through AI-powered
                recommendations.
              </p>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3">Product</h3>
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
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3">Company</h3>
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
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3">Legal</h3>
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
