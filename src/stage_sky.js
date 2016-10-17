﻿
/* 空ステージ */
//app.js

var size;
var mylabel;
var gameLayer;
var background0;
var background1;
var background2;
var scrollSpeed = 2;
var player;
var gameGravity = -0.05;
var gameThrust = 0.15;
var life = 3;
var score = 0;
var lifeScore = 0;
var LIFE_UP_SCORE = 100;
var goalStop = false;
var itemPlusArray;
var itemMinusArray;
itemPlusArray = new Array(res.item_plus00_png, res.item_plus01_png);
itemMinusArray = new Array(res.item_minus00_png, res.item_minus01_png);
var animflg;
var playerArray;
playerArray = new Array(res.player_sky01_png, res.player_sky02_png, res.player_sky03_png);
var State = {
 GAME : 0,
 GOAL: 1
};
var nowstate = State.GAME;

var stageSkyScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        life = 3;
        score = 0;
        gameLayer = new gameSky();
        gameLayer.init();
        this.addChild(gameLayer);
        
        //音楽再生エンジン
        var audioEngine = cc.audioEngine;
        //bgm再生
        if (!audioEngine.isMusicPlaying()) {
          audioEngine.playMusic(res.stagesky_bgm_mp3, true);
        }
    }
});

var gameSky = cc.Layer.extend({
    init:function () {
        this._super();
        size = cc.director.getWinSize();
               
       // タップイベントリスナーを登録する
                cc.eventManager.addListener({
                    event: cc.EventListener.TOUCH_ONE_BY_ONE,
                    swallowTouches: true,
                    onTouchBegan: this.onTouchBegan,
                    onTouchMoved: this.onTouchMoved,
                    onTouchEnded: this.onTouchEnded
                }, this);
	

        //スクロールする背景スプライトをインスタンス　スクロール速度:scrollSpeed
        background0 = new ScrollingBG();
        this.addChild(background0);
        background1 = new ScrollingBG();
        background1.setPos(size.width+size.width/2, size.height/2);
        this.addChild(background1);
        background2 = new ScrollingBG();
        background2.setPos(size.width*2+size.width/2, size.height/2);
        this.addChild(background2);
        
        player = new Player();
        player.setScale(0.1);
        this.addChild(player);

        // 残機表示
        lifeText = cc.LabelTTF.create("LIFE : " +life ,"Arial","50",cc.TEXT_ALIGNMENT_CENTER);
        this.addChild(lifeText);
        lifeText.setPosition(100,850);
        lifeText.setColor(cc.color(0, 0, 0, 255));
        this.reorderChild(lifeText, 10);

        //スコア表示
        scoreText = cc.LabelTTF.create("SCORE : " +score ,"Arial","50",cc.TEXT_ALIGNMENT_CENTER);
        this.addChild(scoreText);
        scoreText.setPosition(450,850);
        scoreText.setColor(cc.color(0, 0, 0, 255));
        this.reorderChild(scoreText, 10);

        //scheduleUpdate関数は、描画の都度、update関数を呼び出す
        this.scheduleUpdate();

        //アイテム生成
        this.schedule(this.addItemPlus, 1.5);
        this.schedule(this.addItemMinus, 3);
        this.schedule(this.addSponserBoard, 10);
        this.scheduleOnce(this.addGoal, 15);
    },
    update:function(dt){
      //background・その他のscrollメソッドを呼び出す
        switch(nowstate) {
        case State.GAME:
        backgroundUpdate();
        if(goalStop) {
          nowstate = State.GOAL;
          this.unschedule(this.addItemPlus);
          this.unschedule(this.addItemMinus);
        }
        break;
        case State.GOAL:
        break;
        default:
        break;
        }
        
        player.updateY();
    },
    //プラスアイテムを追加
    addItemPlus: function(event){
      var itemPlus = new ItemPlus();
      itemPlus.setScale(0.2);
      this.addChild(itemPlus);
    },
    //マイナスアイテムを追加
    addItemMinus: function(event){
      var itemMinus = new ItemMinus();
      itemMinus.setScale(0.2);
      this.addChild(itemMinus);
    },
    //スポンサー様看板
    addSponserBoard: function(event) {
      var ground = new Ground();
      ground.setScale(0.5);
      this.addChild(ground);
      var sponserboard = new SponserBoard();
      sponserboard.setScale(0.15);
      this.addChild(sponserboard);
      var sponserlogo = new SponserLogo();
      sponserlogo.setScale(0.2);
      //sponserlogo.setPosition(sponserboard.getPosition().x, sponserlogo.getPosition().y);
      this.addChild(sponserlogo);
    },
    //ゴール
    addGoal: function() {
      var goalground = new GoalGround();
      goalground.setScale(0.7);
      this.addChild(goalground);
      var goalflag = new GoalFlag();
      goalflag.setScale(0.2);
      this.addChild(goalflag);
      
      //スポンサー様看板の停止
      this.unschedule(this.addSponserBoard);
    },
    //オブジェクトを削除
    removeObject: function(object) {
      this.removeChild(object);
    },
    //タッチ
    onTouchBegan: function(touch, event) {
	player.engineOn = true;
        return true;
      },
      onTouchMoved: function(touch, event) {},
      onTouchEnded: function(touch, event) {
        player.engineOn = false;
      },
    
});

