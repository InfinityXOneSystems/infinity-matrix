/**
 * Logger
 * 
 * Centralized logging with multiple levels and formatting
 */

import * as winston from 'winston';

export class Logger {
  private logger: winston.Logger;
  private context: string;

  constructor(context: string) {
    this.context = context;
    
    const logLevel = process.env.LOG_LEVEL || 'info';
    
    this.logger = winston.createLogger({
      level: logLevel,
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
      ),
      defaultMeta: { service: 'infinity-matrix', context: this.context },
      transports: [
        // Console transport
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(({ level, message, context, timestamp }) => {
              return `${timestamp} [${context}] ${level}: ${message}`;
            })
          )
        }),
        // File transport for all logs
        new winston.transports.File({ 
          filename: 'logs/combined.log',
          maxsize: 10485760, // 10MB
          maxFiles: 5
        }),
        // File transport for errors only
        new winston.transports.File({ 
          filename: 'logs/error.log',
          level: 'error',
          maxsize: 10485760, // 10MB
          maxFiles: 5
        })
      ]
    });
  }

  info(message: string, ...meta: any[]): void {
    this.logger.info(message, ...meta);
  }

  error(message: string, ...meta: any[]): void {
    this.logger.error(message, ...meta);
  }

  warn(message: string, ...meta: any[]): void {
    this.logger.warn(message, ...meta);
  }

  debug(message: string, ...meta: any[]): void {
    this.logger.debug(message, ...meta);
  }

  verbose(message: string, ...meta: any[]): void {
    this.logger.verbose(message, ...meta);
  }
}
