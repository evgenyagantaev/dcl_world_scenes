// Declare global Camera for TypeScript.
declare const Camera: { instance: { position: Vector3 } };

import { CuratorChatUiEntity } from './curator_chat_ui'
import { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import { SocketService } from './network/socketService'
import { createNPC, toggleDialogVisibility } from './npcController'
import { GuestBookUiEntity, toggleGuestBookVisibility } from './guest_book_ui'
import { engine, Transform, Material, TextShape, Billboard, MeshRenderer, MeshCollider, InputAction, PointerEventType, PointerEvents, inputSystem } from '@dcl/sdk/ecs'
import { Cube } from './components'
import { Color4, Vector3, Quaternion } from '@dcl/sdk/math'
import { getRandomHexColor } from './utils';

export function main() {
  console.log('main starting...\n')

  // Set the UI renderers during initialization.
  const curatorUI = CuratorChatUiEntity()
  const guestBookUI = GuestBookUiEntity()
  ReactEcsRenderer.setUiRenderer(() => {
    const curatorElement = curatorUI()
    const guestBookElement = guestBookUI()
    return curatorElement || guestBookElement
  })

  // Initialize the WebSocket.
  new SocketService('wss://78.153.149.194:37137');

  // Setup NPC and its follow behavior.
  const npcEntity = createNPC()
  
  // Note: The click handler for the NPC is now handled inside the createNPC function

  //************************************* */
  const guestBook = engine.addEntity()
  Cube.create(guestBook)
  Transform.create(guestBook, {
    position: Vector3.create(1, 1.0, 4),
    rotation: Quaternion.fromEulerDegrees(45, -20, 0),
    scale: Vector3.create(1, 1, 0.1)
  })
  MeshRenderer.setBox(guestBook)
  MeshCollider.setBox(guestBook)
  Material.setPbrMaterial(guestBook, {
    albedoColor: Color4.create(0.96, 0.96, 0.86, 1)
  })

  // Create text
  const guestBookText = engine.addEntity()
  Transform.create(guestBookText, {
    parent: guestBook,
    position: Vector3.create(0, 0, -0.7)
  })
  TextShape.create(guestBookText, {
    text: 'Guest Book',
    fontSize: 1.3,
    textColor: Color4.create(0, 0, 0, 1)
  })

  PointerEvents.create(guestBook, {
    pointerEvents: [
      { eventType: PointerEventType.PET_DOWN, eventInfo: { button: InputAction.IA_POINTER, hoverText: 'Open Guest Book' } }
    ]
  })

  // Add system to handle guest book clicks
  engine.addSystem(() => {
    if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN, guestBook)) {
      toggleGuestBookVisibility()
    }
  })

  //************************************* */
  const constructionBoard = engine.addEntity()
  Cube.create(constructionBoard)
  Transform.create(constructionBoard, {
    position: Vector3.create(3, 2.5, 27),
    rotation: Quaternion.fromEulerDegrees(0, 0, 0),
    scale: Vector3.create(3, 3, 0.3)
  })
  MeshRenderer.setBox(constructionBoard)
  MeshCollider.setBox(constructionBoard)
  Material.setPbrMaterial(constructionBoard, {
    albedoColor: Color4.create(0.0, 0.0, 1.0, 1)
  })

  // Создание текста
  const constructionBoardText = engine.addEntity()
  Transform.create(constructionBoardText, {
    parent: constructionBoard,
    position: Vector3.create(0, 0, -0.65)
  })
  TextShape.create(constructionBoardText, {
    text: 'This World is' + '\n' + 'under Construction',
    fontSize: 1.0,
    textColor: Color4.create(1.0, 0.0, 0.0, 1)
  })
  //Billboard.create(constructionBoardText)
  //*************************************
  
}
