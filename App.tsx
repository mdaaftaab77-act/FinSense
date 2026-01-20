import React, { useState, useEffect } from 'react';
import StatsBar from './components/StatsBar';
import ScenarioCard from './components/ScenarioCard';
import Reflection from './components/Reflection';
import { GameState, Track, Scenario, GameOption } from './types';
import { INITIAL_STATS, OFFLINE_SCENARIOS } from './constants';
import { generateScenario } from './services/geminiService';
import { Play, BookOpen, ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    screen: 'onboarding',
    track: null,
    stats: INITIAL_STATS[Track.YOUNG_ADULT],
    currentMonth: 1,
    history: [],
    currentScenario: null,
    loading: false,
    language: 'en'
  });

  const [feedbackOverlay, setFeedbackOverlay] = useState<{message: string, type: 'good' | 'bad' | 'neutral'} | null>(null);

  // Initialize first scenario when game starts
  useEffect(() => {
    if (gameState.screen === 'playing' && !gameState.currentScenario && !gameState.loading) {
      loadNextTurn();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.screen, gameState.currentScenario]);

  const loadNextTurn = async () => {
    setGameState(prev => ({ ...prev, loading: true }));
    
    const track = gameState.track || Track.YOUNG_ADULT;
    
    // Attempt to fetch from AI
    let nextScenario = await generateScenario(track, gameState.stats, gameState.currentMonth);
    
    // Fallback if AI fails or key missing
    if (!nextScenario) {
        // Pick a random scenario from OFFLINE_SCENARIOS that hasn't been played recently
        // For simplicity in this MVP, we just pick random
        const randomIndex = Math.floor(Math.random() * OFFLINE_SCENARIOS.length);
        const fallback = OFFLINE_SCENARIOS[randomIndex];
        
        nextScenario = {
            ...fallback, 
            id: `fallback_${Date.now()}_${randomIndex}`, // Ensure unique ID to trigger animation
        };
    }

    setGameState(prev => ({
      ...prev,
      loading: false,
      currentScenario: nextScenario
    }));
  };

  const startGame = (track: Track) => {
    setGameState(prev => ({
      ...prev,
      screen: 'playing',
      track: track,
      stats: INITIAL_STATS[track],
      currentMonth: 1,
      history: [],
      currentScenario: null
    }));
  };

  const handleOptionSelect = (option: GameOption) => {
    // 1. Show Feedback Overlay
    const isGoodChoice = (option.consequences.savings || 0) >= 0 && (option.consequences.financialResilience || 0) >= 0;
    setFeedbackOverlay({
        message: option.feedback,
        type: isGoodChoice ? 'good' : (option.consequences.savings && option.consequences.savings < -1000 ? 'bad' : 'neutral')
    });

    // 2. Update Stats
    setGameState(prev => {
        const newStats = {
            savings: prev.stats.savings + (option.consequences.savings || 0),
            happiness: Math.min(100, Math.max(0, prev.stats.happiness + (option.consequences.happiness || 0))),
            financialResilience: Math.min(100, Math.max(0, prev.stats.financialResilience + (option.consequences.financialResilience || 0))),
            knowledge: prev.stats.knowledge + (option.consequences.knowledge || 0),
        };

        const newHistory = [
            ...prev.history,
            {
                scenarioTitle: prev.currentScenario?.title || 'Unknown',
                choiceText: option.text,
                impact: option.feedback
            }
        ];

        return {
            ...prev,
            stats: newStats,
            history: newHistory,
        };
    });

    // 3. Clear Overlay and Next Turn after delay
    setTimeout(() => {
        setFeedbackOverlay(null);
        
        if (gameState.currentMonth >= 6) { // End game after 6 turns for MVP
            setGameState(prev => ({ ...prev, screen: 'summary' }));
        } else {
            setGameState(prev => ({ 
                ...prev, 
                currentMonth: prev.currentMonth + 1,
                currentScenario: null // Triggers useEffect to load next
            }));
        }
    }, 2500);
  };

  const restartGame = () => {
    setGameState({
        screen: 'onboarding',
        track: null,
        stats: INITIAL_STATS[Track.YOUNG_ADULT],
        currentMonth: 1,
        history: [],
        currentScenario: null,
        loading: false,
        language: 'en'
    });
  };

  // --- RENDER HELPERS ---

  if (gameState.screen === 'onboarding') {
    return (
      <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center p-6 font-poppins">
        <div className="max-w-md w-full space-y-8 text-center">
            <div className="space-y-2">
                <h1 className="text-4xl font-bold text-orange-600">DhanGyaan</h1>
                <p className="text-gray-600 text-lg">Master your money. Master your life.</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-orange-100">
                <h2 className="text-xl font-semibold mb-6 text-gray-800">Select your path</h2>
                
                <div className="space-y-4">
                    <button 
                        onClick={() => startGame(Track.STUDENT)}
                        className="w-full flex items-center p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-all group"
                    >
                        <div className="p-3 bg-blue-500 text-white rounded-full mr-4 group-hover:scale-110 transition-transform">
                            <BookOpen size={24} />
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-blue-900">Student</h3>
                            <p className="text-sm text-blue-700">Pocket money, canteen, needs vs wants</p>
                        </div>
                    </button>

                    <button 
                        onClick={() => startGame(Track.YOUNG_ADULT)}
                        className="w-full flex items-center p-4 bg-green-50 hover:bg-green-100 border border-green-200 rounded-xl transition-all group"
                    >
                        <div className="p-3 bg-green-600 text-white rounded-full mr-4 group-hover:scale-110 transition-transform">
                            <ShieldCheck size={24} />
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-green-900">Young Adult</h3>
                            <p className="text-sm text-green-700">Salary, rent, credit, & investments</p>
                        </div>
                    </button>
                </div>
            </div>
            
            <p className="text-xs text-gray-400">Offline-ready • Voice enabled</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 pb-10 font-poppins relative">
      {gameState.screen !== 'summary' && <StatsBar stats={gameState.stats} />}
      
      <main className="pt-24 px-4 max-w-2xl mx-auto">
        {gameState.screen === 'playing' && gameState.currentScenario && (
             <ScenarioCard 
                scenario={gameState.currentScenario} 
                month={gameState.currentMonth}
                onOptionSelect={handleOptionSelect}
                loading={gameState.loading}
             />
        )}

        {gameState.screen === 'playing' && gameState.loading && (
             <ScenarioCard 
                scenario={OFFLINE_SCENARIOS[0]} // Dummy used for skeleton loading
                month={gameState.currentMonth}
                onOptionSelect={() => {}}
                loading={true}
            />
        )}

        {gameState.screen === 'summary' && (
            <Reflection 
                stats={gameState.stats} 
                history={gameState.history} 
                onRestart={restartGame} 
            />
        )}
      </main>

      {/* Feedback Overlay */}
      {feedbackOverlay && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
              <div className={`
                  bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-2xl max-w-sm mx-4 text-center border-b-4 slide-in
                  ${feedbackOverlay.type === 'good' ? 'border-green-500' : feedbackOverlay.type === 'bad' ? 'border-red-500' : 'border-gray-400'}
              `}>
                  <div className={`text-4xl mb-2`}>
                      {feedbackOverlay.type === 'good' ? '🌟' : feedbackOverlay.type === 'bad' ? '💸' : '🤔'}
                  </div>
                  <h3 className="text-xl font-bold mb-1 text-gray-800">
                     {feedbackOverlay.type === 'good' ? 'Wise Choice!' : feedbackOverlay.type === 'bad' ? 'Ouch!' : 'Interesting...'}
                  </h3>
                  <p className="text-gray-600">{feedbackOverlay.message}</p>
              </div>
          </div>
      )}
    </div>
  );
};

export default App;
