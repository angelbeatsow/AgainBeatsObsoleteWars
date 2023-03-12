class Touch{
  constructor(){
    this.touchtype;
    this.x;
    this.y;
  }
  
  add(touchtype,x,y){
    this.touchtype = touchtype;
    this.x = x;
    this.y = y;
  }
  
  
  
}

class Elementstate {
  constructor(){
    this.red = [0,0];
    this.blue = [0,0];
    this.yellow = [0,0];
    this.purple = [0,0];
    this.green = [0,0];
    this.pink = [0,0];
    this.objs = [];
    
    for (let i = 1; i < color.length; i++) {
      var text1 = new Text(this[color[i]][0], 32 * 12 -5, 32 * i+7 );
      var text2 = new Text(this[color[i]][1], 32 * 15 -14, 32 * i+7 );
      this.objs.push(text1)
      this.objs.push(text2);
    }
  }
  
  update(canvas){
    
    for(let i=1;i<color.length;i++){
      this.objs[2*i - 2].text = this[color[i]][0];
      this.objs[2*i - 1].text = this[color[i]][1];
      
    }
    
    
    
  }
  
  syokika(){
    for(let i=1;i<color.length;i++){
      //this[ color[i] ][0] = 0;
      this[ color[i] ][1] = 0;
      
    }
    this.update();
    
    
  }
}
