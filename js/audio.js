/**
 * PROJECT: TOPPER MOHTARMA
 * PERSISTENT AUDIO & PLAYLIST CONTROLLER
 * 
 * Features:
 * - 2-Track Birthday Playlist: 1. Ik Kudi -> 2. Aarzu (loops seamlessly)
 * - Persistent HTML audio instance surviving stage transitions
 * - Starts playing automatically upon successful password entry
 * - Floating Music Player UI controls (Play/Pause, Next, Prev, Mute/Unmute, Track Title, Equalizer)
 * - Default volume: 35% (0.35)
 * - Graceful error handling for browser autoplay restrictions or missing files
 */

export class AudioController {
  /**
   * @param {Object} options
   * @param {Object} [options.config] - Audio configuration from config.js
   * @param {HTMLElement} [options.playerContainer] - Floating music player widget container
   * @param {HTMLElement} [options.toggleButton] - Legacy audio toggle button fallback
   */
  constructor({ config, playerContainer, toggleButton } = {}) {
    this.config = config || {};
    this.playlist = this.config.playlist || [
      { id: 'ik-kudi', title: 'Ik Kudi', src: 'music/Ik-Kudi.mp3' },
      { id: 'aarzu', title: 'Aarzu', src: 'music/Aarzu.mp3' },
    ];

    this.currentIndex = 0;
    this.isPlaying = false;
    this.isMuted = false;
    this.hasUserUnlocked = false;

    // Single persistent HTML audio element
    this.audioElement = new Audio();
    this.audioElement.volume = typeof this.config.defaultVolume === 'number' ? this.config.defaultVolume : 0.35;
    this.audioElement.preload = 'auto';

    // UI Container Elements
    this.container = playerContainer || document.getElementById('music-player');
    this.headerButton = toggleButton || document.getElementById('btn-audio-toggle');

    this.init();
  }

  init() {
    this.bindAudioEvents();
    this.bindUIEvents();
    this.loadTrack(0, false);
    this.updateUI();
  }

  /**
   * Listens to single audio instance events
   */
  bindAudioEvents() {
    // When current track finishes, automatically advance to next track in loop
    this.audioElement.addEventListener('ended', () => {
      this.nextTrack(true);
    });

    this.audioElement.addEventListener('play', () => {
      this.isPlaying = true;
      this.updateUI();
    });

    this.audioElement.addEventListener('pause', () => {
      this.isPlaying = false;
      this.updateUI();
    });

    this.audioElement.addEventListener('error', (e) => {
      console.warn(`[Audio] Error loading track "${this.currentTrack?.title}":`, e);
      this.isPlaying = false;
      this.updateUI();
    });
  }

  /**
   * Attaches click handlers to player buttons
   */
  bindUIEvents() {
    const playBtn = document.getElementById('music-btn-play');
    const prevBtn = document.getElementById('music-btn-prev');
    const nextBtn = document.getElementById('music-btn-next');
    const muteBtn = document.getElementById('music-btn-mute');

    if (playBtn) {
      playBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.togglePlay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.prevTrack(true);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.nextTrack(true);
      });
    }

    if (muteBtn) {
      muteBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleMute();
      });
    }

    // Legacy header toggle button binding
    if (this.headerButton) {
      this.headerButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.togglePlay();
      });
    }
  }

  get currentTrack() {
    return this.playlist[this.currentIndex] || this.playlist[0];
  }

  /**
   * Loads a track by index
   * @param {number} index
   * @param {boolean} autoPlay
   */
  loadTrack(index, autoPlay = false) {
    this.currentIndex = (index + this.playlist.length) % this.playlist.length;
    const track = this.currentTrack;

    if (!track) return;

    this.audioElement.src = track.src;
    this.audioElement.load();

    this.updateUI();

    if (autoPlay) {
      this.play();
    }
  }

  /**
   * Play current audio track
   */
  async play() {
    if (!this.audioElement.src) {
      this.loadTrack(this.currentIndex, false);
    }
    try {
      await this.audioElement.play();
      this.isPlaying = true;
    } catch (err) {
      console.warn('[Audio] Playback failed or deferred by browser:', err);
      this.isPlaying = false;
    }
    this.updateUI();
  }

  /**
   * Pause current audio track
   */
  pause() {
    try {
      this.audioElement.pause();
    } catch {
      // Safe pause
    }
    this.isPlaying = false;
    this.updateUI();
  }

  /**
   * Toggle between play and pause
   */
  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  /**
   * Advance to next track in playlist loop
   * @param {boolean} [autoPlay=true]
   */
  nextTrack(autoPlay = true) {
    const nextIndex = (this.currentIndex + 1) % this.playlist.length;
    this.loadTrack(nextIndex, autoPlay);
  }

  /**
   * Return to previous track in playlist loop
   * @param {boolean} [autoPlay=true]
   */
  prevTrack(autoPlay = true) {
    const prevIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
    this.loadTrack(prevIndex, autoPlay);
  }

  /**
   * Toggle mute status
   */
  toggleMute() {
    this.isMuted = !this.isMuted;
    this.audioElement.muted = this.isMuted;
    this.updateUI();
  }

  /**
   * Invoked on successful password entry on Stage 1
   */
  async startOnEntry() {
    this.hasUserUnlocked = true;
    if (this.container) {
      this.container.classList.add('is-active');
    }
    // Always start with Track 1 ("Ik Kudi")
    if (this.currentIndex !== 0) {
      this.loadTrack(0, true);
    } else {
      await this.play();
    }
  }

  /**
   * Synchronizes UI elements with current audio state
   */
  updateUI() {
    const track = this.currentTrack;
    if (!track) return;

    const titleEl = document.getElementById('music-track-title');
    const subtitleEl = document.getElementById('music-track-subtitle');
    const playIcon = document.getElementById('music-icon-play');
    const pauseIcon = document.getElementById('music-icon-pause');
    const unmutedIcon = document.getElementById('music-icon-unmuted');
    const mutedIcon = document.getElementById('music-icon-muted');
    const indicator = document.querySelector('.music-playing-indicator');

    if (titleEl) titleEl.textContent = track.title;
    if (subtitleEl) subtitleEl.textContent = `${this.currentIndex + 1} / ${this.playlist.length}`;

    if (playIcon && pauseIcon) {
      if (this.isPlaying) {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
      } else {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
      }
    }

    if (unmutedIcon && mutedIcon) {
      if (this.isMuted) {
        unmutedIcon.style.display = 'none';
        mutedIcon.style.display = 'block';
      } else {
        unmutedIcon.style.display = 'block';
        mutedIcon.style.display = 'none';
      }
    }

    if (indicator) {
      if (this.isPlaying) {
        indicator.classList.add('is-playing');
      } else {
        indicator.classList.remove('is-playing');
      }
    }

    if (this.headerButton) {
      if (this.isPlaying) {
        this.headerButton.textContent = `🎵 ${track.title}`;
        this.headerButton.classList.add('btn-primary');
        this.headerButton.classList.remove('btn-secondary');
        this.headerButton.setAttribute('aria-pressed', 'true');
      } else {
        this.headerButton.textContent = `🔇 ${track.title} (Paused)`;
        this.headerButton.classList.remove('btn-primary');
        this.headerButton.classList.add('btn-secondary');
        this.headerButton.setAttribute('aria-pressed', 'false');
      }
    }
  }

  getStatus() {
    return this.isPlaying ? 'playing' : 'off';
  }
}
