//gameover.js
score;
var gameover = cc.Layer.extend({
    ctor: function() {
        this._super();
        var size = cc.director.getWinSize();

        // 背景レイヤーをその場で作る
        var backgroundLayer = cc.Sprite.create(res.background_png);
        backgroundLayer.setPosition(size.width,size.height /2 );
        this.addChild(backgroundLayer);

        var label01 = cc.Sprite.create(res.gameover_png);　
        label01.setPosition(size.width / 2, size.height * 0.5);　
        this.addChild(label01);

        var label02 = cc.Sprite.create(res.button3_png);　
        label02.setPosition(size.width / 2, size.height * 0.15);　
        this.addChild(label02);
        
        //ボタン
                //ボタンの背景
        var bgButton = new cc.Scale9Sprite(res.button_png);
        var bgHighlightedButton = new cc.Scale9Sprite(res.buttonback_png);
 
        //ボタンのラベル
        var title = new cc.LabelTTF("Button", "Marker Felt", 30);
        title.color = cc.color(159, 168, 176);
        scoreText = cc.LabelTTF.create("SCORE : " +score ,"Arial","30",cc.TEXT_ALIGNMENT_CENTER);
        this.addChild(scoreText);
        scoreText.setPosition(220,220);
        scoreText.setColor(cc.color(250, 250, 0, 255));
        this.reorderChild(scoreText, 10);

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
    
});

var GameOverScene = cc.Scene.extend({
    onEnter: function() {
        this._super();

        var layer1 = new gameover();
        this.addChild(layer1);
    }
});
