import { Spinner, Cube } from '../src/components';
import { engine, Schemas } from '@dcl/sdk/ecs';

// Mock the @dcl/sdk/ecs module
jest.mock('@dcl/sdk/ecs', () => {
  const mockDefineComponent = jest.fn().mockImplementation((name, schema) => {
    return { componentId: name, schema };
  });
  
  return {
    Schemas: {
      Number: 'number-schema'
    },
    engine: {
      defineComponent: mockDefineComponent
    }
  };
});

describe('Components', () => {
  describe('Spinner', () => {
    it('should define a spinner component with the correct name and schema', () => {
      // Spinner should be defined
      expect(Spinner).toBeDefined();
      
      // Spinner should have the correct component ID
      expect(Spinner.componentId).toBe('spinner');
      
      // Spinner should have a speed property with the Number schema
      expect(Spinner.schema).toEqual({ speed: Schemas.Number });
    });
  });
  
  describe('Cube', () => {
    it('should define a cube component with the correct name and empty schema', () => {
      // Cube should be defined
      expect(Cube).toBeDefined();
      
      // Cube should have the correct component ID
      expect(Cube.componentId).toBe('cube-id');
      
      // Cube should have an empty schema
      expect(Cube.schema).toEqual({});
    });
  });
}); 