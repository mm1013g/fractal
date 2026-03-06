// Fractal Simulator - Main Application
// Initializes the fractal rendering application with canvas setup and parameter state

// Application state object with default parameter values
const state = {
  iterations: 8,      // Default: 8 (Requirement 7.1)
  ratio: 0.67,        // Default: 0.67 (Requirement 7.2)
  angle: 25,          // Default: 25 degrees (Requirement 7.3)
  // Viewport state for panning and zooming
  offsetX: 0,
  offsetY: 0,
  scale: 1,
  isPanning: false,
  lastMouseX: 0,
  lastMouseY: 0,
  // Touch state for pinch zoom
  lastPinchDistance: null,
  pinchCenterX: 0,
  pinchCenterY: 0
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
 * @param {number} iterations - Recursion depth (1-15)
 * @param {number} ratio - Branch length scaling factor (0.3-0.9)
 * @param {number} angle - Branching angle in degrees (0-90)
 * @returns {Object} Clamped parameters object
 */
function clampParameters(iterations, ratio, angle) {
  return {
    iterations: Math.max(1, Math.min(15, Math.round(iterations))),
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
   * @param {number} iterations - Recursion depth (1-15)
   * @param {number} ratio - Branch length scaling factor (0.3-0.9)
   * @param {number} angle - Branching angle in degrees (0-90)
   * Validates: Requirements 1.1, 1.3, 1.4, 5.1, 6.3, 6.4
   */
  render(iterations, ratio, angle) {
    try {
      // Save current context state
      this.ctx.save();

      // Clear canvas before each render (Requirement 5.1)
      this.ctx.fillStyle = this.config.backgroundColor;
      this.ctx.fillRect(0, 0, this.config.width, this.config.height);

      // Apply viewport transformations (pan and zoom)
      this.ctx.translate(state.offsetX, state.offsetY);
      this.ctx.scale(state.scale, state.scale);

      // Set stroke style and line width (Requirement 1.5)
      this.ctx.strokeStyle = this.config.lineColor;
      this.ctx.lineWidth = this.config.lineWidth / state.scale; // Adjust line width for zoom

      // Calculate initial trunk parameters (Requirements 1.4, 6.3, 6.4)
      const startX = this.config.trunkStartX;
      const startY = this.config.trunkStartY;
      const length = this.config.trunkLength;
      const initialAngle = this.config.trunkAngle; // -Math.PI/2 (pointing upward)

      // Convert branching angle from degrees to radians
      const branchAngleRad = (angle * Math.PI) / 180;

      // Call recursive drawBranch method with initial parameters (Requirement 1.1)
      this.drawBranch(startX, startY, length, initialAngle, 0, iterations, ratio, branchAngleRad);

      // Restore context state
      this.ctx.restore();

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

  // Return renderer for use in viewport controls
  return { renderer, updateFractal };
}

/**
 * Setup viewport controls for panning and zooming
 */
function setupViewportControls(renderer, updateFractal) {
  const canvas = document.getElementById('fractal-canvas');
  if (!canvas) return;

  // Mouse down - start panning
  canvas.addEventListener('mousedown', (event) => {
    state.isPanning = true;
    state.lastMouseX = event.clientX;
    state.lastMouseY = event.clientY;
    canvas.style.cursor = 'grabbing';
  });

  // Mouse move - pan if dragging
  canvas.addEventListener('mousemove', (event) => {
    if (state.isPanning) {
      const deltaX = event.clientX - state.lastMouseX;
      const deltaY = event.clientY - state.lastMouseY;
      
      state.offsetX += deltaX;
      state.offsetY += deltaY;
      
      state.lastMouseX = event.clientX;
      state.lastMouseY = event.clientY;
      
      updateFractal();
    }
  });

  // Mouse up - stop panning
  canvas.addEventListener('mouseup', () => {
    state.isPanning = false;
    canvas.style.cursor = 'grab';
  });

  // Mouse leave - stop panning
  canvas.addEventListener('mouseleave', () => {
    state.isPanning = false;
    canvas.style.cursor = 'grab';
  });

  // Wheel - zoom in/out
  canvas.addEventListener('wheel', (event) => {
    event.preventDefault();
    
    const zoomIntensity = 0.1;
    const delta = event.deltaY > 0 ? -zoomIntensity : zoomIntensity;
    const newScale = state.scale * (1 + delta);
    
    // Limit zoom range
    if (newScale >= 0.1 && newScale <= 10) {
      // Get mouse position relative to canvas
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      
      // Zoom towards mouse position
      state.offsetX = mouseX - (mouseX - state.offsetX) * (newScale / state.scale);
      state.offsetY = mouseY - (mouseY - state.offsetY) * (newScale / state.scale);
      state.scale = newScale;
      
      updateFractal();
    }
  });

  // Touch start - handle single and multi-touch
  canvas.addEventListener('touchstart', (event) => {
    event.preventDefault();
    
    if (event.touches.length === 1) {
      // Single touch - start panning
      state.isPanning = true;
      state.lastMouseX = event.touches[0].clientX;
      state.lastMouseY = event.touches[0].clientY;
    } else if (event.touches.length === 2) {
      // Two fingers - start pinch zoom
      state.isPanning = false;
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      state.lastPinchDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      
      // Store center point for zoom
      state.pinchCenterX = (touch1.clientX + touch2.clientX) / 2;
      state.pinchCenterY = (touch1.clientY + touch2.clientY) / 2;
    }
  });

  // Touch move - handle panning and pinch zoom
  canvas.addEventListener('touchmove', (event) => {
    event.preventDefault();
    
    if (event.touches.length === 1 && state.isPanning) {
      // Single touch - pan
      const deltaX = event.touches[0].clientX - state.lastMouseX;
      const deltaY = event.touches[0].clientY - state.lastMouseY;
      
      state.offsetX += deltaX;
      state.offsetY += deltaY;
      
      state.lastMouseX = event.touches[0].clientX;
      state.lastMouseY = event.touches[0].clientY;
      
      updateFractal();
    } else if (event.touches.length === 2) {
      // Two fingers - pinch zoom
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const currentDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      
      if (state.lastPinchDistance) {
        const scaleFactor = currentDistance / state.lastPinchDistance;
        const newScale = state.scale * scaleFactor;
        
        // Limit zoom range
        if (newScale >= 0.1 && newScale <= 10) {
          // Get pinch center relative to canvas
          const rect = canvas.getBoundingClientRect();
          const centerX = state.pinchCenterX - rect.left;
          const centerY = state.pinchCenterY - rect.top;
          
          // Zoom towards pinch center
          state.offsetX = centerX - (centerX - state.offsetX) * (newScale / state.scale);
          state.offsetY = centerY - (centerY - state.offsetY) * (newScale / state.scale);
          state.scale = newScale;
          
          updateFractal();
        }
      }
      
      state.lastPinchDistance = currentDistance;
    }
  });

  // Touch end - stop panning/zooming
  canvas.addEventListener('touchend', (event) => {
    event.preventDefault();
    
    if (event.touches.length === 0) {
      state.isPanning = false;
      state.lastPinchDistance = null;
    } else if (event.touches.length === 1) {
      // Switched from two fingers to one - restart panning
      state.isPanning = true;
      state.lastMouseX = event.touches[0].clientX;
      state.lastMouseY = event.touches[0].clientY;
      state.lastPinchDistance = null;
    }
  });

  // Touch cancel - stop panning/zooming
  canvas.addEventListener('touchcancel', () => {
    state.isPanning = false;
    state.lastPinchDistance = null;
  });

  // Set initial cursor
  canvas.style.cursor = 'grab';
}

// Setup slider handlers after initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (initializeApp()) {
      const { renderer, updateFractal } = setupSliderHandlers();
      setupViewportControls(renderer, updateFractal);
    }
  });
} else {
  if (initializeApp()) {
    const { renderer, updateFractal } = setupSliderHandlers();
    setupViewportControls(renderer, updateFractal);
  }
}
