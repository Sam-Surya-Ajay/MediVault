import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DoctorLayout from '@/components/layout/DoctorLayout';
import { Calendar, Users, Clock, CheckCircle, XCircle, TrendingUp, Activity } from "lucide-react";
import { appointmentService } from '@/lib/api';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const appts = await appointmentService.getDoctorAppointments();
        setAppointments(appts);

        // Extract unique patients from appointments
        const uniquePatients = Array.from(new Set(appts.map(a => a.patient.id)))
          .map(id => appts.find(a => a.patient.id === id).patient);
        setPatients(uniquePatients);

      } catch (err) {
        // Optionally handle error
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter for today's appointments
  const todayStr = new Date().toISOString().slice(0, 10);
  const todaysAppointments = appointments.filter(a => a.appointmentTime.slice(0, 10) === todayStr);
  const pendingApprovals = appointments.filter(a => a.status === 'PENDING');

  return (
    <DoctorLayout currentPage="dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Welcome Back, Doctor</h2>
          <p className="text-green-100">
            You have {todaysAppointments.length} appointment{todaysAppointments.length !== 1 ? 's' : ''} today and {pendingApprovals.length} pending approval{pendingApprovals.length !== 1 ? 's' : ''}.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-900">Today's Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">{todaysAppointments.length}</div>
              <p className="text-xs text-gray-600">
                {todaysAppointments.length > 0
                  ? `Next: ${new Date(todaysAppointments[0].appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                  : 'No appointments'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-900">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">{patients.length}</div>
              <p className="text-xs text-gray-600">+{patients.length} this month</p>
            </CardContent>
          </Card>

          <Card className="border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-900">Pending Approvals</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-700">{pendingApprovals.length}</div>
              <p className="text-xs text-gray-600">Requires attention</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-900">Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700">94%</div>
              <p className="text-xs text-gray-600">Patient satisfaction</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Appointment Approvals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <span>Pending Approvals</span>
              </CardTitle>
              <CardDescription>Appointment requests awaiting your approval</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingApprovals.length === 0 && (
                <div className="text-gray-500">No pending approvals.</div>
              )}
              {pendingApprovals.map(a => (
                <div key={a.id} className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium text-gray-900">{a.patient.name}</p>
                      <p className="text-sm text-gray-600">Requested: {new Date(a.appointmentTime).toLocaleDateString()} at {new Date(a.appointmentTime).toLocaleTimeString()}</p>
                      <p className="text-xs text-gray-500">{a.reason}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-green-600" />
                <span>Recent Activity</span>
              </CardTitle>
              <CardDescription>Your latest patient interactions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {appointments.length === 0 && (
                <div className="text-gray-500">No recent activity.</div>
              )}
              {appointments.map(a => (
                <div key={a.id} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{a.reason}</p>
                    <p className="text-xs text-gray-600">Patient: {a.patient.name}</p>
                  </div>
                  <span className="text-xs text-gray-500">{new Date(a.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>Your appointments for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todaysAppointments.length === 0 && (
                <div className="text-gray-500">No appointments scheduled for today.</div>
              )}
              {todaysAppointments.map(a => (
                <div key={a.id} className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 rounded-full p-2">
                      <Clock className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-green-900">{new Date(a.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {a.patient.name}</p>
                      <p className="text-sm text-gray-600">{a.reason}</p>
                      <p className="text-xs text-gray-500">{a.status === 'CONFIRMED' ? 'Confirmed' : 'Next appointment'}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="text-green-600 border-green-200">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DoctorLayout>
  );
};

export default DoctorDashboard;
