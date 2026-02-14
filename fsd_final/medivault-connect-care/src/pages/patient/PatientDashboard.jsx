import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PatientLayout from '@/components/layout/PatientLayout';
import AddMedicalRecordModal from '@/components/modals/AddMedicalRecordModal';
import AddPrescriptionModal from '@/components/modals/AddPrescriptionModal';
import ScheduleAppointmentModal from '@/components/modals/ScheduleAppointmentModal';
import { Calendar, FileText, Pill, Clock, Plus, TrendingUp, Heart, Activity } from "lucide-react";
import { medicalRecordService, prescriptionService, appointmentService } from '@/lib/api';
import { format } from 'date-fns';

const PatientDashboard = () => {
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const [recordsData, prescriptionsData, appointmentsData] = await Promise.all([
        medicalRecordService.getRecords(),
        prescriptionService.getPatientPrescriptions(),
        appointmentService.getPatientUpcomingAppointments()
      ]);
      setMedicalRecords(recordsData);
      setPrescriptions(prescriptionsData);
      setAppointments(appointmentsData);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // This function can be passed to modals/pages to refresh prescriptions
  const refreshPrescriptions = async () => {
    try {
      const data = await prescriptionService.getPatientPrescriptions();
      setPrescriptions(data);
    } catch (err) {
      // Optionally handle error
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMMM d, yyyy h:mm a');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <PatientLayout currentPage="dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Welcome to Your Health Dashboard</h2>
          <p className="text-blue-100">Stay on top of your health with easy access to your medical information.</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-500">Loading your health data...</p>
          </div>
        ) : (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-blue-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-900">Upcoming Appointments</CardTitle>
                  <Calendar className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-700">{appointments.length}</div>
                  {appointments.length > 0 && (
                    <p className="text-xs text-gray-600">
                      Next: {format(new Date(appointments[0].appointmentTime), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-green-900">Active Prescriptions</CardTitle>
                  <Pill className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-700">{prescriptions.length}</div>
                  {prescriptions.length > 0 && (
                    <p className="text-xs text-gray-600">Latest: {prescriptions[0].medication}</p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-purple-900">Medical Records</CardTitle>
                  <FileText className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-700">{medicalRecords.length}</div>
                  {medicalRecords.length > 0 && (
                    <p className="text-xs text-gray-600">
                      Last updated: {format(new Date(medicalRecords[0].uploadedAt), 'MMM d, yyyy')}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-orange-900">Health Score</CardTitle>
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-700">--</div>
                  <p className="text-xs text-gray-600">Health score coming soon</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    <span>Recent Activity</span>
                  </CardTitle>
                  <CardDescription>Your latest health updates and interactions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {appointments.length > 0 && (
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Appointment scheduled</p>
                        <p className="text-xs text-gray-600">Dr. {appointments[0].doctor.name} - {appointments[0].doctor.specialty}</p>
                      </div>
                      <span className="text-xs text-gray-500">{format(new Date(appointments[0].createdAt), 'MMM d')}</span>
                    </div>
                  )}
                  
                  {prescriptions.length > 0 && (
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <Pill className="h-4 w-4 text-green-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Prescription added</p>
                        <p className="text-xs text-gray-600">{prescriptions[0].medication} - {prescriptions[0].dosage}</p>
                      </div>
                      <span className="text-xs text-gray-500">{format(new Date(prescriptions[0].prescribedAt), 'MMM d')}</span>
                    </div>
                  )}
                  
                  {medicalRecords.length > 0 && (
                    <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                      <FileText className="h-4 w-4 text-purple-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Medical record added</p>
                        <p className="text-xs text-gray-600">{medicalRecords[0].title}</p>
                      </div>
                      <span className="text-xs text-gray-500">{format(new Date(medicalRecords[0].uploadedAt), 'MMM d')}</span>
                    </div>
                  )}

                  {appointments.length === 0 && prescriptions.length === 0 && medicalRecords.length === 0 && (
                    <div className="text-center py-6 text-gray-500">
                      No recent activity to display
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    <span>Quick Actions</span>
                  </CardTitle>
                  <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ScheduleAppointmentModal>
                    <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule New Appointment
                    </Button>
                  </ScheduleAppointmentModal>
                  <AddMedicalRecordModal>
                    <Button variant="outline" className="w-full justify-start border-green-200 text-green-700 hover:bg-green-50">
                      <FileText className="h-4 w-4 mr-2" />
                      Upload Medical Record
                    </Button>
                  </AddMedicalRecordModal>
                  <AddPrescriptionModal onPrescriptionAdded={refreshPrescriptions}>
                    <Button variant="outline" className="w-full justify-start border-purple-200 text-purple-700 hover:bg-purple-50">
                      <Pill className="h-4 w-4 mr-2" />
                      Add Prescription
                    </Button>
                  </AddPrescriptionModal>
                  <Button variant="outline" className="w-full justify-start border-orange-200 text-orange-700 hover:bg-orange-50">
                    <Clock className="h-4 w-4 mr-2" />
                    View Upcoming Appointments
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>Your scheduled medical appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.length > 0 ? (
                    appointments.slice(0, 3).map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="bg-blue-100 rounded-full p-2">
                            <Calendar className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-blue-900">Dr. {appointment.doctor.name} - {appointment.doctor.specialty}</p>
                            <p className="text-sm text-gray-600">{format(new Date(appointment.appointmentTime), "MMMM d, yyyy 'at' h:mm a")}</p>
                            <p className="text-xs text-gray-500">Status: {appointment.status}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="text-blue-600 border-blue-200">
                          View Details
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">No upcoming appointments</p>
                      <ScheduleAppointmentModal>
                        <Button className="mt-2 bg-blue-600 hover:bg-blue-700">
                          <Plus className="h-4 w-4 mr-2" />
                          Schedule New Appointment
                        </Button>
                      </ScheduleAppointmentModal>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </PatientLayout>
  );
};

export default PatientDashboard;
