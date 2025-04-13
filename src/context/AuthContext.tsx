
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { auth, onAuthStateChanged, signInWithGoogle, signOut } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import ProfileLinksDialog, { ProfileLinks } from '@/components/auth/ProfileLinksDialog';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  profileLinks: ProfileLinks | null;
  googleSignIn: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfileLinks: (links: ProfileLinks) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  profileLinks: null,
  googleSignIn: async () => {},
  logout: async () => {},
  updateProfileLinks: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [profileLinks, setProfileLinks] = useState<ProfileLinks | null>(null);
  const { toast } = useToast();

  // Load profile links from localStorage
  useEffect(() => {
    if (user) {
      const savedLinks = localStorage.getItem(`profileLinks_${user.uid}`);
      if (savedLinks) {
        setProfileLinks(JSON.parse(savedLinks));
      }
    }
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
        
        // Check if this user has profile links already
        const savedLinks = localStorage.getItem(`profileLinks_${signedInUser.uid}`);
        if (!savedLinks) {
          // Show dialog only for first time users or those without profile links
          setShowProfileDialog(true);
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

  const updateProfileLinks = (links: ProfileLinks) => {
    if (user) {
      setProfileLinks(links);
      localStorage.setItem(`profileLinks_${user.uid}`, JSON.stringify(links));
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

  return (
    <AuthContext.Provider value={{ user, loading, profileLinks, googleSignIn, logout, updateProfileLinks }}>
      {children}
      {showProfileDialog && (
        <ProfileLinksDialog 
          isOpen={showProfileDialog}
          onClose={() => setShowProfileDialog(false)}
          onSave={updateProfileLinks}
        />
      )}
    </AuthContext.Provider>
  );
};
