import { GameObjects, Math as PhaserMath } from 'phaser';
import { AssetKeys as AK } from '../../common/AssetsImport';
import { Gun } from './Gun';
import { Cursor } from '../Cursor';
import { PlayerInput } from '../../scenes/Game';
import { Bullet } from './Bullet';

const Anims = {
  idle: {
    key: 'Char-Idle-Empty',
    repeat: -1,
    frameRate: 8,
  },
  run: {
    key: 'Char-Run-Empty',
    repeat: -1,
    frameRate: 12,
  },
  shoot: {
    key: 'charIdle-Shoot-Gun',
    repeat: 0,
    frameRate: 12,
  },
};

enum State {
  Idle,
  Move,
  Shoot,
}

export class Player extends GameObjects.Container {
  private sprite: GameObjects.Sprite;
  private gun: Gun;
  private _spriteOffsetX: number = -3;
  private _spriteOffsetY: number = -5;
  private _playerInputDir: PhaserMath.Vector2 = new PhaserMath.Vector2(0, 0);
  private _speed: number = 80;
  private _acceleration: number = 10;
  private _drag: number = 0.005;
  declare body: Phaser.Physics.Arcade.Body;
  private _state: State = State.Idle;
  private _knockBack: {
    delay: number;
    duration: number;
    strength: number;
  } = {
    delay: 200,
    duration: 200,
    strength: 180,
  };
  private _knockBackTimer: number;
  private _knockBackDir: PhaserMath.Vector2 = new PhaserMath.Vector2(0, 0);
  private _fireCallback: Function;
  private _knockBackTweenConfig: Phaser.Types.Tweens.TweenBuilderConfig;
  private _knockBackTween: Phaser.Tweens.Tween;
  private _gunKnockBackTweenConfig: Phaser.Types.Tweens.TweenBuilderConfig;
  private _gunKnockBackTween: Phaser.Tweens.Tween;
  private _gunKnockBack: {
    delay: number;
    duration: number;
  } = {
    delay: 200,
    duration: 250,
  };
  private _camera: Phaser.Cameras.Scene2D.Camera;
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    cursor: Cursor,
    fireCallback: Function,
    camera: Phaser.Cameras.Scene2D.Camera,
  ) {
    super(scene, x, y);

    scene.add.existing(this);

    this.sprite = new GameObjects.Sprite(
      scene,
      this._spriteOffsetX,
      this._spriteOffsetY,
      AK.charSpriteSheet,
    );
    this.sprite.anims.createFromAseprite(AK.charSpriteSheet);
    this.gun = new Gun(
      scene,
      this._spriteOffsetX,
      this._spriteOffsetY,
      this,
      cursor,
    );
    Bullet.Gun = this.gun;
    this.add([this.sprite, this.gun]);

    this.setSize(12, 8);
    this.setDepth(1);
    scene.physics.add.existing(this);

    this.body.setCollideWorldBounds(true);
    this.body.setDrag(this._drag);
    this.body.setMaxVelocity(this._speed);
    this.body.setDamping(true);
    this.sprite.play(Anims.run);

    this._fireCallback = fireCallback;

    this._knockBackTweenConfig = {
      targets: this.sprite,
      scaleX: 0.9,
      scaleY: 1.2,
      delay: this._knockBack.delay,
      duration: this._knockBack.duration,
      ease: PhaserMath.Easing.Circular.Out,
      onStart: () => {
        this.sprite.setScale(1);
      },
      onComplete: () => {
        this.sprite.setScale(1);
      },
      yoyo: true,
      persist: true,
      paused: true,
      hold: 0,
      completeDelay: 0,
    };
    this._knockBackTween = this.scene.tweens.add(this._knockBackTweenConfig);

    this._gunKnockBackTweenConfig = {
      targets: this.gun,
      duration: this._gunKnockBack.duration,
      delay: this._gunKnockBack.delay,
      y: '+=5',
      ease: PhaserMath.Easing.Circular.Out,
      yoyo: true,
      persist: true,
      paused: true,
      hold: 0,
      completeDelay: 0,
    };
    this._gunKnockBackTween = this.scene.tweens.add(
      this._gunKnockBackTweenConfig,
    );
    this._camera = camera;
    camera.startFollow(this, false, 1, 1);
  }

  update(input: PlayerInput, delta: number) {
    this.handleInput(input);
    this.gun.update(delta);
    this._handleState(delta);
  }

  private handleInput(keys: PlayerInput) {
    if (!keys) return;
    if (this._state === State.Shoot) return;

    this._playerInputDir.reset();

    if (keys.LEFT.isDown) {
      this._playerInputDir.x = -1;
    } else if (keys.RIGHT.isDown) {
      this._playerInputDir.x = 1;
    }

    if (keys.UP.isDown) {
      this._playerInputDir.y = -1;
    } else if (keys.DOWN.isDown) {
      this._playerInputDir.y = 1;
    }
    this._playerInputDir.normalize();

    this._setState(
      this._playerInputDir.x === 0 && this._playerInputDir.y === 0
        ? State.Idle
        : State.Move,
    );
  }

  public setPlayerFlipX(flip: boolean) {
    this.sprite.setFlipX(flip);
    this._setSpriteOffset(flip);
  }

  private _setState(state: State, data?: any) {
    this._state = state;
    switch (state) {
      case State.Idle:
        this.sprite.play(Anims.idle, true);
        this.body.setAcceleration(0);
        break;
      case State.Move:
        this.sprite.play(Anims.run, true);
        // this._camera.setFollowOffset(
        //   PhaserMath.Linear(
        //     this._camera.followOffset.x,
        //     this._playerInputDir.x * 10,
        //     0.1,
        //   ),
        //   PhaserMath.Linear(
        //     this._camera.followOffset.y,
        //     this._playerInputDir.y * 10,
        //     0.1,
        //   ),
        // );
        break;
      case State.Shoot:
        this.sprite.play(Anims.shoot, true);
        this._knockBackTimer = 0;
        this._fireCallback(
          this.x,
          this.y,
          data,
          this.sprite.flipX,
          this._playerInputDir.x,
        );
        const playerTween = this._knockBackTween;
        if (playerTween.isPlaying()) {
          playerTween.seek(this._knockBack.delay / 2);
        } else {
          playerTween.play();
        }

        const tween = this._gunKnockBackTween;
        if (tween.isPlaying()) {
          tween.seek(this._gunKnockBack.delay / 2);
        } else {
          tween.play();
        }

        break;
    }
  }

  private _handleState(delta: number) {
    switch (this._state) {
      case State.Idle:
        this._idle();
        break;
      case State.Move:
        this._move();
        break;
      case State.Shoot:
        this._shoot(delta);
        break;
    }
  }

  private _idle() {}

  private _move() {
    if (this._playerInputDir.x !== 0 && this._playerInputDir.y !== 0) {
      this.body?.setMaxVelocity(Math.abs(this._playerInputDir.x * this._speed));
    } else {
      this.body!.setMaxVelocity(this._speed);
    }

    this.body!.setAcceleration(
      this._playerInputDir.x * this._acceleration * this._speed,
      this._playerInputDir.y * this._acceleration * this._speed,
    );

    this._camera.setFollowOffset(
      PhaserMath.Linear(
        this._camera.followOffset.x,
        this._playerInputDir.x * 20,
        0.015,
      ),
      PhaserMath.Linear(
        this._camera.followOffset.y,
        this._playerInputDir.y * 20,
        0.015,
      ),
    );
  }

  private _shoot(delta: number) {
    this._knockBackTimer += delta;
    if (this._knockBackTimer < this.gun.shootTimer) return;
    this.body.setMaxVelocity(this._knockBack.strength);
    this.body.setVelocity(
      -this._knockBackDir.x * this._knockBack.strength,
      -this._knockBackDir.y * this._knockBack.strength,
    );
    if (this._knockBackTimer < this._knockBack.duration) return;
    this._state = State.Idle;
  }

  private _setSpriteOffset(flip: boolean) {
    if (flip) {
      this.sprite.setPosition(2, this._spriteOffsetY);
      if (this._gunKnockBackTween && this._gunKnockBackTween.isPlaying())
        return;
      this.gun.setPosition(2, this._spriteOffsetY);
      return;
    }
    this.sprite.setPosition(this._spriteOffsetX, this._spriteOffsetY);
    if (this._gunKnockBackTween && this._gunKnockBackTween.isPlaying()) return;
    this.gun.setPosition(this._spriteOffsetX, this._spriteOffsetY);
  }

  public setPlayerShoot(r: number) {
    const snappedR = PhaserMath.Snap.To(r, PhaserMath.PI2 / 8);
    this._knockBackDir.setToPolar(snappedR);
    this._setState(State.Shoot, r);
  }
}
