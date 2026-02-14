import { useState, useEffect } from 'react';
import PatientLayout from '@/components/layout/PatientLayout';
import ScheduleAppointmentModal from '@/components/modals/ScheduleAppointmentModal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Plus, MapPin, Trash2, Filter } from "lucide-react";
import { appointmentService } from '@/lib/api';
import { format, parseISO } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const { toast } = useToast();

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [appointments, statusFilter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getPatientAppointments();
      setAppointments(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to load appointments. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    if (statusFilter === 'ALL') {
      setFilteredAppointments(appointments);
    } else {
      setFilteredAppointments(appointments.filter(app => app.status === statusFilter));
    }
  };

  const handleDeleteAppointment = async (id) => {
    try {
      await appointmentService.deleteAppointment(id);
      toast({
        title: "Success",
        description: "Appointment deleted successfully",
      });
      fetchAppointments(); // Refresh the list
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete appointment",
        variant: "destructive",
      });
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatAppointmentTime = (dateTime) => {
    try {
      return format(parseISO(dateTime), 'h:mm a');
    } catch (error) {
      return '';
    }
  };

  const formatAppointmentDate = (dateTime) => {
    try {
      return format(parseISO(dateTime), 'MMM d, yyyy');
    } catch (error) {
      return '';
    }
  };

  return (
    <PatientLayout currentPage="appointments">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-900">Appointments</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Appointments</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ScheduleAppointmentModal onAppointmentScheduled={fetchAppointments}>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Schedule Appointment
              </Button>
            </ScheduleAppointmentModal>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-500">Loading appointments...</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <Card key={appointment.id} className="border-blue-200">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-4">
                        <div className="bg-blue-100 rounded-lg p-3">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-blue-900">Dr. {appointment.doctor.name}</CardTitle>
                          <CardDescription className="mt-2">
                            <p className="text-green-600 font-medium">{appointment.doctor.specialty || 'General Physician'}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {formatAppointmentDate(appointment.appointmentTime)}
                              </span>
                              <span className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {formatAppointmentTime(appointment.appointmentTime)}
                              </span>
                              <span className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {appointment.doctor.clinicLocation || 'Clinic'}
                              </span>
                            </div>
                          </CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(appointment.status)}`}>
                          {appointment.status}
                        </span>
                        {appointment.status === 'REJECTED' && appointment.rejectionReason && (
                          <p className="text-sm text-red-600 mt-1">Reason: {appointment.rejectionReason}</p>
                        )}
                        <div className="mt-2 space-x-2">
                          {appointment.status === 'PENDING' && (
                            <>
                              <Button variant="outline" size="sm">Reschedule</Button>
                              <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">Cancel</Button>
                            </>
                          )}
                          {(appointment.status === 'REJECTED' || appointment.status === 'FINISHED') && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:bg-red-50"
                              onClick={() => handleDeleteAppointment(appointment.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))
            ) : (
              <Card className="border-blue-200">
                <CardContent className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
                  <p className="text-gray-600 mb-4">
                    {statusFilter === 'ALL' 
                      ? "Schedule your first appointment to get started"
                      : `No ${statusFilter.toLowerCase()} appointments found`}
                  </p>
                  <ScheduleAppointmentModal onAppointmentScheduled={fetchAppointments}>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule Appointment
                    </Button>
                  </ScheduleAppointmentModal>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </PatientLayout>
  );
};

export default Appointments;
