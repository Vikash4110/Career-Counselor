import React from 'react';

const Features = () => {
    const features = [
      {
        title: "AI-Powered Recommendations",
        description: "Our Gemini AI analyzes your profile to suggest the perfect projects for your skill level and interests.",
        icon: "🤖"
      },
      {
        title: "Personalized Dashboard",
        description: "Track your progress, see recommended next steps, and manage all your projects in one place.",
        icon: "📊"
      },
      {
        title: "Skill Tracking",
        description: "Visualize your growth as you complete projects and acquire new skills.",
        icon: "📈"
      },
      {
        title: "Community Support",
        description: "Connect with other learners working on similar projects for collaboration and help.",
        icon: "👥"
      }
    ];
  
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why Choose Our Platform
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              We combine AI technology with educational best practices to create the perfect learning experience
            </p>
          </div>
  
          <div className="mt-16">
            <div className="grid md:grid-cols-2 gap-10">
              {features.map((feature, index) => (
                <div key={index} className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600 text-xl">
                    {feature.icon}
                  </div>
                  <div className="ml-16">
                    <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                    <p className="mt-2 text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  };

  export default Features;