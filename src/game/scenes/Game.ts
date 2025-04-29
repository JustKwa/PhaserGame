import { Scene, Input } from 'phaser';
import { Player } from '../entity/Player';
import { SCREEN } from '../common/GameConfig';

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

  constructor() {
    super('Game');
  }

  create() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor('a67158');

    this.background = this.add.image(512, 384, 'background');
    this.background.setAlpha(0.5);

    this.physics.world.setBounds(10, 10, SCREEN.width - 20, SCREEN.height - 20);

    this.player = new Player(this, SCREEN.width / 2, SCREEN.height / 2);

    this.control = this.input.keyboard!.addKeys(this.controlScheme) as any;
    console.log(this.control);
  }

  update() {
    this.player.update(this.control);
  }
}
