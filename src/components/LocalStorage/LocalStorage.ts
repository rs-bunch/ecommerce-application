import type { RootState } from '../Store/store';

const LOCAL_STORAGE_KEY = 'state';

export default class {
  private localStorage: Storage;

  constructor() {
    this.localStorage = window.localStorage;
  }

  public saveState(state: RootState): void {
    this.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  }

  public loadState(): RootState | null {
    const state = this.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (state) return JSON.parse(state);
    return null;
  }
}
