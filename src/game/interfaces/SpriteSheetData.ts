export type SpriteSheet = {
  frames: FrameData[];
  meta: MetaData;
};

export type FrameData = {
  filename: string;
  frame: { x: number; y: number; w: number; h: number };
  rotated: boolean;
  trimmed: boolean;
  spriteSourceSize: { x: number; y: number; w: number; h: number };
  sourceSize: { w: number; h: number };
  duration: number;
};

export type FrameTag = {
  name: string;
  from: number;
  to: number;
  direction: "forward" | "backward" | "pingpong";
  color: string;
};

export type MetaData = {
  image: string;
  format: string;
  size: { w: number; h: number };
  scale: string;
  frameTags: FrameTag[];
};
