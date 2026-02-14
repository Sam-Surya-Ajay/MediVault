import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, ArrowLeft, Mail, Lock, User, Phone, Eye, EyeOff, Stethoscope, AlertCircle } from "lucide-react";
import { authService } from "@/lib/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import TestConnection from "@/components/ui/TestConnection";

const SignupForm = ({ userType, onSwitchToLogin, onBack }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    password: '',
    confirmPassword: '',
    // Doctor-specific fields
    specialty: '',
    licenseNumber: '',
    yearsOfExperience: '',
    bio: '',
    clinicName: '',
    clinicLocation: '',
    availableHours: '',
    // Patient-specific fields
    dateOfBirth: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    insuranceProvider: '',
    insuranceNumber: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Prepare data for API
      const userData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        gender: formData.gender,
        role: userType.toUpperCase(),
      };
      
      // Add role-specific fields
      if (userType === 'doctor') {
        userData.specialty = formData.specialty;
        userData.licenseNumber = formData.licenseNumber;
        userData.yearsOfExperience = formData.yearsOfExperience ? parseInt(formData.yearsOfExperience) : 0;
        userData.bio = formData.bio;
        userData.clinicName = formData.clinicName;
        userData.clinicLocation = formData.clinicLocation;
        userData.availableHours = formData.availableHours;
      } else if (userType === 'patient') {
        // Calculate age from date of birth if provided
        if (formData.dateOfBirth) {
          const birthDate = new Date(formData.dateOfBirth);
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          userData.age = age;
        }
        
        // Add patient-specific fields for secondary tables
        userData.patientDetails = {
          insuranceProvider: formData.insuranceProvider,
          insuranceNumber: formData.insuranceNumber,
          emergencyContactName: formData.emergencyContactName,
          emergencyContactPhone: formData.emergencyContactPhone
        };
      }
      
      const response = await authService.register(userData);
      
      // Navigate to the appropriate dashboard
      if (userType === 'patient') {
        navigate('/patient/dashboard');
      } else if (userType === 'doctor') {
        navigate('/doctor/dashboard');
      }
    } catch (err) {
      console.error('Signup error:', err);
      // More detailed error handling
      if (err.response) {
        // The server responded with a status code outside the 2xx range
        setError(`Server error: ${err.response.data.message || JSON.stringify(err.response.data)}`);
      } else if (err.request) {
        // The request was made but no response was received
        setError('No response from server. Please check your network connection or try again later.');
      } else {
        // Something happened in setting up the request
        setError(err.message || 'Registration failed. Please try again.');
      }
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
      <Card className="w-full max-w-xs mx-auto border-2 border-blue-200 shadow-xl rounded-xl py-6 px-4">
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
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl text-blue-900 mb-1">
            Join as {userType === 'patient' ? 'Patient' : 'Doctor'}
          </CardTitle>
          <CardDescription className="text-gray-600 text-base">
            Create your account to get started with MediVault
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
              <Label htmlFor="firstName" className="text-blue-900 font-medium">First Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="pl-10 border-blue-200 focus:border-blue-400 h-12 text-base rounded-lg"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-blue-900 font-medium">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleInputChange}
                className="border-blue-200 focus:border-blue-400 h-12 text-base rounded-lg"
                required
                disabled={isLoading}
              />
            </div>
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
              <Label htmlFor="phone" className="text-blue-900 font-medium">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="pl-10 border-blue-200 focus:border-blue-400 h-12 text-base rounded-lg"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender" className="text-blue-900 font-medium">Gender</Label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full p-2 border rounded border-blue-200 focus:border-blue-400 focus:outline-none h-12 text-base rounded-lg"
                required
                disabled={isLoading}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {userType === 'doctor' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="specialty" className="text-green-800 font-medium">Specialization</Label>
                  <div className="relative">
                    <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="specialty"
                      name="specialty"
                      placeholder="e.g., Cardiology, Pediatrics"
                      value={formData.specialty}
                      onChange={handleInputChange}
                      className="pl-10 border-green-200 focus:border-green-400 h-12 text-base rounded-lg"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber" className="text-green-800 font-medium">Medical License Number</Label>
                  <Input
                    id="licenseNumber"
                    name="licenseNumber"
                    placeholder="Enter your license number"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    className="border-green-200 focus:border-green-400 h-12 text-base rounded-lg"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yearsOfExperience" className="text-green-800 font-medium">Years of Experience</Label>
                  <Input
                    id="yearsOfExperience"
                    name="yearsOfExperience"
                    type="number"
                    min="0"
                    placeholder="Years of medical practice"
                    value={formData.yearsOfExperience}
                    onChange={handleInputChange}
                    className="border-green-200 focus:border-green-400 h-12 text-base rounded-lg"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clinicName" className="text-green-800 font-medium">Clinic Name</Label>
                  <Input
                    id="clinicName"
                    name="clinicName"
                    placeholder="Name of your practice/clinic"
                    value={formData.clinicName}
                    onChange={handleInputChange}
                    className="border-green-200 focus:border-green-400 h-12 text-base rounded-lg"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clinicLocation" className="text-green-800 font-medium">Clinic Location</Label>
                  <Input
                    id="clinicLocation"
                    name="clinicLocation"
                    placeholder="Address of your practice"
                    value={formData.clinicLocation}
                    onChange={handleInputChange}
                    className="border-green-200 focus:border-green-400 h-12 text-base rounded-lg"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-green-800 font-medium">Professional Bio</Label>
                  <textarea
                    id="bio"
                    name="bio"
                    placeholder="Brief professional background"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded border-green-200 focus:border-green-400 focus:outline-none h-12 text-base rounded-lg"
                    rows={3}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="availableHours" className="text-green-800 font-medium">Available Hours</Label>
                  <Input
                    id="availableHours"
                    name="availableHours"
                    placeholder="e.g., Mon-Fri 9AM-5PM"
                    value={formData.availableHours}
                    onChange={handleInputChange}
                    className="border-green-200 focus:border-green-400 h-12 text-base rounded-lg"
                    disabled={isLoading}
                  />
                </div>
              </>
            )}
            {userType === 'patient' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth" className="text-blue-900 font-medium">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="border-blue-200 focus:border-blue-400 h-12 text-base rounded-lg"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactName" className="text-blue-900 font-medium">Emergency Contact Name</Label>
                  <Input
                    id="emergencyContactName"
                    name="emergencyContactName"
                    placeholder="Name of emergency contact person"
                    value={formData.emergencyContactName}
                    onChange={handleInputChange}
                    className="border-blue-200 focus:border-blue-400 h-12 text-base rounded-lg"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactPhone" className="text-blue-900 font-medium">Emergency Contact Phone</Label>
                  <Input
                    id="emergencyContactPhone"
                    name="emergencyContactPhone"
                    placeholder="Phone number of emergency contact"
                    value={formData.emergencyContactPhone}
                    onChange={handleInputChange}
                    className="border-blue-200 focus:border-blue-400 h-12 text-base rounded-lg"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insuranceProvider" className="text-blue-900 font-medium">Insurance Provider</Label>
                  <Input
                    id="insuranceProvider"
                    name="insuranceProvider"
                    placeholder="Your health insurance company"
                    value={formData.insuranceProvider}
                    onChange={handleInputChange}
                    className="border-blue-200 focus:border-blue-400 h-12 text-base rounded-lg"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insuranceNumber" className="text-blue-900 font-medium">Insurance Number</Label>
                  <Input
                    id="insuranceNumber"
                    name="insuranceNumber"
                    placeholder="Your insurance policy number"
                    value={formData.insuranceNumber}
                    onChange={handleInputChange}
                    className="border-blue-200 focus:border-blue-400 h-12 text-base rounded-lg"
                    disabled={isLoading}
                  />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-blue-900 font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 border-blue-200 focus:border-blue-400 h-12 text-base rounded-lg"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-blue-900 font-medium">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="pl-10 border-blue-200 focus:border-blue-400 h-12 text-base rounded-lg"
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              className={`w-full py-2 text-base rounded-lg mt-2 ${
                userType === 'patient' 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Signing Up...' : `Sign Up as ${userType === 'patient' ? 'Patient' : 'Doctor'}`}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-base">
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className={`font-medium hover:underline text-base ${
                  userType === 'patient' ? 'text-blue-600' : 'text-green-600'
                }`}
              >
                Sign in here
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupForm;
