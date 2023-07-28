import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDuration'
})
export class FormatDurationPipe implements PipeTransform {
  transform(value: string): string {
    // Split input string into days, hours, minutes, seconds
    const parts = value.split(/d|:/);
    const days = +parts[0];
    const hours = +parts[1];
    const minutes = +parts[2];
    // const seconds = +parts[3]; // seconds are not used in this example

    // Build result string
    let result = '';
    if (days > 0) {
      result += `${days}d `;
    }
    if (hours > 0) {
      result += `${hours}h `;
    }
    if (minutes > 0) {
      result += `${minutes}m`;
    }

    return result.trim();
  }
}