//スクロール移動する背景クラス
var ScrollingBG = cc.Sprite.extend({
    //ctorはコンストラクタ　クラスがインスタンスされたときに必ず実行される
    ctor:function() {
        this._super();
        this.initWithFile(res.background_sky_png);
        //背景画像の描画開始位置
      this.setPosition(size.width/2,size.height /2 );
    },
    //onEnterメソッドはスプライト描画の際に必ず呼ばれる
    onEnter:function() {
      
    },
    scroll:function(){
      //座標を更新する
        this.setPosition(this.getPosition().x-scrollSpeed,this.getPosition().y);
        
    },
    setPos:function(x, y){
      //座標を更新する
        this.setPosition(x, y);
    },
});

//重力（仮）で落下する　プレイヤー　
var Player = cc.Sprite.extend({
  ctor: function() {
    animflg = 0;
    this._super();
    this.initWithFile(playerArray[0]);
    this.ySpeed = 0; //プレイヤーの垂直速度

    this.engineOn = false; //カスタム属性追加　プレイヤーのジャンプON OFF
    this.invulnerability = 0; //無敵モード時間　初期値0
  },
  onEnter: function() {
    this.setPosition(60, size.height * 0.5);
  },
  updateY: function() {
    if(this.engineOn){
      animflg++;
      if(animflg >= 15) {
      animflg = 0;
      }
      
      this.initWithFile(playerArray[Math.floor(animflg/5)]);
      this.ySpeed += gameThrust;
      
    }
    //無敵モード中の視覚効果
    if (this.invulnerability > 0) {
      this.invulnerability--;
      this.setOpacity(255 - this.getOpacity());
    }

    this.setPosition(this.getPosition().x, this.getPosition().y + this.ySpeed);
    this.ySpeed += gameGravity;

    //プレイヤーが画面外にでたら、リスタートさせる
     if (this.getPosition().y < 0 || this.getPosition().y > 1500) {
       
       restartGame();
     }
  }
});

