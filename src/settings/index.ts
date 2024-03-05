import { AppSettingsDto } from '@sermas/api-client/openapi';
import { emitter } from '..';
import { DEFAULT_AVATAR_LANGUAGE } from '../constants';
import { AppSettings } from '../dto/settings.dto';
import { logger } from 'logger';

export class Settings {
  private settings: AppSettings;

  private readonly defaults: AppSettings = {
    login: false,
    avatar: 'default',
    background: 'backgrounds/default',
    llm: 'chatgpt',
    language: DEFAULT_AVATAR_LANGUAGE,
    // developerMode
    testFace: '',
    enableTestFaces: false,
    enableAvatar: true,
    enableMic: true,
    enableAudio: true,
    showVideo: false,
    animation: '',
    enableAnimation: true,
    enableMirrorMode: false,
    animationList: [],
    devMode: false,
    rpmUrl: '',
    rpmGender: '',
    enableVideoDetection: true,
    detectorHuman: true,
    detectorFaceLandmarker: false,
  };

  constructor() {
    this.settings = this.getDefaults();
  }

  export() {
    const appSettingsDto: AppSettingsDto = {
      login: this.settings.login,
      avatar: this.settings.avatar,
      background: this.settings.background,
      language: this.settings.language,
      llm: this.settings.llm,
    };
    return appSettingsDto;
  }

  getDefaults() {
    return {
      ...this.defaults,
    };
  }

  private saveLocalStorage(settings: AppSettings) {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(
      `sermas.settings`,
      JSON.stringify({
        enableAudio: settings.enableAudio,
        enableMic: settings.enableMic,
        devMode: settings.devMode,
      }),
    );
  }

  private loadLocalStorage(): Partial<AppSettings> | undefined {
    if (typeof localStorage === 'undefined') return;
    try {
      const raw = localStorage.getItem(`sermas.settings`);
      if (!raw) return;
      return JSON.parse(raw) as Partial<AppSettings>;
    } catch (e: any) {
      logger.error(`Failed loading local storage: ${e.message}`);
    }
  }

  init() {
    if (this.loadLocalStorage() === undefined) {
      this.saveLocalStorage(this.settings);
    }
  }

  destroy() {}

  get(): AppSettings {
    return this.settings;
  }

  async save(cfg: Partial<AppSettings>): Promise<AppSettings> {
    cfg = cfg || {};
    this.settings = { ...this.settings, ...cfg };
    this.saveLocalStorage(this.settings);
    emitter.emit('settings', this.settings);
    return this.settings;
  }

  async load(): Promise<AppSettings> {
    const saved = this.loadLocalStorage();

    this.settings = {
      ...this.settings,
      ...(saved || {}),
    } as AppSettings;

    return this.settings;
  }
}
