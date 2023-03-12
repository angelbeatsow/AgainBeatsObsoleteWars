function $(id){
  return document.getElementById(id);
}

function random(min,max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const color = ['black','red','green','blue','purple','yellow','pink'];

const canvas = $('canvas');




function viewportSet() {
  var ww = window.innerWidth;
  var wh = window.innerHeight;
  
  var cw = 640;  //canvas.width
  var ch = 450;  //canvas.height
  
  if (ww/wh >= cw/ch) {
    // widthが長い
    document.querySelector("meta[name='viewport']").setAttribute("content", "width=" + (640 + (ww - wh*640/450)*450/wh  ) );
  } else {
    // それ以外
    document.querySelector("meta[name='viewport']").setAttribute("content", "width=640");
  }
}
window.addEventListener("DOMContentLoaded", viewportSet, false);
window.addEventListener("resize", viewportSet, false);
window.addEventListener("orientationchange", viewportSet, false);



  // スクロール禁止
  function disableScroll(event) {
    event.preventDefault();
  }
  window.addEventListener('touchmove', disableScroll, { passive: false });
    
  
