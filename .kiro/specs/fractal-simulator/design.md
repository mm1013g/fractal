# Design Document: Fractal Simulator

## Overview

The fractal simulator is a client-side web application that renders an interactive line-based fractal using HTML5 Canvas and vanilla JavaScript. The system consists of three main components: a canvas renderer that draws the fractal, a control panel with three sliders for parameter adjustment, and a recursive fractal generation algorithm.

The architecture follows a simple event-driven model where slider changes trigger immediate re-rendering of the fractal. All computation and rendering happens in the browser with no server dependencies.

The fractal uses a recursive branching algorithm where each branch spawns two child branches at specified angles, with each child branch scaled by a ratio factor. The recursion depth is controlled by the iterations parameter.

## Architecture

### System Components

```
┌─────────────────────────────────────────────────┐
│              Web Browser                        │
│                                                 │
│  ┌──────────────┐         ┌─────────────────┐  │
│  │ Control Panel│────────▶│ Fractal Renderer│  │
│  │  - Iterations│  events │  - Algorithm    │  │
│  │  - Ratio     │         │  - Canvas Draw  │  │
│  │  - Angle     │         └────────┬────────┘  │
│  └──────────────┘                  │           │
│                                    ▼           │
│                          ┌──────────────────┐  │
│                          │  HTML5 Canvas    │  │
│                          │  (600x600px)     │  │
│                          └──────────────────┘  │
└─────────────────────────────────────────────────┘
```

### Technology Stack

- HTML5 for structure and Canvas element
- CSS for basic styling
- Vanilla JavaScript (ES6+) for logic and rendering
- No external libraries or frameworks required

### Data Flow

1. User adjusts slider → Input event fired
2. Event handler reads new parameter value
3. Parameter state updated in memory
4. Render function called with new parameters
5. Canvas cleared
6. Recursive algorithm generates branch coordinates
7. Lines drawn to canvas

## Components and Interfaces

### 1. Control Panel Component

Manages the three slider inputs and displays current values.

**State:**
- `iterations`: integer (1-12)
- `ratio`: float (0.3-0.9)
- `angle`: float (0-90)

**Interface:**
```javascript
// HTML structure
<div id="controls">
  <label>Iterations: <span id="iterations-value">8</span></label>
  <input type="range" id="iterations" min="1" max="12" value="8">
  
  <label>Ratio: <span id="ratio-value">0.67</span></label>
  <input type="range" id="ratio" min="0.3" max="0.9" step="0.01" value="0.67">
  
  <label>Angle: <span id="angle-value">25</span></label>
  <input type="range" id="angle" min="0" max="90" value="25">
</div>
```

**Events:**
- `input` event on each slider triggers parameter update and re-render

### 2. Fractal Renderer Component

Responsible for computing branch positions and drawing to canvas.

**Interface:**
```javascript
class FractalRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }
  
  // Main render function
  render(iterations, ratio, angle) {
    // Clear canvas
    // Set up initial trunk parameters
    // Call recursive branch function
  }
  
  // Recursive branching algorithm
  drawBranch(x, y, length, angle, depth, maxDepth, ratio, branchAngle) {
    // Base case: depth >= maxDepth
    // Draw current branch line
    // Calculate child branch parameters
    // Recursively draw left and right children
  }
}
```

**Parameters:**
- `x, y`: Starting coordinates of branch
- `length`: Length of current branch
- `angle`: Current direction angle (radians)
- `depth`: Current recursion depth
- `maxDepth`: Maximum iterations
- `ratio`: Length scaling factor
- `branchAngle`: Branching angle offset

### 3. Fractal Algorithm

The core recursive algorithm follows this pattern:

