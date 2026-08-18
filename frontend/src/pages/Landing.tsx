import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeatureCard from "../components/FeatureCard";
import Footer from "../components/Footer";

export default function Landing() {
  return (
    <div className="app">

      <Navbar />

      <Hero />

      <section className="features">

        <FeatureCard
          title="Threat Intelligence"
          description="Analyze IPs, URLs, and domains."
        />

        <FeatureCard
          title="Secure Code Review"
          description="Detect security issues in code."
        />

        <FeatureCard
          title="SOC Analysis"
          description="Investigate logs and incidents."
        />

        <FeatureCard
          title="Learning"
          description="Learn cybersecurity interactively."
        />

      </section>

      <Footer />

    </div>
  );
}