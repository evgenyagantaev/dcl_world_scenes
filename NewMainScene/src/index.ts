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

  // Initialize the WebSocket using SocketService
  new SocketService('wss://78.153.149.194:37137');

  const FOLLOW_DISTANCE = 3
  const FOLLOW_SPEED = 4
  const HEIGHT_OFFSET = 0.1
  const STOPPING_DISTANCE = 0.2

  engine.addSystem((dt: number) => {
    const playerTransform = Transform.get(engine.PlayerEntity)
    const npcTransform = Transform.getMutable(CuratorAvatar)
    
    if (!playerTransform) return

    // 1. Получаем направление от NPC к игроку
    const toPlayerDirection = Vector3.subtract(
        playerTransform.position,
        npcTransform.position
    )
    
    // 2. Нормализуем направление и вычисляем целевую позицию
    const distanceToPlayer = Vector3.length(toPlayerDirection)
    const normalizedDirection = Vector3.normalize(toPlayerDirection)
    
    // Новая целевая позиция - 3 метра от игрока вдоль линии NPC-игрок
    const targetPosition = Vector3.add(
        playerTransform.position,
        Vector3.scale(normalizedDirection, -FOLLOW_DISTANCE)
    )
    targetPosition.y = playerTransform.position.y + HEIGHT_OFFSET

    // 3. Вычисляем дистанцию до целевой позиции
    const toTarget = Vector3.subtract(targetPosition, npcTransform.position)
    const targetDistance = Vector3.length(toTarget)

    // 4. Движение только если NPC слишком далеко от цели
    if (targetDistance > STOPPING_DISTANCE) {
        const movement = Vector3.scale(
            Vector3.normalize(toTarget),
            FOLLOW_SPEED * dt
        )
        npcTransform.position = Vector3.add(npcTransform.position, movement)
    }

    // 5. Поворот NPC лицом к игроку (с небольшой задержкой)
    if (distanceToPlayer > 0.5) {
        const lookDirection = Vector3.subtract(
            playerTransform.position,
            npcTransform.position
        )
        lookDirection.y = 0
        
        if (Vector3.lengthSquared(lookDirection) > 0.01) {
            const targetRotation = Quaternion.fromLookAt(
                npcTransform.position,
                Vector3.add(npcTransform.position, lookDirection)
            )
            npcTransform.rotation = Quaternion.slerp(
                npcTransform.rotation,
                targetRotation,
                Math.min(dt * 5, 1)
            )
        }
    }
  });
}
