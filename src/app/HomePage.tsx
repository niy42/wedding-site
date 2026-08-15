import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/wedding/Hero";
import { OurStory } from "@/components/wedding/OurStory";
import { WeddingDetails } from "@/components/wedding/WeddingDetails";
import { Gallery } from "@/components/gallery/Gallery";
import { RSVPForm } from "@/components/rsvp/RSVPForm";
import { GiftUs } from "@/components/gifts/GiftUs";

export function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <OurStory />
        <WeddingDetails />
        <Gallery />
        <RSVPForm />
        <GiftUs />
      </main>
      <Footer />
    </div>
  );
}
