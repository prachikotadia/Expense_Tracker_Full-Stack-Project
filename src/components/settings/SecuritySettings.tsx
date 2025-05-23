
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ShieldCheck, Key, Lock, Clock, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SecuritySettings = () => {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [showSessionManagement, setShowSessionManagement] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const { toast } = useToast();

  const handleChangePassword = () => {
    toast({
      title: "Password Updated",
      description: "Your password has been successfully changed"
    });
    setShowChangePassword(false);
  };

  const handleToggle2FA = (enabled: boolean) => {
    setTwoFactorEnabled(enabled);
    toast({
      title: enabled ? "2FA Enabled" : "2FA Disabled",
      description: enabled 
        ? "Two-factor authentication has been enabled for your account" 
        : "Two-factor authentication has been disabled"
    });
    setShowTwoFactor(false);
  };

  const handleExportData = () => {
    toast({
      title: "Data Export Started",
      description: "Your financial data is being prepared for download"
    });
    
    // Simulate download preparation
    setTimeout(() => {
      toast({
        title: "Data Ready",
        description: "Your financial data is ready to download"
      });
    }, 2000);
  };

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <div className="flex items-center">
          <ShieldCheck className="mr-2 h-5 w-5 text-primary" />
          <CardTitle className="text-xl font-bold">Security & Privacy</CardTitle>
        </div>
        <CardDescription>
          Manage your account security and privacy settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Password Section */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Key className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Password</h3>
          </div>
          <div className="flex items-center justify-between bg-muted/20 p-3 rounded-lg border">
            <div className="space-y-1">
              <div className="font-medium">Change Password</div>
              <div className="text-sm text-muted-foreground">Update your account password</div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowChangePassword(true)}
              className="hover:bg-primary/10 transition-all duration-200"
            >
              Update
            </Button>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Two-Factor Authentication</h3>
          </div>
          <div className="flex items-center justify-between bg-muted/20 p-3 rounded-lg border">
            <div className="space-y-1">
              <div className="font-medium">2FA {twoFactorEnabled ? "(Enabled)" : "(Disabled)"}</div>
              <div className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </div>
            </div>
            <Button 
              variant="outline"
              onClick={() => setShowTwoFactor(true)}
              className="hover:bg-primary/10 transition-all duration-200"
            >
              Configure
            </Button>
          </div>
        </div>

        {/* Session Management */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Session Management</h3>
          </div>
          <div className="flex items-center justify-between bg-muted/20 p-3 rounded-lg border">
            <div className="space-y-1">
              <div className="font-medium">Active Sessions</div>
              <div className="text-sm text-muted-foreground">Manage devices where you're logged in</div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowSessionManagement(true)}
              className="hover:bg-primary/10 transition-all duration-200"
            >
              View
            </Button>
          </div>
        </div>

        {/* Data Export */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Download className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Data Export</h3>
          </div>
          <div className="flex items-center justify-between bg-muted/20 p-3 rounded-lg border">
            <div className="space-y-1">
              <div className="font-medium">Export Your Data</div>
              <div className="text-sm text-muted-foreground">Download all your financial data</div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleExportData}
              className="hover:bg-primary/10 transition-all duration-200"
            >
              Export
            </Button>
          </div>
        </div>
      </CardContent>

      {/* Change Password Dialog */}
      <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new one
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input id="confirm-password" type="password" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowChangePassword(false)}>Cancel</Button>
            <Button 
              onClick={handleChangePassword}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300"
            >
              Update Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Two-Factor Authentication Dialog */}
      <Dialog open={showTwoFactor} onOpenChange={setShowTwoFactor}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              Add an extra layer of security to your account
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="2fa-toggle">Enable Two-Factor Authentication</Label>
              <Switch 
                id="2fa-toggle"
                checked={twoFactorEnabled}
                onCheckedChange={handleToggle2FA}
              />
            </div>
            {twoFactorEnabled && (
              <div className="mt-4 border rounded-md p-4">
                <p className="text-sm mb-4">Scan this QR code with your authenticator app:</p>
                <div className="flex justify-center">
                  {/* Placeholder for QR code */}
                  <div className="w-40 h-40 bg-muted flex items-center justify-center">
                    QR Code
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowTwoFactor(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Session Management Dialog */}
      <Dialog open={showSessionManagement} onOpenChange={setShowSessionManagement}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Active Sessions</DialogTitle>
            <DialogDescription>
              Manage devices where you are currently logged in
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-md bg-muted/10">
                <div>
                  <div className="font-medium">Current Device</div>
                  <div className="text-xs text-muted-foreground">Last active: Just now</div>
                </div>
                <Button variant="ghost" size="sm" disabled>This Device</Button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <div className="font-medium">iPhone 13</div>
                  <div className="text-xs text-muted-foreground">Last active: 2 days ago</div>
                </div>
                <Button variant="ghost" size="sm">Log Out</Button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <div className="font-medium">MacBook Pro</div>
                  <div className="text-xs text-muted-foreground">Last active: 5 hours ago</div>
                </div>
                <Button variant="ghost" size="sm">Log Out</Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="destructive" size="sm">Log Out From All Devices</Button>
            <Button onClick={() => setShowSessionManagement(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default SecuritySettings;
