/**
 * PROJECT: TOPPER MOHTARMA
 * BATCH 6 — THE BIRTHDAY FINALE CONTROLLER
 * 
 * Features:
 * - Stage 7 introductory surprise reveal
 * - Interactive CSS illustrated birthday cake with flickering candle flame
 * - "Make a Wish" interaction that extinguishes the candle flame with smoke effect
 * - Lightweight, self-cleaning vanilla JS confetti celebration (respects prefers-reduced-motion)
 * - Prominent closing birthday message
 * - Keepsake digital award certificate with real 1-click Canvas PNG download & Print / PDF support
 * - Replay from beginning capability resetting sequential progress cleanly
 * - Direct return to Birthday Note
 */

export class FinaleController {
  /**
   * @param {Object} options
   * @param {Object} options.config - Finale configuration from config.finale
   * @param {HTMLElement} options.container - Stage 7 container element
   * @param {Object} options.navigation - NavigationController instance
   */
  constructor({ config, container, navigation }) {
    this.config = config || {};
    this.container = container;
    this.navigation = navigation;

    // State
    this.isRevealed = false;
    this.isCandleBlown = false;
    this.confettiRunning = false;

    this.init();
  }

  init() {
    if (!this.container) return;

    // View Containers
    this.viewIntro = this.container.querySelector('#finale-view-intro');
    this.viewCelebration = this.container.querySelector('#finale-view-celebration');

    // Controls
    this.btnReveal = this.container.querySelector('#finale-btn-reveal');
    this.btnWish = this.container.querySelector('#finale-btn-wish');
    this.btnDownload = this.container.querySelector('#finale-btn-download');
    this.btnPrint = this.container.querySelector('#finale-btn-print');
    this.btnReplay = this.container.querySelector('#finale-btn-replay');
    this.btnBackNote = this.container.querySelector('#finale-btn-back-note');

    // Interactive Cake Elements
    this.candleFlame = this.container.querySelector('#cake-candle-flame');
    this.candleSmoke = this.container.querySelector('#cake-candle-smoke');
    this.postWishReveal = this.container.querySelector('#finale-post-wish-reveal');

    this.bindEvents();
  }

  bindEvents() {
    // 1. Reveal Surprise
    if (this.btnReveal) {
      this.btnReveal.addEventListener('click', () => this.revealSurprise());
    }

    // 2. Make a Wish & Blow Candle
    if (this.btnWish) {
      this.btnWish.addEventListener('click', () => this.makeWish());
    }

    // 3. Download Certificate as PNG
    if (this.btnDownload) {
      this.btnDownload.addEventListener('click', () => this.downloadCertificate());
    }

    // 4. Print / Save PDF Certificate
    if (this.btnPrint) {
      this.btnPrint.addEventListener('click', () => window.print());
    }

    // 5. Replay Experience
    if (this.btnReplay) {
      this.btnReplay.addEventListener('click', () => this.replay());
    }

    // 6. Back to Birthday Note
    if (this.btnBackNote) {
      this.btnBackNote.addEventListener('click', () => {
        if (this.navigation) {
          this.navigation.goTo(5); // Go back to Stage 6 (Birthday Note)
        }
      });
    }
  }

  /**
   * Transition from Intro to Active Cake Reveal
   */
  revealSurprise() {
    this.isRevealed = true;
    if (this.viewIntro) this.viewIntro.style.display = 'none';
    if (this.viewCelebration) {
      this.viewCelebration.style.display = 'block';
      this.viewCelebration.classList.remove('anim-fade-in-up');
      void this.viewCelebration.offsetWidth;
      this.viewCelebration.classList.add('anim-fade-in-up');
    }
    window.scrollTo({ top: 120, behavior: 'smooth' });
  }

