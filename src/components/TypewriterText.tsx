'use client';

import React, { useEffect, useState } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
}

export function TypewriterText({
  text,
  speed = 45,
  delay = 200,
  className = '',
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState(text);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setDisplayedText(text);
      return;
    }

    setDisplayedText('');
    setIsTyping(true);

    const startTimer = setTimeout(() => {
      let index = 0;
      const interval = setInterval(() => {
        index += 1;
        setDisplayedText(text.slice(0, index));
        if (index >= text.length) {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startTimer);
  }, [text, speed, delay]);

  return (
    <span className={`${className} ${isTyping ? 'typing-cursor' : ''}`}>
      {displayedText}
    </span>
  );
}
