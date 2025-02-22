import {
  engine,
  Transform,
} from '@dcl/sdk/ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'
import ReactEcs, { Button, Input, Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { Cube } from './components'

// Define the maximum number of characters that fit in the label component
const MAX_CHARS_PER_PAGE = 1750;  // Adjust this constant as needed

// Global UI state variables
let CuratorAnswer = ''
let UserAsk = ''
let isConnected = false  // Flag to store connection state; initial value: not connected

// Pagination state variables
let curatorAnswerPages: string[] = []  // List to store the pages of the answer
let currentPageIndex = 0               // Index of the currently displayed page
let copyBuffer = ''

export function SetCuratorAnswer(answer: string) {
  // Split the answer string into pages based on the max character limit
  curatorAnswerPages = []
  currentPageIndex = 0
  for (let i = 0; i < answer.length; i += MAX_CHARS_PER_PAGE) {
    const page = answer.substring(i, i + MAX_CHARS_PER_PAGE)
    curatorAnswerPages.push(page)
  }
  // Display the first page initially
  CuratorAnswer = (curatorAnswerPages.length > 0 ? curatorAnswerPages[0] : '') + '\n' +
                  (currentPageIndex > 0 ? '<=====|' : '') +
                  (currentPageIndex < curatorAnswerPages.length - 1 ? '|=====>' : '');
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
        uiTransform={{ width: 40, height: 30, alignSelf: 'flex-start', margin: { bottom: 8 } }}
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

      {/* copy buffer */}
      <UiEntity
        uiTransform={{
          width: '100%',
          height: 49,
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
          placeholder="Click 'Copy' to get text..."
          placeholderColor={Color4.Gray()}
          onChange={(value) => {value = copyBuffer}}
          onSubmit={() => {}}
        />
      </UiEntity>

      {/* text input field */}
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

      {/* Buttons row: Copy, Previous Page, Next Page, and Send */}
      <UiEntity
        uiTransform={{
          width: '100%',
          height: 30,
          flexDirection: 'row',
          justifyContent: 'flex-end',
          margin: { bottom: 10 }
        }}
        uiBackground={{ color: Color4.Clear() }}
      >
        <Button
          uiTransform={{ width: 60, height: 30, margin: { right: 4 } }}
          value="Copy"
          variant="primary"
          fontSize={16}
          onMouseDown={() => copyAnswerToClipboard()}
          uiBackground={{
            color: Color4.create(0.5, 0.5, 0.5, 0.7),
            textureMode: 'nine-slices',
            texture: { src: 'white.png' },
            textureSlices: {
              top: 0.4,
              bottom: 0.4,
              left: 0.4,
              right: 0.4
            }
          }}
        />

        <Button
          uiTransform={{ width: 30, height: 30, margin: { right: 4 } }}
          value="<"
          variant="primary"
          fontSize={16}
          onMouseDown={() => showPreviousPage()}
          uiBackground={{
            color: Color4.create(0.2, 0.2, 0.8, 0.7),
            textureMode: 'nine-slices',
            texture: { src: 'white.png' },
            textureSlices: {
              top: 0.4,
              bottom: 0.4,
              left: 0.4,
              right: 0.4
            }
          }}
        />

        <Button
          uiTransform={{ width: 30, height: 30, margin: { right: 4 } }}
          value=">"
          variant="primary"
          fontSize={16}
          onMouseDown={() => showNextPage()}
          uiBackground={{
            color: Color4.create(0.2, 0.2, 0.8, 0.7),
            textureMode: 'nine-slices',
            texture: { src: 'white.png' },
            textureSlices: {
              top: 0.4,
              bottom: 0.4,
              left: 0.4,
              right: 0.4
            }
          }}
        />

        <Button
          uiTransform={{ width: 60, height: 30 }}
          value="Send"
          variant="primary"
          fontSize={16}
          onMouseDown={() => sendMessage(UserAsk)}
          uiBackground={{
            color: isConnected
              ? Color4.create(0.2, 0.2, 0.8, 0.7)
              : Color4.create(0.5, 0.5, 0.5, 0.7),
            textureMode: 'nine-slices',
            texture: { src: 'white.png' },
            textureSlices: {
              top: 0.4,
              bottom: 0.4,
              left: 0.4,
              right: 0.4
            }
          }}
        />
      </UiEntity>
    </UiEntity>
  </UiEntity>
);

function sendMessage(message: string) {
  // Clear the output field
  clearOutput()

  // Copy the message into the output field
  SetCuratorAnswer(message)

  // Send the message to the server if the socket is open
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(message)
  }
}

// Function to clear the output field
function clearOutput() {
  SetCuratorAnswer('')
  copyBuffer = ''
}

// Function to copy the entire answer (all pages) to the clipboard
function copyAnswerToClipboard() {
  const fullAnswer = curatorAnswerPages.join('');
  copyBuffer = fullAnswer
}

// Function to display the previous page of the answer
function showPreviousPage() {
  if (currentPageIndex > 0) {
    currentPageIndex--;
    CuratorAnswer = curatorAnswerPages[currentPageIndex] + '\n' +
                    (currentPageIndex > 0 ? '<=====|' : '') +
                    (currentPageIndex < curatorAnswerPages.length - 1 ? '|=====>' : '');
  }
}

// Function to display the next page of the answer
function showNextPage() {
  if (currentPageIndex < curatorAnswerPages.length - 1) {
    currentPageIndex++;
    CuratorAnswer = curatorAnswerPages[currentPageIndex] + '\n' +
                    (currentPageIndex > 0 ? '<=====|' : '') +
                    (currentPageIndex < curatorAnswerPages.length - 1 ? '|=====>' : '');
  }
}

// Insert sample long text on scene load for testing pagination functionality.
// This text is repeated enough times (~20) so that its length is around 2600 characters,
// which should yield approximately 6 pages (given MAX_CHARS_PER_PAGE = 500).
const sampleLongText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n".repeat(30);
SetCuratorAnswer(sampleLongText);
