
import React from "react";
import Section from "../components/Section";
import { Hand, HandGrabIcon, Heart, Shield, Users, Leaf, BookOpen, Globe2, UserCheck } from "lucide-react";
import founder from "../assets/CEO.jpeg";
import backgrond from '../assets/Background.jpeg'

const programs = [
  {
    icon: <Leaf className="w-7 h-7" />,
    title: "Mangrove Restoration",
    desc: "Reviving coastal ecosystems and supporting local livelihoods."
  },
  {
    icon: <BookOpen className="w-7 h-7" />,
    title: "Youth Mentorship",
    desc: "Empowering youth with skills, guidance, and hope."
  },
  {
    icon: <UserCheck className="w-7 h-7" />,
    title: "Gender Justice",
    desc: "Championing equality and safety for all."
  },
  {
    icon: <Globe2 className="w-7 h-7" />,
    title: "Women’s Economic Empowerment",
    desc: "Building financial independence and leadership."
  }
];

const features = [
  {
    icon: <Heart className="w-6 h-6 text-center " />,
    title: "Compassionate Care",
    description: "Supporting communities with empathy and understanding, ensuring no one feels alone."
  },
  {
    icon: <Users className="w-6 h-6 text-center " />,
    title: "Community Focus",
    description: "Building stronger communities through collaboration and mutual support."
  },
  {
    icon: <Shield className="w-6 h-6 text-center " />,
    title: "Reliable Support",
    description: "Providing dependable assistance and resources when they're needed most."
  },
  {
    icon: <Hand className="w-6 h-6 text-center " />,
    title: "Empowerment",
    description: "Enabling individuals and communities to take charge of their own development."
  },
  {
    icon: <Users className="w-6 h-6 text-center " />,
    title: "Inclusivity",
    description: "Fostering an environment where everyone feels valued and heard."
  },
  {
    icon: <HandGrabIcon className="w-6 h-6 text-center " />,
    title: "Sustainability",
    description: "Promoting long-term solutions that benefit communities for generations to come."
  }
];

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1">
    <div className="w-14 h-14 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center mb-4">
      <div className="text-green-600 dark:text-green-400">
        {icon}
      </div>
    </div>
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{description}</p>
  </div>
);

interface ProgramCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ icon, title, desc }) => (
  <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-5 rounded-xl shadow hover:shadow-lg transition">
    <div className="bg-green-100 dark:bg-green-900 rounded-lg p-2">
      <span className="text-green-600 dark:text-green-400">{icon}</span>
    </div>
    <div>
      <h4 className="font-semibold text-lg text-gray-900 dark:text-white">{title}</h4>
      <p className="text-gray-600 dark:text-gray-300 text-sm">{desc}</p>
    </div>
  </div>
);

const Home: React.FC = () => (
  <main className="relative min-h-screen bg-[#f8fafc] dark:bg-gray-950">
    {/* Hero Section */}
    <section className="w-full bg-gradient-to-br from-green-200 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-8 flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-green-900 dark:text-green-300 mb-4 drop-shadow-lg">Welcome to Tetea Jamii</h1>
      <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-700 dark:text-gray-200 mb-6">
        Transforming lives in Kilifi County, Kenya through justice, empowerment, and sustainability. Join us in building resilient communities and creating lasting change.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
        <a href="/us" className="inline-block bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition">Read Our Story</a>
        <a href="/docs" className="inline-block bg-white text-green-700 px-6 py-3 rounded-full font-medium border border-green-200 hover:bg-green-50 transition">See Documents</a>
      </div>
      <div className="w-40 h-40 sm:w-56 sm:h-56 rounded-full overflow-hidden shadow-lg mx-auto">
        <img src={backgrond} alt="Community" className="w-full h-full object-cover" />
      </div>
    </section>

    {/* Mission & Impact Section */}
    <Section size="md">
      <h2 className="text-3xl sm:text-4xl font-bold text-green-800 dark:text-green-300 mb-4 text-center">Our Mission</h2>
      <p className="text-lg text-gray-700 dark:text-gray-200 text-center mb-6">
        We empower communities to overcome social, economic, and environmental challenges through practical, people-centered solutions. Our work spans mangrove restoration, youth mentorship, gender justice, and women’s economic empowerment.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
        {programs.map((p, idx) => <ProgramCard key={idx} {...p} />)}
      </div>
    </Section>

    {/* Testimonial / Impact Quote */}
    <Section size="sm">
      <blockquote className="bg-green-50 dark:bg-gray-900 border-l-4 border-green-600 dark:border-green-400 p-6 rounded-xl shadow text-lg text-gray-800 dark:text-gray-100 italic">
        “Tetea Jamii has given our youth hope and our women a voice. The mangroves are thriving, and so is our community.”
        <span className="block mt-4 text-right text-green-700 dark:text-green-300 font-medium">— Community Member, Takaungu</span>
      </blockquote>
    </Section>

    {/* CEO Section */}
    <Section size="md" className="mb-12 px-0">
      <h4 className="text-2xl sm:text-3xl font-semibold text-center text-gray-800 dark:text-gray-100 mb-8">
        Meet Our Founder
      </h4>
      <div className="relative max-w-2xl mx-auto">
        <div className="aspect-[4/3] md:aspect-[16/9] rounded-2xl overflow-hidden shadow-lg bg-white dark:bg-gray-800">
          <img
            src={founder}
            alt="CEO Lilian"
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
        </div>
        <div className="mt-6 text-center px-4">
          <h5 className="text-xl font-medium text-gray-900 dark:text-gray-100">Lilian</h5>
          <p className="mt-1 text-base text-gray-600 dark:text-gray-300">Founder & CEO</p>
          <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
            Lilian is the CEO and founder of Tetea Jamii Social Justice CBO, a grassroots, women-led and community owned organization based in Takaungu, Kilifi County, Kenya. As a passionate human rights defender, she has dedicated her career to advancing gender equality, protecting children's rights, and fostering inclusive community development.
          </p>
          <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
            Driven by compassion and a deep belief in the power of collective action, Lilian continues to inspire communities to lead change from the ground up, promoting dignity, equality, and sustainable development for all.
          </p>
        </div>
      </div>
    </Section>

    {/* Features Section */}
    <Section size="lg">
      <h3 className="text-2xl sm:text-3xl font-bold text-center text-green-800 dark:text-green-300 mb-8">Our Values</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {features.map((f, idx) => (
          <FeatureCard key={idx} icon={f.icon} title={f.title} description={f.description} />
        ))}
      </div>
    </Section>

    {/* Get Involved Section */}
    <section className="w-full bg-green-100 dark:bg-green-900 py-8 px-4 flex flex-col items-center text-center">
      <h3 className="text-2xl sm:text-3xl font-bold text-green-900 dark:text-green-100 mb-4">Get Involved</h3>
      <p className="max-w-xl mx-auto text-gray-700 dark:text-gray-200 mb-6">
        Whether you’re a local resident, volunteer, or partner, your support helps us create lasting change. Join us in our mission for justice, empowerment, and sustainability.
      </p>
      <a href="/contacts" className="inline-block bg-green-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-800 transition">Contact Us</a>
    </section>
  </main>
);

export default Home;
