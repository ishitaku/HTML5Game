
/* 宇宙ステージ */
//stage_space.js

var size_space;			//画面のサイズ
var gameLayer_space;		//レイヤー
var background_space0;	//背景1
var background_space1;	//背景2
var background_space2;	//背景3
var scrollSpeed_space = 2.5;		//スクロール速度
var player_space;					//プレイヤー
var gameGravity_space;	//重力
var gameThrust_space;		//上昇力
var life_space;		//ライフ
var score_space = 0;		//スコア
var life_Score_space = 0;	//ライフが回復するスコア
var goalStop_space = false;		//ゴールまでついたか
var itemPlusArray_space;			//プラスアイテム配列
var itemMinusArray_space;			//マイナスアイテム配列
itemPlusArray_space = new Array(res.item_plus00_png, res.item_plus01_png);		//プラスアイテムを初期化
itemMinusArray_space = new Array(res.item_minus00_png, res.item_minus01_png);		//マイナスアイテムを初期化
var animflg_space;		//アニメーションのコマ
var playerArray_space;	//プレイヤーのアニメーション配列
playerArray_space = new Array(res.player_space01_png, res.player_space02_png, res.player_space03_png, res.player_space04_png);
var State_space = {
 GAME : 0,
 GOAL: 1
};
var nowstate_space;	//ゲームステート


//宇宙ステージのシーン
var stageSpaceScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        //重力
        gameGravity_space = GRAVITY_SPACE;
        //上昇力
        gameThrust_space = GAME_THRUST_SPACE;
        //ライフを設定
        life_space = game_life;
        //スコアを0に初期化
        score_space = game_score;
        //ライフ回復までのスコアを初期化
        life_Score_space = game_lifeup_score;
        //ゴールのフラグ
        goalStop_space = false;
        //ステートをゲームに初期化
        nowstate_space = State_space.GAME;
        //レイヤーを生成
        gameLayer_space = new gameSpace();
        //レイヤーを初期化
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

