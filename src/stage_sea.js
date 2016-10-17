
/* 空ステージ */
//app.js

var size;
var gameLayer;
var background_sea0;
var background_sea1;
var background_sea2;
var scrollSpeed_sea = 2;
var player_sea;
var gameGravity_sea = -0.05;
var gameThrust_sea = 0.15;
var life_sea = 3;
var score_sea = 0;
var life_Score_sea = 0;
var LIFE_UP_SCORE_SKY = 100;
var goalStop_sea = false;
var itemPlusArray_sea;
var itemMinusArray_sea;
itemPlusArray_sea = new Array(res.item_plus00_png, res.item_plus01_png);
itemMinusArray_sea = new Array(res.item_minus00_png, res.item_minus01_png);
var animflg_sea;
var playerArray_sea;
playerArray_sea = new Array(res.player_sea_sea01_png, res.player_sea_sea02_png, res.player_sea_sea03_png);
var State_sea = {
 GAME : 0,
 GOAL: 1
};
var nowstate_sea = State_sea.GAME;

var stageSeaScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        life_sea = 3;
        score_sea = 0;
        gameLayer = new gameSea();
        gameLayer.init();
        this.addChild(gameLayer);
        
        //音楽再生エンジン
        var audioEngine = cc.audioEngine;
        //bgm再生
        if (!audioEngine.isMusicPlaying()) {
          audioEngine.playMusic(res.stagesea_bgm_mp3, true);
        }
    }
});

var gameSea = cc.Layer.extend({
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
	

        //スクロールする背景スプライトをインスタンス　スクロール速度:scrollSpeed_sea
        background_sea0 = new ScrollingBG();
        this.addChild(background_sea0);
        background_sea1 = new ScrollingBG();
        background_sea1.setPos(size.width+size.width/2, size.height/2);
        this.addChild(background_sea1);
        background_sea2 = new ScrollingBG();
        background_sea2.setPos(size.width*2+size.width/2, size.height/2);
        this.addChild(background_sea2);
        
        player_sea = new Player();
        player_sea.setScale(0.1);
        this.addChild(player_sea);

        // 残機表示
        life_seaText = cc.LabelTTF.create("LIFE : " +life_sea ,"Arial","50",cc.TEXT_ALIGNMENT_CENTER);
        this.addChild(life_seaText);
        life_seaText.setPosition(100,850);
        life_seaText.setColor(cc.color(0, 0, 0, 255));
        this.reorderChild(life_seaText, 10);

        //スコア表示
        score_seaText = cc.LabelTTF.create("SCORE : " +score_sea ,"Arial","50",cc.TEXT_ALIGNMENT_CENTER);
        this.addChild(score_seaText);
        score_seaText.setPosition(450,850);
        score_seaText.setColor(cc.color(0, 0, 0, 255));
        this.reorderChild(score_seaText, 10);

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
        switch(nowstate_sea) {
        case State_sea.GAME:
        backgroundUpdate();
        if(goalStop_sea) {
          nowstate_sea = State_sea.GOAL;
          this.unschedule(this.addItemPlus);
          this.unschedule(this.addItemMinus);
        }
        break;
        case State_sea.GOAL:
        break;
        default:
        break;
        }
        
        player_sea.updateY();
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
      //ゴール足場
      var goalground = new GoalGround();
      goalground.setScale(0.7);
      this.addChild(goalground);
      var goalflag = new GoalFlag();
      //ゴール旗
      goalflag.setScale(0.2);
      this.addChild(goalflag);
      //ゴール仲間
      var goalchara = new GoalChara();
      goalchara.setScale(0.1);
      this.addChild(goalchara);
      //スポンサー様看板の停止
      this.unschedule(this.addSponserBoard);
    },
    //オブジェクトを削除
    removeObject: function(object) {
      this.removeChild(object);
    },
    //タッチ
    onTouchBegan: function(touch, event) {
	player_sea.engineOn = true;
        return true;
      },
      onTouchMoved: function(touch, event) {},
      onTouchEnded: function(touch, event) {
        player_sea.engineOn = false;
      },
    
});

