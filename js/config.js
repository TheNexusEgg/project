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
    honoraryTitle: 'The undercover topper',
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
        src: '/assets/photos/ph4.jpg',
        path: '/assets/photos/ph4.jpg',
        caption: 'Certified main character doing main character activities.',
        alt: 'Photo memory 1 of Miss Catalyst',
        tag: 'Exhibit #01',
      },
      {
        id: 2,
        src: '/assets/photos/ph6.jpg',
        path: '/assets/photos/ph6.jpg',
        caption: 'CEO of saying "I barely studied" and then getting top marks,Just see the books behind......',
        alt: 'Photo memory 2 of Miss Catalyst',
        tag: 'Exhibit #02',
      },
      {
        id: 3,
        src: '/assets/photos/ph5.jpg',
        path: '/assets/photos/ph5.jpg',
        caption: 'Maximum intellect,Maximum activation Energy, unmatched elegance.',
        alt: 'Photo memory 3 of Miss Catalyst',
        tag: 'Exhibit #03',
      },
      {
        id: 4,
        src: '/assets/photos/ph1.jpg',
        path: '/assets/photos/ph1.jpg',
        caption: 'Evidence that the camera occasionally captures Divinity.',
        alt: 'Photo memory 4 of Miss Catalyst',
        tag: 'Exhibit #04',
      },
      {
        id: 5,
        src: '/assets/photos/ph3.jpg',
        path: '/assets/photos/ph3.jpg',
        caption: 'The rare candid moment when the topper is on the Fun! hehe .',
        alt: 'Photo memory 5 of Miss Catalyst',
        tag: 'Exhibit #05',
      },
      {
        id: 6,
        src: '/assets/photos/ph2.jpg',
        path: '/assets/photos/ph2.jpg',
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
    salutation: 'Happy Birthday, Shreya ',
    paragraphs: [
      "Okay first of all, I know you don't consider yourself a topper, and honestly, You AREEEE!!!!. Some people are just naturally talented, and you're definitely one of them wait Not just one of them Best of them. Thoda talent, thodi madness, and a whole lot of doing things your own way.",
      "You're that rare combination of someone who's genuinely good at things but also capable of doing the most unexpected and questionable stuff at any given moment. Kabhi serious, kabhi completely pagal. There's honestly no predicting what you'll do next.",
      "And the photos... well, I don't think I even need to explain that obsession. At this point, your gallery probably deserves its own gallery. Every moment is a potential photoshoot, apparently. 😂",
      "And then there's the pilot dream. I genuinely hope you get to fly someday, quite literally. Just remember, becoming a pilot means you'll have to be responsible up there. Can't have Miss Catalyst creating chaos at 30,000 feet.",
      "Jokes apart, I hope this year brings you a lot of happiness, new experiences, countless memories, amazing pictures (obviously), and plenty of opportunities to do all the crazy things you love.",
      "Never lose that natural talent, that little madness, or the habit of being unapologetically yourself.",
      "And for once, accept that you're pretty good at what you do. Bas topper bolne pe itna objection mat kiya karo Okie?? akhir Saumya ko bhi beat karna h!!!.",
      "**Happy Birthday once again! Keep being you.**",
    ],
    signature: "From your unofficial examiner, still trying to prove you're a topper.",
    postscript: 'P.S. As always, any formal complaints regarding this website must be submitted in triplicate to the Complaints Department (which is permanently closed).',
  },

  // Alias for backward compatibility
  birthdayMessage: {
    title: 'A Note for Miss Catalyst ✈️',
    placeholder: '[Personal birthday note content rendered from config.birthdayNote]',
  },

  // Stage 4 — The Official Topper Test Configuration
  
  // Stage 4 — The Official Topper Test Configuration
  quiz: {
    title: 'The Official Miss Catalyst Test',
    subtitle: '5 questions. 1 examiner who thinks he knows you pretty well. Let’s see.',
    instructions: 'No overthinking. Just pick the option that sounds most like you. Waise bhi, I made the questions. 😁',

    questions: [
      {
        id: 1,
        question: 'Someone calls you a topper. What happens next?',
        options: [
          'Yes! I am🤓',
          'Arre nahi yaar, aisa kuch bhi nahi hai....',
          'Depends... who is asking? ',
          'Topic change to something else 🙃'
        ],
        correctAnswer: 1,
        explanation: 'The classic Shreya response. Compliment received, compliment immediately rejected. Very predictable😶.'
      },
      {
        id: 2,
        question: 'You find a really good photo spot. What is the actual plan?',
        options: [
          'One picture and we move on. Simple.',
          'A quick picture, maybe two if the lighting is good.😗',
          'Wait one in this filter nahi yar acchi nhi h dusri filter nhi dusra pose 😭 etc. and then Take one more till eternity.',
          'picture chodo khana khao bhook lagi h 🥱'
        ],
        correctAnswer: 2,
        explanation: 'One picture? With that camera obsession? 100-200 se pehle to rukne nhi wali tum 🤣 btw 4th option bhi match karta h yad ho to konsi bat kar rha me 😁'
      },
      {
        id: 3,
        question: 'Fast forward a few years. Miss Catalyst is finally in a cockpit. What is the most likely reaction?',
        options: [
          'All focused on flying. Professional from day one Serious on the go 😐',
          'A little nervous at first, but absolutely thrilled.😬',
          'Already planning the perfect cockpit picture before takeoff.😅',
          'Somehow turning even a routine flight into an adventure😜'
        ],
        correctAnswer: 1,
        explanation: 'A little nervousness is probably inevitable, but seeing that dream come true would be worth it. Genuinely hope you get there someday ✈️'
      },
      {
        id: 4,
        question: 'A normal, peaceful day suddenly becomes interesting. Why?',
        options: [
          'Someone started an unnecessary argument.',
          'bas aise hi random plans🙂',
          'class me fir kuch kand',
          'Miss Catalyst got one of her ideas again. then lets say bunk hua ya kisi ka roast 😁'
        ],
        correctAnswer: 3,
        explanation: 'Sometimes the plan is the plan. Sometimes YOU are the plot twist. Nobody is fully prepared.'
      },
      {
        id: 5,
        question: 'If someone had to describe Miss Catalyst in one line, which one gets closest?🤔',
        options: [
          'A perfectly organised person who always has everything figured out.',
          'A serious student who never gets distracted by anything.',
          'Naturally talented, camera-ready, slightly crazy and impossible to predict.😝',
          'A quiet person who prefers staying away from all the fun.'
        ],
        correctAnswer: 2,
        explanation: 'A little talent, a little madness, a camera always nearby and absolutely no guarantee of what comes next. Sounds familiar?🤭😁 ig so'
      }
    ],

    results: {
      high: {
        scoreRange: '5/5',
        title: 'Okay, Hmm You Know Yourself!',
        message: 'Not bad at all. Either you know yourself pretty well, or you have been secretly studying the examiner’s question paper.'
      },
      medium: {
        scoreRange: '3–4/5',
        title: 'Miss Catalyst, Under Review',
        message: 'A decent attempt! A few answers are still questionable, but honestly, even your examiner cannot predict you every time.'
      },
      low: {
        scoreRange: '0–2/5',
        title: 'Who Are You and What Have You Done?',
        message: 'Hmm. Either these questions were difficult, or Miss Catalyst has successfully managed to surprise even the person who wrote them.'
      }
    },

    birthdayWish: 'Whatever your score, Happy Birthday! Keep chasing those big dreams, collecting pictures, making memories and being your wonderfully unpredictable self.'
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
        message: 'Okay, that was genuinely impressive. Topper Yha bhi nice nice lightning Speed and precision.',
      },
      medium: {
        threshold: 10,
        title: 'Starlight Collector!',
        message: 'Not bad at all! kuch stars reh gye Still good',
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
      header: 'Official Birthday Girl\'s Topper Certificate ',
      title: 'Certificate of Academic & Personal Excellence',
      subtitle: 'Awarded for successfully surviving another year with effortless brilliance.',
      recipient: 'Miss Catalyst',
      formalName: 'Shreya Royyy!!!!',
      achievement: 'In recognition of unmatched intellect, heroic denial of her brilliance and not accepting she is a topper , master typing speed, and consistent Activation Energy bringing warmth with equal Chaos To everyone around Her.',
      seal: 'VERIFIED 100% TOPPER',
      date: 'Chapter 2026 · Official Edition',
      signature: 'From your unofficial examiner, still waiting for you to admit you\'re a topper.',
      signatureTitle: 'By Chief Examiner of Topper Allegations, Nikhil',
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
