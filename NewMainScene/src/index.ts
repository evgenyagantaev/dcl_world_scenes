// Declare global Camera for TypeScript.
declare const Camera: { instance: { position: Vector3 } };

import { CuratorChatUiEntity } from './curator_chat_ui'
import { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import { SocketService } from './network/socketService'
import { createNPC, toggleDialogVisibility } from './npcController'
import { GuestBookUiEntity, toggleGuestBookVisibility, setGuestBookService } from './guest_book_ui'
import { engine, Transform, Material, TextShape, Billboard, MeshRenderer, MeshCollider, InputAction, PointerEventType, PointerEvents, inputSystem } from '@dcl/sdk/ecs'
import { Cube } from './components'
import { Color4, Vector3, Quaternion } from '@dcl/sdk/math'
import { getRandomHexColor } from './utils';
import { GuestBookSocketService } from './network/guestBookSocketService'

export function main() {
  console.log('main starting...\n')

  // Set the UI renderers during initialization.
  const curatorUI = CuratorChatUiEntity()
  const guestBookUI = GuestBookUiEntity()
  ReactEcsRenderer.setUiRenderer(() => {
    const curatorElement = curatorUI()
    const guestBookElement = guestBookUI()
    return curatorElement || guestBookElement
  })

  // Initialize the WebSocket services.
  new SocketService('wss://78.153.149.194:37137');
  
  // Initialize the GuestBook WebSocket service
  const guestBookSocketService = new GuestBookSocketService('wss://78.153.149.194:37135');
  //const guestBookSocketService = new GuestBookSocketService('wss://localhost:37135');
  setGuestBookService(guestBookSocketService);

  // Setup NPC and its follow behavior.
  const npcEntity = createNPC()
  
  // Note: The click handler for the NPC is now handled inside the createNPC function

  //************************************* */
  const guestBook = engine.addEntity()
  Cube.create(guestBook)
  Transform.create(guestBook, {
    position: Vector3.create(1, 1.0, 4),
    rotation: Quaternion.fromEulerDegrees(45, -20, 0),
    scale: Vector3.create(1, 1, 0.1)
  })
  MeshRenderer.setBox(guestBook)
  MeshCollider.setBox(guestBook)
  Material.setPbrMaterial(guestBook, {
    albedoColor: Color4.create(0.96, 0.96, 0.86, 1)
  })

  // Create text
  const guestBookText = engine.addEntity()
  Transform.create(guestBookText, {
    parent: guestBook,
    position: Vector3.create(0, 0, -0.7)
  })
  TextShape.create(guestBookText, {
    text: 'Guest Book',
    fontSize: 1.3,
    textColor: Color4.create(0, 0, 0, 1)
  })

  PointerEvents.create(guestBook, {
    pointerEvents: [
      { eventType: PointerEventType.PET_DOWN, eventInfo: { button: InputAction.IA_POINTER, hoverText: 'Open Guest Book' } }
    ]
  })

  // Add system to handle guest book clicks
  engine.addSystem(() => {
    if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN, guestBook)) {
      toggleGuestBookVisibility()
    }
  })

  //************************************* */
  const constructionBoard = engine.addEntity()
  Cube.create(constructionBoard)
  Transform.create(constructionBoard, {
    position: Vector3.create(10, 2.5, 27),
    rotation: Quaternion.fromEulerDegrees(0, 0, 0),
    scale: Vector3.create(3, 3, 0.3)
  })
  MeshRenderer.setBox(constructionBoard)
  MeshCollider.setBox(constructionBoard)
  Material.setPbrMaterial(constructionBoard, {
    albedoColor: Color4.create(0.0, 0.0, 1.0, 1)
  })

  // Создание текста
  const constructionBoardText = engine.addEntity()
  Transform.create(constructionBoardText, {
    parent: constructionBoard,
    position: Vector3.create(0, 0, -0.65)
  })
  TextShape.create(constructionBoardText, {
    text: 'This World is' + '\n' + 'under Construction',
    fontSize: 1.0,
    textColor: Color4.create(1.0, 0.0, 0.0, 1)
  })
  //Billboard.create(constructionBoardText)
  //*************************************
  
  //*************************************
  // Create calendar display 3D object to show current month info
  function getNewCalendarDate(date: Date): {month: number, day: number, year: number, monthName: string, dayOfWeek: string} {
    const currentYear = date.getFullYear();
    const startYear = new Date(currentYear, 0, 1);
    const daysDiff = Math.floor((date.getTime() - startYear.getTime()) / (1000 * 60 * 60 * 24));
    const daysInYear = 365;
    const year = currentYear + Math.floor(daysDiff / daysInYear);
    const daysIntoYear = daysDiff % daysInYear;
    const isLeapYear = currentYear % 4 === 0;
    const monthsArr = [
      { name: 'Newton', days: 24 },
      { name: 'Einstein', days: 24 },
      { name: 'Darwin', days: 25 },
      { name: 'Curie', days: 24 },
      { name: 'Galileo', days: 24 },
      { name: 'Pasteur', days: 25 },
      { name: 'Mendeleev', days: 24 },
      { name: 'Maxwell', days: 24 },
      { name: 'Bohr', days: 25 },
      { name: 'Copernicus', days: 24 },
      { name: 'Lavoisier', days: 24 },
      { name: 'Turing', days: 25 },
      { name: 'Hippocrates', days: 24 },
      { name: 'Archimedes', days: 24 },
      { name: 'Leonardo da Vinci', days: isLeapYear ? 26 : 25 }
    ];
    let remainingDays = daysIntoYear;
    let monthIndex = 0;
    let dayOfMonth = 0;
    for (let i = 0; i < monthsArr.length; i++) {
      if (remainingDays < monthsArr[i].days) {
        monthIndex = i;
        dayOfMonth = remainingDays + 1;
        break;
      }
      remainingDays -= monthsArr[i].days;
    }
    const currentMonth = monthsArr[monthIndex];
    const weekdaysArr = ['stone', 'wheel', 'book', 'engine', 'penicillin', 'electricity', 'computer', 'artificial intelligence'];
    let dayOfWeekIndex = 0;
    if (currentMonth.days === 24) {
      // For months with 24 days: weeks of 6 days.
      dayOfWeekIndex = (dayOfMonth - 1) % 6;
    } else if (currentMonth.days === 25) {
      // For months with 25 days: first 18 days are full weeks, then last week resets.
      dayOfWeekIndex = dayOfMonth <= 18 ? (dayOfMonth - 1) % 6 : (dayOfMonth - 19);
    } else { // currentMonth.days === 26 (Leonardo da Vinci in leap year)
      dayOfWeekIndex = dayOfMonth <= 18 ? (dayOfMonth - 1) % 6 : (dayOfMonth - 19);
    }
    const dayOfWeek = weekdaysArr[dayOfWeekIndex];
    return { month: monthIndex, day: dayOfMonth, year: year, monthName: currentMonth.name, dayOfWeek };
  }

  const calendarDisplay = engine.addEntity();
  Cube.create(calendarDisplay);
  Transform.create(calendarDisplay, {
    position: Vector3.create(2, 2, 10),
    rotation: Quaternion.fromEulerDegrees(0, -20, 0),
    scale: Vector3.create(3, 3, 0.1)
  });
  MeshRenderer.setBox(calendarDisplay);
  MeshCollider.setBox(calendarDisplay);
  Material.setPbrMaterial(calendarDisplay, {
    albedoColor: Color4.create(0.8, 0.8, 0.8, 1)
  });

  const calendarDisplayText = engine.addEntity();
  Transform.create(calendarDisplayText, {
    parent: calendarDisplay,
    position: Vector3.create(0, 0, -0.7)
  });
  TextShape.create(calendarDisplayText, {
    text: 'Loading...',
    fontSize: 1.1,
    textColor: Color4.create(0, 0, 0, 1)
  });

  engine.addSystem(() => {
    const now = new Date();
    const dateInfo = getNewCalendarDate(now);
    const newText = `Year: ${dateInfo.year}\nMonth: ${dateInfo.monthName}\nDay: ${dateInfo.day}\nWeekday: ${dateInfo.dayOfWeek}`;
    // Update the text dynamically; assuming TextShape.getMutable is available in the SDK
    const textComponent = TextShape.getMutable(calendarDisplayText);
    if (textComponent.text !== newText) {
      textComponent.text = newText;
    }
  });

}
