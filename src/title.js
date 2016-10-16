
var gamestart = cc.Layer.extend({
	ctor: function() {
		this._super();
		var size = cc.director.getWinSize();
        	
        	var backgroundLayer = cc.Sprite.create(res.background_sky_png);
		backgroundLayer.setPosition(size.width/2,size.height /2 );
        	this.addChild(backgroundLayer);
        	
        	var title_logo = cc.Sprite.create(res.title_logo_png);
        	title_logo.setScale(0.5);
		title_logo.setPosition(size.width/2,size.height * 0.7);
        	this.addChild(title_logo);
        	
        	var start_logo = cc.Sprite.create(res.start_logo_png);
        	start_logo.setScale(0.7);
		start_logo.setPosition(size.width/2,size.height * 0.3);
        	this.addChild(start_logo);
        	
        	
        	// タップイベントリスナーを登録する
                cc.eventManager.addListener({
                    event: cc.EventListener.TOUCH_ONE_BY_ONE,
                    swallowTouches: true,
                    onTouchBegan: this.onTouchBegan,
                    onTouchMoved: this.onTouchMoved,
                    onTouchEnded: this.onTouchEnded
                }, this);
	},
	onTouchBegan: function(touch, event) {
          return true;
        },
        onTouchMoved: function(touch, event) {},
        onTouchEnded: function(touch, event) {
        
          // 次のシーンに切り替える
          cc.audioEngine.stopMusic();
          //cc.director.runScene(new stageSkyScene());
          
        },
      
});

function test() {
var start_logo2 = cc.Sprite.create(res.start_logo_png);
        	start_logo2.setScale(0.7);
		start_logo2.setPosition(200, 200);
        	gamestart.addChild(start_logo2);
}

var GameStartScene = cc.Scene.extend({
    onEnter: function() {
        this._super();

        var layer1 = new gamestart();
        this.addChild(layer1);
    }
});


