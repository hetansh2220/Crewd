'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { usePrivy } from '@privy-io/react-auth';
import { useState, useEffect } from 'react';
import { GetUserByWallet, UpdateUser } from '@/server/user';
import { toast } from 'sonner';
import { X } from 'lucide-react';

export default function SettingsPage() {
  const { user: privyUser, authenticated } = usePrivy();
  const [user, setUser] = useState<any>(null);
  const [editedUser, setEditedUser] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch user from wallet when authenticated
  useEffect(() => {
    const fetchUser = async () => {
      if (!authenticated || !privyUser?.wallet?.address) return;
      const data = await GetUserByWallet(privyUser.wallet.address);
      setUser(data);
      setEditedUser(data);
    };
    fetchUser();
  }, [authenticated, privyUser]);

  const handleSave = async () => {
    if (!editedUser || !editedUser.id) return;
    try {
      setIsSaving(true);
      const updated = await UpdateUser(
        editedUser.id,
        editedUser.username,
        editedUser.bio
      );

      if (updated) {
        setUser(editedUser);
        toast.success('Profile updated successfully!');
      } else {
        toast.error('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Something went wrong while updating your profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-84px)] bg-background text-muted-foreground">
        Loading your profile...
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-84px)] flex bg-background text-foreground overflow-hidden transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border p-6 space-y-8 hidden md:block bg-card/30 backdrop-blur-xl">
        <div className="space-y-4">
          <h2 className="text-muted-foreground text-xs font-semibold">My Profile</h2>
          <nav className="space-y-2">
            <p className="text-sm font-medium cursor-pointer text-foreground hover:text-primary transition-colors">
              Profile Settings
            </p>
          </nav>
        </div>

        <Separator />

        <div className="space-y-4">
          <h2 className="text-muted-foreground text-xs font-semibold">Wallet</h2>
          <nav className="space-y-2">
            <p className="text-sm font-medium cursor-pointer text-foreground hover:text-primary transition-colors">
              Withdraw
            </p>
            <p className="text-sm text-muted-foreground cursor-pointer hover:text-primary transition-colors">
              Deposit
            </p>
            <p className="text-sm text-muted-foreground cursor-pointer hover:text-primary transition-colors">
              Export Private Key
            </p>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-8 bg-background transition-colors duration-300">
        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold">PROFILE SETTINGS</h1>
          <p className="text-sm text-muted-foreground">
            Update your profile information below.
          </p>

          <Separator />

          {/* Profile Avatar */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 ring-2 ring-border">
              <AvatarImage src={user?.avatar || '/avatar.png'} alt={user?.username || 'User'} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>

          <Separator />

          {/* Username */}
          <div className="space-y-2">
            <Label>Username</Label>
            <Input
              value={editedUser?.username || ''}
              onChange={(e) =>
                setEditedUser({ ...editedUser, username: e.target.value })
              }
              className="bg-card border-border text-foreground focus-visible:ring-primary/20"
            />
          </div>

          {/* Short Bio */}
          <div className="space-y-2">
            <Label>Short Bio</Label>
            <p className="text-xs text-muted-foreground">
              Appears on your profile and cards
            </p>
            <Input
              value={editedUser?.bio || ''}
              onChange={(e) =>
                setEditedUser({ ...editedUser, bio: e.target.value })
              }
              className="bg-card border-border text-foreground focus-visible:ring-primary/20"
            />
          </div>

          {/* About Me */}
          <div className="space-y-2">
            <Label>About Me</Label>
            <Textarea
              value={editedUser?.about || ''}
              onChange={(e) =>
                setEditedUser({ ...editedUser, about: e.target.value })
              }
              placeholder="Appears on your profile About section"
              className="bg-card border-border text-foreground focus-visible:ring-primary/20 min-h-[120px]"
            />
          </div>

          {/* Socials */}
          <div className="space-y-2">
            <Label>Socials</Label>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-border px-3 py-2 rounded-lg w-full bg-card">
                <X className="h-4 w-4 text-muted-foreground mr-2" />
                <Input
                  value={editedUser?.xHandle || ''}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, xHandle: e.target.value })
                  }
                  className="border-none bg-transparent focus-visible:ring-0 text-foreground"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Verify social profiles to make your profile more legitimate and discoverable.
            </p>
          </div>
          
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="mt-4"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}