
/* 海ステージ */
//stage_sea.js

var size_sea;			//画面のサイズ
var gameLayer_sea;		//レイヤー
var background_sea0;	//背景1
var background_sea1;	//背景2
var background_sea2;	//背景3
var scrollSpeed_sea = 2;		//スクロール速度
var player_sea;					//プレイヤー
var gameGravity_sea = -0.05;	//重力
var gameThrust_sea = 0.15;		//上昇力
var life_sea = 3;		//ライフ
var score_sea = 0;		//スコア
var life_Score_sea = 0;	//ライフが回復するスコア
var LIFE_UP_SCORE_SKY = 100;	//回復までのスコア
var goalStop_sea = false;		//ゴールまでついたか
var itemPlusArray_sea;			//プラスアイテム配列
var itemMinusArray_sea;			//マイナスアイテム配列
itemPlusArray_sea = new Array(res.item_plus00_png, res.item_plus01_png);		//プラスアイテムを初期化
itemMinusArray_sea = new Array(res.item_minus00_png, res.item_minus01_png);		//マイナスアイテムを初期化
var animflg_sea;		//アニメーションのコマ
var playerArray_sea;	//プレイヤーのアニメーション配列
playerArray_sea = new Array(res.player_sea01_png, res.player_sea02_png, res.player_sea03_png);
var State_sea = {
 GAME : 0,
 GOAL: 1
};
var nowstate_sea;	//ゲームステート

//海ステージのシーン
var stageSeaScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        //ライフを設定
        life_sea = 10;
        //スコアを0に初期化
        score_sea = 0;
        //ライフ回復までのスコアを0に初期化
        life_Score_sea = 0;
        //ゴールのフラグ
        goalStop_sea = false;
        //ステートをゲームに初期化
        nowstate_sea = State_sea.GAME;
        //レイヤーを生成
        gameLayer_sea = new gameSea();
        //レイヤーを初期化
        gameLayer_sea.init();
        this.addChild(gameLayer_sea);
        
        //音楽再生エンジン
        var audioEngine = cc.audioEngine;
        //bgm再生
        if (!audioEngine.isMusicPlaying()) {
          audioEngine.playMusic(res.stagesea_bgm_mp3, true);
        }
    }
});

