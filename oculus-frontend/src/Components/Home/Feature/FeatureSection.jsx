import React from "react";
import FeatureCard from "./FeatureCard";
import { Link } from "react-router-dom";
import { CheckCircle, Zap, User } from "lucide-react";

export default function FeatureSection() {
  const features = [
    {
      icon: () => <CheckCircle className="text-white" size={24} />,
      title: "High Accuracy",
      subtitle: "Precision",
      description:
        "Our AI diagnostic tools provide unmatched accuracy, ensuring reliable results for medical professionals.",
      linkText: "Review"
      
    },
    {
      icon: () => <Zap className="text-white" size={24} />,
      title: "Rapid Processing",
      subtitle: "Speed",
      description:
        "Experience lightning-fast analysis, allowing for quicker decision-making and patient care.",
      linkText: "Review"

    },
    {
      icon: () => <User className="text-white" size={24} />,
      title: "User-Friendly Interface",
      subtitle: "Usability",
      description:
        "Intuitive design tailored for medical professionals, making navigation and use effortless.",
      linkText: "Review"

    },
  ];

  return (
    <section className=" pt-14 lg:mb-16 px-4 md:px-6 lg:px-8 bg-black min-h-screen">
       <style jsx global>{`
          @import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap");
        `}</style>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className=" sm:text-6xl font-grotesk font-bold text-white mb-4 lg:mt-20">
            Our Features
          </h2>
          <p className=" font-inter sm:text-xl text-gray-400 max-w-2xl mx-auto lg:mb-28">
            Empowering healthcare professionals with advanced diagnostic tools
          </p>
        </div>



        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
        
   
      </div>
    </section>
  );
}