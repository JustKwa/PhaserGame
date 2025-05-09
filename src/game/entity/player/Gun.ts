import { GameObjects } from 'phaser';
import { Cursor } from '../Cursor';
import { Player } from './Player';
import { AssetKeys } from '../../common/AssetsImport';

export class Gun extends GameObjects.Sprite {
  private _player: Player;
  private cursor: Cursor;
  private _rotationFollowSpeed: number = 40;
  private _knockBackRadian: number;
  private _isCurrentlyFlip: boolean = false;
  private _shootFrames: number = 0;
  private _shootAnimation: Phaser.Animations.Animation;
  private _shootTimer: number = 220;
  public get shootTimer() {
    return this._shootTimer;
  }
  private _lastShootTime: number = 0;
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    player: Player,
    cursor: Cursor,
  ) {
    super(scene, x, y, AssetKeys.gunSpriteSheet);

    this._player = player;
    this.cursor = cursor;
    this.setOrigin(0.1, 0.5);
    this.setScale(0.5);

    this.on(
      Phaser.Animations.Events.ANIMATION_COMPLETE,
      (anim: { key: string }) => {
        if (anim.key === 'Pistol-Shoot') {
          console.timeEnd(`fps ${this._shootAnimation.frameRate}`);
          this.setFrame(0);
        }
      },
    );

    this.on(
      Phaser.Animations.Events.ANIMATION_START,
      (anim: { key: string }) => {
        if (anim.key === 'Pistol-Shoot') {
          console.time(`fps ${this._shootAnimation.frameRate}`);
        }
      },
    );

    scene.input.on(
      Phaser.Input.Events.POINTER_DOWN,
      this._onPlayerPointerDown.bind(this),
    );

    scene.input.on(
      Phaser.Input.Events.POINTER_DOWN_OUTSIDE,
      this._onPlayerPointerDown.bind(this),
    );

    this.anims.createFromAseprite(AssetKeys.gunSpriteSheet);
    this._shootAnimation = this.anims.get('Pistol-Shoot');
    this._shootFrames = this._shootAnimation.frames.length;
    this._shootAnimation.frameRate = this._delayToFrameRate(
      this._shootTimer,
      this._shootFrames,
    );
  }

  update(delta: number): void {
    this.updateRotation(delta);
  }

  private getRadian(cx: number, cy: number, px: number, py: number) {
    return Math.atan2(py - cy, px - cx);
  }

  private getDegree(radian: number) {
    return (radian * 180) / Math.PI;
  }

  private _onPlayerPointerDown() {
    if (Date.now() - this._lastShootTime < this._shootTimer) return;
    this._lastShootTime = Date.now();
    this._knockBackRadian = this.rotation;
    this._player.setPlayerShoot(this._knockBackRadian);
    this.play(this._shootAnimation, true);
  }

  private updateRotation(delta: number) {
    if (!this.cursor) return;
    if (this.anims.isPlaying) return;

    const r = this.getRadian(
      this._player.x,
      this._player.y,
      this.cursor.getWorldPoint().x,
      this.cursor.getWorldPoint().y,
    );
    const t = (delta / 1000) * this._rotationFollowSpeed;
    this.setRotation(Phaser.Math.Angle.RotateTo(this.rotation, r, t));
    const shouldFlip =
      this.getDegree(this.rotation) > 90 || this.getDegree(this.rotation) < -90;
    if (this._isCurrentlyFlip === shouldFlip) return;
    this._isCurrentlyFlip = shouldFlip;
    this.setFlipY(shouldFlip);
    this._player.setPlayerFlipX(shouldFlip);
  }

  private _delayToFrameRate(delayMs: number, frameCount: number): number {
    const fr = (frameCount * 1000) / delayMs;
    return Math.round(fr);
  }

  private _outVector: Phaser.Math.Vector2 = Phaser.Math.Vector2.ZERO;
  public getWorldPosition(): Phaser.Math.Vector2 {
    this._outVector = this.getWorldPoint(this._outVector);
    return this._outVector;
  }

  // public getWorldPoint(): Phaser.Math.Vector2 {
  //   this.get
  //   this._outVector.x = this.getWorldPoint().x;
  //   this._outVector.y = this.getWorldPoint().y;
  //   return this._outVector;
  // }
}
