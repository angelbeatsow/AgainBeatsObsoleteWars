class Sprite{
  constructor(imgpass,x=0,y=0){
    this.img          = new Image();
    this.img.src      = imgpass;
    this.x            = x;
    this.y            = y;
    this.hidden       = false;
    this.vx = this.vy = 0;  //移動速度
    this.globalAlpha  = 1;
    
  }
  
  update(canvas){
    if(this.hidden == false){
      this.render(canvas);
      this.onenterframe();
      
      this.x += this.vx;
      this.y += this.vy;
    }
  }
  
  render(canvas){
    const _ctx = canvas.getContext('2d');
    _ctx.globalAlpha = this.globalAlpha;
    _ctx.drawImage(this.img,this.x,this.y);
    
  }
  
  onenterframe(){}
  
}

class Tile extends Sprite{
  constructor(imgpass,x=0,y=0,colornum){
    super(imgpass);
    this.x                   = x;
    this.y                   = y;
    this.width = this.height = 32;
    this.xzahyou             = Math.floor(this.x / this.width);
    this.yzahyou             = Math.floor(this.y / this.height);
    this.colornum            = colornum;
    this.howpxfall           = 0;
    this.fallspead           = 8;
  }
  
  update(canvas) {
    if(this.x < -1*this.width || this.x > canvas.width)return;
    if(this.y < -1*this.height || this.y > canvas.height)return;
    
      if (this.hidden == false) {
        this.render(canvas);
        this.onenterframe();
  
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.howpxfall >= this.fallspead) { //落下pxが指定されているなら実行
          this.y += this.fallspead;
          this.howpxfall -= this.fallspead;
        } else if (this.howpxfall != 0) {
          this.howpxfall = 0;
        }
      }
  }
  
  getzahyou(){  //色と、一番左上を(1,1)とした座標を返す
    let re = [color[this.colornum],this.xzahyou,this.yzahyou];
    // console.log(re);
    return re;
  }
  
  fall(howmanytiles){
    this.howpxfall += this.height * howmanytiles;
    this.yzahyou += howmanytiles
    
  }
}


class Pointer extends Sprite{
  constructor(imgpass,x,y){
    super(imgpass);
    this.x=x;
    this.y=y;
    this.timecount = 0;
  }
  
  update(canvas){
    this.timecount++;
    if(this.timecount>5)this.hidden=true;
    super.update(canvas);
  }
}

class Animationtile extends Sprite{
  constructor(imgpass, xzahyou = 1, yzahyou = 1,animationmax = 5) {
    super(imgpass);
    this.x = (xzahyou +1) * 32;
    this.y = (yzahyou +1) * 32;
    this.width = this.height = 32;
    this.animation = 0;
    this.animationmax = animationmax;
    this.isSettingSetinterval = false;
  }
  
  render(canvas){
    
    const _ctx = canvas.getContext( '2d' );
    _ctx.drawImage(
        this.img,
        this.width * this.animation,
        0 ,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height);
        if(this.isSettingSetinterval == false){
          this.isSettingSetinterval = true;
          setInterval(()=>{
            this.animation++;},500/this.animationmax); //0.5秒で終わらせる
        }
        if(this.animation > this.animationmax){this.hidden = true;}
  }
  
}

class EnemyImg extends Sprite{
  constructor(enemynum,nantaime){
    let imgpass = '/enemyimg/enemy' + enemynum + '.png';
    //imgpass = '/enemyimg/enemy0.png';
    super(imgpass)
    this.width = 40;
    this.height = 80;
    
    let num =0;
    switch(nantaime){
      case 1:
        num=2;
        break;
      case 2:
        num=1;
        break;
      case 3:
        num=3;
        break;
      case 4:
        num=0;
        break;
      case 5:
        num=4;
        break;
    }
    
    this.x = 32 + 12 + 40*num;
    this.y = 32*3;
    this.tenmetu = 0;
  }
  
  update(canvas){
    if(this.hidden || this.tenmetu == 4)return;
    if(this.tenmetu == 1){
      this.tenmetu = 2;
      setTimeout( ()=>{
        if(this.tenmetu !=0)this.tenmetu = 3;
      },1000 / 8);
    }
    if (this.tenmetu == 3) {
      this.tenmetu = 4;
      setTimeout(() => {
        if(this.tenmetu != 0)this.tenmetu = 1;
      }, 1000 / 8);
      return;
    }
    
    this.render(canvas);
    this.onenterframe();
    
    this.x += this.vx;
    this.y += this.vy;
    
  }
  
  touchevent(){}
  
  isTouched(touch){
    if(touch.x >= this.x &&
       touch.x <= this.x + this.width &&
       touch.y >= this.y &&
       touch.y <= this.y + this.height){
         return [touch.touchtype,true];
    }else{
      return [touch.touchtype,false];
    }
  }
}
