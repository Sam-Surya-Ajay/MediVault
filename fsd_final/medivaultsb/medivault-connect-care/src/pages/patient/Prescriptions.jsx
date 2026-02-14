import PatientLayout from '@/components/layout/PatientLayout';
import AddPrescriptionModal from '@/components/modals/AddPrescriptionModal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pill, Calendar, User, Plus } from "lucide-react";
import { useState, useEffect } from 'react';
import { prescriptionService } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const Prescriptions = ({ onPrescriptionAdded }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const data = await prescriptionService.getPatientPrescriptions();
      setPrescriptions(data);
    } catch (err) {
      toast({ title: "Error", description: "Failed to load prescriptions", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  // This function will be called after a prescription is added
  const handlePrescriptionAdded = () => {
    fetchPrescriptions();
    if (onPrescriptionAdded) onPrescriptionAdded();
  };

  return (
    <PatientLayout currentPage="prescriptions">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-900">Prescriptions</h1>
          <AddPrescriptionModal onPrescriptionAdded={handlePrescriptionAdded}>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Prescription
            </Button>
          </AddPrescriptionModal>
        </div>

        <div className="grid gap-4">
          {prescriptions.map((prescription) => (
            <Card key={prescription.id} className="border-blue-200">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 rounded-lg p-3">
                      <Pill className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-blue-900">{prescription.medication}</CardTitle>
                      <CardDescription className="mt-2">
                        <div className="space-y-1">
                          <p><strong>Dosage:</strong> {prescription.dosage}</p>
                          <p><strong>Frequency:</strong> {prescription.frequency}</p>
                          <p><strong>Duration:</strong> {prescription.duration}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              {prescription.doctor?.name || prescription.doctorName}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {prescription.prescribedAt ? new Date(prescription.prescribedAt).toLocaleDateString() : ''}
                            </span>
                          </div>
                        </div>
                      </CardDescription>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </PatientLayout>
  );
};

export default Prescriptions;
