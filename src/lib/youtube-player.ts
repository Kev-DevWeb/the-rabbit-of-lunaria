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
  setVolume: (volume: number) => void;
  getVolume: () => number;
  getPlayerState: () => number;
  getCurrentTime: () => number;
  getDuration: () => number;
  getVideoUrl: () => string;
  getPlaylist: () => string[];
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

class YouTubePlayerService {
  private player: YouTubePlayer | null = null;
  private playlistId: string;
  private onStateChangeCallback: ((state: YouTubePlayerState) => void) | null = null;
  private fadeInterval: NodeJS.Timeout | null = null;
  private targetVolume: number = 30; // Volumen objetivo (30%)
  private currentState: YouTubePlayerState = {
    isPlaying: false,
    currentTrack: null,
    playlist: [],
    currentIndex: 0,
    isLoaded: false,
    isMuted: false
  };

  constructor(playlistId: string) {
    this.playlistId = playlistId;
  }

  // Inicializar YouTube API
  async initialize(containerId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Cargar YouTube API si no está cargada
      if (!window.YT) {
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
          showinfo: 0,
          loop: 1,
          mute: 1 // Iniciar muteado para cumplir políticas de autoplay
        },
        events: {
          onReady: () => {
            console.log('🎥 YouTube Player ready');
            this.loadPlaylistInfo();
            this.currentState.isLoaded = true;
            this.updateState();
            resolve();
          },
          onStateChange: (event: unknown) => {
            this.handleStateChange(event as { data: number; target: YouTubePlayer });
          },
          onError: (event: unknown) => {
            console.error('❌ YouTube Player error:', event);
            reject(new Error(`YouTube Player error: ${String(event)}`))
          }
        }
      });
    } catch (error) {
      reject(error instanceof Error ? error : new Error(String(error)));
    }
  }

  // Cargar información de la playlist
  private async loadPlaylistInfo(): Promise<void> {
    try {
      if (this.player && this.player.getPlaylist) {
        const playlist = this.player.getPlaylist();
        console.log('🎵 Playlist loaded:', playlist);
        
        // Primero cargar con placeholders para rapidez
        this.currentState.playlist = playlist?.map((videoId: string, index: number) => ({
          id: videoId,
          title: `♫ Canción ${index + 1}`,
          channelTitle: 'Playlist de Lunaria',
          thumbnail: `https://img.youtube.com/vi/${videoId}/default.jpg`,
          duration: '0:00'
        })) || [];
        
        this.updateCurrentTrack();
        
        // Luego cargar información real de manera asíncrona
        if (playlist && playlist.length > 0) {
          this.loadRealVideoInfo(playlist);
        }
      }
    } catch (error) {
      console.error('❌ Error loading playlist info:', error);
    }
  }

  private async loadRealVideoInfo(videoIds: string[]): Promise<void> {
    try {
      console.log('🔍 Cargando información real de videos:', videoIds);
      
      // Procesar videos uno por uno para evitar rate limiting
      for (let i = 0; i < videoIds.length; i++) {
        const videoId = videoIds[i];
        
        try {
          // Usar oEmbed API de YouTube (gratuito, sin API key)
          const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
          console.log(`🔗 Obteniendo info para video ${i + 1}/${videoIds.length}: ${videoId}`);
          
          const response = await fetch(oembedUrl);
          
          if (response.ok) {
            const data = await response.json();
            
            // Actualizar la información específica del video
            if (this.currentState.playlist[i]) {
              this.currentState.playlist[i] = {
                ...this.currentState.playlist[i],
                title: this.cleanTitle(data.title) || `♫ Canción ${i + 1}`,
                channelTitle: data.author_name || 'Canal Musical',
                thumbnail: data.thumbnail_url || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
              };
              
              console.log(`✅ Info actualizada para video ${i + 1}:`, {
                title: this.currentState.playlist[i].title,
                channel: this.currentState.playlist[i].channelTitle
              });
              
              // Si es el video actual, actualizar inmediatamente
              if (i === this.currentState.currentIndex) {
                this.updateCurrentTrack();
              }
            }
          } else {
            console.warn(`⚠️ oEmbed falló para video ${videoId}, usando fallback`);
          }
          
          // Pequeño delay para evitar rate limiting
          await new Promise(resolve => setTimeout(resolve, 200));
          
        } catch (error) {
          console.warn(`⚠️ Error obteniendo info para video ${videoId}:`, error);
        }
      }
      
      console.log('✅ Carga de información de videos completada');
      
    } catch (error) {
      console.error('❌ Error en carga de información real:', error);
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

  private handleStateChange(event: { data: number; target: YouTubePlayer }): void {
    const YT = window.YT;
    
    switch (event.data) {
      case YT.PlayerState.PLAYING:
        console.log('▶️ YouTube: Playing');
        this.currentState.isPlaying = true;
        this.updateCurrentTrack();
        this.updateState();
        break;
        
      case YT.PlayerState.PAUSED:
        console.log('⏸️ YouTube: Paused');
        this.currentState.isPlaying = false;
        this.updateState();
        break;
        
      case YT.PlayerState.ENDED:
        console.log('⏭️ YouTube: Track ended');
        // El player automáticamente pasa a la siguiente canción en playlist mode
        setTimeout(() => {
          this.updateCurrentTrack();
          this.updateState();
        }, 500);
        break;
    }
    
    this.updateState();
  }

  private updateCurrentTrack(): void {
    try {
      if (this.player && this.player.getPlaylistIndex) {
        const currentIndex = this.player.getPlaylistIndex();
        if (currentIndex !== -1 && this.currentState.playlist[currentIndex]) {
          const previousTrack = this.currentState.currentTrack;
          this.currentState.currentIndex = currentIndex;
          this.currentState.currentTrack = this.currentState.playlist[currentIndex];
          
          console.log('🎶 Current track updated:', this.currentState.currentTrack);
          
          // Si cambió la canción O si se actualizó la información del track actual
          const titleChanged = previousTrack?.title !== this.currentState.currentTrack.title;
          const infoUpdated = previousTrack && previousTrack.id === this.currentState.currentTrack.id && 
                             previousTrack.title !== this.currentState.currentTrack.title;
          
          if (titleChanged) {
            console.log('🔄 Track changed from:', previousTrack?.title, 'to:', this.currentState.currentTrack.title);
            this.updateState();
          } else if (infoUpdated) {
            console.log('📝 Track info updated:', this.currentState.currentTrack.title);
            this.updateState();
          }
        }
      }
    } catch (error) {
      console.error('❌ Error updating current track:', error);
    }
  }

  private updateState(): void {
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback({ ...this.currentState });
    }
  }

  // Métodos públicos
  play(): void {
    if (this.player && this.player.playVideo) {
      this.player.playVideo();
    }
  }

  pause(): void {
    if (this.player && this.player.pauseVideo) {
      this.player.pauseVideo();
    }
  }

  togglePlayPause(): void {
    if (this.currentState.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  nextTrack(): void {
    if (this.player && this.player.nextVideo) {
      this.player.nextVideo();
    }
  }

  previousTrack(): void {
    if (this.player && this.player.previousVideo) {
      this.player.previousVideo();
    }
  }

  setMuted(muted: boolean): void {
    if (this.player) {
      if (muted) {
        this.player.mute();
      } else {
        this.player.unMute();
      }
      this.currentState.isMuted = muted;
      this.updateState();
    }
  }

  toggleMute(): void {
    this.setMuted(!this.currentState.isMuted);
  }

  setVolume(volume: number): void {
    if (this.player && this.player.setVolume) {
      this.player.setVolume(Math.max(0, Math.min(100, volume)));
    }
  }

  // Fade In con duración personalizable
  async fadeIn(duration: number = 2000): Promise<void> {
    return new Promise((resolve) => {
      if (!this.player) {
        resolve();
        return;
      }

      // Limpiar fade anterior si existe
      if (this.fadeInterval) {
        clearInterval(this.fadeInterval);
      }

      // Empezar desde volumen 0
      this.player.setVolume(0);
      this.player.unMute();
      this.player.playVideo();
      
      const startTime = Date.now();
      const steps = 60; // 60fps
      const stepDuration = duration / steps;
      const volumeStep = this.targetVolume / steps;
      let currentVolume = 0;

      this.fadeInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        
        if (elapsed >= duration) {
          // Fade completado
          this.player?.setVolume(this.targetVolume);
          clearInterval(this.fadeInterval!);
          this.fadeInterval = null;
          this.currentState.isMuted = false;
          this.currentState.isPlaying = true;
          this.updateState();
          console.log('🎵 Fade in completed');
          resolve();
        } else {
          // Incrementar volumen gradualmente
          currentVolume = Math.min(this.targetVolume, volumeStep * (elapsed / stepDuration));
          this.player?.setVolume(currentVolume);
        }
      }, 1000 / 60); // 60fps
    });
  }

  // Fade Out con duración personalizable
  async fadeOut(duration: number = 1500): Promise<void> {
    return new Promise((resolve) => {
      if (!this.player) {
        resolve();
        return;
      }

      // Limpiar fade anterior si existe
      if (this.fadeInterval) {
        clearInterval(this.fadeInterval);
      }

      const startVolume = this.player.getVolume() || this.targetVolume;
      const startTime = Date.now();
      const steps = 60;
      const stepDuration = duration / steps;
      const volumeStep = startVolume / steps;

      this.fadeInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        
        if (elapsed >= duration) {
          // Fade completado
          this.player?.setVolume(0);
          this.player?.pauseVideo();
          clearInterval(this.fadeInterval!);
          this.fadeInterval = null;
          this.currentState.isMuted = true;
          this.currentState.isPlaying = false;
          this.updateState();
          console.log('🔇 Fade out completed');
          resolve();
        } else {
          // Decrementar volumen gradualmente
          const currentVolume = Math.max(0, startVolume - (volumeStep * (elapsed / stepDuration)));
          this.player?.setVolume(currentVolume);
        }
      }, 1000 / 60); // 60fps
    });
  }

  // Toggle con fade automático
  async togglePlayPauseWithFade(): Promise<void> {
    if (this.currentState.isPlaying) {
      console.log('🔇 Iniciando fade out...');
      await this.fadeOut(1500);
    } else {
      console.log('🎵 Iniciando fade in...');
      await this.fadeIn(2000);
    }
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
    if (this.player && this.player.destroy) {
      this.player.destroy();
    }
    this.onStateChangeCallback = null;
  }
}

export default YouTubePlayerService;