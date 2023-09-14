// JavaScript Document

jQuery(function($){
    // ボタンクリック時
    $(document).on('click', '.global-nav-button', function(e){
        const $t = $(e.currentTarget);
        $t.toggleClass('open');
        $t.closest('.global-nav').toggleClass('open');
    });
    // メニュークリック時
    $(document).on('click', '.global-nav-item > a', function(e){
        const $t = $(e.currentTarget);
        const $next = $t.next('.global-nav-sub-item-list');
        if ($next.length > 0) {
            $t.toggleClass('open');
            $next.toggleClass('open');
            return false;
        }
    });
});

// アコーディオン

$(function () {
$('.ac-parent').on('click', function () {
$(this).next().slideToggle();
$(this).toggleClass("open");
$('.ac-parent').not(this).removeClass('open');

$('.ac-parent').not($(this)).next('.ac-child').slideUp();
});
});

//テキストリサイズ
/* ロード時のcookie有無チェック */
window.addEventListener('DOMContentLoaded', (event) => {
const bodyFont = document.querySelector('body');
/* cookieを取得 */
function getCookieArray(){
  var arr = new Array();
  if(document.cookie != ''){
     var tmp = document.cookie.split('; ');
     for(var i=0;i<tmp.length;i++){
        var data = tmp[i].split('=');
        arr[data[0]] = decodeURIComponent(data[1]);
     }
  }
  return arr;
}
var arr = getCookieArray();
var result = arr["value"];
/* valueのcookieがない時 */
if(result == null){
  console.log("no cookie");
} 
// cookieがある場合
else {
  var theme = result;

  // valueの値でfontBigCookieがある時
  if(theme == 'fontBigCookie'){
     document.getElementById("fontBig").classList.add('activeOn');
     document.getElementById("fontDefault").classList.remove('activeOn');
     bodyFont.style.fontSize = '1.2em';
     console.log('fontBigOn');
  }
  else {
     console.log('none');
  }
}
});

/* フォントサイズを標準に */
document.querySelector('#fontDefault').addEventListener('click', () => {
document.getElementById("fontDefault").classList.add('activeOn');
document.getElementById("fontBig").classList.remove('activeOn');
const bodyFont = document.querySelector('body');
bodyFont.style.fontSize = '100%';
// cookieの操作
document.cookie = "value=fontMiniCookie;max-age=0;";
document.cookie = "value=fontBigCookie;max-age=0;";
console.log('fontDefaultOn');
});

/* フォントサイズを大きく */
document.querySelector('#fontBig').addEventListener('click', () => {
document.getElementById("fontBig").classList.add('activeOn');
document.getElementById("fontDefault").classList.remove('activeOn');

const bodyFont = document.querySelector('body');
bodyFont.style.fontSize = '1.2em';
// cookieの操作
document.cookie = "value=fontBigCookie;max-age=9999;";
console.log('fontBigOn');
});
