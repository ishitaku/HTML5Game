/*
var score;
var life;
var gameLayer;
var scrollSpeed = 1;


var gameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        life = 3;
        score = 0;
        gameLayer = new game();
        gameLayer.init();
        this.addChild(gameLayer);
    }
});

var game = cc.Layer.extend({
    init:function () {
        this._super();
        size = cc.director.getWinSize();
        
        //スクロールする背景スプライトをインスタンス　スクロール速度:scrollSpeed
        background = new ScrollingBG();
        this.addChild(background);

        
        //scheduleUpdate関数は、描画の都度、update関数を呼び出す
        this.scheduleUpdate();
        
        //ボタン
                //ボタンの背景
        var bgButton = new cc.Scale9Sprite(res.button_png);
        var bgHighlightedButton = new cc.Scale9Sprite(res.buttonback_png);
 
        //ボタンのラベル
        var title = new cc.LabelTTF("Button", "Marker Felt", 30);
        title.color = cc.color(159, 168, 176);
 
        //ボタン
        var button = new cc.ControlButton(title, bgButton);
        button.setBackgroundSpriteForState(bgHighlightedButton, cc.CONTROL_STATE_HIGHLIGHTED);
        button.setTitleColorForState(cc.color.WHITE, cc.CONTROL_STATE_HIGHLIGHTED);
        button.setPosition(size.width / 2, size.height / 2);
        button.zoomOnTouchDown = false;
 
        //イベント
        button.addTargetWithActionForControlEvents(this, this.touchDownAction, cc.CONTROL_EVENT_TOUCH_DOWN);
        button.addTargetWithActionForControlEvents(this, this.touchDragInsideAction, cc.CONTROL_EVENT_TOUCH_DRAG_INSIDE);
        button.addTargetWithActionForControlEvents(this, this.touchDragOutsideAction, cc.CONTROL_EVENT_TOUCH_DRAG_OUTSIDE);
        button.addTargetWithActionForControlEvents(this, this.touchDragEnterAction, cc.CONTROL_EVENT_TOUCH_DRAG_ENTER);
        button.addTargetWithActionForControlEvents(this, this.touchDragExitAction, cc.CONTROL_EVENT_TOUCH_DRAG_EXIT);
        button.addTargetWithActionForControlEvents(this, this.touchUpInsideAction, cc.CONTROL_EVENT_TOUCH_UP_INSIDE);
        button.addTargetWithActionForControlEvents(this, this.touchUpOutsideAction, cc.CONTROL_EVENT_TOUCH_UP_OUTSIDE);
        button.addTargetWithActionForControlEvents(this, this.touchCancelAction, cc.CONTROL_EVENT_TOUCH_CANCEL);
 
        this.addChild(button);
 
        return true;
    },
 
    touchDownAction:function (sender, controlEvent) {
        cc.log("touchDownAction");
        
    },
    touchDragInsideAction:function (sender, controlEvent) {
        cc.log("touchDragInsideAction");
    },
    touchDragOutsideAction:function (sender, controlEvent) {
        cc.log("touchDragOutsideAction");
    },
    touchDragEnterAction:function (sender, controlEvent) {
        cc.log("touchDragEnterAction");
    },
    touchDragExitAction:function (sender, controlEvent) {
        cc.log("touchDragExitAction");
    },
    touchUpInsideAction:function (sender, controlEvent) {
        cc.log("touchUpInsideAction");
        location.href = "https://www.google.co.jp/";
    },
    touchUpOutsideAction:function (sender, controlEvent) {
        cc.log("touchUpOutsideAction");
    },
    touchCancelAction:function (sender, controlEvent) {
        cc.log("touchCancelAction");
    },
    
    update:function(dt){
      //background・その他のscrollメソッドを呼び出す
        background.scroll();
    },
});

//スクロール移動する背景クラス
var ScrollingBG = cc.Sprite.extend({
    //ctorはコンストラクタ　クラスがインスタンスされたときに必ず実行される
    ctor:function() {
        this._super();
        this.initWithFile(res.background_png);
    },
    //onEnterメソッドはスプライト描画の際に必ず呼ばれる
    onEnter:function() {
      //背景画像の描画開始位置 横960の画像の中心が、画面の端に設置される
      this.setPosition(size.width,size.height /2 );
      //  this.setPosition(480,160);
    },
    scroll:function(){
      //座標を更新する
        this.setPosition(this.getPosition().x-scrollSpeed,this.getPosition().y);
        //画面の端に到達したら反対側の座標にする
        if(this.getPosition().x<0){
            this.setPosition(this.getPosition().x+320,this.getPosition().y);
        }
    }
});

*/


