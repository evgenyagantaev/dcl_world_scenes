// Declare global Camera for TypeScript.
declare const Camera: { instance: { position: Vector3 } };

// We define the empty imports so the auto-complete feature works as expected.
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { AvatarShape, EasingFunction, engine, Transform, Tween } from '@dcl/sdk/ecs'

import { changeColorSystem, circularSystem } from './systems'
import { setupUi } from './ui'
import { CuratorChatUiEntity, SetCuratorAnswer, SetSocket } from './ui1'

import { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import * as ui from 'dcl-ui-toolkit'
import { SocketService } from './network/socketService'

function getPlayerPosition() {
  const playerPosition = Transform.getOrNull(engine.PlayerEntity)
  if (!playerPosition) return ' no data yet'
  const { x, y, z } = playerPosition.position
  return `{X: ${x.toFixed(2)}, Y: ${y.toFixed(2)}, z: ${z.toFixed(2)} }`
}

export function main() {
  console.log('main starting...\n')

  // Set the UI renderer as part of the initialization process.
  ReactEcsRenderer.setUiRenderer(CuratorChatUiEntity())

  let CuratorAvatar = engine.addEntity()
  AvatarShape.create(CuratorAvatar, {
    id: 'avatar',
    name: 'Curator',
    bodyShape: 'urn:decentraland:off-chain:base-avatars:BaseMale', // Указываем базовую модель
    wearables: [
      // Правильные URN для предметов одежды
      'urn:decentraland:off-chain:base-avatars:retro_sunglasses',
      'urn:decentraland:off-chain:base-avatars:beard',
      'urn:decentraland:off-chain:base-avatars:casual_hair_01',
      'urn:decentraland:off-chain:base-avatars:black_jacket',
      'urn:decentraland:off-chain:base-avatars:brown_pants',
      'urn:decentraland:off-chain:base-avatars:sneakers',
      'urn:decentraland:off-chain:base-avatars:black_street_glove'
    ],
    emotes: ['idle'],
    expressionTriggerId: 'idle'
  })

  Transform.create(CuratorAvatar, {
    position: Vector3.create(4, 0.08, 5),
    rotation: Quaternion.fromAngleAxis(-135, Vector3.create(0, 1, 0)),
  })

  // Initialize the WebSocket and connect
  console.log('initializing WebSocket...\n')
  const socket = new WebSocket('wss://78.153.149.194:37137');
  SetSocket(socket)
  console.log('WebSocket initialized\n')

  socket.onopen = () => {
    console.log('WebSocket is open\n');
  };

  socket.onmessage = (event) => 
  {
    SetCuratorAnswer(event.data)
  };

  socket.onclose = () => {
    console.log('WebSocket is closed\n');
  };

  // Система плавного поворота NPC к игроку
  engine.addSystem((dt: number) => {
    // Получаем трансформ игрока
    const playerTransform = Transform.get(engine.PlayerEntity);
    if (!playerTransform) return;

    // Получаем трансформ NPC
    const npcTransform = Transform.getMutable(CuratorAvatar);
    
    // Рассчитываем направление к игроку
    const direction = Vector3.subtract(playerTransform.position, npcTransform.position);
    direction.y = 0; // Игнорируем вертикальную ось
    
    // Создаем целевую позицию немного перед игроком
    const targetPosition = Vector3.add(playerTransform.position, Vector3.scale(Vector3.normalize(direction), 0.5));
    
    // Получаем кватернион поворота с учетом системы координат
    const targetRotation = Quaternion.fromLookAt(
      npcTransform.position,
      targetPosition,
      Vector3.Up() // Вектор "вверх" мира
    );
    
    // Плавно интерполируем текущий поворот
    npcTransform.rotation = Quaternion.slerp(
      npcTransform.rotation,
      targetRotation,
      dt * 5 // Скорость поворота
    );
  });
}
