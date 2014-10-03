 /** 
 *  Плагин который отлавливает прокрутку колеса мышки над елементом
 *
 *
 */ 
  
  
    jQuery.fn.onWeel = function(callback){

        var onWeelCall = function(el,callbackAfterWeel){
            var callbackAfterWeel = callbackAfterWeel;
            this.onWeelCall = function(e){
                e = e || window.event;
                // wheelDelta не дает возможность узнать количество пикселей
                var delta = e.deltaY || e.detail || e.wheelDelta;
                callbackAfterWeel(delta,el);
                e.preventDefault ? e.preventDefault() : (e.returnValue = false);
            }
            if (el.addEventListener) {
                if ('onwheel' in document) {
                    // IE9+, FF17+
                    el.addEventListener ("wheel",  this.onWeelCall, false);
                } else if ('onmousewheel' in document) {
                    // устаревший вариант события
                    el.addEventListener ("mousewheel",  this.onWeelCall, false);
                } else {
                    // 3.5 <= Firefox < 17, более старое событие DOMMouseScroll пропустим
                    el.addEventListener ("MozMousePixelScroll",  this.onWeelCall, false);
                }
            } else { // IE<9
                el.attachEvent ("onmousewheel",  this.onWeelCall);
            }
        }
        onWeelCall(this.context,callback);

    }
