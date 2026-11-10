/**
 * PROJECT: TOPPER MOHTARMA
 * BATCH 2 — CENTRAL CONFIGURATION
 * 
 * Central Source of Truth for all customizable values, passwords,
 * hints, nicknames, and audio file paths.
 */

export const config = {
  // Recipient details
  recipient: {
    nickname: 'Miss Catalyst',
    honoraryTitle: 'Topper Mohtarma',
    formalName: 'Shreya',
  },

  // Security / Password Gate settings
  security: {
    password: 'misstopper',
    passwordHint: 'The title you keep denying.',
    hint: 'The title you keep denying.',
    incorrectFeedback: [
      'Hmm... even the topper needs another attempt.',
      'Access denied. Topper allegations still pending.',
      'Nice try. That\'s not the secret code.',
      'Topper denial detected. Enter your genuine title!',
    ],
  },

  // Audio configuration — 2-track Birthday Playlist
  audio: {
    playlist: [
      { id: 'ik-kudi', title: 'Ik Kudi', src: 'music/Ik-Kudi.mp3' },
      { id: 'aarzu', title: 'Aarzu', src: 'music/Aarzu.mp3' },
    ],
    defaultVolume: 0.35,
    musicEnabledByDefault: false,
    enabledByDefault: false, // OFF on Stage 1 until password entry
  },

  // Stage 3 — Photo Gallery Configuration
  gallery: {
    title: 'The Main Character Archive',
    subtitle: 'Curated photographic evidence of effortless brilliance and questionable study habits.',
    photos: [
      {
        id: 1,
        src: '/assets/photos/ph1.jpg',
        path: '/assets/photos/ph1.jpg',
        caption: 'Certified main character doing main character activities.',
        alt: 'Photo memory 1 of Miss Catalyst',
        tag: 'Exhibit #01',
      },
      {
        id: 2,
        src: '/assets/photos/ph2.jpg',
        path: '/assets/photos/ph2.jpg',
        caption: 'CEO of saying "I barely studied" and then getting top marks.',
        alt: 'Photo memory 2 of Miss Catalyst',
        tag: 'Exhibit #02',
      },
      {
        id: 3,
        src: '/assets/photos/ph3.jpg',
        path: '/assets/photos/ph3.jpg',
        caption: 'Maximum intellect, minimum sleep, unmatched elegance.',
        alt: 'Photo memory 3 of Miss Catalyst',
        tag: 'Exhibit #03',
      },
      {
        id: 4,
        src: '/assets/photos/ph4.jpg',
        path: '/assets/photos/ph4.jpg',
        caption: 'Evidence that the camera occasionally gets things right right? .',
        alt: 'Photo memory 4 of Miss Catalyst',
        tag: 'Exhibit #04',
      },
      {
        id: 5,
        src: '/assets/photos/ph5.jpg',
        path: '/assets/photos/ph5.jpg',
        caption: 'The rare candid moment when the topper is on the Fun! hehe .',
        alt: 'Photo memory 5 of Miss Catalyst',
        tag: 'Exhibit #05',
      },
      {
        id: 6,
        src: '/assets/photos/ph6.jpg',
        path: '/assets/photos/ph6.jpg',
        caption: 'Proof that brilliance and chaotic energy can peacefully coexist.',
        alt: 'Photo memory 6 of Miss Catalyst',
        tag: 'Exhibit #06',
      },
    ],
    // Backward compatibility alias for earlier batch references
    get slots() {
      return this.photos;
    },
  },

  // Stage 6 — Birthday Note Configuration
  // EDITABLE NOTE: The creator can customize the text below anytime.
  birthdayNote: {
    title: 'A Note for Miss Catalyst ✈️',
    subtitle: 'Confidential Chapter · Topper Appreciation Archive',
    dateLabel: 'Chapter 2026 · Confidential Dispatch',
    salutation: 'Happy Birthday, Topper Mohtarma!',
    paragraphs: [
      "Okay first of all, I know you don't consider yourself a topper, and honestly, I'm not here to argue with you on your birthday. But some people are just naturally talented, and you're definitely one of them. Thoda talent, thoda madness, and a whole lot of doing things your own way.",
      "You're that rare combination of someone who's genuinely good at things but also capable of doing the most unexpected and questionable stuff at any given moment. Kabhi serious, kabhi completely pagal. There's honestly no predicting what you'll do next.",
      "And the photos... well, I don't think I even need to explain that obsession. At this point, your gallery probably deserves its own gallery. Every moment is a potential photoshoot, apparently. 😂",
      "And then there's the pilot dream. I genuinely hope you get to fly someday, quite literally. Just remember, becoming a pilot means you'll have to be responsible up there. Can't have Miss Catalyst creating chaos at 30,000 feet.",
      "Jokes apart, I hope this year brings you a lot of happiness, new experiences, countless memories, amazing pictures (obviously), and plenty of opportunities to do all the crazy things you love.",
      "Never lose that natural talent, that little madness, or the habit of being unapologetically yourself.",
      "And please, for once, accept that you're pretty good at what you do. Bas topper bolne pe itna objection mat kiya karo.",
      "**Happy Birthday once again! Keep being you.**",
    ],
    signature: "From your unofficial examiner, who has officially given up trying to convince you that you're a topper.",
    postscript: 'P.S. As always, any formal complaints regarding this website must be submitted in triplicate to the Complaints Department (which is permanently closed).',
  },

  // Alias for backward compatibility
  birthdayMessage: {
    title: 'A Note for Miss Catalyst ✈️',
    placeholder: '[Personal birthday note content rendered from config.birthdayNote]',
  },

  // Stage 4 — The Official Topper Test Configuration
  quiz: {
    title: 'The Official Topper Test',
    subtitle: 'Five questions. One very questionable examiner. Let\'s see how this goes.',
    instructions: 'Select the most accurate response for each scenario. Academic honesty not guaranteed.',
    questions: [
      {
        id: 1,
        question: 'Someone objectively calls you a topper. What\'s your immediate response?',
        options: [
          'Gracefully accept the compliment and take a bow',
          'Vigorously deny all allegations on technical grounds',
          'Blame the question paper for being accidentally easy',
          'Look around suspiciously and change the subject',
        ],
        correctAnswer: 1,
        explanation: 'Denial isn\'t just a reaction; for you, it\'s practically a refined art form.',
      },
      {
        id: 2,
        question: 'What\'s genuinely more consistent: your academic performance or your denial of it?',
        options: [
          'The academic performance, obviously',
          'The denial—it operates at a solid 100% frequency',
          'Both are locked in a neck-and-neck championship',
          'Neither, I was clearly asleep the whole semester',
        ],
        correctAnswer: 2,
        explanation: 'They feed off each other in a perpetual motion engine of effortless excellence.',
      },
      {
        id: 3,
        question: 'It\'s the night before a major exam or presentation. What is your declared status?',
        options: [
          '"I haven\'t even opened the syllabus yet!"',
          '"Fully prepared and turning in early for 8 hours of sleep"',
          '"I have written a 90-page revision dossier"',
          '"Wait... there\'s an evaluation tomorrow?"',
        ],
        correctAnswer: 0,
        explanation: 'The classic declaration of total unpreparedness, right before scoring near perfection.',
      },
      {
        id: 4,
        question: 'If the marks speak for themselves, why is the defence team still preparing an appeal?',
        options: [
          'Because the evaluator clearly made a severe grading error in my favour',
          'To demand a strict re-check to lower the final score',
          'Because admitting brilliance is strictly against personal policy',
          'What marks? I wasn\'t even in the exam hall',
        ],
        correctAnswer: 2,
        explanation: 'Admitting to being a topper would ruin the mystique of pretending you didn\'t study.',
      },
      {
        id: 5,
        question: 'What should the official title of this birthday investigation be?',
        options: [
          'Casual Bystander with Accidental Top Scores',
          'The World\'s Most Reluctant Genius',
          'Certified Topper Mohtarma (Title Under Permanent Appeal)',
          'All of the above simultaneously',
        ],
        correctAnswer: 3,
        explanation: 'The investigation concludes: all charges of brilliance and effortless charm are confirmed!',
      },
    ],
    results: {
      high: {
        scoreRange: '5/5',
        title: 'Supreme Topper Confirmed',
        message: 'The allegations are officially undeniable. Even the highest constitutional court would dismiss your appeal in seconds.',
      },
      medium: {
        scoreRange: '3–4/5',
        title: 'Distinguished Academic in Denial',
        message: 'A remarkably strong showing. You attempted to downplay your brilliance, but the examiner saw right through your defense.',
      },
      low: {
        scoreRange: '0–2/5',
        title: 'Master of Tactical Understatement',
        message: 'Either the examiner prepared a wildly unfair paper, or you deliberately missed questions to protect your cover.',
      },
    },
    birthdayWish: 'Either way, Happy Birthday! May your new year bring zero exam stress, endless laughter, and boundless success.',
  },

  // Stage 5 — Catch the Stars Mini-Game Configuration
  game: {
    title: 'Catch the Stars',
    subtitle: 'A little birthday challenge. Catch as many stars as you can before time runs out.',
    instructions: 'Tap or click the glowing stars as they appear. You have 30 seconds to gather starlight!',
    duration: 30, // seconds
    maxActiveStars: 6,
    spawnIntervalMs: 650,
    starLifetimeMs: 2600,
    results: {
      high: {
        threshold: 20,
        title: 'Cosmic Reflex Master!',
        message: 'Okay, that was genuinely impressive. Certified lightning reflexes and stellar precision.',
      },
      medium: {
        threshold: 10,
        title: 'Starlight Collector!',
        message: 'Not bad at all! A few sneaky stars escaped, but you gathered a brilliant constellation.',
      },
      low: {
        threshold: 0,
        title: 'Cosmic Daydreamer!',
        message: 'The stars were clearly playing hard to get today, or you were distracted by your own brilliance.',
      },
    },
    birthdayWish: 'You have gathered enough starlight to power every single one of your birthday wishes for the year ahead!',
  },

  // Stage 7 — The Birthday Finale Configuration
  finale: {
    title: 'One Last Thing...',
    subtitle: 'You\'ve made it through the quiz, the stars and all the surprises. But we\'re not done just yet.',
    revealButtonText: 'Reveal the surprise ✨',
    cakeHeading: 'Make a Birthday Wish!',
    cakeSubheading: 'Take a quiet moment, think of your biggest wish for the year ahead, and blow out the candle.',
    makeWishButtonText: 'Make a Wish & Blow Candle 🕯️',
    wishGrantedText: 'Wish Granted! ✨',
    finalMessage: 'Happy Birthday, Miss Catalyst! Keep smiling, keep shining, and keep being effortlessly exceptional. Here\'s to your happiest chapter yet!',
    certificate: {
      header: 'OFFICIAL BIRTHDAY CITATION',
      title: 'Certificate of Academic & Personal Excellence',
      subtitle: 'Awarded for successfully surviving another year with effortless brilliance.',
      recipient: 'Miss Catalyst',
      formalName: 'Shreya Roy',
      achievement: 'In recognition of unmatched intellect, heroic topper denial under sworn oath, master reflex speed, and consistently bringing warmth and wit to everyone around her.',
      seal: 'VERIFIED 100% TOPPER',
      date: 'Chapter 2026 · Official Edition',
      signature: 'From your unofficial examiner, still waiting for you to admit you\'re a topper.',
      signatureTitle: 'By Chief Examiner of Topper Allegations,Nikhil',
    },
  },

  // 7 Experience Stages Definitions & Sequencing
  stages: [
    {
      id: 1,
      selector: '#stage-1',
      stageNumber: 1,
      title: 'Secret Entrance',
      shortLabel: 'Entrance',
      theme: 'dark',
      batch: 2,
      summary: 'Confidential access gate with playful topper verification.',
    },
    {
      id: 2,
      selector: '#stage-2',
      stageNumber: 2,
      title: 'Welcome Universe',
      shortLabel: 'Welcome',
      theme: 'light',
      batch: 2,
      summary: 'Warm birthday greeting and introduction to the experience.',
    },
    {
      id: 3,
      selector: '#stage-3',
      stageNumber: 3,
      title: 'The Main Character Archive',
      shortLabel: 'Archive',
      theme: 'light',
      batch: 3,
      summary: 'Photo gallery featuring 6–8 curated moments with a modal lightbox.',
    },
    {
      id: 4,
      selector: '#stage-4',
      stageNumber: 4,
      title: 'The Official Topper Test',
      shortLabel: 'Topper Test',
      theme: 'dark',
      batch: 4,
      summary: 'Interactive 5-question topper banter quiz with diagnosis.',
    },
    {
      id: 5,
      selector: '#stage-5',
      stageNumber: 5,
      title: 'Catch the Stars',
      shortLabel: 'Stars Game',
      theme: 'dark',
      batch: 5,
      summary: '30-second arcade star-catching challenge with score levels.',
    },
    {
      id: 6,
      selector: '#stage-6',
      stageNumber: 6,
      title: 'A Little Note For You',
      shortLabel: 'Birthday Note',
      theme: 'light',
      batch: 3,
      summary: 'Genuine personal appreciation note with readable typography.',
    },
    {
      id: 7,
      selector: '#stage-7',
      stageNumber: 7,
      title: 'Birthday Finale',
      shortLabel: 'Finale & Cake',
      theme: 'dark',
      batch: 6,
      summary: 'Celebration cake, candle lighting, confetti, and topper certificate.',
    },
  ],
};

// Aliases for convenient top-level access
export const nickname = config.recipient.nickname;
export const honoraryTitle = config.recipient.honoraryTitle;
export const formalName = config.recipient.formalName;
export const password = config.security.password;
export const passwordHint = config.security.hint;
export const musicFile = config.audio.musicFile;
export const musicEnabledByDefault = config.audio.musicEnabledByDefault;
