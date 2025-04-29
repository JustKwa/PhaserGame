import { Physics, Math as PhaserMath } from 'phaser';
import { PlayerInput } from '../../scenes/Game';
import { Gun } from './Gun';

const Anims = {
  idle: {
    key: 'Char-Idle-Empty',
    repeat: -1,
    frameRate: 8,
  },
  run: {
    key: 'Char-Run-Empty',
    repeat: -1,
    frameRate: 12,
  },
};

export class Player extends Physics.Arcade.Sprite {
  private readonly speed: number = 80;
  private readonly acceleration: number = 10;
  private readonly drag: number = 0.005;
  private _gun: Gun;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'charSpriteSheet');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(1);
    this.play(Anims.idle);
    this.setBodySize(12, 8);
    this.setOffset(this.width / 2 - 5, this.height / 2);
    this.setCollideWorldBounds(true);
    this.setDamping(true);
    this.setDrag(this.drag, this.drag);
    this.setMaxVelocity(this.speed);

    this._gun = new Gun(scene, this.x, this.y, this);
  }

  update(keys: PlayerInput) {
    this.handleMovement(keys);
    this._gun.update();
  }

  private setAnims(dir: PhaserMath.Vector2) {
    if (dir.x === 0 && dir.y === 0) {
      this.play(Anims.idle, true);
      return;
    }
    this.play(Anims.run, true);
  }

  private handleMovement(keys: PlayerInput) {
    const dir = new PhaserMath.Vector2(0, 0);

    if (keys.LEFT.isDown) {
      dir.x = -1;
    } else if (keys.RIGHT.isDown) {
      dir.x = 1;
    }

    if (keys.UP.isDown) {
      dir.y = -1;
    } else if (keys.DOWN.isDown) {
      dir.y = 1;
    }

    dir.normalize();
    if (dir.x !== 0 && dir.y !== 0) {
      this.setMaxVelocity(Math.abs(dir.x * this.speed));
    } else {
      this.setMaxVelocity(this.speed);
    }

    this.setAnims(dir);
    this.setAcceleration(
      dir.x * this.acceleration * this.speed,
      dir.y * this.acceleration * this.speed,
    );
  }

  private setOffetOnFlip(flip: boolean) {
    if (flip) {
      this.setOffset(this.width / 2 - 8, this.height / 2);
      return;
    }
    this.setOffset(this.width / 2 - 5, this.height / 2);
  }

  public setPlayerFlipX(flip: boolean) {
    this.setFlipX(flip);
    this.setOffetOnFlip(flip);
  }
}
