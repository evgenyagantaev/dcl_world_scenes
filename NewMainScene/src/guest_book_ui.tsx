// guest-book.ts
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Input, Label, UiEntity } from '@dcl/sdk/react-ecs'

// Global UI state variables
let isGuestBookVisible = false
let guestBookContent = ''
let guestBookInput = ''

export function toggleGuestBookVisibility() {
  isGuestBookVisible = !isGuestBookVisible
  return isGuestBookVisible
}

export function getGuestBookVisibility() {
  return isGuestBookVisible
}

export function addGuestBookEntry(entry: string) {
  guestBookContent = entry + '\n' + guestBookContent
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
        margin: { top: '300px', left: '60px' },
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
          onMouseDown={() => guestBookContent = ''}
          uiBackground={{
            color: Color4.create(0.8, 0.2, 0.2, 0.1),
            textureMode: 'nine-slices',
            texture: { src: 'white.png' },
            textureSlices: { top: 0.4, bottom: 0.4, left: 0.4, right: 0.4 }
          }}
        />

        {/* Guest book content display with scroll */}
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
            value={guestBookContent}
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

        {/* Input field */}
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
            fontSize={16}
            color={Color4.White()}
            placeholder="Leave your message..."
            placeholderColor={Color4.Gray()}
            onChange={(value) => guestBookInput = value}
            onSubmit={() => {
              if (guestBookInput.trim()) {
                addGuestBookEntry(guestBookInput.trim())
                guestBookInput = ''
              }
            }}
          />
        </UiEntity>

        {/* Submit button */}
        <Button
          uiTransform={{ width: 80, height: 30 }}
          value="Submit"
          variant="primary"
          fontSize={16}
          onMouseDown={() => {
            if (guestBookInput.trim()) {
              addGuestBookEntry(guestBookInput.trim())
              guestBookInput = ''
            }
          }}
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
      </UiEntity>
    </UiEntity>
  )
}
