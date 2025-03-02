/**
 * Timer utility functions for Decentraland
 * Provides a way to handle setTimeout and clearTimeout functionality
 */

import { engine } from '@dcl/sdk/ecs'

// Map to store active timers
const activeTimers: Map<number, { callback: () => void; remaining: number }> = new Map()
let nextTimerId = 1

/**
 * Creates a timeout that runs a callback after a specified delay
 * @param callback Function to call when timeout completes
 * @param delay Delay in milliseconds
 * @returns Timer ID that can be used to clear the timeout
 */
export function createTimeout(callback: () => void, delay: number): number {
  const timerId = nextTimerId++
  
  // Store timer information
  activeTimers.set(timerId, {
    callback,
    remaining: delay
  })
  
  // Create the timer system if it doesn't exist yet
  ensureTimerSystem()
  
  return timerId
}

/**
 * Cancels a timeout created with createTimeout
 * @param timerId The timer ID to cancel
 */
export function cancelTimeout(timerId: number): void {
  activeTimers.delete(timerId)
}

// Flag to track if timer system has been added
let timerSystemAdded = false

// Creates the timer system if it doesn't exist
function ensureTimerSystem(): void {
  if (timerSystemAdded) return
  
  // Add timer processing system
  engine.addSystem(processTimers)
  timerSystemAdded = true
}

// System to process timers each frame
function processTimers(dt: number): void {
  // Convert dt to milliseconds (dt is in seconds)
  const dtMs = dt * 1000
  
  // Process each active timer
  activeTimers.forEach((timer, timerId) => {
    // Reduce remaining time
    timer.remaining -= dtMs
    
    // If timer has completed
    if (timer.remaining <= 0) {
      // Execute callback
      timer.callback()
      
      // Remove timer from active timers
      activeTimers.delete(timerId)
    }
  })
} 