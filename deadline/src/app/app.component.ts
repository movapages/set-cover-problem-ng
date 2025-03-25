import { Component, OnDestroy, OnInit } from '@angular/core';
import { CountdownService } from './service/countdown.service';
import { interval, Subscription, takeWhile } from 'rxjs';

@Component({
  selector: 'app-countdown',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class CountdownComponent implements OnInit, OnDestroy {
  secondsLeft: number = 0;
  private timerSubscription!: Subscription;

  constructor(private countdownService: CountdownService) {}

  ngOnInit(): void {
    this.loadCountdown();
  }

  loadCountdown(): void {
    this.countdownService.getSecondsLeft().subscribe({
      next: ({ secondsLeft }) => {
        this.secondsLeft = secondsLeft;
        this.startCountdown();
      },
      error: (error) => {
        console.error('Error fetching countdown:', error);
      }
    });
  }

  refreshCountdown(): void {
    this.timerSubscription?.unsubscribe();
    this.loadCountdown();
  }

  startCountdown(): void {
    this.timerSubscription = interval(1000)
      .pipe(takeWhile(() => this.secondsLeft > 0))
      .subscribe(() => {
        this.secondsLeft--;
        if (this.secondsLeft <= 0) {
          this.timerSubscription?.unsubscribe();
        }
      });
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
  }
}
