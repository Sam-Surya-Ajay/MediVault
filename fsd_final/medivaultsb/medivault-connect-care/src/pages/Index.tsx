import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UserPlus, LogIn, Heart, Shield, Clock, FileText, ChevronDown } from "lucide-react";
import LoginForm from '@/components/auth/LoginForm.jsx';
import SignupForm from '@/components/auth/SignupForm.jsx';

const Index = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [userType, setUserType] = useState('');

  const handleGetStarted = (type) => {
    setUserType(type);
    setShowSignup(true);
  };

  const handleSignIn = (type) => {
    setUserType(type);
    setShowLogin(true);
  };

  const switchToLogin = () => {
    setShowSignup(false);
    setShowLogin(true);
  };

  const switchToSignup = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  const goBack = () => {
    setShowLogin(false);
    setShowSignup(false);
    setUserType('');
  };

  if (showLogin) {
    return <LoginForm userType={userType} onSwitchToSignup={switchToSignup} onBack={goBack} />;
  }

  if (showSignup) {
    return <SignupForm userType={userType} onSwitchToLogin={switchToLogin} onBack={goBack} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-blue-900">MediVault</h1>
          </div>
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleSignIn('patient')}>
                  <Heart className="h-4 w-4 mr-2 text-blue-600" />
                  Sign in as Patient
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSignIn('doctor')}>
                  <Shield className="h-4 w-4 mr-2 text-green-600" />
                  Sign in as Doctor
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-blue-900 mb-6">
            Your Health Records, <span className="text-green-600">Simplified</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            MediVault brings patients and doctors together in a secure, digital healthcare ecosystem. 
            Manage medical records, schedule appointments, and communicate seamlessly.
          </p>

          {/* Feature Highlights */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-blue-900 mb-2">Secure & Private</h3>
              <p className="text-gray-600">Your medical data is encrypted and protected with enterprise-grade security.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100">
              <Clock className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-800 mb-2">Real-time Updates</h3>
              <p className="text-gray-600">Get instant notifications for appointments, prescriptions, and messages.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-100">
              <FileText className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-purple-800 mb-2">Digital Records</h3>
              <p className="text-gray-600">Store and access all your medical documents in one secure location.</p>
            </div>
          </div>

          {/* User Type Selection */}
          <div className="max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold text-blue-900 mb-8">Choose Your Experience</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 border-blue-200 hover:border-blue-400">
                <CardHeader className="text-center pb-4">
                  <div className="bg-blue-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Heart className="h-10 w-10 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl text-blue-900">I'm a Patient</CardTitle>
                  <CardDescription className="text-gray-600">
                    Manage your health records, schedule appointments, and connect with doctors
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => handleGetStarted('patient')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
                  >
                    <UserPlus className="h-5 w-5 mr-2" />
                    Get Started as Patient
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 border-green-200 hover:border-green-400">
                <CardHeader className="text-center pb-4">
                  <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Shield className="h-10 w-10 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl text-green-800">I'm a Doctor</CardTitle>
                  <CardDescription className="text-gray-600">
                    Manage patient appointments, review medical records, and provide care
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => handleGetStarted('doctor')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
                  >
                    <UserPlus className="h-5 w-5 mr-2" />
                    Get Started as Doctor
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-6 w-6" />
            <span className="text-xl font-semibold">MediVault</span>
          </div>
          <p className="text-blue-200">Secure Healthcare Management Platform</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
