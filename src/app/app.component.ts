import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import videojs from 'video.js';
import * as mobileUi from 'videojs-mobile-ui';
import { FfmpegService } from './services/ffmpeg.service';
import { saveAs } from 'file-saver';
const convertSeconds = require('convert-seconds');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('videoPlayer', { static: true }) target?: ElementRef;
  // -- properties
  isDragover: boolean = false;
  file: File | null = null;
  isFileType: boolean = true;
  player?: videojs.Player;
  seconds: number = 0;
  isVideoInitialized: boolean = false;
  alertColor: string = 'white';
  alertMessage: string = 'drop your video!';
  isGeneratingScreenshots: boolean = false;
  screenshots: string[] = [];
  selectedScreenshot: string = '';

  constructor(public ffmpegService: FfmpegService) {
    this.ffmpegService.init();
  }

  ngOnInit() {
    this.player = videojs(this.target?.nativeElement);
    this.checkIfVideoDropped();
  }

  ngOnDestroy(): void {
    this.player?.dispose();
  }

  ngAfterViewInit(): void {}

  checkIfVideoDropped() {
    const bigPlayBtn = document.querySelector('.vjs-big-play-button');
    bigPlayBtn?.addEventListener('click', () => {
      if (!this.file) {
        this.alertMessage = 'please drop a video to start playing.';
      }
    });
  }

  async storeFile(event: Event) {
    // -- if ffmpeg hasn't load yet return
    if (!this.ffmpegService.isReady) return;
    if (this.isGeneratingScreenshots) {
      this.alertMessage = "you can't upload video while generating frames";
      return;
    }
    // -- set properties
    this.isFileType = true;
    this.isDragover = false;
    // -- retrieve file from event
    this.file = (event as DragEvent).dataTransfer
      ? (event as DragEvent).dataTransfer?.files?.item(0) ?? null
      : (event.target as HTMLInputElement)?.files?.item(0) ?? null;
    // -- if no file selected return
    if (!this.file) return;
    // -- if not the correct file format return
    if (this.file.type != 'video/mp4') {
      this.alertColor = 'red';
      this.alertMessage = 'only MP4 file format';
      return;
    }
    // --
    if (!this.player) return;
    this.player = videojs(this.target?.nativeElement);
    // -- create video src
    const videoSrc = URL.createObjectURL(this.file);
    this.player?.src({
      src: videoSrc,
      type: 'video/mp4',
    });

    // -- set properties
    this.isVideoInitialized = true;
    this.alertColor = 'green';
    this.alertMessage = 'video dropped successfully!';
    this.player.autoplay(true);
  }

  async generate() {
    console.log('🟡 generate function called');
    // -- get current seconds and pause
    this.seconds = Number(this.player?.currentTime()!.toString().split('.')[0]);
    this.player?.pause();
    const currDur = convertSeconds(this.seconds);
    // -- check if remaining seconds enough
    const remainSeconds = Number(
      this.player?.remainingTime()!.toString().split('.')[0]
    );
    if (remainSeconds < 5) {
      this.alertMessage = 'the remaining time must be more then 5 seconds';
      return;
    }
    // -- if no file or second == 0
    if (!this.file || !this.seconds) {
      if (!this.seconds) {
        this.alertMessage = 'play the video at least 1 second';
      } else {
        this.alertMessage =
          'Please drop a video to start generating screenshots.';
      }
      return;
    }
    // -- reset screenshots if generate again
    if (this.screenshots.length > 0) {
      this.screenshots = [];
    }
    this.isGeneratingScreenshots = true;
    // -- generate screenshots
    this.alertMessage = 'generating...';
    this.screenshots = await this.ffmpegService.generateScreenshots(
      this.file,
      currDur
    );
    this.isGeneratingScreenshots = false;
    console.log('💚💚💚 screenshots arrived');
    // --
    this.alertMessage = 'select a frame to download';
  }

  get disableIfGenOrNotStart() {
    if (this.isGeneratingScreenshots || !this.file) {
      return 'disabled:cursor-not-allowed';
    }
    return 'hover:bg-white hover:text-green-400 hover:ring-2 hover:ring-green-400';
  }

  get disableDownload() {
    if (this.selectedScreenshot.length > 0) {
      return 'ring-2 ring-green-400  hover:ring-2 hover:ring-white hover:bg-green-400 hover:text-white hover:shadow-lg';
    }
    return 'disabled:cursor-not-allowed text-green-200';
  }

  download() {
    console.log('🟡 download clicked');
    saveAs(this.selectedScreenshot, 'CoderNadir_Frameinder.png');
  }
}
