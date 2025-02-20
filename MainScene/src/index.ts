import { AvatarShape, EasingFunction, engine, executeTask, Tween } from '@dcl/sdk/ecs'
import { TimeManager } from './TimeManager'
import { Vector3, Quaternion, Color3, Color4 } from '@dcl/sdk/math'
import { Transform, GltfContainer, TextShape, Entity, MeshRenderer, MeshCollider, Material } from '@dcl/sdk/ecs'
//import ReactEcs, { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import ReactEcs, { ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'

import { setupUi } from './ui'
import { getPlayer } from '@dcl/sdk/src/players'
import { movePlayerTo } from '~system/RestrictedActions'
import { triggerEmote } from '~system/RestrictedActions'
import { getRealm } from '~system/Runtime'



export function main() 
{
  executeTask(async () => {
    const realm = await getRealm({})
    console.log(`You are in the realm: `, realm.realmInfo?.realmName)
  })

  const curatorNpc = engine.addEntity()
  AvatarShape.create(curatorNpc, {
    id: '',
    name: 'Curator',
    emotes: ['wave'],
    wearables: [],
    expressionTriggerId: '',
    talking: false
  })

  Transform.create(curatorNpc, {
    position: Vector3.create(4, 0.025, 17),
    rotation: Quaternion.fromEulerDegrees(180, 0, 0),
  })

  // Start moving the NPC with Tween
  Tween.create(curatorNpc, {
    mode: Tween.Mode.Move({
      start: Vector3.create(4, 0.025, 17),
      end: Vector3.create(4, 0.025, 5)
    }),
    duration: 5000,
    easingFunction: EasingFunction.EF_LINEAR
  });

  //
  // Instead of using a setTimeout, use a system to wait for the tween to finish
  let accumulatedTime = 0
  let waveTriggered = false
  engine.addSystem((dt: number) => {
    if (waveTriggered) return
    // dt is in seconds; tween duration is 7 seconds
    accumulatedTime += dt
    if (accumulatedTime >= 5) {
      // Get the mutable avatar shape component, reset then set the trigger.
      const avatarShape = AvatarShape.getMutable(curatorNpc)
      avatarShape.expressionTriggerId = ''  // reset to ensure we can trigger it
      avatarShape.expressionTriggerId = 'wave'
      waveTriggered = true
    }
  })

  // Accumulator for elapsed seconds
  let elapsed = 0
  const timeManager = new TimeManager()

  // Pass a JSX element (<MyUI />), not the function MyUI itself.
  //ReactEcsRenderer.setUiRenderer(() => <MyUI />)

  //
  setupUi()
  

  // Signpost
  const signpost = engine.addEntity()
  GltfContainer.create(signpost, {
    src: 'models/FenceStoneTallLarge.glb'
  })
  Transform.create(signpost, {
    //parent: _scene,
    position: { x: 11.5, y: 0, z: 14 },
    //scale: Vector3.create(1, 1, 1),
    rotation: Quaternion.fromEulerDegrees(0, 210, 0)
  })

  
  

  // Create the text entity once at startup
  const textEntity = engine.addEntity()
  Transform.create(textEntity, {
    // Set text position
    position: Vector3.create(30, 3, 29.7)
  })

  TextShape.create(textEntity, {
    text: "This world is\n" + "under construction",
    fontSize: 3,
    textColor : Color4.create (1, 0, 0, 1)
  })

  // Create the calendar stone entity once at startup
  const calendarStone = engine.addEntity()
  Transform.create(calendarStone, {
    position: Vector3.create(8, 2.5, 8),
    rotation: Quaternion.fromEulerDegrees(0, 180, 90),
    scale: Vector3.create(3.0, 3, 1.5)
  })
  GltfContainer.create(calendarStone, {
    src: "assets/asset-packs/ad_rock/Rock_03/Rock_03.glb",
  })

  // Calendar Text
  const calendarText = engine.addEntity()
  Transform.create(calendarText, {
    //parent: calendarStone,
    position: { x: 9.2, y: 3, z: 7.45 },
    //scale: Vector3.create(0.33, 0.33, 0.6),
    rotation: Quaternion.fromEulerDegrees(0, -13, 0)
  })
  TextShape.create(calendarText, {
    text: 'MODERN CALENDAR' + '\n' + '2025' + '\n' + 'Einstein 17' + '\n' + 'penicillin',
    fontSize: 1.5,
    textColor : Color4.create (1, 0, 0, 1)
  })

  // Create the cube entity once at startup
  spawnBlueCubeWithRedH(30, 3, 30)


  // System to update the text every minute with the current in-world time
  engine.addSystem((dt: number) => {
    elapsed += dt
    if (elapsed >= 60) {
      elapsed -= 60
      executeTask(async () => {
        // Retrieve and append the current system time to the text
        const timeString = await timeManager.processWorldTime()
        const textComponent = TextShape.getMutable(textEntity)
        textComponent.text = "This world is\n" + "under construction\n" + timeString
      })
    }
  })

}

/**
 * Spawns a blue cube
 * The cube is created only once at startup.
 * @param x - X position of the cube.
 * @param y - Y position of the cube.
 * @param z - Z position of the cube.
 * @returns The cube entity.
 */
function spawnBlueCubeWithRedH(x: number, y: number, z: number): Entity {
  // Create the cube entity
  const cube = engine.addEntity()
  
  // Set cube transform component
  Transform.create(cube, {
    position: Vector3.create(x, y, z),
    rotation: Quaternion.fromEulerDegrees(0, 0, 0),
    scale: Vector3.create(4, 4, 0.3)
  })

  // Set mesh renderer and collider for the cube
  MeshRenderer.setBox(cube)
  MeshCollider.setBox(cube)

  // Apply a blue material to the cube
  Material.setPbrMaterial(cube, { albedoColor: Color4.fromHexString("#0000FF") })

  return cube
}
