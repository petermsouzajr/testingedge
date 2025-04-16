import React from 'react'; // Import React if using icons later

export const links = [
  {
    name: 'Problem', // Shortened for header space
    hash: '#problem-solution',
  },
  {
    name: 'Services',
    hash: '#services',
  },
  {
    name: 'Why Us',
    hash: '#why-us',
  },
  {
    name: 'Process',
    hash: '#process',
  },
  {
    name: 'Support',
    hash: '#support',
  },
  {
    name: 'Contact',
    hash: '#contact',
  },
] as const; // Use 'as const' for stricter typing
