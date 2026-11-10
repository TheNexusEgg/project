/**
 * PROJECT: TOPPER MOHTARMA
 * BATCH 2.1 — MAIN APPLICATION INITIALIZER
 * 
 * Integrates:
 * - Dynamic central configuration binding
 * - Gate-governed NavigationController with Stage 2 CTA enforcement
 * - Modular PasswordGate for Stage 1 validation
 * - Welcome Screen CTA advancing to Stage 3
 * - AudioController with reliable on-demand loading and honest unavailable states
 */

import { config } from './config.js';
import { NavigationController } from './navigation.js';
import { PasswordGate } from './password.js';
import { AudioController } from './audio.js';
import { GalleryController } from './gallery.js';
import { QuizController } from './quiz.js';
import { GameController } from './game.js';
import { FinaleController } from './finale.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log(`[Project Topper Mohtarma] Initializing Finale Edition for ${config.recipient.nickname}.`);

  // 1. Synchronize all DOM nodes declaring [data-config]
  bindConfigToDOM(config);

  let gameController = null;

  // 2. Initialize Guided Navigation Controller
  const nav = new NavigationController({
    stages: config.stages,
    prevButton: document.getElementById('btn-prev'),
    nextButton: document.getElementById('btn-next'),
    progressLabel: document.getElementById('progress-label'),
    progressSteps: document.getElementById('progress-steps'),
    summaryNumber: document.getElementById('nav-summary-number'),
    summaryTitle: document.getElementById('nav-summary-title'),
    onStageChange: (stage) => {
      console.log(`[Navigation] Entered Stage ${stage.stageNumber}: ${stage.title} (Theme: ${stage.theme})`);
      // If user departs Stage 5, cleanly halt any active game loop
      if (stage.stageNumber !== 5 && gameController) {
        gameController.stop();
      }
    },
    onGateBlocked: () => {
      console.warn(`[Navigation] Stage 2 is locked. Password verification on Stage 1 required.`);
      const input = document.getElementById('password-input');
      if (input) {
        input.focus();
        input.classList.remove('anim-shake');
        void input.offsetWidth;
        input.classList.add('anim-shake');
      }
    },
    onWelcomeCtaRequired: () => {
      console.warn(`[Navigation] Please click "Enter your birthday universe →" above to proceed to Stage 3.`);
      const ctaBtn = document.getElementById('btn-welcome-cta');
      if (ctaBtn) {
        ctaBtn.focus();
        ctaBtn.classList.remove('anim-shake');
        void ctaBtn.offsetWidth;
        ctaBtn.classList.add('anim-shake');
      }
    },
    onQuizRequired: () => {
      console.warn(`[Navigation] Please complete the Topper Test above to proceed to Stage 5.`);
      const quizActive = document.getElementById('quiz-view-active');
      const quizIntro = document.getElementById('quiz-view-intro');
      const targetCard = quizActive?.style.display !== 'none' ? quizActive : quizIntro;
      if (targetCard) {
        targetCard.classList.remove('anim-shake');
        void targetCard.offsetWidth;
        targetCard.classList.add('anim-shake');
      }
    },
    onGameRequired: () => {
      console.warn(`[Navigation] Please catch stars in Stage 5 to unlock Stage 6.`);
      const gamePlay = document.getElementById('game-view-play');
      const gameIntro = document.getElementById('game-view-intro');
      const targetCard = gamePlay?.style.display !== 'none' ? gamePlay : gameIntro;
      if (targetCard) {
        targetCard.classList.remove('anim-shake');
        void targetCard.offsetWidth;
        targetCard.classList.add('anim-shake');
      }
    },
  });

  // 3. Initialize Audio Controller (Persistent 2-track playlist)
  const audioController = new AudioController({
    config: config.audio,
    playerContainer: document.getElementById('music-player'),
    toggleButton: document.getElementById('btn-audio-toggle'),
  });

  // 4. Initialize Password Gate on Stage 1
  const passwordGate = new PasswordGate({
    config,
    navigation: nav,
    audioController,
  });

  // 4. Initialize Stage 2 Welcome Screen CTA
  const welcomeCtaBtn = document.getElementById('btn-welcome-cta');
  if (welcomeCtaBtn) {
    welcomeCtaBtn.addEventListener('click', (e) => {
      e.preventDefault();
      nav.completeWelcomeAndAdvance();
    });
  }

  // 5. Initialize Stage 3 Photo Gallery & Lightbox
  const galleryController = new GalleryController({
    config: config.gallery,
    gridContainer: document.getElementById('gallery-grid'),
    lightboxElement: document.getElementById('gallery-lightbox'),
  });

  // 6. Initialize Stage 4 The Official Topper Test (Quiz)
  const quizController = new QuizController({
    config: config.quiz,
    container: document.getElementById('stage-4'),
    onQuizCompleted: (score) => {
      console.log(`[Quiz] Topper Test completed with score: ${score}/5`);
      nav.unlockStage(4); // Stage 5 becomes unlocked
    },
    onContinue: () => {
      nav.completeQuizAndAdvance();
    },
  });

  // 7. Initialize Stage 5 Catch the Stars (Mini-Game)
  gameController = new GameController({
    config: config.game,
    container: document.getElementById('stage-5'),
    onGameCompleted: (score) => {
      console.log(`[Game] Catch the Stars completed with score: ${score}`);
      nav.unlockStage(5); // Stage 6 becomes unlocked
    },
    onContinue: () => {
      nav.completeGameAndAdvance();
    },
  });

  // 8. Populate Stage 6 Birthday Note Content
  renderBirthdayNote(config.birthdayNote);

  // 9. Initialize Stage 7 Birthday Finale
  const finaleController = new FinaleController({
    config: config.finale,
    container: document.getElementById('stage-7'),
    navigation: nav,
  });

  // Expose clean application interface for testing and inspector access
  window.__topperApp = {
    config,
    navigation: nav,
    passwordGate,
    galleryController,
    quizController,
    gameController,
    finaleController,
    audioController,
  };
});

/**
 * Renders structured paragraphs for the Stage 6 Birthday Note
 */
function renderBirthdayNote(noteConfig) {
  const container = document.getElementById('birthday-note-body');
  if (!container || !noteConfig || !Array.isArray(noteConfig.paragraphs)) return;

  container.innerHTML = '';
  noteConfig.paragraphs.forEach((pText) => {
    const p = document.createElement('p');
    p.className = 'stationery-paragraph';
    if (pText.includes('**')) {
      const safeText = pText
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      p.innerHTML = safeText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    } else {
      p.textContent = pText;
    }
    container.appendChild(p);
  });
}

/**
 * Propagates central config values to all DOM nodes declaring [data-config]
 * Ensures single source of truth for recipient identity, password hints, etc.
 */
function bindConfigToDOM(cfg) {
  const elements = document.querySelectorAll('[data-config]');
  elements.forEach((el) => {
    const path = el.getAttribute('data-config');
    if (!path) return;

    const value = path.split('.').reduce((acc, part) => acc && acc[part], cfg);
    if (value !== undefined) {
      el.textContent = String(value);
    }
  });
}
