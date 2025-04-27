import { Scene } from 'phaser';
import { AssetsImport as Assets } from './common/AssetsImport';
const { images } = Assets;

export class Boot extends Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    this.load.image('background', 'assets/bg.png');
  }

  create() {
    this.scene.start('Preloader');
  }
}
