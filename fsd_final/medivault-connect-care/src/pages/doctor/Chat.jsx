import { useState, useEffect, useRef } from 'react';
import DoctorLayout from '@/components/layout/DoctorLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, User } from "lucide-react";
import { chatService, appointmentService, authService } from '@/lib/api';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const Chat = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [message, setMessage] = useState('');
  const [patients, setPatients] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const { toast } = useToast();
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    if (selectedPatient) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000); // Poll for new messages
      return () => clearInterval(interval);
    }
  }, [selectedPatient]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchPatients = async () => {
    try {
      // Fetch all patients for this doctor
      const data = await appointmentService.getAllPatientsForDoctor(currentUser.id);
      setPatients(data);
      setLoading(false);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load patients",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!selectedPatient) return;
    
    try {
      const data = await chatService.getChatHistory(currentUser.id, selectedPatient.id);
      setMessages(data);
      if (data.length > 0) {
        await chatService.markMessagesAsRead(selectedPatient.id, currentUser.id);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedPatient) return;

    try {
      await chatService.sendMessage(currentUser.id, selectedPatient.id, message);
      setMessage('');
      fetchMessages();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <DoctorLayout currentPage="chat">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Patients List */}
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Patients</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {loading ? (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : patients.length > 0 ? (
                patients.map((patient) => (
                  <div
                    key={patient.id}
                    onClick={() => setSelectedPatient(patient)}
                    className={`p-4 cursor-pointer hover:bg-blue-50 border-b border-blue-100 ${
                      selectedPatient?.id === patient.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 rounded-full p-2">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-blue-900">{patient.name}</p>
                        <p className="text-sm text-gray-600">Patient</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No patients available for chat
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <div className="lg:col-span-2">
          {selectedPatient ? (
            <Card className="border-blue-200 h-full flex flex-col">
              <CardHeader className="border-b border-blue-100">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 rounded-full p-2">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-blue-900">{selectedPatient.name}</CardTitle>
                    <p className="text-sm text-gray-600">Patient</p>
                  </div>
                </div>
              </CardHeader>
              
              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender.id === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.sender.id === currentUser.id 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p>{msg.message}</p>
                      <p className={`text-xs mt-1 ${msg.sender.id === currentUser.id ? 'text-blue-100' : 'text-gray-500'}`}>
                        {format(new Date(msg.timestamp), 'h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </CardContent>

              {/* Message Input */}
              <div className="border-t border-blue-100 p-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="border-blue-200 focus:border-blue-400"
                  />
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="border-blue-200 h-full flex items-center justify-center">
              <CardContent className="text-center">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a patient to start chatting</h3>
                <p className="text-gray-600">Choose a patient from the list to begin your conversation</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DoctorLayout>
  );
};

export default Chat;
