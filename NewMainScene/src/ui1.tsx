import {
  engine,
  Transform,
} from '@dcl/sdk/ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'
import ReactEcs, { Button, Input, Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { Cube } from './components'

// Global UI state variables
let CuratorAnswer = ''
let UserAsk = ''
let isConnected = false  // Flag to store connection state; initial value: not connected

export function SetCuratorAnswer(answer: string) {
  CuratorAnswer = answer
}

export function SetSocket(ws: WebSocket) {
  socket = ws
}

// New setter function to update the connection state
export function SetConnectionState(state: boolean) {
  isConnected = state
}

// WebSocket instance placeholder
let socket: WebSocket | null = null

export function CuratorChatUiEntity() {
  return CuratorChat
}

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
      {/* Clear button */}
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

      {/* Server answer display with scroll */}
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
          texture: { src: 'white.png' },
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

      {/* Multiline text input field */}
      <UiEntity
        uiTransform={{
          width: '100%',
          height: 49,
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

      {/* Send button: color depends on connection state */}
      <Button
        uiTransform={{ width: 60, height: 30, alignSelf: 'flex-end' }}
        value="Send"
        variant="primary"
        fontSize={16}
        onMouseDown={() => sendMessage(UserAsk)}
        uiBackground={{
          // Blue when connected, gray when not connected
          color: isConnected
            ? Color4.create(0.2, 0.2, 0.8, 0.7)
            : Color4.create(0.5, 0.5, 0.5, 0.7),
          textureMode: 'nine-slices',
          texture: { src: 'white.png' },
          textureSlices: { top: 0.4, bottom: 0.4, left: 0.4, right: 0.4 }
        }}
      />
    </UiEntity>
  </UiEntity>
);

function sendMessage(message: string) {
  // Clear the output field
  clearOutput()

  // Copy the message into the output field
  CuratorAnswer = message

  // Send the message to the server if the socket is open
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(message)
  }
}

// Function to clear the output field
function clearOutput() {
  CuratorAnswer = ''
}
