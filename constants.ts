import { PlayerStats, Scenario, Track } from './types';

export const INITIAL_STATS: Record<Track, PlayerStats> = {
  [Track.STUDENT]: {
    savings: 2000,
    happiness: 80,
    financialResilience: 30,
    knowledge: 10,
  },
  [Track.YOUNG_ADULT]: {
    savings: 15000,
    happiness: 60,
    financialResilience: 50,
    knowledge: 30,
  },
};

export const FALLBACK_SCENARIO: Scenario = {
  id: 'fallback_1',
  type: 'decision',
  title: 'End of Month Salary',
  description: 'You just received your salary of ₹15,000. Your friends want to go for a fancy dinner to celebrate.',
  imagePrompt: 'A group of young Indian friends sitting at a restaurant table with food, laughing.',
  options: [
    {
      id: 'opt1',
      text: 'Go out and treat everyone (₹2,000)',
      consequences: { savings: -2000, happiness: 20, financialResilience: -5 },
      feedback: 'You had a great time, but your budget for the month is now tight.',
    },
    {
      id: 'opt2',
      text: 'Suggest a cheaper dhaba (₹500)',
      consequences: { savings: -500, happiness: 10, financialResilience: 5 },
      feedback: 'Good balance! You enjoyed without breaking the bank.',
    },
    {
      id: 'opt3',
      text: 'Skip it, cook at home',
      consequences: { savings: 0, happiness: -5, financialResilience: 10 },
      feedback: 'Great savings, but social life is important too for mental health.',
    },
  ],
};

export const OFFLINE_SCENARIOS: Scenario[] = [
  FALLBACK_SCENARIO,
  {
    id: 'offline_2',
    type: 'event',
    title: 'Sale Season!',
    description: 'A huge online sale is live! You see a branded pair of shoes at 40% off (₹2,500). You don\'t strictly need them, but they look cool.',
    imagePrompt: 'A pair of stylish sneakers on a smartphone screen showing a discount sale offer.',
    options: [
      {
        id: 'opt1',
        text: 'Buy them now! (₹2,500)',
        consequences: { savings: -2500, happiness: 15, financialResilience: -10 },
        feedback: 'You look stylish, but impulse buying can hurt your long-term goals.',
      },
      {
        id: 'opt2',
        text: 'Wait 24 hours to decide',
        consequences: { savings: 0, happiness: 0, financialResilience: 5 },
        feedback: 'Smart move. The urge usually passes after a day.',
      },
      {
        id: 'opt3',
        text: 'Invest that money instead',
        consequences: { savings: 0, happiness: -5, financialResilience: 15 },
        feedback: 'Excellent discipline! Your future self thanks you.',
      }
    ]
  },
  {
    id: 'offline_3',
    type: 'scam',
    title: 'Suspicious Message',
    description: 'You receive a WhatsApp message: "Congrats! You won ₹1 Lakh lottery. Click link to claim now!"',
    imagePrompt: 'A close up of a smartphone displaying a suspicious scam message on a chat app.',
    options: [
      {
        id: 'opt1',
        text: 'Click the link immediately',
        consequences: { savings: -5000, happiness: -20, financialResilience: -30 },
        feedback: 'Oh no! It was a phishing scam. Malware was installed and money stolen.',
      },
      {
        id: 'opt2',
        text: 'Ignore and Block',
        consequences: { savings: 0, happiness: 5, financialResilience: 10 },
        feedback: 'Perfect. Never trust unsolicited links.',
      },
      {
        id: 'opt3',
        text: 'Ask friend if it\'s real',
        consequences: { savings: 0, happiness: 0, financialResilience: 5 },
        feedback: 'Caution is good, but you should know these are always scams.',
      }
    ]
  },
  {
    id: 'offline_4',
    type: 'decision',
    title: 'Emergency Expense',
    description: 'Your phone screen cracked unexpectedly. Repair costs ₹3,000.',
    imagePrompt: 'A smartphone with a badly cracked screen lying on a table.',
    options: [
      {
        id: 'opt1',
        text: 'Repair from savings (₹3,000)',
        consequences: { savings: -3000, happiness: -5, financialResilience: 5 },
        feedback: 'This is exactly what an emergency fund is for. Good job having savings.',
      },
      {
        id: 'opt2',
        text: 'Buy a new expensive phone on EMI',
        consequences: { savings: -1000, happiness: 10, financialResilience: -20 },
        feedback: 'Taking debt for a want disguised as a need is risky.',
      },
      {
        id: 'opt3',
        text: 'Use it with cracked screen',
        consequences: { savings: 0, happiness: -10, financialResilience: 0 },
        feedback: 'Frugal, but it might get worse. Sometimes repairs are necessary.',
      }
    ]
  },
  {
    id: 'offline_5',
    type: 'decision',
    title: 'Friend\'s Wedding',
    description: 'A close friend is getting married out of town. Trip cost is ₹8,000.',
    imagePrompt: 'An Indian wedding celebration with decorations and guests.',
    options: [
      {
        id: 'opt1',
        text: 'Go, make memories! (₹8,000)',
        consequences: { savings: -8000, happiness: 25, financialResilience: -5 },
        feedback: 'Experiences are valuable. Just make sure to make up for the spending later.',
      },
      {
        id: 'opt2',
        text: 'Politely decline, send gift (₹1,000)',
        consequences: { savings: -1000, happiness: -5, financialResilience: 10 },
        feedback: 'Financially prudent, though you missed a social event.',
      },
      {
        id: 'opt3',
        text: 'Borrow money to go',
        consequences: { savings: 0, happiness: 20, financialResilience: -25 },
        feedback: 'Taking debt for social events is a bad habit.',
      }
    ]
  }
];