**Pseudocode:**
```
function drawBranch(x, y, length, angle, depth, maxDepth, ratio, branchAngle):
  if depth >= maxDepth:
    return
  
  // Calculate end point of current branch
  endX = x + length * cos(angle)
  endY = y + length * sin(angle)
  
  // Draw line from (x, y) to (endX, endY)
  drawLine(x, y, endX, endY)
  
  // Calculate child branch length
  childLength = length * ratio
  
  // Draw left branch (angle + branchAngle)
  drawBranch(endX, endY, childLength, angle + branchAngle, depth + 1, ...)
  
  // Draw right branch (angle - branchAngle)
  drawBranch(endX, endY, childLength, angle - branchAngle, depth + 1, ...)
```

**Key Design Decisions:**

1. **Coordinate System**: Canvas uses top-left origin, so initial trunk grows upward (negative Y direction)

2. **Angle Convention**: 
   - 0° points right
   - 90° points up (negative Y)
   - Angles stored in degrees, converted to radians for Math functions

3. **Branch Scaling**: Each child branch is `ratio * parent_length`

4. **Branching Pattern**: Each branch spawns exactly two children at `±branchAngle` from parent direction

5. **Line Width**: Fixed at 2 pixels for visibility across all branch levels

## Data Models

### Parameter State

```javascript
const state = {
  iterations: 8,      // integer: 1-12
  ratio: 0.67,        // float: 0.3-0.9
  angle: 25           // float: 0-90 (degrees)
};
```

### Branch Representation

Branches are not stored as data structures; they are computed and drawn immediately during recursion. Each branch is defined by:

```javascript
{
  startX: number,     // Starting X coordinate
  startY: number,     // Starting Y coordinate
  endX: number,       // Ending X coordinate
  endY: number,       // Ending Y coordinate
  angle: number,      // Direction in radians
  length: number,     // Branch length in pixels
  depth: number       // Current recursion level
}
```

### Canvas Configuration

