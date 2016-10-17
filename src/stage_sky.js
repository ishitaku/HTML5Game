
/* 空ステージ */
//stage_sky.js

var size_sky;
var gameLayer_sky;
var background_sky0;
var background_sky1;
var background_sky2;
var scrollSpeed_sky = 2;
var player_sky;
var gameGravity_sky = -0.05;
var gameThrust_sky = 0.15;
var life_sky = 3;
var score_sky = 0;
var life_Score_sky = 0;
var LIFE_UP_SCORE_SKY = 100;
var goalStop_sky = false;
var itemPlusArray_sky;
var itemMinusArray_sky;
itemPlusArray_sky = new Array(res.item_plus00_png, res.item_plus01_png);
itemMinusArray_sky = new Array(res.item_minus00_png, res.item_minus01_png);
var animflg_sky;
var playerArray_sky;
playerArray_sky = new Array(res.player_sky01_png, res.player_sky02_png, res.player_sky03_png);
var State_sky = {
 GAME : 0,
 GOAL: 1
};
var nowstate_sky;

var stageSkyScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        life_sky = 3;
        score_sky = 0;
        gameLayer_sky = new gameSky();
        gameLayer_sky.init();
        this.addChild(gameLayer_sky);
        
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
        size_sky = cc.director.getWinSize();
        goalStop_sky = false;
        nowstate_sky = State_sky.GAME;
        
       // タップイベントリスナーを登録する
                cc.eventManager.addListener({
                    event: cc.EventListener.TOUCH_ONE_BY_ONE,
                    swallowTouches: true,
                    onTouchBegan: this.onTouchBegan,
                    onTouchMoved: this.onTouchMoved,
                    onTouchEnded: this.onTouchEnded
                }, this);
	

        //スクロールする背景スプライトをインスタンススクロール速度:scrollSpeed_sky
        background_sky0 = new ScrollingSkyBG();
        this.addChild(background_sky0);
        background_sky1 = new ScrollingSkyBG();
        background_sky1.setPos(size_sky.width+size_sky.width/2-10, size_sky.height/2);
        this.addChild(background_sky1);
        background_sky2 = new ScrollingSkyBG();
        background_sky2.setPos(size_sky.width*2+size_sky.width/2-20, size_sky.height/2);
        this.addChild(background_sky2);
        
        player_sky = new PlayerSky();
        player_sky.setScale(0.1);
        this.addChild(player_sky);

        // 残機表示
        life_skyText = cc.LabelTTF.create("LIFE : " +life_sky ,"Arial","50",cc.TEXT_ALIGNMENT_CENTER);
        this.addChild(life_skyText);
        life_skyText.setPosition(100,850);
        life_skyText.setColor(cc.color(0, 0, 0, 255));
        this.reorderChild(life_skyText, 10);

        //スコア表示
        score_skyText = cc.LabelTTF.create("SCORE : " +score_sky ,"Arial","50",cc.TEXT_ALIGNMENT_CENTER);
        this.addChild(score_skyText);
        score_skyText.setPosition(450,850);
        score_skyText.setColor(cc.color(0, 0, 0, 255));
        this.reorderChild(score_skyText, 10);

        //scheduleUpdate関数は、描画の都度、update関数を呼び出す
        this.scheduleUpdate();

        //アイテム生成
        this.schedule(this.addItemPlusSky, 1.5);
        this.schedule(this.addItemMinusSky, 3);
        this.schedule(this.addSponserBoardSky, 10);
        this.scheduleOnce(this.addGoal, 15);
    },
    update:function(dt){
      //background・その他のscrollメソッドを呼び出す
        switch(nowstate_sky) {
        case State_sky.GAME:
        backgroundSkyUpdate();
        if(goalStop_sky) {
          nowstate_sky = State_sky.GOAL;
          this.unschedule(this.addItemPlusSky);
          this.unschedule(this.addItemMinusSky);
        }
        break;
        case State_sky.GOAL:
        break;
        default:
        break;
        }
        
        player_sky.updateY();
    },
    //プラスアイテムを追加
    addItemPlusSky: function(event){
      var itemPlus = new ItemPlusSky();
      itemPlus.setScale(0.2);
      this.addChild(itemPlus);
    },
    //マイナスアイテムを追加
    addItemMinusSky: function(event){
      var itemMinus = new ItemMinusSky();
      itemMinus.setScale(0.2);
      this.addChild(itemMinus);
    },
    //スポンサー様看板
    addSponserBoardSky: function(event) {
      var ground = new GroundSky();
      ground.setScale(0.5);
      this.addChild(ground);
      var sponserboard = new SponserBoardSky();
      sponserboard.setScale(0.15);
      this.addChild(sponserboard);
      var sponserlogo = new SponserLogoSky();
      sponserlogo.setScale(0.2);
      //sponserlogo.setPosition(sponserboard.getPosition().x, sponserlogo.getPosition().y);
      this.addChild(sponserlogo);
    },
    //ゴール
    addGoal: function() {
      //ゴール足場
      var goalground = new GoalGroundSky();
      goalground.setScale(0.7);
      this.addChild(goalground);
      var goalflag = new GoalFlagSky();
      //ゴール旗
      goalflag.setScale(0.2);
      this.addChild(goalflag);
      //ゴール仲間
      var goalchara = new GoalCharaSky();
      goalchara.setScale(0.1);
      this.addChild(goalchara);
      //スポンサー様看板の停止
      this.unschedule(this.addSponserBoardSky);
    },
    //オブジェクトを削除
    removeObject: function(object) {
      this.removeChild(object);
    },
    //タッチ
    onTouchBegan: function(touch, event) {
	player_sky.engineOn = true;
        return true;
      },
      onTouchMoved: function(touch, event) {},
      onTouchEnded: function(touch, event) {
        player_sky.engineOn = false;
      },
    
});

