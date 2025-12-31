#!/usr/bin/env node
/**
 * Bootstrap CLI - Creates new business vertical from template
 */

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '../core/logger.js';

const logger = new Logger('Bootstrap');
const program = new Command();

program
  .name('bootstrap')
  .description('Bootstrap a new business vertical')
  .requiredOption('--vertical <name>', 'Industry vertical name')
  .option('--config <path>', 'Custom configuration file')
  .option('--template <name>', 'Template name (if different from vertical)')
  .action(async (options) => {
    try {
      logger.info(`Bootstrapping ${options.vertical} vertical...`);
      
      const templateName = options.template || options.vertical;
      const templatePath = path.join(process.cwd(), 'templates', 'industries', templateName);
      
      if (!fs.existsSync(templatePath)) {
        logger.error(`Template not found: ${templateName}`);
        logger.info('Available templates:');
        const templatesDir = path.join(process.cwd(), 'templates', 'industries');
        if (fs.existsSync(templatesDir)) {
          const templates = fs.readdirSync(templatesDir);
          templates.forEach(t => logger.info(`  - ${t}`));
        }
        process.exit(1);
      }

      // Create instance directory
      const instancePath = path.join(process.cwd(), 'instances', options.vertical);
      if (fs.existsSync(instancePath)) {
        logger.warn(`Instance already exists: ${instancePath}`);
        logger.info('Use --force to overwrite');
        process.exit(1);
      }

      fs.mkdirSync(instancePath, { recursive: true });
      
      // Copy template files
      copyDirectory(templatePath, instancePath);
      
      // Apply configuration
      if (options.config) {
        const configPath = path.resolve(options.config);
        if (fs.existsSync(configPath)) {
          fs.copyFileSync(configPath, path.join(instancePath, 'config.yaml'));
        }
      }

      logger.info(`Successfully bootstrapped ${options.vertical} vertical`);
      logger.info(`Instance created at: ${instancePath}`);
      logger.info('');
      logger.info('Next steps:');
      logger.info(`  1. cd ${instancePath}`);
      logger.info('  2. Review and update config.yaml');
      logger.info('  3. npm run agent:deploy-all');
      logger.info('  4. npm start');
      
    } catch (error) {
      logger.error('Bootstrap failed:', error);
      process.exit(1);
    }
  });

function copyDirectory(src: string, dest: string): void {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

program.parse();
