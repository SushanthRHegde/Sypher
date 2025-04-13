
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { auth, onAuthStateChanged, signInWithGoogle, signOut } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import ProfileLinksDialog, { ProfileLinks } from '@/components/auth/ProfileLinksDialog';
import { ProfileData, fetchAllProfiles } from '@/services/profileService';
import { saveProfileData, fetchProfileData } from '@/lib/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  profileLinks: ProfileLinks | null;
  profileData: ProfileData | null;
  googleSignIn: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfileLinks: (links: ProfileLinks) => void;
  updateSkills: (skills: { name: string; level: string }[]) => Promise<void>;
  updateProjects: (projects: { name: string; description: string; techStack: string[]; githubUrl: string }[]) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  profileLinks: null,
  profileData: null,
  googleSignIn: async () => {},
  logout: async () => {},
  updateProfileLinks: () => {},
  updateSkills: async () => {},
  updateProjects: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [profileLinks, setProfileLinks] = useState<ProfileLinks | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const { toast } = useToast();

  const updateProjects = async (projects: { name: string; description: string; techStack: string[]; githubUrl: string }[]) => {
    if (user && profileLinks) {
      try {
        const updatedProfileData = { ...profileData, projects };
        await saveProfileData(user.uid, updatedProfileData, profileLinks);
        setProfileData(updatedProfileData);
        toast({
          title: "Projects updated",
          description: "Your projects have been successfully updated",
        });
      } catch (error) {
        toast({
          title: "Error updating projects",
          description: "Could not update projects",
          variant: "destructive",
        });
      }
    }
  };

  // Load profile data from Firestore
  useEffect(() => {
    const loadProfileData = async () => {
      if (user) {
        const savedData = await fetchProfileData(user.uid);
        if (savedData) {
          setProfileLinks(savedData.profileLinks);
          setProfileData(savedData.profileData);
        }
      }
    };
    loadProfileData();
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const googleSignIn = async () => {
    try {
      const signedInUser = await signInWithGoogle();
      if (signedInUser) {
        toast({
          title: "Successfully signed in",
          description: "Welcome to SYPHER!",
        });
        
        // Check if this user has profile data in Firestore
        const savedData = await fetchProfileData(signedInUser.uid);
        if (!savedData) {
          // Show dialog only for first time users or those without profile data
          setShowProfileDialog(true);
        } else {
          setProfileLinks(savedData.profileLinks);
          setProfileData(savedData.profileData);
        }
      }
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: "Could not sign in with Google",
        variant: "destructive",
      });
    }
  };

  const updateProfileLinks = async (links: ProfileLinks) => {
    if (user) {
      setProfileLinks(links);
      
      // Fetch profile data when links are updated
      const data = await fetchAllProfiles(links);
      setProfileData(data);

      // Save both profile links and data to Firestore
      await saveProfileData(user.uid, data, links);
    }
  };

  const logout = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out",
      });
    } catch (error) {
      toast({
        title: "Sign out failed",
        description: "Could not sign out",
        variant: "destructive",
      });
    }
  };

  const updateSkills = async (skills: { name: string; level: string }[]) => {
    if (user && profileLinks) {
      try {
        const updatedProfileData = { ...profileData, skills };
        await saveProfileData(user.uid, updatedProfileData, profileLinks);
        setProfileData(updatedProfileData);
        toast({
          title: "Skills updated",
          description: "Your skills have been successfully updated",
        });
      } catch (error) {
        toast({
          title: "Error updating skills",
          description: "Could not update skills",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, profileLinks, profileData, googleSignIn, logout, updateProfileLinks, updateSkills, updateProjects }}>

      {children}
      {showProfileDialog && (
        <ProfileLinksDialog 
          isOpen={showProfileDialog}
          onClose={() => setShowProfileDialog(false)}
          onSave={updateProfileLinks}
          initialLinks={profileLinks || undefined}
        />
      )}
    </AuthContext.Provider>
  );
};
