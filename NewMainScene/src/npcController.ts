import { AvatarShape, engine, Transform, PointerEvents, PointerEventType, InputAction, Entity, MeshCollider, MeshRenderer, Material, inputSystem } from '@dcl/sdk/ecs'
import { Vector3, Quaternion, Color4 } from '@dcl/sdk/math'

let isDialogVisible = false

export function toggleDialogVisibility() {
  isDialogVisible = !isDialogVisible
  return isDialogVisible
}

export function getDialogVisibility() {
  return isDialogVisible
}

/**
 * Creates an NPC avatar with a follow behavior.
 * @returns The entity ID of the created NPC
 */
export function createNPC(): Entity {
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
    position: Vector3.create(8, 0.0, 8),
    rotation: Quaternion.fromAngleAxis(-135, Vector3.create(0, 1, 0)),
  })

  // Create a separate collision entity for the NPC
  const collisionEntity = engine.addEntity()
  Transform.create(collisionEntity, {
    parent: npcEntity,
    position: Vector3.create(0, 1.0, 0), // Position it at the center of the avatar
    scale: Vector3.create(0.8, 2.0, 0.8) // Scale to roughly match avatar size
  })
  
  // Add a visible mesh for debugging (can be made invisible later)
  MeshRenderer.setBox(collisionEntity)
  Material.setPbrMaterial(collisionEntity, {
    albedoColor: Color4.create(1, 0, 0, 0.3), // Semi-transparent red
  })
  
  // Add collider to the collision entity
  MeshCollider.setBox(collisionEntity)
  
  // Add pointer events to the collision entity
  PointerEvents.create(collisionEntity, {
    pointerEvents: [
      { 
        eventType: PointerEventType.PET_DOWN, 
        eventInfo: { 
          button: InputAction.IA_POINTER, 
          hoverText: '👉 Talk to Curator 👈' 
        } 
      },
      { 
        eventType: PointerEventType.PET_HOVER_ENTER, 
        eventInfo: { 
          button: InputAction.IA_POINTER, 
          hoverText: '👉 Talk to Curator 👈' 
        } 
      }
    ]
  })

  // Add system to handle curator clicks on the collision entity
  engine.addSystem(() => {
    if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN, collisionEntity)) {
      toggleDialogVisibility()
    }
  })

  // Movement parameters for the NPC.
  const FOLLOW_DISTANCE = 3
  const FOLLOW_SPEED = 4
  const HEIGHT_OFFSET = 0.025
  const STOPPING_DISTANCE = 0.2

  // Add a system for the NPC follow behavior.
  engine.addSystem((dt: number) => {
    const playerTransform = Transform.getMutable(engine.PlayerEntity)
    playerTransform.position.y = 0.0
    const npcTransform = Transform.getMutable(npcEntity)
    
    if (!playerTransform) return

    // 1. Compute the direction from the NPC to the player.
    const toPlayerDirection = Vector3.subtract(
      playerTransform.position,
      npcTransform.position
    )

    // 2. Calculate the distance to the player.
    const distanceToPlayer = Vector3.length(toPlayerDirection)

    // 3. If the player is too far, move towards them.
    if (distanceToPlayer > FOLLOW_DISTANCE + STOPPING_DISTANCE) {
      // Normalize the direction vector
      const normalizedDirection = Vector3.normalize(toPlayerDirection)

      // Calculate the target position
      const targetPosition = Vector3.subtract(
        playerTransform.position,
        Vector3.scale(normalizedDirection, FOLLOW_DISTANCE)
      )

      // Move towards the target position
      const moveDirection = Vector3.normalize(
        Vector3.subtract(targetPosition, npcTransform.position)
      )
      const movement = Vector3.scale(moveDirection, FOLLOW_SPEED * dt)

      npcTransform.position = Vector3.add(npcTransform.position, movement)
      npcTransform.position.y = HEIGHT_OFFSET

      // Make the NPC face the player
      const lookAtTarget = Vector3.create(
        playerTransform.position.x,
        npcTransform.position.y,
        playerTransform.position.z
      )
      const direction = Vector3.subtract(lookAtTarget, npcTransform.position)
      npcTransform.rotation = Quaternion.lookRotation(direction)
    }
  })

  return npcEntity
} 