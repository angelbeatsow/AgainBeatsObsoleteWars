class Scene{
  constructor(){
    this.objs  = [];
    this.flags = [];
    this.nowflag ;
    
    this.tyutoriaruobjs = [];
    this.irekaetyutoriaruobjs = [];
    
    
  }
  
  add(obj){
    this.objs.push(obj);
    
  }
  
  update(canvas){
    this.onenterframe();
    
    for(let i=0;i<this.objs.length;i++){
       this.objs[i].update(canvas);
    }

  }
  
  tyutoriaruupdate(canvas){
    for(let i=0;i<this.tyutoriaruobjs.length;i++){
       this.tyutoriaruobjs[i].update(canvas);
    }
    for(let i=0;i<this.irekaetyutoriaruobjs.length;i++){
       this.irekaetyutoriaruobjs[i].update(canvas);
    }

  }
  
  
  onenterframe(){} //オーバーライドする
  
  touchevent(){}
  
}




class MenuScene extends Scene{
  constructor(){
    super()
    this.irekaeobjs = []; //メニューごとにいれかえるobjs
    this.menunum = 1;
    
    this.ikisaki ; //冒険用
    
    this.elementpage = 0; //エレメント用
    this.elementsettingobjs = [];
    this.elementobjs = [];
    this.elementinfotext = [];
    this.selectedelement = 0;
    
    
    
  }
  
  update(canvas) {
    this.onenterframe();
  
    for (let i = 0; i < this.objs.length; i++) {
      this.objs[i].update(canvas);
    }
    
    for (let i = 0; i < this.irekaeobjs.length; i++) {
      this.irekaeobjs[i].update(canvas);
    }
    
    if(this.menunum == 2){
      for (let i = 0; i < this.elementsettingobjs.length; i++) {
        this.elementsettingobjs[i].update(canvas);
      }
      for (let i = 0; i < this.elementobjs.length; i++) {
        this.elementobjs[i].update(canvas);
      }
      for (let i = 0; i < this.elementinfotext.length; i++) {
        this.elementinfotext[i].update(canvas);
      }
    }
  
  }
  
  
}






class PuzzleScene extends Scene{
  constructor(stagenum){
    super();
    this.stagenum    = stagenum;
    this.stage       = Object.assign({}, JSON.parse(JSON.stringify(stages[stagenum - 1])));
    this.wave        = 1;
    const en = Object.assign({}, JSON.parse(JSON.stringify(stages[stagenum - 1]))).enemy;
    this.enemy       = en;
    const nen = Object.assign({}, JSON.parse(JSON.stringify(stages[stagenum - 1]))).enemy[this.wave-1];
    this.nowenemy    = nen;  //この階層のenemyたち
    this.enemyimgs   = [];
    this.intervaltexts = [];  //enemyのintervalを表示
    this.nokorienemy = this.nowenemy.length;
    this.selectedenemy = 1; //何体目の敵を選択中か
    this.wavetext = [];  //[0]現在のwave
    
    this.player;  //game.playerを代入。max値参照用。
    this.playerx; //シーン内で変動させる用。
    this.playermaxhp;
    this.playerPlus = []; //能力による加算。[value,ターン数,powかmpowかhpow]を入れる
    
    this.actionobjs = []    //右下の行動選択画面のobjs
    this.actionpage = 0;    //なんページ目を表示してるか。
    this.action  ;          //行う行動。stages.jsにあるactionオブジェクトをいれる。
    this.actioninfotext = [];
    
    this.log = [];
    this.logpage = 1;
    this.maxpage = 1;
    this.logpagechangeobjs = [] //Text。-,+
    
    this.objs        = []; //objs[0]にTilemap。他は操作しないオブジェクト
    this.flags       = [];
    this.nowflag ;
    this.nowpoint     = []; //touchtype,color,xzahyou,yzahyou
    this.lastpoint    = []; //touchtype,color,xzahyou,yzahyou
    this.conectlines  = []; //タイルを結ぶ線を入れておく。タイルを消す度空にする。
    this.elementstate = new Elementstate;
    this.timer        = []; //[0]にタイマーのLineをいれておく。widthにアクセスする。[1]にhp,[2]にexp
    this.shuffleMessage ;
    this.banmenussura =[];
    
    
  }
  
  add(obj,isconectline = false){
    if(isconectline == false)this.objs.push(obj);
    else this.conectlines.push(obj);
  }
  
