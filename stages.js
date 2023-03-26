const enemy = [
    {
      'name'     : 'shadowA',
      'number'   : 0,
      'hp'       : 7,
      'pow'      : 2,
      'interval' : 1,
      'exp'      : 100,
      'weak'     :'yellow',
      'koudou'   :[
                    [ [90,100],['攻撃'],['うんこ'] ]  //[確率][行動]
                  ]
    },
    {
      'name': 'shadowB',
      'number': 1,
      'hp': 9,
      'pow': 8,
      'interval': 2,
      'exp': 120,
      'weak'     :'yellow',
      'koudou'   :[
                    [ [100],['攻撃'] ]
                  ]
    },
    {
      'name': 'shadowC',
      'number': 2,
      'hp': 25,
      'pow': 15,
      'interval': 3,
      'exp': 150,
      'weak'     :'yellow',
      'koudou'   :[
                    [ [70,100],['攻撃'],['連撃'] ]
                  ]
    }
    
  ]
  
  


class Enemy {
    constructor(enemynum,lv){
      this.lv       = lv
      let ene       = enemy[enemynum];
      this.name     = ene.name;
      this.number   = ene.number;
      this.hp       = Math.floor( ene.hp * (10 + lv)/10 );
      this.pow      = Math.floor( ene.pow * (10 + lv) /10 );
      this.interval = ene.interval;
      this.exp      = Math.floor( ene.exp * (10 + lv)/10 );
      this.weak;
      if(ene.weak)this.weak = ene.weak;
      this.koudou          = ene.koudou; 
      this.koudounumlength = ene.koudou.length ;
      this.koudounum       = 0;
      
    }
    
  }

function reEnemy(enemynum,lv){
  return new Enemy(enemynum,lv);
}

  


