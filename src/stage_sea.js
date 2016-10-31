﻿
/* 海ステージ */
//stage_sea.js

var size_sea;			//画面のサイズ
var gameLayer_sea;		//レイヤー
var background_sea0;	//背景1
var background_sea1;	//背景2
var background_sea2;	//背景3
var back_dur_sea = 0;		//背景間隔
var scrollSpeed_sea = 2.5;		//スクロール速度
var player_sea;					//プレイヤー
var gameGravity_sea;	//重力
var gameThrust_sea;		//上昇力
var life_sea;		//ライフ
var score_sea = 0;		//スコア
var life_Score_sea = 0;	//ライフが回復するスコア
var goalStop_sea = false;		//ゴールまでついたか
var gameover_sea = false;	//ゲームオーバーか
var gameclear_sea = false;	//ゲームクリアか
var itemPlusArray_sea;			//プラスアイテム配列
var itemMinusArray_sea;			//マイナスアイテム配列
itemPlusArray_sea = new Array(res.item_plus00_png, res.item_plus01_png);		//プラスアイテムを初期化
itemMinusArray_sea = new Array(res.item_minus00_png, res.item_minus01_png);		//マイナスアイテムを初期化
var animflg_sea;		//アニメーションのコマ
var playerArray_sea;	//プレイヤーのアニメーション配列
playerArray_sea = new Array(res.player_sea01_png, res.player_sea02_png, res.player_sea03_png, res.player_sea04_png);
var State_sea = {
 GAME : 0,
 GOAL: 1,
 GAMEOVER : 2,
 GAMECLEAR : 3
};
var nowstate_sea;	//ゲームステート
var gameover_wait_sea = 0;		//経過時間
var GAMEOVER_WAIT_TIME_SEA = 1;	//ゲームオーバーまでの時間
var gameclear_wait_sea = 0;		//経過時間
var GAMECLEAR_WAIT_TIME_SEA = 1;	//ゲームクリアまでの時間

