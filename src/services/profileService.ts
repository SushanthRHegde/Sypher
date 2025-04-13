import axios from 'axios';

interface GitHubProfile {
  login: string;
  name: string;
  public_repos: number;
  followers: number;
  following: number;
  avatar_url: string;
  bio: string;
  contributions: {
    totalContributions: number;
    lastYearContributions: number;
  };
}

interface LeetCodeProfile {
  totalEasy: number;
  totalMedium: number;
  totalHard: number;
  contributionPoints: number;
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
  projects: any[];
  skills: any[];
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
    // Fetch basic profile data
    const profileResponse = await axios.get(`https://api.github.com/users/${username}`);
    
    // Fetch public events to estimate contributions
    const eventsResponse = await axios.get(`https://api.github.com/users/${username}/events/public`);
    
    // Count events in the last year as an estimate of contributions
    const now = Date.now();
    const oneYearAgo = now - 365 * 24 * 60 * 60 * 1000;
    
    const allEvents = eventsResponse.data.length;
    const lastYearEvents = eventsResponse.data.filter(
      (event: any) => new Date(event.created_at).getTime() > oneYearAgo
    ).length;

    return {
      ...profileResponse.data,
      contributions: {
        totalContributions: allEvents,
        lastYearContributions: lastYearEvents
      }
    };
  } catch (error) {
    console.error('Error fetching GitHub profile:', error);
    return null;
  }
};

// Fetch LeetCode Profile
export const fetchLeetCodeProfile = async (username: string): Promise<LeetCodeProfile | null> => {
  try {
    // Using LeetCode's public API endpoint
    const response = await axios.get(`https://leetcode-stats-api.herokuapp.com/${username}`);
    
    if (response.status !== 200) {
      throw new Error('User not found');
    }

    const data = response.data;
    
    if (!data) {
      throw new Error('Failed to fetch LeetCode profile');
    }

    return {
      username: username,
      totalEasy: data.totalEasy || 0,
      totalMedium: data.totalMedium || 0,
      totalHard: data.totalHard || 0,
      contributionPoints: data.contributionPoints || 0,
      totalSolved: data.totalSolved || 0,
      totalQuestions: data.totalQuestions || 0,
      easySolved: data.easySolved || 0,
      mediumSolved: data.mediumSolved || 0,
      hardSolved: data.hardSolved || 0,
      acceptanceRate: data.acceptanceRate || 0,
      ranking: data.ranking || 0
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