//app.js

var size;
var mylabel;
var gameLayer;
var background;
var rock_above;
var rock_under;
var ceiling;
var land;
var scrollSpeed = 1;
var scrollSpeed2 = 1.5;
var scrollSpeed3 = 2;
var shrimp;
var gameGravity = -0.05;
var gameThrust = 0.1;
var life = 3;
var score = 0;
var itemArray;
itemArray = new Array(res.nagoya0_png, res.nagoya1_png, res.nagoya2_png, res.nagoya3_png, res.nagoya4_png, res.nagoya5_png, res.nagoya6_png);
var ebiflg;
var ebiArray;
ebiArray = new Array(res.shrimp0_png, res.shrimp1_png, res.shrimp2_png, res.shrimp3_png);

var emitter;
var emitter2;

var gameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        life = 3;
        score = 0;
        gameLayer = new game();
        gameLayer.init();
        this.addChild(gameLayer);
/*
        //音楽再生エンジン
    audioEngine = cc.audioEngine;
    //bgm再生
    if (!audioEngine.isMusicPlaying()) {
      audioEngine.playMusic(res.bgm_main, true);
    }*/
    }
});

var game = cc.Layer.extend({
    init:function () {
        this._super();
        size = cc.director.getWinSize();
        // mylabel = cc.LabelTTF.create("GO!", "Arial", "32");
        // mylabel.setPosition(size.width / 2, size.height / 2);
        // this.addChild(mylabel);
/*
        //エビちゃんを操作
   cc.eventManager.addListener({
           event: cc.EventListener.MOUSE,
           onMouseDown: function(event){
               shrimp.engineOn = true;
           },
           onMouseUp: function(event){
               shrimp.engineOn = false;
           }
       },this)*/
       
       // タップイベントリスナーを登録する
                cc.eventManager.addListener({
                    event: cc.EventListener.TOUCH_ONE_BY_ONE,
                    swallowTouches: true,
                    onTouchBegan: this.onTouchBegan,
                    onTouchMoved: this.onTouchMoved,
                    onTouchEnded: this.onTouchEnded
                }, this);
	

        //スクロールする背景スプライトをインスタンス　スクロール速度:scrollSpeed
        background = new ScrollingBG();
        this.addChild(background);

        //スクロールする背景スプライトをインスタンス2　スクロール速度:scrollSpeed2
        rock_above = new ScrollingRA();
        this.addChild(rock_above);

        //スクロールする背景スプライトをインスタンス3　スクロール速度:scrollSpeed2
        rock_under = new ScrollingRU();
        this.addChild(rock_under);

        //スクロールする背景スプライトをインスタンス4　スクロール速度:scrollSpeed3
        ceiling = new ScrollingCE();
        this.addChild(ceiling);

        //スクロールする背景スプライトをインスタンス5　スクロール速度:scrollSpeed3
        land = new ScrollingLA();
        this.addChild(land);

        shrimp = new Shrimp();
        this.addChild(shrimp);

        // 残機表示
        lifeText = cc.LabelTTF.create("LIFE : " +life ,"Arial","30",cc.TEXT_ALIGNMENT_CENTER);
        this.addChild(lifeText);
        lifeText.setPosition(70,540);
        lifeText.setColor(cc.color(0, 0, 0, 255));
        this.reorderChild(lifeText, 10);

        //スコア表示
        scoreText = cc.LabelTTF.create("SCORE : " +score ,"Arial","30",cc.TEXT_ALIGNMENT_CENTER);
        this.addChild(scoreText);
        scoreText.setPosition(220,540);
        scoreText.setColor(cc.color(0, 0, 0, 255));
        this.reorderChild(scoreText, 10);
/*
        //パーティクル設定
        emitter = cc.ParticleMeteor.create();
        this.addChild(emitter, 1);
        var myTexture = cc.textureCache.addImage(res.particle_png);
        emitter.setTexture(myTexture);
        emitter.setStartSize(20);
        emitter.setEndSize(30);*/
/*
        emitter2 = cc.ParticleMeteor.create();
        this.addChild(emitter2, 1);
        var myTexture2 = cc.textureCache.addImage(res.particle2_png);
        emitter2.setTexture(myTexture2);
        emitter2.setStartSize(20);
        emitter2.setEndSize(30);
*/
        //scheduleUpdate関数は、描画の都度、update関数を呼び出す
        this.scheduleUpdate();

        //アイテム生成
        this.schedule(this.addItem, 0.5);

        //サンゴの生成で追加
        this.schedule(this.addCoral_u, 2.0);
        this.schedule(this.addCoral_a, 3.5);

    },
    update:function(dt){
      //background・その他のscrollメソッドを呼び出す
        background.scroll();
        rock_above.scroll();
        rock_under.scroll();
        ceiling.scroll();
        land.scroll();
        shrimp.updateY();

    },

    addItem: function(event){
      var item = new Item();
      this.addChild(item);
    },
    addCoral_u: function(event) {
      var coral = new Coral_under();
      this.addChild(coral);
    },
    addCoral_a: function(event) {
      var coral = new Coral_above();
      this.addChild(coral);
    },
    removeCoral: function(coral) {
      this.removeChild(coral);
    },
    onTouchBegan: function(touch, event) {
	shrimp.engineOn = true;
        return true;
      },
      onTouchMoved: function(touch, event) {},
      onTouchEnded: function(touch, event) {
        shrimp.engineOn = false;
      },
    
});
//スクロール移動する背景クラス
var ScrollingBG = cc.Sprite.extend({
    //ctorはコンストラクタ　クラスがインスタンスされたときに必ず実行される
    ctor:function() {
        this._super();
        this.initWithFile(res.background_png);
    },
    //onEnterメソッドはスプライト描画の際に必ず呼ばれる
    onEnter:function() {
      //背景画像の描画開始位置 横960の画像の中心が、画面の端に設置される
      this.setPosition(size.width,size.height /2 );
      //  this.setPosition(480,160);
    },
    scroll:function(){
      //座標を更新する
        this.setPosition(this.getPosition().x-scrollSpeed,this.getPosition().y);
        //画面の端に到達したら反対側の座標にする
        if(this.getPosition().x<0){
            this.setPosition(this.getPosition().x+320,this.getPosition().y);
        }
    }
});

