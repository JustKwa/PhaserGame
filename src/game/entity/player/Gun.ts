import { GameObjects } from 'phaser';
import { Cursor } from '../Cursor';
import { Player } from './Player';

export class Gun extends GameObjects.Sprite {
  private _player: Player;
  private cursor: Cursor;
  private _rotationFollowSpeed: number = 10;
  // private _knockBackRadian: number;
  // private _justShoot: boolean = false;
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    player: Player,
    cursor: Cursor,
  ) {
    super(scene, x, y, 'gunSpriteSheet');

    this._player = player;
    this.cursor = cursor;
    this.setOrigin(0.1, 0.5);
    // this.setScale(1);
    // this.setDepth(2);

    // this.on(
    //   Phaser.Animations.Events.ANIMATION_COMPLETE,
    //   (anim: { key: string }) => {
    //     if (anim.key === 'Pistol-Shoot') {
    //       this.setFrame(0);
    //       this._justShoot = false;
    //     }
    //   },
    // );

    // this.on(
    //   Phaser.Animations.Events.ANIMATION_START,
    //   (anim: { key: string }) => {
    //     if (anim.key === 'Pistol-Shoot') {
    //       this._player.setPlayerShoot(this._knockBackRadian);
    //       this._justShoot = true;
    //     }
    //   },
    // );

    // scene.input.on(
    //   Phaser.Input.Events.POINTER_DOWN,
    //   this._onPlayerPointerDown.bind(this),
    // );
    //
    // scene.input.on(
    //   Phaser.Input.Events.POINTER_DOWN_OUTSIDE,
    //   this._onPlayerPointerDown.bind(this),
    // );
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

  // private _onPlayerPointerDown() {
  // this._knockBackRadian = this.rotation;
  //   this.play(
  //     {
  //       key: 'Pistol-Shoot',
  //       frameRate: 24,
  //     },
  //     true,
  //   );
  // }

  private updateRotation(delta: number) {
    if (!this.cursor) return;
    // if (this._justShoot) return;
    const r = this.getRadian(
      this._player.x,
      this._player.y,
      this.cursor.getWorldPoint().x,
      this.cursor.getWorldPoint().y,
    );
    const t = (delta / 1000) * this._rotationFollowSpeed;
    this.setRotation(Phaser.Math.Angle.RotateTo(this.rotation, r, t));
    const isFlip =
      this.getDegree(this.rotation) > 90 || this.getDegree(this.rotation) < -90;
    this.setFlipY(isFlip);
    // this._player.setPlayerFlipX(isFlip);
  }
}
