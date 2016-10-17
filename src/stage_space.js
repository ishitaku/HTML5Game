
/* 宇宙ステージ */
//app.js

var size_space;
var gameLayer_space;
var background_space0;
var background_space1;
var background_space2;
var scrollSpeed_space = 2;
var player_space;
var gameGravity_space = -0.05;
var gameThrust_space = 0.15;
var life_space = 3;
var score_space = 0;
var life_Score_space = 0;
var LIFE_UP_SCORE_SKY = 100;
var goalStop_space = false;
var itemPlusArray_space;
var itemMinusArray_space;
itemPlusArray_space = new Array(res.item_plus00_png, res.item_plus01_png);
itemMinusArray_space = new Array(res.item_minus00_png, res.item_minus01_png);
var animflg_space;
var playerArray_space;
playerArray_space = new Array(res.player_space01_png, res.player_space02_png, res.player_space03_png);
var State_space = {
 GAME : 0,
 GOAL: 1
};
var nowstate_space = State_space.GAME;

var stageSpaceScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        life_space = 3;
        score_space = 0;
        gameLayer_space = new gameSpace();
        gameLayer_space.init();
        this.addChild(gameLayer_space);
        
        //音楽再生エンジン
        var audioEngine = cc.audioEngine;
        //bgm再生
        if (!audioEngine.isMusicPlaying()) {
          audioEngine.playMusic(res.stagespace_bgm_mp3, true);
        }
    }
});

var gameSpace = cc.Layer.extend({
    init:function () {
        this._super();
        size_space = cc.director.getWinSize();
               
       // タップイベントリスナーを登録する
                cc.eventManager.addListener({
                    event: cc.EventListener.TOUCH_ONE_BY_ONE,
                    swallowTouches: true,
                    onTouchBegan: this.onTouchBegan,
                    onTouchMoved: this.onTouchMoved,
                    onTouchEnded: this.onTouchEnded
                }, this);
	

        //スクロールする背景スプライトをインスタンス　スクロール速度:scrollSpeed_space
        background_space0 = new ScrollingSpaceBG();
        this.addChild(background_space0);
        background_space1 = new ScrollingSpaceBG();
        background_space1.setPos(size_space.width+size_space.width/2, size_space.height/2);
        this.addChild(background_space1);
        background_space2 = new ScrollingSpaceBG();
        background_space2.setPos(size_space.width*2+size_space.width/2, size_space.height/2);
        this.addChild(background_space2);
        
        player_space = new PlayerSpace();
        player_space.setScale(0.1);
        this.addChild(player_space);

        // 残機表示
        life_spaceText = cc.LabelTTF.create("LIFE : " +life_space ,"Arial","50",cc.TEXT_ALIGNMENT_CENTER);
        this.addChild(life_spaceText);
        life_spaceText.setPosition(100,850);
        life_spaceText.setColor(cc.color(0, 0, 0, 255));
        this.reorderChild(life_spaceText, 10);

        //スコア表示
        score_spaceText = cc.LabelTTF.create("SCORE : " +score_space ,"Arial","50",cc.TEXT_ALIGNMENT_CENTER);
        this.addChild(score_spaceText);
        score_spaceText.setPosition(450,850);
        score_spaceText.setColor(cc.color(0, 0, 0, 255));
        this.reorderChild(score_spaceText, 10);

        //scheduleUpdate関数は、描画の都度、update関数を呼び出す
        this.scheduleUpdate();

        //アイテム生成
        this.schedule(this.addItemPlusSpace, 1.5);
        this.schedule(this.addItemMinusSpace, 3);
        this.schedule(this.addSponserBoardSpace, 10);
        this.scheduleOnce(this.addGoal, 15);
    },
    update:function(dt){
      //background・その他のscrollメソッドを呼び出す
        switch(nowstate_space) {
        case State_space.GAME:
        backgroundSpaceUpdate();
        if(goalStop_space) {
          nowstate_space = State_space.GOAL;
          this.unschedule(this.addItemPlusSpace);
          this.unschedule(this.addItemMinusSpace);
        }
        break;
        case State_space.GOAL:
        break;
        default:
        break;
        }
        
        player_space.updateY();
    },
    //プラスアイテムを追加
    addItemPlusSpace: function(event){
      var itemPlus = new ItemPlusSpace();
      itemPlus.setScale(0.2);
      this.addChild(itemPlus);
    },
    //マイナスアイテムを追加
    addItemMinusSpace: function(event){
      var itemMinus = new ItemMinusSpace();
      itemMinus.setScale(0.2);
      this.addChild(itemMinus);
    },
    //スポンサー様看板
    addSponserBoardSpace: function(event) {
      var ground = new GroundSpace();
      ground.setScale(0.5);
      this.addChild(ground);
      var sponserboard = new SponserBoardSpace();
      sponserboard.setScale(0.15);
      this.addChild(sponserboard);
      var sponserlogo = new SponserLogoSpace();
      sponserlogo.setScale(0.2);
      //sponserlogo.setPosition(sponserboard.getPosition().x, sponserlogo.getPosition().y);
      this.addChild(sponserlogo);
    },
    //ゴール
    addGoal: function() {
      //ゴール足場
      var goalground = new GoalGroundSpace();
      goalground.setScale(0.7);
      this.addChild(goalground);
      var goalflag = new GoalFlagSpace();
      //ゴール旗
      goalflag.setScale(0.2);
      this.addChild(goalflag);
      //ゴール仲間
      var goalchara = new GoalCharaSpace();
      goalchara.setScale(0.1);
      this.addChild(goalchara);
      //スポンサー様看板の停止
      this.unschedule(this.addSponserBoardSpace);
    },
    //オブジェクトを削除
    removeObject: function(object) {
      this.removeChild(object);
    },
    //タッチ
    onTouchBegan: function(touch, event) {
	player_space.engineOn = true;
        return true;
      },
      onTouchMoved: function(touch, event) {},
      onTouchEnded: function(touch, event) {
        player_space.engineOn = false;
      },
    
});

