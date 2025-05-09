import { GameObjects, Math as PhaserMath } from 'phaser';
import { AssetKeys } from '../common/AssetsImport';
import { SCREEN } from '../common/GameConfig';

export class Cursor extends GameObjects.Sprite {
  private _camera: Phaser.Cameras.Scene2D.Camera;
  private _outVector: Phaser.Math.Vector2 = Phaser.Math.Vector2.ZERO;
  private _halfWidth: number;
  private _halfHeight: number;
  private bound_left: number;
  private bound_right: number;
  private bound_top: number;
  private bound_bottom: number;
  constructor(scene: Phaser.Scene, camera: Phaser.Cameras.Scene2D.Camera) {
    const centerX = scene.scale.width / 2;
    const centerY = scene.scale.height / 2;
    super(scene, centerX, centerY, AssetKeys.cursor);
    scene.add.existing(this);

    this._camera = camera;
    this.setScrollFactor(0);
    this.setDepth(1000);
    this._setDimensions();

    const halfViewWidth = SCREEN.width / 2;
    this.bound_left = centerX - halfViewWidth;
    this.bound_right = centerX + halfViewWidth;

    const halfViewHeight = SCREEN.height / 2;
    this.bound_top = centerY - halfViewHeight;
    this.bound_bottom = centerY + halfViewHeight;

    this._setDimensions();
  }

  public moveWithPointer(pointer: any) {
    this.x += pointer.movementX;
    this.y += pointer.movementY;
    this.x = PhaserMath.Clamp(
      this.x,
      this.bound_left + this._halfWidth,
      this.bound_right - this._halfWidth,
    );
    this.y = PhaserMath.Clamp(
      this.y,
      this.bound_top + this._halfHeight,
      this.bound_bottom - this._halfHeight,
    );
  }

  public getWorldPoint(): Phaser.Math.Vector2 {
    this._outVector.x = this.x + this._camera.scrollX;
    this._outVector.y = this.y + this._camera.scrollY;
    return this._outVector;
  }

  private _setDimensions() {
    if (this.width === 0 || this.height === 0) {
      console.error('Cursor width or height is 0');
      return;
    }
    this._halfWidth = this.width / 2;
    this._halfHeight = this.height / 2;
  }
}