//レイヤー
var gameSpace = cc.Layer.extend({
    init:function () {
        this._super();
        //画面のサイズを取得
        size_space = cc.director.getWinSize();
        
        
       // タップイベントリスナーを登録する
                cc.eventManager.addListener({
                    event: cc.EventListener.TOUCH_ONE_BY_ONE,
                    swallowTouches: true,
                    onTouchBegan: this.onTouchBegan,
                    onTouchMoved: this.onTouchMoved,
                    onTouchEnded: this.onTouchEnded
                }, this);
	

        //スクロールする背景スプライトをインスタンススクロール速度:scrollSpeed_space
        background_space0 = new ScrollingSpaceBG();
        this.addChild(background_space0);
        background_space1 = new ScrollingSpaceBG();
        background_space1.setPos(size_space.width+size_space.width/2-10, size_space.height/2);
        this.addChild(background_space1);
        background_space2 = new ScrollingSpaceBG();
        background_space2.setPos(size_space.width*2+size_space.width/2-20, size_space.height/2);
        this.addChild(background_space2);
        
        //プレイヤーを生成
        player_space = new PlayerSpace();
        this.addChild(player_space);
        this.reorderChild(player_space, 9);
        
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
        this.schedule(this.addItemPlusSpace, 2);
        this.schedule(this.addItemMinusSpace, MINUS_TIME_DUR_SPACE);
        //スポンサー様看板を生成
        this.schedule(this.addSponserBoardSpace, SPONSER_DUR_SPACE);
        //ゴールを生成
        this.scheduleOnce(this.addGoal, GOAL_TIME_SPACE);
        
    },
    update:function(dt){
    
        switch(nowstate_space) {
        case State_space.GAME:
        backgroundSpaceUpdate();
        //ゴールにたどり着いたら
        if(goalStop_space) {
        //ステートをゴールに
          nowstate_space = State_space.GOAL;
          //プラスアイテムとマイナスアイテムの生成を停止
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
      this.addChild(itemPlus);
    },
    //マイナスアイテムを追加
    addItemMinusSpace: function(event){
      var itemMinus = new ItemMinusSpace();
      this.addChild(itemMinus);
    },
    //スポンサー様看板を追加
    addSponserBoardSpace: function(event) {
      var ground = new GroundSpace();
      this.addChild(ground);
      var sponserboard = new SponserBoardSpace();
      this.addChild(sponserboard);
      var sponserlogo = new SponserLogoSpace();
      this.addChild(sponserlogo);
    },
    //ゴールを追加
    addGoal: function() {
      //ゴール足場
      var goalground = new GoalGroundSpace();
      this.addChild(goalground);
      //ゴール旗
      var goalflag = new GoalFlagSpace();
      this.addChild(goalflag);
      //ゴール仲間
      var goalchara = new GoalCharaSpace();
      this.addChild(goalchara);
      //スポンサー様看板の停止
      this.unschedule(this.addSponserBoardSpace);
    },
    //オブジェクトを削除
    removeObject: function(object) {
      this.removeChild(object);
    },
    //タッチ用の関数
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
    //ctorはコンストラクタクラスがインスタンスされたときに必ず実行される
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
      //座標を設定する
        this.setPosition(x, y);
    },
});

//重力（仮）で落下するプレイヤー
var PlayerSpace = cc.Sprite.extend({
  ctor: function() {
    animflg_space = 0;
    this._super();
    this.initWithFile(playerArray_space[0]);
    this.ySpeed = 0; 		//プレイヤーの垂直速度
    this.engineOn = false; 	//カスタム属性追加プレイヤーのジャンプON OFF
    this.invulnerability = 0; 	//無敵モード時間初期値0
  },
  onEnter: function() {
    this.setPosition(60, size_space.height * 0.5);
    this.setScale(0.1);
  },
  updateY: function() {
    //ジャンプ中なら
    if(this.engineOn){
      animflg_space++;	//アニメーションを更新
      if(animflg_space >= 20) {
      animflg_space = 0;
      }
      
      this.initWithFile(playerArray_space[Math.floor(animflg_space/5)]);
      this.ySpeed += gameThrust_space;
      
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
    this.ySpeed += gameGravity_space;
    
    //プレイヤーが画面外にでたら、リスタートさせる
     if (this.getPosition().y < 0 || this.getPosition().y > 900) {
       
       restartGameSpace();
     }
  }
});

//プラスアイテムクラス
var ItemPlusSpace = cc.Sprite.extend({
  ctor: function() {
    this._super();
    //ランダムで画像を選択
    var num = Math.floor(Math.random() * itemPlusArray_space.length);
    this.initWithFile(itemPlusArray_space[num]);
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
    //アイテムとの衝突を判定する処理
    var player_spaceBoundingBox = player_space.getBoundingBox();
    
    player_spaceBoundingBox = setCollisionScale(player_spaceBoundingBox, 0.8);
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
      if(life_Score_space >= LIFE_UP_SCORE) {
        life_Score_space -= LIFE_UP_SCORE;
        //if(life_space < 10) {
          life_space++;
          life_spaceText.setString("LIFE : " + life_space);
        //}
      }
    }
	//画面の外にでたアイテムを消去する処理
    if (this.getPosition().x < -50) {
      gameLayer_space.removeObject(this)
    }
  }
});

//マイナスアイテムクラス
var ItemMinusSpace = cc.Sprite.extend({
  ctor: function() {
    this._super();
    //ランダムで画像を選択
    var num = Math.floor(Math.random() * itemMinusArray_space.length);
    this.initWithFile(itemMinusArray_space[num]);
  },
  onEnter: function() {
    this._super();
    //初期位置を設定
    this.setPosition(1200, Math.random() * 900);
    var moveAction = cc.MoveTo.create(MINUS_SPEED_SEC_SPACE, new cc.Point(-100, Math.random() * 900));
    this.runAction(moveAction);
    this.setScale(0.2);
    this.scheduleUpdate();
  },
  update: function(dt) {
    //アイテムとの衝突を判定する処理
    var player_spaceBoundingBox = player_space.getBoundingBox();
    var itemBoundingBox = this.getBoundingBox();
    //あたり判定の範囲を変更
    //player_spaceBoundingBox = setCollisionScale(player_spaceBoundingBox, 0.8);
	itemBoundingBox = setCollisionScale(itemBoundingBox, 0.5);
    
    //rectIntersectsRectは２つの矩形が交わっているかチェックする
    if (cc.rectIntersectsRect(player_spaceBoundingBox, itemBoundingBox) && player_space.invulnerability == 0) {
      //アイテムを削除する
      gameLayer_space.removeObject(this);
      //ダメージ
      damageSpace();
    }
    if (this.getPosition().x < -50) {
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
        background_space0.setPosition(background_space2.getPosition().x+size_space.width-10, size_space.height/2);
    }
     if(background_space1.getPosition().x < -size_space.width/2){
        background_space1.setPosition(background_space0.getPosition().x+size_space.width-10, size_space.height/2);
    }
    if(background_space2.getPosition().x < -size_space.width/2){
        background_space2.setPosition(background_space1.getPosition().x+size_space.width-10, size_space.height/2);
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
    this.setScale(0.5);
    this.scheduleUpdate();
  },
  update: function(dt) {
      //座標を更新する
        this.setPosition(this.getPosition().x-scrollSpeed_space,this.getPosition().y);
      //画面の外にでたアイテムを消去する処理
      if (this.getPosition().x < -50) {
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
    this.setScale(0.15);
    this.scheduleUpdate();
  },
  update: function(dt) {
      //座標を更新する
        this.setPosition(this.getPosition().x-scrollSpeed_space,this.getPosition().y);
      //画面の外にでたアイテムを消去する処理
      if (this.getPosition().x < -50) {
      gameLayer_space.removeObject(this)
      }
   }
});

//看板ロゴクラス
var SponserLogoSpace = cc.Sprite.extend({
  ctor: function() {
    this._super();
    this.initWithFile(res.sponser_logo_png);
    this.setPosition(1200, 190);
  },
  onEnter: function() {
    this._super();
    //var moveAction = cc.MoveTo.create(5, new cc.Point(-100, this.getPosition().y));
    //this.runAction(moveAction);
    this.setScale(0.2);
    this.scheduleUpdate();
  },
  update: function(dt) {
      //座標を更新する
        this.setPosition(this.getPosition().x-scrollSpeed_space,this.getPosition().y);
      //画面の外にでたアイテムを消去する処理
      if (this.getPosition().x < -50) {
      gameLayer_space.removeObject(this)
      }
   }
   
});

//ゴール旗クラス
var GoalFlagSpace = cc.Sprite.extend({
  ctor: function() {
    this._super();
    this.initWithFile(res.goal_flag_png);
    this.setPosition(1200, 150);
  },
  onEnter: function() {
    this._super();
    this.setScale(0.2);
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
        setGameData(life_space, score_space, life_Score_space);
        //クリア画面へ移動
        cc.director.runScene(new StageClearSpaceScene());
      }
   }
   
});

//ゴール仲間クラス
var GoalCharaSpace = cc.Sprite.extend({
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
      if(!goalStop_space) {
        this.setPosition(this.getPosition().x-scrollSpeed_space,this.getPosition().y);
      }
   }
});

//ゴール足場クラス
var GoalGroundSpace = cc.Sprite.extend({
  ctor: function() {
    this._super();
    this.initWithFile(res.ground_space_png);
    this.setPosition(1300, 50);
  },
  onEnter: function() {
    this._super();
    this.setScale(0.7);
    this.scheduleUpdate();
  },
  update: function(dt) {
      if(!goalStop_space) {
        this.setPosition(this.getPosition().x-scrollSpeed_space,this.getPosition().y);
      }
   }
});


//ダメージ関数
function damageSpace() {
      //ライフを減らす
      life_space--;
      life_spaceText.setString("LIFE : " + life_space);
      //ボリュームを上げる
      cc.audioEngine.setEffectsVolume(cc.audioEngine.getEffectsVolume() + 0.3);
      //効果音を再生する
      cc.audioEngine.playEffect(res.damage_se_mp3);
      //ライフが0なら
      if(life_space < 1){
        cc.audioEngine.stopMusic();
        setGameData(5, score_space, life_Score_space);
        //ゲームオーバー画面へ移動
        cc.director.runScene(new GameOverSpaceScene());
        
      }
      
      player_space.invulnerability = 100;
}

//プレイヤー元の位置に戻す
function restartGameSpace() {
  damageSpace();
  player_space.ySpeed = 0;
  player_space.setPosition(player_space.getPosition().x, size_space.height * 0.5);
}



