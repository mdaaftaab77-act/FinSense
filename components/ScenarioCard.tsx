import React, { useEffect, useState } from 'react';
import { Scenario, GameOption } from '../types';
import { speak, stopSpeech } from '../services/speechService';
import { generateImageFromPrompt } from '../services/geminiService';
import { Volume2, VolumeX, AlertTriangle, Calendar, Image as ImageIcon } from 'lucide-react';

interface Props {
  scenario: Scenario;
  month: number;
  onOptionSelect: (option: GameOption) => void;
  loading: boolean;
}

const ScenarioCard: React.FC<Props> = ({ scenario, month, onOptionSelect, loading }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    // Auto-stop speech when scenario changes
    stopSpeech();
    setIsPlaying(false);
    
    // Reset image state
    setImageUrl(null);

    // Load Image
    const loadImage = async () => {
      // Use fallback initially to show something fast
      const fallbackUrl = `https://picsum.photos/seed/${scenario.id}/600/300`;
      
      if (scenario.imagePrompt) {
        setImageLoading(true);
        // Try to generate a better image
        const genImage = await generateImageFromPrompt(scenario.imagePrompt);
        if (genImage) {
          setImageUrl(genImage);
        } else {
          // Keep fallback if generation fails or offline
          setImageUrl(fallbackUrl);
        }
        setImageLoading(false);
      } else {
        setImageUrl(fallbackUrl);
      }
    };

    if (scenario.id) {
        loadImage();
    }

  }, [scenario.id, scenario.imagePrompt]);

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      stopSpeech();
      setIsPlaying(false);
    } else {
      speak(`${scenario.title}. ${scenario.description}`, 'en');
      setIsPlaying(true);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 p-8 text-center animate-pulse">
        <div className="w-16 h-16 bg-orange-200 rounded-full mb-4 flex items-center justify-center">
           <Calendar className="text-orange-500" />
        </div>
        <p className="text-gray-500 font-medium text-lg">Thinking about life...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 slide-in max-w-lg w-full mx-auto">
      {/* Header / Image Placeholder */}
      <div className="h-48 bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center relative overflow-hidden">
         <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-bold z-10">
            Month {month}
         </div>
         {scenario.type === 'scam' && (
             <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1 animate-pulse z-10">
                 <AlertTriangle size={14} /> Alert
             </div>
         )}
         
         {/* Image Display */}
         {imageUrl ? (
             <img 
                src={imageUrl} 
                alt={scenario.imagePrompt || "Scenario"} 
                className={`w-full h-full object-cover transition-opacity duration-700 ${imageLoading ? 'opacity-80 blur-sm' : 'opacity-100'}`}
             />
         ) : (
            // Skeleton while initializing fallback
            <div className="w-full h-full bg-orange-200 animate-pulse flex items-center justify-center">
                 <ImageIcon className="text-orange-400 opacity-50" size={40} />
            </div>
         )}

         {/* Loading Indicator for AI Image */}
         {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[2px]">
                <div className="bg-white/90 px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs font-medium text-orange-700">Painting scene...</span>
                </div>
            </div>
         )}

         <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-10">
             <h2 className="text-2xl font-bold text-white drop-shadow-md leading-tight">{scenario.title}</h2>
         </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
            <p className="text-gray-700 text-lg leading-relaxed">{scenario.description}</p>
            <button 
                onClick={handleSpeak}
                className="ml-4 p-3 bg-orange-100 text-orange-600 rounded-full hover:bg-orange-200 transition-colors flex-shrink-0"
                aria-label="Read out loud"
            >
                {isPlaying ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>
        </div>

        {/* Options */}
        <div className="space-y-4">
            {scenario.options.map((option, idx) => (
                <button
                    key={option.id}
                    onClick={() => onOptionSelect(option)}
                    className="w-full text-left p-4 rounded-xl border-2 border-gray-100 hover:border-orange-500 hover:bg-orange-50 transition-all duration-200 group relative overflow-hidden"
                >
                    <span className="font-semibold text-gray-800 text-lg block mb-1 group-hover:text-orange-700">
                        {option.text}
                    </span>
                    {/* Visual cue for cost/gain if applicable without spoiling too much */}
                     {option.consequences.savings && option.consequences.savings !== 0 && (
                        <span className={`text-sm font-medium ${option.consequences.savings > 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {option.consequences.savings > 0 ? '+' : ''}₹{Math.abs(option.consequences.savings)}
                        </span>
                     )}
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ScenarioCard;