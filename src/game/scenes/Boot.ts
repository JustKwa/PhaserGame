import { Scene } from 'phaser';
import { GAME_SCENES } from '../common/GameScenes';
import { assetManager as asM, AssetKeys as AK } from '../common/AssetsImport';
const { BOOT, PRELOADER } = GAME_SCENES;

export class Boot extends Scene {
  constructor() {
    super(BOOT);
  }

  preload() {
    this.load.image(AK.bg, asM.getPaths(AK.bg)[0]);
  }

  create() {
    this.scene.start(PRELOADER);
  }
}
