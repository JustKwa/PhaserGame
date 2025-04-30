import { GameObjects } from 'phaser';
import { BOUND } from '../../common/GameConfig';

export class Bullet extends GameObjects.Sprite {
  private speed: number;
  private _bound: Phaser.Geom.Rectangle;
  private _delayTimer: number = 0;
  private _playerDirX: number = 0;
  private _squeezeAnimationConfig: Phaser.Types.Tweens.TweenBuilderConfig;
  private _squeezeAnimationTween: Phaser.Tweens.Tween;
  private readonly OFFSET_X = 15;
  private readonly OFFSET_Y = -2;
  private readonly DELAY = 120;
  private readonly BULLET_DISTANCE = 340;
  private readonly BULLET_TIME = 0.7;
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'bullet');
    this.setOrigin(0.1, 0.5);
    this.speed = Phaser.Math.GetSpeed(this.BULLET_DISTANCE, this.BULLET_TIME);
    this._bound = scene.physics.world.bounds;
    this.setDepth(1);
    this._squeezeAnimationConfig = {
      targets: this,
      scaleX: 2,
      scaleY: 1,
      delay: this._isShootingSameDirection(this._playerDirX) ? 0 : 140,
      onStart: () => {
        this.setScale(1, 0.8);
        this.setVisible(true);
      },
      duration: 2000,
      repeat: 0,
      ease: 'Linear',
      persist: true,
    };
  }
  shoot(x: number, y: number, r: number, flip: boolean, playerDirX: number) {
    const yAdjust = flip ? -1 : 1;
    const offset = this._offsetToRotation(
      this.OFFSET_X,
      this.OFFSET_Y * yAdjust,
      r,
    );
    this._playerDirX = playerDirX;
    if (!this._squeezeAnimationTween) {
      this._squeezeAnimationTween = this.scene.tweens.add(
        this._squeezeAnimationConfig,
      );
    }
    this._squeezeAnimationTween.restart();
    this.setPosition(x + offset.x, y + offset.y);
    this.setRotation(r);
    this.setActive(true);
    this._delayTimer = 0;
  }
  update(_time: number, delta: number) {
    this._delayTimer += delta;
    if (this._delayTimer < this.DELAY) return;

    this.x += delta * this.speed * Math.cos(this.rotation);
    this.y += delta * this.speed * Math.sin(this.rotation);

    if (
      this.x < this._bound.left - BOUND.offset ||
      this.x > this._bound.right + BOUND.offset ||
      this.y < this._bound.top - BOUND.offset ||
      this.y > this._bound.bottom + BOUND.offset
    ) {
      this.setActive(false);
      this.setVisible(false);
    }
  }
  private _offsetToRotation(
    offsetX: number,
    offsetY: number,
    rotation: number,
  ): { x: number; y: number } {
    const cos = Math.cos(rotation);
    const sin = Math.sin(rotation);

    return {
      x: offsetX * cos - offsetY * sin,
      y: offsetX * sin + offsetY * cos,
    };
  }
  private _isShootingSameDirection(playerDirX: number) {
    const isShootingRight = Math.cos(this.rotation) > 0;
    const isPlayerRight = playerDirX > 0;
    return isShootingRight === isPlayerRight;
  }
}
