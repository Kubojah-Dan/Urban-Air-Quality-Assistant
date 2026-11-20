import { useState } from 'react';

export function useReplanner(onRevise) {
  const [input, setInput] = useState('');

  const submitChange = (parameter, value) => {
    onRevise({
      id: `rev_${Date.now()}`,
      type: 'hard',
      description: `User adjusted ${parameter} to ${value}`,
      parameter,
      value
    });
  };

  return { input, setInput, submitChange };
}