//スクロール移動する背景クラス
var ScrollingSpaceBG = cc.Sprite.extend({
    //ctorはコンストラクタ　クラスがインスタンスされたときに必ず実行される
    ctor:function() {
        this._super();
        this.initWithFile(res.background_space_png);
        //背景画像の描画開始位置
      this.setPosition(size_space.width/2,size_space.height /2 );
    },
    //onEnterメソッドはスプライト描画の際に必ず呼ばれる
    onEnter:function() {
      
    },
    scroll:function(){
      //座標を更新する
        this.setPosition(this.getPosition().x-scrollSpeed_space,this.getPosition().y);
        
    },
    setPos:function(x, y){
      //座標を更新する
        this.setPosition(x, y);
    },
});

//重力（仮）で落下する　プレイヤー　
var PlayerSpace = cc.Sprite.extend({
  ctor: function() {
    animflg_space = 0;
    this._super();
    this.initWithFile(playerArray_space[0]);
    this.ySpeed = 0; //プレイヤーの垂直速度

    this.engineOn = false; //カスタム属性追加　プレイヤーのジャンプON OFF
    this.invulnerability = 0; //無敵モード時間　初期値0
  },
  onEnter: function() {
    this.setPosition(60, size_space.height * 0.5);
  },
  updateY: function() {
    if(this.engineOn){
      animflg_space++;
      if(animflg_space >= 15) {
      animflg_space = 0;
      }
      
      this.initWithFile(playerArray_space[Math.floor(animflg_space/5)]);
      this.ySpeed += gameThrust_space;
      
    }
    //無敵モード中の視覚効果
    if (this.invulnerability > 0) {
      this.invulnerability--;
      this.setOpacity(255 - this.getOpacity());
    }

    this.setPosition(this.getPosition().x, this.getPosition().y + this.ySpeed);
    this.ySpeed += gameGravity_space;

    //プレイヤーが画面外にでたら、リスタートさせる
     if (this.getPosition().y < 0 || this.getPosition().y > 1500) {
       
       restartGameSpace();
     }
  }
});

//プラスアイテムクラス
var ItemPlusSpace = cc.Sprite.extend({

  ctor: function() {
    this._super();
    var num = Math.floor(Math.random() * itemPlusArray_space.length);
    this.initWithFile(itemPlusArray_space[num]);
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
    var player_spaceBoundingBox = player_space.getBoundingBox();
    var itemBoundingBox = this.getBoundingBox();
		//rectIntersectsRectは２つの矩形が交わっているかチェックする
    if (cc.rectIntersectsRect(player_spaceBoundingBox, itemBoundingBox) ) {
      gameLayer_space.removeObject(this);//アイテムを削除する
      //ボリュームを上げる
      cc.audioEngine.setEffectsVolume(cc.audioEngine.getEffectsVolume() + 0.3);
      //効果音を再生する
      cc.audioEngine.playEffect(res.plus_se_mp3);
      
      //スコア追加処理
      score_space += 10;
      score_spaceText.setString("SCORE : " + score_space);
      life_Score_space += 10;
      if(life_Score_space >= LIFE_UP_SCORE_SKY) {
        life_Score_space -= LIFE_UP_SCORE_SKY;
        if(life_space < 10) {
          life_space++;
          life_spaceText.setString("LIFE : " + life_space);
        }
      }
    }
		//画面の外にでたアイテムを消去する処理
    if (this.getPosition().x < 50) {
      gameLayer_space.removeObject(this)
    }
  }
});

