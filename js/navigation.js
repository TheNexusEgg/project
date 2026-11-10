/**
 * PROJECT: TOPPER MOHTARMA
 * BATCH 2.1 — GUIDED NAVIGATION CONTROLLER WITH STAGE 2 CTA ENFORCEMENT
 * 
 * Manages strict sequential stage progression:
 * 1. Stage 1 is locked behind password verification.
 * 2. Stage 2 requires clicking the "Enter your birthday universe" CTA to unlock Stage 3.
 *    Generic footer Next and ArrowRight cannot bypass the Stage 2 CTA.
 * 3. Back navigation remains functional across all visited stages.
 * 4. Previously visited stages remain accessible.
 */

export class NavigationController {
  /**
   * @param {Object} options
   * @param {Array} options.stages - Stages metadata array from config
   * @param {HTMLElement} options.prevButton - Back navigation button
   * @param {HTMLElement} options.nextButton - Next navigation button
   * @param {HTMLElement} options.progressLabel - Progress text label element
   * @param {HTMLElement} options.progressSteps - Progress steps container element
   * @param {HTMLElement} options.summaryNumber - Footer summary stage number
   * @param {HTMLElement} options.summaryTitle - Footer summary stage title
   * @param {Function} [options.onStageChange] - Callback invoked upon stage change
   * @param {Function} [options.onGateBlocked] - Callback invoked when a Stage 1 bypass is attempted
   * @param {Function} [options.onWelcomeCtaRequired] - Callback invoked when Stage 2 forward bypass is attempted
   */
  constructor({
    stages,
    prevButton,
    nextButton,
    progressLabel,
    progressSteps,
    summaryNumber,
    summaryTitle,
    onStageChange,
    onGateBlocked,
    onWelcomeCtaRequired,
    onQuizRequired,
    onGameRequired,
  }) {
    this.stages = stages;
    this.prevButton = prevButton;
    this.nextButton = nextButton;
    this.progressLabel = progressLabel;
    this.progressSteps = progressSteps;
    this.summaryNumber = summaryNumber;
    this.summaryTitle = summaryTitle;
    this.onStageChange = onStageChange || (() => {});
    this.onGateBlocked = onGateBlocked || (() => {});
    this.onWelcomeCtaRequired = onWelcomeCtaRequired || (() => {});
    this.onQuizRequired = onQuizRequired || (() => {});
    this.onGameRequired = onGameRequired || (() => {});

    // State
    this.currentIndex = 0;
    this.maxUnlockedIndex = 0;
    this.isGateUnlocked = false;
    this.isWelcomeCtaCompleted = false;
    this.isQuizCompleted = false;
    this.isGameCompleted = false;

    this.init();
  }

  init() {
    this.renderStepNodes();
    this.bindEvents();
    this.updateUI();
  }

  /**
   * Renders step nodes in the progress indicator
   */
  renderStepNodes() {
    if (!this.progressSteps) return;

    this.progressSteps.innerHTML = '';
    this.stages.forEach((stage, idx) => {
      const node = document.createElement('button');
      node.type = 'button';
      node.className = 'step-node';
      node.textContent = String(stage.stageNumber);
      node.dataset.index = String(idx);

      // Clicking a node is only permitted if that stage is unlocked and gates are satisfied
      node.addEventListener('click', () => {
        if (idx === this.currentIndex) return;

        // Block leaving Stage 1 to a future stage if gate is locked
        if (this.currentIndex === 0 && idx > 0 && !this.isGateUnlocked) {
          this.onGateBlocked();
          return;
        }

        // Block leaving Stage 2 to Stage 3 or beyond if Welcome CTA has not been clicked
        if (this.currentIndex === 1 && idx > 1 && !this.isWelcomeCtaCompleted) {
          this.onWelcomeCtaRequired();
          return;
        }

        // Block leaving Stage 4 to Stage 5 or beyond if Quiz not completed
        if (this.currentIndex === 3 && idx > 3 && !this.isQuizCompleted) {
          this.onQuizRequired();
          return;
        }

        // Block leaving Stage 5 to Stage 6 or beyond if Game not completed
        if (this.currentIndex === 4 && idx > 4 && !this.isGameCompleted) {
          this.onGameRequired();
          return;
        }

        if (idx <= this.maxUnlockedIndex) {
          this.goTo(idx);
        }
      });

      this.progressSteps.appendChild(node);
    });
  }

