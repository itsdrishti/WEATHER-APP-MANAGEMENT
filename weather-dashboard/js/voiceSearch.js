/**
 * Initializes Voice Search using the Web Speech API
 * @param {Function} onResultCallback - Function to call with the recognized text
 */
export function initVoiceSearch(onResultCallback) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        console.warn('Speech Recognition API not supported in this browser.');
        return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        // Clean up punctuation that might confuse the weather API
        const cleanTranscript = transcript.replace(/[.,!?]/g, '').trim();
        onResultCallback(cleanTranscript);
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        alert('Voice search error: ' + event.error);
    };

    return recognition;
}
