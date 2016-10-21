
var game_life = 5;			//ライフの持ち越し
var game_score = 0;			//スコアの持ち越し
var game_lifeup_score = 0;	//ライフ回復までのスコア
var LIFE_UP_SCORE = 100;	//回復までのスコア値

//空ステージデータ
var LIFE_SKY = 5;	//ライフ
var MINUS_SPEED_SEC_SKY = 4;	//敵の移動時間
var MINUS_TIME_DUR_SKY = 2;		//敵の出現間隔
var SPONSER_DUR_SKY = 10;		//スポンサー様看板の出現間隔
var GOAL_TIME_SKY = 35;			//ゴールまでの時間
var GRAVITY_SKY = -0.06;		//重力
var GAME_THRUST_SKY = 0.12;		//上昇力

//海ステージデータ
var LIFE_SEA = 5;	//ライフ
var MINUS_SPEED_SEC_SEA = 3.5;	//敵の移動時間
var MINUS_TIME_DUR_SEA = 1.5;		//敵の出現間隔
var SPONSER_DUR_SEA = 10;		//スポンサー様看板の出現間隔
var GOAL_TIME_SEA = 65;			//ゴールまでの時間
var GRAVITY_SEA = -0.05;
var GAME_THRUST_SEA = 0.1;

//宇宙ステージデータ

var LIFE_SKY = 5;	//ライフ
var MINUS_SPEED_SEC_SKY = 3.5;	//敵の移動時間
var MINUS_TIME_DUR_SKY = 1;		//敵の出現間隔
var SPONSER_DUR_SKY = 10;		//スポンサー様看板の出現間隔
var GOAL_TIME_SKY = 95;			//ゴールまでの時間
var GRAVITY_SPACE = -0.05;
var GAME_THRUST_SPACE = 0.15;

//ゲームデータの保持
function setGameData(gamelife, gamescore, gamelifeupscore) {
game_life = gamelife;
game_score = gamescore;
game_lifeup_score = gamelifeupscore;
//console.log(gamescore);
}


//あたり判定の範囲の変更
function setCollisionScale(rect, scale) {
//あたり判定を変更
    var bx = rect.x;
    var by = rect.y;
    var bw = rect.width;
    var bh = rect.height;
    
    var width_half = bw/2;
    var height_half = bh/2;
    
    var centerx = bx + width_half;
    var centery = by + height_half;
    var rw = bw * scale;
    var rx = centerx - rw * 0.5;
    var rh = bh * scale;
    var ry = centery - rh * 0.5;
    
    rect.x = rx;
    rect.y = ry;
    rect.width = rw;
    rect.height = rh;
    
    return rect;
}
