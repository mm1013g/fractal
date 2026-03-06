// Fractal Simulator - Main Application
// Initializes the fractal rendering application with canvas setup and parameter state

// Application state object with default parameter values
const state = {
  iterations: 8,      // Default: 8 (Requirement 7.1)
  ratio: 0.67,        // Default: 0.67 (Requirement 7.2)
  angle: 25           // Default: 25 degrees (Requirement 7.3)
};

// Canvas configuration
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

/**
 * Main application initialization function
 * Checks browser compatibility, sets up canvas, and initializes application state
 * @returns {boolean} True if initialization successful, false otherwise
 */
function initializeApp() {
  // Check for canvas support (Requirement 8.1, 8.3)
  const canvas = document.getElementById('fractal-canvas');
  
  if (!canvas || !canvas.getContext) {
    // Display error message if canvas not supported
    document.getElementById('error-message').style.display = 'block';
    document.getElementById('canvas-container').style.display = 'none';
    document.getElementById('controls').style.display = 'none';
    return false;
  }

  // Get canvas context (Requirement 8.2)
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    document.getElementById('error-message').style.display = 'block';
    document.getElementById('canvas-container').style.display = 'none';
    document.getElementById('controls').style.display = 'none';
    return false;
  }

  // Set canvas dimensions (Requirement 6.1)
  canvas.width = canvasConfig.width;
  canvas.height = canvasConfig.height;

  // Configure canvas drawing style
  ctx.strokeStyle = canvasConfig.lineColor;
  ctx.lineWidth = canvasConfig.lineWidth;
  ctx.lineCap = 'round';

  // Initialize parameter state is already set with defaults above
  // (Requirements 7.1, 7.2, 7.3)

  console.log('Fractal Simulator initialized successfully');
  console.log('Default parameters:', state);

  return true;
}

// Note: Initialization is handled at the end of the file with setupSliderHandlers

/**
 * Clamps parameters to valid ranges
 * @param {number} iterations - Recursion depth (1-12)
 * @param {number} ratio - Branch length scaling factor (0.3-0.9)
 * @param {number} angle - Branching angle in degrees (0-90)
 * @returns {Object} Clamped parameters object
 */
function clampParameters(iterations, ratio, angle) {
  return {
    iterations: Math.max(1, Math.min(12, Math.round(iterations))),
    ratio: Math.max(0.3, Math.min(0.9, ratio)),
    angle: Math.max(0, Math.min(90, Math.round(angle)))
  };
}

/**
 * FractalRenderer class
 * Encapsulates all fractal rendering logic and maintains canvas references
 * Validates: Requirements 1.1, 6.3
 */
class FractalRenderer {
  /**
   * Constructor - Initialize renderer with canvas element
   * @param {HTMLCanvasElement} canvas - The canvas element to render on
   */
  constructor(canvas) {
    // Store canvas reference (Requirement 1.1)
    this.canvas = canvas;
    
    // Store 2D rendering context (Requirement 1.1)
    this.ctx = canvas.getContext('2d');
    
    // Initialize canvas configuration constants (Requirement 6.3)
    this.config = {
      width: 600,
      height: 600,
      backgroundColor: '#1a1a1a',
      lineColor: '#00ff00',
      lineWidth: 2,
      trunkStartX: 300,      // Center X (Requirement 6.3)
      trunkStartY: 550,      // Near bottom
      trunkLength: 120,      // Initial trunk length (Requirement 6.4)
      trunkAngle: -Math.PI/2 // Point upward
    };
  }


  /**
   * Main render method - Clears canvas and initiates fractal drawing
   * @param {number} iterations - Recursion depth (1-12)
   * @param {number} ratio - Branch length scaling factor (0.3-0.9)
   * @param {number} angle - Branching angle in degrees (0-90)
   * Validates: Requirements 1.1, 1.3, 1.4, 5.1, 6.3, 6.4
   */
  render(iterations, ratio, angle) {
    try {
      // Clear canvas before each render (Requirement 5.1)
      this.ctx.fillStyle = this.config.backgroundColor;
      this.ctx.fillRect(0, 0, this.config.width, this.config.height);

      // Set stroke style and line width (Requirement 1.5)
      this.ctx.strokeStyle = this.config.lineColor;
      this.ctx.lineWidth = this.config.lineWidth;

      // Calculate initial trunk parameters (Requirements 1.4, 6.3, 6.4)
      const startX = this.config.trunkStartX;
      const startY = this.config.trunkStartY;
      const length = this.config.trunkLength;
      const initialAngle = this.config.trunkAngle; // -Math.PI/2 (pointing upward)

      // Convert branching angle from degrees to radians
      const branchAngleRad = (angle * Math.PI) / 180;

      // Call recursive drawBranch method with initial parameters (Requirement 1.1)
      this.drawBranch(startX, startY, length, initialAngle, 0, iterations, ratio, branchAngleRad);

    } catch (error) {
      console.error('Rendering error:', error);
      throw error;
    }
  }

