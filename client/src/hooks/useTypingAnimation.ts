import { useState, useEffect } from 'react';

export interface TypingWord {
  text: string;
  color: string;
}

interface UseTypingAnimationReturn {
  currentWordIndex: number;
  displayText: string;
  isTyping: boolean;
}

/**
 * useTypingAnimation Hook
 * =======================
 * Manages a typing/backspacing animation cycle through an array of words.
 * 
 * Features:
 * - Types at configurable speed (default: 100ms per letter)
 * - Backspaces at configurable speed (default: 80ms per letter)
 * - Pauses between words (default: 1500ms)
 * - Cycles through word array infinitely
 * 
 * @param words - Array of words with text and color properties
 * @param typeSpeed - Milliseconds per character when typing (default: 100)
 * @param backspaceSpeed - Milliseconds per character when backspacing (default: 80)
 * @param pauseTime - Milliseconds to pause after typing complete (default: 1500)
 * @returns Object with currentWordIndex, displayText, and isTyping state
 */
export function useTypingAnimation(
  words: TypingWord[],
  typeSpeed: number = 100,
  backspaceSpeed: number = 80,
  pauseTime: number = 1500
): UseTypingAnimationReturn {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (words.length === 0) return;

    const currentWord = words[currentWordIndex].text;
    let index = displayText.length;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (isTyping) {
      // Typing phase
      if (index < currentWord.length) {
        timeoutId = setTimeout(() => {
          setDisplayText(currentWord.slice(0, index + 1));
        }, typeSpeed);
      } else {
        // Word fully typed, pause then start backspacing
        timeoutId = setTimeout(() => {
          setIsTyping(false);
        }, pauseTime);
      }
    } else {
      // Backspacing phase
      if (index > 0) {
        timeoutId = setTimeout(() => {
          setDisplayText(currentWord.slice(0, index - 1));
        }, backspaceSpeed);
      } else {
        // Word fully erased, move to next word and start typing
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
        setIsTyping(true);
      }
    }

    return () => {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    };
  }, [displayText, isTyping, currentWordIndex, words, typeSpeed, backspaceSpeed, pauseTime]);

  return { currentWordIndex, displayText, isTyping };
}