const stages = [
  {
    'name'    : '校庭',
    'number'  : 1,
    'wave'    : 5,
    'minlv'   : 1,
    'enemy'   : [
                 [reEnemy(0,1)],
                 [reEnemy(1,1)],
                 [reEnemy(1,1),reEnemy(0,1)],
                 [reEnemy(1,2),reEnemy(0,1)],
                 [reEnemy(2,3)]
                ]
  },
  {
    'name': '玄関',
    'number': 2,
    'wave': 10,
    'minlv': 5,
    'enemy': [
                 [reEnemy(0, 1),reEnemy(0,1)],
                 [reEnemy(0, 2)],
                 [reEnemy(1, 1), reEnemy(1, 1)],
                 [reEnemy(1, 1), reEnemy(1, 1), reEnemy(1,1)],
                 [reEnemy(0, 1), reEnemy(0, 1), reEnemy(0,1),reEnemy(0,1)],
                 [reEnemy(2, 1), reEnemy(2, 1)],
                 [reEnemy(0, 4)],
                 [reEnemy(1,2),reEnemy(0,2),reEnemy(0,2)],
                 [reEnemy(1,1),reEnemy(1,1),reEnemy(1,1),reEnemy(1,1),reEnemy(1,1)],
                 [reEnemy(2,6)]
                ]
  }
  
  
  ]
  
  const actions = [
    {
      'name' :'(未設定)',
      'number':0,
      'need' :[0,0],
      'info' :'',
      
      
    },
    {
      'name':'攻撃',
      'number':1,
      'info':'敵単体への、ハートを除く全エレメントPowの平均物理攻撃。',
      'lv'  :0,
      'need':[0,0], //[color,消費lv]
      'func':function(elementstate){
               let pow = elementstate['red'][1] + elementstate['green'][1] + 
                         elementstate['blue'][1] + elementstate['purple'][1] + 
                         elementstate['yellow'][1] ;
               pow = pow / 5;
               return ['ダメージ',pow,'単体','物理','無'];
               
             }
    },
    {
      'name':'進む',
      'number':2,
      'need':[0,0],
      'info':'敵をすべて倒したなら、次の階層へ進む。'
    },
    {
      'name' :'撤退',
      'number':3,
      'need' :[0,0],
      'info' :'メニュー画面へ戻る。'
    },
    {
      'name':'Lv3:手当て',
      'number':4,
      'info':'ハートエレメントPow1倍回復。',
      'lv'  :1,  //needlv/3
      'need':['pink',3],
      'func':function(elementstate){
               let pow = elementstate['pink'][1];
               return ['回復',pow];
             }
    },
    {
      'name': 'Lv6:身を守る',
      'number':5,
      'info': 'このターンに受けるダメージを、ハートエレメントPow1.5倍%軽減させる。',
      'lv': 2, //needlv/3
      'need': ['pink', 6],
      'func': function(elementstate) {
        let pow = elementstate['pink'][1] * 3/2;
        return ['軽減', pow];
      }
    },
    {
      'name': 'Lv9:体当たり',
      'number':6,
      'info': '敵単体への、赤エレメントPow1.2倍物理攻撃。',
      'lv': 3, //needlv/3
      'need': ['red', 9],
      'func': function(elementstate) {
        let pow = elementstate['red'][1] * 12/10;
        return ['ダメージ', pow,'単体','物理','red'];
      }
    },
    {
      'name': 'Lv3:ためる',
      'number':7,
      'info': '次のターンの物理攻撃力を、赤エレメントPow%上げる。',
      'lv': 1, //needlv/3
      'need': ['red', 3],
      'func': function(elementstate) {
        let pow = elementstate['red'][1] ;
        return ['ためる', pow, 1, '物理'];
      }
    },
    {
      'name': 'Lv12:奇襲',
      'number':8,
      'info': '敵単体への、赤エレメントPow1.5倍物理攻撃。',
      'lv': 4, //needlv/3
      'need': ['red', 12],
      'func': function(elementstate) {
        let pow = elementstate['red'][1] * 15 / 10;
        return ['ダメージ', pow, '単体', '物理', 'red'];
      }
    },
    {
      'name': 'Lv6:警戒の構え',
      'number': 9,
      'info': '敵単体への、緑エレメントPow1倍物理攻撃。ブロックをランダムに3つ、ハートに変化させる。',
      'lv': 2, //needlv/3
      'need': ['green', 6],
      'func': function(elementstate) {
        let pow = elementstate['green'][1] ;
        return ['ダメージ', pow, '単体', '物理', 'green'];
      },
      'change':['pink',3]
    },
    {
      'name': 'Lv9:ヒール',
      'number': 10,
      'info': '緑&ハートエレメントPow1倍回復。',
      'lv': 3, //needlv/3
      'need': ['green', 9],
      'func': function(elementstate) {
        let pow = elementstate['green'][1] + elementatate['pink'][1];
        return ['回復', pow];
      }
    },
    {
      'name': 'Lv12:受け身',
      'number': 11,
      'info': 'このターンに受けるダメージを、緑エレメントPow1,5倍%軽減させる。ブロックをランダムに5つ、ハートに変化させる。',
      'lv': 4, //needlv/3
      'need': ['green', 12],
      'func': function(elementstate) {
        let pow = elementstate['green'][1] * 3/2;
        return ['軽減', pow];
      },
      'change':['pink',5]
    },
    {
      'name': 'Lv3:閃光弾',
      'number': 12,
      'info': '敵全体への、黄エレメントPow0.3~0.5倍魔法攻撃。',
      'lv': 1, //needlv/3
      'need': ['yellow', 3],
      'func': function(elementstate) {
        let pow = elementstate['yellow'][1] * random(3,5)/10;
        return ['ダメージ', pow, '全体', '魔法', 'yellow'];
      }
    },
    {
      'name': 'Lv6:閃光剣',
      'number': 13,
      'info': '敵単体への、黄エレメントPow0.8~1.2倍魔法攻撃。',
      'lv': 2, //needlv/3
      'need': ['yellow', 6],
      'func': function(elementstate) {
        let pow = elementstate['yellow'][1] * random(8,12)/ 10;
        return ['ダメージ', pow, '単体', '魔法', 'yellow'];
      }
    },
    {
      'name': 'Lv9:閃光波',
      'number': 14,
      'info': 'ブロックをランダムに9つ、黄に変化させる。',
      'lv': 3, //needlv/3
      'need': ['yellow', 9],
      'func': function(elementstate) {
        let pow = 0;
        return ['軽減', pow];
      },
      'change':['yellow',9]
    },
    
    
    ];
    
    const jobs = [
      {
        'name':'学生',
        'need':[], //これに転職するために必要なmasterjobs
        'hp'  :4,
        'pow' :3,
        'mpow':1,
        'hpow':2,
        'actions':[
                   [4,3,1],  //[覚えるaction,覚えられるjoblv,エレメントレベル = needlv/3]
                   [5,6,2]
                  ]
        
      },
      {
        'name':'戦闘員',
        'need':[0],
        'hp'  :5,
        'pow' :5,
        'mpow':0,
        'hpow':0,
        'actions':[
                   [6,3,3],  //[覚えるaction,覚えられるjoblv,エレメントレベル = needlv/3]
                   [7,6,1],
                   [8,9,4]
                  ]
        
      },
      {
        'name': '治療班',
        'need': [0],
        'hp': 4,
        'pow': 2,
        'mpow': 1,
        'hpow': 3,
        'actions': [
                   [9, 3, 2], //[覚えるaction,覚えられるjoblv,エレメントレベル = needlv/3]
                   [10, 6, 3],
                   [11, 9, 4]
                  ]

      },
      {
        'name': '技術班',
        'need': [0],
        'hp': 2,
        'pow': 2,
        'mpow': 4,
        'hpow': 2,
        'actions': [
                   [12, 3, 1], //[覚えるaction,覚えられるjoblv,エレメントレベル = needlv/3]
                   [13, 6, 2],
                   [14, 9, 3]
                  ]

      }
      
    ];
