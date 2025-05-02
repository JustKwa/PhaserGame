export enum AssetKeys {
  charSpriteSheet = 'charSpriteSheet',
  gunSpriteSheet = 'gunSpriteSheet',
  bg = 'bg',
  logo = 'logo',
  cursor = 'cursor',
  bullet = 'bullet',
}

const AssetPaths: Record<AssetKeys, string[]> = {
  charSpriteSheet: [
    'assets/CharSpriteSheet.png',
    'assets/CharSpriteSheet.json',
  ],
  gunSpriteSheet: ['assets/GunSpriteSheet.webp', 'assets/GunSpriteSheet.json'],
  bg: ['assets/bg.png'],
  logo: ['assets/logo.png'],
  cursor: ['assets/Cursor.webp'],
  bullet: ['assets/Bullet.webp'],
};

class AssetManager {
  constructor() {}
  public getPaths(key: AssetKeys): string[] {
    return AssetPaths[key];
  }
}

export const assetManager = new AssetManager();
