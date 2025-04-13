import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Github, Code, ExternalLink, Loader2 } from 'lucide-react';

const ProfileDashboard = () => {
  const { profileData, profileLinks } = useAuth();

  if (!profileLinks) {
    return null;
  }

  if (!profileData) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-sypher-accent" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* GitHub Stats */}
      {profileData.github && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <Github className="h-4 w-4" />
                GitHub Profile
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profileData.github.name}</div>
            <div className="text-xs text-muted-foreground">@{profileData.github.login}</div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span>Repositories</span>
                <span className="font-medium">{profileData.github.public_repos}</span>
              </div>
              <div className="flex justify-between">
                <span>Followers</span>
                <span className="font-medium">{profileData.github.followers}</span>
              </div>
              <div className="flex justify-between">
                <span>Following</span>
                <span className="font-medium">{profileData.github.following}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* LeetCode Stats */}
      {profileData.leetcode && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                LeetCode Progress
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profileData.leetcode.username}</div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span>Problems Solved</span>
                <span className="font-medium">{profileData.leetcode.totalSolved}</span>
              </div>
              <div className="flex justify-between">
                <span>Acceptance Rate</span>
                <span className="font-medium">{profileData.leetcode.acceptanceRate}%</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="text-center p-2 bg-green-100 rounded-lg">
                  <div className="text-sm font-medium">Easy</div>
                  <div className="text-green-600">{profileData.leetcode.easySolved}</div>
                </div>
                <div className="text-center p-2 bg-yellow-100 rounded-lg">
                  <div className="text-sm font-medium">Medium</div>
                  <div className="text-yellow-600">{profileData.leetcode.mediumSolved}</div>
                </div>
                <div className="text-center p-2 bg-red-100 rounded-lg">
                  <div className="text-sm font-medium">Hard</div>
                  <div className="text-red-600">{profileData.leetcode.hardSolved}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* HackerRank Stats */}
      {/* {profileData.hackerrank && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                HackerRank Achievements
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profileData.hackerrank.name || profileData.hackerrank.username}</div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span>Level</span>
                <span className="font-medium">{profileData.hackerrank.level}</span>
              </div>
              <div className="flex justify-between">
                <span>Badges</span>
                <span className="font-medium">{profileData.hackerrank.badges}</span>
              </div>
              <div className="flex justify-between">
                <span>Certificates</span>
                <span className="font-medium">{profileData.hackerrank.certificates}</span>
              </div>
              {profileData.hackerrank.skills.length > 0 && (
                <div className="mt-4">
                  <div className="text-sm font-medium mb-2">Skills</div>
                  <div className="flex flex-wrap gap-2">
                    {profileData.hackerrank.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )} */}

      {/* Error Messages */}
      {profileData.error && Object.entries(profileData.error).map(([platform, error]) => (
        <Card key={platform} className="border-destructive">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-destructive">{platform} Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};

export default ProfileDashboard;