//レイヤー
var gameSea = cc.Layer.extend({
    init:function () {
        this._super();
        //画面のサイズを取得
        size_sea = cc.director.getWinSize();
        
        
       // タップイベントリスナーを登録する
                cc.eventManager.addListener({
                    event: cc.EventListener.TOUCH_ONE_BY_ONE,
                    swallowTouches: true,
                    onTouchBegan: this.onTouchBegan,
                    onTouchMoved: this.onTouchMoved,
                    onTouchEnded: this.onTouchEnded
                }, this);
	

        //スクロールする背景スプライトをインスタンススクロール速度:scrollSpeed_sea
        background_sea0 = new ScrollingSeaBG();
        this.addChild(background_sea0);
        background_sea1 = new ScrollingSeaBG();
        background_sea1.setPos(size_sea.width+size_sea.width/2-10, size_sea.height/2);
        this.addChild(background_sea1);
        background_sea2 = new ScrollingSeaBG();
        background_sea2.setPos(size_sea.width*2+size_sea.width/2-20, size_sea.height/2);
        this.addChild(background_sea2);
        
        //プレイヤーを生成
        player_sea = new PlayerSea();
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
        this.schedule(this.addItemPlusSea, 1.5);
        this.schedule(this.addItemMinusSea, 2);
        //スポンサー様看板を生成
        this.schedule(this.addSponserBoardSea, 5);
        //ゴールを生成
        this.scheduleOnce(this.addGoal, 28);
    },
    update:function(dt){
    
        switch(nowstate_sea) {
        case State_sea.GAME:
        backgroundSeaUpdate();
        //ゴールにたどり着いたら
        if(goalStop_sea) {
        //ステートをゴールに
          nowstate_sea = State_sea.GOAL;
          //プラスアイテムとマイナスアイテムの生成を停止
          this.unschedule(this.addItemPlusSea);
          this.unschedule(this.addItemMinusSea);
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
    addItemPlusSea: function(event){
      var itemPlus = new ItemPlusSea();
      itemPlus.setScale(0.2);
      this.addChild(itemPlus);
    },
    //マイナスアイテムを追加
    addItemMinusSea: function(event){
      var itemMinus = new ItemMinusSea();
      itemMinus.setScale(0.2);
      this.addChild(itemMinus);
    },
    //スポンサー様看板を追加
    addSponserBoardSea: function(event) {
      var ground = new GroundSea();
      ground.setScale(0.5);
      this.addChild(ground);
      var sponserboard = new SponserBoardSea();
      sponserboard.setScale(0.15);
      this.addChild(sponserboard);
      var sponserlogo = new SponserLogoSea();
      sponserlogo.setScale(0.2);
      //sponserlogo.setPosition(sponserboard.getPosition().x, sponserlogo.getPosition().y);
      this.addChild(sponserlogo);
    },
    //ゴールを追加
    addGoal: function() {
      //ゴール足場
      var goalground = new GoalGroundSea();
      goalground.setScale(0.7);
      this.addChild(goalground);
      var goalflag = new GoalFlagSea();
      //ゴール旗
      goalflag.setScale(0.2);
      this.addChild(goalflag);
      //ゴール仲間
      var goalchara = new GoalCharaSea();
      goalchara.setScale(0.1);
      this.addChild(goalchara);
      //スポンサー様看板の停止
      this.unschedule(this.addSponserBoardSea);
    },
    //オブジェクトを削除
    removeObject: function(object) {
      this.removeChild(object);
    },
    //タッチ用の関数
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
var ScrollingSeaBG = cc.Sprite.extend({
    //ctorはコンストラクタクラスがインスタンスされたときに必ず実行される
    ctor:function() {
        this._super();
        this.initWithFile(res.background_sea_png);
        //背景画像の描画開始位置
        this.setPosition(size_sea.width/2,size_sea.height /2 );
    },
    //onEnterメソッドはスプライト描画の際に必ず呼ばれる
    onEnter:function() {
      
    },
    scroll:function(){
      //座標を更新する
        this.setPosition(this.getPosition().x-scrollSpeed_sea,this.getPosition().y);
        
    },
    setPos:function(x, y){
      //座標を設定する
        this.setPosition(x, y);
    },
});

//重力（仮）で落下するプレイヤー
var PlayerSea = cc.Sprite.extend({
  ctor: function() {
    animflg_sea = 0;
    this._super();
    this.initWithFile(playerArray_sea[0]);
    this.ySpeed = 0; 		//プレイヤーの垂直速度
    this.engineOn = false; 	//カスタム属性追加プレイヤーのジャンプON OFF
    this.invulnerability = 0; 	//無敵モード時間初期値0
  },
  onEnter: function() {
    this.setPosition(60, size_sea.height * 0.5);
  },
  updateY: function() {
    //ジャンプ中なら
    if(this.engineOn){
      animflg_sea++;	//アニメーションを更新
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
    } else {
      this.setOpacity(255);
    }
    
    this.setPosition(this.getPosition().x, this.getPosition().y + this.ySpeed);
    this.ySpeed += gameGravity_sea;
    
    //プレイヤーが画面外にでたら、リスタートさせる
     if (this.getPosition().y < 0 || this.getPosition().y > 900) {
       
       restartGameSea();
     }
  }
});

//プラスアイテムクラス
var ItemPlusSea = cc.Sprite.extend({
  ctor: function() {
    this._super();
    //ランダムで画像を選択
    var num = Math.floor(Math.random() * itemPlusArray_sea.length);
    this.initWithFile(itemPlusArray_sea[num]);
  },
  onEnter: function() {
    this._super();
    //初期位置を設定
    this.setPosition(1200, Math.random() * 900);
    var moveAction = cc.MoveTo.create(5, new cc.Point(-100, Math.random() * 900));
    this.runAction(moveAction);
    this.scheduleUpdate();
  },
  update: function(dt) {
    //アイテムとの衝突を判定する処理
    var player_seaBoundingBox = player_sea.getBoundingBox();
    var itemBoundingBox = this.getBoundingBox();
	
	//あたり判定の範囲を変更
    player_seaBoundingBox = setCollisionScale(player_seaBoundingBox, 0.8);
	itemBoundingBox = setCollisionScale(itemBoundingBox, 0.8);
	//rectIntersectsRectは２つの矩形が交わっているかチェックする
    if (cc.rectIntersectsRect(player_seaBoundingBox, itemBoundingBox) ) {
      gameLayer_sea.removeObject(this);//アイテムを削除する
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
        //if(life_sea < 10) {
          life_sea++;
          life_seaText.setString("LIFE : " + life_sea);
        //}
      }
    }
	//画面の外にでたアイテムを消去する処理
    if (this.getPosition().x < 50) {
      gameLayer_sea.removeObject(this)
    }
  }
});

//マイナスアイテムクラス
var ItemMinusSea = cc.Sprite.extend({
  ctor: function() {
    this._super();
    //ランダムで画像を選択
    var num = Math.floor(Math.random() * itemMinusArray_sea.length);
    this.initWithFile(itemMinusArray_sea[num]);
  },
  onEnter: function() {
    this._super();
    //初期位置を設定
    this.setPosition(1200, Math.random() * 900);
    var moveAction = cc.MoveTo.create(4, new cc.Point(-100, Math.random() * 900));
    this.runAction(moveAction);
    this.scheduleUpdate();
  },
  update: function(dt) {
    //アイテムとの衝突を判定する処理
    var player_seaBoundingBox = player_sea.getBoundingBox();
    var itemBoundingBox = this.getBoundingBox();
    
    //あたり判定の範囲を変更
    player_seaBoundingBox = setCollisionScale(player_seaBoundingBox, 0.8);
	itemBoundingBox = setCollisionScale(itemBoundingBox, 0.8);
    //rectIntersectsRectは２つの矩形が交わっているかチェックする
    if (cc.rectIntersectsRect(player_seaBoundingBox, itemBoundingBox) ) {
      //アイテムを削除する
      gameLayer_sea.removeObject(this);
      //ダメージ
      damageSea();
    }
    if (this.getPosition().x < 50) {
      gameLayer_sea.removeObject(this)
    }
  }
});

//背景管理
function backgroundSeaUpdate() {
	background_sea0.scroll();
    background_sea1.scroll();
    background_sea2.scroll();
    //画面の端に到達したら反対側の座標にする
    if(background_sea0.getPosition().x < -size_sea.width/2){
        background_sea0.setPosition(background_sea2.getPosition().x+size_sea.width-10, size_sea.height/2);
    }
     if(background_sea1.getPosition().x < -size_sea.width/2){
        background_sea1.setPosition(background_sea0.getPosition().x+size_sea.width-10, size_sea.height/2);
    }
    if(background_sea2.getPosition().x < -size_sea.width/2){
        background_sea2.setPosition(background_sea1.getPosition().x+size_sea.width-10, size_sea.height/2);
    }
}

//足場クラス
var GroundSea = cc.Sprite.extend({
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
      gameLayer_sea.removeObject(this)
      }
   }
});

//看板クラス
var SponserBoardSea = cc.Sprite.extend({
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
      gameLayer_sea.removeObject(this)
      }
   }
});

