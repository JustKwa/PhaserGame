import { Boot } from './scenes/Boot';
import { GameOver } from './scenes/GameOver';
import { Game as MainGame } from './scenes/Game';
import { MainMenu } from './scenes/MainMenu';
import { AUTO, Game } from 'phaser';
import { Preloader } from './scenes/Preloader';
import { SCREEN } from './common/GameConfig';
const { width, height, scale } = SCREEN;

const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: width * scale,
  height: height * scale,
  zoom: 1,
  autoRound: false,
  roundPixels: false,
  pixelArt: true,
  antialias: false,
  parent: 'game-container',
  backgroundColor: '#028af8',
  scene: [Boot, Preloader, MainMenu, MainGame, GameOver],
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: {
        y: 0,
        x: 0,
      },
    },
  },
};

const StartGame = (parent: string) => {
  return new Game({ ...config, parent });
};

export default StartGame;
