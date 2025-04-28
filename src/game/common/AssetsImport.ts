export enum AssetKeys {
  charSpriteSheet = 'charSpriteSheet',
  bg = 'bg',
  logo = 'logo',
}

const AssetPaths: Record<AssetKeys, string[]> = {
  charSpriteSheet: [
    'assets/CharSpriteSheet.png',
    'assets/CharSpriteSheet.json',
  ],
  bg: ['assets/bg.png'],
  logo: ['assets/logo.png'],
};

class AssetManager {
  constructor() {}
  public getPaths(key: AssetKeys): string[] {
    return AssetPaths[key];
  }
}

export const assetManager = new AssetManager();
