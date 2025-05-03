import { Scene, Input } from 'phaser';
import { Player } from '../entity/player/Player.ts';
import { BOUND, SCREEN } from '../common/GameConfig';
import { Cursor } from '../entity/Cursor';
// import { Bullet } from '../entity/player/Bullet';

export type PlayerInput = Record<string, Input.Keyboard.Key>;

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  msg_text: Phaser.GameObjects.Text;
  private player: Player;
  private readonly controlScheme = {
    UP: Phaser.Input.Keyboard.KeyCodes.W,
    DOWN: Phaser.Input.Keyboard.KeyCodes.S,
    LEFT: Phaser.Input.Keyboard.KeyCodes.A,
    RIGHT: Phaser.Input.Keyboard.KeyCodes.D,
  };
  private control: PlayerInput;
  private cursor: Cursor;
  // private bullets: Phaser.GameObjects.Group;

  constructor() {
    super('Game');
  }

  create() {
    this.camera = this.cameras.main;
    this.camera.setZoom(2);
    this.camera.setBackgroundColor('a67158');

    this.background = this.add.image(512, 384, 'background');
    this.background.setAlpha(0.5);

    this.physics.world.setBounds(
      BOUND.offset,
      BOUND.offset,
      BOUND.width - BOUND.offset * 2,
      BOUND.height - BOUND.offset * 2,
    );

    this.cursor = new Cursor(this, this.camera);
    this.player = new Player(this, SCREEN.width / 2, SCREEN.height / 2, this.cursor);

    this.camera.startFollow(this.player, false, 1, 1);

    // this.bullets = this.add.group({
    //   classType: Bullet,
    //   runChildUpdate: true,
    //   maxSize: 20,
    // });

    this.control = this.input.keyboard!.addKeys(this.controlScheme) as any;

    this.input.on(
      Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN,
      this._onPointerDown.bind(this),
    );

    this.input.on(
      Phaser.Input.Events.POINTER_MOVE,
      this._onPointerMove.bind(this),
    );
  }

  update(_time: number, delta: number) {
    this.player.update(this.control, delta);
    this.cursor.update();
  }

  private _onPointerDown() {
    this.input.mouse!.requestPointerLock();
  }

  private _onPointerMove(pointer: any) {
    this.cursor.moveWithPointer(pointer);
  }

  // private _fireBullet(
  //   x: number,
  //   y: number,
  //   r: number,
  //   flip: boolean,
  //   playerDirX: number,
  // ) {
  //   const bullet: Bullet = this.bullets.get();
  //   if (bullet) {
  //     bullet.shoot(x, y, r, flip, playerDirX);
  //   }
  // }
}
