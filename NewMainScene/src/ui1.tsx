import {
  engine,
  Transform,
} from '@dcl/sdk/ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'
import ReactEcs, { Button, Input, Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { Cube } from './components'

export function CuratorChatUiEntity() {
  return CuratorChat
}

let socket: WebSocket | null = null

export function SetCuratorAnswer(answer: string) {
  CuratorAnswer = answer
}

export function SetSocket(ws: WebSocket) {
  socket = ws
}

let CuratorAnswer = ''
let UserAsk = ''

const CuratorChat = () => (
  <UiEntity
    uiTransform={{
      width: 700,
      height: 800,
      //margin: '16px 0 8px 270px',
      margin: { top: '70px', left: '1200px' },
    }}
    //uiBackground={{ color: Color4.create(0.5, 0.8, 0.1, 0.6) }}
    uiBackground={{ color: Color4.Clear() }}
  >
    <UiEntity
      uiTransform={{
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end'
      }}
      //uiBackground={{ color: Color4.fromHexString("#70ac76ff") }}
      uiBackground={{ color: Color4.Clear() }}
    >
      
      <Label
        value={ CuratorAnswer }
        fontSize={18}
        uiTransform={{ width: '100%', height: '100%' } }
      />
      <Label
        value={`Talk to Curator`}
        fontSize={18}
        uiTransform={{ width: '100%', height: 30 } }
      />
      
      <Input
        uiTransform={{ width: 600, height: 45, margin: 8, alignSelf: 'flex-end' }}
        fontSize={18}
        color={Color4.White()}
        placeholder="Enter your text here"
        placeholderColor={Color4.fromHexString("#80808080")}
        onChange={(value) => {
          UserAsk = value
        }}
        onSubmit={(value) => {
          sendMessage(UserAsk)
          value = UserAsk
        }}
        uiBackground={{ color: Color4.fromHexString("#ffffff00") }}
      />

      <Button
        uiTransform={{ width: 50, height: 30, margin: 8, alignSelf: 'flex-end' }}
        value='>>>'
        variant='primary'
        fontSize={14}
        onMouseDown={() => {
          sendMessage(UserAsk)
        }}
        uiBackground={{ color: Color4.fromHexString("#0000ff80") }}
      />
    </UiEntity>
  </UiEntity>
)

function sendMessage(message: string) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(message)
  }
}

function getPlayerPosition() {
  const playerPosition = Transform.getOrNull(engine.PlayerEntity)
  if (!playerPosition) return ' no data yet'
  const { x, y, z } = playerPosition.position
  return `{X: ${x.toFixed(2)}, Y: ${y.toFixed(2)}, z: ${z.toFixed(2)} }`
}

