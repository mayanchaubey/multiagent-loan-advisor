import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Send } from 'lucide-react';
import { Message, Step, LoanData, LoanResult } from '../types';
import { MessageList } from './MessageList';

const STEP_QUESTIONS = {
  income: 'What is your monthly income? (in rupees)',
  emi: 'What is your existing EMI? (in rupees)',
  amount: 'How much loan amount do you need? (in rupees)',
  tenure: 'What tenure are you looking for? (in months)',
};

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [currentStep, setCurrentStep] = useState<Step>('income');
  const [loanData, setLoanData] = useState<LoanData>({
    income: '',
    emi: '',
    amount: '',
    tenure: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const welcomeMessage: Message = {
      id: '1',
      type: 'bot',
      content: "Hello! I'm your AI Loan Advisor. I'll help you check your loan eligibility. Let's get started!",
      timestamp: new Date(),
    };

    const firstQuestion: Message = {
      id: '2',
      type: 'bot',
      content: STEP_QUESTIONS.income,
      timestamp: new Date(),
    };

    setMessages([welcomeMessage, firstQuestion]);
  }, []);

  const addMessage = (content: string, type: 'user' | 'bot' | 'result', result?: LoanResult) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      result,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const validateNumber = (value: string): boolean => {
    const num = parseFloat(value);
    return !isNaN(num) && num > 0;
  };

  const processLoanApplication = async (data: LoanData) => {
    setIsLoading(true);

    try {
      const response = await fetch('/chat/apply-loan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          monthly_income: parseFloat(data.income),
          existing_emi: parseFloat(data.emi),
          loan_amount: parseFloat(data.amount),
          tenure_months: parseInt(data.tenure),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error (${response.status}): ${errorText}`);
      }

      const responseData = await response.json();

      const result: LoanResult = {
        status: responseData.status,
        title: responseData.title,
        message: responseData.message,
        advice: responseData.personalized_improvement_advice,
      };

      const resultMessage: Message = {
        id: Date.now().toString(),
        type: 'result',
        content: '',
        timestamp: new Date(),
        result,
      };

      setMessages((prev) => [...prev, resultMessage]);
      setCurrentStep('done');
    } catch (error) {
      console.error('Loan Processing Error:', error);
      addMessage(
        `Error processing application: ${(error as Error).message}. Please try again.`,
        'bot'
      );
      setCurrentStep('income');
      setLoanData({ income: '', emi: '', amount: '', tenure: '' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || currentStep === 'done') return;

    if (currentStep !== 'processing') {
      if (!validateNumber(input)) {
        addMessage('Please enter a valid number greater than 0.', 'bot');
        return;
      }
    }

    addMessage(input, 'user');
    const userInput = input;
    setInput('');

    const updatedLoanData = { ...loanData, [currentStep]: userInput };
    setLoanData(updatedLoanData);

    const stepOrder: Step[] = ['income', 'emi', 'amount', 'tenure', 'processing', 'done'];
    const currentIndex = stepOrder.indexOf(currentStep);
    const nextStep = stepOrder[currentIndex + 1];

    if (nextStep === 'processing') {
      setCurrentStep('processing');
      await processLoanApplication(updatedLoanData);
    } else if (nextStep && nextStep !== 'done') {
      setTimeout(() => {
        addMessage(STEP_QUESTIONS[nextStep as keyof typeof STEP_QUESTIONS], 'bot');
        setCurrentStep(nextStep);
      }, 500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isInputDisabled = isLoading || currentStep === 'processing' || currentStep === 'done';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto h-[90vh] flex flex-col">
        <div className="mb-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">AI Loan Advisor</h1>
          <p className="text-white/80">Your intelligent assistant for loan eligibility</p>
        </div>

        <div className="flex-1 flex flex-col bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
          <MessageList messages={messages} isLoading={isLoading} />

          <div className="p-4 border-t border-white/20 bg-white/5">
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isInputDisabled}
                placeholder={
                  currentStep === 'done'
                    ? 'Application processed'
                    : isLoading
                      ? 'Processing...'
                      : 'Type your answer...'
                }
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                onClick={handleSend}
                disabled={isInputDisabled || !input.trim()}
                className="px-6 py-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-medium hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
            <div className="text-center">
              <Link to="/admin" className="text-xs text-white/30 hover:text-white/60 transition-colors">
                Employee Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
