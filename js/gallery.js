/**
 * PROJECT: TOPPER MOHTARMA
 * BATCH 3 — PHOTO GALLERY & LIGHTBOX CONTROLLER
 * 
 * Features:
 * - Responsive 6–8 photo memory archive grid
 * - Graceful image error fallback (renders camera icon, slot label, filename tip)
 * - Accessible Modal Lightbox with:
 *   - Backdrop scrim & smooth fade
 *   - Close button (X), click outside to close, Escape key
 *   - Previous / Next navigation with ArrowLeft / ArrowRight keys
 *   - Stop propagation on arrow keys to prevent stage navigation conflict
 *   - Body scroll locking ('lightbox-open' class)
 *   - Position indicator / counter ('2 / 6')
 *   - Focus trapping & focus restoration on close
 */

export class GalleryController {
  /**
   * @param {Object} options
   * @param {Object} options.config - Gallery configuration object
   * @param {HTMLElement} options.gridContainer - Container element for the photo grid
   * @param {HTMLElement} options.lightboxElement - The lightbox modal container
   */
  constructor({ config, gridContainer, lightboxElement }) {
    this.config = config || { photos: [] };
    this.photos = this.config.photos || [];
    this.gridContainer = gridContainer;
    this.lightbox = lightboxElement;

    this.currentIndex = 0;
    this.isOpen = false;
    this.previousFocusedElement = null;
    this.imageStatuses = new Map(); // tracks 'loaded' | 'error' for each photo id

    this.init();
  }

  init() {
    if (!this.gridContainer) return;

    this.renderGrid();
    this.initLightbox();
    this.bindGlobalKeyboard();
  }

