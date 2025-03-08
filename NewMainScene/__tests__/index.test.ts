import { main } from '../src/index';
import { ReactEcsRenderer } from '@dcl/sdk/react-ecs';
import { SocketService } from '../src/network/socketService';
import { GuestBookSocketService } from '../src/network/guestBookSocketService';
import { createNPC } from '../src/npcController';
import { engine, Transform, Material, TextShape, Billboard, MeshRenderer, MeshCollider, InputAction, PointerEventType, PointerEvents, inputSystem } from '@dcl/sdk/ecs';
import { Color4, Vector3, Quaternion } from '@dcl/sdk/math';
import { Cube } from '../src/components';
import { setGuestBookService } from '../src/guest_book_ui';

// Mock all the imported modules
jest.mock('@dcl/sdk/react-ecs', () => ({
  ReactEcsRenderer: {
    setUiRenderer: jest.fn()
  }
}));

jest.mock('../src/network/socketService', () => ({
  SocketService: jest.fn()
}));

jest.mock('../src/network/guestBookSocketService', () => ({
  GuestBookSocketService: jest.fn()
}));

jest.mock('../src/npcController', () => ({
  createNPC: jest.fn().mockReturnValue('mock-npc-entity'),
  toggleDialogVisibility: jest.fn()
}));

jest.mock('../src/guest_book_ui', () => ({
  GuestBookUiEntity: jest.fn().mockReturnValue(() => 'mock-guest-book-ui'),
  toggleGuestBookVisibility: jest.fn(),
  setGuestBookService: jest.fn()
}));

jest.mock('../src/curator_chat_ui', () => ({
  CuratorChatUiEntity: jest.fn().mockReturnValue(() => 'mock-curator-chat-ui')
}));

jest.mock('../src/components', () => ({
  Cube: {
    create: jest.fn()
  }
}));

jest.mock('@dcl/sdk/ecs', () => ({
  engine: {
    addEntity: jest.fn().mockReturnValue('mock-entity-id'),
    addSystem: jest.fn(),
    PlayerEntity: 'mock-player-entity'
  },
  Transform: {
    create: jest.fn()
  },
  Material: {
    setPbrMaterial: jest.fn()
  },
  TextShape: {
    create: jest.fn()
  },
  Billboard: {
    create: jest.fn()
  },
  MeshRenderer: {
    setBox: jest.fn()
  },
  MeshCollider: {
    setBox: jest.fn()
  },
  PointerEvents: {
    create: jest.fn()
  },
  PointerEventType: {
    PET_DOWN: 'pet-down'
  },
  InputAction: {
    IA_POINTER: 'ia-pointer'
  },
  inputSystem: {
    isTriggered: jest.fn()
  }
}));

jest.mock('@dcl/sdk/math', () => ({
  Color4: {
    create: jest.fn().mockReturnValue('mock-color')
  },
  Vector3: {
    create: jest.fn().mockReturnValue('mock-vector')
  },
  Quaternion: {
    fromEulerDegrees: jest.fn().mockReturnValue('mock-quaternion')
  }
}));

describe('Main Entry Point', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Mock console.log to avoid cluttering test output
    console.log = jest.fn();
  });
  
  describe('main function', () => {
    it('should initialize the UI renderers', () => {
      main();
      
      // Should set up the UI renderer
      expect(ReactEcsRenderer.setUiRenderer).toHaveBeenCalled();
    });
    
    it('should initialize the WebSocket services', () => {
      main();
      
      // Should create the socket services
      expect(SocketService).toHaveBeenCalledWith('wss://78.153.149.194:37137');
      expect(GuestBookSocketService).toHaveBeenCalledWith('wss://78.153.149.194:37135');
      
      // Should set the guest book service
      expect(setGuestBookService).toHaveBeenCalled();
    });
    
    it('should create an NPC', () => {
      main();
      
      // Should create an NPC
      expect(createNPC).toHaveBeenCalled();
    });
    
    it('should create entities and set up components', () => {
      main();
      
      // Should add entities
      expect(engine.addEntity).toHaveBeenCalled();
      
      // Should create cubes
      expect(Cube.create).toHaveBeenCalled();
      
      // Should set up transforms
      expect(Transform.create).toHaveBeenCalled();
      
      // Should set up mesh renderers and colliders
      expect(MeshRenderer.setBox).toHaveBeenCalled();
      expect(MeshCollider.setBox).toHaveBeenCalled();
      
      // Should set up materials
      expect(Material.setPbrMaterial).toHaveBeenCalled();
      
      // Should create text shapes
      expect(TextShape.create).toHaveBeenCalled();
      
      // Should set up pointer events
      expect(PointerEvents.create).toHaveBeenCalled();
      
      // Should add systems
      expect(engine.addSystem).toHaveBeenCalled();
    });
  });
}); 