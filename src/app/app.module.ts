import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppEventBlockerDirective } from './directives/app-event-blocker.directive';
import { AlertComponent } from './alert/alert.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SafeURLPipe } from './pipes/safe-url.pipe';
@NgModule({
  declarations: [AppComponent, AppEventBlockerDirective, AlertComponent, SafeURLPipe],
  imports: [BrowserModule, BrowserAnimationsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