  bindEvents() {
    if (this.prevButton) {
      this.prevButton.addEventListener('click', () => this.prev());
    }

    if (this.nextButton) {
      this.nextButton.addEventListener('click', () => this.next());
    }

    // Keyboard navigation (ArrowLeft & ArrowRight)
    window.addEventListener('keydown', (e) => {
      // Do not intercept keystrokes if focused inside inputs or textareas, or if lightbox is open
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName) || document.body.classList.contains('lightbox-open')) {
        return;
      }

      if (e.key === 'ArrowRight') {
        // Prevent bypassing password gate via keyboard on Stage 1
        if (this.currentIndex === 0 && !this.isGateUnlocked) {
          this.onGateBlocked();
          return;
        }
        // Prevent bypassing Welcome CTA via keyboard on Stage 2
        if (this.currentIndex === 1 && !this.isWelcomeCtaCompleted) {
          this.onWelcomeCtaRequired();
          return;
        }
        // Prevent bypassing Quiz on Stage 4
        if (this.currentIndex === 3 && !this.isQuizCompleted) {
          this.onQuizRequired();
          return;
        }
        // Prevent bypassing Game on Stage 5
        if (this.currentIndex === 4 && !this.isGameCompleted) {
          this.onGameRequired();
          return;
        }
        this.next();
      } else if (e.key === 'ArrowLeft') {
        this.prev();
      }
    });
  }

  /**
   * Advance to the next stage in sequence
   */
  next() {
    // 1. Stage 1 password gate enforcement
    if (this.currentIndex === 0 && !this.isGateUnlocked) {
      this.onGateBlocked();
      return false;
    }

    // 2. Stage 2 Welcome CTA enforcement: must use the dedicated button on the page
    if (this.currentIndex === 1 && !this.isWelcomeCtaCompleted) {
      this.onWelcomeCtaRequired();
      return false;
    }

    // 3. Stage 4 Topper Quiz enforcement
    if (this.currentIndex === 3 && !this.isQuizCompleted) {
      this.onQuizRequired();
      return false;
    }

    // 4. Stage 5 Catch the Stars Game enforcement
    if (this.currentIndex === 4 && !this.isGameCompleted) {
      this.onGameRequired();
      return false;
    }

    if (this.currentIndex < this.stages.length - 1) {
      const targetIndex = this.currentIndex + 1;
      if (targetIndex > this.maxUnlockedIndex) {
        this.maxUnlockedIndex = targetIndex;
      }
      this.goTo(targetIndex);
      return true;
    }

    return false;
  }

  /**
   * Return to the previous stage in sequence
   */
  prev() {
    if (this.currentIndex > 0) {
      this.goTo(this.currentIndex - 1);
      return true;
    }
    return false;
  }

  /**
   * Jump to a specific stage index (only if unlocked and permitted)
   * @param {number} targetIndex
   */
  goTo(targetIndex) {
    if (targetIndex < 0 || targetIndex >= this.stages.length) return false;

    // Strict gate requirement: cannot jump past Stage 1 if gate is locked
    if (targetIndex > 0 && !this.isGateUnlocked) {
      this.onGateBlocked();
      return false;
    }

    // Strict Stage 2 CTA requirement: cannot jump past Stage 2 if CTA not completed
    if (targetIndex > 1 && !this.isWelcomeCtaCompleted) {
      this.onWelcomeCtaRequired();
      return false;
    }

    // Strict Stage 4 Quiz requirement: cannot jump past Stage 4 if Quiz not completed
    if (targetIndex > 3 && !this.isQuizCompleted) {
      this.onQuizRequired();
      return false;
    }

    // Strict Stage 5 Game requirement: cannot jump past Stage 5 if Game not completed
    if (targetIndex > 4 && !this.isGameCompleted) {
      this.onGameRequired();
      return false;
    }

    // Strict sequential requirement: cannot jump past maxUnlockedIndex
    if (targetIndex > this.maxUnlockedIndex) {
      return false;
    }

    this.currentIndex = targetIndex;
    this.updateUI();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    this.onStageChange(this.getCurrentStage());
    return true;
  }

  /**
   * Unlocks the password gate and transitions to Stage 2
   */
  unlockGateAndAdvance() {
    this.isGateUnlocked = true;
    if (this.maxUnlockedIndex < 1) {
      this.maxUnlockedIndex = 1;
    }
    this.goTo(1); // Advance to Stage 2 (Welcome)
  }

  /**
   * Completes the Stage 2 Welcome CTA and advances to Stage 3
   */
  completeWelcomeAndAdvance() {
    this.isWelcomeCtaCompleted = true;
    if (this.maxUnlockedIndex < 2) {
      this.maxUnlockedIndex = 2;
    }
    this.goTo(2); // Advance to Stage 3 (Archive)
  }

  /**
   * Completes the Stage 4 Topper Quiz and advances to Stage 5
   */
  completeQuizAndAdvance() {
    this.isQuizCompleted = true;
    if (this.maxUnlockedIndex < 4) {
      this.maxUnlockedIndex = 4;
    }
    this.goTo(4); // Advance to Stage 5 (Stars Game)
  }

  /**
   * Completes the Stage 5 Catch the Stars Game and advances to Stage 6
   */
  completeGameAndAdvance() {
    this.isGameCompleted = true;
    if (this.maxUnlockedIndex < 5) {
      this.maxUnlockedIndex = 5;
    }
    this.goTo(5); // Advance to Stage 6 (Birthday Note)
  }

  /**
   * Status check for gate
   */
  getIsGateUnlocked() {
    return this.isGateUnlocked;
  }

  /**
   * Status check for welcome CTA
   */
  getIsWelcomeCtaCompleted() {
    return this.isWelcomeCtaCompleted;
  }

  /**
   * Status check for quiz completion
   */
  getIsQuizCompleted() {
    return this.isQuizCompleted;
  }

  /**
   * Status check for game completion
   */
  getIsGameCompleted() {
    return this.isGameCompleted;
  }

  /**
   * Programmatically unlock a stage (for future mini-games or milestones)
   * @param {number} stageIndex
   */
  unlockStage(stageIndex) {
    if (stageIndex >= 0 && stageIndex < this.stages.length) {
      if (stageIndex > this.maxUnlockedIndex) {
        this.maxUnlockedIndex = stageIndex;
        this.updateUI();
      }
    }
  }

  /**
   * Resets the entire experience back to Stage 1 (Password Entrance) for a full replay
   */
  resetToBeginning() {
    this.currentIndex = 0;
    this.maxUnlockedIndex = 0;
    this.isGateUnlocked = false;
    this.isWelcomeCtaCompleted = false;
    this.isQuizCompleted = false;
    this.isGameCompleted = false;

    // Reset password input in Stage 1
    const pwdInput = document.getElementById('password-input');
    if (pwdInput) {
      pwdInput.value = '';
    }
    const pwdFeedback = document.getElementById('password-feedback');
    if (pwdFeedback) {
      pwdFeedback.textContent = '';
      pwdFeedback.className = 'password-feedback';
    }

    this.updateUI();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.onStageChange(this.getCurrentStage());
  }

  /**
   * Get the active stage object
   */
  getCurrentStage() {
    return this.stages[this.currentIndex];
  }

  /**
   * Get the highest unlocked stage index
   */
  getMaxUnlockedIndex() {
    return this.maxUnlockedIndex;
  }

  /**
   * Synchronize DOM classes, attributes, themes, and button states
   */
  updateUI() {
    const current = this.getCurrentStage();
    const total = this.stages.length;

    // 1. Show active section, hide others
    this.stages.forEach((stage, idx) => {
      const el = document.querySelector(stage.selector);
      if (el) {
        if (idx === this.currentIndex) {
          el.classList.add('is-active');
        } else {
          el.classList.remove('is-active');
        }
      }
    });

    // 2. Synchronize body theme (dark / light)
    document.body.setAttribute('data-theme', current.theme);

    // 3. Update progress label
    if (this.progressLabel) {
      this.progressLabel.textContent = `Stage ${current.stageNumber} of ${total}: ${current.shortLabel}`;
    }

    // 4. Update step nodes in progress bar (active, completed, locked)
    if (this.progressSteps) {
      const nodes = this.progressSteps.querySelectorAll('.step-node');
      nodes.forEach((node, idx) => {
        node.classList.remove('is-active', 'is-completed', 'is-locked');
        node.removeAttribute('aria-current');

        if (idx === this.currentIndex) {
          node.classList.add('is-active');
          node.setAttribute('aria-current', 'step');
          node.disabled = false;
          node.setAttribute('aria-disabled', 'false');
          node.setAttribute('title', `Current: Stage ${idx + 1} (${this.stages[idx].shortLabel})`);
        } else if (idx <= this.maxUnlockedIndex) {
          node.classList.add('is-completed');
          node.disabled = false;
          node.setAttribute('aria-disabled', 'false');
          node.setAttribute('title', `Revisit: Stage ${idx + 1} (${this.stages[idx].shortLabel})`);
        } else {
          node.classList.add('is-locked');
          node.disabled = true;
          node.setAttribute('aria-disabled', 'true');
          node.setAttribute('title', `Locked: Stage ${idx + 1}`);
        }
      });
    }

    // 5. Update Prev Button (disabled on stage 1)
    if (this.prevButton) {
      const isFirst = this.currentIndex === 0;
      this.prevButton.disabled = isFirst;
      this.prevButton.setAttribute('aria-disabled', String(isFirst));
    }

    // 6. Update Next Button state based on gates & stage boundaries
    if (this.nextButton) {
      const isLast = this.currentIndex === total - 1;
      const isBlockedByGate = this.currentIndex === 0 && !this.isGateUnlocked;
      const isBlockedByWelcomeCta = this.currentIndex === 1 && !this.isWelcomeCtaCompleted;
      const isBlockedByQuiz = this.currentIndex === 3 && !this.isQuizCompleted;
      const isBlockedByGame = this.currentIndex === 4 && !this.isGameCompleted;

      const labelSpan = this.nextButton.querySelector('.btn-label') || this.nextButton;

      if (isLast) {
        this.nextButton.disabled = true;
        this.nextButton.setAttribute('aria-disabled', 'true');
        this.nextButton.setAttribute('title', 'Experience completed');
        if (labelSpan) labelSpan.textContent = 'Experience Completed';
      } else if (isBlockedByGate) {
        // Stage 1 locked: Next button disabled
        this.nextButton.disabled = true;
        this.nextButton.setAttribute('aria-disabled', 'true');
        this.nextButton.setAttribute('title', 'Enter the correct password on Stage 1 to unlock');
        if (labelSpan) labelSpan.textContent = '🔒 Password Required';
      } else if (isBlockedByWelcomeCta) {
        // Stage 2 locked behind the "Enter your birthday universe" CTA button
        this.nextButton.disabled = true;
        this.nextButton.setAttribute('aria-disabled', 'true');
        this.nextButton.setAttribute('title', 'Click "Enter your birthday universe →" above to proceed');
        if (labelSpan) labelSpan.textContent = 'Use CTA Above ↑';
      } else if (isBlockedByQuiz) {
        // Stage 4 locked behind completing the Topper Quiz
        this.nextButton.disabled = true;
        this.nextButton.setAttribute('aria-disabled', 'true');
        this.nextButton.setAttribute('title', 'Complete the Topper Test to unlock Stage 5');
        if (labelSpan) labelSpan.textContent = 'Complete Quiz Above ↑';
      } else if (isBlockedByGame) {
        // Stage 5 locked behind completing the Catch the Stars Game
        this.nextButton.disabled = true;
        this.nextButton.setAttribute('aria-disabled', 'true');
        this.nextButton.setAttribute('title', 'Catch the stars to unlock Stage 6');
        if (labelSpan) labelSpan.textContent = 'Complete Game Above ↑';
      } else {
        // Normal sequential navigation when unlocked
        this.nextButton.disabled = false;
        this.nextButton.setAttribute('aria-disabled', 'false');
        this.nextButton.setAttribute('title', `Proceed to Stage ${this.currentIndex + 2}`);
        if (labelSpan) labelSpan.textContent = 'Next Stage →';
      }
    }

    // 7. Update footer summary text
    if (this.summaryNumber) {
      this.summaryNumber.textContent = `Stage ${current.stageNumber} of ${total}`;
    }
    if (this.summaryTitle) {
      this.summaryTitle.textContent = current.title;
    }
  }
}
