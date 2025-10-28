// 代码生成时间: 2025-10-28 18:38:26
const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

// Check if FFmpeg is installed
if (!ffmpeg.sync()) {
  console.error('FFmpeg is not installed!');
  app.exit(1);
}

// Main application class
class MediaTranslator {
  constructor() {
    this.window = null;
  }

  // Create the main BrowserWindow
  createWindow() {
    this.window = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    this.window.loadFile('index.html');

    this.window.on('closed', () => {
      this.window = null;
    });
  }

  // Start the application
  start() {
    this.createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createWindow();
      }
    });
  }

  // Transcode media files
  transcodeFile(inputPath, outputPath) {
    try {
      // Check if the input file exists
      if (!fs.existsSync(inputPath)) {
        throw new Error('Input file does not exist.');
      }

      // Create output directory if it doesn't exist
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Start transcoding
      ffmpeg(inputPath)
        .on('error', (err) => {
          console.error('Transcoding error:', err.message);
        })
        .on('end', () => {
          console.log('Transcoding completed.');
        })
        .output(outputPath)
        .run();
    } catch (error) {
      console.error('Error transcoding file:', error.message);
    }
  }
}

// Create an instance of MediaTranslator and start the app
const mediaTranslator = new MediaTranslator();
mediaTranslator.start();