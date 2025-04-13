
import { Code, FileSpreadsheet, BarChart3, Users } from "lucide-react";

const About = () => {
  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">About SYPHER</h1>
      
      <div className="glass-card p-8 mb-12">
        <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
        <p className="text-gray-300 mb-6">
          SYPHER is designed to be the ultimate companion for software engineers and coding students. 
          Our platform helps you track your progress across multiple coding platforms, organize your 
          learning materials, and showcase your skills to potential employers.
        </p>
        
        <p className="text-gray-300">
          Whether you're preparing for technical interviews, tracking your daily coding challenges, 
          or building a portfolio to impress recruiters, SYPHER provides the tools you need to 
          succeed in your coding journey.
        </p>
      </div>
      
      <h2 className="text-2xl font-semibold mb-6">Key Features</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {features.map((feature, index) => (
          <div key={index} className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-md ${feature.iconBg}`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-medium">{feature.title}</h3>
            </div>
            <p className="text-gray-400">{feature.description}</p>
          </div>
        ))}
      </div>
      
      <h2 className="text-2xl font-semibold mb-6">How It Works</h2>
      
      <div className="glass-card p-8 mb-12">
        <ol className="space-y-8 relative before:absolute before:left-3 before:top-2 before:h-[calc(100%-16px)] before:w-[1px] before:bg-gray-700">
          {steps.map((step, index) => (
            <li key={index} className="ml-10 relative">
              <div className="absolute -left-10 flex h-6 w-6 items-center justify-center rounded-full bg-sypher-accent text-white text-sm">
                {index + 1}
              </div>
              <h3 className="text-lg font-medium mb-2">{step.title}</h3>
              <p className="text-gray-400">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
      
      <div className="glass-card p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Ready to level up your coding journey?</h2>
        <p className="text-gray-400 mb-6">
          Join thousands of developers using SYPHER to track their progress and showcase their skills.
        </p>
        <button className="px-6 py-3 bg-sypher-accent rounded-md text-white font-medium hover:bg-sypher-accent/90 transition-colors">
          Get Started Now
        </button>
      </div>
    </div>
  );
};

const features = [
  {
    title: "Progress Tracking",
    description: "Sync your LeetCode, GitHub, and HackerRank accounts to automatically track your coding activity and visualize your progress over time.",
    icon: <BarChart3 size={20} />,
    iconBg: "bg-blue-500/20 text-blue-500",
  },
  {
    title: "Note-Taking System",
    description: "Create and organize study materials with support for rich text, code snippets, and markdown formatting. Tag and search your notes for easy retrieval.",
    icon: <FileSpreadsheet size={20} />,
    iconBg: "bg-green-500/20 text-green-500",
  },
  {
    title: "Professional Portfolio",
    description: "Automatically generate a polished portfolio showcasing your skills, projects, and achievements to share with potential employers.",
    icon: <Code size={20} />,
    iconBg: "bg-purple-500/20 text-purple-500",
  },
  {
    title: "Community Features",
    description: "Connect with peers, join study groups, and participate in discussions to enhance your learning experience.",
    icon: <Users size={20} />,
    iconBg: "bg-amber-500/20 text-amber-500",
  },
];

const steps = [
  {
    title: "Create Your Account",
    description: "Sign up for SYPHER and set up your profile with basic information and preferences.",
  },
  {
    title: "Connect Your Platforms",
    description: "Link your LeetCode, GitHub, HackerRank, and other coding accounts to automatically sync your activity.",
  },
  {
    title: "Organize Your Learning",
    description: "Create notebooks, take notes, and set goals to structure your coding journey and study plans.",
  },
  {
    title: "Track Your Progress",
    description: "Monitor your development through interactive dashboards and statistics that visualize your growth.",
  },
  {
    title: "Showcase Your Skills",
    description: "Share your auto-generated portfolio with potential employers to demonstrate your coding abilities.",
  },
];

export default About;