```javascript
const canvasConfig = {
  width: 600,
  height: 600,
  backgroundColor: '#1a1a1a',
  lineColor: '#00ff00',
  lineWidth: 2,
  trunkStartX: 300,      // Center X
  trunkStartY: 550,      // Near bottom
  trunkLength: 120,      // Initial trunk length
  trunkAngle: -Math.PI/2 // Point upward
};
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Fractal Rendering Produces Output

*For any* valid parameter combination (iterations, ratio, angle), rendering the fractal should result in a non-empty canvas with visible line content.

**Validates: Requirements 1.1**

### Property 2: Branch Count Grows Exponentially with Iterations

*For any* valid parameters, the number of branches in the fractal should equal 2^iterations - 1 (binary tree structure where each branch spawns two children).

**Validates: Requirements 2.3, 2.5**

### Property 3: Child Branch Length Scaling

*For any* branch at depth d with length L and ratio r, its child branches at depth d+1 should have length L × r (within floating-point precision tolerance).

**Validates: Requirements 3.3, 3.5**

### Property 4: Symmetric Branch Divergence

*For any* parent branch at angle θ with branching angle α, its two child branches should be at angles θ + α and θ - α respectively.

**Validates: Requirements 4.3, 4.5**

### Property 5: Parameter Fidelity

*For any* set of parameters (iterations, ratio, angle), the rendered fractal should reflect those exact parameter values in its structure (branch count matches iterations, length ratios match ratio parameter, angles match angle parameter).

**Validates: Requirements 5.5**

### Property 6: Canvas Clearing Between Renders

*For any* sequence of renders with different parameters, each render should start with a cleared canvas so that previous fractal patterns do not persist.

**Validates: Requirements 5.1**

### Property 7: Bounds Containment

*For any* parameter values within the valid ranges (iterations 1-12, ratio 0.3-0.9, angle 0-90), all branch endpoints should remain within the canvas boundaries (0 ≤ x ≤ 600, 0 ≤ y ≤ 600) when using the default trunk configuration.

**Validates: Requirements 6.5**

## Error Handling

### Invalid Parameter Values

**Strategy**: Validate slider inputs at the HTML level using min/max attributes. JavaScript should clamp any programmatic parameter changes to valid ranges.

```javascript
function clampParameters(iterations, ratio, angle) {
  return {
    iterations: Math.max(1, Math.min(12, Math.floor(iterations))),
    ratio: Math.max(0.3, Math.min(0.9, ratio)),
    angle: Math.max(0, Math.min(90, angle))
  };
}
```

### Canvas Not Supported

**Strategy**: Check for canvas support on page load and display error message if unavailable.

```javascript
function checkCanvasSupport() {
  const canvas = document.getElementById('fractal-canvas');
  if (!canvas.getContext) {
    document.getElementById('error-message').style.display = 'block';
    document.getElementById('controls').style.display = 'none';
    return false;
  }
  return true;
}
```

### Rendering Errors

**Strategy**: Wrap rendering logic in try-catch to handle unexpected errors gracefully.

```javascript
try {
  renderer.render(state.iterations, state.ratio, state.angle);
} catch (error) {
  console.error('Rendering error:', error);
  // Display user-friendly error message
}
```

### Edge Cases

1. **Iterations = 1**: Should draw only the trunk (no branches)
2. **Angle = 0**: Child branches should be collinear with parent
3. **Angle = 90**: Child branches should be perpendicular to parent
4. **Ratio = 0.3**: Very small branches, may become invisible at high iterations
5. **Ratio = 0.9**: Branches shrink slowly, may exceed canvas bounds at high iterations

## Testing Strategy

### Unit Testing Approach

The testing strategy uses a dual approach combining unit tests for specific examples and edge cases with property-based tests for comprehensive validation.

**Unit Tests** will focus on:
- Default parameter initialization (iterations=8, ratio=0.67, angle=25)
- UI element existence and attributes (sliders, labels, canvas)
- Specific edge cases (iterations=1, angle=0, angle=90)
- Canvas support detection and error handling
- Coordinate calculations for known inputs

**Property-Based Tests** will focus on:
- Universal properties that hold across all valid parameter combinations
- Mathematical invariants (branch count, length scaling, angle relationships)
- Bounds checking across parameter ranges
- Canvas state consistency

### Property-Based Testing Configuration

**Library**: Use `fast-check` for JavaScript property-based testing

**Configuration**: Each property test should run a minimum of 100 iterations to ensure comprehensive coverage through randomization.

**Test Tagging**: Each property test must include a comment referencing the design document property:

```javascript
// Feature: fractal-simulator, Property 2: Branch Count Grows Exponentially with Iterations
test('branch count equals 2^iterations - 1', () => {
  fc.assert(
    fc.property(
      fc.integer({min: 1, max: 12}),
      fc.float({min: 0.3, max: 0.9}),
      fc.float({min: 0, max: 90}),
      (iterations, ratio, angle) => {
        const branches = countBranches(iterations, ratio, angle);
        return branches === Math.pow(2, iterations) - 1;
      }
    ),
    { numRuns: 100 }
  );
});
```

### Test Coverage Requirements

1. **Property 1 (Fractal Rendering)**: Generate random valid parameters, verify canvas has drawn content
2. **Property 2 (Branch Count)**: Generate random iterations (1-12), verify branch count = 2^n - 1
3. **Property 3 (Length Scaling)**: Generate random parameters, verify each child length = parent × ratio
4. **Property 4 (Angle Divergence)**: Generate random parameters, verify child angles = parent ± angle
5. **Property 5 (Parameter Fidelity)**: Generate random parameters, verify output matches inputs
6. **Property 6 (Canvas Clearing)**: Render twice with different parameters, verify no overlap
7. **Property 7 (Bounds Containment)**: Generate random valid parameters, verify all coordinates within canvas

### Testing Implementation Notes

- Use a headless canvas implementation (like `canvas` npm package) for Node.js testing
- Mock DOM elements for control panel tests
- Create helper functions to extract branch data from canvas for verification
- Use approximate equality for floating-point comparisons (tolerance ~0.001)

### Manual Testing

Manual testing should verify:
- Visual quality and aesthetics across parameter ranges
- Smooth slider interaction and real-time updates
- Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- Performance at maximum iterations (12)
- Responsive behavior during rapid slider adjustments

