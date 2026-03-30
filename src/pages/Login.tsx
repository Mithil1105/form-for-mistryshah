import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/mistry-shah-logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast({ title: "Login Failed", description: error.message, variant: "destructive" });
    } else {
      navigate("/admin");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="max-w-[400px] w-full">
        <CardHeader className="text-center">
          <img src={logo} alt="Mistry & Shah LLP" className="h-16 mx-auto mb-2 object-contain" />
          <CardTitle className="font-heading text-xl">Admin Login</CardTitle>
          <CardDescription>Sign in to access the applications dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="admin@mistryandshah.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : <Lock size={16} className="mr-2" />}
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
