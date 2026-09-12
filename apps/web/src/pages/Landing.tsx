import { HeroSection } from "./landing/components/HeroSection";
import { PathwaySection } from "./landing/components/PathwaySection";
import { FeaturedJobsSection } from "./landing/components/FeaturedJobsSection";
import { RoleAudienceSection } from "./landing/components/RoleAudienceSection";
import { StatsSection } from "./landing/components/StatsSection";
import { AlumniStoriesSection } from "./landing/components/AlumniStoriesSection";
import { FaqSection } from "./landing/components/FaqSection";
import { CtaBannerSection } from "./landing/components/CtaBannerSection";
import { LandingFooter } from "./landing/components/LandingFooter";

export default function Landing() {
  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-900 selection:bg-red-500 selection:text-white">
      {/* 1. Hero with Interactive Job & AI Matching Mockup */}
      <HeroSection />

      {/* 2. Key Platform Statistics */}
      <StatsSection />

      {/* 3. The Pathway to Japan: 4-Step Career Journey (also anchors #features) */}
      <div id="features">
        <PathwaySection />
      </div>

      {/* 4. Featured Live Jobs in Japan */}
      <FeaturedJobsSection />

      {/* 5. Audience Segments: Candidates vs Enterprises vs Mentors */}
      <RoleAudienceSection />

      {/* 6. Social Proof: Alumni Stories & Senior Mentors */}
      <AlumniStoriesSection />

      {/* 7. Frequently Asked Questions */}
      <FaqSection />

      {/* 8. Conversion CTA Banner */}
      <CtaBannerSection />

      {/* 9. Comprehensive Enterprise Footer */}
      <LandingFooter />
    </div>
  );
}
