import React, { useMemo } from "react";
import { Hand, HandGrabIcon, Heart, Shield, Users } from "lucide-react";
import founder from "../assets/CEO.jpeg";

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

const Home: React.FC = () => {
  const features = useMemo(() => [
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
    }, {
      icon: <Hand className="w-6 h-6 text-center " />,
      title: "Empowerment",
      description: "Enabling individuals and communities to take charge of their own development."
    }, {
      icon: <Users className="w-6 h-6 text-center " />,
      title: "Inclusivity",
      description: "Fostering an environment where everyone feels valued and heard."
    }, {
      icon: <HandGrabIcon className="w-6 h-6 text-center " />,
      title: "Sustainability",
      description: "Promoting long-term solutions that benefit communities for generations to come."
    }
  ], []);

  return (
    <main className="relative min-h-screen bg-[#f8fafc] dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Title Section */}
          <h2 className="text-4xl sm:text-5xl font-bold text-center text-[#15803d] dark:text-white mb-12">
            Tetea Jamii
          </h2>

          {/* CEO Section */}
          <section className="max-w-4xl mx-auto mb-20">
            <h4 className="text-2xl sm:text-3xl font-semibold text-center text-gray-800 dark:text-gray-100 mb-8">
              Our C.E.O
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
          </section>

          {/* Features Section */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-0 justify-items-center  sm:justify-items-start  ">
            {features.map((f, idx) => (
              <FeatureCard key={idx} icon={f.icon} title={f.title} description={f.description} />
            ))}
          </section>
        </div>
      </div>
    </main>
  );
};

export default Home;
