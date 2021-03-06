﻿
//gameclear.js
var gameClear = cc.Layer.extend({
    ctor: function() {
        this._super();
        var size = cc.director.getWinSize();

        // 背景レイヤーをその場で作る
        var backgroundLayer = cc.Sprite.create(res.background_space_png);
        backgroundLayer.setPosition(size.width / 2, size.height /2 );
        this.addChild(backgroundLayer);
        
        //ゲームクリアロゴ
        var gameclear_logo = cc.Sprite.create(res.gameclear_logo_png);
        gameclear_logo.setScale(0.5);
        gameclear_logo.setPosition(size.width / 2, size.height * 0.7);　
        this.addChild(gameclear_logo);
        
        
        //ボタン
        //ボタンの背景
        var bgButton = new cc.Scale9Sprite(res.button_png);
        bgButton.setScale(2);
        var bgHighlightedButton = new cc.Scale9Sprite(res.buttonback_png);
 
        //ボタンのラベル
        var title = new cc.LabelTTF("Button", "Marker Felt", 40);
        title.color = cc.color(159, 168, 176);
        //ボタン
        var button = new cc.ControlButton(title, bgButton);
        //button.setBackgroundSpriteForState(bgHighlightedButton, cc.CONTROL_STATE_HIGHLIGHTED);
        button.setTitleColorForState(cc.color.WHITE, cc.CONTROL_STATE_HIGHLIGHTED);
        button.setPosition(size.width / 2, size.height * 0.3);
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
});

var GameClearScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        var layer1 = new gameClear();
        this.addChild(layer1);
        
        //音楽再生エンジン
    	var audioEngine = cc.audioEngine;
    	//bgm再生
    	if (!audioEngine.isMusicPlaying()) {
    	  audioEngine.playMusic(res.gameover_bgm_mp3, true);
    	}
    }
});


