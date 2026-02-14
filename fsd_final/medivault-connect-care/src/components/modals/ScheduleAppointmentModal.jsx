import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { appointmentService } from '@/lib/api';

const ScheduleAppointmentModal = ({ children, onAppointmentScheduled }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    doctorId: '',
    date: '',
    time: '',
    notes: ''
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoadingDoctors(true);
        const doctorsData = await appointmentService.getAllDoctors();
        setDoctors(doctorsData);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        toast({
          title: "Error",
          description: "Failed to load doctors. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoadingDoctors(false);
      }
    };

    if (open) {
      fetchDoctors();
    }
  }, [open, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.doctorId || !formData.date || !formData.time) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Combine date and time into a single datetime string
      const appointmentDateTime = `${formData.date}T${formData.time}:00`;
      
      await appointmentService.scheduleAppointment({
        doctorId: formData.doctorId,
        appointmentTime: appointmentDateTime,
        notes: formData.notes
      });
      
      toast({
        title: "Success",
        description: "Appointment request sent successfully!",
      });
      
      setFormData({ doctorId: '', date: '', time: '', notes: '' });
      setOpen(false);
      
      if (onAppointmentScheduled) {
        onAppointmentScheduled();
      }
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to schedule appointment",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Appointment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="doctor">Doctor</Label>
            <Select 
              value={formData.doctorId} 
              onValueChange={(value) => setFormData({...formData, doctorId: value})}
              disabled={loadingDoctors}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingDoctors ? "Loading doctors..." : "Select a doctor"} />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id.toString()}>
                    Dr. {doctor.name} - {doctor.specialty || 'General Practice'}
                  </SelectItem>
                ))}
                {doctors.length === 0 && !loadingDoctors && (
                  <SelectItem value="none" disabled>No doctors available</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="date">Appointment Date</Label>
            <Input 
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              min={new Date().toISOString().split('T')[0]} // Prevent past dates
              required
            />
          </div>

          <div>
            <Label htmlFor="time">Appointment Time</Label>
            <Input 
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({...formData, time: e.target.value})}
              required
            />
          </div>

          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea 
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Any specific concerns or information"
              rows={2}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={loading || loadingDoctors}
            >
              {loading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Scheduling...
                </>
              ) : (
                <>Schedule Appointment</>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleAppointmentModal;
