import { useState } from 'react';
import axios from 'axios';
import { Button } from './button';
import { Alert, AlertDescription } from './alert';
import { AlertCircle, CheckCircle } from 'lucide-react';

export default function TestConnection() {
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const testHealthEndpoint = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:3001/api/public/health');
      console.log('Health response:', response.data);
      setStatus('Success: Server is responsive');
    } catch (error) {
      console.error('Health check error:', error);
      setError(`Connection failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white space-y-4">
      <h2 className="text-lg font-semibold">Connection Diagnostic</h2>
      
      <div className="space-y-2">
        <Button 
          onClick={testHealthEndpoint}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isLoading ? 'Testing...' : 'Test API Connection'}
        </Button>
        
        {status && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-600">{status}</AlertDescription>
          </Alert>
        )}
        
        {error && (
          <Alert className="bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-600">{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
} 