//プラスアイテムクラス
var ItemPlus = cc.Sprite.extend({

  ctor: function() {
    this._super();
    var num = Math.floor(Math.random() * itemPlusArray.length);
    this.initWithFile(itemPlusArray[num]);
  },
  onEnter: function() {
    this._super();
    this.setPosition(1200, Math.random() * 900);
    var moveAction = cc.MoveTo.create(5, new cc.Point(-100, Math.random() * 900));
    this.runAction(moveAction);
    this.scheduleUpdate();
  },
  update: function(dt) {
    //アイテムとの衝突を判定する処理
    var playerBoundingBox = player.getBoundingBox();
    var itemBoundingBox = this.getBoundingBox();
		//rectIntersectsRectは２つの矩形が交わっているかチェックする
    if (cc.rectIntersectsRect(playerBoundingBox, itemBoundingBox) ) {
      gameLayer.removeObject(this);//アイテムを削除する
      //ボリュームを上げる
      cc.audioEngine.setEffectsVolume(cc.audioEngine.getEffectsVolume() + 0.3);
      //効果音を再生する
      cc.audioEngine.playEffect(res.plus_se_mp3);
      
      //スコア追加処理
      score += 10;
      scoreText.setString("SCORE : " + score);
      lifeScore += 10;
      if(lifeScore >= LIFE_UP_SCORE) {
        lifeScore -= LIFE_UP_SCORE;
        if(life < 10) {
          life++;
          lifeText.setString("LIFE : " + life);
        }
      }
    }
		//画面の外にでたアイテムを消去する処理
    if (this.getPosition().x < 50) {
      gameLayer.removeObject(this)
    }
  }
});

//マイナスアイテムクラス
var ItemMinus = cc.Sprite.extend({
  ctor: function() {
    this._super();
    var num = Math.floor(Math.random() * itemMinusArray.length);
    this.initWithFile(itemMinusArray[num]);
  },
  onEnter: function() {
    this._super();
    this.setPosition(1200, Math.random() * 900);
    var moveAction = cc.MoveTo.create(5, new cc.Point(-100, Math.random() * 900));
    this.runAction(moveAction);
    this.scheduleUpdate();
  },
  update: function(dt) {
    //アイテムとの衝突を判定する処理
    var playerBoundingBox = player.getBoundingBox();
    var itemBoundingBox = this.getBoundingBox();
    //rectIntersectsRectは２つの矩形が交わっているかチェックする
    if (cc.rectIntersectsRect(playerBoundingBox, itemBoundingBox) ) {
      //アイテムを削除する
      gameLayer.removeObject(this);
      //ダメージ
      damage();
      
    }
    if (this.getPosition().x < 50) {
      gameLayer.removeObject(this)
    }
  }
});



//背景管理
function backgroundUpdate() {
	background0.scroll();
        background1.scroll();
        background2.scroll();
        //画面の端に到達したら反対側の座標にする
        if(background0.getPosition().x < -size.width/2){
            background0.setPosition(background2.getPosition().x+size.width, size.height/2);
        }
        if(background1.getPosition().x < -size.width/2){
            background1.setPosition(background0.getPosition().x+size.width, size.height/2);
        }
        if(background2.getPosition().x < -size.width/2){
            background2.setPosition(background1.getPosition().x+size.width, size.height/2);
        }
}

//足場クラス
var Ground = cc.Sprite.extend({
  ctor: function() {
    this._super();
    this.initWithFile(res.ground_sky_png);
    this.setPosition(1200, 50);
  },
  onEnter: function() {
    this._super();
    //var moveAction = cc.MoveTo.create(5, new cc.Point(-100, this.getPosition().y));
    //this.runAction(moveAction);
    this.scheduleUpdate();
  },
  update: function(dt) {
      //座標を更新する
        this.setPosition(this.getPosition().x-scrollSpeed,this.getPosition().y);
      //画面の外にでたアイテムを消去する処理
      if (this.getPosition().x < 50) {
      gameLayer.removeObject(this)
      }
   }
});

//看板クラス
var SponserBoard = cc.Sprite.extend({
  ctor: function() {
    this._super();
    this.initWithFile(res.sponser_board_png);
    this.setPosition(1200, 150);
  },
  onEnter: function() {
    this._super();
    //var moveAction = cc.MoveTo.create(5, new cc.Point(-100, this.getPosition().y));
    //this.runAction(moveAction);
    this.scheduleUpdate();
  },
  update: function(dt) {
      //座標を更新する
        this.setPosition(this.getPosition().x-scrollSpeed,this.getPosition().y);
      //画面の外にでたアイテムを消去する処理
      if (this.getPosition().x < 50) {
      gameLayer.removeObject(this)
      }
   }
});

