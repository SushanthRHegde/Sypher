import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Github, Code2, Award, Share2, Palette, Plus, X, Link as LinkIcon, Edit } from 'lucide-react';
import ProfileLinksDialog from '@/components/auth/ProfileLinksDialog';
import SkillDialog from '@/components/portfolio/SkillDialog';
import ProjectDialog from '@/components/portfolio/ProjectDialog';
import CertificateDialog from '@/components/portfolio/CertificateDialog';
import BioDialog from '@/components/portfolio/BioDialog';

interface Project {
  name: string;
  description: string;
  techStack: string[];
  githubUrl: string;
}

interface Certificate {
  name: string;
  organization: string;
  issueDate: string;
  verificationUrl: string;
}

const Portfolio = () => {
  const { user, profileData, updateSkills, updateProfileLinks, updateProjects, updateCertificates, updateBio } = useAuth();
  const [isPublic, setIsPublic] = useState(true);
  const [showSkillDialog, setShowSkillDialog] = useState(false);
  const [showLinksDialog, setShowLinksDialog] = useState(false);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [showCertificateDialog, setShowCertificateDialog] = useState(false);
  const [showBioDialog, setShowBioDialog] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', level: '' });
  const [newProject, setNewProject] = useState<Project>({
    name: '',
    description: '',
    techStack: [],
    githubUrl: ''
  });
  const [newTechStack, setNewTechStack] = useState('');
  const [newCertificate, setNewCertificate] = useState<Certificate>({
    name: '',
    organization: '',
    issueDate: '',
    verificationUrl: ''
  });

  const [links, setLinks] = useState({
    github: profileData?.github?.login || '',
    leetcode: profileData?.leetcode?.username || ''
  });

  const handleAddSkill = async () => {
    if (newSkill.name && newSkill.level) {
      const currentSkills = profileData?.skills || [];
      const updatedSkills = [...currentSkills, newSkill];
      await updateSkills(updatedSkills);
      setNewSkill({ name: '', level: '' });
      setShowSkillDialog(false);
    }
  };

  const handleRemoveSkill = async (skillName: string) => {
    const currentSkills = profileData?.skills || [];
    const updatedSkills = currentSkills.filter(skill => skill.name !== skillName);
    await updateSkills(updatedSkills);
  };

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

  const skills = profileData?.skills || [];

  const projects = profileData?.projects || [];
  const certificates = profileData?.certificates || [];

  const handleAddCertificate = async () => {
    if (newCertificate.name && newCertificate.organization && newCertificate.issueDate && newCertificate.verificationUrl) {
      const currentCertificates = profileData?.certificates || [];
      const updatedCertificates = [...currentCertificates, newCertificate];
      await updateCertificates(updatedCertificates);
      setNewCertificate({
        name: '',
        organization: '',
        issueDate: '',
        verificationUrl: ''
      });
      setShowCertificateDialog(false);
    }
  };

  const handleRemoveCertificate = async (certificateName: string) => {
    const currentCertificates = profileData?.certificates || [];
    const updatedCertificates = currentCertificates.filter(cert => cert.name !== certificateName);
    await updateCertificates(updatedCertificates);
  };

  const handleAddProject = async () => {
    if (newProject.name && newProject.description && newProject.techStack.length > 0 && newProject.githubUrl) {
      const currentProjects = profileData?.projects || [];
      const updatedProjects = [...currentProjects, newProject];
      await updateProjects(updatedProjects);
      setNewProject({
        name: '',
        description: '',
        techStack: [],
        githubUrl: ''
      });
      setShowProjectDialog(false);
    }
  };

  const handleAddTechStack = () => {
    if (newTechStack && !newProject.techStack.includes(newTechStack)) {
      setNewProject(prev => ({
        ...prev,
        techStack: [...prev.techStack, newTechStack]
      }));
      setNewTechStack('');
    }
  };

  const handleRemoveTechStack = (tech: string) => {
    setNewProject(prev => ({
      ...prev,
      techStack: prev.techStack.filter(t => t !== tech)
    }));
  };

  const handleRemoveProject = async (projectName: string) => {
    const currentProjects = profileData?.projects || [];
    const updatedProjects = currentProjects.filter(project => project.name !== projectName);
    await updateProjects(updatedProjects);
  };

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
            onClick={() => setShowBioDialog(true)}
            className="flex items-center gap-2 text-sm"
          >
            <Edit className="h-4 w-4" />
            Edit Bio
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowLinksDialog(true)}
            className="flex items-center gap-2 text-sm"
          >
            <LinkIcon className="h-4 w-4" />
            Edit Links
          </Button>
        </div>
      </div>

      {/* Profile Section */}
      <Card className="glass-card p-4 sm:p-6 mb-6 sm:mb-8">
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
            <div className="relative max-w-[600px] mx-auto sm:mx-0">
              <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                {profileData?.bio || ''}
              </p>
            </div>
            <div className="flex gap-1 justify-center sm:justify-start ">
              {profileData?.github?.login && (
                <Button
                  variant="outline"
                  className="flex items-center gap-2 text-sm "
                  onClick={() => window.open(`https://github.com/${profileData.github.login}`, '_blank')}
                >
                  <Github className="h-4 w-4" />
                  {profileData.github.login}
                </Button>
              )}
              {profileData?.leetcode?.username && (
                <Button
                  variant="outline"
                  className="flex items-center gap-2 text-sm"
                  onClick={() => window.open(`https://leetcode.com/${profileData.leetcode.username}`, '_blank')}
                >
                  <Code2 className="h-4 w-4" />
                  {profileData.leetcode.username}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card className="glass-card p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-4">LeetCode Statistics</h3>
          <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center">
            <div className="p-2 rounded-lg bg-green-500/10">
              <div className="text-xl sm:text-2xl font-bold text-green-500">{stats.leetcode.easyCount}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Easy</div>
            </div>
            <div className="p-2 rounded-lg bg-yellow-500/10">
              <div className="text-xl sm:text-2xl font-bold text-yellow-500">{stats.leetcode.mediumCount}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Medium</div>
            </div>
            <div className="p-2 rounded-lg bg-red-500/10">
              <div className="text-xl sm:text-2xl font-bold text-red-500">{stats.leetcode.hardCount}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Hard</div>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-4">GitHub Activity</h3>
          <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center">
            <div className="p-2 rounded-lg bg-sypher-accent/10">
              <div className="text-xl sm:text-2xl font-bold text-sypher-accent">{stats.github.repositories}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Repositories</div>
            </div>
            <div className="p-2 rounded-lg bg-sypher-accent/10">
              <div className="text-xl sm:text-2xl font-bold text-sypher-accent">{stats.github.followers} </div>
              <div className="text-xs sm:text-sm text-muted-foreground">Followers</div>
            </div>
            <div className="p-2 rounded-lg bg-sypher-accent/10">
              <div className="text-xl sm:text-2xl font-bold text-sypher-accent">{stats.github.stars}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Stars</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Skills Section */}
      <Card className="glass-card p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg sm:text-xl font-semibold">Skills & Expertise</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSkillDialog(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Skill
          </Button>
        </div>
        <div className=" grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {skills.map((skill) => (
            <div key={skill.name} className="glass-card p-3 sm:p-4 border rounded-lg bg-card/50 relative group hover:shadow-lg hover:shadow-sypher-accent/20 transition-all duration-300 animate-glow">
              <button
                onClick={() => handleRemoveSkill(skill.name)}
                className="absolute top-2 right-2 p-1 rounded-full opacity-0 group-hover:opacity-70 hover:opacity-100 hover:bg-destructive/20 transition-all"
              >
                <X className="h-4 w-4 text-destructive" />
              </button>
              <div>
                <div className="font-semibold text-sm sm:text-base">{skill.name}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">{skill.level}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <SkillDialog
        isOpen={showSkillDialog}
        onClose={() => setShowSkillDialog(false)}
        onSave={handleAddSkill}
      />

      <ProfileLinksDialog
        isOpen={showLinksDialog}
        onClose={() => setShowLinksDialog(false)}
        onSave={async (links) => {
          await updateProfileLinks(links);
          setShowLinksDialog(false);
        }}
        initialLinks={{
          github: profileData?.github?.login || '',
          leetcode: profileData?.leetcode?.username || '',
          hackerrank: ''
        }}
      />

      {/* Projects Section */}
      <Card className="glass-card p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg sm:text-xl font-semibold">Featured Projects</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowProjectDialog(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Project
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {projects.map((project) => (
            <div key={project.name} className="glass-card border p-3 sm:p-4 relative group">
              <button
                onClick={() => handleRemoveProject(project.name)}
                className="absolute top-2 right-2 p-1 rounded-full opacity-0 group-hover:opacity-70 hover:opacity-100 hover:bg-destructive/20 transition-all"
              >
                <X className="h-4 w-4 text-destructive" />
              </button>
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

      {/* Certifications Section */}
      <Card className="glass-card p-4 sm:p-6 mb-6 sm:mb-8 mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg sm:text-xl font-semibold">Certifications</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCertificateDialog(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Certificate
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {certificates.map((certificate) => (
            <div key={certificate.name} className="glass-card border p-3 sm:p-4 relative group">
              <button
                onClick={() => handleRemoveCertificate(certificate.name)}
                className="absolute top-2 right-2 p-1 rounded-full opacity-0 group-hover:opacity-70 hover:opacity-100 hover:bg-destructive/20 transition-all"
              >
                <X className="h-4 w-4 text-destructive" />
              </button>
              <h4 className="text-base sm:text-lg font-semibold mb-2">{certificate.name}</h4>
              <p className="text-sm text-muted-foreground mb-2">{certificate.organization}</p>
              <p className="text-xs text-muted-foreground mb-3">{certificate.issueDate}</p>
              <Button
                variant="outline"
                className="flex items-center gap-2 text-sm w-full sm:w-auto"
                onClick={() => window.open(certificate.verificationUrl, '_blank')}
              >
                <Award className="h-4 w-4" />
                Verify Certificate
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <CertificateDialog
        isOpen={showCertificateDialog}
        onClose={() => setShowCertificateDialog(false)}
        onSave={handleAddCertificate}
      />

      <ProjectDialog
        isOpen={showProjectDialog}
        onClose={() => setShowProjectDialog(false)}
        onSave={handleAddProject}
      />

      <BioDialog
        isOpen={showBioDialog}
        onClose={() => setShowBioDialog(false)}
        onSave={async (bio) => {
          await updateBio({ text: bio });
          setShowBioDialog(false);
        }}
        initialBio={profileData?.bio}
      />
    </div>
  );
};

export default Portfolio;