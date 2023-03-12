
const canvas_width  = 640;
const canvas_height = 450;

const mapwidth   = 7;
const mapheight  = 6;
const tile_size  = 32;  //px

let isTyutoriaru = false;


window.onload= function(){
  
  const game = new Game(canvas_width,canvas_height);
  
  
  const titlescene = ()=>{
    $('nameinput').style.display = '';
    
    const scene = new Scene();
    
    scene.add( new Text('',32*8+12,32*7+30,20));
    scene.add( new Text('AgainBeats! ObsoleteWars',32,32,32));
    const hajimekara = new Text('はじめから',32*8 + 12,32*3 +30,20);
    scene.add(hajimekara);
    const tuzukikara = new Text('つづきから',32*8 + 12,32*6 +30,20);
    scene.add(tuzukikara);
    
    scene.add( new Rect(32*8,32*3 +22,32*4,32));
    scene.add( new Rect(32*8,32*6 +22,32*4,32));
    
    scene.touchevent=()=>{
      if(game.touch.touchtype =='touchstart' &&
         hajimekara.isTouched(game.touch)[1] == true &&
         $('nameinput').value != '' &&
         $('nameinput').value.includes('/n') == false
         ){  //はじめから
           let name = $('nameinput').value;
           game.player.name = name;
           $('nameinput').style.display = 'none';
           
           isTyutoriaru = true;
           game.isTyutoriaru = true;
           
           game.currentScene = menuscene();
      }
         
      if (game.touch.touchtype == 'touchstart' &&
           tuzukikara.isTouched(game.touch)[1] == true
         ) { //つづきから
         
         //indexeddbから読み込む
         var storeName = 'abow2Store';
         
         var openReq = indexedDB.open('abow2', 1);
         // オブジェクトストアの作成・削除はDBの更新時しかできないので、バージョンを指定して更新
         
         openReq.onupgradeneeded = function(event) {
           var db = event.target.result;
           db.createObjectStore(storeName, { keyPath: 'id' })
         }
         var keyValue = 'A';
         openReq.onsuccess = function(event) {
           var db = event.target.result;
           var trans = db.transaction(storeName, 'readonly');
           var store = trans.objectStore(storeName);
           var getReq = store.get(keyValue);
         
           getReq.onsuccess = function(event) {
             if (event.target.result) {
               let data = event.target.result['data']; // {id : 'A', data : []}
               game.player = Object.assign({}, JSON.parse(JSON.stringify(data)));
         
               db.close();
         
               $('nameinput').style.display = 'none';
               
               game.currentScene = menuscene();
               return;
             }else{
               scene.objs[0].text = ('読み込めませんでした。');
               db.close();
             }
           }
         
         }
         
         
         
         openReq.onerror = function(event) {
           // 接続に失敗
           console.log('db open error');
         
           db.close();
         
           scene.objs[0].text = ('読み込めませんでした。');
           return;
         
         }
         
         
         
         
         
         
         
             
      }
      
      
    }
    
    
    return scene;
  }//titlesceneここまで
  
  
  const menuscene = ()=>{
    const textsize = 18;
    
    const scene = new MenuScene();
  
    scene.nowflag = 0;
    
    scene.touchevent = function(){
      for(let x=0;x<this.objs.length;x++){
        if(this.objs[x].touchevent)this.objs[x].touchevent();
      }
      for (let x = 0; x < this.irekaeobjs.length; x++) {
        if(this.irekaeobjs[x].touchevent)this.irekaeobjs[x].touchevent();
      }
      
      if (this.menunum == 2) {
        for (let i = 0; i < this.elementsettingobjs.length; i++) {
          this.elementsettingobjs[i].touchevent(canvas);
        }
        for (let i = 0; i < this.elementobjs.length; i++) {
          this.elementobjs[i].touchevent(canvas);
        }
        for (let i = 0; i < this.elementinfotext.length; i++) {
          this.elementinfotext[i].touchevent(canvas);
        }
      }
    }
    
    function addBasicObjs(){

      const rect1 = new Rect(32 * 14,32,32 * 5,32 * 6 - 18);
      scene.add(rect1);
      const rect2 = new Rect(32 * 14, 32 * 8 - 22, 32 * 5, 32 * 5 + 22);
      scene.add(rect2);
      const rect3 = new Rect(32, 32 , 32 * 12, 32 * 12);
      scene.add(rect3);
      
      //ステータスの文字生成
      let playerTexts = [game.player.name,
                         'Lv : ' + game.player.lv,
                         jobs[ game.player.job ]['name'] + '(Lv : ' + game.player.joblv + '/10)',
                         'HP : ' + game.player.hp, 
                         '攻撃力 : ' + game.player.pow,
                         '魔法力 : ' + game.player.mpow,
                         '回復力 : ' + game.player.hpow,
                         'EXP : ' + game.player.exp + '/100'
                         ]
                         
      for(let m=0;m<playerTexts.length;m++){
        var txt = new Text(playerTexts[m], 32 * 14 + 5, 32 * 8 - 16 + (textsize + 4) * m, textsize);
        scene.add(txt);
      }
                         
      
      
      //文字selectText[i]を生成。
      //scene.nowflagがiでない時に文字を押されると、
      //scene.objsを変更するselectFunctions[i]が呼ばれ、
      //scene.nowflagをiにする。
      const selectTexts = ['冒険','エレメント','転職','セーブ・設定'];
      const selectFunctions = [addBoukenObjs,addElementObjs,addTensyokuobjs,addSaveObjs];
      scene.falgs = selectTexts;
      
      for(let i=0;i<selectTexts.length;i++){
      
          const _txt = new Text(selectTexts[i], 32 *14 + 5, 32 + 6 + (textsize + 12) * i, textsize);
          _txt.touchevent= ()=>{
          if(scene.nowflag == i)return;
          if(_txt.isTouched(game.touch)[0] == 'touchstart' && _txt.isTouched(game.touch)[1] == true){
          //このtextが押されたら
            
            scene.nowflag = i;
            
            scene.irekaeobjs = [];
            selectFunctions[i]();
          }
        }
        scene.add(_txt);
      }
      
      

    }//addBasicObjsここまで
    
    //scene.irekaeobjsにオブジェクトをいれる関数たち
    function addBoukenObjs(){
      scene.irekaetyutoriaruobjs = [];
      const tyuto1 = new Tyutoriarutext('一覧から行き先を選択して、[出発]ボタンを押すと、冒険に出発します。',32,32*13+6);
      scene.irekaetyutoriaruobjs.push(tyuto1);
      
      
      scene.menunum = 1;
      scene.ikisaki = 0;
      var txt = new Text(' ', 32*3 + 7, 32 * 12, textsize);
      scene.irekaeobjs.push(txt);  //scene.irekaeobjs[0].textを切り替えることで行き先名の表示を変更
      
      for(let n=0;n<stages.length;n++){
        if(game.player.lv >= stages[n]['minlv']){
          const _txt = new Text('Lv' + stages[n]['minlv'] + '~  ' + stages[n]['name'], 32 + 5, 32 + 6 + (textsize + 12) * n, textsize);
          _txt.touchevent = ()=>{
            if(game.touch.touchtype == 'touchstart' && _txt.isTouched(game.touch)[1] == true){
              scene.ikisaki = stages[n]['number'];
              scene.irekaeobjs[0].text = stages[n]['name'];
              console.log('行き先' + scene.ikisaki);
            }
          }
          scene.irekaeobjs.push(_txt)
        }
      }
      var txt = new Text('行き先 :',32+5,32*12,textsize);
      scene.irekaeobjs.push(txt);
      var rct = new Rect(32*9,32*12 - 10,32*3,32,true);
      rct.touchevent = ()=>{
        if(game.touch.touchtype == 'touchstart' && rct.isTouched(game.touch)[1] == true){
          if(scene.ikisaki == 0)return;
          game.currentScene = puzzlescene(scene.ikisaki);
        }
      }
      scene.irekaeobjs.push(rct);
      var txt = new Text('出 発', 32*9 + 20, 32 * 12 - 5, 24);
      txt.color = '#000'
      scene.irekaeobjs.push(txt);
      
    }
    
    function addElementObjs(){
      scene.irekaetyutoriaruobjs = [];
      const tyuto1 = new Tyutoriarutext('右の所持エレメントを選択後、左にセットできます。', 32 , 32*13 + 6);
      scene.irekaetyutoriaruobjs.push(tyuto1);
      
      
      scene.menunum = 2;
      
      scene.irekaeobjs.push( new Line(32*7 + 18,32,32*7 +18,32*13,'white',2));
      scene.irekaeobjs.push( new Line(32 ,32*10,32*7 +18,32*10,'white',2));
      const rightbutton = new Text('→',32*5 ,32*10 -20,20);
      rightbutton.touchevent = ()=>{
        if(rightbutton.isTouched(game.touch)[1] == true && game.touch.touchtype == 'touchstart'){
          scene.elementpage++;
          if(scene.elementpage >= game.player.elements.length && scene.elementpage >= game.player.settingElements.length){
            scene.elementpage = 0;
          }
          elementPageSet();
        }
      }
      scene.irekaeobjs.push(rightbutton);
      const leftbutton = new Text('←', 32 * 3, 32 * 10 - 20, 20);
      leftbutton.touchevent = () => {
        if (leftbutton.isTouched(game.touch)[1] == true && game.touch.touchtype == 'touchstart') {
          scene.elementpage--;
          if(scene.elementpage < 0){
            scene.elementpage = Math.max(game.player.elements.length-1,game.player.settingElements.length-1);
          }
          elementPageSet();
        }
      }
      scene.irekaeobjs.push(leftbutton);
      const infotxt = new Text('',32 + 6,32*10 + 6,16);
      infotxt.max = 12;
      scene.elementinfotext.push(infotxt);
      
      
      function elementPageSet(){
        scene.elementobjs = [];
        scene.elementsettingobjs = [];
        
        if(game.player.maxSetableAtElementLv[scene.elementpage]){
          for(let n=0;n<game.player.maxSetableAtElementLv[scene.elementpage];n++){
            //左側
            let elenum = game.player.settingElements[scene.elementpage][n];
            const _text = new Text(actions[elenum].name,32*2 +6,32*(2+n) +6,20);
            if(actions[elenum].need[0] != 0)_text.color = actions[elenum].need[0];
            
            _text.touchevent = ()=>{
              if(_text.isTouched(game.touch)[1] == true && game.touch.touchtype == 'touchstart'){
                scene.elementinfotext[0].text = actions[elenum].info;
                if(scene.selectedelement != 0 && game.player.settingElements[scene.elementpage].includes(scene.selectedelement) == false){
                  game.player.settingElements[scene.elementpage][n] = scene.selectedelement;
                  _text.text = actions[scene.selectedelement].name;
                  if(actions[scene.selectedelement].need[0] == 0)_text.color = 'white';
                  else _text.color = actions[scene.selectedelement].need[0];
                  elementPageSet();
                }
              }
            }
            scene.elementsettingobjs.push(_text);
            const _rct = new Rect(32*2,32*(2+n),32*5,32);
            scene.elementsettingobjs.push(_rct);
          }
        }
        
        if(game.player.elements[scene.elementpage]){
          for(let m=0;m<game.player.elements[scene.elementpage].length;m++){
            //右側
            let elenum = game.player.elements[scene.elementpage][m];
            const _text = new Text(actions[elenum].name, 32 * 8 +6, 32 * (2 + m) +6, 20);
            if(actions[elenum].need[0] != 0)_text.color = actions[elenum].need[0];
            _text.touchevent = ()=>{
            
              if(_text.isTouched(game.touch)[1] == true && game.touch.touchtype == 'touchstart'){
                scene.elementinfotext[0].text = actions[elenum].info;
                if(_text.tenmetu == 0){
                  _text.tenmetu = 1;
                  scene.selectedelement = elenum;
                }
              }
              if(_text.isTouched(game.touch)[1] == false && game.touch.touchtype == 'touchstart'){
                _text.tenmetu = 0;
                if(scene.selectedelement == elenum){
                  setTimeout(()=>{
                    scene.selectedelement = 0;
                  },10);
                
                }
              }
            }
            scene.elementobjs.push(_text);
          }
        }
        const setpagenumtxt = new Text(scene.elementpage, 32 * 4 + 5, 32 * 10 - 22, 20);
        scene.elementsettingobjs.push(setpagenumtxt);
      }
      
      elementPageSet();
      
    }
    
    function addTensyokuobjs(){
      scene.irekaetyutoriaruobjs = [];
      const tyuto1 = new Tyutoriarutext('一覧から職業を選択して、[転職決定]ボタンを押すと、転職します。', 32, 32 * 13 + 6);
      scene.irekaetyutoriaruobjs.push(tyuto1);
      
      
      scene.menunum = 3;
      let tensyokusaki = null;
      
      const txt1 = new Text('※修得した職業に応じて転職先が増えます。',32*2,32+16,16);
      scene.irekaeobjs.push(txt1);
      const txt3 = new Text('', 32 * 10 - 25, 32 * 11, 16);
      scene.irekaeobjs.push(txt3);
      const txt4 = new Text('[転職先]', 32 * 10 - 25, 32 * 11 -20, 16);
      scene.irekaeobjs.push(txt4);
      const rct = new Rect(32 * 9, 32 * 12 - 10, 32 * 3, 32, true);
      scene.irekaeobjs.push(rct);
      const txt2 = new Text('転職決定',32*10 - 25,32*12-2,20);
      txt2.color = 'black';
      txt2.touchevent = ()=>{
        if(txt2.isTouched(game.touch)[1] == true && game.touch.touchtype=='touchstart'){
          if(tensyokusaki != null){
            const jobnum = tensyokusaki;
            tensyokusaki = null;
            game.player.job = jobnum;
            game.player.joblv = Object.assign({}, JSON.parse(JSON.stringify(game.player))).joblvs[jobnum];
            
            scene.objs = [];
            scene.irekaeobjs = [];
            addBasicObjs();
            addTensyokuobjs();
          }
        }
      }
      scene.irekaeobjs.push(txt2);
      
      
      
      for(let jobnum=0;jobnum < jobs.length;jobnum++){
        let _need = jobs[jobnum].need;
        let needOk = true;
        let isAlreadyMaster = false;
        for(let neednum=0;neednum < _need.length;neednum++){
          if(game.player.masterjobs.includes( _need[neednum] ) == false)needOk = false;
        }
        if(game.player.masterjobs.includes( jobnum ))isAlreadyMaster = true;
        
        if(needOk){
          let textbun = jobs[jobnum].name;
          if(isAlreadyMaster){
            textbun += ' (修得済)';
          }
          
          const _text = new Text(textbun,32*2,32*2 + 20 + 32*jobnum,20);
          _text.touchevent = ()=>{
            if(game.touch.touchtype == 'touchstart'){
              if(_text.isTouched(game.touch)[1] == true){
                tensyokusaki = jobnum;
                _text.tenmetu = 1;
                scene.irekaeobjs[1].text = _text.text;
              }else{
                _text.tenmetu = 0;
                setTimeout(()=>{
                  if(tensyokusaki == jobnum){
                    tensyokusaki = null;
                    scene.irekaeobjs[1].text = '';
                  }
                },10)
              }
            }
          }
          scene.irekaeobjs.push(_text);
        
        }
        
        
      }
      
    }
    
    function addSaveObjs(){
      scene.irekaetyutoriaruobjs = [];
      const tyuto1 = new Tyutoriarutext('', 32, 32 * 13 + 6);
      scene.irekaetyutoriaruobjs.push(tyuto1);
      
      
      scene.menunum = 4;
      const kekka = new Text('',32*2 + 20,32*3 + 10,16);
      scene.irekaeobjs.push(kekka);
      const txt = new Text('セーブする',32*2,32*2,20);
      txt.touchevent = ()=>{
        if(game.touch.touchtype == 'touchstart' && txt.isTouched(game.touch)[1] == true){
          
          var data = { 'id': 'A', 'data': game.player };
          var storeName = 'abow2Store';
          var dbName = 'abow2';
          var openReq = indexedDB.open(dbName);
          
          openReq.onsuccess = function(event) {
            var db = event.target.result;
            var trans = db.transaction(storeName, 'readwrite');
            var store = trans.objectStore(storeName);
            var putReq = store.put(data);
          
            putReq.onsuccess = function() {
              scene.irekaeobjs[0].text = ('セーブしました。');
            }
            
            trans.oncomplete = function() {
              // トランザクション完了時(putReq.onsuccessの後)に実行
              console.log('transaction complete');
            }
            db.close();
          
          }
          openReq.onerror = function(event) {
            // 接続に失敗
            scene.irekaeobjs[0].text = ('セーブに失敗しました。');
          }
          
        }
      }
      scene.irekaeobjs.push(txt);
      scene.irekaeobjs.push( new Text('チュートリアルの文字:',32*2,32*5));
      const ontext = new Text('ON',32*9,32*5);
      ontext.touchevent = ()=>{
        if(isTyutoriaru == true)ontext.color = 'white';
        else ontext.color = 'gray';
        if(game.touch.touchtype =='touchstart' && ontext.isTouched(game.touch)[1] == true){
          isTyutoriaru = true;
          game.isTyutoriaru = true;
        }
      }
      
      const offtext = new Text('OFF', 32 * 11, 32 * 5);
      offtext.touchevent = () => {
        if (isTyutoriaru == false) offtext.color = 'white';
        else offtext.color = 'gray';
        if (game.touch.touchtype == 'touchstart' && offtext.isTouched(game.touch)[1] == true) {
          isTyutoriaru = false;
          game.isTyutoriaru = false;
        }
      }
      if(isTyutoriaru)offtext.color = 'gray';
      else ontext.color = 'gray';
      scene.irekaeobjs.push(ontext);
      scene.irekaeobjs.push(offtext);
    }
    
    addBasicObjs();
    addBoukenObjs();
    
    return scene;
  }  //menusceneここまで






const puzzlescene = (stagenum)=>{
  
  let _stagenum = stagenum;  //1~
  
  const scene = new PuzzleScene(_stagenum);
  scene.player  = Object.assign({}, JSON.parse(JSON.stringify(game.player)));
  scene.playerx = Object.assign({}, JSON.parse(JSON.stringify(game.player)));
  scene.playermaxhp   = scene.player.hp;
  
  
  var banmenussura = new Line(32*5-16,32*7,32*5-16,32*13,'black',32*7);
  banmenussura.globalAlpha = 0.8;
  banmenussura.hidden = true;
  scene.banmenussura.push( banmenussura );
  
    //logpagechangeobjs
    const logMainasu = new Text('▲', 32 * 16, 32 + 20 * 9 - 10, 16);
    logMainasu.hidden = true;
    logMainasu.touchevent = () => {
      if (logMainasu.globalAlpha == 0) return;
      if (logMainasu.isTouched(game.touch)[1] == true && game.touch.touchtype == 'touchstart') {
        if (logMainasu.hidden == false && scene.logpage > 1) {
          scene.logpage--;
          if (scene.logpage == 1) {
            scene.logpagechangeobjs[0].hidden = true;
          }
          if (scene.logpagechangeobjs[1].hidden = true) {
            scene.logpagechangeobjs[1].hidden = false;
          }
        }
      }
    }
    scene.logpagechangeobjs.push(logMainasu);
    const logPurasu = new Text('▼', 32 * 16 + 12 * 8 - 16, 32 + 20 * 9 - 10, 16);
    logPurasu.touchevent = () => {
      if (logPurasu.globalAlpha == 0) return;
      if (logPurasu.isTouched(game.touch)[1] == true && game.touch.touchtype == 'touchstart') {
        if (logPurasu.hidden == false && scene.logpage < scene.maxpage) {
          scene.logpage++;
          if (scene.logpage == scene.maxpage) {
            scene.logpagechangeobjs[1].hidden = true;
          }
          if (scene.logpagechangeobjs[0].hidden = true) {
            scene.logpagechangeobjs[0].hidden = false;
          }
        }
      }
    }
    scene.logpagechangeobjs.push(logPurasu);
  
  
  
  
  scene.tyutoriaruobjs = [];
  const tyuto1 = new Tyutoriarutext('パズル画面の、隣り合うブロックをなぞって消していきましょう。(ななめ可)', 32, 32 * 13 + 6);
  scene.tyutoriaruobjs.push(tyuto1);
  if(game.isTyutoriaru){
    scene.addlog('「撤退」を2回押すことで、いつでもメニュー画面に戻れます。/n');
    scene.addlog('エレメントが獲得できるのは職業レベル10までです。到達したら転職するとよいでしょう。/n');
    scene.addlog('経験値によって自分のレベルが上がると、職業レベルも上がります。職業レベルに応じてエレメントが獲得できます。メニュー画面から装備できます。/n');
    scene.addlog('←のエレメントPowは、このターンに消したブロック数です。ターンごとにリセットされます。/n');
    scene.addlog('←のエレメントLvは、一度に消したブロックの最大数です。ターンを跨いで引き継がれます。エレメント使用時に消費されます。/n');
    scene.addlog('敵の下にある数字は攻撃カウントです。1ターンごとに1ずつ減り、0になると攻撃してきます。/n');
    scene.addlog('パズル画面の赤いゲージは制限時間です。緑のゲージは自分のHPです。/n');
    scene.addlog('戦闘のヒント:/n');
    
  }
  scene.addlog('戦闘ログはここに表示されます。/n');
  
  
  
  
  //enemyimgを設定
  //intervaltextsも設定
  function setEnemyimg(){
    scene.enemyimgs     = [];
    scene.intervaltexts = [];
    
    for(let i=0;i<scene.nowenemy.length;i++){
      const _enemyindex = i;  //scene.nowenemy のindex
      const _enemynum = scene.nowenemy[_enemyindex]['number'];
      const _enemyimg = new EnemyImg(_enemynum,_enemyindex+1);
      _enemyimg.touchevent = ()=>{
        
        if(scene.nowenemy[_enemyindex]['hp'] <=0)return;
        if(_enemyimg.isTouched(game.touch)[1] == true && game.touch.touchtype == 'touchstart'){
          if(scene.action && scene.nowflag == 3){
            //actionを行う
            scene.nowflag       = 4;
            scene.selectedenemy = _enemyindex + 1;
            
            doAction(_enemyindex,scene.action,scene.elementstate);
            
          
          }
        }
      }
      scene.enemyimgs.push(_enemyimg);
      
      const _interval = scene.nowenemy[_enemyindex]['interval'];
      const _intervaltext = new Intervaltext(_interval,_enemyindex+1);
      _intervaltext.color = 'black';
      scene.intervaltexts.push(_intervaltext);
    }
  
    function doAction(enemyindex,action,elementstate){
      const myturnTime    = 1500;
      const enemyturnTime = 1000;
      const yoinTime      = 1000;
      
      let keigenPow = 0;
      
      if(action.need[0] != 0 ) scene.elementstate[ action.need[0] ][0] -= action.need[1];
      
      let _action = action['func'](elementstate); //return[ダメージor回復,value,単体or全体,物理or魔法,属性]
      if(_action[0] == 'ダメージ'){
        if(_action[2] == '単体'){
          scene.enemyimgs[enemyindex].tenmetu = 1;
          let dame = _action[1];
          if(_action[3] == '物理'){
            let plus = 0; //%値
            for(let playerpluslength = 0;playerpluslength < scene.playerPlus.length;playerpluslength++){
              if(scene.playerPlus[playerpluslength][2] == '物理' &&
                 scene.playerPlus[playerpluslength][1] != 0){
                plus += scene.playerPlus[playerpluslength][0];
              }
            }
            dame = dame * scene.playerx.pow * (100 + plus)/100 / 100;
          }
        
          if(scene.nowenemy[enemyindex]['weak']){
            if(scene.nowenemy[enemyindex]['weak'].includes(_action[4]))dame = dame * 6/5;
          }
          dame = Math.floor(dame);
          scene.nowenemy[enemyindex]['hp'] = scene.nowenemy[enemyindex]['hp'] - dame;
          scene.addlog ( scene.nowenemy[enemyindex].name + 'に' + dame + 'ダメージを与えた。/n' );
          setTimeout(()=>{
             if(scene.nowenemy[enemyindex]['hp'] <= 0){
               //倒した
               scene.enemyimgs[enemyindex].hidden     = true;
               scene.intervaltexts[enemyindex].hidden = true;
               scene.nokorienemy--;
               let keikenti = Math.floor( scene.nowenemy[enemyindex]['exp'] / scene.playerx.lv * scene.nowenemy[enemyindex]['lv'] );
               scene.playerx.exp += keikenti;
               scene.addlog (scene.nowenemy[enemyindex].name + 'を倒した。 経験値を' + keikenti + '手に入れた。/n' );
               if(scene.playerx.exp >= 100){
                 //レベルアップ
                 const _job = jobs[ scene.playerx.job ];
                 while(scene.playerx.exp >=100){
                   scene.playerx.exp -= 100;
                   
                   scene.playerx.lv++;
                   scene.playerx.joblv++;
                   scene.playerx.joblvs[ scene.playerx.job ]++;
                   scene.playerx.pow  += _job.pow;
                   scene.playerx.mpow += _job.mpow;
                   scene.playerx.hpow += _job.hpow;
                   scene.playermaxhp  += _job.hp;
                   scene.addlog ( 'レベルが上がった。 HP+' + _job.hp + ',攻撃力+' + _job.pow + ',魔法力+' + _job.mpow + ',回復力+' + _job.hpow + '/n' );
                   
                   for(let x=0;x<_job.actions.length;x++){
                     const _jobaction = _job.actions[x];
                     if(_jobaction[1] == scene.playerx.joblv){
                       scene.playerx.elements[ _jobaction[2] ].push(_jobaction[0]);
                       scene.addlog ( 'エレメント「 ' + actions[ _jobaction[0] ].name + ' 」を獲得した。/n' );
                     }
                    }
                    if (scene.playerx.joblv == 10) {
                       scene.playerx.masterjobs.push(scene.playerx.job);
                       scene.addlog ( jobs[scene.playerx.job].name + 'を修得した。/n' );
                    }
                   
                 }
               
               }
             }
             scene.enemyimgs[enemyindex].tenmetu = 0;
          },myturnTime);
        }
      }else if(_action[0] == '回復'){
        let _value = _action[1];
        _value = _value * scene.playerx.hpow / 100;
        _value = Math.floor(_value);
        if(scene.playerx.hp + _value > scene.playermaxhp)_value = scene.playermaxhp - scene.playerx.hp;
        
        scene.playerx.hp += _value;
        scene.addlog ( _value + '回復した。/n' );
        hpTimerRefresh();
        
      }else if(_action[0] == '軽減'){
        keigenPow = _action[1];
      }else if(_action[0] == 'ためる'){
        let plus = [ _action[1] ,_action[2] ,_action[3] ];
        scene.playerPlus.push(plus);
      }
      
      //能力加算の経過ターンを反映
      for(let playerpluslength = 0;playerpluslength < scene.playerPlus.length;playerpluslength++){
        if(scene.playerPlus[playerpluslength][1] > 0)scene.playerPlus[playerpluslength][1]--;
        
        
      }
      
      //相手のターン
      setTimeout(()=>{
        //残りの敵がいるなら、エレメント情報を更新。
        if(scene.nokorienemy > 0){
          scene.elementstate.syokika();
        }
        
        for(let num=0;num<scene.nowenemy.length;num++){
          if(scene.nowenemy[num]['hp'] <= 0)continue;
          if(scene.playerx.hp == 0)continue;
          
          scene.nowenemy[num]['interval']--;
          scene.intervaltexts[num].text = scene.nowenemy[num].interval;
          
          if(scene.nowenemy[num]['interval'] <= 0){ //敵の攻撃
            scene.nowenemy[num]['interval'] = scene.enemy[ scene.wave -1 ][num]['interval'];
            setTimeout(() => {
              scene.intervaltexts[num].text = scene.nowenemy[num].interval;
            }, enemyturnTime);
            
            scene.enemyimgs[num].vy = -2;
            
            //ダメージの計算
            let _dame = scene.nowenemy[num]['pow'];
            if(keigenPow > 100)keigenPow = 100;
            _dame = Math.floor( _dame * (100 - keigenPow) / 100);
            scene.playerx.hp = scene.playerx.hp -  _dame ;
            scene.addlog ( scene.nowenemy[num].name + 'の攻撃。' + _dame + 'ダメージを受けた。/n' );
            
            
            if(scene.playerx.hp < 0){
              scene.playerx.hp = 0;
              scene.addlog ( 'やられた。/n');
            }
            hpTimerRefresh();
            
            scene.enemyimgs[num].onenterframe = ()=>{
              if(scene.enemyimgs[num].vy == -2 && scene.enemyimgs[num].y <= 32*3 - 16)scene.enemyimgs[num].vy=2;
              if(scene.enemyimgs[num].vy == 2 && scene.enemyimgs[num].y >= 32*3){
                scene.enemyimgs[num].vy =0;
                scene.enemyimgs[num].y = 32*3;
                
                scene.enemyimgs[num].onenterframe = ()=>{};
              }
            }
          }
        }
      },myturnTime );
    
      setTimeout(()=>{
        //tilemapのanimationsを空にする
        scene.objs[0].animations = [];
        
        
        
        if(scene.playerx.hp ==0){
          //やられた
          scene.playerx.hp = scene.playermaxhp;
          game.player = Object.assign({}, JSON.parse(JSON.stringify(scene.playerx)));
          game.currentScene = menuscene();
        }
      
        if(scene.nokorienemy > 0){
          
          scene.nowflag = 1;
          scene.banmenussura[0].hidden = true;
          scene.tyutoriaruobjs[0].text = 'パズル画面の、隣り合うブロックをなぞって消していきましょう。(ななめ可)'
          
        }else{ //階層の敵をすべて倒した
          scene.nowflag = 5;
          scene.tyutoriaruobjs[0].text = '階層制覇時は、「進む」か回復エレメントを、2回押すことで選択できます。';
          if(scene.wave == scene.stage.wave){
            scene.addlog ( 'ステージを制覇した。「 進む 」でメニュー画面に戻ります。/n' );
          }else{
            scene.addlog ( '階層を制覇した。「 進む 」か回復エレメントが使えます。/n' );
          }
        }
        scene.action = null;
      },myturnTime + enemyturnTime );
    
    }
  }//function setEnemyimg ここまで
  setEnemyimg();
  
  //tilemap生成。ランダムな盤面を作る。
  let map      = [];
  let fallmap  = [];
  let retu     = [];
  let fallretu = [];
  for(let y=0;y<mapheight*2;y++){
    for(let x=0;x<mapwidth;x++){
      retu.push(random(1,6));
      fallretu.push(0);
    }
    map.push(retu);
    fallmap.push(fallretu);
    retu = [];
    fallretu = [];
  }
  
  const tilemap = new Tilemap(32,map,fallmap);
  
  scene.nowflag    = 1;

  scene.add(tilemap);
  
  while (scene.objs[0].isTumi()) {
    scene.objs[0].shuffle();
  
  }
  

  
  scene.add( new Text('Lv:',32*11,32*1 + 6,20) );
  scene.add( new Text('Lv:',32*11,32*2 + 6,20) );
  scene.add( new Text('Lv:',32*11,32*3 + 6,20) );
  scene.add( new Text('Lv:',32*11,32*4 + 6,20) );
  scene.add( new Text('Lv:',32*11,32*5 + 6,20) );
  scene.add( new Text('Lv:',32*11,32*6 + 6,20) );
  scene.add(new Text(',Pow:', 32 * 13, 32 * 1 + 6,20));
  scene.add(new Text(',Pow:', 32 * 13, 32 * 2 + 6,20));
  scene.add(new Text(',Pow:', 32 * 13, 32 * 3 + 6,20));
  scene.add(new Text(',Pow:', 32 * 13, 32 * 4 + 6,20));
  scene.add(new Text(',Pow:', 32 * 13, 32 * 5 + 6,20));
  scene.add(new Text(',Pow:', 32 * 13, 32 * 6 + 6,20));
  //scene.add( new Line(32*5 - 16,32,32*5 -16,32*7,'white',32*7) );　旧enemygamen
  let enemygamen = new Rect(32*5 - 16 - 32*7/2,32,32*7,32*6,true); //下のenemygamenspriteと被っていますが、isTouched()を使うので必要です。
  enemygamen.color = 'white';
  scene.add(enemygamen);//←隠れてる盤面を見たいならコメントアウト
  let enemygamensprite = new Sprite('./backgroundimg/background' + _stagenum + '.png',32,32); 
  scene.add(enemygamensprite);//←隠れてる盤面を見たいならコメントアウト
  //let back = new Rect(32*5-16-32*7/2,32*2,32*7,32*3 + 15,true);  //背景画像挿入目安用
  //back.color = 'black';
  //scene.add(back);
  let maxwave = scene.stage.wave;
  maxwave = new Text('/' + maxwave + ' wave',32*2,32+6,20);
  maxwave.color = 'black';
  scene.add(maxwave);
  let nowwave = new Text('1',32+6,32+6,20);
  nowwave.color = 'black';
  scene.wavetext.push(nowwave);
  scene.add( new Line(32,32*7 -5,32*8,32*7 -5,'gray',10) );
  scene.add( new Line(32,32*7 -16,32*8,32*7 -16,'gray',10) );
  scene.timer.push( new Line(32,32*7 -5,32*8,32*7 -5,'red',5) );  //width = 32*7
  scene.timer.push( new Line(32,32*7 -5 - 11,32*8,32*7 -5 - 11,'lightgreen',5) ); //width = 32*7
  function hpTimerRefresh(){
    scene.timer[1].endx = 32 + 32*7 * ( scene.playerx.hp / scene.playermaxhp );
  }
  scene.add( new Tile(color[1] + '.png',32*10,32*1)  );
  scene.add( new Tile(color[2] + '.png',32*10,32*2)  );
  scene.add( new Tile(color[3] + '.png',32*10,32*3)  );
  scene.add( new Tile(color[4] + '.png',32*10,32*4)  );
  scene.add( new Tile(color[5] + '.png',32*10,32*5)  );
  scene.add( new Tile(color[6] + '.png',32*10,32*6)  );
  scene.add( new Line(32*10,32*7 + 4,32*19,32*7 + 4,'white',2))
  scene.add( new Text('HP :　　/　　,exp :　　/',32 * 10, 32 * 7 + 28, 20) );  //全角空白使用
  scene.add( new Rect(32*10,40*7,32*8,32*4,3) );
  scene.add( new Line(32*15 -8,40*7 + 6,32*15 -8,40*7 + 32*4 - 6,'white',2));
  scene.add( new Takakkei([[32*9,40*7+32*4/2],[32*10-5,40*7],[32*10-5,40*7+32*4]]));
  scene.add( new Takakkei([[32*10 + 32*8 + 32,40*7+32*4/2],[32*10 + 32*8 + 5,40*7],[32*10 + 32*8 + 5,40*7 + 32*4]]));
  const buttonpx = [ [32*9,32*10-5,40*7,40*7+32*4],[32*10+32*8+5,32*10+32*8+32,40*7,40*7+32*4] ];//scene.touchevent設定時に使う。[left,right,top,bottom]
  const _actioninfotext = new Text('',32*15 - 4,40*7 + 10,12);
  _actioninfotext.max = 8;
  scene.actioninfotext.push(_actioninfotext);
  let shufflemoji = new Text('消せるブロックがありません。シャッフルします。');
  shufflemoji.globalAlpha = 0;
  scene.shuffleMessage= shufflemoji ;
  
  scene.flags = ['待機','パズル開始','パズル中','行動選択','行動中','階層制覇'];
  
  function setActionpage(){
            scene.actionobjs = [];
            //action選択画面の描画
            let objs = [];
            const selectedElementLv = scene.actionpage; //なんページ目を表示してるか
  
            for (let i = 0; i < scene.player.settingElements[selectedElementLv].length; i++) {
              let elementnum = scene.player.settingElements[selectedElementLv][i];
              let element = actions[elementnum];
              const _text = new Text(element['name'], 32 * 10 + 10, 32 * 9 + 26 * i, 16);
              if(element.need[0] != 0)_text.color = element.need[0];
              _text.touchevent = () => {
                if (_text.isTouched(game.touch)[1] == true && game.touch.touchtype == 'touchstart') {
                  scene.actioninfotext[0].text = element.info;
                  if(scene.nowflag == 3 ){
                    if(element.need[0] == 0 || scene.elementstate[ element.need[0] ][0] >= element.need[1]){
                      console.log(_text.text + ' 選択中');
                      _text.tenmetu = 1;
                      scene.action = element;
                    }
                  }
                  if(scene.nowflag == 5){
                    //階層制覇時。
                    const elementfunc = element.func(scene.elementstate);
                    if(elementfunc[0] == '回復' && scene.elementstate[ element.need[0] ][0] >= element.need[1] ){
                      if (_text.tenmetu == 0) {
                        _text.tenmetu = 1;
                      }else{
                        _text.tenmetu = 0;
                        let _value = elementfunc[1];
                        _value = _value * scene.playerx.hpow / 100;
                        _value = Math.floor(_value);
                        if (scene.playerx.hp + _value > scene.playermaxhp) _value = scene.playermaxhp - scene.playerx.hp;
                        
                        scene.playerx.hp += _value;
                        scene.addlog(_value + '回復した。/n');
                        scene.elementstate[ element.need[0] ][0] -= element.need[1];
                        scene.elementstate.update(canvas);
                        hpTimerRefresh();
                      }
                    }
                    
                  }
                }
                if (_text.isTouched(game.touch)[1] == false && game.touch.touchtype == 'touchstart' && _text.tenmetu != 0) {
                  if(scene.nowflag == 3){
                    if(enemygamen.isTouched(game.touch)[1] == false) {
                      scene.action = null;
                      _text.tenmetu = 0;
                      
                    }else{
                      setTimeout(() => {
                        if (scene.nowflag != 3) {
                          _text.tenmetu = 0;
                        }
                      }, 100);
                    }
                  
                  }
                }
              }           
              if(elementnum == 0){
                //未設定
                _text.touchevent = ()=>{}
              }
              if(elementnum == 2){
                
                //すすむ　は、別個タッチイベントを設定
                _text.touchevent = ()=>{
                  
                  if (_text.isTouched(game.touch)[1] == true && game.touch.touchtype == 'touchstart') {
                    scene.actioninfotext[0].text = element.info;
                    if (scene.nowflag == 5) {
                      if(_text.tenmetu == 0){
                        _text.tenmetu = 1;
                        return;
                      }
                      _text.tenmetu =0;
                      scene.wave ++;
                      scene.wavetext[0].text++;
                      if(scene.wave > scene.stage.wave){
                        //すべての階層を終えた
                        scene.playerx.hp = scene.playermaxhp;
                        game.player = Object.assign({}, JSON.parse(JSON.stringify(scene.playerx)));
                        game.currentScene = menuscene();
                        return;
                      }
                        scene.nowenemy    = Object.assign({}, JSON.parse(JSON.stringify(stages[scene.stagenum - 1]))).enemy[scene.wave - 1];
                        scene.nokorienemy = scene.nowenemy.length;
                        setEnemyimg();
                        scene.nowflag = 1;
                        scene.banmenussura[0].hidden = true;
                        scene.tyutoriaruobjs[0].text = 'パズル画面の、隣り合うブロックをなぞって消していきましょう。'
                    
                    }
                  }
                  if (_text.isTouched(game.touch)[1] == false && game.touch.touchtype == 'touchstart' && _text.tenmetu != 0) {
                    _text.tenmetu =0;
                  }
                }
              }
              if(elementnum == 3){
                //にげる　も、別個タッチイベントを設定
                _text.touchevent = () => {
                  if (_text.isTouched(game.touch)[1] == true && game.touch.touchtype == 'touchstart') {
                    scene.actioninfotext[0].text = element.info;
                    if(_text.tenmetu ==0){
                      _text.tenmetu = 1;
                      return;
                    }
                      _text.tenmetu = 0;
                      scene.playerx.hp = scene.playermaxhp;
                      game.player = Object.assign({}, JSON.parse(JSON.stringify(scene.playerx)));
                      game.currentScene = menuscene();
                    
                      
                  }
                  if (_text.isTouched(game.touch)[1] == false && game.touch.touchtype == 'touchstart' && _text.tenmetu != 0) {
                    _text.tenmetu =0;
                  }
                }
              }
              objs.push(_text);
            }
            scene.actionobjs = objs;
  }
  setActionpage();
  
  
  scene.onenterframe = function(){
    //this.shuffleMessage.update(canvas);

    
    

  }
  
  
  
  scene.touchevent = function(){
    
      for (let i = 0; i < this.actionobjs.length; i++) {
        this.actionobjs[i].touchevent();
      }
      for (let i = 0; i < this.enemyimgs.length; i++) {
        this.enemyimgs[i].touchevent();
      }
      for (let i = 0; i < this.logpagechangeobjs.length; i++) {
        this.logpagechangeobjs[i].touchevent();
      }
      
      if(game.touch.touchtype == 'touchstart'){
        
        if(game.touch.x >= buttonpx[0][0] && game.touch.x <= buttonpx[0][1] && game.touch.y >= buttonpx[0][2] && game.touch.y <= buttonpx[0][3] ){
          //左ボタン
          this.actionpage--;
          if (this.actionpage < 0) {
            this.actionpage = this.playerx.settingElements.length - 1;
          }
          console.log(this.actionpage);
          setActionpage();
        }
        if (game.touch.x >= buttonpx[1][0] && game.touch.x <= buttonpx[1][1] && game.touch.y >= buttonpx[1][2] && game.touch.y <= buttonpx[1][3]) {
          //右ボタン
          this.actionpage++;
          if (this.actionpage >= this.playerx.settingElements.length) {
            this.actionpage = 0;
          }
          console.log(this.actionpage);
          setActionpage();
        }
              
      }
    

      if(game.touch.touchtype == 'touchend' || game.touch.touchtype =='touchcancel'){
        
        let lastcolor = this.lastpoint[1];
        this.lastpoint = [];
        if(this.objs[0].selectedzahyous.length != 0 && this.nowflag == 1) {  
          //this.elementstateのlvを初期化
          this.elementstate.syokika();

          
          //タイマー開始
          this.nowflag = 2;
          let timerinterval = setInterval(() => {
            if (this.timer[0].startx < this.timer[0].endx) {
              this.timer[0].endx -= 32/4 * 2;
            } else {
              this.nowflag = 3;
              clearInterval(timerinterval);
              this.timer[0].endx = 32*8;
              this.banmenussura[0].hidden = false;
              
              
                scene.tyutoriaruobjs[0].text = '右下から行動を選択し、そのあと敵を選択しましょう。' //1周目
              

              /*setTimeout(()=>{
                this.objs[0].animations =[];
                this.nowflag = 1;
              },1000); */
        
            }
          }, 1000/2);
        }
        if(this.objs[0].selectedzahyous.length != 0){
          //this.elementstateに加算
          let kosuu = this.objs[0].selectedzahyous.length;
          this.elementstate[lastcolor][1] += kosuu;
          if(this.elementstate[lastcolor][0] < kosuu)this.elementstate[lastcolor][0] = kosuu;
          this.elementstate.update(canvas);
          
          //タイルが消える
          this.objs[0].deleattile();
          this.conectlines = [];
          //シャッフル
          console.log('詰み盤面か?:' + this.objs[0].isTumi());
          if(this.objs[0].isTumi()){
            //this.shuffleMessage.globalAlpha = 1;
            //this.shuffleMessage.hidden = false;
            //var a = setInterval(()=>{
              
              //this.shuffleMessage.globalAlpha -= 0.2;
              //if(this.shuffleMessage.globalAlpha < 0){
                //this.shuffleMessage.globalAlpha = 0;
                //this.shuffleMessage.hidden = true;
                //clearInterval(a);
              //}
              
              
            //},1000/2);
            
            scene.addlog('消せるブロックがないのでシャッフルします。/n');
            
            while(this.objs[0].isTumi()){
              this.objs[0].shuffle();
              
            }
          }
        }
        
      }
      

      if (game.touch.x > tile_size && game.touch.x < tile_size * (mapwidth + 1) &&
        game.touch.y > tile_size*(this.objs[0].hiddenheight +1) && game.touch.y < tile_size * (mapheight * 2 + 1) && 
        (this.nowflag == 1 || this.nowflag ==2)) { //パズル中でパズル領域内なら実行
        
        for (let yzahyou = mapheight-1; yzahyou < mapheight * 2; yzahyou++) {
          for (let xzahyou = 0; xzahyou < mapwidth; xzahyou++) {
            
              if (game.touch.x > (tile_size / 8) + tile_size * xzahyou + tile_size &&
                game.touch.x < (tile_size * 7/8) + tile_size * xzahyou + tile_size &&
                game.touch.y > (tile_size / 8) + tile_size * yzahyou + tile_size &&
                game.touch.y < (tile_size * 7/8) + tile_size * yzahyou + tile_size) {
                //tile_sizeの辺を3/4にした正方形の範囲をタッチすると、
                //座標を取得する。(一番左上を(1,1)とする。)
                
                if(game.touch.touchtype == 'touchstart'){
                //touchstart用。
          　　    let thisxzahyou = Math.floor(game.touch.x / tile_size);
                let thisyzahyou = Math.floor(game.touch.y / tile_size);

                let jouhou = [game.touch.touchtype,color[ this.objs[0].data[thisyzahyou - 1][thisxzahyou - 1] ],thisxzahyou,thisyzahyou];
                
                
                  this.lastpoint = jouhou;
                  this.nowpoint = jouhou;
                 }
              
              if(game.touch.touchtype == 'touchmove'){
              //touchmove用。
              let thisxzahyou = Math.floor(game.touch.x / tile_size);
              let thisyzahyou = Math.floor(game.touch.y / tile_size);
              // console.log([thisxzahyou,thisyzahyou]);
              let jouhou = [game.touch.touchtype,color[ this.objs[0].data[thisyzahyou - 1][thisxzahyou - 1] ],thisxzahyou,thisyzahyou];
              if(JSON.stringify(this.nowpoint) != JSON.stringify(jouhou)){  //パズルタイルを触っていて、game.touchが変わったら、
                     //scene.nowpointに代入
                this.nowpoint = jouhou;
                //console.log(jouhou);
                
                
                
                if(jouhou[0] == 'touchmove' && this.nowpoint[1] == this.lastpoint[1]){
                  let nx = this.nowpoint[2];
                  let ny = this.nowpoint[3];
                  let lx = this.lastpoint[2];
                  let ly = this.lastpoint[3];
                  if(
                     ( (nx == lx - 1 || nx == lx + 1)&&(ny == ly - 1 || ny == ly + 1) )||
                     ( nx==lx && ( (ny == ly + 1)||(ny == ly - 1) ) )||
                     ( ny==ly && ( (nx == lx + 1)||(nx == lx - 1) ) )
                    ){
                        let canselect = true;
                      
                        if(this.objs[0].selectedzahyous.length > 0){
                          for(let v=0;v<this.objs[0].selectedzahyous.length;v++){
                            if(this.objs[0].selectedzahyous[v].toString() == [nx,ny].toString())canselect = false;
                          
                          }
                        }
                        if(canselect){      
                        
                             this.lastpoint = jouhou;
                             
                             this.add(new Conectline(lx,ly,nx,ny),true);
                      
                             //選択される
                             if(this.objs[0].selectedzahyous.length == 0 || this.objs[0].selectedzahyous[this.objs[0].selectedzahyous.length - 1].toString() != [lx,ly].toString()){
                                this.objs[0].selectedzahyous.push([lx,ly]);
                             }
                             this.objs[0].selectedzahyous.push([nx,ny]);
                        }
                    }
                       
                     
                }
                
                
                
              }
              
            }
          }
        }

      
      
      
    }}
  
    
    

    
    
  }
  return scene;
}
  

  game.add( titlescene() );
  //game.add( puzzlescene() );
  
  game.start();
  
};
