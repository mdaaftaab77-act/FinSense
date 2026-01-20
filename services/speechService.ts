export const speak = (text: string, lang: 'en' | 'hi' = 'en') => {
  if (!window.speechSynthesis) return;

  // Cancel current speech to avoid overlapping
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Try to find an Indian English voice or Hindi voice
  const voices = window.speechSynthesis.getVoices();
  let voice;

  if (lang === 'hi') {
    voice = voices.find(v => v.lang.includes('hi-IN'));
  } else {
    voice = voices.find(v => v.lang.includes('en-IN')) || voices.find(v => v.lang.includes('en-GB'));
  }

  if (voice) {
    utterance.voice = voice;
  }

  utterance.rate = 0.9; // Slightly slower for clarity
  utterance.pitch = 1.0;
  
  window.speechSynthesis.speak(utterance);
};

export const stopSpeech = () => {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};
