import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-destinations-scroll',
  standalone: true,
  template: '',
})
export class DestinationsScroll implements AfterViewInit {
  ngAfterViewInit(): void {
    setTimeout(() => {
      const nav = performance.getEntriesByType('navigation')[0] as
        | PerformanceNavigationTiming
        | undefined;
      if (nav?.type === 'reload') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const section = document.getElementById('destinations');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);
  }
}
