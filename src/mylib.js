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
