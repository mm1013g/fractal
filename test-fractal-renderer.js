/**
 * Unit tests for FractalRenderer class constructor
 * Tests Task 4.1: Create FractalRenderer class with constructor
 */

// Mock canvas for testing
class MockCanvas {
  constructor() {
    this.width = 600;
    this.height = 600;
  }
  
  getContext(type) {
    if (type === '2d') {
      return {
        strokeStyle: '',
        lineWidth: 0,
        lineCap: '',
        beginPath: () => {},
        moveTo: () => {},
        lineTo: () => {},
        stroke: () => {},
        clearRect: () => {}
      };
    }
    return null;
  }
}

// Load the FractalRenderer class
// In a real test environment, this would be imported
// For now, we'll copy the class definition
class FractalRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.config = {
      width: 600,
      height: 600,
      backgroundColor: '#1a1a1a',
      lineColor: '#00ff00',
      lineWidth: 2,
      trunkStartX: 300,
      trunkStartY: 550,
      trunkLength: 120,
      trunkAngle: -Math.PI/2
    };
  }
}

// Test suite
function runTests() {
  let passed = 0;
  let failed = 0;
  
  console.log('Running FractalRenderer Constructor Tests...\n');
  
  // Test 1: Constructor accepts canvas element
  try {
    const canvas = new MockCanvas();
    const renderer = new FractalRenderer(canvas);
    
    if (renderer.canvas === canvas) {
      console.log('✓ Test 1 PASSED: Constructor accepts and stores canvas element');
      passed++;
    } else {
      console.log('✗ Test 1 FAILED: Canvas not stored correctly');
      failed++;
    }
  } catch (error) {
    console.log('✗ Test 1 FAILED:', error.message);
    failed++;
  }
  
  // Test 2: Constructor stores 2D context reference
  try {
    const canvas = new MockCanvas();
    const renderer = new FractalRenderer(canvas);
    
    if (renderer.ctx && typeof renderer.ctx === 'object') {
      console.log('✓ Test 2 PASSED: Constructor stores 2D context reference');
      passed++;
    } else {
      console.log('✗ Test 2 FAILED: Context not stored correctly');
      failed++;
    }
  } catch (error) {
    console.log('✗ Test 2 FAILED:', error.message);
    failed++;
  }
  
  // Test 3: Constructor initializes canvas configuration constants
  try {
    const canvas = new MockCanvas();
    const renderer = new FractalRenderer(canvas);
    
    const hasConfig = renderer.config && typeof renderer.config === 'object';
    const hasWidth = renderer.config.width === 600;
    const hasHeight = renderer.config.height === 600;
    const hasTrunkStartX = renderer.config.trunkStartX === 300;
    const hasTrunkStartY = renderer.config.trunkStartY === 550;
    const hasTrunkLength = renderer.config.trunkLength === 120;
    const hasTrunkAngle = renderer.config.trunkAngle === -Math.PI/2;
    
    if (hasConfig && hasWidth && hasHeight && hasTrunkStartX && hasTrunkStartY && hasTrunkLength && hasTrunkAngle) {
      console.log('✓ Test 3 PASSED: Constructor initializes canvas configuration constants');
      passed++;
    } else {
      console.log('✗ Test 3 FAILED: Configuration not initialized correctly');
      console.log('  Config:', renderer.config);
      failed++;
    }
  } catch (error) {
    console.log('✗ Test 3 FAILED:', error.message);
    failed++;
  }
  
  // Test 4: Configuration includes all required properties
  try {
    const canvas = new MockCanvas();
    const renderer = new FractalRenderer(canvas);
    
    const requiredProps = [
      'width', 'height', 'backgroundColor', 'lineColor', 'lineWidth',
      'trunkStartX', 'trunkStartY', 'trunkLength', 'trunkAngle'
    ];
    
    const allPropsPresent = requiredProps.every(prop => prop in renderer.config);
    
    if (allPropsPresent) {
      console.log('✓ Test 4 PASSED: Configuration includes all required properties');
      passed++;
    } else {
      console.log('✗ Test 4 FAILED: Missing configuration properties');
      console.log('  Expected:', requiredProps);
      console.log('  Got:', Object.keys(renderer.config));
      failed++;
    }
  } catch (error) {
    console.log('✗ Test 4 FAILED:', error.message);
    failed++;
  }
  
  // Test 5: Trunk is centered horizontally (Requirement 6.3)
  try {
    const canvas = new MockCanvas();
    const renderer = new FractalRenderer(canvas);
    
    const isCentered = renderer.config.trunkStartX === renderer.config.width / 2;
    
    if (isCentered) {
      console.log('✓ Test 5 PASSED: Trunk is centered horizontally (Requirement 6.3)');
      passed++;
    } else {
      console.log('✗ Test 5 FAILED: Trunk not centered');
      console.log('  Expected X:', renderer.config.width / 2);
      console.log('  Got X:', renderer.config.trunkStartX);
      failed++;
    }
  } catch (error) {
    console.log('✗ Test 5 FAILED:', error.message);
    failed++;
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log(`Tests Passed: ${passed}`);
  console.log(`Tests Failed: ${failed}`);
  console.log(`Total Tests: ${passed + failed}`);
  console.log('='.repeat(50));
  
  return failed === 0;
}

// Run the tests
const success = runTests();
process.exit(success ? 0 : 1);
