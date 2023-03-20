class Player {
  constructor(){
    this.name  = 'ゲスト';
    this.lv    = 1;
    this.hp    = 100;
    this.pow   = 100;
    this.mpow  = 100;
    this.hpow  = 100;
    this.exp   = 0;
    this.job   = 0;
    this.joblv = 1;
    this.masterjobs = [];
    this.joblvs = [] //joblvを記録しておく。
    for(let jobnum=0;jobnum <jobs.length;jobnum++){
      this.joblvs.push(1);
    }
    this.elements = [  //所持エレメント。jobから習得。
                     [],
                     [],
                     [],
                     [],
                     [],
                     []
                    ];
    this.maxSetableAtElementLv = [3,2,2,2,1,1];
    this.settingElements = [
                            [1,2,3],
                            [0,0],
                            [0,0],
                            [0,0],
                            [0],
                            [0]
                           ];
    /*
    this.increaseSetableElement(1,3);
    this.increaseSetableElement(2,2);
    this.increaseSetableElement(3,1);
    this.increaseSetableElement(4,1);
    */
  }
  
  increaseSetableElement = (elementlv,howmany=1)=>{ //elementlv は needlv/3
    for(let x=0;x<howmany;x++){
      this.maxSetableAtElementLv[elementlv]++;
      this.settingElements[elementlv].push(0);
    }
  };
  
  stageclear = (stagenum)=>{
    if(this.clearstages.includes(stagenum)){
      return false;
    }else{
      this.clearstages.push(stagenum);
    }
    if(this.settingElements[(stagenum-1) % 5 + 1].length >= 6)return false;

    this.increaseSetableElement((stagenum-1) % 5 + 1);
    return true;
  };
}
