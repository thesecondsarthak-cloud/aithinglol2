import { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { InputForm } from './components/InputForm';
import { LoadingState } from './components/LoadingState';
import { Results } from './components/Results';
import { CareerChat } from './components/CareerChat';
import { ApiKeyModal } from './components/ApiKeyModal';
import { UserInput, AnalysisResult } from './types/career';
import { aiService } from './services/ai.service';

type AppState = 'hero' | 'input' | 'loading' | 'results' | 'chat';

function App() {
  const [state, setState] = useState<AppState>('hero');
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [selectedCareer, setSelectedCareer] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  useEffect(() => {
    const savedApiKey = localStorage.getItem('gemini_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const handleGetStarted = () => {
    setState('input');
  };

  const handleBackToHero = () => {
    setState('hero');
  };

  const handleApiKeySubmit = (key: string) => {
    setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
    setShowApiKeyModal(false);
  };

  const handleSubmit = async (input: UserInput) => {
    setState('loading');

    try {
      const analysisResults = await aiService.analyzeCareerPath(input, apiKey);
      setResults(analysisResults);
      setState('results');
    } catch (error) {
      console.error('Analysis failed:', error);
      setState('input');
    }
  };

  const handleReset = () => {
    setState('hero');
    setResults(null);
  };

  const handleAskQuestions = (careerTitle: string) => {
    setSelectedCareer(careerTitle);
    setState('chat');
  };

  const handleBackToResults = () => {
    setState('results');
  };

  return (
    <div className="min-h-screen">
      <ApiKeyModal isOpen={showApiKeyModal} onSubmit={handleApiKeySubmit} />
      {state === 'hero' && <Hero onGetStarted={handleGetStarted} />}
      {state === 'input' && <InputForm onSubmit={handleSubmit} onBack={handleBackToHero} />}
      {state === 'loading' && <LoadingState />}
      {state === 'results' && results && (
        <Results results={results} onReset={handleReset} onAskQuestions={handleAskQuestions} />
      )}
      {state === 'chat' && (
        <CareerChat
          careerTitle={selectedCareer}
          onBack={handleBackToResults}
          apiKey={apiKey}
          onApiKeyNeeded={() => setShowApiKeyModal(true)}
        />
      )}
    </div>
  );
}

export default App;
