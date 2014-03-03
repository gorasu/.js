/**
* Функция для появления производит действия после того как был проскролен элемент.
* Основное примение для отображения плавающего меню которое должно появится после того как проскролено галавное меню.
*
* (obj)options.whats_scroll* - Элемент в котором происходит скролл
* (obj)options.position_start* - Элемент который является старотовой позицией для срабатывания фукнции
* (str,num)options.equator_line - Линия экватора, это линия на которой сработает функция. (bottom - скролл должен пройти через нижнюю границу элемента options.position_start, если указано число то скролл должен пройти указанное кол-во пикселей от верхушки окна для срабатывания фукнции, если значение не указано или указано не правильно то будет линией экватора будет являтся верхняя граница options.position_start )
* (fun)options.f_start* - фукнция срабатывает когда скролл пересекает линию экватора сверху вниз
* (fun)options.f_end* - фукнция срабатывает когда скролл пересекает линию экватора  снизу вверх
*
*
***/
function tf_add_fixed(options) {
    _add_fixed_is_start = false;
	
	jQuery(options.whats_scroll).scroll(function(){
		
		
		var equator_line =jQuery(options.elemet_start).offset().top;
		
		
		if(options.equator_line == 'bottom'){
		var bottom = jQuery(options.elemet_start).height();
		equator_line = equator_line + bottom;
		}
		
		
		else if (options.equator_line !== undefined &&  !isNaN( options.equator_line ) && options.equator_line) {
			equator_line = options.equator_line;
		}
		
		if(jQuery(this).scrollTop() > equator_line && !_add_fixed_is_start) {
			options.f_start(options);
			_add_fixed_is_start= true;
		}
                
                if (options.elemet_start < 0) {
                    options.elemet_start = 0;
                }
                if (jQuery(this).scrollTop() <=  equator_line)
                {
                    options.f_end(options);
		    _add_fixed_is_start  = false;
                }
		
                
		
	
	}); 
   // });
    
}

jQuery(document).ready(function(){
(function($){
var options = {
    'whats_scroll':$(document),
    'elemet_start':".top_menu",
    'equator_line':'bottom',
    'f_start':function(options){
	       
	        $('.top_menu_stick').css({'position':'fixed','z-index':'1000','display':'none'});
		$('.top_menu_stick').hide(0);
                $('.top_menu_stick').fadeIn(300);
            },
    'f_end':function(options){
                $('.top_menu_stick').css({'display':'none'});
            }  
    
    };
tf_add_fixed(options);
})(jQuery);
});
