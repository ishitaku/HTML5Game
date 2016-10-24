﻿//gameover.js
var gameOverSky = cc.Layer.extend({
    ctor: function() {
        this._super();
        var size = cc.director.getWinSize();
        
        
        // 背景レイヤーをその場で作る
        var backgroundLayer = cc.Sprite.create(res.background_sky_png);
        backgroundLayer.setPosition(size.width / 2, size.height /2 );
        this.addChild(backgroundLayer);

        var gameover_logo = cc.Sprite.create(res.gameover_logo_png);
        gameover_logo.setScale(0.5);　
        gameover_logo.setPosition(size.width / 2, size.height * 0.7);　
        this.addChild(gameover_logo);
        
        if(game_continue > 0) {
          var retry_logo = cc.Sprite.create(res.retry_logo_png);　
          retry_logo.setPosition(size.width / 2, size.height * 0.3);　
          retry_logo.setScale(0.7);
          this.addChild(retry_logo);
        }
        // タップイベントリスナーを登録する
        cc.eventManager.addListener({
          event: cc.EventListener.TOUCH_ONE_BY_ONE,
          swallowTouches: true,
          onTouchBegan: this.onTouchBegan,
          onTouchMoved: this.onTouchMoved,
          onTouchEnded: this.onTouchEnded
        }, this);
        
        return true;
    },
    onTouchBegan: function(touch, event) {
      return true;
    },
    onTouchMoved: function(touch, event) {},
    onTouchEnded: function(touch, event) {
    // 次のシーンに切り替える
      cc.audioEngine.stopMusic();
      if(game_continue > 0) {
        cc.director.runScene(new stageSkyScene());
        game_continue--;
      } else {
        cc.director.runScene(new GameStartScene());
        game_continue = 3;
        setGameData(5, 0, 0);
      }
    },
});

var GameOverSkyScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        var layer1 = new gameOverSky();
        this.addChild(layer1);
        //音楽再生エンジン
    	var audioEngine = cc.audioEngine;
    	//bgm再生
    	if (!audioEngine.isMusicPlaying()) {
    	  audioEngine.playMusic(res.gameover_bgm_mp3, true);
    	}
    }
});
