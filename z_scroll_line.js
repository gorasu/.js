    /**
     * Плагин zScrollLine предназначин для определения действия после того как пользователь проскролил элемент.
     * Действия могут назначаться на четырех линиях пересечения элемента
     *  top - дейсвтие срабатывает когда была пересеча верхняя граница элемента
     *  middle - действие срабатывает когда скролл дошел до середины элемента
     *  bottom - действие срабатывает когда была пересечена нижняя граница элемента
     *  userline - пользовательская линия пересечения
     *
     *  Настройка плагина
     *
     *  В плагин передается селектор элмента(ов), пересекая который в процессе скроллинга будут срабатывать
     *  объявленые действия.
     *
     *  Так же в плагин могут предаваться следующие настройки
     *      @param options = {
     *
     *      'scrollParent':$(document) // элемент который скролится по умолчанию это все окно браузера, но в зависимости от требований можно передать и конкретный DOM элемент на котором расположен скролл
     *      'userLinePrepare':
     *                    //фукция которая высчитывает положение пользовательской линии пересечения(userline) фукнция должна возвращать числовое значение
     *                    //  @param crossLines =  {'Top':num,'Bottom':num,'Middle':num} // Линии пересечения по умолчанию
     *                    //  @param el //  Элемент который пересекает скролл
     *
     *                      function(crossLines, el){
     *                      return num;
     *                      }
     *        // СОбытия который происходят после пересечения линии на эдементе
     *        // scrollDown* события вызываются когда линия на элементе была пересечена сверху вниз
     *        // scrollUp* события вызываются когда линия на элементе была пересечена  снизу вверх
     *        // События получают два параметра el - элмент на котором размещены линии пересечения и elData данные с
     *        элментом и координатами линий пересечения
     *       events:{
     *
     *       'scrollDownCrossTop':function(el,elData){},
     *       'scrollDownCrossMiddle':function(el,elData){},
     *       'scrollDownCrossBottom':function(el,elData){},
     *       'scrollDownCrossUserLine':function(el,elData){},
     *
     *        'scrollUpCrossTop':function(el,elData){}
     *        'scrollUpCrossMiddle':function(el,elData){}
     *        'scrollUpCrossBottom':function(el,elData){}
     *        'scrollUpCrossUserLine':function(el,elData){}
     *       }
     *      };
     *
     *
     * */
    (function ($) {

        $.fn.zScrollLine = function (options) {
            var ZSL = this;
            var options_default = {
                'scrollParent': $(document), // Элемент который скролится
                'userLinePrepare': function () {
                    return false;
                },
                'events': new Object() // пользовательские функции при наступлении события пересечения с объектом
            };
            ZSL.options = $.extend(options_default, options);


            /**
             *  Подготовить данные эелемента
             *
             */
            ZSL.prepareElData = function (el) {
                var top = jQuery(el).offset().top;
                var height = jQuery(el).height();
                height = height || 1;
                var bottom = top + height;
                var middle = top + height / 2;

                var crossLines = {
                    'Top': top,
                    'Bottom': bottom,
                    'Middle': middle
                }
                if (typeof(ZSL.options.userLinePrepare) == "function") {
                    crossLines.UserLine = ZSL.options.userLinePrepare(crossLines, el);
                }

                return {
                    'el': el,
                    'crossLines': crossLines,
                    '_isEventStart': new Array()

                }

            };

            /**
             * Вызов пользовательской фукнции если она существует
             **/
            ZSL.callUserFunc = function (fName, elData) {

                if (typeof(fName) == "function") {
                    fName(elData.el, elData);
                }
            }

            /**
             * Функция динамически вызывает пользовательские фукнции
             * при пересечении линии
             **/
            ZSL.scrollCross = function (scrollTop, elData) {
                for (key in elData.crossLines) {

                    if (scrollTop > elData.crossLines[key] && !elData._isEventStart[key]) {
                        var callUserFunc = ZSL.options.events['scrollDownCross' + key];
                        ZSL.callUserFunc(callUserFunc, elData);
                        elData._isEventStart[key] = true;
                    }

                    if (scrollTop <= elData.crossLines[key] && elData._isEventStart[key]) {
                        var callUserFunc = ZSL.options.events['scrollUpCross' + key];
                        ZSL.callUserFunc(callUserFunc, elData);
                        elData._isEventStart[key] = false;
                    }


                }

            };

            /** Массив с подготовленными данными для
             * вызова события scrollTop
             *
             */
            ZSL.elsData = new Array();

            /**
             * Инициализация приложения
             */
            ZSL.init = function () {
                // Высчитываем данные для создания линий пересечения элемента
                $(ZSL).each(function () {
                    ZSL.elsData.push(ZSL.prepareElData(this));
                });
                // Когда происходит событие скролл
                jQuery(ZSL.options.scrollParent).scroll(function () {
                    // Кол-во пикселей которые проскролили от начала ZSL.options.scrollParent
                    var scrollTop = jQuery(this).scrollTop();
                    // Перебираем все элементы и вызваем пользовательские фукнции на собитии пересечения
                    $(ZSL.elsData).each(function () {
                        ZSL.scrollCross(scrollTop, this);
                    });


                });
            };

            ZSL.init();
            return ZSL;

        }
    })(jQuery);
    
  
  /* Пример:
  при пересечении элментов .scroll_1,.scroll_2 в них будет меняться текст и цвет фона блока.
      
  $(document).ready(function () {
        $('.scroll_1,.scroll_2').zScrollLine({
            'events': {
                'scrollDownCrossTop': function (el) {
                    $(el).html('Cross Top');
                    $(el).css({'background':'#EA00D7'});
                },
                'scrollDownCrossBottom': function (el) {
                    $(el).html('Cross Bottom');
                },
                'scrollDownCrossUserLine': function (el) {
                    $(el).html('Cross UserLine');
                },
                'userLinePrepare': function () {
                    return 10;
                }

            }
        });

    });
</script>

<style>
    .scroll_1,.scroll_2,.scroll_3,.scroll_4{
        text-align: center;
        padding-top: 10%;
        font-size: 2em;
    }
    .scroll_1 {
        background: red;
        height: 200px;
    }

    .scroll_2 {
        background: green;
        height: 300px;
    }

    .scroll_3 {
        background: yellow;
        height: 100px;
    }

    .scroll_4 {
        background: blue;
        height: 150px;
    }


</style>
<br><br><br><br><br><br><br><br>

<div class="scroll_1">Scroll Line 1</div>
<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

<div class="scroll_2">Scroll Line 2</div>
<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

<div class="scroll_3">Scroll Line 3</div>
<br><br><br><br><br><br><br><br><br><br><br><br>

<div class="scroll_4">Scroll Line 4</div>
<br><br><br><br><br>

    */
    
    
    
