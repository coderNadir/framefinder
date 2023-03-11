import { Injectable } from '@angular/core';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { CurrDur } from '../models/current-duration';

@Injectable({
  providedIn: 'root',
})
export class FfmpegService {
  isReady: boolean = false;
  private ffmpeg;

  constructor() {
    // -- create an instance
    this.ffmpeg = createFFmpeg({ log: true });
  }

  async init() {
    // -- to prevent from loading ffmpeg over and over
    if (this.isReady) return;
    // -- load ffmpeg
    await this.ffmpeg.load();
    this.isReady = true;
  }

  async generateScreenshots(file: File, currDur: CurrDur) {
    // -- convert file data object into binary data
    const data = await fetchFile(file);
    // -- store binaru data into FS (file system)
    this.ffmpeg.FS('writeFile', file.name, data);
    const frames = [0, 1, 2, 3, 4];
    const commands: string[] = [];
    frames.forEach((frame) => {
      commands.push(
        // -- input
        '-i',
        file.name,
        // -- output options
        '-ss',
        `${currDur.hours}:${currDur.minutes}:${currDur.seconds + frame}`,
        '-frames:v',
        '1',
        '-filter:v',
        'scale=510:-1',
        // -- output
        `CoderNadir_FrameFinder_screenshot_${frame + 1}.png`
      );
    });

    // -- exract screenshots
    console.log('🟡🟡🟡 before running commands');
    await this.ffmpeg.run(...commands);
    console.log('🟡🟡🟡 finished running commands');

    // -- create screenshots URLs
    const screenshots: string[] = [];
    console.log('🟡🟡🟡 creating URLs');
    frames.forEach((frame) => {
      // -- read file from FS
      const screenshot = this.ffmpeg.FS(
        'readFile',
        `CoderNadir_FrameFinder_screenshot_${frame + 1}.png`
      );
      // -- create Blob
      const screenshotBlob = new Blob([screenshot.buffer], {
        type: 'image/png',
      });
      // -- create URL
      const screenshotURL = URL.createObjectURL(screenshotBlob);
      // -- push
      screenshots.push(screenshotURL);
    });
    // -- return created screenshots
    return screenshots;
  }
}
