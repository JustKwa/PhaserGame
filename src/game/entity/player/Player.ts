import { GameObjects, Math as PhaserMath } from 'phaser';
import { AssetKeys as AK } from '../../common/AssetsImport';
import { Gun } from './Gun';
import { Cursor } from '../Cursor';
import { PlayerInput } from '../../scenes/Game';

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
}

export class Player extends GameObjects.Container {
  private sprite: GameObjects.Sprite;
  private gun: Gun;
  private _spriteOffsetX: number = -3;
  private _spriteOffsetY: number = -5;
  private _playerInputDir: PhaserMath.Vector2 = new PhaserMath.Vector2(0, 0);
  private _speed: number = 80;
  private _acceleration: number = 10;
  private _drag: number = 0.005;
  declare body: Phaser.Physics.Arcade.Body;
  constructor(scene: Phaser.Scene, x: number, y: number, cursor: Cursor) {
    super(scene, x, y);

    scene.add.existing(this);

    this.sprite = new GameObjects.Sprite(scene, this._spriteOffsetX, this._spriteOffsetY, AK.charSpriteSheet);
    this.gun = new Gun(scene, this._spriteOffsetX, this._spriteOffsetY, this, cursor);
    this.add([this.sprite, this.gun])

    this.setSize(12, 8);
    scene.physics.add.existing(this);

    this.body.setCollideWorldBounds(true);
    this.body.setDrag(this._drag);
    this.body.setMaxVelocity(this._speed);
    this.body.setDamping(true);
    this.sprite.play(Anims.run);
  }

  update(input: PlayerInput, delta: number) {
    this.handleInput(input);
    this._move();
    this.gun.update(delta);
  }

  private handleInput(keys: PlayerInput) {
    if (!keys) return;
    this._playerInputDir.reset();

    if (keys.LEFT.isDown) {
      this._playerInputDir.x = -1;
    } else if (keys.RIGHT.isDown) {
      this._playerInputDir.x = 1;
    }

    if (keys.UP.isDown) {
      this._playerInputDir.y = -1;
    } else if (keys.DOWN.isDown) {
      this._playerInputDir.y = 1;
    }
    this._playerInputDir.normalize();
  }
  private _move() {
    if (this._playerInputDir.x !== 0 && this._playerInputDir.y !== 0) {
      this.body?.setMaxVelocity(Math.abs(this._playerInputDir.x * this._speed));
    } else {
      this.body!.setMaxVelocity(this._speed);
    }
    this.body!.setAcceleration(
      this._playerInputDir.x * this._acceleration * this._speed,
      this._playerInputDir.y * this._acceleration * this._speed,
    );
  }

}
