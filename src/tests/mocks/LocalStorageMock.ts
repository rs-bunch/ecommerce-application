type Store = { [key: string]: string };

export default class {
  private store: Store;

  public length: number;

  constructor() {
    this.store = {};
    this.length = 0;
  }

  public key(n: number): string | null {
    if (typeof n === 'undefined') {
      throw new Error(`Error: Failed to execute 'key' on 'Storage': 1 argument required, but only 0 present.`);
    }

    if (n >= Object.keys(this.store).length) {
      return null;
    }

    return Object.keys(this.store)[n];
  }

  public getItem(key: string): string | null {
    if (!Object.keys(this.store).includes(key)) {
      return null;
    }

    return this.store[key];
  }

  public setItem(key: string, value: string): undefined {
    if (typeof key === 'undefined' && typeof value === 'undefined') {
      throw new Error(`Error: Failed to execute 'setItem' on 'Storage': 2 arguments required, but only 0 present.`);
    }

    if (typeof value === 'undefined') {
      throw new Error(`Error: Failed to execute 'setItem' on 'Storage': 2 arguments required, but only 1 present.`);
    }

    if (!key) return undefined;

    this.store[key] = value.toString() || '';
    this.length = Object.keys(this.store).length;

    return undefined;
  }

  public removeItem(key: string): undefined {
    if (typeof key === 'undefined') {
      throw new Error(`Error: Failed to execute 'removeItem' on 'Storage': 1 argument required, but only 0 present.`);
    }

    delete this.store[key];
    this.length = Object.keys(this.store).length;
    return undefined;
  }

  public clear(): undefined {
    this.store = {};
    this.length = 0;

    return undefined;
  }
}
