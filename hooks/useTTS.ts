export const useTTS = () => {
  const speak = (text: string) => {
    if (!("speechSynthesis" in window) || !text) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    
    // Attempt to find a natural male voice
    const preferredVoice =
      voices.find((v) => v.name.toLowerCase().includes("daniel")) || 
      voices.find((v) => v.lang.startsWith("en-US")) || 
      voices[0];

    utterance.voice = preferredVoice;
    utterance.lang = "en-US";
    utterance.pitch = 1;
    utterance.rate = 0.9; // Slightly slower for clarity

    window.speechSynthesis.speak(utterance);
  };

  return { speak };
};
