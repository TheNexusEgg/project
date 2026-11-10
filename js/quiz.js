/**
 * PROJECT: TOPPER MOHTARMA
 * BATCH 4 — THE OFFICIAL TOPPER TEST (QUIZ CONTROLLER)
 * 
 * Manages:
 * - 5-question playful topper banter quiz
 * - Single-choice selection with immediate visual feedback
 * - Explanations for each answer
 * - Animated progress tracking
 * - Score calculation and friendly diagnostic verdict
 * - Seamless restart without whole-page refresh
 * - Unlocks Stage 5 upon completion
 */

export class QuizController {
  /**
   * @param {Object} options
   * @param {Object} options.config - Quiz configuration from config.quiz
   * @param {HTMLElement} options.container - Stage 4 container element
   * @param {Function} options.onQuizCompleted - Callback when quiz is finished
   * @param {Function} options.onContinue - Callback when user clicks Continue to Stage 5
   */
  constructor({ config, container, onQuizCompleted, onContinue }) {
    this.config = config || {};
    this.questions = this.config.questions || [];
    this.container = container;
    this.onQuizCompleted = onQuizCompleted || (() => {});
    this.onContinue = onContinue || (() => {});

    // State
    this.currentIndex = 0;
    this.score = 0;
    this.isAnswered = false;
    this.isCompleted = false;

    this.init();
  }

  init() {
    if (!this.container) return;

    // View containers
    this.viewIntro = this.container.querySelector('#quiz-view-intro');
    this.viewActive = this.container.querySelector('#quiz-view-active');
    this.viewResults = this.container.querySelector('#quiz-view-results');

    // Active Question Elements
    this.progressText = this.container.querySelector('#quiz-progress-text');
    this.progressBarFill = this.container.querySelector('#quiz-progress-fill');
    this.questionText = this.container.querySelector('#quiz-question-text');
    this.optionsContainer = this.container.querySelector('#quiz-options-container');
    this.explanationBox = this.container.querySelector('#quiz-explanation-box');
    this.explanationText = this.container.querySelector('#quiz-explanation-text');
    this.btnNext = this.container.querySelector('#quiz-btn-next');

    // Controls
    this.btnStart = this.container.querySelector('#quiz-btn-start');
    this.btnRestart = this.container.querySelector('#quiz-btn-restart');
    this.btnContinue = this.container.querySelector('#quiz-btn-continue');

    // Results Elements
    this.resultScore = this.container.querySelector('#quiz-result-score');
    this.resultTitle = this.container.querySelector('#quiz-result-title');
    this.resultMessage = this.container.querySelector('#quiz-result-message');
    this.resultWish = this.container.querySelector('#quiz-result-wish');

    this.bindEvents();
  }

  bindEvents() {
    if (this.btnStart) {
      this.btnStart.addEventListener('click', () => this.start());
    }

    if (this.btnNext) {
      this.btnNext.addEventListener('click', () => this.nextQuestion());
    }

    if (this.btnRestart) {
      this.btnRestart.addEventListener('click', () => this.restart());
    }

    if (this.btnContinue) {
      this.btnContinue.addEventListener('click', () => this.onContinue());
    }
  }

  /**
   * Starts the quiz from question 1
   */
  start() {
    this.currentIndex = 0;
    this.score = 0;
    this.isAnswered = false;

    if (this.viewIntro) this.viewIntro.style.display = 'none';
    if (this.viewResults) this.viewResults.style.display = 'none';
    if (this.viewActive) {
      this.viewActive.style.display = 'block';
      this.viewActive.classList.remove('anim-fade-in-up');
      void this.viewActive.offsetWidth;
      this.viewActive.classList.add('anim-fade-in-up');
    }

    this.renderQuestion(0);
  }

