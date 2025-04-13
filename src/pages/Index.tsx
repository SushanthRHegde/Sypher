
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Linkedin, Twitter } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen pt-24 px-4 md:px-8 max-w-7xl mx-auto flex flex-col justify-center">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            I'm a 
            <span className="block">software engineer that</span>
            <span className="block">rarely <span className="text-gradient">writes code.</span></span>
          </h1>
          
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-8">
            Meet the SYPHER platform, a powerful tool for developers to track coding progress,
            organize notes, and showcase their skills to potential employers.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button asChild className="gap-2 bg-sypher-accent hover:bg-sypher-accent/90">
              <Link to="/dashboard">
                Get Started
                <ArrowRight size={16} />
              </Link>
            </Button>
            
            <Button variant="outline" asChild>
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
          
          <div className="flex gap-4 mt-12">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <Github size={24} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <Linkedin size={24} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <Twitter size={24} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