//スクロール移動する背景クラス
var ScrollingBG = cc.Sprite.extend({
    //ctorはコンストラクタ　クラスがインスタンスされたときに必ず実行される
    ctor:function() {
        this._super();
        this.initWithFile(res.background_sea_png);
        //背景画像の描画開始位置
      this.setPosition(size.width/2,size.height /2 );
    },
    //onEnterメソッドはスプライト描画の際に必ず呼ばれる
    onEnter:function() {
      
    },
    scroll:function(){
      //座標を更新する
        this.setPosition(this.getPosition().x-scrollSpeed_sea,this.getPosition().y);
        
    },
    setPos:function(x, y){
      //座標を更新する
        this.setPosition(x, y);
    },
});

//重力（仮）で落下する　プレイヤー　
var Player = cc.Sprite.extend({
  ctor: function() {
    animflg_sea = 0;
    this._super();
    this.initWithFile(playerArray_sea[0]);
    this.ySpeed = 0; //プレイヤーの垂直速度

    this.engineOn = false; //カスタム属性追加　プレイヤーのジャンプON OFF
    this.invulnerability = 0; //無敵モード時間　初期値0
  },
  onEnter: function() {
    this.setPosition(60, size.height * 0.5);
  },
  updateY: function() {
    if(this.engineOn){
      animflg_sea++;
      if(animflg_sea >= 15) {
      animflg_sea = 0;
      }
      
      this.initWithFile(playerArray_sea[Math.floor(animflg_sea/5)]);
      this.ySpeed += gameThrust_sea;
      
    }
    //無敵モード中の視覚効果
    if (this.invulnerability > 0) {
      this.invulnerability--;
      this.setOpacity(255 - this.getOpacity());
    }

    this.setPosition(this.getPosition().x, this.getPosition().y + this.ySpeed);
    this.ySpeed += gameGravity_sea;

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
    var num = Math.floor(Math.random() * itemPlusArray_sea.length);
    this.initWithFile(itemPlusArray_sea[num]);
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
    var player_seaBoundingBox = player_sea.getBoundingBox();
    var itemBoundingBox = this.getBoundingBox();
		//rectIntersectsRectは２つの矩形が交わっているかチェックする
    if (cc.rectIntersectsRect(player_seaBoundingBox, itemBoundingBox) ) {
      gameLayer.removeObject(this);//アイテムを削除する
      //ボリュームを上げる
      cc.audioEngine.setEffectsVolume(cc.audioEngine.getEffectsVolume() + 0.3);
      //効果音を再生する
      cc.audioEngine.playEffect(res.plus_se_mp3);
      
      //スコア追加処理
      score_sea += 10;
      score_seaText.setString("SCORE : " + score_sea);
      life_Score_sea += 10;
      if(life_Score_sea >= LIFE_UP_SCORE_SKY) {
        life_Score_sea -= LIFE_UP_SCORE_SKY;
        if(life_sea < 10) {
          life_sea++;
          life_seaText.setString("LIFE : " + life_sea);
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
    var num = Math.floor(Math.random() * itemMinusArray_sea.length);
    this.initWithFile(itemMinusArray_sea[num]);
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
    var player_seaBoundingBox = player_sea.getBoundingBox();
    var itemBoundingBox = this.getBoundingBox();
    //rectIntersectsRectは２つの矩形が交わっているかチェックする
    if (cc.rectIntersectsRect(player_seaBoundingBox, itemBoundingBox) ) {
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
	background_sea0.scroll();
        background_sea1.scroll();
        background_sea2.scroll();
        //画面の端に到達したら反対側の座標にする
        if(background_sea0.getPosition().x < -size.width/2){
            background_sea0.setPosition(background_sea2.getPosition().x+size.width, size.height/2);
        }
        if(background_sea1.getPosition().x < -size.width/2){
            background_sea1.setPosition(background_sea0.getPosition().x+size.width, size.height/2);
        }
        if(background_sea2.getPosition().x < -size.width/2){
            background_sea2.setPosition(background_sea1.getPosition().x+size.width, size.height/2);
        }
}

//足場クラス
var Ground = cc.Sprite.extend({
  ctor: function() {
    this._super();
    this.initWithFile(res.ground_sea_png);
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
        this.setPosition(this.getPosition().x-scrollSpeed_sea,this.getPosition().y);
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
        this.setPosition(this.getPosition().x-scrollSpeed_sea,this.getPosition().y);
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
        this.setPosition(this.getPosition().x-scrollSpeed_sea,this.getPosition().y);
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
      if(!goalStop_sea) {
        this.setPosition(this.getPosition().x-scrollSpeed_sea,this.getPosition().y);
      }
      if (player_sea.getPosition().x > this.getPosition().x) {
        //this.unscheduleUpdate();
        goalStop_sea = true;
      }
      var player_seaBoundingBox = player_sea.getBoundingBox();
      var flagBoundingBox = this.getBoundingBox();
      //rectIntersectsRectは２つの矩形が交わっているかチェックする
      if (cc.rectIntersectsRect(player_seaBoundingBox, flagBoundingBox) ) {
        cc.audioEngine.stopMusic();
        cc.director.runScene(new StageClearSeaScene());
      }
   }
   
});

//ゴール仲間クラス
var GoalChara = cc.Sprite.extend({
  ctor: function() {
    this._super();
    this.initWithFile(res.goal_chara_png);
    this.setPosition(1350, 150);
  },
  onEnter: function() {
    this._super();
    this.scheduleUpdate();
  },
  update: function(dt) {
      if(!goalStop_sea) {
        this.setPosition(this.getPosition().x-scrollSpeed_sea,this.getPosition().y);
      }
      /*
      if (player_sea.getPosition().x > this.getPosition().x) {
        //this.unscheduleUpdate();
        goalStop_sea = true;
      }*/
      
   }
   
});

//ゴール足場クラス
var GoalGround = cc.Sprite.extend({
  ctor: function() {
    this._super();
    this.initWithFile(res.ground_sea_png);
    this.setPosition(1300, 100);
  },
  onEnter: function() {
    this._super();
    this.scheduleUpdate();
  },
  update: function(dt) {
      if(!goalStop_sea) {
        this.setPosition(this.getPosition().x-scrollSpeed_sea,this.getPosition().y);
      }
      /*
      if (player_sea.getPosition().x > this.getPosition().x) {
        //this.unscheduleUpdate();
        goalStop_sea = true;
      }*/
      
   }
   
});

//背景管理
function backgroundUpdate() {
	background_sea0.scroll();
        background_sea1.scroll();
        background_sea2.scroll();
        //画面の端に到達したら反対側の座標にする
        if(background_sea0.getPosition().x < -size.width/2){
            background_sea0.setPosition(background_sea2.getPosition().x+size.width, size.height/2);
        }
        if(background_sea1.getPosition().x < -size.width/2){
            background_sea1.setPosition(background_sea0.getPosition().x+size.width, size.height/2);
        }
        if(background_sea2.getPosition().x < -size.width/2){
            background_sea2.setPosition(background_sea1.getPosition().x+size.width, size.height/2);
        }
}

//ダメージ
function damage() {
      life_sea--;
      life_seaText.setString("LIFE : " + life_sea);
      //ボリュームを上げる
      cc.audioEngine.setEffectsVolume(cc.audioEngine.getEffectsVolume() + 0.3);
      //効果音を再生する
      cc.audioEngine.playEffect(res.damage_se_mp3);
      if(life_sea < 1){
        cc.audioEngine.stopMusic();
        gameover.score_sea = score_sea;
        cc.director.runScene(new GameOverSeaScene());
      }
      
      player_sea.invulnerability = 100;
}

//プレイヤー元の位置に戻す
function restartGame() {
  damage();
  player_sea.ySpeed = 0;
  player_sea.setPosition(player_sea.getPosition().x, size.height * 0.5);
  
  /*
  //bgmリスタート
  if (!cc.audioEngine.isMusicPlaying()) {
    cc.audioEngine.resumeMusic();
  }*/
}