  /**
   * Renders the question at the specified index
   * @param {number} index
   */
  renderQuestion(index) {
    const q = this.questions[index];
    if (!q) return;

    this.isAnswered = false;
    const total = this.questions.length;

    // Update Progress Indicator
    if (this.progressText) {
      this.progressText.textContent = `Question ${index + 1} of ${total}`;
    }
    if (this.progressBarFill) {
      const pct = Math.round(((index + 1) / total) * 100);
      this.progressBarFill.style.width = `${pct}%`;
    }

    // Update Question Title
    if (this.questionText) {
      this.questionText.textContent = q.question;
    }

    // Clear and build options
    if (this.optionsContainer) {
      this.optionsContainer.innerHTML = '';
      const letters = ['A', 'B', 'C', 'D'];

      q.options.forEach((optText, optIdx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'quiz-option-btn';
        btn.dataset.index = String(optIdx);
        btn.setAttribute('role', 'radio');
        btn.setAttribute('aria-checked', 'false');

        btn.innerHTML = `
          <span class="option-badge">${letters[optIdx] || optIdx + 1}</span>
          <span class="option-text">${optText}</span>
          <span class="option-status-icon" aria-hidden="true"></span>
        `;

        btn.addEventListener('click', () => this.handleOptionSelect(optIdx));
        this.optionsContainer.appendChild(btn);
      });
    }

    // Reset Explanation & Next Button
    if (this.explanationBox) {
      this.explanationBox.style.display = 'none';
    }
    if (this.btnNext) {
      this.btnNext.style.display = 'none';
      const label = this.btnNext.querySelector('.btn-label') || this.btnNext;
      label.textContent = index === total - 1 ? 'See Official Diagnosis →' : 'Next Question →';
    }
  }

  /**
   * Handles user option selection
   * @param {number} selectedIdx
   */
  handleOptionSelect(selectedIdx) {
    if (this.isAnswered) return;
    this.isAnswered = true;

    const q = this.questions[this.currentIndex];
    const isCorrect = selectedIdx === q.correctAnswer;
    if (isCorrect) {
      this.score += 1;
    }

    const optionButtons = this.optionsContainer.querySelectorAll('.quiz-option-btn');
    optionButtons.forEach((btn, idx) => {
      btn.disabled = true;
      btn.setAttribute('aria-disabled', 'true');

      if (idx === q.correctAnswer) {
        btn.classList.add('is-correct');
        const icon = btn.querySelector('.option-status-icon');
        if (icon) icon.textContent = '✓';
      } else if (idx === selectedIdx && !isCorrect) {
        btn.classList.add('is-incorrect');
        const icon = btn.querySelector('.option-status-icon');
        if (icon) icon.textContent = '✕';
      } else {
        btn.classList.add('is-dimmed');
      }

      if (idx === selectedIdx) {
        btn.setAttribute('aria-checked', 'true');
      }
    });

    // Reveal Explanation
    if (this.explanationBox && this.explanationText) {
      this.explanationText.textContent = q.explanation;
      this.explanationBox.style.display = 'flex';
      this.explanationBox.classList.remove('anim-fade-in-up');
      void this.explanationBox.offsetWidth;
      this.explanationBox.classList.add('anim-fade-in-up');
    }

    // Reveal Next Button and gently focus it
    if (this.btnNext) {
      this.btnNext.style.display = 'inline-flex';
      this.btnNext.classList.remove('anim-fade-in');
      void this.btnNext.offsetWidth;
      this.btnNext.classList.add('anim-fade-in');
      setTimeout(() => this.btnNext.focus(), 80);
    }
  }

  /**
   * Advances to next question or shows results
   */
  nextQuestion() {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex += 1;
      this.renderQuestion(this.currentIndex);
    } else {
      this.showResults();
    }
  }

  /**
   * Displays the final results screen and notifies navigation
   */
  showResults() {
    this.isCompleted = true;

    if (this.viewActive) this.viewActive.style.display = 'none';
    if (this.viewIntro) this.viewIntro.style.display = 'none';
    if (this.viewResults) {
      this.viewResults.style.display = 'block';
      this.viewResults.classList.remove('anim-fade-in-up');
      void this.viewResults.offsetWidth;
      this.viewResults.classList.add('anim-fade-in-up');
    }

    const total = this.questions.length;
    if (this.resultScore) {
      this.resultScore.textContent = `${this.score} / ${total}`;
    }

    // Determine diagnosis verdict based on score
    const resultsConfig = this.config.results || {};
    let verdict;
    if (this.score === 5) {
      verdict = resultsConfig.high;
    } else if (this.score >= 3) {
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

    // Notify stage completion so Stage 5 unlocks!
    this.onQuizCompleted(this.score);
  }

  /**
   * Resets and restarts quiz
   */
  restart() {
    this.start();
  }

  /**
   * Status check
   */
  getIsCompleted() {
    return this.isCompleted;
  }
}
