/**
 * Configuration Manager
 * 
 * Centralized configuration management with environment variable support
 */

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { Logger } from './logger.js';

export class ConfigManager {
  private static instance: ConfigManager;
  private logger: Logger;
  private config: Map<string, any>;
  private systemManifest: any;

  private constructor() {
    this.logger = new Logger('ConfigManager');
    this.config = new Map();
  }

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  /**
   * Load all configuration
   */
  async load(): Promise<void> {
    this.logger.info('Loading configuration...');

    // Load environment variables
    this.loadEnvironmentVariables();

    // Load system manifest
    await this.loadSystemManifest();

    // Load additional config files
    await this.loadConfigFiles();

    this.logger.info('Configuration loaded successfully');
  }

  /**
   * Get configuration value
   */
  get<T = any>(key: string, defaultValue?: T): T {
    // Check environment variables first
    const envValue = process.env[key];
    if (envValue !== undefined) {
      return this.parseValue(envValue) as T;
    }

    // Check config map
    if (this.config.has(key)) {
      return this.config.get(key) as T;
    }

    // Return default value
    if (defaultValue !== undefined) {
      return defaultValue;
    }

    throw new Error(`Configuration key not found: ${key}`);
  }

  /**
   * Set configuration value
   */
  set(key: string, value: any): void {
    this.config.set(key, value);
  }

  /**
   * Check if configuration key exists
   */
  has(key: string): boolean {
    return process.env[key] !== undefined || this.config.has(key);
  }

  /**
   * Get system manifest
   */
  getManifest(): any {
    return this.systemManifest;
  }

  /**
   * Load environment variables into config
   */
  private loadEnvironmentVariables(): void {
    this.logger.info('Loading environment variables...');
    
    // Load .env file if it exists
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf-8');
      const lines = envContent.split('\n');
      
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const [key, ...valueParts] = trimmed.split('=');
          if (key) {
            const value = valueParts.join('=').trim();
            this.config.set(key.trim(), this.parseValue(value));
          }
        }
      }
    }
  }

  /**
   * Load system manifest
   */
  private async loadSystemManifest(): Promise<void> {
    this.logger.info('Loading system manifest...');
    
    const manifestPath = path.join(process.cwd(), 'manifests', 'system-manifest.yaml');
    
    if (fs.existsSync(manifestPath)) {
      const content = fs.readFileSync(manifestPath, 'utf-8');
      this.systemManifest = yaml.load(content);
      this.logger.info('System manifest loaded');
    } else {
      this.logger.warn('System manifest not found at:', manifestPath);
      this.systemManifest = {};
    }
  }

  /**
   * Load additional configuration files
   */
  private async loadConfigFiles(): Promise<void> {
    const configDir = path.join(process.cwd(), 'config');
    
    if (!fs.existsSync(configDir)) {
      return;
    }

    const files = fs.readdirSync(configDir);
    
    for (const file of files) {
      if (file.endsWith('.yaml') || file.endsWith('.yml')) {
        const filePath = path.join(configDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const data = yaml.load(content);
        
        const configKey = path.basename(file, path.extname(file));
        this.config.set(configKey, data);
        
        this.logger.info(`Loaded config file: ${file}`);
      }
    }
  }

  /**
   * Parse configuration value
   */
  private parseValue(value: string): any {
    // Try to parse as JSON
    if (value.startsWith('{') || value.startsWith('[')) {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }

    // Parse boolean
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;

    // Parse number
    if (!isNaN(Number(value)) && value !== '') {
      return Number(value);
    }

    // Return as string
    return value;
  }
}