//スクロール移動する背景クラス
var ScrollingSkyBG = cc.Sprite.extend({
    //ctorはコンストラクタクラスがインスタンスされたときに必ず実行される
    ctor:function() {
        this._super();
        this.initWithFile(res.background_sky_png);
        //背景画像の描画開始位置
      this.setPosition(size_sky.width/2,size_sky.height /2 );
    },
    //onEnterメソッドはスプライト描画の際に必ず呼ばれる
    onEnter:function() {
      
    },
    scroll:function(){
      //座標を更新する
        this.setPosition(this.getPosition().x-scrollSpeed_sky,this.getPosition().y);
        
    },
    setPos:function(x, y){
      //座標を更新する
        this.setPosition(x, y);
    },
});

//重力（仮）で落下する　プレイヤー　
var PlayerSky = cc.Sprite.extend({
  ctor: function() {
    animflg_sky = 0;
    this._super();
    this.initWithFile(playerArray_sky[0]);
    this.ySpeed = 0; //プレイヤーの垂直速度

    this.engineOn = false; //カスタム属性追加　プレイヤーのジャンプON OFF
    this.invulnerability = 0; //無敵モード時間　初期値0
  },
  onEnter: function() {
    this.setPosition(60, size_sky.height * 0.5);
  },
  updateY: function() {
    if(this.engineOn){
      animflg_sky++;
      if(animflg_sky >= 15) {
      animflg_sky = 0;
      }
      
      this.initWithFile(playerArray_sky[Math.floor(animflg_sky/5)]);
      this.ySpeed += gameThrust_sky;
      
    }
    //無敵モード中の視覚効果
    if (this.invulnerability > 0) {
      this.invulnerability--;
      this.setOpacity(255 - this.getOpacity());
    }

    this.setPosition(this.getPosition().x, this.getPosition().y + this.ySpeed);
    this.ySpeed += gameGravity_sky;

    //プレイヤーが画面外にでたら、リスタートさせる
     if (this.getPosition().y < 0 || this.getPosition().y > 1500) {
       
       restartGameSky();
     }
  }
});

//プラスアイテムクラス
var ItemPlusSky = cc.Sprite.extend({

  ctor: function() {
    this._super();
    var num = Math.floor(Math.random() * itemPlusArray_sky.length);
    this.initWithFile(itemPlusArray_sky[num]);
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
    var player_skyBoundingBox = player_sky.getBoundingBox();
    var itemBoundingBox = this.getBoundingBox();
		//rectIntersectsRectは２つの矩形が交わっているかチェックする
    if (cc.rectIntersectsRect(player_skyBoundingBox, itemBoundingBox) ) {
      gameLayer_sky.removeObject(this);//アイテムを削除する
      //ボリュームを上げる
      cc.audioEngine.setEffectsVolume(cc.audioEngine.getEffectsVolume() + 0.3);
      //効果音を再生する
      cc.audioEngine.playEffect(res.plus_se_mp3);
      
      //スコア追加処理
      score_sky += 10;
      score_skyText.setString("SCORE : " + score_sky);
      life_Score_sky += 10;
      if(life_Score_sky >= LIFE_UP_SCORE_SKY) {
        life_Score_sky -= LIFE_UP_SCORE_SKY;
        if(life_sky < 10) {
          life_sky++;
          life_skyText.setString("LIFE : " + life_sky);
        }
      }
    }
		//画面の外にでたアイテムを消去する処理
    if (this.getPosition().x < 50) {
      gameLayer_sky.removeObject(this)
    }
  }
});