  update(canvas){
    if(this.maxpage <= 1){
      this.logpagechangeobjs[0].globalAlpha = 0;
      this.logpagechangeobjs[1].globalAlpha = 0;
    }else{
      this.logpagechangeobjs[0].globalAlpha = 1;
      this.logpagechangeobjs[1].globalAlpha = 1;
    }
    
    this.onenterframe();
    
    for (let i = 0; i < this.objs.length; i++) {
      this.objs[i].update(canvas);
    }
    
    for (let i = 0; i < this.enemyimgs.length; i++) {
      this.enemyimgs[i].update(canvas);
      this.intervaltexts[i].update(canvas);
    }
    for (let i = 0; i < this.conectlines.length; i++) {
      this.conectlines[i].update(canvas);
    }
    for (let i = 0; i < this.timer.length; i++) {
      this.timer[i].update(canvas);
    }
    for (let i = 0; i < this.elementstate.objs.length; i++) {
      this.elementstate.objs[i].update(canvas);
    }
    for (let i = 0; i < this.banmenussura.length; i++) {
      this.banmenussura[i].update(canvas);
    }
    for (let i = 0; i < this.actionobjs.length; i++) {
      this.actionobjs[i].update(canvas);
    }
    for(let i = 0; i <this.actioninfotext.length; i++){
      this.actioninfotext[i].update(canvas);
    }
    for (let i = 0; i < this.wavetext.length; i++) {
      this.wavetext[i].update(canvas);
    }
    for (let i = 0; i < this.logpagechangeobjs.length; i++) {
      this.logpagechangeobjs[i].update(canvas);
    }
    
    //ステータスの描画
    var txt = new Text('Lv : ' + this.playerx.lv + ' (' + jobs[ this.playerx.job ]['name'] + 'Lv : ' + this.playerx.joblv + ' / 10)',
                       32*10,32*7 + 8,20);
    txt.update(canvas);
    var txt = new Text(this.playerx.hp, 32 * 11 + 8, 32 * 7 + 28, 20);
    txt.update(canvas);
    var txt = new Text(this.playermaxhp,  32 * 13 - 10, 32 * 7 + 28, 20);
    txt.update(canvas);
    var txt = new Text(this.playerx.exp,32 * 15 + 14, 32 * 7 + 28, 20);
    txt.update(canvas);
    var txt = new Text('100',           32 * 17 - 4 , 32 * 7 + 28, 20);
    txt.update(canvas);
    
    //logの表示
    const maxmojisuu = 8; //1行当たりの文字数
    const maxgyousuu = 8; //1page当たりの行数
    
    let gyousuu = Object.assign({}, JSON.parse(JSON.stringify(this))).log.length;
    if(gyousuu > maxgyousuu)gyousuu = maxgyousuu;
    for(let m=0;m<gyousuu;m++){
      if(this.log[ (this.logpage -1) * maxgyousuu + m ] == undefined)continue;
      var thislog = new Text(this.log[ (this.logpage -1) * maxgyousuu + m ],32*16,38 + 20*m,12);
      thislog.update(canvas);
    }
    
  }
  
  
  onenterframe(){} //オーバーライドする
  
  touchevent(){}
  
  addlog(text){
    let x = Object.assign({}, JSON.parse(JSON.stringify(this))).log;
    const maxmojisuu = 8; //1行当たりの文字数
    const maxgyousuu = 8; //1page当たりの行数
    let bunkatu = text.split('/n'); //this.logを分割して入れる。
    let logs = []; //bunkatuをmaxmojisuuごとにさらに分割。
    
    for (let m = 0; m < bunkatu.length; m++) {
      let _bunkatu = bunkatu[m];
      if(_bunkatu == '')continue;
      let howmanylines = Math.ceil(_bunkatu.length / maxmojisuu);
      for (let li = 0; li < howmanylines; li++) {
        let _texts = _bunkatu.substr(li * maxmojisuu, maxmojisuu);
        logs.push(_texts);
      }
      logs.push('────────');
    }
    
    this.log = logs.concat(x);
    this.maxpage = Math.ceil( logs.concat(x).length / maxgyousuu);
    

    if(this.logpage < this.maxpage){
      //console.log('最後のページじゃない');
      this.logpagechangeobjs[1].hidden = false;
    }
    
  }
  
}