//スクロール移動する岩クラス1
var ScrollingRA = cc.Sprite.extend({
    //ctorはコンストラクタ　クラスがインスタンスされたときに必ず実行される
    ctor:function() {
        this._super();
        this.initWithFile(res.rock_above_png);
    },
    //onEnterメソッドはスプライト描画の際に必ず呼ばれる
    onEnter:function() {
      //背景画像の描画開始位置 横960の画像の中心が、画面の端に設置される
      this.setPosition(size.width,size.height-82 );
      //  this.setPosition(480,160);
    },
    scroll:function(){
      //座標を更新する
        this.setPosition(this.getPosition().x-scrollSpeed2,this.getPosition().y);
        //画面の端に到達したら反対側の座標にする
        if(this.getPosition().x<0){
            this.setPosition(this.getPosition().x+320,this.getPosition().y);
        }
    }
});

//スクロール移動する岩クラス2
var ScrollingRU = cc.Sprite.extend({
    //ctorはコンストラクタ　クラスがインスタンスされたときに必ず実行される
    ctor:function() {
        this._super();
        this.initWithFile(res.rock_under_png);
    },
    //onEnterメソッドはスプライト描画の際に必ず呼ばれる
    onEnter:function() {
      //背景画像の描画開始位置 横960の画像の中心が、画面の端に設置される
      this.setPosition(size.width,117 );
      //  this.setPosition(480,160);
    },
    scroll:function(){
      //座標を更新する
        this.setPosition(this.getPosition().x-scrollSpeed2,this.getPosition().y);
        //画面の端に到達したら反対側の座標にする
        if(this.getPosition().x<0){
            this.setPosition(this.getPosition().x+320,this.getPosition().y);
        }
    }
});