//マイナスアイテムクラス
var ItemMinusSky = cc.Sprite.extend({
  ctor: function() {
    this._super();
    var num = Math.floor(Math.random() * itemMinusArray_sky.length);
    this.initWithFile(itemMinusArray_sky[num]);
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
    var player_skyBoundingBox = player_sky.getBoundingBox();
    var itemBoundingBox = this.getBoundingBox();
    //rectIntersectsRectは２つの矩形が交わっているかチェックする
    if (cc.rectIntersectsRect(player_skyBoundingBox, itemBoundingBox) ) {
      //アイテムを削除する
      gameLayer_sky.removeObject(this);
      //ダメージ
      damageSky();
      
    }
    if (this.getPosition().x < 50) {
      gameLayer_sky.removeObject(this)
    }
  }
});

//背景管理
function backgroundSkyUpdate() {
	background_sky0.scroll();
        background_sky1.scroll();
        background_sky2.scroll();
        //画面の端に到達したら反対側の座標にする
        if(background_sky0.getPosition().x < -size_sky.width/2){
            background_sky0.setPosition(background_sky2.getPosition().x+size_sky.width-10, size_sky.height/2);
        }
        if(background_sky1.getPosition().x < -size_sky.width/2){
            background_sky1.setPosition(background_sky0.getPosition().x+size_sky.width-10, size_sky.height/2);
        }
        if(background_sky2.getPosition().x < -size_sky.width/2){
            background_sky2.setPosition(background_sky1.getPosition().x+size_sky.width-10, size_sky.height/2);
        }
}

//足場クラス
var GroundSky = cc.Sprite.extend({
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
        this.setPosition(this.getPosition().x-scrollSpeed_sky,this.getPosition().y);
      //画面の外にでたアイテムを消去する処理
      if (this.getPosition().x < 50) {
      gameLayer_sky.removeObject(this)
      }
   }
});

//看板クラス
var SponserBoardSky = cc.Sprite.extend({
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
        this.setPosition(this.getPosition().x-scrollSpeed_sky,this.getPosition().y);
      //画面の外にでたアイテムを消去する処理
      if (this.getPosition().x < 50) {
      gameLayer_sky.removeObject(this)
      }
   }
});

//看板ロゴクラス
var SponserLogoSky = cc.Sprite.extend({
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
        this.setPosition(this.getPosition().x-scrollSpeed_sky,this.getPosition().y);
      //画面の外にでたアイテムを消去する処理
      if (this.getPosition().x < 50) {
      gameLayer_sky.removeObject(this)
      }
   }
   
});

//ゴール旗クラス
var GoalFlagSky = cc.Sprite.extend({
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
      if(!goalStop_sky) {
        this.setPosition(this.getPosition().x-scrollSpeed_sky,this.getPosition().y);
      }
      if (player_sky.getPosition().x > this.getPosition().x) {
        //this.unscheduleUpdate();
        goalStop_sky = true;
      }
      var player_skyBoundingBox = player_sky.getBoundingBox();
      var flagBoundingBox = this.getBoundingBox();
      //rectIntersectsRectは２つの矩形が交わっているかチェックする
      if (cc.rectIntersectsRect(player_skyBoundingBox, flagBoundingBox) ) {
        cc.audioEngine.stopMusic();
        cc.director.runScene(new StageClearSkyScene());
      }
   }
   
});

//ゴール仲間クラス
var GoalCharaSky = cc.Sprite.extend({
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
      if(!goalStop_sky) {
        this.setPosition(this.getPosition().x-scrollSpeed_sky,this.getPosition().y);
      }
      /*
      if (player_sky.getPosition().x > this.getPosition().x) {
        //this.unscheduleUpdate();
        goalStop_sky = true;
      }*/
      
   }
   
});

//ゴール足場クラス
var GoalGroundSky = cc.Sprite.extend({
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
      if(!goalStop_sky) {
        this.setPosition(this.getPosition().x-scrollSpeed_sky,this.getPosition().y);
      }
      /*
      if (player_sky.getPosition().x > this.getPosition().x) {
        //this.unscheduleUpdate();
        goalStop_sky = true;
      }*/
      
   }
   
});


//ダメージ
function damageSky() {
      life_sky--;
      life_skyText.setString("LIFE : " + life_sky);
      //ボリュームを上げる
      cc.audioEngine.setEffectsVolume(cc.audioEngine.getEffectsVolume() + 0.3);
      //効果音を再生する
      cc.audioEngine.playEffect(res.damage_se_mp3);
      if(life_sky < 1){
        cc.audioEngine.stopMusic();
        gameover.score_sky = score_sky;
        cc.director.runScene(new GameOverSkyScene());
      }
      
      player_sky.invulnerability = 100;
}

//プレイヤー元の位置に戻す
function restartGameSky() {
  damageSky();
  player_sky.ySpeed = 0;
  player_sky.setPosition(player_sky.getPosition().x, size_sky.height * 0.5);
  
  /*
  //bgmリスタート
  if (!cc.audioEngine.isMusicPlaying()) {
    cc.audioEngine.resumeMusic();
  }*/
}
