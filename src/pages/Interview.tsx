// Previous imports remain the same...

export default function Interview() {
  // Previous state declarations remain the same...

  const handleSendMessage = async (question: string) => {
    try {
      const sessionId = localStorage.getItem('session_id');
      if (!sessionId) {
        navigate('/upload');
        return;
      }

      const response = await api.getAnswer(question, sessionId);
      const newMessage = { 
        question, 
        response: response.response,
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, newMessage]);
      setCurrentIndex((prev) => prev + 1);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to get response');
    }
  };

  // Rest of the component remains the same...
}