//スクロール移動する地面クラス1
var ScrollingCE = cc.Sprite.extend({
    //ctorはコンストラクタ　クラスがインスタンスされたときに必ず実行される
    ctor:function() {
        this._super();
        this.initWithFile(res.ceiling_png);
    },
    //onEnterメソッドはスプライト描画の際に必ず呼ばれる
    onEnter:function() {
      //背景画像の描画開始位置 横960の画像の中心が、画面の端に設置される
      this.setPosition(size.width,size.height-57 );
      //  this.setPosition(480,160);
    },
    scroll:function(){
      //座標を更新する
        this.setPosition(this.getPosition().x-scrollSpeed3,this.getPosition().y);
        //画面の端に到達したら反対側の座標にする
        if(this.getPosition().x<0){
            this.setPosition(this.getPosition().x+320,this.getPosition().y);
        }
    }
});

//スクロール移動する地面クラス2
var ScrollingLA = cc.Sprite.extend({
    //ctorはコンストラクタ　クラスがインスタンスされたときに必ず実行される
    ctor:function() {
        this._super();
        this.initWithFile(res.land_png);
    },
    //onEnterメソッドはスプライト描画の際に必ず呼ばれる
    onEnter:function() {
      //背景画像の描画開始位置 横960の画像の中心が、画面の端に設置される
      this.setPosition(size.width,57 );
      //  this.setPosition(480,160);
    },
    scroll:function(){
      //座標を更新する
        this.setPosition(this.getPosition().x-scrollSpeed3,this.getPosition().y);
        //画面の端に到達したら反対側の座標にする
        if(this.getPosition().x<0){
            this.setPosition(this.getPosition().x+320,this.getPosition().y);
        }
    }
});

//重力（仮）で落下する　エビちゃん　
var Shrimp = cc.Sprite.extend({
  ctor: function() {
    ebiflg = 0;
    this._super();
    this.initWithFile(ebiArray[0]);
    this.ySpeed = 0; //エビちゃんの垂直速度

    this.engineOn = false; //カスタム属性追加　エビちゃんのジャンプON OFF
    this.invulnerability = 0; //無敵モード時間　初期値0
  },
  onEnter: function() {
    this.setPosition(60, size.height * 0.5);
  },
  updateY: function() {
    if(this.engineOn){
      ebiflg++;
      if(ebiflg == 4) ebiflg = 0;
      this.initWithFile(ebiArray[ebiflg]);
      this.ySpeed += gameThrust;
      //emitter.setPosition(this.getPosition().x - 25, this.getPosition().y);
    }else {
      //emitter.setPosition(this.getPosition().x - 250, this.getPosition().y);
   }
    //無敵モード中の視覚効果
    if (this.invulnerability > 0) {
      this.invulnerability--;
      this.setOpacity(255 - this.getOpacity());
    }


    this.setPosition(this.getPosition().x, this.getPosition().y + this.ySpeed);
    this.ySpeed += gameGravity;

    //エビちゃんが画面外にでたら、リスタートさせる
     if (this.getPosition().y < 0 || this.getPosition().y > 568) {
       life--;
       lifeText.setString("LIFE : " + life);
       if(life < 1){
         //audioEngine.stopMusic();
         gameover.score = score;
         cc.director.runScene(new gameover());
       }
       restartGame();
     }
  }
});

