import { useState, useEffect } from 'react';
import DoctorLayout from '@/components/layout/DoctorLayout';
import RejectAppointmentModal from '@/components/modals/RejectAppointmentModal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Check, X, Mail, Trash2 } from "lucide-react";
import { appointmentService } from '@/lib/api';
import { format, parseISO } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getDoctorAppointments();
      setAppointments(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to load appointments. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (appointmentId) => {
    try {
      await appointmentService.updateAppointmentStatus(appointmentId, {
        status: 'APPROVED'
      });
      
      toast({
        title: "Success",
        description: "Appointment approved successfully!",
      });
      
      // Refresh appointments list
      fetchAppointments();
    } catch (error) {
      console.error('Error approving appointment:', error);
      toast({
        title: "Error",
        description: "Failed to approve appointment",
        variant: "destructive"
      });
    }
  };

  const handleReject = async (appointmentId, rejectionReason) => {
    try {
      await appointmentService.updateAppointmentStatus(appointmentId, {
        status: 'REJECTED',
        rejectionReason
      });
      
      toast({
        title: "Success",
        description: "Appointment rejected successfully",
      });
      
      // Refresh appointments list
      fetchAppointments();
    } catch (error) {
      console.error('Error rejecting appointment:', error);
      toast({
        title: "Error",
        description: "Failed to reject appointment",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (appointmentId) => {
    try {
      await appointmentService.deleteAppointment(appointmentId);
      toast({
        title: "Deleted",
        description: "Appointment deleted successfully!",
      });
      fetchAppointments();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete appointment",
        variant: "destructive"
      });
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

  const filteredAppointments = appointments.filter((appointment) => {
    if (filter === 'ALL') return true;
    return appointment.status === filter;
  });

  return (
    <DoctorLayout currentPage="appointments">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-green-900">Appointment Requests</h1>
        <div className="flex space-x-2 mb-4">
          <Button variant={filter === 'ALL' ? 'default' : 'outline'} onClick={() => setFilter('ALL')}>All</Button>
          <Button variant={filter === 'PENDING' ? 'default' : 'outline'} onClick={() => setFilter('PENDING')}>Pending</Button>
          <Button variant={filter === 'APPROVED' ? 'default' : 'outline'} onClick={() => setFilter('APPROVED')}>Approved</Button>
          <Button variant={filter === 'REJECTED' ? 'default' : 'outline'} onClick={() => setFilter('REJECTED')}>Rejected</Button>
          <Button variant={filter === 'FINISHED' ? 'default' : 'outline'} onClick={() => setFilter('FINISHED')}>Finished</Button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <p className="mt-2 text-gray-500">Loading appointments...</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <Card key={appointment.id} className="border-green-200">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-4">
                        <div className="bg-green-100 rounded-lg p-3">
                          <User className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <CardTitle className="text-green-900">{appointment.patient.name}</CardTitle>
                          <CardDescription className="mt-2">
                            <p><strong>Age:</strong> {appointment.patient.age || 'N/A'} years</p>
                            <p><strong>Email:</strong> {appointment.patient.email}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {formatAppointmentDate(appointment.appointmentTime)}
                              </span>
                              <span className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {formatAppointmentTime(appointment.appointmentTime)}
                              </span>
                            </div>
                          </CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(appointment.status)}`}>
                          {appointment.status}
                        </span>
                        {appointment.status === 'PENDING' && (
                          <div className="mt-2 space-x-2">
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleApprove(appointment.id)}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <RejectAppointmentModal 
                              appointmentId={appointment.id}
                              patientName={appointment.patient.name}
                              onReject={(reason) => handleReject(appointment.id, reason)}
                            >
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-red-600 hover:bg-red-50 border-red-200"
                              >
                                <X className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </RejectAppointmentModal>
                          </div>
                        )}
                        {appointment.status === 'APPROVED' && (
                          <div className="mt-2">
                            <Button variant="outline" size="sm">
                              <Mail className="h-4 w-4 mr-1" />
                              Send Reminder
                            </Button>
                          </div>
                        )}
                        {(appointment.status === 'REJECTED' || appointment.status === 'FINISHED') && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:bg-red-100 mt-2"
                            title="Delete Appointment"
                            onClick={() => handleDelete(appointment.id)}
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        )}
                        {appointment.status === 'REJECTED' && appointment.rejectionReason && (
                          <p className="text-sm text-red-600 mt-1">Reason: {appointment.rejectionReason}</p>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))
            ) : (
              <Card className="border-green-200">
                <CardContent className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No appointment requests</h3>
                  <p className="text-gray-600">New appointment requests will appear here</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </DoctorLayout>
  );
};

export default Appointments;