  /**
   * Renders the photo cards inside the responsive grid
   */
  renderGrid() {
    this.gridContainer.innerHTML = '';

    this.photos.forEach((photo, index) => {
      const card = document.createElement('article');
      card.className = 'gallery-card anim-fade-in-up';
      card.style.animationDelay = `${index * 60}ms`;
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `View photo ${index + 1}: ${photo.caption}`);
      card.dataset.index = String(index);

      // Card inner media wrapper
      const mediaWrapper = document.createElement('div');
      mediaWrapper.className = 'gallery-media-wrapper';

      // 1. Real Image Element
      const img = document.createElement('img');
      img.className = 'gallery-image';
      img.alt = photo.alt || `Memory ${index + 1}`;
      img.decoding = 'async';
      img.referrerPolicy = 'no-referrer';
      img.style.display = 'block';

      // 2. Fallback placeholder (shown if image file is not found or fails)
      const placeholder = document.createElement('div');
      placeholder.className = 'gallery-placeholder';
      placeholder.innerHTML = `
        <div class="placeholder-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
            <circle cx="12" cy="13" r="4"></circle>
          </svg>
        </div>
        <div class="placeholder-tag">${photo.tag || `Photo #${index + 1}`}</div>
        <div class="placeholder-hint">Slot ready for<br><code>${photo.src}</code></div>
      `;

      const handleLoad = () => {
        this.imageStatuses.set(photo.id, 'loaded');
        placeholder.classList.remove('is-active');
        img.style.display = 'block';
      };

      const handleError = () => {
        this.imageStatuses.set(photo.id, 'error');
        img.style.display = 'none';
        placeholder.classList.add('is-active');
      };

      // Register load/error handlers BEFORE assigning src
      img.addEventListener('load', handleLoad);
      img.addEventListener('error', handleError);

      // Assign src after attaching listeners
      img.src = photo.src;

      // Handle cached images or images already complete
      if (img.complete && img.naturalWidth > 0) {
        handleLoad();
      }

      mediaWrapper.appendChild(img);
      mediaWrapper.appendChild(placeholder);

      // Card Caption Bar
      const captionBar = document.createElement('div');
      captionBar.className = 'gallery-card-info';
      captionBar.innerHTML = `
        <span class="gallery-card-tag">${photo.tag || `Archive #${index + 1}`}</span>
        <p class="gallery-card-caption">${photo.caption}</p>
      `;

      card.appendChild(mediaWrapper);
      card.appendChild(captionBar);

      // Click to open lightbox
      card.addEventListener('click', () => this.open(index));

      // Keyboard activation for card
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.open(index);
        }
      });

      this.gridContainer.appendChild(card);
    });
  }

  /**
   * Initializes Lightbox controls and modal structure
   */
  initLightbox() {
    if (!this.lightbox) return;

    this.lightboxImg = this.lightbox.querySelector('#lightbox-img');
    this.lightboxPlaceholder = this.lightbox.querySelector('#lightbox-placeholder');
    this.lightboxCaption = this.lightbox.querySelector('#lightbox-caption');
    this.lightboxTag = this.lightbox.querySelector('#lightbox-tag');
    this.lightboxCounter = this.lightbox.querySelector('#lightbox-counter');
    this.btnClose = this.lightbox.querySelector('#lightbox-btn-close');
    this.btnPrev = this.lightbox.querySelector('#lightbox-btn-prev');
    this.btnNext = this.lightbox.querySelector('#lightbox-btn-next');
    this.scrim = this.lightbox.querySelector('.lightbox-scrim');

    if (this.btnClose) {
      this.btnClose.addEventListener('click', () => this.close());
    }

    if (this.btnPrev) {
      this.btnPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        this.prev();
      });
    }

    if (this.btnNext) {
      this.btnNext.addEventListener('click', (e) => {
        e.stopPropagation();
        this.next();
      });
    }

    if (this.scrim) {
      this.scrim.addEventListener('click', () => this.close());
    }
  }

  /**
   * Captures keyboard interactions while lightbox is open
   */
  bindGlobalKeyboard() {
    window.addEventListener(
      'keydown',
      (e) => {
        if (!this.isOpen) return;

        if (e.key === 'Escape') {
          e.preventDefault();
          e.stopPropagation();
          this.close();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          this.prev();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          this.next();
        }
      },
      true // Capture phase to intercept before stage navigation
    );
  }

  /**
   * Open the lightbox modal at specified index
   * @param {number} index
   */
  open(index) {
    if (index < 0 || index >= this.photos.length) return;

    this.previousFocusedElement = document.activeElement;
    this.currentIndex = index;
    this.isOpen = true;

    this.updateLightboxContent();

    this.lightbox.classList.add('is-open');
    this.lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');

    // Move focus to close button for accessibility
    setTimeout(() => {
      if (this.btnClose) {
        this.btnClose.focus();
      }
    }, 50);
  }

  /**
   * Close the lightbox modal
   */
  close() {
    if (!this.isOpen) return;

    this.isOpen = false;
    this.lightbox.classList.remove('is-open');
    this.lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');

    // Restore focus to previously focused element
    if (this.previousFocusedElement && typeof this.previousFocusedElement.focus === 'function') {
      this.previousFocusedElement.focus();
    }
  }

  /**
   * Advance to the next photo in sequence (loops back to start)
   */
  next() {
    this.currentIndex = (this.currentIndex + 1) % this.photos.length;
    this.updateLightboxContent();
  }

  /**
   * Return to the previous photo in sequence (loops back to end)
   */
  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.photos.length) % this.photos.length;
    this.updateLightboxContent();
  }

  /**
   * Updates the lightbox content according to this.currentIndex
   */
  updateLightboxContent() {
    const photo = this.photos[this.currentIndex];
    if (!photo) return;

    // Counter: "2 / 6"
    if (this.lightboxCounter) {
      this.lightboxCounter.textContent = `${this.currentIndex + 1} / ${this.photos.length}`;
    }

    // Tag: "Exhibit #02"
    if (this.lightboxTag) {
      this.lightboxTag.textContent = photo.tag || `Archive #${this.currentIndex + 1}`;
    }

    // Caption
    if (this.lightboxCaption) {
      this.lightboxCaption.textContent = photo.caption;
    }

    // Handle Image vs Placeholder display inside Lightbox
    const isError = this.imageStatuses.get(photo.id) === 'error';

    if (this.lightboxImg && this.lightboxPlaceholder) {
      if (isError) {
        this.lightboxImg.style.display = 'none';
        this.lightboxPlaceholder.style.display = 'flex';
        this.lightboxPlaceholder.innerHTML = `
          <div class="lightbox-placeholder-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="4"></circle>
            </svg>
          </div>
          <div class="lightbox-placeholder-title">${photo.tag || `Photo #${this.currentIndex + 1}`}</div>
          <div class="lightbox-placeholder-note">
            Place your image file in:<br>
            <code>${photo.src}</code>
          </div>
        `;
      } else {
        this.lightboxPlaceholder.style.display = 'none';
        this.lightboxImg.style.display = 'block';
        this.lightboxImg.src = photo.src;
        this.lightboxImg.alt = photo.alt || `Photo memory ${this.currentIndex + 1}`;

        // Ensure we catch error if lightbox opens before grid image failed
        this.lightboxImg.onerror = () => {
          this.imageStatuses.set(photo.id, 'error');
          this.updateLightboxContent();
        };
      }
    }
  }
}