//看板ロゴクラス
var SponserLogoSea = cc.Sprite.extend({
  ctor: function() {
    this._super();
    this.initWithFile(res.sponser_logo_png);
    this.setPosition(1200, 190);
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
      gameLayer_sea.removeObject(this)
      }
   }
   
});

//ゴール旗クラス
var GoalFlagSea = cc.Sprite.extend({
  ctor: function() {
    this._super();
    this.initWithFile(res.goal_flag_png);
    this.setPosition(1200, 150);
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
var GoalCharaSea = cc.Sprite.extend({
  ctor: function() {
    this._super();
    this.initWithFile(res.goal_chara_png);
    this.setPosition(1350, 100);
  },
  onEnter: function() {
    this._super();
    this.scheduleUpdate();
  },
  update: function(dt) {
      if(!goalStop_sea) {
        this.setPosition(this.getPosition().x-scrollSpeed_sea,this.getPosition().y);
      }
   }
});

//ゴール足場クラス
var GoalGroundSea = cc.Sprite.extend({
  ctor: function() {
    this._super();
    this.initWithFile(res.ground_sea_png);
    this.setPosition(1300, 50);
  },
  onEnter: function() {
    this._super();
    this.scheduleUpdate();
  },
  update: function(dt) {
      if(!goalStop_sea) {
        this.setPosition(this.getPosition().x-scrollSpeed_sea,this.getPosition().y);
      }
   }
});


//ダメージ関数
function damageSea() {
      //ライフを減らす
      life_sea--;
      life_seaText.setString("LIFE : " + life_sea);
      //ボリュームを上げる
      cc.audioEngine.setEffectsVolume(cc.audioEngine.getEffectsVolume() + 0.3);
      //効果音を再生する
      cc.audioEngine.playEffect(res.damage_se_mp3);
      //ライフが0なら
      if(life_sea < 1){
        cc.audioEngine.stopMusic();
        //gameover.score_sea = score_sea;
        //ゲームオーバー画面へ移動
        cc.director.runScene(new GameOverSeaScene());
      }
      
      player_sea.invulnerability = 100;
}

//プレイヤー元の位置に戻す
function restartGameSea() {
  damageSea();
  player_sea.ySpeed = 0;
  player_sea.setPosition(player_sea.getPosition().x, size_sea.height * 0.5);
}
