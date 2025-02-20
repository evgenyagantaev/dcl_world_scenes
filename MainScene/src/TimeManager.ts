import { getWorldTime } from '~system/Runtime';
import { executeTask } from '@dcl/sdk/ecs';

export class TimeManager {
  // Method to fetch and process world time details and return a formatted time string.
  public async processWorldTime(): Promise<string> {
    // Fetch world time from Decentraland.
    const time = await getWorldTime({});
    console.log("Decentraland seconds since the start of the day:", time.seconds);

    // Calculate hours, minutes, and seconds based on world time.
    const hours = Math.floor(time.seconds / 3600);
    const minutes = Math.floor((time.seconds % 3600) / 60);
    const seconds = Math.floor(time.seconds % 60);
    console.log(`Decentraland time: ${hours}h ${minutes}m ${seconds}s`);

    // Get the current real world date.
    const realDate = new Date(Date.now());
    console.log("Current real date:", realDate.toString());

    // Combine the real date with world time.
    const combinedDate = new Date(realDate);
    combinedDate.setHours(hours, minutes, seconds);
    console.log("Combined in-world date and time:", combinedDate.toString());

    // Extract year, month and day from the combined date.
    const year = combinedDate.getFullYear();
    const month = combinedDate.getMonth() + 1; // Month is zero-indexed, so add 1.
    const day = combinedDate.getDate();

    // Extract hours and minutes for the formatted time.
    const formattedHours = combinedDate.getHours();
    const formattedMinutes = combinedDate.getMinutes();

    // Helper function to pad numbers with a leading zero if necessary.
    const pad = (num: number): string => num.toString().padStart(2, '0');

    // Format the date as YYYY.MM.DD and the time as HH:MM.
    const formattedDate = `${year}.${pad(month)}.${pad(day)}`;
    const formattedTime = `${pad(formattedHours)}:${pad(formattedMinutes)}`;

    // Return the final formatted string.
    return `${formattedDate}\n${formattedTime}`;
  }
} 