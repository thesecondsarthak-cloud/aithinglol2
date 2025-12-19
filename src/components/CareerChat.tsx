import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ArrowLeft, Loader } from 'lucide-react';
import { aiService } from '../services/ai.service';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface CareerChatProps {
  careerTitle: string;
  onBack: () => void;
}

export function CareerChat({ careerTitle, onBack }: CareerChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hi! I'm here to answer any questions you have about becoming a ${careerTitle}. Feel free to ask about required tests, educational qualifications, subjects to focus on, salary expectations, or anything else!`,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await aiService.askCareerQuestion(inputValue.trim(), careerTitle);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try asking your question again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedQuestions = [
    'What tests or exams are required?',
    'What subjects should I focus on?',
    'What is the typical salary range?',
    'How long does it take to qualify?',
    'What skills do I need to develop?',
  ];

  const handleSuggestedClick = (question: string) => {
    setInputValue(question);
  };

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto fade-in">
        <button
          onClick={onBack}
          className="glass-panel px-4 py-2 text-sm text-slate-300 hover:text-cyan-300 mb-6 transition-colors inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Results
        </button>

        <div className="glass-panel overflow-hidden flex flex-col h-[calc(100vh-200px)]">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-2xl font-bold text-gradient mb-2">
              Career Q&A: {careerTitle}
            </h2>
            <p className="text-sm text-slate-400">
              Ask me anything about this career path
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'assistant'
                      ? 'bg-cyan-500/20 border border-cyan-400/30'
                      : 'bg-blue-500/20 border border-blue-400/30'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <Bot className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <User className="w-4 h-4 text-blue-400" />
                  )}
                </div>

                <div
                  className={`flex-1 max-w-[80%] ${
                    message.role === 'user' ? 'text-right' : 'text-left'
                  }`}
                >
                  <div
                    className={`inline-block px-4 py-3 rounded-2xl ${
                      message.role === 'assistant'
                        ? 'bg-white/5 border border-white/10 text-slate-200'
                        : 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 text-slate-100'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 px-2">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-cyan-500/20 border border-cyan-400/30">
                  <Bot className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="glass-panel px-4 py-3 rounded-2xl inline-flex items-center gap-2">
                  <Loader className="w-4 h-4 text-cyan-400 animate-spin" />
                  <span className="text-sm text-slate-400">Thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && (
            <div className="px-6 pb-4">
              <p className="text-xs text-slate-400 mb-3">Suggested questions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestedClick(question)}
                    className="glass-panel px-3 py-2 text-xs text-cyan-300 hover:bg-cyan-400/10 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 border-t border-white/10">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask a question about this career..."
                disabled={isLoading}
                className="cyber-input flex-1"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="cyber-button p-3"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
