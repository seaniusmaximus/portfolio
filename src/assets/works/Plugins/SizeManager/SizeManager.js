/* global clearTimeout, setTimeout, window, $AD */
/**
 * SizeManager - Responsive ad container sizing and scaling
 * Handles responsive breakpoints, scaling, and centering of ad content
 * @class SizeManager
 *
 * @example
 * const sizeManager = new SizeManager({
 *   containerID: 'container',
 *   adId: 'adBox',
 *   breakpoints: [
 *     { class: 'wide', ratio: '16:3' },
 *     { class: 'mid', ratio: '40:9' },
 *     { class: 'mobile', ratio: '16:9' }
 *   ],
 *   scaleBetween: true,
 *   center: true,
 *   debounceTimer: 100,
 *   resizeCallback: (state) => console.log('Resized:', state)
 * });
 *
 * sizeManager.init();
 */

/**
 * Debounce function to limit frequency of resize calculations
 * @function debounce
 * @param {Function} func - Function to debounce
 * @param {Number} wait - Wait time in milliseconds
 * @param {Boolean} immediate - Execute immediately on first call
 * @returns {Function} Debounced function
 * @private
 */
function debounce(func, wait, immediate) {
  let timeout;
  return function debounced(...args) {
    const context = this;
    const later = () => {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };
}

class SizeManager {
  /**
   * Default configuration for SizeManager
   * @static
   */
  static DEFAULT_CONFIG = {
    containerID: 'container',
    adId: 'adBox',
    breakpoints: [
      { class: 'wide', ratio: '16:3' },
      { class: 'mid', ratio: '40:9' },
      { class: 'mobile', ratio: '16:9' },
    ],
    scaleBetween: true,
    center: true,
    debounceTimer: 100,
  };

  /**
   * Debug logging wrapper of $AD.debug.
   */
  debug() {
    $AD.debug(this.name, ...arguments);
  }

  /**
   * Create a new SizeManager instance
   * @param {Object} configRef - Configuration object
   * @param {String} configRef.containerID - ID of container element
   * @param {String} configRef.adId - ID of ad box element
   * @param {Array} configRef.breakpoints - Responsive breakpoints with class and ratio
   * @param {Boolean} configRef.scaleBetween - Scale ad to fit container
   * @param {Boolean} configRef.center - Center ad in container
   * @param {Number} configRef.debounceTimer - Debounce delay in ms
   * @param {Function} configRef.resizeCallback - Callback on resize
   */
  constructor(configRef) {
    // Validate config
    if (!configRef || typeof configRef !== 'object') {
      throw new TypeError('Config object is required');
    }

    this.name = 'SizeManager';
    // Merge with defaults using $AD.Utilities.deepMerge
    this.config = $AD.Utilities.deepMerge(
      { ...SizeManager.DEFAULT_CONFIG },
      configRef
    );

    // Validate required elements exist
    this.validateConfig();

    // Initialize DOM elements
    this.container = this.getElement(this.config.containerID);
    this.adBox = this.getElement(this.config.adId);

    // Setup container styling
    this.setupContainer();

    // Setup ad box styling
    this.setupAdBox();

    // State tracking
    this.state = { ...this.config.breakpoints[0], scaleAmount: 1 };

    // Bind methods for use as callbacks
    this.update = this.update.bind(this);
    this.checkState = this.checkState.bind(this);

    // Create debounced resize handler
    this.debouncedUpdate = debounce(
      this.update,
      this.config.debounceTimer,
      false
    );

    this.debug(
      `SizeManager initialized for container: ${this.config.containerID}`
    );
  }

  /**
   * Validate configuration
   * @private
   */
  validateConfig() {
    const { containerID, adId, breakpoints } = this.config;

    if (!containerID || typeof containerID !== 'string') {
      throw new Error('containerID is required and must be a string');
    }

    if (!adId || typeof adId !== 'string') {
      throw new Error('adId is required and must be a string');
    }

    if (!Array.isArray(breakpoints) || breakpoints.length === 0) {
      throw new Error('breakpoints must be a non-empty array');
    }

    // Validate breakpoint structure
    breakpoints.forEach((bp, index) => {
      if (!bp.class || !bp.ratio) {
        throw new Error(
          `Breakpoint at index ${index} missing 'class' or 'ratio'`
        );
      }
      const ratio = bp.ratio.split(':');
      if (ratio.length !== 2 || isNaN(ratio[0]) || isNaN(ratio[1])) {
        throw new Error(
          `Breakpoint ratio must be in format 'W:H', got: ${bp.ratio}`
        );
      }
    });
  }

  /**
   * Get element by ID with validation
   * @param {String} id - Element ID
   * @returns {HTMLElement} The element
   * @throws {Error} If element not found
   * @private
   */
  getElement(id) {
    const element = $AD.Utilities.byId(id);
    if (!element) {
      this.debug(`Element with ID '${id}' not found`);
      throw new Error(`Element with ID '${id}' not found`);
    }
    return element;
  }

  /**
   * Setup container styling
   * @private
   */
  setupContainer() {
    this.container.style.width = '100vw';
    this.container.style.height = '100vh';
    this.container.style.overflow = 'hidden';
  }

  /**
   * Setup ad box styling
   * @private
   */
  setupAdBox() {
    this.adBox.style.transformOrigin = 'top left';
    this.adBox.style.position = 'relative';
    this.adBox.style.overflow = 'hidden';
  }

  /**
   * Get element dimensions
   * @param {HTMLElement} element - Element to measure
   * @returns {Object} Width and height dimensions
   * @private
   */
  getElementDimensions(element) {
    const elementDimensions = {
      id: element.id,
      node: element,
      width: element.clientWidth,
      height: element.clientHeight,
    };
    this.debug(`Element dimensions for ${element.id}:`, elementDimensions);
    return elementDimensions;
  }

  /**
   * Calculate aspect ratio from width and height
   * @param {Number} width - Width value
   * @param {Number} height - Height value
   * @returns {Number} Computed aspect ratio
   * @private
   */
  getComputedAspectRatio(width, height) {
    if (height === 0) {
      this.debug('Height is 0, cannot compute aspect ratio');
      return 0;
    }
    return Math.round(width / height);
  }

  /**
   * Parse ratio strings to numeric values
   * @param {Array} breakpoints - Breakpoint array
   * @returns {Array} Array of numeric ratios
   * @private
   */
  parseRatios(breakpoints) {
    return breakpoints.map((breakpoint) => {
      const [width, height] = breakpoint.ratio.split(':').map(Number);
      return this.getComputedAspectRatio(width, height);
    });
  }

  /**
   * Find closest value in array to a target number
   * @param {Array} array - Array of numbers
   * @param {Number} target - Target number
   * @returns {Number} Closest value in array
   * @private
   */
  getClosest(array, target) {
    let undef;
    if (!Array.isArray(array) || array.length === 0) {
      // Array is undefined, return explicit undefined
      this.debug('Empty array provided to getClosest');
      return undef;
    }

    return array.reduce((prev, curr) =>
      Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev
    );
  }

  /**
   * Check if breakpoint state matches current dimensions
   * @param {Object} breakpoint - Breakpoint to check
   * @private
   */
  checkState(breakpoint) {
    this.debug(`Checking breakpoint: ${breakpoint.class}`);
    const containerDims = this.getElementDimensions(this.container);
    const containerRatio = this.getComputedAspectRatio(
      containerDims.width,
      containerDims.height
    );

    const [ratioWidth, ratioHeight] = breakpoint.ratio.split(':').map(Number);
    const breakpointRatio = this.getComputedAspectRatio(
      ratioWidth,
      ratioHeight
    );
    this.debug(
      `Container ratio breakpoint: ${containerRatio}, ${containerDims.width}x${containerDims.height} Breakpoint ratio: ${breakpointRatio}`
    );
    const parsedRatios = this.parseRatios(this.config.breakpoints);
    const closestRatio = this.getClosest(parsedRatios, containerRatio);

    if (breakpointRatio === closestRatio) {
      // Update container class
      this.adBox.className = breakpoint.class;

      // Update state
      this.state = {
        ...breakpoint,
        scaleAmount: this.state.scaleAmount || 1,
      };

      this.debug(
        `Matched breakpoint: ${breakpoint.class} (ratio: ${breakpoint.ratio})`
      );
    }
  }

  /**
   * Scale ad box to fit container
   * @private
   */
  scaleAdBox() {
    const containerDims = this.getElementDimensions(this.container);
    const adBoxDims = this.getElementDimensions(this.adBox);

    // Guard against zero dimensions (prevents division by zero and NaN/Infinity values)
    if (adBoxDims.width === 0 || adBoxDims.height === 0) {
      this.debug('Ad box has zero dimensions, skipping scale calculation');
      this.state.scaleAmount = 1;
      return;
    }

    // Calculate scale amounts for width and height
    const scaleByWidth = containerDims.width / adBoxDims.width;
    const scaleByHeight = containerDims.height / adBoxDims.height;

    // Use smaller scale to fit within container
    const scaleAmount = Math.min(scaleByWidth, scaleByHeight);

    // Apply scale transform
    this.adBox.style.transform = `scale(${scaleAmount})`;
    this.state.scaleAmount = scaleAmount;

    this.debug(`Scaled ad box: ${scaleAmount.toFixed(2)}x`);

    // Center if configured
    if (this.config.center !== false) {
      this.centerAdBox(scaleAmount);
    }
  }

  /**
   * Center ad box within container
   * @param {Number} scaleAmount - Current scale amount
   * @private
   */
  centerAdBox(scaleAmount) {
    const containerDims = this.getElementDimensions(this.container);
    const adBoxDims = this.getElementDimensions(this.adBox);

    // Guard against zero or invalid dimensions
    if (
      adBoxDims.width === 0 ||
      adBoxDims.height === 0 ||
      !isFinite(scaleAmount)
    ) {
      this.debug(
        'Invalid dimensions or scale amount, skipping center calculation'
      );
      return;
    }

    const scaledWidth = adBoxDims.width * scaleAmount;
    const scaledHeight = adBoxDims.height * scaleAmount;

    const leftOffset = (containerDims.width - scaledWidth) / 2;
    const topOffset = (containerDims.height - scaledHeight) / 2;

    // Guard against NaN or Infinity values before applying to DOM
    if (!isFinite(leftOffset) || !isFinite(topOffset)) {
      this.debug(
        'Computed offsets are invalid (NaN or Infinity), skipping positioning'
      );
      return;
    }

    this.adBox.style.left = `${leftOffset}px`;
    this.adBox.style.top = `${topOffset}px`;

    this.debug(
      `Centered ad box: left=${leftOffset.toFixed(0)}px, top=${topOffset.toFixed(0)}px`
    );
  }

  /**
   * Update size and state based on current dimensions
   * Called on resize events
   */
  update() {
    this.debug('Updating SizeManager...');

    // Check all breakpoints
    this.config.breakpoints.forEach((bp) => this.checkState(bp));

    // Scale ad box if configured
    if (this.config.scaleBetween) {
      this.scaleAdBox();
    }

    // Invoke resize callback if provided
    if (typeof this.config.resizeCallback === 'function') {
      try {
        this.config.resizeCallback(this.state);
      } catch (error) {
        this.debug('Error in resizeCallback:', error);
      }
    }
  }

  /**
   * Initialize SizeManager and attach resize listener
   */
  init() {
    this.debug('Initializing SizeManager');

    // Perform initial update
    this.update();

    // Attach debounced resize handler
    window.addEventListener('resize', this.debouncedUpdate, false);

    this.debug('SizeManager ready');
  }

  /**
   * Cleanup and remove event listeners
   */
  destroy() {
    this.debug('Destroying SizeManager');
    window.removeEventListener('resize', this.debouncedUpdate, false);
  }

  /**
   * Get current state
   * @returns {Object} Current state object
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Manually trigger update (bypasses debounce)
   * Useful for testing or forcing immediate updates
   */
  forceUpdate() {
    this.debug('Force update triggered');
    this.update();
  }

  /**
   * Change breakpoints dynamically
   * @param {Array} newBreakpoints - New breakpoints array
   */
  setBreakpoints(newBreakpoints) {
    if (!Array.isArray(newBreakpoints) || newBreakpoints.length === 0) {
      throw new Error('Breakpoints must be a non-empty array');
    }

    this.config.breakpoints = newBreakpoints;
    this.debug('Breakpoints updated, recalculating...');
    this.forceUpdate();
  }

  /**
   * Get current configuration
   * @returns {Object} Current config
   */
  getConfig() {
    return { ...this.config };
  }

  debug(message) {
    console.warn(message);
  }
}

export default SizeManager;
