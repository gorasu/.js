
    (function( $ ){
/** Z-dropdown v 0.0.0.0
*
* @toDO сделать функцию  f_show - для плавного вылета низпадающего окна
* 
*
***/
  $.fn.z_dropdown = function(options) {
    ZDD  = new Object();
    ZDD.this_el = this;
    ZDD.i = 0;
    
    ZDD.options_default = {
     'temp':'', // Шаблон
     'data':'', // Данные для шаблона
     'newElementClass':'_zdd_new_element_class', // Класс элемента который создается динамически и является родителем для всей конструкции
     'wrapDivClass':'_zdd_wrap_absolute_class', // Класс обертка в котором непосредственно находится 
     'hideOnDocClick':true, //  Прятать ли элемент по щелчку документу
     'f_hide':function(absoluteElement,mainElement){ $(absoluteElement).remove();}, // Фукнция прятанья элемемнта
    }
    
    ZDD.options = $.extend(ZDD.options_default,options);
   // console.log( ZDD.options);
    
        ZDD.template = function(s_temp,obj_var){
        var to = new Array();
        var what = new Array();
        for (key in obj_var) {
            to.push(obj_var[key]);
            what.push('%'+key+'%');
        }
        s_temp = ZDD.str_replace(what,to,s_temp);
        return s_temp;
    }
            // Replace all occurrences of the search string with the replacement string
	// 
	// +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// +   improved by: Gabriel Paderni
    ZDD.str_replace = function ( search, replace, subject ) {


	if(!(replace instanceof Array)){
		replace=new Array(replace);
		if(search instanceof Array){//If search	is an array and replace	is a string, then this replacement string is used for every value of search
			while(search.length>replace.length){
				replace[replace.length]=replace[0];
			}
		}
	}

	if(!(search instanceof Array))search=new Array(search);
	while(search.length>replace.length){//If replace	has fewer values than search , then an empty string is used for the rest of replacement values
		replace[replace.length]='';
	}

	if(subject instanceof Array){//If subject is an array, then the search and replace is performed with every entry of subject , and the return value is an array as well.
		for(k in subject){
			subject[k]=str_replace(search,replace,subject[k]);
		}
		return subject;
	}

	for(var k=0; k<search.length; k++){
		var i = subject.indexOf(search[k]);
		while(i>-1){
			subject = subject.replace(search[k], replace[k]);
			i = subject.indexOf(search[k],i);
		}
	}

	return subject;
    

}

    ZDD.dropdown = function(el_temp,data){
        if (!el_temp) {
            el_temp =ZDD.options.temp;
        }
        if (!data) {
            data =ZDD.options.data;
        }
        
     
        $('[class="'+ZDD.options.newElementClass+'"]').remove();
        

        var s_temp =  $(el_temp).html();
        s_temp = ZDD.template(s_temp,data);
        s_temp = '<div style="position:relative;"><div class="'+ZDD.options.wrapDivClass+'" style="position:absolute;">'+s_temp+'</div></div>';
        
        var mainElemet = document.createElement("div");
        //el.style='';
        $(mainElemet).attr({'class':''+ZDD.options.newElementClass+''});
        $(mainElemet).html(s_temp);
        $(ZDD.this_el).after(mainElemet);
    
  	
        if (ZDD.options.hideOnDocClick) {
            //code
        
        $(document).click(function(event)	{

                    var clicked = jQuery(event.target);
                    var is_find = $(mainElemet).find($(clicked));
                    if(is_find.length == 0 && !(clicked.is(ZDD.this_el))) {
                                   // $('[class="'+ZDD.options.newElementClass+'"]').remove();
                                  
                                  var hideEl = $(mainElemet).find('[class="'+ZDD.options.wrapDivClass+'"]');
                                 
                                  ZDD.options.f_hide(hideEl,mainElemet);
                                    
                    }   
        });
        }
  
          //console.log( document.click );

 
        
    }



     ZDD.dropdown();
    
  };
  
  })(jQuery);
