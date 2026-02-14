import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, ArrowLeft, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { authService } from "@/lib/api";
import { Alert, AlertDescription } from "@/components/ui/alert";

const LoginForm = ({ userType, onSwitchToSignup, onBack }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await authService.login(formData.email, formData.password);
      
      // Check if user role matches the selected type
      const userRole = response.role.toLowerCase();
      const selectedType = userType.toLowerCase();
      
      if (userRole !== selectedType) {
        setError(`You are registered as a ${userRole}, not as a ${selectedType}`);
        authService.logout(); // Clear any stored token
        setIsLoading(false);
        return;
      }
      
      // Navigate to the appropriate dashboard
      if (userRole === 'patient') {
        navigate('/patient/dashboard');
      } else if (userRole === 'doctor') {
        navigate('/doctor/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm mx-auto">
        {/* Header */}
        <div className="text-center mb-6 relative">
          <Button
            variant="ghost"
            onClick={onBack}
            className="absolute top-0 left-0 text-blue-700 hover:bg-blue-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-blue-900">MediVault</h1>
          </div>
        </div>

        <Card className="border-2 border-blue-200 shadow-xl rounded-xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl text-blue-900 mb-1">
              Welcome Back, {userType === 'patient' ? 'Patient' : 'Doctor'}
            </CardTitle>
            <CardDescription className="text-gray-600 text-base">
              Sign in to access your {userType === 'patient' ? 'health records' : 'practice dashboard'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <Alert variant="destructive" className="bg-red-50 text-red-800 border border-red-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-blue-900 font-medium">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 border-blue-200 focus:border-blue-400 h-12 text-base rounded-lg"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-blue-900 font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 border-blue-200 focus:border-blue-400 h-12 text-base rounded-lg"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className={`w-full py-3 text-lg rounded-lg mt-2 ${
                  userType === 'patient' 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : `Sign In as ${userType === 'patient' ? 'Patient' : 'Doctor'}`}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 text-base">
                Don't have an account?{' '}
                <button
                  onClick={onSwitchToSignup}
                  className={`font-medium hover:underline text-base ${
                    userType === 'patient' ? 'text-blue-600' : 'text-green-600'
                  }`}
                >
                  Sign up here
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;
