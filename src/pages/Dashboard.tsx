
import { BarChart3, BookOpen, Code, Github, Target } from "lucide-react";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const { profileData, profileLinks } = useAuth();
  const [leetcodeStats, setLeetcodeStats] = useState({
    easySolved: 0,
    totalEasy: 0,
    mediumSolved: 0,
    totalMedium: 0,
    hardSolved: 0,
    totalHard: 0,
    acceptanceRate: 0,
    ranking: 0,
    contributionPoints: 0
  });
  const [githubContributions, setGithubContributions] = useState(0);
  const [githubTrend, setGithubTrend] = useState({ value: 0, positive: true });
  const [recentActivities, setRecentActivities] = useState<Array<{
    icon: JSX.Element;
    iconBg: string;
    title: string;
    time: string;
  }>>([]);

  useEffect(() => {
    console.log('Profile Data Updated:', profileData);

    if (profileData?.leetcode) {
      // console.log('LeetCode Data:', profileData.leetcode);
      setLeetcodeStats({
        easySolved: profileData.leetcode.easySolved || 0,
        totalEasy: profileData.leetcode.totalEasy || 0,
        mediumSolved: profileData.leetcode.mediumSolved || 0,
        totalMedium: profileData.leetcode.totalMedium || 0,
        hardSolved: profileData.leetcode.hardSolved || 0,
        totalHard: profileData.leetcode.totalHard || 0,
        acceptanceRate: profileData.leetcode.acceptanceRate || 0,
        ranking: profileData.leetcode.ranking || 0,
        contributionPoints: profileData.leetcode.contributionPoints || 0
      });
    }

    if (profileData?.github?.contributions) {
      // console.log('GitHub Data:', profileData.github);
      setGithubContributions(profileData.github.contributions.totalContributions);
      const yearlyTrend = (profileData.github.contributions.lastYearContributions / profileData.github.contributions.totalContributions) * 100;
      setGithubTrend({ value: Math.round(yearlyTrend), positive: yearlyTrend > 30 });

      // Update activities with GitHub contributions
      const githubActivity = {
        icon: <Github size={18} />,
        iconBg: "bg-purple-500/20 text-purple-500",
        title: `${profileData.github.contributions.lastYearContributions} contributions to GitHub`,
        time: "Last year"
      };
      
      const newActivities = [githubActivity];

      // Add LeetCode activities if available
      if (profileData.leetcode) {
        const leetcodeActivity = {
          icon: <Code size={18} />,
          iconBg: "bg-blue-500/20 text-blue-500",
          title: `Solved ${profileData.leetcode.totalSolved} problems on LeetCode`,
          time: "Total Progress"
        };
        newActivities.push(leetcodeActivity);

        // Add acceptance rate activity if it's good
        if (profileData.leetcode.acceptanceRate > 60) {
          newActivities.push({
            icon: <Target size={18} />,
            iconBg: "bg-green-500/20 text-green-500",
            title: `Achieved ${profileData.leetcode.acceptanceRate.toFixed(1)}% acceptance rate`,
            time: "LeetCode Achievement"
          });
        }
      }

      setRecentActivities(newActivities);
    }
  }, [profileData]);
  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-400">
          Track your coding progress and stay organized.
        </p>
      </div>
      
      {/* LeetCode Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">LeetCode Progress</h2>
        <div className="">
          {/* Problem Solving Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
            <StatCard 
              title="Easy Problems" 
              value={leetcodeStats.easySolved.toString()}
              icon={<Code size={20} />}
              className="glass-card hover:border-sypher-accent/50 transition-colors"

            />
            <StatCard 
              title="Medium Problems" 
              value={leetcodeStats.mediumSolved.toString()}
              className="glass-card hover:border-sypher-accent/50 transition-colors"
              icon={<Code size={20} />}
            />
            <StatCard 
              title="Hard Problems" 
              value={leetcodeStats.hardSolved.toString()}
              className="glass-card hover:border-sypher-accent/50 transition-colors"
              icon={<Code size={20} />}
            />
          </div>

          {/* Additional LeetCode Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard 
              title="Acceptance Rate" 
              value={`${leetcodeStats.acceptanceRate.toFixed(1)}%`}
              icon={<Target size={20} />}
              className="glass-card hover:border-sypher-accent/50 transition-colors"

              trend={{ value: Math.round(leetcodeStats.acceptanceRate), positive: leetcodeStats.acceptanceRate > 50 }}
            />
            <StatCard 
              title="LeetCode Ranking" 
              value={leetcodeStats.ranking.toLocaleString()}
              icon={<BarChart3 size={20} />}
              className="glass-card hover:border-sypher-accent/50 transition-colors"

            />
            <StatCard 
              title="Total Problems Solved" 
              value={(leetcodeStats.easySolved + leetcodeStats.mediumSolved + leetcodeStats.hardSolved).toString()}
              icon={<Target size={20} />}
              className="glass-card hover:border-sypher-accent/50 transition-colors"

            />
          </div>
        </div>
      </div>

      {/* GitHub Stats */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">GitHub Progress</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ">
          <StatCard 
            title="Total Contributions" 
            value={githubContributions}
            icon={<Github size={20} />}
            trend={githubTrend}
            className="glass-card hover:border-sypher-accent/50 transition-colors"
          />
          <StatCard 
            title="Repositories" 
            value={profileData?.github?.public_repos || 0}
            icon={<Github size={20} />}
            className="glass-card hover:border-sypher-accent/50 transition-colors"
          />
          <StatCard 
            title="Followers" 
            value={profileData?.github?.followers || 0}
            icon={<Github size={20} />}
            className="glass-card hover:border-sypher-accent/50 transition-colors"
          />
          <StatCard 
            title="Following" 
            value={profileData?.github?.following || 0}
            icon={<Github size={20} />}
            className="glass-card hover:border-sypher-accent/50 transition-colors"
          />
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="mb-8 ">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="glass-card p-6  hover:border-sypher-accent/50 transition-colors">
          <div className="space-y-4 ">
            {recentActivities.map((activity, index) => (
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
      {/* <div>
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
      </div> */}
    </div>
  );
};



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
