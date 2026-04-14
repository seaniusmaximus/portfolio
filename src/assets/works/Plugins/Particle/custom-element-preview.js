/* global document, window, $AD */

function makeDraggableResizable(element) {
  let isDragging = false,
    isResizing = false,
    startX,
    startY,
    startWidth,
    startHeight,
    startLeft,
    startTop;

  // Create resize handle
  const resizeHandle = document.createElement('div');
  resizeHandle.style.position = 'absolute';
  resizeHandle.style.width = '16px';
  resizeHandle.style.height = '16px';
  resizeHandle.style.right = '0';
  resizeHandle.style.bottom = '0';
  resizeHandle.style.cursor = 'se-resize';
  resizeHandle.style.background = 'rgba(0,0,0,0.2)';
  resizeHandle.style.borderRadius = '4px';
  element.appendChild(resizeHandle);

  // Dragging
  element.addEventListener('mousedown', function (e) {
    if (e.target === resizeHandle) return;
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    startLeft = element.offsetLeft;
    startTop = element.offsetTop;
    document.body.style.userSelect = 'none';
  });

  // Resizing
  resizeHandle.addEventListener('mousedown', function (e) {
    e.stopPropagation();
    isResizing = true;
    startX = e.clientX;
    startY = e.clientY;
    startWidth = element.offsetWidth;
    startHeight = element.offsetHeight;
    document.body.style.userSelect = 'none';
  });

  document.addEventListener('mousemove', function (e) {
    if (isDragging) {
      element.style.left = startLeft + (e.clientX - startX) + 'px';
      element.style.top = startTop + (e.clientY - startY) + 'px';
    }
    if (isResizing) {
      element.style.width =
        Math.max(50, startWidth + (e.clientX - startX)) + 'px';
      element.style.height =
        Math.max(50, startHeight + (e.clientY - startY)) + 'px';
    }
  });

  document.addEventListener('mouseup', function () {
    isDragging = false;
    isResizing = false;
    document.body.style.userSelect = '';
  });
}

