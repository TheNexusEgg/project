/**
 * PROJECT: TOPPER MOHTARMA
 * BATCH 2 — SECRET ENTRANCE & PASSWORD VALIDATION
 * 
 * Modular controller managing password input, show/hide toggle,
 * playful error feedback rotation, double-submission prevention,
 * and smooth unlock transitions into Stage 2.
 */

export class PasswordGate {
  /**
   * @param {Object} options
   * @param {Object} options.config - Central configuration
   * @param {Object} options.navigation - NavigationController instance
   * @param {Object} [options.audioController] - Persistent AudioController instance
   */
  constructor({ config, navigation, audioController }) {
    this.config = config;
    this.navigation = navigation;
    this.audioController = audioController;

    // DOM Elements
    this.form = document.getElementById('password-form');
    this.input = document.getElementById('password-input');
    this.toggleBtn = document.getElementById('btn-toggle-password');
    this.submitBtn = document.getElementById('btn-submit-password');
    this.feedbackEl = document.getElementById('password-feedback');
    this.stageSection = document.getElementById('stage-1');

    this.isSubmitting = false;
    this.feedbackIndex = 0;

    this.init();
  }

  init() {
    if (!this.form || !this.input) return;

    this.bindEvents();
  }

  bindEvents() {
    // Show / Hide Password Toggle
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.togglePasswordVisibility();
      });
    }

    // Form Submission (handles button click & Enter key in input)
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });

    // Clear error message on new typing
    this.input.addEventListener('input', () => {
      if (this.feedbackEl && this.feedbackEl.classList.contains('is-error')) {
        this.clearFeedback();
      }
    });
  }

  /**
   * Toggles the input between masked password and plain text
   */
  togglePasswordVisibility() {
    const isPassword = this.input.type === 'password';
    this.input.type = isPassword ? 'text' : 'password';

    const textSpan = this.toggleBtn.querySelector('.toggle-label');
    const iconSpan = this.toggleBtn.querySelector('.toggle-icon');

    if (isPassword) {
      this.toggleBtn.setAttribute('aria-label', 'Hide password');
      this.toggleBtn.title = 'Hide password';
      if (textSpan) textSpan.textContent = 'Hide';
      if (iconSpan) iconSpan.textContent = '🙈';
    } else {
      this.toggleBtn.setAttribute('aria-label', 'Show password');
      this.toggleBtn.title = 'Show password';
      if (textSpan) textSpan.textContent = 'Show';
      if (iconSpan) iconSpan.textContent = '👁️';
    }

    this.input.focus();
  }

  /**
   * Validates the password and triggers appropriate feedback or unlock
   */
  handleSubmit() {
    if (this.isSubmitting) return;

    const rawValue = this.input.value || '';
    const cleanAttempt = rawValue.trim().toLowerCase();
    const correctPassword = (this.config.security.password || '').trim().toLowerCase();

    if (!cleanAttempt) {
      this.showError('Please enter the secret password to proceed.');
      this.input.focus();
      return;
    }

    if (cleanAttempt === correctPassword) {
      this.handleSuccess();
    } else {
      this.handleFailure();
    }
  }

  /**
   * Handles incorrect password attempts with playful feedback
   */
  handleFailure() {
    const messages = this.config.security.incorrectFeedback || [
      'Hmm... even the topper needs another attempt.',
    ];

    const currentMsg = messages[this.feedbackIndex % messages.length];
    this.feedbackIndex++;

    this.showError(currentMsg);

    // Apply shake animation
    this.input.classList.remove('anim-shake');
    // Trigger reflow to restart animation
    void this.input.offsetWidth;
    this.input.classList.add('anim-shake');

    this.input.focus();
    this.input.select();
  }

  /**
   * Handles correct password entry and coordinates the unlock transition
   */
  handleSuccess() {
    this.isSubmitting = true;

    // 1. Show success feedback
    this.showSuccess('Access granted. The birthday mission begins...');

    // 2. Set button success state
    if (this.submitBtn) {
      this.submitBtn.disabled = true;
      this.submitBtn.classList.add('btn-success');
      const label = this.submitBtn.querySelector('.btn-label') || this.submitBtn;
      label.textContent = '✓ Verified! Unlocking...';
    }

    // 3. Trigger smooth unlock transition
    if (this.stageSection) {
      this.stageSection.classList.add('anim-unlock-out');
    }

    // 4. Start background music on user password entry gesture
    if (this.audioController) {
      this.audioController.startOnEntry();
    } else if (window.__topperApp && window.__topperApp.audioController) {
      window.__topperApp.audioController.startOnEntry();
    }

    // 5. Advance through NavigationController after brief transition
    window.setTimeout(() => {
      this.navigation.unlockGateAndAdvance();

      // Reset button and input state cleanly
      if (this.stageSection) {
        this.stageSection.classList.remove('anim-unlock-out');
      }
      if (this.submitBtn) {
        this.submitBtn.disabled = false;
        this.submitBtn.classList.remove('btn-success');
        const label = this.submitBtn.querySelector('.btn-label') || this.submitBtn;
        label.textContent = 'Unlock the surprise';
      }
      this.isSubmitting = false;
    }, 450);
  }

  showError(message) {
    if (!this.feedbackEl) return;
    this.feedbackEl.textContent = message;
    this.feedbackEl.className = 'password-feedback is-error anim-fade-in';
    this.feedbackEl.setAttribute('role', 'alert');
  }

  showSuccess(message) {
    if (!this.feedbackEl) return;
    this.feedbackEl.textContent = message;
    this.feedbackEl.className = 'password-feedback is-success anim-fade-in';
    this.feedbackEl.setAttribute('role', 'status');
  }

  clearFeedback() {
    if (!this.feedbackEl) return;
    this.feedbackEl.textContent = '';
    this.feedbackEl.className = 'password-feedback';
    this.feedbackEl.removeAttribute('role');
  }
}
