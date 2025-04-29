import { GameObjects } from 'phaser';
import { AssetKeys } from '../common/AssetsImport';

export class Cursor extends GameObjects.Sprite {
  private bound: Phaser.Geom.Rectangle;
  private readonly offset: number = 20;
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, AssetKeys.cursor);
    this.setToTop();
    scene.add.existing(this);
    this.bound = scene.physics.world.bounds;
    this.setDepth(1000);
  }

  public moveWithPointer(pointer: any) {
    this.x += pointer.movementX;
    this.y += pointer.movementY;
    this.x = Phaser.Math.Clamp(
      this.x,
      this.bound.left - this.offset,
      this.bound.right + this.offset,
    );
    this.y = Phaser.Math.Clamp(
      this.y,
      this.bound.top - this.offset,
      this.bound.bottom + this.offset,
    );
  }
}
