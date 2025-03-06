// guest-book.ts
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Input, Label, UiEntity } from '@dcl/sdk/react-ecs'
import { GuestBookEntry } from './network/guestBookSocketService'

// Global UI state variables
let isGuestBookVisible = false
let isGuestBookConnected = false
let guestBookEntries: GuestBookEntry[] = []
let userName = 'Anonymous'
let userInput = ''
let guestBookService: any = null

// Function to set the WebSocket service instance
export function setGuestBookService(service: any) {
  guestBookService = service
}

// Function to update connection state
export function updateGuestBookConnectionState(connected: boolean) {
  isGuestBookConnected = connected
}

// Function to update entries from the server
export function setGuestBookEntries(entries: GuestBookEntry[]) {
  guestBookEntries = entries
}

export function toggleGuestBookVisibility() {
  isGuestBookVisible = !isGuestBookVisible
  
  // If becoming visible and connected, refresh entries
  if (isGuestBookVisible && isGuestBookConnected && guestBookService) {
    guestBookService.getEntries()
  }
  
  return isGuestBookVisible
}

export function getGuestBookVisibility() {
  return isGuestBookVisible
}

// Function to format entries for display
function formatEntries() {
  if (guestBookEntries.length === 0) {
    return "No entries yet. Be the first to sign!"
  }
  
  return guestBookEntries.map(entry => {
    const date = new Date(entry.timestamp)
    const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
    return `[${formattedDate}] ${entry.name}: ${entry.message}`
  }).join('\n\n')
}

// Function to add an entry via WebSocket
export function addGuestBookEntry(message: string) {
  if (guestBookService && message.trim()) {
    guestBookService.addEntry(userName, message.trim())
  }
}

export function GuestBookUiEntity() {
  return GuestBook
}

const GuestBook = () => {
  if (!isGuestBookVisible) {
    return null
  }

  return (
    <UiEntity
      uiTransform={{
        width: 500,
        height: 600,
        margin: { top: '270px', left: '60px' },
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
        {/* Connection status indicator */}
        <UiEntity
          uiTransform={{ 
            width: '100%', 
            height: 30,
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: { bottom: 8 }
          }}
        >
          <Label
            value={isGuestBookConnected ? "✓ Connected" : "✗ Disconnected"}
            fontSize={14}
            color={isGuestBookConnected ? Color4.Green() : Color4.Red()}
            uiTransform={{
              width: 120,
              height: 30,
              alignSelf: 'flex-start'
            }}
          />
          <Button
            uiTransform={{ width: 80, height: 30, alignSelf: 'flex-end' }}
            value="✕ Close"
            variant="primary"
            fontSize={14}
            onMouseDown={() => toggleGuestBookVisibility()}
            uiBackground={{
              color: Color4.create(0.8, 0.2, 0.2, 0.7),
              textureMode: 'nine-slices',
              texture: { src: 'white.png' },
              textureSlices: { top: 0.4, bottom: 0.4, left: 0.4, right: 0.4 }
            }}
          />
        </UiEntity>

        {/* Guest book title */}
        <Label
          value="Guest Book"
          fontSize={24}
          color={Color4.White()}
          uiTransform={{
            width: '100%',
            height: 40,
            margin: { bottom: 10 }
          }}
          textAlign="middle-center"
        />

        {/* Name input field */}
        <UiEntity
          uiTransform={{
            width: '100%',
            height: 50,
            margin: { bottom: 10 },
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <Label
            value="Your Name:"
            fontSize={16}
            color={Color4.White()}
            uiTransform={{
              width: 100,
              height: '100%'
            }}
            textAlign="middle-left"
          />
          <UiEntity
            uiTransform={{
              width: 400,
              height: 43
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
              fontSize={16}
              color={Color4.White()}
              placeholder="Anonymous"
              placeholderColor={Color4.Gray()}
              onChange={(value) => userName = value || 'Anonymous'}
            />
          </UiEntity>
        </UiEntity>

        {/* Guest book content display with scroll */}
        <UiEntity
          uiTransform={{
            width: '100%',
            height: '100%',
            margin: { bottom: 10 },
            overflow: 'scroll'
          }}
          uiBackground={{
            color: Color4.create(0.1, 0.1, 0.1, 0.5),
            textureMode: 'nine-slices',
            texture: { src: 'white.png' },
            textureSlices: { top: 0.1, bottom: 0.1, left: 0.1, right: 0.1 }
          }}
        >
          <Label
            value={formatEntries()}
            fontSize={16}
            color={Color4.White()}
            uiTransform={{
              width: '100%',
              height: '100%',
              margin: { left: 8, right: 8, top: 8, bottom: 8 }
            }}
            textAlign="top-left"
          />
        </UiEntity>

        {/* Message input field */}
        <UiEntity
          uiTransform={{
            width: '100%',
            height: 64,
            margin: { bottom: 8 },
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
            fontSize={16}
            color={Color4.White()}
            placeholder="Leave your message..."
            placeholderColor={Color4.Gray()}
            onChange={(value) => userInput = value}
            onSubmit={() => {
              if (userInput.trim()) {
                addGuestBookEntry(userInput.trim())
                userInput = ''
              }
            }}
          />
        </UiEntity>

        {/* Submit and refresh buttons */}
        <UiEntity
          uiTransform={{ 
            width: '100%', 
            height: 30,
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}
        >
          <Button
            uiTransform={{ width: 80, height: 30 }}
            value="Refresh"
            variant="primary"
            fontSize={16}
            onMouseDown={() => {
              if (guestBookService && isGuestBookConnected) {
                guestBookService.getEntries()
              }
            }}
            uiBackground={{
              color: Color4.create(0.2, 0.6, 0.8, 0.7),
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
            uiTransform={{ width: 80, height: 30 }}
            value="Submit"
            variant="primary"
            fontSize={16}
            onMouseDown={() => {
              if (userInput.trim()) {
                addGuestBookEntry(userInput.trim())
                userInput = ''
              }
            }}
            uiBackground={{
              color: Color4.create(0.2, 0.6, 0.2, 0.7),
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
  )
}
