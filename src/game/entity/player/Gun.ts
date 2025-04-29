import { GameObjects } from 'phaser';
import { Player } from './Player';
import { Cursor } from '../Cursor';

export class Gun extends GameObjects.Sprite {
  private _player: Player;
  private _knockBackRadian: number;
  private cursor: Cursor;
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    player: Player,
    cursor: Cursor,
  ) {
    super(scene, x, y, 'gunSpriteSheet');
    scene.add.existing(this);
    this._player = player;

    // this.setScale(0.5);
    this.setOrigin(0, 0.5);
    this.setScale(1.2);

    this.on(
      Phaser.Animations.Events.ANIMATION_COMPLETE,
      (anim: { key: string }) => {
        if (anim.key === 'Pistol-Shoot') {
          this.setFrame(0);
        }
      },
    );
    this.on(
      Phaser.Animations.Events.ANIMATION_START,
      (anim: { key: string }) => {
        if (anim.key === 'Pistol-Shoot') {
          this._player.setPlayerShoot(this._knockBackRadian);
        }
      },
    );

    // scene.input.on(
    // Phaser.Input.Events.POINTER_MOVE,
    //   (pointer: { x: number; y: number }) => {
    //     this.setRotation(
    //       this.getRadian(this._player.x, this._player.y, pointer.x, pointer.y),
    //     );
    //     const isFlip =
    //       this.getDegree(this.rotation) > 90 ||
    //       this.getDegree(this.rotation) < -90;
    //     this.setFlipY(isFlip);
    //     this._player.setPlayerFlipX(isFlip);
    //   },
    // );
    scene.input.on(
      Phaser.Input.Events.POINTER_DOWN,
      this._onPlayerPointerDown.bind(this),
    );
    scene.input.on(
      Phaser.Input.Events.POINTER_DOWN_OUTSIDE,
      this._onPlayerPointerDown.bind(this),
    );
    this.cursor = cursor;
  }

  update(): void {
    this.updatePosition();
    this.updateRotation();
  }

  private updatePosition() {
    this.setPosition(this._player.x, this._player.y);
  }

  private getRadian(cx: number, cy: number, px: number, py: number) {
    return Math.atan2(py - cy, px - cx);
  }

  private getDegree(radian: number) {
    return (radian * 180) / Math.PI;
  }

  private _onPlayerPointerDown() {
    this._knockBackRadian = this.getRadian(
      this._player.x,
      this._player.y,
      this.cursor.x,
      this.cursor.y,
    );
    this.play(
      {
        key: 'Pistol-Shoot',
        frameRate: 24,
      },
      true,
    );
  }

  private updateRotation() {
    this.setRotation(
      this.getRadian(
        this._player.x,
        this._player.y,
        this.cursor.x,
        this.cursor.y,
      ),
    );
    const isFlip =
      this.getDegree(this.rotation) > 90 || this.getDegree(this.rotation) < -90;
    this.setFlipY(isFlip);
    this._player.setPlayerFlipX(isFlip);
  }
}
