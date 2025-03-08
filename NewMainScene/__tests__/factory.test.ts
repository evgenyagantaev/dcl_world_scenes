import { createCube } from '../src/factory';
import { engine, Transform, MeshRenderer, MeshCollider, Material, PointerEvents, PointerEventType, InputAction } from '@dcl/sdk/ecs';
import { Cube, Spinner } from '../src/components';
import { Color4 } from '@dcl/sdk/math';
import { getRandomHexColor } from '../src/utils';

// Mock the @dcl/sdk/ecs module
jest.mock('@dcl/sdk/ecs', () => ({
  engine: {
    addEntity: jest.fn().mockReturnValue('mock-entity-id')
  },
  Transform: {
    create: jest.fn()
  },
  MeshRenderer: {
    setBox: jest.fn()
  },
  MeshCollider: {
    setBox: jest.fn()
  },
  Material: {
    setPbrMaterial: jest.fn()
  },
  PointerEvents: {
    create: jest.fn()
  },
  PointerEventType: {
    PET_DOWN: 'pet-down'
  },
  InputAction: {
    IA_POINTER: 'ia-pointer'
  }
}));

// Mock the components
jest.mock('../src/components', () => ({
  Cube: {
    create: jest.fn()
  },
  Spinner: {
    create: jest.fn()
  }
}));

// Mock the @dcl/sdk/math module
jest.mock('@dcl/sdk/math', () => ({
  Color4: {
    fromHexString: jest.fn().mockReturnValue('mock-color')
  }
}));

// Mock the utils module
jest.mock('../src/utils', () => ({
  getRandomHexColor: jest.fn().mockReturnValue('#FFFFFF')
}));

describe('Factory', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });
  
  describe('createCube', () => {
    it('should create a cube entity with the correct components', () => {
      const x = 1;
      const y = 2;
      const z = 3;
      
      const entity = createCube(x, y, z);
      
      // Should add an entity to the engine
      expect(engine.addEntity).toHaveBeenCalled();
      
      // Should create a Cube component
      expect(Cube.create).toHaveBeenCalledWith(entity);
      
      // Should create a Transform component with the correct position
      expect(Transform.create).toHaveBeenCalledWith(entity, { position: { x, y, z } });
      
      // Should set up the mesh renderer and collider
      expect(MeshRenderer.setBox).toHaveBeenCalledWith(entity);
      expect(MeshCollider.setBox).toHaveBeenCalledWith(entity);
      
      // Should set up the material with a random color
      expect(getRandomHexColor).toHaveBeenCalled();
      expect(Color4.fromHexString).toHaveBeenCalledWith('#FFFFFF');
      expect(Material.setPbrMaterial).toHaveBeenCalledWith(entity, { albedoColor: 'mock-color' });
      
      // Should create a Spinner component with a random speed
      expect(Spinner.create).toHaveBeenCalledWith(entity, expect.objectContaining({
        speed: expect.any(Number)
      }));
      
      // Should create PointerEvents
      expect(PointerEvents.create).toHaveBeenCalledWith(entity, {
        pointerEvents: [
          { 
            eventType: PointerEventType.PET_DOWN, 
            eventInfo: { 
              button: InputAction.IA_POINTER, 
              hoverText: 'Change Color' 
            } 
          }
        ]
      });
      
      // Should return the entity
      expect(entity).toBe('mock-entity-id');
    });
  });
}); 