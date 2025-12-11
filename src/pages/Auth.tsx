import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Lock, ArrowLeft, Shield, User } from 'lucide-react';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = loginSchema.extend({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
});

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(searchParams.get('signup') === 'true');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/admin');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/admin');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignup) {
        // Validate signup data
        signupSchema.parse(formData);

        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/admin`,
            data: { full_name: formData.fullName }
          }
        });

        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('This email is already registered. Please login instead.');
            setIsSignup(false);
          } else {
            toast.error(error.message);
          }
          return;
        }

        toast.success('Account created! You can now login.');
        setIsSignup(false);
        setFormData({ ...formData, password: '' });
      } else {
        // Validate login data
        loginSchema.parse(formData);

        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Invalid email or password');
          } else {
            toast.error(error.message);
          }
          return;
        }

        toast.success('Welcome back!');
        navigate('/admin');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6">
      {/* Background */}
      <div className="absolute inset-0 tech-grid opacity-20" />
      <div className="absolute top-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 left-1/4 w-56 sm:w-80 h-56 sm:h-80 bg-secondary/10 rounded-full blur-[100px]" />

      <div className="w-full max-w-md relative z-10">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 sm:mb-8 text-muted-foreground hover:text-foreground"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        {/* Auth Card */}
        <div className="bg-card border border-border rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl">
          {/* Logo */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-primary-foreground" />
            </div>
            <h1 className="font-heading text-xl sm:text-2xl font-bold">
              {isSignup ? 'Create Admin Account' : 'Admin Login'}
            </h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              {isSignup ? 'Sign up to create your admin account' : 'Sign in to access the admin panel'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {isSignup && (
              <div>
                <Label htmlFor="fullName" className="text-muted-foreground text-sm">Full Name</Label>
                <div className="relative mt-2">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Your name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="pl-10 h-11 sm:h-12 bg-muted/50 border-border focus:border-primary"
                    required={isSignup}
                  />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="email" className="text-muted-foreground text-sm">Email Address</Label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 h-11 sm:h-12 bg-muted/50 border-border focus:border-primary"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-muted-foreground text-sm">Password</Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 h-11 sm:h-12 bg-muted/50 border-border focus:border-primary"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full h-11 sm:h-12 text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  {isSignup ? 'Creating account...' : 'Signing in...'}
                </span>
              ) : (
                isSignup ? 'Create Account' : 'Sign In'
              )}
            </Button>
          </form>

          {/* Toggle */}
          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}
              <button
                type="button"
                onClick={() => setIsSignup(!isSignup)}
                className="ml-2 text-primary hover:underline font-medium"
              >
                {isSignup ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;