//海ステージのシーン
var stageSeaScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        //重力
        gameGravity_sea = GRAVITY_SEA;
        //上昇力
        gameThrust_sea = GAME_THRUST_SEA;
        //ライフを設定
        life_sea = game_life;
        //スコアを0に初期化
        score_sea = game_score;
        //ライフ回復までのスコアを初期化
        life_Score_sea = game_lifeup_score;
        //ゴールのフラグ
        goalStop_sea = false;
        //ゲームオーバーのフラグ
        gameover_sea = false;
        //ゲームクリアのフラグ
        gameclear_sea = false;
        //ステートをゲームに初期化
        nowstate_sea = State_sea.GAME;
        //ゲームオーバーの経過時間を0
        gameover_wait_sea = 0;
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
        background_sea0.setPos(0, size_sea.height/2);
        background_sea0.setScale(0.7);
        this.addChild(background_sea0);
        back_dur_sea = background_sea0.getContentSize().width * 0.7;
        background_sea1 = new ScrollingSeaBG();
        background_sea1.setPos(back_dur_sea, size_sea.height/2);
        background_sea1.setScale(0.7);
        this.addChild(background_sea1);
        background_sea2 = new ScrollingSeaBG();
        background_sea2.setPos(background_sea1.getPosition().x + back_dur_sea, size_sea.height/2);
        background_sea2.setScale(0.7);
        this.addChild(background_sea2);
        
        //プレイヤーを生成
        player_sea = new PlayerSea();
        this.addChild(player_sea);
        this.reorderChild(player_sea, 9);
        
        // 残機表示
        life_seaText = cc.LabelTTF.create("LIFE : " +life_sea ,"Arial","50",cc.TEXT_ALIGNMENT_CENTER);
        this.addChild(life_seaText);
        life_seaText.setPosition(100,850);
        life_seaText.setColor(textcolor_sea);
        this.reorderChild(life_seaText, 10);

        //スコア表示
        score_seaText = cc.LabelTTF.create("SCORE : " +score_sea ,"Arial","50",cc.TEXT_ALIGNMENT_CENTER);
        this.addChild(score_seaText);
        score_seaText.setPosition(450,850);
        score_seaText.setColor(cc.color(textcolor_sea));
        this.reorderChild(score_seaText, 10);

        //scheduleUpdate関数は、描画の都度、update関数を呼び出す
        this.scheduleUpdate();

        //アイテム生成
        this.schedule(this.addItemPlusSea, 2);
        this.schedule(this.addItemMinusSea, MINUS_TIME_DUR_SEA);
        //スポンサー様看板を生成
        this.schedule(this.addSponserBoardSea, SPONSER_DUR_SEA);
        //ゴールを生成
        this.scheduleOnce(this.addGoal, GOAL_TIME_SEA);
        
    },
    //更新処理
    update:function(dt){
        switch(nowstate_sea) {
        case State_sea.GAME:
          player_sea.updateY();
          backgroundSeaUpdate();
          //ゴールにたどり着いたら
          if(goalStop_sea) {
            //ステートをゴールに
            nowstate_sea = State_sea.GOAL;
            //プラスアイテムとマイナスアイテムの生成を停止
            this.unschedule(this.addItemPlusSea);
            this.unschedule(this.addItemMinusSea);
          }
          //ゲームオーバーなら
          if(gameover_sea) {
            nowstate_sea = State_sea.GAMEOVER;
            //各要素の生成を停止
            this.unschedule(this.addItemPlusSea);
            this.unschedule(this.addItemMinusSea);
            this.unschedule(this.addSponserBoardSea);
            this.unschedule(this.addGoal);
          }
          //ゲームクリアなら
          if(gameclear_sea) {
            nowstate_sea = State_sea.GAMECLEAR;
            //各要素の生成を停止
            this.unschedule(this.addItemPlusSea);
            this.unschedule(this.addItemMinusSea);
            this.unschedule(this.addSponserBoardSea);
            this.unschedule(this.addGoal);
          }
          break;
          //ゴールまでたどり着いたら
          case State_sea.GOAL:
            player_sea.updateY();
            if(gameclear_sea) {
              nowstate_sea = State_sea.GAMECLEAR;
              //各要素の生成を停止
              this.unschedule(this.addItemPlusSea);
              this.unschedule(this.addItemMinusSea);
              this.unschedule(this.addSponserBoardSea);
              this.unschedule(this.addGoal);
            }
            break;
          //ゲームオーバー
          case State_sea.GAMEOVER:
            gameover_wait_sea += dt;
            //一定時間経過したら
            if(gameover_wait_sea > GAMEOVER_WAIT_TIME_SEA) {
              //ゲームオーバー画面へ移動
              cc.director.runScene(new GameOverSeaScene());
            }
            break;
          //ゲームクリア
          case State_sea.GAMECLEAR:
            gameclear_wait_sea += dt;
            //一定時間経過したら
            if(gameclear_wait_sea > GAMECLEAR_WAIT_TIME_SEA) {
              //ステージクリア画面へ移動
              cc.director.runScene(new StageClearSeaScene());
            }
            break;
          
          default:
          break;
        }
        
    },
    //プラスアイテムを追加
    addItemPlusSea: function(event){
      var itemPlus = new ItemPlusSea();
      this.addChild(itemPlus);
    },
    //マイナスアイテムを追加
    addItemMinusSea: function(event){
      var itemMinus = new ItemMinusSea();
      this.addChild(itemMinus);
    },
    //スポンサー様看板を追加
    addSponserBoardSea: function(event) {
      var ground = new GroundSea();
      this.addChild(ground);
      var sponserboard = new SponserBoardSea();
      this.addChild(sponserboard);
      var sponserlogo = new SponserLogoSea();
      this.addChild(sponserlogo);
    },
    //ゴールを追加
    addGoal: function() {
      //ゴール足場
      var goalground = new GoalGroundSea();
      this.addChild(goalground);
      //ゴール旗
      var goalflag = new GoalFlagSea();
      this.addChild(goalflag);
      //ゴール仲間
      var goalchara = new GoalCharaSea();
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
    this.setPosition(100, size_sea.height * 0.5);
    //this.setScale(0.12);
  },
  updateY: function() {
    //ジャンプ中なら
    if(this.engineOn){
      animflg_sea++;	//アニメーションを更新
      if(animflg_sea >= 20) {
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
      this.invulnerability = 0;
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
    //var num = Math.floor(Math.random() * itemPlusArray_sea.length);
    //this.initWithFile(itemPlusArray_sea[num]);
    this.point = 10;
    //ランダムで画像を選択
    var num = Math.floor(Math.random() * 10);
    switch(num) {
    case 0:
    this.point = 50;
    break;
    default:
    this.point = 10;
    num = Math.floor(Math.random() * (itemPlusArray_sea.length - 1) + 1);
    break;
    }
    this.initWithFile(itemPlusArray_sea[num]);
  },
  onEnter: function() {
    this._super();
    //初期位置を設定
    this.setPosition(1200, Math.random() * 900);
    var moveAction = cc.MoveTo.create(5, new cc.Point(-100, Math.random() * 900));
    this.runAction(moveAction);
    this.setScale(0.2);
    this.scheduleUpdate();
  },
  update: function(dt) {
    if(gameover_sea || gameclear_sea) {
      this.stopAllActions();
      return;
    }
    //アイテムとの衝突を判定する処理
    var player_seaBoundingBox = player_sea.getBoundingBox();
    
    player_seaBoundingBox = setCollisionScale(player_seaBoundingBox, 0.8);
    var itemBoundingBox = this.getBoundingBox();
	
	//rectIntersectsRectは２つの矩形が交わっているかチェックする
    if (cc.rectIntersectsRect(player_seaBoundingBox, itemBoundingBox) ) {
      gameLayer_sea.removeObject(this);//アイテムを削除する
      //ボリュームを上げる
      cc.audioEngine.setEffectsVolume(cc.audioEngine.getEffectsVolume() + 0.3);
      //効果音を再生する
      cc.audioEngine.playEffect(res.plus_se_mp3);
      
      //スコア追加処理
      //score_sea += 10;
      score_sea += this.point;
      score_seaText.setString("SCORE : " + score_sea);
      life_Score_sea += this.point;
      if(life_Score_sea >= LIFE_UP_SCORE) {
        life_Score_sea -= LIFE_UP_SCORE;
        life_sea++;
        life_seaText.setString("LIFE : " + life_sea);
      }
    }
	//画面の外にでたアイテムを消去する処理
    if (this.getPosition().x < -50) {
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
    var moveAction = cc.MoveTo.create(MINUS_SPEED_SEC_SEA, new cc.Point(-100, Math.random() * 900));
    this.runAction(moveAction);
    this.setScale(0.2);
    this.scheduleUpdate();
  },
  update: function(dt) {
    if(gameover_sea || gameclear_sea) {
      this.stopAllActions();
      return;
    }
    //アイテムとの衝突を判定する処理
    var player_seaBoundingBox = player_sea.getBoundingBox();
    var itemBoundingBox = this.getBoundingBox();
    //あたり判定の範囲を変更
	itemBoundingBox = setCollisionScale(itemBoundingBox, 0.3);
    
    //rectIntersectsRectは２つの矩形が交わっているかチェックする
    if (cc.rectIntersectsRect(player_seaBoundingBox, itemBoundingBox) && player_sea.invulnerability == 0) {
      //アイテムを削除する
      //gameLayer_sea.removeObject(this);
      //ダメージ
      damageSea();
    }
    if (this.getPosition().x < -50) {
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
        background_sea0.setPosition(background_sea2.getPosition().x+back_dur_sea, size_sea.height/2);
    }
     if(background_sea1.getPosition().x < -size_sea.width/2){
        background_sea1.setPosition(background_sea0.getPosition().x+back_dur_sea, size_sea.height/2);
    }
    if(background_sea2.getPosition().x < -size_sea.width/2){
        background_sea2.setPosition(background_sea1.getPosition().x+back_dur_sea, size_sea.height/2);
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
    this.setScale(0.5);
    this.scheduleUpdate();
  },
  update: function(dt) {
      if(gameover_sea || gameclear_sea) {
      return;
    }
      //座標を更新する
        this.setPosition(this.getPosition().x-scrollSpeed_sea,this.getPosition().y);
      //画面の外にでたアイテムを消去する処理
      if (this.getPosition().x < -50) {
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
    this.setScale(0.1);
    this.scheduleUpdate();
  },
  update: function(dt) {
      if(gameover_sea || gameclear_sea) {
      return;
    }
      //座標を更新する
        this.setPosition(this.getPosition().x-scrollSpeed_sea,this.getPosition().y);
      //画面の外にでたアイテムを消去する処理
      if (this.getPosition().x < -50) {
      gameLayer_sea.removeObject(this)
      }
   }
});

//看板ロゴクラス
var SponserLogoSea = cc.Sprite.extend({
  ctor: function() {
    this._super();
    this.initWithFile(res.sponser_logo_png);
    this.setPosition(1200, 170);
  },
  onEnter: function() {
    this._super();
    //var moveAction = cc.MoveTo.create(5, new cc.Point(-100, this.getPosition().y));
    //this.runAction(moveAction);
    this.setScale(0.2);
    this.scheduleUpdate();
  },
  update: function(dt) {
      if(gameover_sea || gameclear_sea) {
      return;
    }
      //座標を更新する
        this.setPosition(this.getPosition().x-scrollSpeed_sea,this.getPosition().y);
      //画面の外にでたアイテムを消去する処理
      if (this.getPosition().x < -50) {
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
    this.setScale(0.15);
    this.scheduleUpdate();
  },
  update: function(dt) {
      if(gameover_sea || gameclear_sea) {
      return;
      }
      //ゴールについていたら停止
      if(!goalStop_sea) {
        this.setPosition(this.getPosition().x-scrollSpeed_sea,this.getPosition().y);
      }
      //ゴールについたか
      if (player_sea.getPosition().x > this.getPosition().x - 50) {
        goalStop_sea = true;
      }
      var player_seaBoundingBox = player_sea.getBoundingBox();
      var flagBoundingBox = this.getBoundingBox();
      flagBoundingBox = setCollisionScale(flagBoundingBox, 0.3);
      flagBoundingBox = setCollisionPosition(flagBoundingBox, flagBoundingBox.x, flagBoundingBox.y - 130);
      
      //rectIntersectsRectは２つの矩形が交わっているかチェックする
      if (cc.rectIntersectsRect(player_seaBoundingBox, flagBoundingBox) ) {
        
        cc.audioEngine.stopMusic();
        setGameData(life_sea, score_sea, life_Score_sea);
        //クリア画面へ移動
        //cc.director.runScene(new StageClearSeaScene());
        gameclear_sea = true;
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
    this.setScale(0.1);
    this.scheduleUpdate();
  },
  update: function(dt) {
      if(gameover_sea || gameclear_sea) {
      return;
    }
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
    this.setScale(0.7);
    this.scheduleUpdate();
  },
  update: function(dt) {
      if(gameover_sea || gameclear_sea) {
      return;
    }
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
        setGameData(5, score_sea, life_Score_sea);
        //ゲームオーバー画面へ移動
        //cc.director.runScene(new GameOverSeaScene());
        gameover_sea = true;
      } else {
        player_sea.invulnerability = 100;
      }
}

//プレイヤー元の位置に戻す
function restartGameSea() {
  damageSea();
  if(gameover_sea) {
    return;
  }
  player_sea.ySpeed = 0;
  player_sea.setPosition(player_sea.getPosition().x, size_sea.height * 0.5);
}