  /**
   * Recursive drawBranch method - Draws a branch and its children
   * @param {number} x - Starting X coordinate
   * @param {number} y - Starting Y coordinate
   * @param {number} length - Length of current branch
   * @param {number} angle - Current direction angle in radians
   * @param {number} depth - Current recursion depth
   * @param {number} maxDepth - Maximum iterations
   * @param {number} ratio - Length scaling factor
   * @param {number} branchAngle - Branching angle offset in radians
   * Validates: Requirements 1.1, 1.2, 1.5, 2.5, 3.5, 4.5
   */
  drawBranch(x, y, length, angle, depth, maxDepth, ratio, branchAngle) {
    // Base case: stop recursion when depth reaches maxDepth (Requirement 1.2)
    if (depth >= maxDepth) {
      return;
    }

    // Calculate branch endpoint using trigonometry (Requirement 1.1)
    const endX = x + length * Math.cos(angle);
    const endY = y + length * Math.sin(angle);

    // Draw line from start to end point (Requirements 1.1, 1.5)
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(endX, endY);
    this.ctx.stroke();

    // Calculate child branch length (Requirement 3.5)
    const childLength = length * ratio;

    // Recursively draw left child branch (angle + branchAngle) (Requirements 1.2, 2.5, 4.5)
    this.drawBranch(endX, endY, childLength, angle + branchAngle, depth + 1, maxDepth, ratio, branchAngle);

    // Recursively draw right child branch (angle - branchAngle) (Requirements 1.2, 2.5, 4.5)
    this.drawBranch(endX, endY, childLength, angle - branchAngle, depth + 1, maxDepth, ratio, branchAngle);
  }

}

/**
 * Setup slider event handlers
 * Initializes event listeners for all parameter sliders
 */
function setupSliderHandlers() {
  // Get canvas and create renderer instance
  const canvas = document.getElementById('fractal-canvas');
  if (!canvas) return;
  
  const renderer = new FractalRenderer(canvas);

  // Get slider elements
  const iterationsSlider = document.getElementById('iterations');
  const ratioSlider = document.getElementById('ratio');
  const angleSlider = document.getElementById('angle');

  // Get value display elements
  const iterationsDisplay = document.getElementById('iterations-value');
  const ratioDisplay = document.getElementById('ratio-value');
  const angleDisplay = document.getElementById('angle-value');

  /**
   * Update fractal with current state parameters
   */
  function updateFractal() {
    // Clamp parameters to valid ranges
    const clamped = clampParameters(state.iterations, state.ratio, state.angle);
    
    // Update state with clamped values
    state.iterations = clamped.iterations;
    state.ratio = clamped.ratio;
    state.angle = clamped.angle;

    // Render fractal with updated parameters
    renderer.render(state.iterations, state.ratio, state.angle);
  }

  // Iterations slider event listener
  if (iterationsSlider && iterationsDisplay) {
    iterationsSlider.addEventListener('input', (event) => {
      const value = parseInt(event.target.value, 10);
      state.iterations = value;
      iterationsDisplay.textContent = value;
      updateFractal();
    });
  }

  // Ratio slider event listener
  if (ratioSlider && ratioDisplay) {
    ratioSlider.addEventListener('input', (event) => {
      const value = parseFloat(event.target.value);
      state.ratio = value;
      ratioDisplay.textContent = value.toFixed(2);
      updateFractal();
    });
  }

  // Angle slider event listener
  if (angleSlider && angleDisplay) {
    angleSlider.addEventListener('input', (event) => {
      const value = parseInt(event.target.value, 10);
      state.angle = value;
      angleDisplay.textContent = value;
      updateFractal();
    });
  }

  // Render initial fractal with default parameters
  updateFractal();
}

// Setup slider handlers after initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (initializeApp()) {
      setupSliderHandlers();
    }
  });
} else {
  if (initializeApp()) {
    setupSliderHandlers();
  }
}
