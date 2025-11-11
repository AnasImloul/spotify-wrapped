/**
 * Storage Service
 * Handles localStorage and sessionStorage operations with type safety
 */

import { STORAGE_KEYS } from '@/shared/constants';

export class StorageService {
  /**
   * Get item from localStorage
   */
  static getItem<T = string>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return null;
      
      // Try to parse as JSON, fallback to string
      try {
        return JSON.parse(item) as T;
      } catch {
        return item as unknown as T;
      }
    } catch (error) {
      console.error(`Error reading from localStorage: ${key}`, error);
      return null;
    }
  }

  /**
   * Set item in localStorage
   */
  static setItem<T>(key: string, value: T): void {
    try {
      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`Error writing to localStorage: ${key}`, error);
    }
  }

  /**
   * Remove item from localStorage
   */
  static removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage: ${key}`, error);
    }
  }

  /**
   * Clear all localStorage
   */
  static clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage', error);
    }
  }

  /**
   * Get theme preference
   */
  static getTheme(): 'light' | 'dark' | null {
    return this.getItem<'light' | 'dark'>(STORAGE_KEYS.theme);
  }

  /**
   * Set theme preference
   */
  static setTheme(theme: 'light' | 'dark'): void {
    this.setItem(STORAGE_KEYS.theme, theme);
  }
}


