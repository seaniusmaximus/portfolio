/* global document, window, console, setTimeout, $AD, URL */
/* eslint-disable no-undefined */

/**
 * Particle module for ACE.
 * see example usage in dev/index.html
 */

let gsap;

/* private functions here */
function randomBetween([min, max]) {
  return Math.random() * (max - min) + min;
}

function detectType(value) {
  if (Array.isArray(value) && value.length >= 2) {
    return randomBetween(value);
  }
  if (Array.isArray(value) && value.length < 2) {
    return value[0];
  }
  if (typeof value === 'number') {
    return value;
  }

  return 0;
}

function loadScripts(srcArray, callback) {
  const allowlist = ['s.yimg'];
  let loadedCount = 0;
  const total = srcArray.length;

  if (total === 0) {
    callback();
    return;
  }

  srcArray.forEach((src) => {
    try {
      const url = new URL(src, window.location.origin);
      if (!allowlist.some((domain) => url.hostname.startsWith(domain))) {
        console.warn('Script domain not allowed:', url.hostname);
        loadedCount++;
        if (loadedCount === total) {
          callback();
        }
        return;
      }
    } catch (e) {
      console.warn('Invalid script URL:', src);
      loadedCount++;
      if (loadedCount === total) {
        callback();
      }
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.onload = () => {
      loadedCount++;
      if (loadedCount === total) {
        callback();
      }
    };
    script.onerror = () => {
      console.warn('Failed to load script:', src);
      loadedCount++;
      if (loadedCount === total) {
        callback();
      }
    };
    document.head.appendChild(script);
  });
}

/* constructor */
function Particle(config) {
  let conf = {
    gsap: {
      library: {
        name: 'gsap',
        version: '3.11.5',
        src: 'https://s.yimg.com/cv/apiv2/apiv2/libs/gsap/3.11.5/gsap.min.js',
      },
      plugins: {
        physics2D: {
          name: 'Physics2DPlugin',
          version: '3.11.5',
          src: 'https://s.yimg.com/cv/apiv2/apiv2/libs/gsap/3.11.5/plugins/Physics2D/Physics2DPlugin.min.js',
        },
      },
    },
    container: undefined,
    count: undefined,
    size: undefined,
    images: undefined,
    physics: {
      velocity: undefined,
      angle: undefined,
      gravity: undefined,
      friction: undefined,
    },
    duration: undefined,
    totalDuration: undefined,
    repeat: undefined,
    readyCallback: undefined,
    completeCallback: undefined,
  };

  this.config = $AD.Utilities.deepMerge(conf, config);

  this._particleArray = [];
  this._emitterElement = undefined;
}

Particle.prototype = {
  init: function () {
    this._emitterElement = $AD.Utilities.byId(
      this.config.container.replace('#', '')
    );
    loadScripts(
      [this.config.gsap.library.src, this.config.gsap.plugins.physics2D.src],
      this.ready.bind(this)
    );
  },

  createParticles: function (
    emitter = this._emitterElement,
    count = this.config.count,
    images = this.config.images
  ) {
    for (let i = 0; i < count; i++) {
      let particle = document.createElement('div');
      particle.classList.add('particle');
      particle.style.width = detectType(this.config.size) + 'px';
      particle.style.height = detectType(this.config.size) + 'px';
      particle.style.pointerEvents = 'none';
      if (this.config.images && this.config.images.length > 0) {
        particle.style.backgroundImage =
          'url(' + images[i % images.length] + ')';
        particle.style.backgroundSize = 'contain';
        particle.style.position = 'absolute';
        particle.style.backgroundRepeat = 'no-repeat';
        particle.style.backgroundPosition = 'center center';
      }
      if (this.config.classes && this.config.classes.length > 0) {
        particle.classList.add(
          this.config.classes[i % this.config.classes.length]
        );
      }
      emitter.appendChild(particle);
      this._particleArray.push(particle);
    }
  },

  animateParticles: function () {
    this._tl = gsap.timeline();
    this._tl.addLabel('start', 0);
    if (this._particleArray.length > 0) {
      this._particleArray.forEach((particle) => {
        gsap.set(particle, {
          x:
            Math.random() * this._emitterElement.clientWidth -
            this._emitterElement.clientWidth / 2,
          y:
            Math.random() * this._emitterElement.clientHeight -
            this._emitterElement.clientHeight / 2,
        });
        this._tl.add(
          gsap.to(particle, {
            delay: () => detectType(this.config.delay),
            duration: this.config.duration,
            physics2D: {
              velocity: () => detectType(this.config.physics.velocity),
              angle: () => detectType(this.config.physics.angle),
              gravity: () => detectType(this.config.physics.gravity),
              friction: () => detectType(this.config.physics.friction),
            },
            repeat: this.config.repeat || 0,
            ease: 'none',
          }),
          'start'
        );
        // additional animation attached here
        if (this.config.additionalAnimation) {
          this._tl.to(
            particle,
            this.config.additionalAnimation,
            '-=' + this.config.duration
          );
        }
      });
    }
  },

  ready: function () {
    gsap = window.gsap;
    gsap.registerPlugin(window.Physics2DPlugin);

    if (this.config.totalDuration) {
      this.startTimer(this.config.totalDuration);
    }

    if (this.config.readyCallback) {
      this.config.readyCallback();
    }
  },

  pause: function () {
    if (this._tl) {
      this._tl.pause();
    }
  },

  resume: function () {
    if (this._tl) {
      this._tl.resume();
    }
  },

  stop: function () {
    gsap.killTweensOf('*');
  },

  startTimer: function (duration) {
    this._timer = setTimeout(() => {
      this.pause();
      if (this.config.completeCallback) {
        this.config.completeCallback();
      }
    }, duration * 1000);
  },

  destroy: function () {
    this.stop();
    this._particleArray.forEach((particle) => {
      particle.remove();
    });
  },
};

export default Particle;
