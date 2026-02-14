import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { medicalRecordService } from '@/lib/api';

const AddMedicalRecordModal = ({ children, onRecordAdded }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    recordType: '',
    doctorName: '',
    description: '',
    file: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.file) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      await medicalRecordService.addRecord(formData);
      
      toast({
        title: "Success",
        description: "Medical record added successfully!",
      });
      
      setFormData({ title: '', recordType: '', doctorName: '', description: '', file: null });
      setOpen(false);
      
      if (onRecordAdded) {
        onRecordAdded();
      }
    } catch (error) {
      console.error('Error adding medical record:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add medical record",
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
          <DialogTitle>Add Medical Record</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g., Blood Test Results"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="recordType">Type</Label>
            <Select 
              value={formData.recordType} 
              onValueChange={(value) => setFormData({...formData, recordType: value})}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select record type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LAB_REPORT">Lab Report</SelectItem>
                <SelectItem value="RADIOLOGY">Radiology</SelectItem>
                <SelectItem value="PRESCRIPTION">Prescription</SelectItem>
                <SelectItem value="CONSULTATION">Consultation Notes</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="doctorName">Doctor Name</Label>
            <Input 
              id="doctorName"
              value={formData.doctorName}
              onChange={(e) => setFormData({...formData, doctorName: e.target.value})}
              placeholder="e.g., Dr. Smith"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Brief description of the record"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="file">Upload File</Label>
            <Input 
              id="file"
              type="file"
              onChange={(e) => setFormData({...formData, file: e.target.files[0]})}
              accept=".pdf,.jpg,.jpeg,.png"
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Uploading...
                </>
              ) : (
                <>Add Record</>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMedicalRecordModal;
