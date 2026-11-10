/**
 * PROJECT: TOPPER MOHTARMA
 * BATCH 5 — CATCH THE STARS (MINI-GAME CONTROLLER)
 * 
 * Features:
 * - 30-second reflex starlight mini-game
 * - Responsive star arena with touch & mouse interaction
 * - Visible countdown timer and real-time score display
 * - Dynamic star spawning with soft cosmic glow and pop micro-interactions
 * - Safe timer management with memory leak protection
 * - Stage departure cleanup (stops loops when leaving Stage 5)
 * - Friendly performance diagnosis and replay capability
 * - Unlocks Stage 6 upon game completion
 */

export class GameController {
  /**
   * @param {Object} options
   * @param {Object} options.config - Game configuration from config.game
   * @param {HTMLElement} options.container - Stage 5 container element
   * @param {Function} options.onGameCompleted - Callback when game completes
   * @param {Function} options.onContinue - Callback when user clicks Continue to Stage 6
   */
  constructor({ config, container, onGameCompleted, onContinue }) {
    this.config = config || {};
    this.container = container;
    this.onGameCompleted = onGameCompleted || (() => {});
    this.onContinue = onContinue || (() => {});

    // Game Settings
    this.duration = this.config.duration || 30;
    this.maxActiveStars = this.config.maxActiveStars || 6;
    this.spawnIntervalMs = this.config.spawnIntervalMs || 650;
    this.starLifetimeMs = this.config.starLifetimeMs || 2600;

    // Runtime State
    this.score = 0;
    this.timeLeft = this.duration;
    this.isPlaying = false;
    this.isCompleted = false;
    this.timerInterval = null;
    this.spawnInterval = null;
    this.activeStars = new Set();
    this.starTimeouts = new Set();

    this.init();
  }

  init() {
    if (!this.container) return;

    // Views
    this.viewIntro = this.container.querySelector('#game-view-intro');
    this.viewPlay = this.container.querySelector('#game-view-play');
    this.viewResults = this.container.querySelector('#game-view-results');

    // Play Stage Elements
    this.arena = this.container.querySelector('#game-arena');
    this.timerDisplay = this.container.querySelector('#game-timer-display');
    this.scoreDisplay = this.container.querySelector('#game-score-display');
    this.btnStop = this.container.querySelector('#game-btn-stop');

    // Action Controls
    this.btnStart = this.container.querySelector('#game-btn-start');
    this.btnRestart = this.container.querySelector('#game-btn-restart');
    this.btnContinue = this.container.querySelector('#game-btn-continue');

    // Results Elements
    this.resultScore = this.container.querySelector('#game-result-score');
    this.resultTitle = this.container.querySelector('#game-result-title');
    this.resultMessage = this.container.querySelector('#game-result-message');
    this.resultWish = this.container.querySelector('#game-result-wish');

    this.bindEvents();
  }

  bindEvents() {
    if (this.btnStart) {
      this.btnStart.addEventListener('click', () => this.start());
    }

    if (this.btnRestart) {
      this.btnRestart.addEventListener('click', () => this.restart());
    }

    if (this.btnContinue) {
      this.btnContinue.addEventListener('click', () => this.onContinue());
    }

    if (this.btnStop) {
      this.btnStop.addEventListener('click', () => {
        if (this.isPlaying) {
          this.endGame();
        }
      });
    }
  }

  /**
   * Starts a fresh 30-second game round
   */
  start() {
    this.cleanupTimers();

    this.score = 0;
    this.timeLeft = this.duration;
    this.isPlaying = true;

    // Update View Visibility
    if (this.viewIntro) this.viewIntro.style.display = 'none';
    if (this.viewResults) this.viewResults.style.display = 'none';
    if (this.viewPlay) {
      this.viewPlay.style.display = 'block';
      this.viewPlay.classList.remove('anim-fade-in-up');
      void this.viewPlay.offsetWidth;
      this.viewPlay.classList.add('anim-fade-in-up');
    }

    // Reset HUD
    if (this.timerDisplay) {
      this.timerDisplay.textContent = `${this.timeLeft}s`;
      this.timerDisplay.classList.remove('is-urgent');
    }
    if (this.scoreDisplay) {
      this.scoreDisplay.textContent = '0';
    }

    // Clear Arena
    if (this.arena) {
      this.arena.innerHTML = '';
    }

    // Spawn initial wave of stars
    this.spawnStar();
    this.spawnStar();

    // 1. Timer Countdown Interval (Every 1 second)
    this.timerInterval = window.setInterval(() => {
      this.timeLeft -= 1;

      if (this.timerDisplay) {
        this.timerDisplay.textContent = `${this.timeLeft}s`;
        if (this.timeLeft <= 5) {
          this.timerDisplay.classList.add('is-urgent');
        }
      }

      if (this.timeLeft <= 0) {
        this.endGame();
      }
    }, 1000);

    // 2. Star Spawning Interval
    this.spawnInterval = window.setInterval(() => {
      if (!this.isPlaying) return;

      if (this.activeStars.size < this.maxActiveStars) {
        this.spawnStar();
      }
    }, this.spawnIntervalMs);
  }

