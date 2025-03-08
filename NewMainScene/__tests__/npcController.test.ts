import { toggleDialogVisibility, getDialogVisibility, createNPC } from '../src/npcController';
import { AvatarShape, engine, Transform, PointerEvents, MeshCollider, MeshRenderer, Material } from '@dcl/sdk/ecs';
import { Vector3, Quaternion, Color4 } from '@dcl/sdk/math';

// Mock the @dcl/sdk/ecs module
jest.mock('@dcl/sdk/ecs', () => ({
  AvatarShape: {
    create: jest.fn()
  },
  Transform: {
    create: jest.fn(),
    getMutable: jest.fn().mockReturnValue({
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0, w: 1 }
    })
  },
  PointerEvents: {
    create: jest.fn()
  },
  MeshCollider: {
    setBox: jest.fn()
  },
  MeshRenderer: {
    setBox: jest.fn()
  },
  Material: {
    setPbrMaterial: jest.fn()
  },
  engine: {
    addEntity: jest.fn().mockReturnValue('mock-entity-id'),
    addSystem: jest.fn(),
    PlayerEntity: 'mock-player-entity'
  },
  inputSystem: {
    isTriggered: jest.fn()
  }
}));

// Mock the @dcl/sdk/math module
jest.mock('@dcl/sdk/math', () => ({
  Vector3: {
    create: jest.fn().mockReturnValue({ x: 0, y: 0, z: 0 }),
    subtract: jest.fn().mockReturnValue({ x: 0, y: 0, z: 0 }),
    length: jest.fn().mockReturnValue(5),
    normalize: jest.fn().mockReturnValue({ x: 0, y: 0, z: 1 }),
    scale: jest.fn().mockReturnValue({ x: 0, y: 0, z: 0 }),
    add: jest.fn().mockReturnValue({ x: 0, y: 0, z: 0 })
  },
  Quaternion: {
    fromAngleAxis: jest.fn().mockReturnValue({ x: 0, y: 0, z: 0, w: 1 }),
    lookRotation: jest.fn().mockReturnValue({ x: 0, y: 0, z: 0, w: 1 })
  },
  Color4: {
    create: jest.fn().mockReturnValue({ r: 0, g: 0, b: 0, a: 0 })
  }
}));

describe('NPC Controller', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });
  
  describe('toggleDialogVisibility', () => {
    it('should toggle dialog visibility state', () => {
      // Initial state should be false
      expect(getDialogVisibility()).toBe(false);
      
      // First toggle should make it true
      expect(toggleDialogVisibility()).toBe(true);
      expect(getDialogVisibility()).toBe(true);
      
      // Second toggle should make it false again
      expect(toggleDialogVisibility()).toBe(false);
      expect(getDialogVisibility()).toBe(false);
    });
  });
  
  describe('getDialogVisibility', () => {
    it('should return the current dialog visibility state', () => {
      // Initial state should be false
      expect(getDialogVisibility()).toBe(false);
      
      // After toggling, it should be true
      toggleDialogVisibility();
      expect(getDialogVisibility()).toBe(true);
    });
  });
  
  describe('createNPC', () => {
    it('should create an NPC entity with avatar shape', () => {
      const npcEntity = createNPC();
      
      // Should create an entity
      expect(engine.addEntity).toHaveBeenCalled();
      
      // Should create an avatar shape for the NPC
      expect(AvatarShape.create).toHaveBeenCalledWith(npcEntity, expect.objectContaining({
        name: 'Curator',
        bodyShape: expect.any(String),
        wearables: expect.any(Array)
      }));
      
      // Should set up the transform for the NPC
      expect(Transform.create).toHaveBeenCalledWith(npcEntity, expect.objectContaining({
        position: expect.any(Object),
        rotation: expect.any(Object)
      }));
    });
    
    it('should create a collision entity for the NPC', () => {
      const npcEntity = createNPC();
      
      // Should create a second entity for collision
      expect(engine.addEntity).toHaveBeenCalledTimes(2);
      
      // The second call should be for the collision entity
      const collisionEntity = (engine.addEntity as jest.Mock).mock.results[1].value;
      
      // Should set up the transform for the collision entity
      expect(Transform.create).toHaveBeenCalledWith(collisionEntity, expect.objectContaining({
        parent: npcEntity,
        position: expect.any(Object),
        scale: expect.any(Object)
      }));
      
      // Should add a mesh renderer with transparent material
      expect(MeshRenderer.setBox).toHaveBeenCalledWith(collisionEntity);
      expect(Material.setPbrMaterial).toHaveBeenCalledWith(collisionEntity, expect.objectContaining({
        albedoColor: expect.any(Object)
      }));
      
      // Should add a collider
      expect(MeshCollider.setBox).toHaveBeenCalledWith(collisionEntity);
      
      // Should add pointer events
      expect(PointerEvents.create).toHaveBeenCalledWith(collisionEntity, expect.objectContaining({
        pointerEvents: expect.any(Array)
      }));
    });
    
    it('should add systems for NPC behavior', () => {
      createNPC();
      
      // Should add systems for click handling and follow behavior
      expect(engine.addSystem).toHaveBeenCalledTimes(2);
    });
    
    it('should return the created NPC entity', () => {
      const npcEntity = createNPC();
      
      // Should return the entity ID from engine.addEntity
      expect(npcEntity).toBe('mock-entity-id');
    });
  });
}); 