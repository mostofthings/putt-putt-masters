import { EnhancedDOMPoint } from '@/engine/enhanced-dom-point';

class Controls {
  isUp = false;
  isDown = false;
  isLeft = false;
  isRight = false;
  isEnter = false;
  isEscape = false;
  isM = false;
  direction: EnhancedDOMPoint;
  isJumpPressed = false;
  private mouseMovement = new EnhancedDOMPoint();
  private onMouseMoveCallback?: (mouseMovement: EnhancedDOMPoint) => void;

  constructor() {
    document.addEventListener('keydown', event =>{ this.toggleKey(event, true); } );
    document.addEventListener('keyup', event => this.toggleKey(event, false));
    const canvas = document.querySelector('#c')!;
    // canvas.addEventListener('click', () => {
    //   canvas.requestPointerLock();
    // });
    document.addEventListener('mousemove', event => {
      this.mouseMovement.x = event.movementX;
      this.mouseMovement.y = event.movementY;
      if (this.onMouseMoveCallback) {
        this.onMouseMoveCallback(this.mouseMovement);
      }
    });
    this.direction = new EnhancedDOMPoint();
  }

  onMouseMove(callback: (mouseMovement: EnhancedDOMPoint) => void) {
    this.onMouseMoveCallback = callback;
  }

  queryController() {
    const gamepad = navigator.getGamepads()[0];
    if (gamepad) {
      this.direction.x = gamepad.axes[0];
      this.direction.z = gamepad.axes[1];

      const deadzone = 0.08;
      if (this.direction.magnitude < deadzone) {
        this.direction.x = 0; this.direction.z = 0;
      }
      this.isJumpPressed = gamepad.buttons[0].pressed;
    }
  }

  private toggleKey(event: KeyboardEvent, isPressed: boolean) {
    switch (event.code) {
      case 'KeyW':
      case 'ArrowUp':
      case 'Numpad8':
        this.isUp = isPressed;
        break;
      case 'KeyS':
      case 'ArrowDown':
      case 'Numpad5':
        this.isDown = isPressed;
        break;
      case 'KeyA':
      case 'ArrowLeft':
      case 'Numpad4':
        this.isLeft = isPressed;
        break;
      case 'KeyD':
      case 'ArrowRight':
      case 'Numpad6':
        this.isRight = isPressed;
        break;
      case 'Enter':
      case 'NumpadEnter':
        this.isEnter = isPressed;
        break;
      case 'Space':
        this.isJumpPressed = isPressed;
        break;
      case 'Escape':
        this.isEscape = isPressed;
        break;
      case 'KeyM':
        this.isM = isPressed;
        break;
    }
    this.direction.x = (Number(this.isLeft) * -1) + Number(this.isRight);
    this.direction.z = (Number(this.isUp) * -1) + Number(this.isDown);
  }
}

export const controls = new Controls();
