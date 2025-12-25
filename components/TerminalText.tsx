
import React, { useState, useEffect } from 'react';

interface TerminalTextProps {
  text: string;
  delay?: number;
  className?: string;
}

const TerminalText: React.FC<TerminalTextProps> = ({ text, delay = 30, className = "" }) => {
  const [displayText, setDisplayText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [index, text, delay]);

  return <span className={className}>{displayText}{index < text.length && <span className="animate-pulse">_</span>}</span>;
};

export default TerminalText;