  /**
   * Handles candle extinguishing and triggers celebratory confetti
   */
  makeWish() {
    if (this.isCandleBlown) return;
    this.isCandleBlown = true;

    // Extinguish candle flame
    if (this.candleFlame) {
      this.candleFlame.classList.add('is-extinguished');
    }

    // Show gentle smoke puff
    if (this.candleSmoke) {
      this.candleSmoke.classList.add('is-active');
    }

    // Update button text & state
    if (this.btnWish) {
      this.btnWish.disabled = true;
      const label = this.btnWish.querySelector('.btn-label') || this.btnWish;
      label.textContent = this.config.wishGrantedText || 'Wish Granted! ✨';
      this.btnWish.classList.add('btn-success');
    }

    // Launch celebratory confetti burst
    this.launchConfetti();

    // Reveal final message and certificate smoothly
    setTimeout(() => {
      if (this.postWishReveal) {
        this.postWishReveal.style.display = 'block';
        this.postWishReveal.classList.remove('anim-fade-in-up');
        void this.postWishReveal.offsetWidth;
        this.postWishReveal.classList.add('anim-fade-in-up');
      }
    }, 450);
  }

  /**
   * Lightweight, self-cleaning celebratory confetti burst
   */
  launchConfetti() {
    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    if (this.confettiRunning) return;
    this.confettiRunning = true;

    const container = document.createElement('div');
    container.id = 'confetti-container';
    container.className = 'confetti-overlay';
    container.setAttribute('aria-hidden', 'true');
    document.body.appendChild(container);

    const colors = ['#8b5cf6', '#ec4899', '#facc15', '#38bdf8', '#a78bfa', '#f472b6', '#34d399'];
    const particleCount = 45;
    const particles = [];

    const width = window.innerWidth;
    const height = window.innerHeight;

    for (let i = 0; i < particleCount; i++) {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.floor(Math.random() * 8) + 6; // 6-14px

      el.style.backgroundColor = color;
      el.style.width = `${size}px`;
      el.style.height = `${Math.random() > 0.4 ? size : size * 1.6}px`;
      el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      el.style.position = 'absolute';

      container.appendChild(el);

      particles.push({
        el,
        x: width * 0.5 + (Math.random() - 0.5) * 200,
        y: height * 0.35 + (Math.random() - 0.5) * 80,
        vx: (Math.random() - 0.5) * 12,
        vy: -Math.random() * 9 - 4,
        gravity: 0.28,
        rotation: Math.random() * 360,
        vRotation: (Math.random() - 0.5) * 10,
        opacity: 1,
      });
    }

    let startTime = performance.now();
    const durationMs = 3200;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      if (elapsed > durationMs) {
        // Complete cleanup
        if (container.parentNode) {
          container.parentNode.removeChild(container);
        }
        this.confettiRunning = false;
        return;
      }

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.vRotation;

        if (elapsed > durationMs - 800) {
          p.opacity = Math.max(0, (durationMs - elapsed) / 800);
        }

        p.el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) rotate(${p.rotation}deg)`;
        p.el.style.opacity = p.opacity;
      });

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }

  /**
   * Generates a downloadable high-resolution PNG certificate using HTML5 Canvas
   */
  downloadCertificate() {
    const certConfig = this.config.certificate || {};
    const recipientName = certConfig.recipient || 'Miss Catalyst';
    const formalName = certConfig.formalName ? `(${certConfig.formalName})` : '';
    const certTitle = certConfig.title || 'Certificate of Academic & Personal Excellence';
    const certHeader = certConfig.header || 'OFFICIAL BIRTHDAY CITATION';
    const achievement = certConfig.achievement || 'Awarded for exceptional brilliance and legendary topper denial skills.';
    const signature = certConfig.signature || 'From your favourite source of questionable advice';
    const signatureTitle = certConfig.signatureTitle || 'Chief Examiner of Topper Allegations';
    const sealText = certConfig.seal || 'VERIFIED 100% TOPPER';
    const dateText = certConfig.date || 'Chapter 2026';

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High-resolution canvas dimensions
    canvas.width = 1600;
    canvas.height = 1100;

    // 1. Background gradient (Rich midnight navy)
    const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bgGrad.addColorStop(0, '#0c1326');
    bgGrad.addColorStop(1, '#070b16');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Decorative Double Gold/Violet Border
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 6;
    ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 2;
    ctx.strokeRect(66, 66, canvas.width - 132, canvas.height - 132);

    // Corner Accents
    ctx.fillStyle = '#facc15';
    const corners = [
      [80, 80],
      [canvas.width - 80, 80],
      [80, canvas.height - 80],
      [canvas.width - 80, canvas.height - 80],
    ];
    corners.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fill();
    });

    // 3. Header Kicker
    ctx.fillStyle = '#a78bfa';
    ctx.font = 'bold 22px monospace';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '6px';
    ctx.fillText(`★  ${certHeader}  ★`, canvas.width / 2, 160);

    // 4. Main Certificate Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Georgia, serif';
    ctx.letterSpacing = '1px';
    ctx.fillText(certTitle, canvas.width / 2, 240);

    // Divider line
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(350, 275);
    ctx.lineTo(canvas.width - 350, 275);
    ctx.stroke();

    // 5. "This citation is presented to:"
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'italic 26px sans-serif';
    ctx.fillText('This citation is affectionately presented to', canvas.width / 2, 340);

    // 6. Recipient Name (Prominent & Elegant)
    ctx.fillStyle = '#f472b6';
    ctx.font = 'bold 64px Georgia, serif';
    ctx.fillText(recipientName, canvas.width / 2, 430);

    if (formalName) {
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '24px sans-serif';
      ctx.fillText(formalName, canvas.width / 2, 480);
    }

    // 7. Achievement Paragraph (Wrapped cleanly)
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '26px sans-serif';
    const wrapWidth = 1100;
    const words = achievement.split(' ');
    let line = '';
    let y = formalName ? 550 : 530;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > wrapWidth && n > 0) {
        ctx.fillText(line, canvas.width / 2, y);
        line = words[n] + ' ';
        y += 42;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, canvas.width / 2, y);

    // 8. Seal (Left) & Signature (Right)
    const footerY = 880;

    // Seal
    ctx.save();
    ctx.translate(360, footerY);
    ctx.beginPath();
    ctx.arc(0, 0, 75, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(236, 72, 153, 0.15)';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#facc15';
    ctx.stroke();

    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('★ OFFICIAL SEAL ★', 0, -20);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(sealText, 0, 8);
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '13px sans-serif';
    ctx.fillText(dateText, 0, 32);
    ctx.restore();

    // Signature Area
    ctx.save();
    ctx.translate(canvas.width - 420, footerY);
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-180, 10);
    ctx.lineTo(180, 10);
    ctx.stroke();

    ctx.fillStyle = '#a78bfa';
    ctx.font = 'italic bold 28px Georgia, serif';
    ctx.fillText(signature, 0, -10);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '18px sans-serif';
    ctx.fillText(signatureTitle, 0, 42);
    ctx.restore();

    // Trigger genuine PNG download
    const link = document.createElement('a');
    link.download = `Topper-Mohtarma-Birthday-Certificate-${new Date().getFullYear()}.png`;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Resets the entire site back to the initial password entrance
   */
  replay() {
    this.isRevealed = false;
    this.isCandleBlown = false;

    // Reset Stage 7 views for next visit
    if (this.viewCelebration) this.viewCelebration.style.display = 'none';
    if (this.viewIntro) this.viewIntro.style.display = 'block';
    if (this.candleFlame) this.candleFlame.classList.remove('is-extinguished');
    if (this.candleSmoke) this.candleSmoke.classList.remove('is-active');
    if (this.postWishReveal) this.postWishReveal.style.display = 'none';
    if (this.btnWish) {
      this.btnWish.disabled = false;
      const label = this.btnWish.querySelector('.btn-label') || this.btnWish;
      label.textContent = this.config.makeWishButtonText || 'Make a Wish & Blow Candle 🕯️';
      this.btnWish.classList.remove('btn-success');
    }

    if (this.navigation) {
      this.navigation.resetToBeginning();
    }
  }
}
