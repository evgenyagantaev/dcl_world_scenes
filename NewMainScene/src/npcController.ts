import { AvatarShape, engine, Transform } from '@dcl/sdk/ecs'
import { Vector3, Quaternion } from '@dcl/sdk/math'

/**
 * Creates an NPC avatar with a follow behavior.
 */
export function createNPC() {
  // Create the NPC entity.
  const npcEntity = engine.addEntity()

  // Create NPC avatar with the specified appearance.
  AvatarShape.create(npcEntity, {
    id: 'avatar',
    name: 'Curator',
    bodyShape: 'urn:decentraland:off-chain:base-avatars:BaseMale', // specify base model
    wearables: [
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

  // Initialize NPC transform (position and rotation).
  Transform.create(npcEntity, {
    position: Vector3.create(8, 0.08, 8),
    rotation: Quaternion.fromAngleAxis(-135, Vector3.create(0, 1, 0)),
  })

  // Movement parameters for the NPC.
  const FOLLOW_DISTANCE = 3
  const FOLLOW_SPEED = 4
  const HEIGHT_OFFSET = 0.1
  const STOPPING_DISTANCE = 0.2

  // Add a system for the NPC follow behavior.
  engine.addSystem((dt: number) => {
    const playerTransform = Transform.get(engine.PlayerEntity)
    const npcTransform = Transform.getMutable(npcEntity)
    
    if (!playerTransform) return

    // 1. Compute the direction from the NPC to the player.
    const toPlayerDirection = Vector3.subtract(
      playerTransform.position,
      npcTransform.position
    )

    // 2. Normalize the direction and calculate the target position.
    const distanceToPlayer = Vector3.length(toPlayerDirection)
    const normalizedDirection = Vector3.normalize(toPlayerDirection)
    
    // Calculate the target position: a point 3 meters away from the player.
    const targetPosition = Vector3.add(
      playerTransform.position,
      Vector3.scale(normalizedDirection, -FOLLOW_DISTANCE)
    )
    targetPosition.y = playerTransform.position.y + HEIGHT_OFFSET

    // 3. Compute the distance to that target position.
    const toTarget = Vector3.subtract(targetPosition, npcTransform.position)
    const targetDistance = Vector3.length(toTarget)

    // 4. Move the NPC if it is farther than the stopping distance.
    if (targetDistance > STOPPING_DISTANCE) {
      const movement = Vector3.scale(
        Vector3.normalize(toTarget),
        FOLLOW_SPEED * dt
      )
      npcTransform.position = Vector3.add(npcTransform.position, movement)
    }

    // 5. Rotate the NPC to face the player (with a slight delay).
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
  })
} 