//看板ロゴクラス
var SponserLogo = cc.Sprite.extend({
  ctor: function() {
    this._super();
    this.initWithFile(res.sponser_logo_png);
    this.setPosition(1200, 200);
  },
  onEnter: function() {
    this._super();
    //var moveAction = cc.MoveTo.create(5, new cc.Point(-100, this.getPosition().y));
    //this.runAction(moveAction);
    this.scheduleUpdate();
  },
  update: function(dt) {
      //座標を更新する
        this.setPosition(this.getPosition().x-scrollSpeed,this.getPosition().y);
      //画面の外にでたアイテムを消去する処理
      if (this.getPosition().x < 50) {
      gameLayer.removeObject(this)
      }
   }
   
});

//ゴール旗クラス
var GoalFlag = cc.Sprite.extend({
  ctor: function() {
    this._super();
    this.initWithFile(res.goal_flag_png);
    this.setPosition(1200, 200);
  },
  onEnter: function() {
    this._super();
    this.scheduleUpdate();
  },
  update: function(dt) {
      if(!goalStop) {
        this.setPosition(this.getPosition().x-scrollSpeed,this.getPosition().y);
      }
      if (player.getPosition().x > this.getPosition().x) {
        //this.unscheduleUpdate();
        goalStop = true;
      }
      var playerBoundingBox = player.getBoundingBox();
      var flagBoundingBox = this.getBoundingBox();
      //rectIntersectsRectは２つの矩形が交わっているかチェックする
      if (cc.rectIntersectsRect(playerBoundingBox, flagBoundingBox) ) {
        cc.audioEngine.stopMusic();
        cc.director.runScene(new StageClearSkyScene());
      }
   }
   
});

//ゴール足場クラス
var GoalGround = cc.Sprite.extend({
  ctor: function() {
    this._super();
    this.initWithFile(res.ground_sky_png);
    this.setPosition(1300, 100);
  },
  onEnter: function() {
    this._super();
    this.scheduleUpdate();
  },
  update: function(dt) {
      if(!goalStop) {
        this.setPosition(this.getPosition().x-scrollSpeed,this.getPosition().y);
      }
      /*
      if (player.getPosition().x > this.getPosition().x) {
        //this.unscheduleUpdate();
        goalStop = true;
      }*/
      
   }
   
});

//背景管理
function backgroundUpdate() {
	background0.scroll();
        background1.scroll();
        background2.scroll();
        //画面の端に到達したら反対側の座標にする
        if(background0.getPosition().x < -size.width/2){
            background0.setPosition(background2.getPosition().x+size.width, size.height/2);
        }
        if(background1.getPosition().x < -size.width/2){
            background1.setPosition(background0.getPosition().x+size.width, size.height/2);
        }
        if(background2.getPosition().x < -size.width/2){
            background2.setPosition(background1.getPosition().x+size.width, size.height/2);
        }
}

//ダメージ
function damage() {
      life--;
      lifeText.setString("LIFE : " + life);
      //ボリュームを上げる
      cc.audioEngine.setEffectsVolume(cc.audioEngine.getEffectsVolume() + 0.3);
      //効果音を再生する
      cc.audioEngine.playEffect(res.damage_se_mp3);
      if(life < 1){
        cc.audioEngine.stopMusic();
        gameover.score = score;
        cc.director.runScene(new GameOverSkyScene());
      }
      
      player.invulnerability = 100;
}

//プレイヤー元の位置に戻す
function restartGame() {
  damage();
  player.ySpeed = 0;
  player.setPosition(player.getPosition().x, size.height * 0.5);
  
  /*
  //bgmリスタート
  if (!cc.audioEngine.isMusicPlaying()) {
    cc.audioEngine.resumeMusic();
  }*/
}
