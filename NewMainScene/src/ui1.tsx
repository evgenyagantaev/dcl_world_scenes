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
      height: 850,
      margin: { top: '70px', left: '1160px' },
    }}
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
      uiBackground={{ color: Color4.Clear() }}
    >
      {/* Кнопка Clear */}
      <Button
        uiTransform={{ width: 40, height: 30, alignSelf: 'flex-end', margin: { bottom: 8 } }}
        value="X"
        variant="primary"
        fontSize={16}
        onMouseDown={() => clearOutput()}
        uiBackground={{
          color: Color4.create(0.8, 0.2, 0.2, 0.1),
          textureMode: 'nine-slices',
          texture: { src: 'white.png' },
          textureSlices: { top: 0.4, bottom: 0.4, left: 0.4, right: 0.4 }
        }}
      />

      {/* Ответ сервера с прокруткой */}
      <UiEntity
        uiTransform={{
          width: '100%',
          height: '100%',
          margin: { bottom: 10 },
          overflow: 'scroll'
        }}
        uiBackground={{
          color: Color4.create(0.1, 0.1, 0.1, 0.1),
          textureMode: 'nine-slices',
          texture: { src: 'white.png' }, // Нужна белая текстура в проекте
          textureSlices: { top: 0.1, bottom: 0.1, left: 0.1, right: 0.1 }
        }}
      >
        <Label
          value={CuratorAnswer}
          fontSize={18}
          color={Color4.White()}
          uiTransform={{
            width: '100%',
            height: '100%',
            margin: { left: 8, right: 8, top: 8, bottom: 8 }
          }}
          textAlign="top-left"
        />
      </UiEntity>

      {/* Поле ввода многострочного текста */}
      <UiEntity
        uiTransform={{
          width: '100%',
          height: 47,
          margin: { bottom: 10 },
          flexDirection: 'column'
        }}
        uiBackground={{
          color: Color4.create(0.1, 0.1, 0.1, 0.5),
          textureMode: 'nine-slices',
          texture: { src: 'white.png' },
          textureSlices: { top: 0.1, bottom: 0.1, left: 0.1, right: 0.1 }
        }}
      >
        <Input
          uiTransform={{ width: '100%', height: '100%' }}
          fontSize={18}
          color={Color4.White()}
          placeholder="Type your message..."
          placeholderColor={Color4.Gray()}
          onChange={(value) => (UserAsk = value)}
          onSubmit={() => sendMessage(UserAsk)}
        />
      </UiEntity>

      {/* Кнопка отправки */}
      <Button
        uiTransform={{ width: 60, height: 30, alignSelf: 'flex-end' }}
        value="Send"
        variant="primary"
        fontSize={16}
        onMouseDown={() => sendMessage(UserAsk)}
        uiBackground={{
          color: Color4.create(0.2, 0.2, 0.8, 0.7),
          textureMode: 'nine-slices',
          texture: { src: 'white.png' },
          textureSlices: { top: 0.4, bottom: 0.4, left: 0.4, right: 0.4 }
        }}
      />
    </UiEntity>
  </UiEntity>
);

function sendMessage(message: string) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(message)
  }
}

// Функция для очистки поля вывода
function clearOutput() {
  CuratorAnswer = ''
}
