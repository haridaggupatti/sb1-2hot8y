import { useState } from 'react';
import { Send, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface Message {
  question: string;
  response: string;
  timestamp: string;
}

interface ChatInterfaceProps {
  messages: Message[];
  onSend: (message: string) => Promise<void>;
  onPrevious: () => void;
  onNext: () => void;
  currentIndex: number;
}

export default function ChatInterface({
  messages,
  onSend,
  onPrevious,
  onNext,
  currentIndex,
}: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setLoading(true);
    try {
      await onSend(input);
      setInput('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p className="text-lg font-medium">Welcome to your interview practice session</p>
            <p className="text-sm mt-2">Start by asking a question below</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-start space-x-3">
                <div className="flex-1">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-gray-900">{message.question}</p>
                      <span className="text-xs text-gray-500">
                        {format(new Date(message.timestamp), 'p')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-1">
                  <div className="bg-indigo-50 p-3 rounded-lg">
                    <p className="text-gray-800 whitespace-pre-wrap">{message.response}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
          </div>
        )}
      </div>

      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <button
            type="button"
            onClick={onPrevious}
            disabled={currentIndex <= 0}
            className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
            title="Previous question"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            disabled={loading}
          />
          
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-2 text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
            title="Send question"
          >
            <Send className="w-5 h-5" />
          </button>
          
          <button
            type="button"
            onClick={onNext}
            disabled={currentIndex >= messages.length - 1}
            className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
            title="Next question"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}