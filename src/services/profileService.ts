import axios from 'axios';

interface GitHubProfile {
  login: string;
  name: string;
  public_repos: number;
  followers: number;
  following: number;
  avatar_url: string;
  bio: string;
}

interface LeetCodeProfile {
  username: string;
  totalSolved: number;
  totalQuestions: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  acceptanceRate: number;
  ranking: number;
}

export interface ProfileData {
  github?: GitHubProfile;
  leetcode?: LeetCodeProfile;
  error?: {
    github?: string;
    leetcode?: string;
  };
}

// Fetch GitHub Profile
export const fetchGitHubProfile = async (username: string): Promise<GitHubProfile | null> => {
  try {
    const response = await axios.get(`https://api.github.com/users/${username}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching GitHub profile:', error);
    return null;
  }
};

// Fetch LeetCode Profile
export const fetchLeetCodeProfile = async (username: string): Promise<LeetCodeProfile | null> => {
  try {
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
          profile {
            ranking
            acceptanceRate
          }
          submitStats {
            acSubmissionNum {
              difficulty
              count
            }
            totalSubmissionNum {
              difficulty
              count
            }
          }
          problemsSolvedBeatsStats {
            difficulty
            percentage
          }
        }
        allQuestionsCount {
          difficulty
          count
        }
      }
    `;

    const variables = { username };

    const response = await axios.post('https://leetcode.com/graphql', {
      query,
      variables,
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com',
      }
    });

    const data = response.data.data;
    if (!data || !data.matchedUser) {
      throw new Error('User not found');
    }

    const { matchedUser, allQuestionsCount } = data;
    const { profile, submitStats } = matchedUser;

    const totalQuestions = allQuestionsCount.reduce(
      (total: number, curr: any) => total + curr.count,
      0
    );

    const solvedStats = submitStats.acSubmissionNum.reduce(
      (acc: any, stat: any) => {
        acc[stat.difficulty.toLowerCase()] = stat.count;
        acc.total += stat.count;
        return acc;
      },
      { total: 0, easy: 0, medium: 0, hard: 0 }
    );

    return {
      username: matchedUser.username,
      totalSolved: solvedStats.total,
      totalQuestions,
      easySolved: solvedStats.easy,
      mediumSolved: solvedStats.medium,
      hardSolved: solvedStats.hard,
      acceptanceRate: profile.acceptanceRate || 0,
      ranking: profile.ranking || 0,
    };
  } catch (error) {
    console.error('Error fetching LeetCode profile:', error);
    return null;
  }
};

// Fetch All Profiles
export const fetchAllProfiles = async (links: {
  github: string;
  leetcode: string;
}): Promise<ProfileData> => {
  const result: ProfileData = {};

  if (links.github) {
    const githubData = await fetchGitHubProfile(links.github);
    if (githubData) {
      result.github = githubData;
    } else {
      result.error = { ...result.error, github: 'Failed to fetch GitHub profile' };
    }
  }

  if (links.leetcode) {
    const leetcodeData = await fetchLeetCodeProfile(links.leetcode);
    if (leetcodeData) {
      result.leetcode = leetcodeData;
    } else {
      result.error = { ...result.error, leetcode: 'Failed to fetch LeetCode profile' };
    }
  }

  return result;
};