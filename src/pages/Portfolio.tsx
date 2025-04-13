import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Github, Code2, Award, Share2, Palette } from 'lucide-react';

const Portfolio = () => {
  const { user, profileData } = useAuth();
  const [isPublic, setIsPublic] = useState(true);
  const [theme, setTheme] = useState('light');

  const stats = {
    leetcode: profileData?.leetcode ? {
      totalSolved: profileData.leetcode.totalSolved,
      easyCount: profileData.leetcode.easySolved,
      mediumCount: profileData.leetcode.mediumSolved,
      hardCount: profileData.leetcode.hardSolved
    } : {
      totalSolved: 0,
      easyCount: 0,
      mediumCount: 0,
      hardCount: 0
    },
    github: profileData?.github ? {
      repositories: profileData.github.public_repos,
      followers: profileData.github.followers,
      stars: profileData.github.followers
    } : {
      repositories: 0,
      contributions: 0,
      stars: 0
    }
  };

  const skills = [
    { name: 'JavaScript', level: 'Advanced' },
    { name: 'React', level: 'Advanced' },
    { name: 'Python', level: 'Intermediate' },
    { name: 'Node.js', level: 'Intermediate' },
    { name: 'TypeScript', level: 'Intermediate' },
  ];

  const projects = [
    {
      name: 'Project Management App',
      description: 'A full-stack application for managing projects and tasks',
      techStack: ['React', 'Node.js', 'MongoDB'],
      githubUrl: 'https://github.com/username/project-management'
    },
    {
      name: 'E-commerce Platform',
      description: 'An online shopping platform with cart and payment integration',
      techStack: ['Next.js', 'Stripe', 'PostgreSQL'],
      githubUrl: 'https://github.com/username/ecommerce-platform'
    }
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-14 py-6 sm:py-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">My Portfolio</h1>
        <div className="flex gap-3">
          <Button
            variant={isPublic ? 'default' : 'outline'}
            onClick={() => setIsPublic(!isPublic)}
            className="flex items-center gap-2 text-sm"
          >
            <Share2 className="h-4 w-4" />
            {isPublic ? 'Public' : 'Private'}
          </Button>
          <Button
            variant="outline"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="flex items-center gap-2 text-sm"
          >
            <Palette className="h-4 w-4" />
            Theme
          </Button>
        </div>
      </div>

      {/* Profile Section */}
      <Card className="p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
          <div className="w-24 sm:w-32 h-24 sm:h-32 rounded-full bg-sypher-accent flex items-center justify-center flex-shrink-0">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'User'}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="h-12 sm:h-16 w-12 sm:w-16 text-white" />
            )}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">{user?.displayName || 'Your Name'}</h2>
            <p className="text-muted-foreground mb-4 text-sm sm:text-base">
              Full-stack developer passionate about creating efficient and scalable applications.
              Experienced in modern web technologies and best practices.
            </p>
            <div className="flex gap-3 justify-center sm:justify-start">
              <Button variant="outline" className="flex items-center gap-2 text-sm">
                <Github className="h-4 w-4" />
                GitHub
              </Button>
              <Button variant="outline" className="flex items-center gap-2 text-sm">
                <Code2 className="h-4 w-4" />
                LeetCode
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card className="p-4 sm:p-6 bg-card">
          <h3 className="text-lg sm:text-xl font-semibold mb-4">LeetCode Statistics</h3>
          <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center">
            <div className="p-2 rounded-lg bg-green-100/10">
              <div className="text-xl sm:text-2xl font-bold text-green-500">{stats.leetcode.easyCount}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Easy</div>
            </div>
            <div className="p-2 rounded-lg bg-yellow-100/10">
              <div className="text-xl sm:text-2xl font-bold text-yellow-500">{stats.leetcode.mediumCount}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Medium</div>
            </div>
            <div className="p-2 rounded-lg bg-red-100/10">
              <div className="text-xl sm:text-2xl font-bold text-red-500">{stats.leetcode.hardCount}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Hard</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 bg-card">
          <h3 className="text-lg sm:text-xl font-semibold mb-4">GitHub Activity</h3>
          <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center">
            <div className="p-2 rounded-lg bg-card/50">
              <div className="text-xl sm:text-2xl font-bold">{stats.github.repositories}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Repositories</div>
            </div>
            <div className="p-2 rounded-lg bg-card/50">
              <div className="text-xl sm:text-2xl font-bold">{stats.github.followers} </div>
              <div className="text-xs sm:text-sm text-muted-foreground">Followers</div>
            </div>
            <div className="p-2 rounded-lg bg-card/50">
              <div className="text-xl sm:text-2xl font-bold">{stats.github.stars}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Stars</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Skills Section */}
      <Card className="p-4 sm:p-6 mb-6 sm:mb-8 bg-card">
        <h3 className="text-lg sm:text-xl font-semibold mb-4">Skills & Expertise</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {skills.map((skill) => (
            <div key={skill.name} className="p-3 sm:p-4 border rounded-lg bg-card/50">
              <div className="font-semibold text-sm sm:text-base">{skill.name}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">{skill.level}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Projects Section */}
      <Card className="p-4 sm:p-6 bg-card">
        <h3 className="text-lg sm:text-xl font-semibold mb-4">Featured Projects</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {projects.map((project) => (
            <div key={project.name} className="border rounded-lg p-3 sm:p-4 bg-card/50">
              <h4 className="text-base sm:text-lg font-semibold mb-2">{project.name}</h4>
              <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 bg-sypher-accent/10 text-sypher-accent rounded-full text-xs sm:text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <Button
                variant="outline"
                className="flex items-center gap-2 text-sm w-full sm:w-auto"
                onClick={() => window.open(project.githubUrl, '_blank')}
              >
                <Github className="h-4 w-4" />
                View on GitHub
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Portfolio;