// guest-book.ts
import { engine, Transform, Material, TextShape, Billboard } from '@dcl/sdk/ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'

export function GuestBookUiEntity() {
  // Создание 3D объекта
  const board = engine.addEntity()
  Transform.create(board, {
    position: Vector3.create(1, 1, 5),
    scale: Vector3.create(2, 2, 0.2)
  })
  Material.setPbrMaterial(board, {
    albedoColor: Color4.create(0.96, 0.96, 0.86, 1)
  })

  // Создание текста
  const text = engine.addEntity()
  Transform.create(text, {
    parent: board,
    position: Vector3.create(0, 0, 0.11)
  })
  TextShape.create(text, {
    text: 'Guest Book',
    fontSize: 0.3
  })
  Billboard.create(text)

  // Возвращаем пустой UI компонент
  return () => {}
}
