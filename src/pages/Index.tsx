
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Linkedin, Twitter } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* Hero Section */}
      <section className="w-full min-h-screen py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto flex flex-col justify-center items-center text-center">
        <div className="animate-fade-in max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            I'm a
            <span className="block mt-2">software engineer that</span>
            <span className="block mt-2">rarely <span className="text-gradient">writes code.</span></span>
          </h1>
          
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12">
            Meet the SYPHER platform, a powerful tool for developers to track coding progress,
            organize notes, and showcase their skills to potential employers.
          </p>
          
          <div className="flex flex-wrap gap-6 justify-center">
            <Button asChild className="gap-2 bg-sypher-accent hover:bg-sypher-accent/90 px-8 py-6 text-lg">
              <Link to="/dashboard">
                Get Started
                <ArrowRight size={20} />
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="px-8 py-6 text-lg">
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
          
          <div className="flex gap-8 mt-16 justify-center">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform duration-200">
              <Github size={28} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform duration-200">
              <Linkedin size={28} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform duration-200">
              <Twitter size={28} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