function customize() {
  const particlesContainer = $AD.Utilities.byId('particles-container');

  function createSettingsPanel(particleId, component) {
    const settingsDiv = document.createElement('div');
    settingsDiv.id = `settings-${particleId}`;
    settingsDiv.style.marginTop = '10px';
    settingsDiv.style.marginLeft = '10px';
    settingsDiv.style.padding = '10px';
    settingsDiv.style.backgroundColor = 'rgba(204,204,204,0.15)';

    // Read current attributes
    const count = component.getAttribute('count') || 10;
    const size = component.getAttribute('size') || 24;
    const images =
      component.getAttribute('images') ||
      '["images/flower-4ms.png"]';
    const velocity = component.getAttribute('velocity') || 100;
    const angle = component.getAttribute('angle') || [-45, -120];
    const gravity = component.getAttribute('gravity') || [200, 300];
    const friction = component.getAttribute('friction') || 0.1;
    const duration = component.getAttribute('duration') || 2;
    const repeat = component.getAttribute('repeat') || 0;
    const delay = component.getAttribute('delay') || 0;

    component.style.width = '100%';
    component.style.height = '100%';
    component.style.display = 'block';

    settingsDiv.innerHTML = `
  <h3>Settings</h3>
  <p>Drag to reposition and resize particle emitter</p>
  <fieldset class="settings-box">
    <legend>Particle Config</legend>
    <div>
      <label for="${particleId}-count">Count</label>
      <input type="text" id="${particleId}-count" value="${count}" style="width:80px"/>
    </div>
    <div>
      <label for="${particleId}-size">Size</label>
      <input type="text" id="${particleId}-size" value="${size}" style="width:80px"/>
    </div>
    <div>
      <label for="${particleId}-images">Images</label>
      <input type="text" id="${particleId}-images" value='${images}' style="width:220px"/>
    </div>
    <div>
      <label for="${particleId}-velocity">Velocity</label>
      <input type="text" id="${particleId}-velocity" value="${velocity}" style="width:80px"/>
    </div>
    <div>
      <label for="${particleId}-angle">Angle</label>
      <input type="text" id="${particleId}-angle" value="${angle}" style="width:80px"/>
    </div>
    <div>
      <label for="${particleId}-gravity">Gravity</label>
      <input type="text" id="${particleId}-gravity" value="${gravity}" style="width:80px"/>
    </div>
    <div>
      <label for="${particleId}-friction">Friction</label>
      <input type="text" id="${particleId}-friction" value="${friction}" style="width:80px"/>
    </div>
    <div>
      <label for="${particleId}-duration">Duration</label>
      <input type="text" id="${particleId}-duration" value="${duration}" style="width:80px"/>
    </div>
    <div>
      <label for="${particleId}-repeat">Repeat</label>
      <input type="text" id="${particleId}-repeat" value="${repeat}" style="width:80px"/>
    </div>
    <div>
      <label for="${particleId}-delay">Delay</label>
      <input type="text" id="${particleId}-delay" value="${delay}" style="width:80px"/>
    </div>
  </fieldset>
  <button onclick="updateParticle('${particleId}')">Make Particles</button>
`;

    particlesContainer.prepend(settingsDiv);

    window.updateParticle = function (id) {
      const component = $AD.Utilities.byId(id);
      component.setAttribute('count', $AD.Utilities.byId(`${id}-count`).value);
      component.setAttribute('size', $AD.Utilities.byId(`${id}-size`).value);
      component.setAttribute(
        'images',
        $AD.Utilities.byId(`${id}-images`).value
      );
      component.setAttribute(
        'velocity',
        $AD.Utilities.byId(`${id}-velocity`).value
      );
      component.setAttribute('angle', $AD.Utilities.byId(`${id}-angle`).value);
      component.setAttribute(
        'gravity',
        $AD.Utilities.byId(`${id}-gravity`).value
      );
      component.setAttribute(
        'friction',
        $AD.Utilities.byId(`${id}-friction`).value
      );
      component.setAttribute(
        'duration',
        $AD.Utilities.byId(`${id}-duration`).value
      );
      component.setAttribute(
        'repeat',
        $AD.Utilities.byId(`${id}-repeat`).value
      );
      component.setAttribute('delay', $AD.Utilities.byId(`${id}-delay`).value);
      component.update();
    };
  }

  const particleId = `particle_${Date.now()}`;
  const component = document.createElement('yahoo-particle-component');
  component.setAttribute('id', particleId);
  component.setAttribute('count', 10);
  component.setAttribute('size', 24);
  component.setAttribute(
    'images',
    '["images/flower-4ms.png"]'
  );
  component.setAttribute('velocity', [400, 500]);
  component.setAttribute('angle', [-45, -120]);
  component.setAttribute('gravity', 600);
  component.setAttribute('friction', 0.05);
  component.setAttribute('duration', 5);
  component.setAttribute('repeat', 0);
  component.setAttribute('delay', 0);

  // Create draggable/resizable wrapper
  const wrapper = document.createElement('div');
  wrapper.style.position = 'absolute';
  wrapper.style.left = '500px';
  wrapper.style.top = '100px';
  wrapper.style.width = '100px';
  wrapper.style.height = '100px';
  wrapper.style.border = '1px dashed #aaa';
  wrapper.style.background = 'rgba(255,255,255,0.05)';
  wrapper.style.boxSizing = 'border-box';
  wrapper.style.zIndex = 1000;
  wrapper.style.display = 'flex';
  wrapper.style.alignItems = 'center';
  wrapper.style.justifyContent = 'center';
  wrapper.appendChild(component);

  makeDraggableResizable(wrapper);

  particlesContainer.prepend(wrapper);
  createSettingsPanel(particleId, component);
}

document.addEventListener('DOMContentLoaded', customize);
