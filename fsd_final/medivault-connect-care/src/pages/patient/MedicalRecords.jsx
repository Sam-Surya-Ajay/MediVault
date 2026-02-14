import { useState, useEffect } from 'react';
import PatientLayout from '@/components/layout/PatientLayout';
import AddMedicalRecordModal from '@/components/modals/AddMedicalRecordModal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload, Calendar, Download } from "lucide-react";
import { medicalRecordService } from '@/lib/api';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const data = await medicalRecordService.getRecords();
      setRecords(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching medical records:', err);
      setError('Failed to load medical records. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id, fileName) => {
    try {
      const fileData = await medicalRecordService.downloadRecord(id);
      
      // Create a blob from the file data
      const blob = new Blob([fileData]);
      
      // Create a link element and trigger download
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Success",
        description: "File downloaded successfully",
      });
    } catch (err) {
      console.error('Error downloading file:', err);
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive",
      });
    }
  };

  const handleRecordAdded = () => {
    fetchRecords();
  };

  return (
    <PatientLayout currentPage="medical-records">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-900">Medical Records</h1>
          <AddMedicalRecordModal onRecordAdded={handleRecordAdded}>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Upload className="h-4 w-4 mr-2" />
              Upload Record
            </Button>
          </AddMedicalRecordModal>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-500">Loading medical records...</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {records.map((record) => (
              <Card key={record.id} className="border-blue-200">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-blue-900">{record.title}</CardTitle>
                      <CardDescription>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {format(new Date(record.uploadedAt), 'MMM d, yyyy')}
                          </span>
                          <span>{record.doctorName}</span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                            {record.recordType}
                          </span>
                        </div>
                      </CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownload(record.id, record.fileName)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        {!loading && records.length === 0 && (
          <Card className="border-blue-200">
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No medical records yet</h3>
              <p className="text-gray-600 mb-4">Upload your first medical record to get started</p>
              <AddMedicalRecordModal onRecordAdded={handleRecordAdded}>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Record
                </Button>
              </AddMedicalRecordModal>
            </CardContent>
          </Card>
        )}
      </div>
    </PatientLayout>
  );
};

export default MedicalRecords;
