// YouTube Player API Integration para reproducir playlists
// Documentación: https://developers.google.com/youtube/iframe_api_reference

export interface YouTubeTrack {
  id: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
  duration: string;
}

export interface YouTubePlayerState {
  isPlaying: boolean;
  currentTrack: YouTubeTrack | null;
  playlist: YouTubeTrack[];
  currentIndex: number;
  isLoaded: boolean;
  isMuted: boolean;
}

interface YouTubePlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  nextVideo: () => void;
  previousVideo: () => void;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  setVolume: (volume: number) => void;
  getVolume: () => number;
  getPlayerState: () => number;
  getCurrentTime: () => number;
  getDuration: () => number;
  getVideoUrl: () => string;
  getPlaylist: () => string[] | null;
  getPlaylistIndex: () => number;
  destroy: () => void;
}

interface YouTubeAPI {
  Player: new (containerId: string, config: unknown) => YouTubePlayer;
  PlayerState: {
    UNSTARTED: number;
    ENDED: number;
    PLAYING: number;
    PAUSED: number;
    BUFFERING: number;
    CUED: number;
  };
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: YouTubeAPI;
  }
}

// Errores de un video concreto (borrado, privado o sin permiso para insertarse): se salta al siguiente
const SKIPPABLE_ERRORS = new Set([2, 5, 100, 101, 150]);

class YouTubePlayerService {
  private player: YouTubePlayer | null = null;
  private playlistId: string;
  private onStateChangeCallback: ((state: YouTubePlayerState) => void) | null = null;
  private fadeTimer: ReturnType<typeof setInterval> | null = null;
  // Resuelve el desvanecido en curso cuando otro lo interrumpe, para que nadie se quede esperando
  private finishFade: (() => void) | null = null;
  private targetVolume = 30;
  private isReady = false;
  private consecutiveErrors = 0;
  private currentState: YouTubePlayerState = {
    isPlaying: false,
    currentTrack: null,
    playlist: [],
    currentIndex: 0,
    isLoaded: false,
    isMuted: true,
  };

  constructor(playlistId: string) {
    this.playlistId = playlistId;
  }

