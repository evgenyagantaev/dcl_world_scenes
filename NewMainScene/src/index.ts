// Declare global Camera for TypeScript.
declare const Camera: { instance: { position: Vector3 } };

// We define the empty imports so the auto-complete feature works as expected.
import { Vector3 } from '@dcl/sdk/math'
import { AvatarShape, EasingFunction, engine, Transform, Tween } from '@dcl/sdk/ecs'

import { CuratorChatUiEntity } from './ui1'

import { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import { SocketService } from './network/socketService'
import { createNPC } from './npcController'

export function main() {
  console.log('main starting...\n')

  // Set the UI renderer during initialization.
  ReactEcsRenderer.setUiRenderer(CuratorChatUiEntity())

  // Initialize the WebSocket.
  new SocketService('wss://78.153.149.194:37137');

  // Setup NPC and its follow behavior.
  createNPC()
  
  // Additional logic can follow...
}