  /**
   * Spawns an interactive starlight target inside the arena
   */
  spawnStar() {
    if (!this.arena || !this.isPlaying) return;

    const star = document.createElement('button');
    star.type = 'button';
    star.className = 'star-target';
    star.setAttribute('aria-label', 'Collect falling star');
    star.setAttribute('tabindex', '0');

    // Dimension calculation with safe padding
    const arenaRect = this.arena.getBoundingClientRect();
    const starSize = 52; // Target size for comfortable touch
    const maxX = Math.max(10, arenaRect.width - starSize - 16);
    const maxY = Math.max(10, arenaRect.height - starSize - 16);

    const left = Math.floor(Math.random() * maxX) + 8;
    const top = Math.floor(Math.random() * maxY) + 8;

    star.style.left = `${left}px`;
    star.style.top = `${top}px`;

    // SVG Star Graphic with soft golden glow
    star.innerHTML = `
      <svg class="star-icon" viewBox="0 0 24 24" width="34" height="34" fill="currentColor">
        <path d="M12 2l2.6 7.2h7.4l-6 4.4 2.3 7.4-6.3-4.6-6.3 4.6 2.3-7.4-6-4.4h7.4z"/>
      </svg>
      <span class="star-sparkle-ring"></span>
    `;

    // Collection Handler (Pointerdown & Click for ultra-responsive mobile taps)
    let collected = false;
    const handleCollect = (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (collected || !this.isPlaying) return;
      collected = true;

      this.score += 1;
      if (this.scoreDisplay) {
        this.scoreDisplay.textContent = String(this.score);
        this.scoreDisplay.classList.remove('anim-bounce-short');
        void this.scoreDisplay.offsetWidth;
        this.scoreDisplay.classList.add('anim-bounce-short');
      }

      // Pop & Sparkle Animation
      star.classList.add('is-collected');
      this.activeStars.delete(star);

      // Lightweight vibration on mobile where supported
      if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
        try {
          navigator.vibrate(12);
        } catch (_) {}
      }

      setTimeout(() => {
        if (star.parentNode) {
          star.parentNode.removeChild(star);
        }
      }, 160);
    };

    star.addEventListener('pointerdown', handleCollect);
    star.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        handleCollect(e);
      }
    });

    this.arena.appendChild(star);
    this.activeStars.add(star);

    // Auto-fade star if left uncollected
    const lifetimeTimeout = window.setTimeout(() => {
      this.starTimeouts.delete(lifetimeTimeout);
      if (!collected && star.parentNode) {
        star.classList.add('is-fading');
        this.activeStars.delete(star);
        setTimeout(() => {
          if (star.parentNode) {
            star.parentNode.removeChild(star);
          }
        }, 300);
      }
    }, this.starLifetimeMs);

    this.starTimeouts.add(lifetimeTimeout);
  }

  /**
   * Concludes the game round and displays performance results
   */
  endGame() {
    this.cleanupTimers();
    this.isPlaying = false;
    this.isCompleted = true;

    // Clear active arena targets
    if (this.arena) {
      this.arena.innerHTML = '';
    }

    // Switch to Results View
    if (this.viewPlay) this.viewPlay.style.display = 'none';
    if (this.viewIntro) this.viewIntro.style.display = 'none';
    if (this.viewResults) {
      this.viewResults.style.display = 'block';
      this.viewResults.classList.remove('anim-fade-in-up');
      void this.viewResults.offsetWidth;
      this.viewResults.classList.add('anim-fade-in-up');
    }

    // Update Result Score
    if (this.resultScore) {
      this.resultScore.textContent = String(this.score);
    }

    // Determine performance message based on score thresholds
    const resultsConfig = this.config.results || {};
    let verdict;
    if (this.score >= (resultsConfig.high?.threshold ?? 20)) {
      verdict = resultsConfig.high;
    } else if (this.score >= (resultsConfig.medium?.threshold ?? 10)) {
      verdict = resultsConfig.medium;
    } else {
      verdict = resultsConfig.low;
    }

    if (verdict) {
      if (this.resultTitle) this.resultTitle.textContent = verdict.title;
      if (this.resultMessage) this.resultMessage.textContent = verdict.message;
    }

    if (this.resultWish) {
      this.resultWish.textContent = this.config.birthdayWish || '';
    }

    // Notify stage completion so Stage 6 unlocks!
    this.onGameCompleted(this.score);
  }

  /**
   * Restarts the game
   */
  restart() {
    this.start();
  }

  /**
   * Completely pauses/stops any running loop (called when navigating away from Stage 5)
   */
  stop() {
    this.cleanupTimers();
    this.isPlaying = false;
    if (this.arena) {
      this.arena.innerHTML = '';
    }
  }

  /**
   * Cleans up all intervals and timeouts to prevent background execution
   */
  cleanupTimers() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    if (this.spawnInterval) {
      clearInterval(this.spawnInterval);
      this.spawnInterval = null;
    }

    this.starTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
    this.starTimeouts.clear();
    this.activeStars.clear();
  }

  /**
   * Status check
   */
  getIsCompleted() {
    return this.isCompleted;
  }
}
