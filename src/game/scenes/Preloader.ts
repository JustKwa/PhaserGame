import { Scene } from 'phaser';
import { GAME_SCENES } from '../common/GameScenes';
import { assetManager as asM, AssetKeys as AK } from '../common/AssetsImport';
const { PRELOADER } = GAME_SCENES;

export class Preloader extends Scene {
  constructor() {
    super(PRELOADER);
  }

  init() {
    //  We loaded this image in our Boot Scene, so we can display it here
    this.add.image(512, 384, AK.bg);

    //  A simple progress bar. This is the outline of the bar.
    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

    //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

    //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
    this.load.on('progress', (progress: number) => {
      //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
      bar.width = 4 + 460 * progress;
    });
  }

  preload() {
    //  Load the assets for the game - Replace with your own assets
    this.preloadAssets();
  }

  create() {
    this.initializeAssets();
    this.scene.start(GAME_SCENES.GAME);
  }

  private preloadAssets() {
    const charSpriteSheetPaths = asM.getPaths(AK.charSpriteSheet);
    const gunSpriteSheetPaths = asM.getPaths(AK.gunSpriteSheet);
    const cursorPaths = asM.getPaths(AK.cursor);
    const bulletPaths = asM.getPaths(AK.bullet);
    this.load.aseprite(
      AK.charSpriteSheet,
      charSpriteSheetPaths[0],
      charSpriteSheetPaths[1],
    );
    this.load.on(
      // 'filecomplete-image-charSpriteSheet',
      `filecomplete-image-${AK.charSpriteSheet}`,
      (_key: any, _type: any, _data: any) => {
        this.textures
          .get(AK.charSpriteSheet)
          .setFilter(Phaser.Textures.FilterMode.NEAREST);
      },
    );

    this.load.aseprite(
      AK.gunSpriteSheet,
      gunSpriteSheetPaths[0],
      gunSpriteSheetPaths[1],
    );
    this.load.on(
      `filecomplete-image-${AK.gunSpriteSheet}`,
      (_key: any, _type: any, _data: any) => {
        this.textures
          .get(AK.gunSpriteSheet)
          .setFilter(Phaser.Textures.FilterMode.NEAREST);
      },
    );
    this.load.image(AK.cursor, cursorPaths[0]);
    this.load.image(AK.bullet, bulletPaths[0]);
  }

  private initializeAssets() {
    this.anims.createFromAseprite(AK.charSpriteSheet);
    this.anims.createFromAseprite(AK.gunSpriteSheet);
  }
}
