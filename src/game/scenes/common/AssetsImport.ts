const assetsPath = 'assets/';

export interface ImageAsset {
  name: string;
  path: string;
}

export const AssetsImport = {
  images: {
    background: {
      name: 'background',
      path: 'bg.png',
    },
    logo: {
      name: 'logo',
      path: 'logo.png',
    },
  },
  getPath: (asset: string) => assetsPath + asset,
}