// 下サンゴクラス
var Coral_under = cc.Sprite.extend({
  ctor: function() {
    this._super();
    this.initWithFile(res.coral_under_png);
  },
  onEnter: function() {
    this._super();
    this.setPosition(600, Math.random(5) * 100);
    var moveAction = cc.MoveTo.create(6, new cc.Point(-100, -150));
    this.runAction(moveAction);
    this.scheduleUpdate();
  },
  update: function(dt) {
    //サンゴとの衝突を判定する処理
    var shrimpBoundingBox = shrimp.getBoundingBox();
    var coralBoundingBox = this.getBoundingBox();
    //rectIntersectsRectは２つの矩形が交わっているかチェックする
    if (cc.rectIntersectsRect(shrimpBoundingBox, coralBoundingBox) && shrimp.invulnerability == 0) {
      gameLayer.removeCoral(this); //を削除する
      /*
      //ボリュームを上げる
      audioEngine.setEffectsVolume(audioEngine.getEffectsVolume() + 0.3);
      //効果音を再生する
      audioEngine.playEffect(res.se_death);
      */
      life--;
      lifeText.setString("LIFE : " + life);
      if(life < 1){
        //audioEngine.stopMusic();
        gameover.score = score;
        cc.director.runScene(new gameover());
      }
      restartGame();
    }
    //画面の外にでたサンゴを消去する処理
    if (this.getPosition().x < -50) {
      gameLayer.removeCoral(this)
    }
  }
});

// 上サンゴクラス
var Coral_above = cc.Sprite.extend({
  ctor: function() {
    this._super();
    this.initWithFile(res.coral_above_png);
  },
  onEnter: function() {
    this._super();
    this.setPosition(600, (Math.random(5) * 500)+400);
    var moveAction = cc.MoveTo.create(6, new cc.Point(-100, 600));
    this.runAction(moveAction);
    this.scheduleUpdate();
  },
  update: function(dt) {
    //サンゴとの衝突を判定する処理
    var shrimpBoundingBox = shrimp.getBoundingBox();
    var coralBoundingBox = this.getBoundingBox();
    //rectIntersectsRectは２つの矩形が交わっているかチェックする
    if (cc.rectIntersectsRect(shrimpBoundingBox, coralBoundingBox) && shrimp.invulnerability == 0) {
      gameLayer.removeCoral(this); //を削除する
      /*
      //ボリュームを上げる
      audioEngine.setEffectsVolume(audioEngine.getEffectsVolume() + 0.3);
      //効果音を再生する
      audioEngine.playEffect(res.se_death);
      */
      life--;
      lifeText.setString("LIFE : " + life);
      if(life < 1){
        //audioEngine.stopMusic();
        gameover.score = score;
        cc.director.runScene(new gameover());
      }
      restartGame();
    }
    //画面の外にでたサンゴを消去する処理
    if (this.getPosition().x < -50) {
      gameLayer.removeCoral(this)
    }
  }
});

//アイテムクラス
var Item = cc.Sprite.extend({

  ctor: function() {
    this._super();
    var num = Math.floor(Math.random() * itemArray.length);
    this.initWithFile(itemArray[num]);
  },
  onEnter: function() {
    this._super();
    this.setPosition(600, Math.random() * 568);
    var moveAction = cc.MoveTo.create(2.5, new cc.Point(-100, Math.random() * 568));
    this.runAction(moveAction);
    this.scheduleUpdate();
  },
  update: function(dt) {
    //アイテムとの衝突を判定する処理
    var shrimpBoundingBox = shrimp.getBoundingBox();
    var itemBoundingBox = this.getBoundingBox();
		//rectIntersectsRectは２つの矩形が交わっているかチェックする
    if (cc.rectIntersectsRect(shrimpBoundingBox, itemBoundingBox) ) {
      gameLayer.removeCoral(this);//アイテムを削除する
      /*
      //ボリュームを上げる
      audioEngine.setEffectsVolume(audioEngine.getEffectsVolume() + 0.3);
      //効果音を再生する
      audioEngine.playEffect(res.se_decide);
      */
      
      //スコア追加処理
      score += 5;
      scoreText.setString("SCORE : " + score);
      }
		//画面の外にでた小惑星を消去する処理
    if (this.getPosition().x < -50) {
      gameLayer.removeCoral(this)
    }
  }
});

//エビちゃんを元の位置に戻して、エビちゃんの変数を初期化する
function restartGame() {
  shrimp.ySpeed = 0;
  shrimp.setPosition(shrimp.getPosition().x, size.height * 0.5);
  shrimp.invulnerability = 100;
  /*
  //bgmリスタート
  if (!audioEngine.isMusicPlaying()) {
    audioEngine.resumeMusic();
  }*/
}
