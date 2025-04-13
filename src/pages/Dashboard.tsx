
import { BarChart3, BookOpen, Code, Github, Target } from "lucide-react";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const { profileData, profileLinks } = useAuth();
  const [leetcodeSolved, setLeetcodeSolved] = useState(0);
  const [githubContributions, setGithubContributions] = useState(0);
  const [leetcodeTrend, setLeetcodeTrend] = useState({ value: 0, positive: true });
  const [githubTrend, setGithubTrend] = useState({ value: 0, positive: true });

  useEffect(() => {
    if (profileData?.leetcode) {
      setLeetcodeSolved(profileData.leetcode.totalSolved);
      // Calculate trend based on acceptance rate
      const trend = profileData.leetcode.acceptanceRate;
      setLeetcodeTrend({ value: Math.round(trend), positive: trend > 50 });
    }

    if (profileData?.github?.contributions) {
      setGithubContributions(profileData.github.contributions.totalContributions);
      // Calculate trend based on last year's contributions
      const yearlyTrend = (profileData.github.contributions.lastYearContributions / profileData.github.contributions.totalContributions) * 100;
      setGithubTrend({ value: Math.round(yearlyTrend), positive: yearlyTrend > 30 });
    }
  }, [profileData]);
  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-400">
          Track your coding progress and stay organized.
        </p>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="LeetCode Problems" 
          value={leetcodeSolved}
          icon={<Code size={20} />}
          trend={leetcodeTrend}
        />
        <StatCard 
          title="GitHub Contributions" 
          value={githubContributions}
          icon={<Github size={20} />}
          trend={githubTrend}
        />
        <StatCard 
          title="Notes Created" 
          value="24"
          icon={<BookOpen size={20} />}
          trend={{ value: 5, positive: true }}
        />
        <StatCard 
          title="Goals Completed" 
          value="7"
          icon={<Target size={20} />}
          trend={{ value: 2, positive: false }}
        />
      </div>
      
      {/* Recent Activity */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="glass-card p-6">
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className={`p-2 rounded-full ${activity.iconBg}`}>
                  {activity.icon}
                </div>
                <div>
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {actions.map((action, index) => (
            <div key={index} className="glass-card p-6">
              <div className={`p-3 rounded-full w-max ${action.iconBg} mb-4`}>
                {action.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2">{action.title}</h3>
              <p className="text-gray-400 mb-4">{action.description}</p>
              <Button asChild variant={action.primary ? "default" : "outline"} className={action.primary ? "bg-sypher-accent hover:bg-sypher-accent/90" : ""}>
                <Link to={action.path}>{action.buttonText}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Sample data
const activities = [
  {
    icon: <Code size={18} />,
    iconBg: "bg-blue-500/20 text-blue-500",
    title: "Solved 'Two Sum' on LeetCode",
    time: "Today, 10:30 AM"
  },
  {
    icon: <Github size={18} />,
    iconBg: "bg-purple-500/20 text-purple-500",
    title: "3 contributions to GitHub",
    time: "Yesterday"
  },
  {
    icon: <BookOpen size={18} />,
    iconBg: "bg-green-500/20 text-green-500",
    title: "Created note on 'Dynamic Programming'",
    time: "2 days ago"
  },
  {
    icon: <Target size={18} />,
    iconBg: "bg-amber-500/20 text-amber-500",
    title: "Completed weekly goal",
    time: "3 days ago"
  },
];

const actions = [
  {
    title: "Take Notes",
    description: "Create and organize your study materials and code snippets.",
    icon: <BookOpen size={20} />,
    iconBg: "bg-green-500/20 text-green-500",
    buttonText: "Create Note",
    path: "/notes/new",
    primary: true,
  },
  {
    title: "Set Goals",
    description: "Set daily or weekly coding goals to stay motivated.",
    icon: <Target size={20} />,
    iconBg: "bg-amber-500/20 text-amber-500",
    buttonText: "Set Goal",
    path: "/goals",
    primary: false,
  },
  {
    title: "View Stats",
    description: "Track your progress across different coding platforms.",
    icon: <BarChart3 size={20} />,
    iconBg: "bg-blue-500/20 text-blue-500",
    buttonText: "View Stats",
    path: "/dashboard/stats",
    primary: false,
  },
];

export default Dashboard;