  // Inicializar YouTube API
  async initialize(containerId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!window.YT?.Player) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = () => {
          this.createPlayer(containerId, resolve, reject);
        };
      } else {
        this.createPlayer(containerId, resolve, reject);
      }
    });
  }

  private createPlayer(containerId: string, resolve: () => void, reject: (error: Error) => void): void {
    try {
      this.player = new window.YT.Player(containerId, {
        height: '0',
        width: '0',
        playerVars: {
          listType: 'playlist',
          list: this.playlistId,
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          rel: 0,
          loop: 1,
          mute: 1 // Iniciar muteado para cumplir políticas de autoplay
        },
        events: {
          onReady: () => {
            this.isReady = true;
            this.loadPlaylistInfo();
            this.currentState.isLoaded = true;
            this.syncFromPlayer();
            resolve();
          },
          onStateChange: (event: unknown) => {
            this.handleStateChange((event as { data: number }).data);
          },
          onError: (event: unknown) => {
            const code = (event as { data?: number }).data;
            if (!this.isReady) {
              reject(new Error(`YouTube Player error: ${String(code)}`));
              return;
            }
            this.handlePlaybackError(code);
          }
        }
      });
    } catch (error) {
      reject(error instanceof Error ? error : new Error(String(error)));
    }
  }

  private handlePlaybackError(code: number | undefined): void {
    if (code === undefined || !SKIPPABLE_ERRORS.has(code)) return;
    // Sin este tope, una playlist donde todo falla saltaría en bucle
    const limit = Math.max(this.currentState.playlist.length, 1);
    if (++this.consecutiveErrors > limit) return;
    this.player?.nextVideo();
  }

  // Cargar información de la playlist. Se reintenta al reproducir si al principio YouTube aún no la tenía.
  private loadPlaylistInfo(): void {
    const playlist = this.player?.getPlaylist?.();
    if (!playlist || playlist.length === 0) return;

    this.currentState.playlist = playlist.map((videoId: string, index: number) => ({
      id: videoId,
      title: `♫ Canción ${index + 1}`,
      channelTitle: 'Playlist de Lunaria',
      thumbnail: `https://img.youtube.com/vi/${videoId}/default.jpg`,
      duration: '0:00'
    }));

    this.updateCurrentTrack();
    this.loadRealVideoInfo(playlist);
  }

  private async loadRealVideoInfo(videoIds: string[]): Promise<void> {
    // Uno por uno para evitar rate limiting
    for (let i = 0; i < videoIds.length; i++) {
      const videoId = videoIds[i];
      try {
        // oEmbed de YouTube (gratuito, sin API key)
        const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
        const response = await fetch(oembedUrl);

        if (response.ok && this.currentState.playlist[i]) {
          const data = await response.json();
          this.currentState.playlist[i] = {
            ...this.currentState.playlist[i],
            title: this.cleanTitle(data.title) || `♫ Canción ${i + 1}`,
            channelTitle: data.author_name || 'Canal Musical',
            thumbnail: data.thumbnail_url || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
          };

          if (i === this.currentState.currentIndex) {
            this.updateCurrentTrack();
            this.updateState();
          }
        }

        await new Promise(resolve => setTimeout(resolve, 200));
      } catch {
        // Un video sin información se queda con su título provisional
      }
    }
  }

  private cleanTitle(title: string): string {
    // Limpiar títulos comunes de YouTube para que sean más legibles
    return title
      .replace(/\(Official.*?\)/gi, '')
      .replace(/\[Official.*?\]/gi, '')
      .replace(/Official Video/gi, '')
      .replace(/Official Audio/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private handleStateChange(playerState: number): void {
    const YT = window.YT;

    if (playerState === YT.PlayerState.PLAYING) {
      this.consecutiveErrors = 0;
      if (this.currentState.playlist.length === 0) this.loadPlaylistInfo();
      this.updateCurrentTrack();
    } else if (playerState === YT.PlayerState.ENDED) {
      // En modo playlist el player pasa solo a la siguiente canción
      setTimeout(() => {
        this.updateCurrentTrack();
        this.updateState();
      }, 500);
    }

    this.syncFromPlayer();
  }

  // El player es la fuente de verdad de si suena y si está en silencio
  private syncFromPlayer(): void {
    if (!this.player) return;
    try {
      this.currentState.isPlaying = this.player.getPlayerState() === window.YT.PlayerState.PLAYING;
      this.currentState.isMuted = this.player.isMuted();
    } catch {
      // El iframe todavía no responde
    }
    this.updateState();
  }

  private updateCurrentTrack(): void {
    try {
      const currentIndex = this.player?.getPlaylistIndex?.() ?? -1;
      if (currentIndex !== -1 && this.currentState.playlist[currentIndex]) {
        this.currentState.currentIndex = currentIndex;
        this.currentState.currentTrack = this.currentState.playlist[currentIndex];
      }
    } catch {
      // El iframe todavía no responde
    }
  }

  private updateState(): void {
    this.onStateChangeCallback?.({ ...this.currentState });
  }

  // ¿Se oye algo ahora mismo? Reproduciendo, sin silencio y con volumen.
  isAudible(): boolean {
    if (!this.player) return false;
    try {
      return (
        this.player.getPlayerState() === window.YT.PlayerState.PLAYING &&
        !this.player.isMuted() &&
        this.player.getVolume() > 0
      );
    } catch {
      return false;
    }
  }

  nextTrack(): void {
    this.player?.nextVideo?.();
  }

  previousTrack(): void {
    this.player?.previousVideo?.();
  }

  setMuted(muted: boolean): void {
    if (!this.player) return;
    if (muted) this.player.mute();
    else this.player.unMute();
    this.currentState.isMuted = muted;
    this.updateState();
  }

  // Corta el desvanecido en curso y resuelve su promesa
  private cancelFade(): void {
    if (this.fadeTimer) clearInterval(this.fadeTimer);
    this.fadeTimer = null;
    const finish = this.finishFade;
    this.finishFade = null;
    finish?.();
  }

  // Lleva el volumen de `from` a `to` en `duration` ms. Si otro desvanecido lo interrumpe, resuelve igual.
  private fadeVolume(from: number, to: number, duration: number, onEnd?: () => void): Promise<void> {
    this.cancelFade();
    return new Promise((resolve) => {
      if (!this.player) {
        resolve();
        return;
      }
      this.finishFade = resolve;
      const start = Date.now();
      this.player.setVolume(from);

      this.fadeTimer = setInterval(() => {
        const t = Math.min(1, (Date.now() - start) / duration);
        this.player?.setVolume(from + (to - from) * t);
        if (t >= 1) {
          if (this.fadeTimer) clearInterval(this.fadeTimer);
          this.fadeTimer = null;
          this.finishFade = null;
          onEnd?.();
          this.syncFromPlayer();
          resolve();
        }
      }, 1000 / 30);
    });
  }

  // Sube la música desde el silencio (también si estaba sonando en silencio por el autoplay)
  async fadeIn(duration: number = 2000): Promise<void> {
    if (!this.player) return;
    const from = this.isAudible() ? this.player.getVolume() : 0;
    this.player.setVolume(from);
    this.player.unMute();
    this.player.playVideo();
    this.currentState.isMuted = false;
    await this.fadeVolume(from, this.targetVolume, duration);
  }

  // Baja la música y la pausa al terminar
  async fadeOut(duration: number = 1500): Promise<void> {
    if (!this.player) return;
    const from = this.player.getVolume() || this.targetVolume;
    await this.fadeVolume(from, 0, duration, () => this.player?.pauseVideo());
  }

  // Registrar callback para cambios de estado
  onStateChange(callback: (state: YouTubePlayerState) => void): void {
    this.onStateChangeCallback = callback;
  }

  // Obtener estado actual
  getCurrentState(): YouTubePlayerState {
    return { ...this.currentState };
  }

  // Cleanup
  destroy(): void {
    this.cancelFade();
    this.player?.destroy?.();
    this.onStateChangeCallback = null;
  }
}

export default YouTubePlayerService;
