import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { prescriptionService, authService } from '@/lib/api';

const AddPrescriptionModal = ({ children, onPrescriptionAdded }) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    medication: '',
    dosage: '',
    frequency: '',
    duration: '',
    doctor: '',
    instructions: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Get current user (patient)
      const user = authService.getCurrentUser();
      if (!user || !user.id) {
        throw new Error("User not found. Please log in again.");
      }
      await prescriptionService.addPrescription({
        ...formData,
        patientId: user.id
      });
      toast({ title: "Success", description: "Prescription added successfully!" });
      setFormData({ medication: '', dosage: '', frequency: '', duration: '', doctor: '', instructions: '' });
      setOpen(false);
      if (onPrescriptionAdded) onPrescriptionAdded();
    } catch (error) {
      toast({ title: "Error", description: error.message || "Failed to add prescription", variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Prescription</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="medication">Medication Name</Label>
            <Input 
              id="medication"
              value={formData.medication}
              onChange={(e) => setFormData({...formData, medication: e.target.value})}
              placeholder="e.g., Amoxicillin"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="dosage">Dosage</Label>
            <Input 
              id="dosage"
              value={formData.dosage}
              onChange={(e) => setFormData({...formData, dosage: e.target.value})}
              placeholder="e.g., 500mg"
              required
            />
          </div>

          <div>
            <Label htmlFor="frequency">Frequency</Label>
            <Input 
              id="frequency"
              value={formData.frequency}
              onChange={(e) => setFormData({...formData, frequency: e.target.value})}
              placeholder="e.g., 3 times daily"
              required
            />
          </div>

          <div>
            <Label htmlFor="duration">Duration</Label>
            <Input 
              id="duration"
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: e.target.value})}
              placeholder="e.g., 7 days"
              required
            />
          </div>

          <div>
            <Label htmlFor="doctor">Prescribed by</Label>
            <Input 
              id="doctor"
              value={formData.doctor}
              onChange={(e) => setFormData({...formData, doctor: e.target.value})}
              placeholder="e.g., Dr. Smith"
              required
            />
          </div>

          <div>
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea 
              id="instructions"
              value={formData.instructions}
              onChange={(e) => setFormData({...formData, instructions: e.target.value})}
              placeholder="Special instructions or notes"
              rows={2}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Add Prescription
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPrescriptionModal;
