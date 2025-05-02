import { GameObjects } from 'phaser';
import { AssetKeys } from '../common/AssetsImport';
import { SCREEN } from '../common/GameConfig';

export class Cursor extends GameObjects.Sprite {
  private _camera: Phaser.Cameras.Scene2D.Camera;
  private _outVector: Phaser.Math.Vector2 = Phaser.Math.Vector2.ZERO;
  constructor(scene: Phaser.Scene, camera: Phaser.Cameras.Scene2D.Camera) {
    super(scene, SCREEN.width / 2, SCREEN.height / 2, AssetKeys.cursor);
    this.setScrollFactor(0);
    this.setDepth(1000);
    this._camera = camera;
    scene.add.existing(this);
  }

  public moveWithPointer(pointer: any) {
    console.log(this.getWorldPoint().x, this.getWorldPoint().y);
    this.x += pointer.movementX;
    this.y += pointer.movementY;
    this.x = Phaser.Math.Clamp(this.x, 0, SCREEN.width);
    this.y = Phaser.Math.Clamp(this.y, 0, SCREEN.height);
  }
  public getWorldPoint(): Phaser.Math.Vector2 {
    this._outVector.x = this.x + this._camera.scrollX;
    this._outVector.y = this.y + this._camera.scrollY;
    return this._outVector;
  }
}