//マイナスアイテムクラス
var ItemMinusSpace = cc.Sprite.extend({
  ctor: function() {
    this._super();
    var num = Math.floor(Math.random() * itemMinusArray_space.length);
    this.initWithFile(itemMinusArray_space[num]);
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
    var player_spaceBoundingBox = player_space.getBoundingBox();
    var itemBoundingBox = this.getBoundingBox();
    //rectIntersectsRectは２つの矩形が交わっているかチェックする
    if (cc.rectIntersectsRect(player_spaceBoundingBox, itemBoundingBox) ) {
      //アイテムを削除する
      gameLayer_space.removeObject(this);
      //ダメージ
      damageSpace();
      
    }
    if (this.getPosition().x < 50) {
      gameLayer_space.removeObject(this)
    }
  }
});



//背景管理
function backgroundSpaceUpdate() {
	background_space0.scroll();
        background_space1.scroll();
        background_space2.scroll();
        //画面の端に到達したら反対側の座標にする
        if(background_space0.getPosition().x < -size_space.width/2){
            background_space0.setPosition(background_space2.getPosition().x+size_space.width, size_space.height/2);
        }
        if(background_space1.getPosition().x < -size_space.width/2){
            background_space1.setPosition(background_space0.getPosition().x+size_space.width, size_space.height/2);
        }
        if(background_space2.getPosition().x < -size_space.width/2){
            background_space2.setPosition(background_space1.getPosition().x+size_space.width, size_space.height/2);
        }
}

//足場クラス
var GroundSpace = cc.Sprite.extend({
  ctor: function() {
    this._super();
    this.initWithFile(res.ground_space_png);
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
        this.setPosition(this.getPosition().x-scrollSpeed_space,this.getPosition().y);
      //画面の外にでたアイテムを消去する処理
      if (this.getPosition().x < 50) {
      gameLayer_space.removeObject(this)
      }
   }
});

//看板クラス
var SponserBoardSpace = cc.Sprite.extend({
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
        this.setPosition(this.getPosition().x-scrollSpeed_space,this.getPosition().y);
      //画面の外にでたアイテムを消去する処理
      if (this.getPosition().x < 50) {
      gameLayer_space.removeObject(this)
      }
   }
});

//看板ロゴクラス
var SponserLogoSpace = cc.Sprite.extend({
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
        this.setPosition(this.getPosition().x-scrollSpeed_space,this.getPosition().y);
      //画面の外にでたアイテムを消去する処理
      if (this.getPosition().x < 50) {
      gameLayer_space.removeObject(this)
      }
   }
   
});

//ゴール旗クラス
var GoalFlagSpace = cc.Sprite.extend({
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
      if(!goalStop_space) {
        this.setPosition(this.getPosition().x-scrollSpeed_space,this.getPosition().y);
      }
      if (player_space.getPosition().x > this.getPosition().x) {
        //this.unscheduleUpdate();
        goalStop_space = true;
      }
      var player_spaceBoundingBox = player_space.getBoundingBox();
      var flagBoundingBox = this.getBoundingBox();
      //rectIntersectsRectは２つの矩形が交わっているかチェックする
      if (cc.rectIntersectsRect(player_spaceBoundingBox, flagBoundingBox) ) {
        cc.audioEngine.stopMusic();
        //ゲームクリア画面へ
        cc.director.runScene(new GameClearScene());
      }
   }
   
});

//ゴール仲間クラス
var GoalCharaSpace = cc.Sprite.extend({
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
      if(!goalStop_space) {
        this.setPosition(this.getPosition().x-scrollSpeed_space,this.getPosition().y);
      }
      /*
      if (player_space.getPosition().x > this.getPosition().x) {
        //this.unscheduleUpdate();
        goalStop_space = true;
      }*/
      
   }
   
});

//ゴール足場クラス
var GoalGroundSpace = cc.Sprite.extend({
  ctor: function() {
    this._super();
    this.initWithFile(res.ground_space_png);
    this.setPosition(1300, 100);
  },
  onEnter: function() {
    this._super();
    this.scheduleUpdate();
  },
  update: function(dt) {
      if(!goalStop_space) {
        this.setPosition(this.getPosition().x-scrollSpeed_space,this.getPosition().y);
      }
      /*
      if (player_space.getPosition().x > this.getPosition().x) {
        //this.unscheduleUpdate();
        goalStop_space = true;
      }*/
      
   }
   
});

//ダメージ
function damageSpace() {
      life_space--;
      life_spaceText.setString("LIFE : " + life_space);
      //ボリュームを上げる
      cc.audioEngine.setEffectsVolume(cc.audioEngine.getEffectsVolume() + 0.3);
      //効果音を再生する
      cc.audioEngine.playEffect(res.damage_se_mp3);
      if(life_space < 1){
        cc.audioEngine.stopMusic();
        gameover.score_space = score_space;
        cc.director.runScene(new GameOverSpaceScene());
      }
      
      player_space.invulnerability = 100;
}

//プレイヤー元の位置に戻す
function restartGameSpace() {
  damageSpace();
  player_space.ySpeed = 0;
  player_space.setPosition(player_space.getPosition().x, size_space.height * 0.5);
  
  /*
  //bgmリスタート
  if (!cc.audioEngine.isMusicPlaying()) {
    cc.audioEngine.resumeMusic();
  }*/
}
