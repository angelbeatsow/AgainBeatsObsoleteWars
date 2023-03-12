class Line{
  constructor(startx,starty,endx,endy,color,width = 10){
    this.startx = startx;
    this.starty = starty;
    this.endx = endx;
    this.endy = endy;
    this.color = color;
    this.width = width;
    this.hidden = false;
    this.vendx = 0; //lastxの速度
    this.globalAlpha = 1;
  }
  
  update(canvas){
    if(this.hidden == true)return;
    this.render(canvas);
    this.onenterframe();
    
  }
  
  render(canvas){
    var context = canvas.getContext( "2d" ) ;
    context.beginPath () ;
    context.moveTo( this.startx, this.starty ) ;
    context.lineTo( this.endx + this.vendx, this.endy );
    context.strokeStyle = this.color ;
    context.lineWidth = this.width ;
    if(this.globalAlpha != 1)context.globalAlpha = this.globalAlpha;
    context.stroke() ;
  }
  
  onenterframe(){}
}

class Conectline extends Line{
  constructor(startxzahyou,startyzahyou,endxzahyou,endyzahyou){
    super(0,0,0,0,'white');
    this.tilesize = 32;
    this.startx  = this.tilesize * startxzahyou + this.tilesize/2;
    this.starty  = this.tilesize * startyzahyou + this.tilesize/2;
    this.endx   = this.tilesize * endxzahyou + this.tilesize/2;
    this.endy   = this.tilesize * endyzahyou + this.tilesize/2;
    
    
    
    
  }
}


class Rect {
  constructor(x,y,haba,takasa,isNuritubusu = false){
    this.x = x;
    this.y = y;
    this.takasa = takasa;
    this.haba = haba;
    this.linewidth = 2;
    this.color = '#fff'
    this.hidden = false;
    this.globalAlpha = 1;
    this.isNuritubusu = isNuritubusu;
    
  }
  
  update(canvas){
    if(this.hidden == true)return;
    this.render(canvas);
  }
  
  render(canvas){
    let context = canvas.getContext('2d');
    
    context.beginPath();
    context.rect(this.x, this.y, this.haba, this.takasa);
    context.strokeStyle = this.color;
    context.globalAlpha = this.globalAlpha;
    if(this.isNuritubusu == true){
      context.fillStyle = this.color;
      context.fill();
    }else{
      context.lineWidth = this.linewidth;
      context.stroke();
    }
  }
  
  touchevent(){}
  
  isTouched(touch){
    if(touch.x >= this.x &&
       touch.x <= this.x + this.haba &&
       touch.y >= this.y &&
       touch.y <= this.y + this.takasa){
         return [touch.touchtype,true];
       }else{
         return [touch.touchtype,false];
       }
  }
  
}


class Takakkei {
  constructor(xyarry,isNuritubusu = true) {
    this.xy = xyarry;
    this.color = 'white'
    this.hidden = false;
    this.isNuritubusu = isNuritubusu;

  }

  update(canvas) {
    if (this.hidden == true) return;
    this.render(canvas);
  }

  render(canvas) {
    let context = canvas.getContext('2d');

    
    context.beginPath();
    context.moveTo(this.xy[0][0],this.xy[0][1]);
    for(let i=1;i<this.xy.length;i++){
      context.lineTo(this.xy[i][0],this.xy[i][1]);
    }
    context.closePath();
    if(this.isNuritubusu){
      context.fillStyle = this.color;
      context.fill();
    }else{
      context.strokeStyle = this.color;
      context.stroke();
    }
  }

}
