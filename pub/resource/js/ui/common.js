;$(function(){

    /****************************
        Hana Bank JS
    *****************************/

    /* Common UI */
    hanaUI.header('.app-header, .modal__header, .main__header'); //헤더공통
    //hanaUI.resizeDelay(id, time, callback) //윈도우 리사이즈 딜레이
    hanaUI.inputField('.input'); //인풋필드 기능
    //hanaUI.applyReadonly(target); 네이티브 키패드 호출후 readonly 제거, target은 .apply-readonly 가 있는 엘레멘트 셀렉터 ex) '.selector'
    hanaUI.textArea('.txtareawrap, .textarea'); //텍스트영역 기능
    hanaUI.placeholder('[data-element=placeholder__textarea]'); //플레이스홀더
    //hanaUI.slidePosition('.modal--slide .input__element'); //슬라이드팝업 좌표값 교정
    //hanaUI.dimmed('[data-element=dimmed__list]', '[data-element=dimmed__dim]'); //카드 리스트 딤드 (딤드 리스트, 딤드 레이어)


    hanaUI.customSelector('[data-selector]'); //커스텀 checkbox & radio
    hanaUI.inputSelector(); //checkbox & radio 기능
    hanaUI.jobSelector('[data-job=wrap]'); //직업선택

    hanaUI.toggleMore(); //펼치기 토글
    hanaUI.toggleEllipsis('.my-account'); //생략 토글
    hanaUI.toggleSelector1('[data-element=toggle-selector]', '[data-element=toggle-selector__trigger]', 'expand') //클래스 토글 (object, toggle button, toggle class)
    hanaUI.toggleSwitch('[data-element=toggle-switch]') //스위치 토글

    hanaUI.tooltip(); //툴팁
    hanaUI.regExp('[data-auto-complete]'); //자바스크립트 정규식
    hanaUI.privacy('.privacy__item'); //약관동의 접근성
    hanaUI.sticky('[data-sticky=normal]'); //고정메뉴
    hanaUI.stickyBanner('[data-sticky=banner]'); //오퍼가 있는 고정메뉴
    hanaUI.tabInit('.tab-wrap'); //탭 접근성 초기화
    hanaUI.floatingMenu('[data-element=floating]'); //플로팅 메뉴
    hanaUI.hiddenList('[data-element=hidden-list]'); //펼치기 목록
    hanaUI.swipeDelete.motion('[data-element=swipe-delete]'); //스와이프 리스트 삭제
    hanaUI.ariaHidden('hr'); //aria-hidden="true"
    hanaUI.tabindex('[role=img]'); //tabindex="0"
    hanaUI.buttonType('button'); //button type="button"
    hanaUI.offer('.offer'); //오퍼
    hanaUI.native.bottomInit(); //스크린리더 접근시 하단 버튼 고정 풀기
    hanaUI.customAccordion('[data-element=accordion][data-title]') //커스텀 아코디언
    hanaUI.cardCrop('[data-element=card-crop]') //카드 배경이미지 크롭
    hanaUI.roleText('label') //role="text"
    

    //hanaUI.coinDrop('.coindrop') //코인드랍 애니메이션
    //hanaUI.native.bottomUnfixed(); //하단 고정 버튼&레이어 숨김
    //hanaUI.native.bottomFixed(); //하단 고정 버튼&레이어 노출


    /* Slider */
    hanaUI.sliderDot1('[data-slider=dot1]'); //인디케이터 타입1
    hanaUI.sliderDotCustom1('[data-slider=dotCustom1]'); //커스텀 인디케이터 타입1
    hanaUI.sliderArrow1('[data-slider=arrow1]'); //좌우버튼 타입1
    hanaUI.sliderTabDot1('[data-slider=sliderDot1]', '[data-slider=sliderTab1]'); //탭 & 인디케이터 타입1, 인디케이터 이벤트 제거
    //hanaUI.sliderTab1('[data-slider=panel1]', '[data-slider=tab1]', 0); //탭 타입1, html 에서 실행함수 동작 (slide selector, tab selector, initial index) (비동기)
    hanaUI.sliderTab2('[data-slider=panel2]', '[data-slider=tab2]'); //탭 타입2
    //hanaUI.sliderTab3('[data-slider=panel3]', '[data-slider=tab3]'); //탭 타입3 (비동기)
    hanaUI.sliderTab4('[data-slider=panel4]', '[data-slider=tab4]'); //탭 타입4, 메인페이지
    hanaUI.sliderDotinTab1('[data-slider=sliderinTab]'); //탭 마다 슬라이더, 인디케이터 타입1
    hanaUI.sliderDotinTab2('[data-slider=sliderinTab2]'); //해쉬태크 탭 마다 슬라이더, 인디케이터 타입2
    //hanaUI.sliderDotinTab3('[data-slider=sliderinTab3]'); //탭 마다 슬라이더, 인디케이터 타입3 (비동기)

    //hanaUI.sliderStack1('[data-slider=stack1]'); //계층 슬라이더1
    //hanaUI.sliderStack2('[data-slider=stack2]'); //계층 슬라이더2


    /* Drag and Drop */
    hanaUI.sortable1('[data-element=sortable]', '[data-element=sortable-type]');

});


var hanaUI = {

    /****************************
        Common UI
    *****************************/

    header : function(obj){
        var $el = null;
        var $title = null;
        var titleWidth = 0;
        var keyLine = 0;
        var UsableWidth = 0;

        function init(obj){
            $el = $(obj);
            $title = $el.find('h1');
            titleWidth = $title.outerWidth();

            keyLine = $el.is('.app-header') ? 32 : 23; //좌우 키라인 + 타이틀과의 여백10
            btnLength = $el.is('.app-header') ? $el.find('>button:not(.app-header__button--size)').length : $el.parent().find('>button').length;
            UsableWidth = (btnLength <= 2) ? window.innerWidth - (80 + keyLine) : window.innerWidth - (160 + keyLine);

            if(window.innerWidth < 360){
                $title.css({
                    'width': UsableWidth + 20 + 'px',
                    'font-size' : '15px',
                    'white-space' : 'normal',
                    'word-break' : 'break-all',
                    'padding-left' : '0',
                    'padding-right' : '0',
                    'padding-top' : '7px'
                })
            }else{
                for(var i=0; i<15; i++){
                    if(UsableWidth < titleWidth){
                        $title.css('font-size', 18 - i + 'px');
                        titleWidth = $title.outerWidth();
                    }else{
                        break;
                    }
                }
            }
            action();
        }

        function event(){
            $(window).on('scroll', function(){
                action();
            });
        }

        function action(){
            if(!$('body').find('.fixed-header').length){
                if($(window).scrollTop() > 0){
                    $el.addClass('is-active');
                }else{
                    $el.removeClass('is-active');
                }
            }
        }

        init(obj);
        event();
    },
    
    // resizeDelay : function(id, time, callback){

    //     if($('body').is('.ios')){ return }

    //     if(typeof time === "undefined")
    //         time = 500;

    //     if(typeof window['resizeDelay'] === "undefined")
    //         window['resizeDelay'] = [];

    //     if(typeof window['resizeDelay'][id] !== "undefined")
    //         clearTimeout(window['resizeDelay'][id]);

    //     window['resizeDelay'][id] = setTimeout(callback, time);
    // },

    keypad : function(target, setTime){
        $('.input__element').removeClass('key');
        target.addClass('key');
        if($('body').is('.ios') || $('body').is('.isResize')){ return }
        
        if(typeof setTime === "undefined") { setTime = 300 } 

        var windowHeight = window.innerHeight;
        
        $(window).on('resize', function(){
            $('body').addClass('isResize');
            setTimeout(function(){
                if(windowHeight == window.innerHeight){
                    $('.input__element').each(function(i,e){
                        if($(e).is('.key')){
                            $(e).removeClass('key').trigger('blur');
                        }
                    })
                    $('body').removeClass('isResize');
                    $(window).off('resize');
                }    
            }, setTime)
        })
    },
    
    inputField : function(obj){
        var $el = null;
        var $input = null;
        var $label = null;
        var $clear = null;
        var $search = null;
        var $native = null;
        var windowHeight = 0;

        function init(obj){
            $el = $(obj);
            $input = $el.find('.input__element');
            $label = $el.find('label[aria-hidden]');
            $clear = $el.find('.input__remove-button');
            $search = $el.find('.search-button');
            $native = $('.native-inner[role=button]');

            windowHeight = window.innerHeight;

            for(var i=0; i<$input.length; i++){
                var $btn = $input.eq(i).closest($el).find($clear);
                if($input.eq(i).val() == '' || $input.eq(i).prop('disabled') == true || $input.eq(i).prop('readonly') == true){
                    $btn.hide();
                }else if($input.eq(i).val() != "" && $input.eq(i).closest($el).is('.input--on')) {
                    $btn.hide();
                }else{
                    $btn.show();
                    $input.eq(i).addClass('input--on');
                }
                if ($input.eq(i).prop('readonly') == true) {
                    if(!$input.eq(i).is('.input-date') && !$input.eq(i).closest('.input').is('.input--hybrid')){
                        $input.eq(i).closest(obj).addClass('readonly')
                    }

                }
            }
            title();
        };

        function event(){
            input();
            util();
            stopEvent();
        };

        function input(){
            $el.on({
                'input' : function(){
                    var $btn = $(this).closest($el).find($clear);
                    if($(this).val() == ""){
                        $btn.hide();
                    }else{
                        $btn.show();
                        $(this).closest($el).addClass('input--on input--focus');
                    }
                    if($(this).is('.masking')){
                        if($(this).val() == ''){
                            $(this).removeClass('active');
                        }else{
                            $(this).addClass('active');
                        }
                    }
                    
                },
                'blur' : function(e){
                    var $target = $(e.target)
                    if($(this).siblings('input').length || $(this).parent('.native-inner').siblings('.native-inner').length){
                        if($(this).val() == ''){
                            var that = $(this).closest($el).find($input);
                            var emptied = that.filter(function(){ return $(this).val() == '' }).length;

                            if(emptied == that.length){
                                $(this).closest($el).removeClass('input--on');
                            }
                        }
                    }else{
                        if($(this).val() == ''){
                            $(this).closest($el).removeClass('input--on');
                        }
                    }
                    $(this).closest($el).removeClass('input--focus');
                    if($(this).prop('readonly') == false){
                        setTimeout(function(){
                            if($('.input--focus:not([data-native=focus])').length == 0){
                                hanaUI.native.bottomShow();
                            }
                        },200);
                    }

                    if($('body').is('.ios')){
                        if($target.closest('.modal--slide').length){
                            setTimeout(function(){
                                if(!$target.closest('.modal--slide').find('.input--focus').length){
                                    window.scrollTo(document.body.scrollLeft, document.body.scrollTop);
                                }
                            }, 1)
                        }else{
                            setTimeout(function(){
                                if(!$('body').find('.input--focus').length){
                                    window.scrollTo(document.body.scrollLeft, window.scrollY + 1);
                                }
                            }, 1)
                        }
                    }
                    
                    setTimeout(function(){
                        $target.closest($el).find('.input__remove-button').hide();
                    },0)
                },
                'focus' : function(e) {
                    var $target = $(e.target)
                    if($(this).prop('readonly') == true){
                        return
                    }else{
                        $(this).closest($el).addClass('input--focus');
                        if($(this).val() !== ''){
                            $target.closest($el).find('.input__remove-button').show();
                        }
                        hanaUI.native.bottomHide();
                        hanaUI.keypad($target, 300);
                    }
                }
            }, '.input__element');
            $label.on('click', function(){
                $(this).closest($el).focus();
            });
            $native.on('click', function(){
                $(this).closest('.input').attr('data-native', 'focus');
            })
        };

        function util(){
            $clear.on({
                'touchstart' : function(){
                    $(this).closest($el).addClass('input--focus');
                },
                'focus' : function(){
                    $(this).closest($el).addClass('input--focus');
                },
                'blur' : function(){
                    if($(this).closest($el).is('.input--focus')){
                        $(this).closest($el).removeClass('input--focus');
                    }
                },
                'click' : function(e){
                    $(this).closest($el).find('.input__element').val('').closest($el).removeClass('input--on')
                    $(this).siblings('.input__element').focus();
                    //$(this).closest($el).removeClass('input--focus');
                    $(this).hide();
                    //e.stopPropagation();
                }
            });
            $search.on({
                'touchstart' : function(){
                    $(this).closest($el).addClass('input--focus');
                },
                'focus' : function(){
                    $(this).closest($el).addClass('input--focus');
                },
                'blur' : function(){
                    if($(this).closest($el).is('.input--focus')){
                        $(this).closest($el).removeClass('input--focus');
                    }
                }
            });
        };

        function title(){
            $input.each(function(i,e){
                var txt = $(e).closest($el).find('label').text();
                if(!$(e).is('.input-date')){
                    if($(e).parent().siblings('.input__optional').length < 1 && $(e).siblings('.input__optional').length < 1){
                        if($(e).attr('title') == ''){
                            $(e).attr('title', txt);
                        }
                    }
                }
            });
        };

        function stopEvent(){
            $('body').on('click', '.input__element', function(e){
                if($(this).parent().is('.native-inner')){
                    if($(this).prop('readonly') == true){
                        e.preventDefault();
                        e.stopPropagation();
                    }// else{
                    //     if($(this).parent().is('.apply-readonly')){
                    //         $(this).parent().removeAttr('role').removeClass('native-inner').addClass('input__inner');
                    //     }
                    // }
                }
            })
        }

        // function wepviewCheck(target){
        //     $(window).on('resize', function(){
        //         hanaUI.resizeDelay(target, 200, function(){
        //             if(windowHeight > window.innerHeight){
        //                 $('body').addClass('is-keypad');
        //             }else if(windowHeight == window.innerHeight){
        //                 if($('body').is('.is-keypad')){
        //                     hanaUI.native.bottomHide();
        //                 }
        //             }
        //         })
        //     })
        // }

        init(obj);
        event();
    },

    applyReadonly : function(obj){
        var $el = null;

        function init(obj){
            $el = $(obj);
        };

        function event(){
            $el.removeAttr('role').removeClass('native-inner').addClass('input__inner');
        };

        init(obj);
        event();
    },

    textArea : function(obj){
        var $el = null;
        var $textarea = null;
        var $label = null;

        function init(obj){
            $el = $(obj);
            $textarea = 'textarea';
            $label = '.txtareawrap__label';

            title();
        };

        function event(){
            input();
        };

        function input(){
            $el.on({
                'focus' : function(e) {
                    $target = $(e.target);
                    
                    if($(this).prop('readonly') == true){
                        return
                    }else{
                        $(this).closest($el).addClass('txtareawrap--on');
                        hanaUI.native.bottomUnfixed();
                        hanaUI.keypad($target, 300);
                    }
                },
                'blur' : function(){
                    if($(this).val() == ''){
                        $(this).closest($el).removeClass('txtareawrap--on');
                    }
                    hanaUI.native.bottomFixed();
                }
            }, $textarea);
            $el.on('click', $label, function(){
                $(this).closest($el).find($textarea).focus();
            });
        };

        function title() {
            $el.each(function(i,e){
                if($(e).find($label).length){
                    var txt = $(e).find($label).text();
                    $(e).find($textarea).attr('title', txt);
                }
            });
        };

        init(obj);
        event();
    },

    placeholder : function(obj){
        var $el = null;
        var $placeholder = null;

        function init(obj){
            $el = $(obj);
            $placeholder = '[data-element=placeholder__text]';
        };

        function event(){
            $el.on({
                'focus': function(){
                    $el.next($placeholder).hide();
                },
                'blur': function(){
                    if($el.val() == ''){
                        $el.next($placeholder).show();
                    }
                }
            })
            $($placeholder).on('click', function(){
                $(this).prev($el).trigger('focus');
            })
        };



        init(obj);
        event();
    },

    

    dimmed : function(obj, dim){
        var $obj = null;
        var $list = null;
        var $dim = null;

        var maxHeight = 0;
        var dimHeight = 0;
        var listHeight = 0;

        function init(obj, dim){
            $obj = $(obj);
            $list = $obj.find('[data-element=dimmed__item]')
            $dim = $(dim);

            maxHeight = $obj.data('maxheight');
            dimHeight = $dim.outerHeight();

            for(var i=0; i<$list.length; i++){
                listHeight += $list.eq(i).outerHeight(true)
            }

            if(maxHeight < listHeight){
                $obj.css({'max-height': maxHeight + 'px', 'padding-bottom': dimHeight + 'px'})
                $dim.show();
            }

        }

        init(obj, dim);
    },

    customSelector : function(obj){

        var $obj = null;
        var $list = null;
        var type = null;

        function init(obj){
            $obj = $(obj);
            $list = $obj.find('[data-selector=list]');
            type = $obj.data('selector');
        }

        function event(){
            switch (type){
                case 'radio' :
                    radio();
                    break;
                case 'checkbox' :
                    checkbox();
                    break;
            }
        }
        function radio(){
            $list.on('click', function(){
                if($(this).data('selected') == false){
                    $(this).attr({
                        'data-selected' : true,
                        'aria-checked' : true
                    })
                    .siblings().attr({
                        'data-selected' : false,
                        'aria-checked' : false
                    });
                }
            })
        }

        function checkbox(){
            //추후 구현
        }

        init(obj);
        event();
    },

    inputSelector : function(){

        var obj = null;
        var slideSpeed = 200;

        function init(){
            obj = $('[data-input-selector]');
        }

        function event(){
            $('body').on('change', '[data-input-name]', function(e){
                var that = $(e.target);
                var type = that.closest(obj).data('input-selector');

                switch (type){
                    case 'radio' :
                        radio(that);
                        break;
                    case 'checkbox' :
                        checkbox(that);
                        break;
                }
            });
        }

        function radio(that){
            var label = that.data('input-name');
            var target = that.data('input-target');

            if(that.is(':checked')){
                $('[data-input-labeledby=' + label + ']').hide();
                $('[data-input-section=' + target + ']').show();
            }
        }

        function checkbox(that){
            var target = that.data('input-target');
            var label = that.data('input-name');
            var $section = $('[data-input-section=' + target + ']');

            if(target == 'multiple'){
                if(that.is(':checked')){
                    $('[data-input-labeledby=' + label + ']').hide();
                    $('[data-input-labeledby=' + label + '][data-input-section-checked=true]').show();
                }else{
                    $('[data-input-labeledby=' + label + ']').hide();
                    $('[data-input-labeledby=' + label + '][data-input-section-checked=false]').show();
                }
                $('[data-input-section=' + target + ']');
            }else{
                if(that.is(':checked')){
                    that.attr('aria-expanded', 'true');
                    $section.stop().slideDown(slideSpeed);
                }else{
                    that.attr('aria-expanded', 'false');
                    $section.stop().slideUp(slideSpeed);
                }
            }
        }

        init();
        event();
    },

    jobSelector : function(obj){

        var $obj = null;
        var $target = null;
        var $placeholder = null;
        var $step = null;
        var $selector = null;
        var $category = null;
        var $title = null;

        function init(obj){
            $obj = $(obj);
            $target = $obj.find('[data-job=target]');
            $placeholder = $obj.find('[data-job=placeholder]');
            $step = $obj.find('[data-job-step]');
            $selector = $obj.find('[data-job=select]');
            $category = $obj.find('[data-job-category]');
            $title = $obj.find('[data-job=title]');
        }

        function event(){
            categorySelect();
        }

        function categorySelect(){
            $selector.on('change', 'input', function(){
                var select = $(this).closest($category).data('job-category');
                var step = $(this).closest($step).data('job-step');
                var job = $(this).next('label').text();

                if($(this).closest($step).data('job-step') < $step.length){
                    $placeholder.remove();
                    $target.append('<span class="job-choice__icon text-default">' + job + '</span>');
                    $step.eq(step).show().siblings('[data-job-step]').hide();
                    $step.eq(step).find($selector).each(function(i,e){
                        $(e).not('[data-job-flag=' + select +']').remove();
                    });
                    $title.eq(step).focus();
                }else{
                    if($target.children('.job-choice__icon').length < $step.length){
                        $target.append('<span class="job-choice__icon text-default">' + job + '</span>');
                    }else{
                        $target.children('.job-choice__icon:last').text(job);
                    }
                }
            });
        }

        init(obj);
        event();
    },

    toggleMore : function(){

        var $trigger = null;
        var $panel = null;

        function init(){
            $trigger = '[data-element=toggle-btn]';
            $panel = '[data-element=toggle-list]';

            for(var i=0; i<$($trigger).length; i++){
            	var $thisBtn = $($trigger).eq(i);
            	var expandedState = 'false';
            	if($thisBtn.hasClass('is-active')){
            		expandedState = 'true';
            	}
            	$thisBtn.attr({'data-trigger-index' : i, 'aria-expanded' : expandedState})
                //$($trigger).eq(i).attr({'data-trigger-index' : i, 'aria-expanded' : 'false'});
                $($panel).eq(i).attr('data-panel-index', i);
            }
        }

        function event(){
            $($trigger).on('click', function(e){
                var index = $(this).data('trigger-index');

                e.preventDefault();
                e.stopPropagation();

                if($(this).is('.is-active')){
                    if($.trim($(this).text()) == '접기'){
                        if($(this).attr('data-origin-text')){
                            $(this).text($(this).data('origin-text')).removeAttr('data-origin-text');
                        }else{
                            $(this).text('펼치기');
                        }
                    }else if($.trim($(this).text()) == '상세정보 접기'){
                        $(this).text('상세정보 보기');
                    }else if($(this).attr('data-origin-text')){
                        $(this).text($(this).data('origin-text')).removeAttr('data-origin-text');
                    }else if($.trim($(this).text()) == '가입 상세정보접기'){
                        $(this).text('가입 상세정보보기');
                    }else if($.trim($(this).text()) == '전환 상세정보접기'){
                        $(this).text('전환 상세정보보기');
                    }
                    $(this).attr('aria-expanded', 'false').removeClass('is-active');
                    $('[data-panel-index=' + index + ']').hide();
                }else{
                    if($.trim($(this).text()) == '펼치기'){
                        $(this).text('접기');
                    }else if($.trim($(this).text()) == '상세정보 보기'){
                        $(this).text('상세정보 접기');
                    }else if($.trim($(this).text()) == '이메일변경'){
                        $(this).attr('data-origin-text', $(this).text());
                        $(this).text('취소');
                    }else if($.trim($(this).text()) == '추가정보 입력'){
                        $(this).attr('data-origin-text', $(this).text());
                        $(this).text('접기');
                    }
                    else if($.trim($(this).text()) == '상세보기'){
                        $(this).attr('data-origin-text', $(this).text());
                        $(this).text('닫기');
                    }
                    else if($.trim($(this).text()) == '가입 상세정보보기'){
                        $(this).attr('data-origin-text', $(this).text());
                        $(this).text('가입 상세정보접기');
                    }
                    else if($.trim($(this).text()) == '전환 상세정보보기'){
                        $(this).attr('data-origin-text', $(this).text());
                        $(this).text('전환 상세정보접기');
                    }
                    $(this).attr('aria-expanded', 'true').addClass('is-active');
                    $('[data-panel-index=' + index + ']').show();
                }
            });
        }

        init();
        event();
    },

    toggleEllipsis : function(obj){

        var $obj = null;

        function init(obj){
            $obj = $(obj);
        }

        function event(){
            $obj.on('click', '.my-account__button button',function(e){
                e.preventDefault();
                e.stopPropagation();

                if ($(this).hasClass('on')) {
                    $(this).attr({'aria-expanded' : 'false', 'title' : '펼치기'}).removeClass('on');
                    $(this).closest('.my-account').removeClass('active');
                } else {
                    $(this).attr({'aria-expanded' : 'true', 'title' : '접기'}).addClass('on');
                    $(this).closest('.my-account').addClass('active');
                }
            });
        }

        init(obj);
        event();
    },

    toggleSelector1 : function(obj, trigger, toggleClass){

        var $obj = null;
        var $trigger = null;
        var $hidden = null;
        var activeClass = null;

        function init(obj, trigger, toggleClass){
            $obj = $(obj);
            $trigger = $obj.find(trigger);
            $hidden = $obj.find('.product-rank__items');
            activeClass = toggleClass;

            $trigger.attr('type', 'button');
            $hidden.attr('aria-hidden', 'true');
        }

        function event(){
            $trigger.on('click', function(){
                if($obj.is('.' + activeClass)){
                    $obj.removeClass(activeClass).attr('aria-expanded', 'false')
                    $hidden.attr('aria-hidden', 'true')
                    $(this).attr('aria-label', '금융차트 펼치기')

                }else{
                    $obj.addClass(activeClass).attr('aria-expanded', 'true')
                    $hidden.attr('aria-hidden', 'false')
                    $(this).attr('aria-label', '금융차트 접기')
                }
            })
        }

        init(obj, trigger, toggleClass);
        event();
    },

    toggleSwitch : function(obj){
        var $obj = null;

        function init(obj){
            $obj = $(obj);
            $obj.removeAttr('aria-pressed');
        }

        function event(){

            $obj.on('click', function(){
                if ($obj.hasClass('switch__label')) {
                    if($(this).is('.is-active')){
                        $(this).removeClass('is-active');
                    } else {
                        $(this).addClass('is-active');
                    }
                } else {
                    if($(this).is('.is-active')){
                        $(this).removeClass('is-active').text('잔액숨기기');
                        if($(this).parent('.total-lookup__amount').length){
                            $(this).parent('.total-lookup__amount').removeClass('is-active');
                        }
                    }else{
                        $(this).addClass('is-active').text('잔액보이기');
                        if($(this).parent('.total-lookup__amount').length){
                            $(this).parent('.total-lookup__amount').addClass('is-active');
                        }
                    }
                }
            })
        }

        init(obj);
        event();
    },

    tooltip : function(){

        var $open = null;
        var $close = null;

        function init(){
            $open = '[data-tooltip-button=open]';
            $close = '[data-tooltip-button=close]';

            $($open).each(function(i,e){
                if($(e).closest('.product-list__sub-item').find('.product-list__name').length){
                    $(e).closest('.product-list__sub-item').find('.product-list__name').addClass('with-tooltip');
                }
            })
        }

        function event(){
            $('body').on('touchstart', function(e){
                if($('[data-tooltip-panel=true]').length > 0){
                    if($(e.target).closest('[data-tooltip]').length < 1 ) {
                        var $el = $('[data-tooltip-panel=true]').closest('[data-tooltip]');
                        panelInit();
                        accessibilityOff($el);
                    }
                }
            });
            /* 디바이스 가로 변경시 툴팁 닫기 함수
            $(window).on('resize', function(){
                if($('[data-tooltip-panel=true]').length > 0){
                    var $el = $('[data-tooltip-panel=true]').closest('[data-tooltip]');
                    panelInit();
                    accessibilityOff($el);
                }
            });
            */
            open();
            close();
        }

        function open(){
            $('body').on('click', $open, function(e){
                var $el = $(this).closest('[data-tooltip]');
                var $panel = $el.find('[data-tooltip-panel]');
                var type = $el.data('tooltip');

                if($panel.attr('data-tooltip-panel') == 'false'){

                    if($('[data-tooltip-panel=true]').length > 0){
                        var $that = $('[data-tooltip-panel=true]').closest('[data-tooltip]');
                        panelInit();
                        accessibilityOff($that);
                    }

                    panelInit();

                    switch (type){
                        case 'list' :
                            if($(this).attr('aria-label')){
                                $(this).attr('aria-label', $(this).attr('aria-label').replace('열기', '닫기') );
                            }else if($(this).attr('title')){
                                $(this).attr('title', $(this).attr('title').replace('열기', '닫기') );
                            }
                        break;
                        case 'paragraph' :
                            panelPosition($el);
                            if($(this).attr('aria-label')){
                                $(this).attr('aria-label', $(this).attr('aria-label').replace('열기', '닫기') );
                            }else if($(this).attr('title')){
                                $(this).attr('title', $(this).attr('title').replace('열기', '닫기') );
                            }
                        break;
                    }

                    accessibilityOn($el);
                    $panel.attr('data-tooltip-panel', 'true').show({
                        duration : 0,
                        complete : function(){
                            setTimeout(function(){
                                focusIn($el);
                            },100)
                        }
                    })

                }else{
                    $el.find($close).trigger('click');
                }
                e.preventDefault();
                e.stopPropagation();
            });
        }

        function close(){
            $('body').on('click', $close, function(){
                var $el = $(this).closest('[data-tooltip]');
                panelInit();
                accessibilityOff($el);
                focusOut($el);
            });
        }

        function panelPosition($el){
            var $panel = $el.find('[data-tooltip-panel]');
            var objLeft = $el.find($open).offset().left;
            var objTop = $el.find($open).offset().top;
            var screenWidth = window.innerWidth;
            var documentHeight = $(document).height();
            var keyline = 24;
            var bottomSpace = 320;

            if(objTop > (documentHeight - bottomSpace)){
                $panel.css({
                    top : 'auto',
                    bottom : '26px'
                });
            }
            $panel.css({
                width : screenWidth - (keyline * 2) + 'px',
                left : - (objLeft - keyline) + 'px'
            });
        }

        function panelInit(){
            var $panel = $('[data-tooltip-panel=true]');
            var $el = $panel.closest('[data-tooltip]');
            var type = $el.data('tooltip');

            $panel.attr('data-tooltip-panel', 'false').hide();

            switch (type){
                case 'list' :
                    $panel.find('.tooltip__item:first a').removeAttr('tabindex');
                    if($el.find($open).attr('aria-label')){
                        $el.find($open).attr('aria-label', $el.find($open).attr('aria-label').replace('닫기', '열기') );
                    }else if($el.find($open).attr('title')){
                        $el.find($open).attr('title', $el.find($open).attr('title').replace('닫기', '열기') );
                    }
                break;
                case 'paragraph' :
                    $panel.find('[data-tooltip="focus"]').removeAttr('tabindex');
                    if($el.find($open).attr('aria-label')){
                        $el.find($open).attr('aria-label', $el.find($open).attr('aria-label').replace('닫기', '열기') );
                    }else if($el.find($open).attr('title')){
                        $el.find($open).attr('title', $el.find($open).attr('title').replace('닫기', '열기') );
                    }
                break;
            }
        }

        function focusIn($el){
            var type = ($el).data('tooltip');

            switch (type){
                case 'list' :
                        $el.find('.tooltip__item:first a').attr('tabindex', '0').focus();
                    break;
                case 'paragraph' :
                        $el.find('[data-tooltip="focus"]:first').attr('tabindex', '0').focus();
                    break;
            }
        }

        function focusOut($el){
            $el.find($open).focus();
        }

        function accessibilityOn($el){
            var $panel = $el.find('[data-tooltip-panel]');
            var $parent = $panel.parent();
            var hidden = null;

            $('body').attr('data-node', 'end');
            $panel.siblings().attr('aria-hidden', 'true');

			hidden = setInterval(function(){
			    if($parent.attr('data-node') == 'end'){
                    clearInterval(hidden);
                }else{
                    $parent.siblings('[aria-hidden=true]').each(function(i,e){
                        $(e).attr('data-aria-hidden', 'has');
                    });
                    $parent.siblings().attr('aria-hidden', 'true');
                    $parent = $parent.parent();
                }
			}, 1);
        }

        function accessibilityOff($el){
            var $panel = $el.find('[data-tooltip-panel]');
            var $parent = $panel.parent();
            var hidden = null;

            $panel.siblings().removeAttr('aria-hidden');

			hidden = setInterval(function(){
			    if($parent.attr('data-node') == 'end'){
                    clearInterval(hidden);
                }else{
                    $parent.siblings('[aria-hidden=true]').each(function(i,e){
                        if($(e).is('[data-aria-hidden=has]')){
                            $(e).removeAttr('data-aria-hidden');
                        }else{
                            $(e).removeAttr('aria-hidden');
                        }
                    });
                    $parent = $parent.parent();
                }
			}, 1);

            $('body').removeAttr('data-node');
        }

        init();
        event();
    },

    regExp : function(obj){

        var $obj = null;

        function init(obj){
            $obj = $(obj);
        }

        function event(){
            $obj.on("keyup", function(){
                var that = $(this);
                var type = that.data('auto-complete');

                switch (type){
                    case 'phone' :
                        phone(that);
                        break;
                    case 'validThru' :
                        validThru(that);
                        break;
                    case 'cardNum' :
                        cardNum(that);
                        break;
                }


            });
        }

        function phone(that){
            that.val(
                that.val()
                .replace(/[^0-9]/g, "")
                .replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, "$1-$2-$3")
            );
        }

        function validThru(that){
            that.val(
                that.val()
                .replace(/[^0-9]/g, "")
                .replace(/\B(?=(\d{2})+(?!\d))/g, "/")
            );
        }

        function cardNum(that){
            that.val(
                that.val()
                .replace(/[^0-9]/g, "")
                .replace(/\B(?=(\d{4})+(?!\d))/g, " ")
            );
        }

       init(obj);
       event();
    },

    privacy : function(obj){

        var $obj = null;

        function init(obj){
            $obj = $(obj);

            idCheck();
        }

        function idCheck(){
            $obj.each(function(i,e){
                var $check = $(e).find('.privacy__icon');
                var $button = $(e).find('.privacy__detail');

                // $check.attr('title', '새창열림');
                // $button.removeAttr('aria-label').attr('title', '새창열림');

                if($button.attr('id')){
                    if($button.attr('id').substring(0,8) == 'privacy-'){
                        $button.attr('id', '');
                    }
                }

                if (!$button.attr('id') || $button.attr('id') == '') {
                    $check.attr('aria-labelledby', 'privacy-' + i);
                    $button.attr('id', 'privacy-' + i);
                } else {
                    $check.attr('aria-labelledby', $button.attr('id'));
                }
            });
        }

        init(obj);
    },

    sticky : function(obj){

        var $obj = null;
        var $wrap = null;

        var $open = null;
        var $panel = null;
        var $select = null;
        var $close = null;

        var objHeight = 0;
        var objTop = 0;
        var headerHeight = 0;
        var winTop = 0;

        var flag = false;

        function init(obj){
            $obj = $(obj);
            objHeight = $obj.outerHeight();

            if($obj.find('.search-list__keyword-box').length){
                $open = $obj.find('.search-list__open-button');
                $panel = $obj.find('.search-list__keyword-box');
                $select = $obj.find('.search-list__keyword-select');
                $close = $obj.find('.search-list__remove-button');
                flag = true;
            }

            headerHeight = $('.app-header, .modal-full .modal__header').outerHeight();

            if(!$obj.parent('[data-sticky=wrap]').length){
                $(obj).wrap('<div data-sticky="wrap" style="height:' + objHeight + 'px" />');
            }else{
                $wrap = $obj.parent('[data-sticky=wrap]');
                $wrap.css('height', objHeight + 'px')    
            }

            $wrap = $obj.parent('[data-sticky=wrap]');

            $obj.css({
                'position' : '',
                'left' : '',
                'top' : '',
                'background-color' : '',
                'z-index' : ''
            })
            $wrap.removeClass('is-active');
            
            if($obj.length){
                objTop = $obj.offset().top;
            }
            winTop = $(window).scrollTop();

            fixed(winTop);
        }

        function event(){
            $(window).off('scroll').on('scroll', function(){
                winTop = $(window).scrollTop();

                fixed(winTop);
            });

            if(flag){
                panelOpen();
                panelClose();
            }
        }

        function fixed(winTop){
            if(winTop > (objTop - headerHeight)){
                $obj.css({
                    'position' : 'fixed',
                    'left' : '0',
                    'top' : headerHeight + 'px',
                    'width' : '100%',
                    'background-color' : '#f9f9fb',
                    'z-index' : '110'
                })
                $wrap.addClass('is-active');
            }else{
                $obj.css({
                    'position' : '',
                    'left' : '',
                    'top' : '',
                    'background-color' : '',
                    'z-index' : ''
                })
                $wrap.removeClass('is-active');
            }
        }

        function panelOpen(){
            $open.on('click', function(){
                $open.attr('aria-expanded', 'true').hide();
                $panel.show();
                wrapHeight();
                $select.focus();
            });
        }

        function panelClose(){
            $close.on('click', function(){
                $panel.hide();
                wrapHeight();
                $open.show().attr('aria-expanded', 'false').focus();
            });
        }

        function wrapHeight(){
            objHeight = $obj.outerHeight();
            $wrap.css('height', objHeight + 'px');
        }

        init(obj);
        event();
    },

    stickyBanner : function(obj){

        var $obj = null;
        var $banner = null;
        var $content = null;

        var objTop = 0;
        var winTop = 0;
        var headerHeight = 0;
        var bannerHeight = 0;
        var objHeight = 0;

        function init(obj){
            $obj = $(obj);
            $banner = $('.offer');
            $content = $('.app-main--offer');

            headerHeight = $('.app-header').outerHeight();
        }


        function event(){

            $(window).on('scroll', function(){
                winTop = $(window).scrollTop();
                if($obj.length){
                    if(!$obj.is('.ready')){
                        objTop = $obj.offset().top
                        $obj.addClass('ready');
                    }
                    if(!$banner.is('.ready')){
                        if($banner.is(':visible')){
                            bannerHeight = $banner.outerHeight();
                            $banner.addClass('ready');
                        }       
                    }
                }
                
                fixed();
            });

            $banner.on('click', '.offer__close', function(){
                objTop = objTop - bannerHeight
            });
        }

        function fixed(){

            if(winTop > (objTop - headerHeight)){
                objHeight = $obj.outerHeight();
                $obj.css({
                        'position' : 'fixed',
                        'left' : '0',
                        'top' : headerHeight + 'px',
                        'width' : '100%',
                        'z-index' : '110'
                    })
                    .addClass('is-active')
                $content.removeClass('app-main--offer-off').addClass('app-main--offer-on');
            }else{
                $obj.css({
                        'position' : '',
                        'left' : '',
                        'top' : '',
                        'z-index' : ''
                    })
                    .removeClass('is-active')
                $content.removeClass('app-main--offer-on').addClass('app-main--offer-off');
            }

        }

        init(obj);
        event();
    },

    tabInit : function(obj){

        var $obj = null;
        var $tabList = null;

        function init(obj){
            $obj = $(obj);
            $tabList = $obj.children('ul');

            $tabList
                .attr('role', 'tablist')
                .find('>li')
                .each(function(i,e){
                    var tab = $(e).children();
                    if(tab.is('.is-active')){
                        tab.attr({'role': 'tab', 'aria-selected': 'true'});
                    }else{
                        tab.attr({'role': 'tab', 'aria-selected': 'false'});
                    }
                });

        }

        //event(){
            //클릭 이벤트 제어 필요시 사용
        //}

        init(obj);
        //event();
    },

    native : {

        bottomUnfixed : function(){

            var $obj = null;

            function init(){
                $obj = $('#footer, .button-fixed');
            }

            function event(){
                $obj.css('position', 'relative').addClass('unfixed');
            }

            init();
            event();
        },

        bottomFixed : function(){

            var $obj = null;

            function init(){
                $obj = $('#footer, .button-fixed');
            }

            function event(){
                $obj.css('position', 'fixed').removeClass('unfixed');;
            }

            init();
            event();
        },

        bottomHide : function(){

            if($('body').data('accessibility')){
                return
            }

            var $obj = null;

            function init(){
                $obj = $('#footer, .button-fixed');
            }

            function event(){
                $obj.stop(true).hide();
            }

            init();
            event();
        },

        bottomShow : function(){

            if($('body').data('accessibility')){
                return
            }

            var $obj = null;

            function init(){
                $obj = $('#footer, .button-fixed');
            }

            function event(){
                $obj.stop().fadeIn('50');
            }

            init();
            event();
        },

        bottomInit : function(){
            if(typeof HANA_READER_YN !== 'undefined'){
                if(HANA_READER_YN == 'Y'){
                    $('body').attr('data-accessibility', 'true');
                    hanaUI.native.bottomUnfixed();
                    hanaUI.native.errorText();
                }
            }
        },

        errorText : function(){
            $('body').on('click', '.button-wrap .button:last', function(){
                $('.input__error').each(function(i,e){
                    $(e).text($(e).text());
                })
                
            })
        }
    },

    floatingMenu : function(obj){

        var $obj = null;
        var $button = null;
        var $close = null;
        var $menu = null;
        var $dim = null;
        
        var activeClass = null;
        var mainClass = null;
        var msgClass = null;
        var loadClass = null;
        var closeClass = null;
        var menuActiveClass = null;
        
        var collapseClass = null;
        var wait = null;
        var windowScroll = 0;

        function init(obj){
            $obj = $(obj);
            $button = $obj.find('.floating__button');
            $close = $obj.find('.floating__close');
            $menu = $obj.find('.floating__items');
            $dim = $obj.find('.floating__dim');
            
            activeClass = 'floating--active';
            mainClass = 'floating--main';
            msgClass = 'floating--message';
            loadClass = 'floating--load';
            closeClass = 'floating--close';

            menuActiveClass = 'floating__items--active'
            collapseClass = 'floating__button--collapse';

            if($obj.is('.' + mainClass)){
                wait = setInterval(function(){
                    if($obj.is('.' + loadClass)){
                        clearInterval(wait);
                        setTimeout(function(){
                            $obj.removeClass(mainClass).removeClass(loadClass);
                        }, 3000)
                    }
                }, 500);
            }

            if($obj.is('.' + msgClass)){
                wait = setInterval(function(){
                    if($obj.is('.' + loadClass)){
                        clearInterval(wait);
                        setTimeout(function(){
                            $obj.removeClass(loadClass);
                        }, 3000)
                    }
                }, 500);
            }
        }

        function event(){
            $button.on('click', function(){

                if(!$obj.is('.' + activeClass)){
                    windowScroll = $(window).scrollTop()
                    $('#wrap')
                        .css({
                            "position": "fixed",
                            "width": "100%",
                            "height": "100%",
                            "overflow": "hidden"
                        })
                        .scrollTop(windowScroll);
                    $('body').addClass('modal-open');
                    $dim.fadeIn(250);

                    $obj
                        .addClass(activeClass)
                        .siblings('[aria-hidden=true]').each(function(i,e){
                            $(e).attr('data-aria-hidden', 'has');
                        });
                    $obj.siblings().attr('aria-hidden', 'true');
                    $(this).attr('aria-expanded', 'true').addClass(collapseClass);
                    $menu.show();
                    setTimeout(function(){
                        $menu.addClass(menuActiveClass);
                    },0)
                    $close.attr('aria-hidden', 'true');
                }else{
                    
                    $('body').removeClass('modal-open');
				    $('#wrap').css({
                        "position": "",
                        "width": "",
                        "height": "",
                        "overflow": ""
                    })
                    $(window).scrollTop(windowScroll);
                    $dim.fadeOut(200);

                    $('#wrap').css({'position': 'relative'});
                    $obj
                        .removeClass(activeClass)
                        .siblings('[aria-hidden=true]').each(function(i,e){
                            if($(e).is('[data-aria-hidden=has]')){
                                $(e).removeAttr('data-aria-hidden');
                            }else{
                                $(e).removeAttr('aria-hidden');
                            }
                        });
                        $(this).attr('aria-expanded', 'false').removeClass(collapseClass);;
                        $menu.removeClass(menuActiveClass)
                        setTimeout(function(){
                            $menu.hide();
                        },200)
                        
                    $close.attr('aria-hidden', 'false');
                }
            });
            $close.on('click', function(){
                $obj.addClass(closeClass).fadeOut(150);
            });

        }

        init(obj);
        event();
    },

    hiddenList : function(obj){

        var $obj = null;
        var $item = null;
        var $more = null;
        var $slider = null;

        var objSlideSelector = null;
        var visible = 0;
        var slideFlag = false;

        function init(obj){
            $obj = $(obj);
            $item = $obj.find('[data-element=hidden-list__item]');
            $more = $obj.find('[data-element="hidden-list__more"]')

            objSlideSelector = $obj.data("list-slider-selector");
            visible = Number($obj.data('list-visible'));

            if($obj.closest('[data-slider]').data('slider') == objSlideSelector){
                $slider = $('[data-slider=' + objSlideSelector + ']');
                slideFlag = true;
            }

            $item.each(function(i,e){
                if($(e).index() >= visible){
                    $(e).hide();
                }
            })

            if($item.length <= visible){
                $more.hide();
            }else{
                $more.show();
            }
        }

        function event(){
            $more.on('click', 'button', function(){
                $(this).closest(obj).find($item).show();
                if($(this).hasClass('fund-main-more')){
                    $(this).closest($more).hide();
                }
                slideCheck();
            })
        }

        function slideCheck(){
            if(slideFlag == true){
                $slider.slick('setPosition');
            }
        }

        init(obj);
        event();
    },

    swipeDelete : {

        motion : function(obj){

            if($('body').data('accessibility')){
                return $(obj).on('click', '[data-element=swipe-delete__button]', function(e){
                    var target = $(e.target);
                    hanaUI.swipeDelete.remove(target);
                })
            }

            var $obj = null;
            var $item = null;
            var $panel = null;
            var extraSpace = 0;
            var extraSpaceX = 0;

            function init(obj){
                $obj = $(obj);
                $item = $obj.find('[data-element=swipe-delete__item]');
                $panel = $obj.find('[data-element=swipe-delete__panel]');
                extraSpace = 80; //delete button width
                extraSpaceX = -($obj.outerWidth(true)/2);
            }

            function event(){
                var startX = 0;
                var rStartY = 0;
                var rStartY = 0;
                var objX = 0;

                $panel.on({
                    'touchstart' : function(e){
                        if($(this).is('.is-active')){
                            startX = (e.originalEvent.touches[0].pageX) + 80
                        }else{
                            startX = e.originalEvent.touches[0].pageX
                        }
                        rStartX = e.originalEvent.touches[0].pageX
                        rStartY = e.originalEvent.touches[0].pageY

                        $panel.not($(this)).stop().animate({
                            'left' : 0
                        }, 100, function(){
                            $panel.not($(this)).removeClass('is-active')
                        })
                    },
                    'touchmove' : function(e){
                        var xDist = 0; 
                        var yDist = 0; 
                        var r = 0; 
                        var swipeAngle = 0;
                        
                        objX = e.originalEvent.touches[0].pageX - startX;
                        
                        xDist = rStartX - e.originalEvent.touches[0].pageX;
                        yDist = rStartY - e.originalEvent.touches[0].pageY;

                        r = Math.atan2(yDist, xDist);
                        swipeAngle = Math.round(r * 180 / Math.PI);
                        
                        if((swipeAngle <= 30) && (swipeAngle >= -30) || (swipeAngle <= 210) && (swipeAngle >= 150)){
                            if(objX <= 0){
                                $(this).css( 'left', objX + 'px');
                            }
                        }
                    },
                    'touchend' : function(e){
                        var target = $(e.target);

                        if(objX >= -24){
                            $(this).stop().animate({
                                'left' : '0px'
                            }, 100, function(){
                                $(this).removeClass('is-active')
                            })
                        }else if(objX < -24 && objX > extraSpaceX){
                            $(this).stop().animate({
                                'left' : - extraSpace + 'px'
                            }, 100, function(){
                                $(this).addClass('is-active')
                            })
                        }else if(objX <= extraSpaceX){
                            hanaUI.swipeDelete.remove(target);
                        }
                    }
                })

                $(obj).on('click', '[data-element=swipe-delete__button]', function(e){
                    var target = $(e.target);
                    hanaUI.swipeDelete.remove(target);
                })
            }

            init(obj);
            event();
        },

        remove : function(target){
            target = target.closest('[data-element=swipe-delete__item]')

            target.animate({
                height : '0'
            }, 100, function(){
                beforeRemove(target);
                if(target.siblings().length == 0){
                    target.closest('[data-element=swipe-delete]').prev('[data-element=swipe-delete__header]').remove();
                }
                target.remove();
            })
        }
    },

    ariaHidden : function(obj){

        var $obj = null;

        function init(obj){
            $obj = $(obj);
            $obj.attr('aria-hidden', 'true');
        }

        init(obj);
    },

    tabindex : function(obj){

        var $obj = null;

        function init(obj){
            $obj = $(obj);
            $obj.attr('tabindex', '0');
        }

        init(obj);
    },

    buttonType : function(obj){

        var $obj = null;

        function init(obj){
            $obj = $(obj);
            $obj.attr('type', 'button');
        }

        init(obj);
    },


    offer : function(obj){

        var $obj = null;

        function init(obj){
            $obj = $(obj);
        }

        function event(){
            $obj.on('click', '.offer__close', function(e){
                $(this).closest($obj).slideUp(150);
            })
        }

        init(obj);
        event();
    },

    coinDrop : function(obj){

        var $obj = null;
        var coin = [];

        function init(obj){
            $obj = $(obj);

            //코인 Path / generator - http://jqbezier.ericlesch.com/
            coin = [
                {
                    start : { x: 0, y: 0, angle: 203.171, length: 1.462 }, //1번 코인 path
                    end : { x: 79, y: 250, angle: 18.163, length: 2.394}
                },
                {
                    start : { x: 0, y: 0, angle: 180.997, length: 0.941 }, //2번 코인 path
                    end : { x: 0, y: 350, angle: 2.177, length: 1.995}
                },
                {
                    start : { x: 0, y: 0, angle: 186.326, length: 0.981 }, //3번 코인 path
                    end : { x: 17, y: 310, angle: 4.125, length: 1.981}
                },
                {
                    start : { x: 0, y: 0, angle: 192.285, length: 0.567 }, //4번 코인 path
                    end : { x: 46, y: 311, angle: 8.537, length: 1.842}
                },
                {
                    start : { x: 0, y: 0, angle: 272.441, length: 0.568 }, //5번 코인 path
                    end : { x: 410, y: 210, angle: 45.550, length: 1.001}
                },
                {
                    start : { x: 0, y: 0, angle: 251.643, length: 0.497 }, //6번 코인 path
                    end : { x: 415, y: 400, angle: 14.324, length: 0.070}
                },
                {
                    start : { x: 0, y: 0, angle: 211.307, length: 0.498 }, //7번 코인 path
                    end : { x: 188, y: 400, angle: 14.439, length: 0.879}
                },
                {
                    start : { x: 0, y: 0, angle: 186.383, length: 0.374 }, //8번 코인 path
                    end : { x: 20, y: 400, angle: 3.438, length: 0.829}
                },
                {
                    start : { x: 0, y: 0, angle: 194.061, length: 0.456 }, //9번 코인 path
                    end : { x: 79, y: 400, angle: 8.652, length: 0.883}
                },
                {
                    start : { x: 0, y: 0, angle: 250.268, length: 0.370 }, //10번 코인 path
                    end : { x: 397, y: 400, angle: 20.111, length: 0.361}
                },
                {
                    start : { x: 0, y: 0, angle: 171.773, length: 1.000 }, //11번 코인 path
                    end : { x: -42, y: 305, angle: 353.400, length: 1.966}
                },
                {
                    start : { x: 0, y: 0, angle: 173.893, length: 1.785 }, //12번 코인 path
                    end : { x: -21, y: 250, angle: 354.718, length: 2.436}
                },
                {
                    start : { x: 0, y: 0, angle: 162.949, length: 1.328 }, //13번 코인 path
                    end : { x: -73, y: 270, angle: 347.843, length: 2.171}
                },
                {
                    start : { x: 0, y: 0, angle: 145.818, length: 0.451 }, //14번 코인 path
                    end : { x: -135, y: 400, angle: 345.379, length: 0.680}
                },
                {
                    start : { x: 0, y: 0, angle: 146.104, length: 0.525 }, //15번 코인 path
                    end : { x: -211, y: 400, angle: 342.285, length: 0.306}
                },
                {
                    start : { x: 0, y: 0, angle: 113.732, length: 0.409 }, //16번 코인 path
                    end : { x: -300, y: 400, angle: 343.717, length: 0.203}
                },
                {
                    start : { x: 0, y: 0, angle: 116.826, length: 0.489 }, //17번 코인 path
                    end : { x: -330, y: 400, angle: 336.613, length: 0.274}
                },
                {
                    start : { x: 0, y: 0, angle: 107.888, length: 0.518 }, //18번 코인 path
                    end : { x: -385, y: 400, angle: 335.696, length: 0.169}
                },
                {
                    start : { x: 0, y: 0, angle: 68.640, length: 0.527 }, //19번 코인 path
                    end : { x: -390, y: 400, angle: 335.352, length: 0.224}
                },
                {
                    start : { x: 0, y: 0, angle: 155.214, length: 0.623 }, //20번 코인 path
                    end : { x: -72, y: 400, angle: 350.765, length: 0.314}
                },
                {
                    start : { x: 0, y: 0, angle: 241.674, length: 0.473 }, //21번 코인 path
                    end : { x: 329, y: 259, angle: 27.788, length: 0.915}
                },
                {
                    start : { x: 0, y: 0, angle: 208.557, length: 0.621 }, //22번 코인 path
                    end : { x: 141, y: 286, angle: 19.022, length: 1.198}
                },
                {
                    start : { x: 0, y: 0, angle: 204.321, length: 0.623 }, //23번 코인 path
                    end : { x: 100, y: 300, angle: 14.866, length: 1.410}
                },
                {
                    start : { x: 0, y: 0, angle: 191.139, length: 0.542 }, //24번 코인 path
                    end : { x: 56, y: 361, angle: 8.136, length: 1.372}
                },
                {
                    start : { x: 0, y: 0, angle: 211.937, length: 0.489 }, //25번 코인 path
                    end : { x: 200, y: 352, angle: 12.662, length: 1.270}
                },
                {
                    start : { x: 0, y: 0, angle: 172.174, length: 0.616 }, //26번 코인 path
                    end : { x: -31, y: 345, angle: 352.541, length: 1.503}
                },
                {
                    start : { x: 0, y: 0, angle: 156.016, length: 0.587 }, //27번 코인 path
                    end : { x: -142, y: 336, angle: 344.749, length: 1.259}
                },
                {
                    start : { x: 0, y: 0, angle: 114.821, length: 0.503 }, //28번 코인 path
                    end : { x: -212, y: 328, angle: 334.665, length: 1.039}
                },
                {
                    start : { x: 0, y: 0, angle: 137.166, length: 0.574 }, //29번 코인 path
                    end : { x: -156, y: 340, angle: 342.514, length: 1.027}
                },
                {
                    start : { x: 0, y: 0, angle: 100.440, length: 0.390 }, //30번 코인 path
                    end : { x: -346, y: 228, angle: 339.993, length: 0.854}
                },
                {
                    start : { x: 0, y: 0, angle: 227.693, length: 0.941 }, //31번 코인 path
                    end : { x: 230, y: 255, angle: 29.393, length: 1.530}
                },
                {
                    start : { x: 0, y: 0, angle: 196.467, length: 1.142 }, //32번 코인 path
                    end : { x: 54, y: 267, angle: 12.261, length: 1.948}
                },
                {
                    start : { x: 0, y: 0, angle: 207.583, length: 0.929 }, //33번 코인 path
                    end : { x: 143, y: 297, angle: 22.173, length: 1.571}
                },
                {
                    start : { x: 0, y: 0, angle: 235.944, length: 0.670 }, //34번 코인 path
                    end : { x: 370, y: 268, angle: 22.918, length: 1.366}
                },
                {
                    start : { x: 0, y: 0, angle: 264.305, length: 0.600 }, //35번 코인 path
                    end : { x: 306, y: 67, angle: 32.487, length: 1.093}
                },
                {
                    start : { x: 0, y: 0, angle: 161.975, length: 1.021 }, //36번 코인 path
                    end : { x: -85, y: 299, angle: 343.889, length: 1.718}
                },
                {
                    start : { x: 0, y: 0, angle: 135.734, length: 0.894 }, //37번 코인 path
                    end : { x: -200, y: 300, angle: 338.332, length: 1.522}
                },
                {
                    start : { x: 0, y: 0, angle: 124.217, length: 0.722 }, //38번 코인 path
                    end : { x: -345, y: 288, angle: 331.513, length: 1.285}
                },
                {
                    start : { x: 0, y: 0, angle: 74.313, length: 0.429 }, //39번 코인 path
                    end : { x: -525, y: 102, angle: 326.128, length: 0.480}
                },
                {
                    start : { x: 0, y: 0, angle: 94.767, length: 0.645 }, //40번 코인 path
                    end : { x: -495, y: 91, angle: 314.038, length: 0.883}
                }
            ]

            $obj.find('.coindrop__item').remove();            
            
            for(var i=0; i<40; i++){
                $obj.find('.coindrop__starting').append('<i class="coindrop__item"></i>')
            }
            
        }

        function event(){
            setTimeout(function(){
                $obj.find('.coindrop__item').each(function(i,e){
                    $(e).css('opacity', 1).animate({
                        path : new $.path.bezier(coin[i])
                    }, 2000, 'easeOutCubic', function(){
                        $obj.hide();
                    });
                })
            },500)
        }

        init(obj);
        event();
    },

    // accordion custom
    customAccordion: function(obj){
        var $obj = $(obj)
        function init() {
            if ($obj.length) {
                option()
            }
        }
        function option() {
            var $title = $obj.data('title');
            var $activeTitle = $obj.data('active-title');
            var $isSame = false;

            $obj.find('[data-element=accordion__anchor]').attr('title', $title)

            $obj.on('beforeChange', function(evvent, plugin, anchor, panel) {
                if (anchor.hasClass('is-active')) {
                    $isSame = true;
                } else {
                    $isSame = false;
                }
            })

            $obj.on('afterChange', function(evvent, plugin, anchor, panel) {
                plugin.$anchor.attr('title', $title)
                if (!$isSame) {
                    anchor.attr('title', $activeTitle)
                } else {
                    anchor.attr('title', $title)
                }
            })
        }

        init()
    },

    cardCrop : function(obj){

        var $obj = null;
        var size = 0;

        function init(obj){
            $obj = $(obj);
            size = $obj.width()

            $obj.css('height', size + 'px')
        }

        function event(){

        }

        init(obj);
        event();
    },

    roleText : function(obj){

        var $obj = null;
        var $block = null;

        function init(obj){
            $obj = $(obj);
            $block = 'div, ul, ol, dl';

            $obj.each(function(i,e){
                if($(e).find($block).length > 0){
                    $(e).attr('role', 'text');
                }
            })
        }

        function event(){


        }

        init(obj);
        event();
    },







    /****************************
        Slider
    *****************************/

    //Dot type 1
    sliderDot1 : function(obj){
        
        if($(obj).length < 1) return;
        
        $(obj).slick({
            slidesToShow: 1,
            dots: true,
            arrows: false
        });
    },

    //Custom Dot type 1
    sliderDotCustom1 : function(obj){

        if($(obj).length < 1) return;

        $(obj).slick({
            swipe: false,
            arrows: false,
            dots: true,
            fade: true,
            speed: 300,
            cssEase: 'linear',
            dotsClass: 'message-card-tab',
            customPaging: function(slick,index) {
                var targetImage = slick.$slides.eq(index).find('img').attr('src');
                return ' <button type="button" class="message-card-tab__item"><img aria-hidden="true" src=" ' + targetImage + ' "/></button>'
            }
        });
    },

    //Arrow type 1
    sliderArrow1 : function(obj){

        if($(obj).length < 1) return;

        $(obj).slick({
            slidesToShow: 1,
            dots: false,
            arrows: true,
            adaptiveHeight : true
        });
    },

    //Tab & Dot type 1
    sliderTabDot1 : function(obj, tab){

        if($(obj).length < 1) return;

		var $sliderTabs = $(tab).find('[role=tab]');
		var currentIndex = 1;
        var activeTabClass = 'is-active';

        $sliderTabs.each(function(i,e){
            $(e).attr({'data-slick-index' : i, 'aria-selected' : false });
        });

        $(obj).on({
            'init' : function(event, slick){
                currentIndex = slick.getCurrent();
                $sliderTabs.eq(currentIndex).addClass(activeTabClass).attr('aria-selected', true);
                $('.slick-dots').attr('aria-hidden', true).find('li, span').off();
            },
            'swipe' : function(event, slick, direction) {
                currentIndex = $(this).slick('slickCurrentSlide');
                $sliderTabs.eq(currentIndex)
                .addClass(activeTabClass).attr('aria-selected', true)
                .siblings().removeClass(activeTabClass).attr('aria-selected', false);
            }
        });

        $sliderTabs.on('click', function(event) {
			currentIndex = $(this).data('slick-index');
            $sliderTabs.eq(currentIndex)
            .addClass(activeTabClass).attr('aria-selected', true)
            .siblings().removeClass(activeTabClass).attr('aria-selected', false);
            $(obj).slick('slickGoTo', currentIndex);
		});

        $(obj).slick({
            slidesToShow: 1,
            arrows: false,
            dots: true,
            customPaging: function(slider, i) {
                return $('<span />');
            }
        });
    },

    //Tab type 1
    sliderTab1 : function(obj, tab, idx){

        if($(obj).length < 1) return;

        var $sliderTabs = $(tab).find('[role=tab]');
        var currentIndex = idx;
        var activeTabClass = 'is-active';
        var slideId = $(obj).data('slider-id');
        var tabPosition = [];

        $sliderTabs.each(function(i,e){
            $(e).attr({
                'data-slick-index' : i,
                'aria-selected' : false,
                'id' : slideId + '-tab-' + i,
                'aria-controls' : slideId + '-panel-' + i
            })
        });

        $sliderTabs.each(function(i,e){
            tabPosition[i] = tabPosition[0] ? parseFloat($(e).offset().left - 24).toFixed() : parseFloat($(e).offset().left - 10).toFixed()
        });

        $(obj).on({
            'init' : function(event, slick){
                currentIndex = slick.getCurrent();
                $(tab).stop().animate({ 'scrollLeft' : tabPosition[currentIndex-1] }, 0);
                $sliderTabs.eq(currentIndex).addClass(activeTabClass).attr('aria-selected', true);
                $(obj).find('>.slick-list>.slick-track>.slick-slide').each(function(i,e){
                    $(e).attr({
                        'id' : slideId + '-panel-' + i,
                        'role' : 'tabpanel',
                        'aria-labelledby' : slideId + '-tab-' + i
                    });
                })

            },
            'swipe' : function(event, slick, direction) {
                currentIndex = $(this).slick('slickCurrentSlide');
                $sliderTabs.eq(currentIndex)
                .addClass(activeTabClass).attr('aria-selected', true)
                .siblings().removeClass(activeTabClass).attr('aria-selected', false);
                $(tab).stop().animate({ 'scrollLeft' : tabPosition[currentIndex-1] }, 200);
            }
        });

        $sliderTabs.on('click', function(event) {
			currentIndex = $(this).data('slick-index');
            $sliderTabs.eq(currentIndex)
            .addClass(activeTabClass).attr('aria-selected', true)
            .siblings().removeClass(activeTabClass).attr('aria-selected', false);
            $(obj).slick('slickGoTo', currentIndex);
            $(tab).stop().animate({ 'scrollLeft' : tabPosition[currentIndex-1] }, 200);
        });

        $(obj).on('click', '.product-hero__button', function(e){
            e.stopPropagation();
            e.preventDefault();
        })

        $(obj).slick({
            slidesToShow: 1,
            arrows: false,
            dots: false,
            adaptiveHeight : true,
            initialSlide: currentIndex,
            touchThreshold: 10,
        });
    },

    //Tab type 2
    sliderTab2 : function(obj, tab){

        if($(obj).length < 1) return;

		var $sliderTabs = $(tab).find('[role=tab]');
		var currentIndex = 1;
        var activeTabClass = 'is-active';
        var slideId = $(obj).data('slider-id');


        $sliderTabs.each(function(i,e){
            $(e).attr({
                'data-slick-index' : i,
                'aria-selected' : false
                //'id' : slideId + '-tab-' + i,
                //'aria-controls' : slideId + '-panel-' + i
            });
        });

        $(obj).on({
            'init' : function(event, slick){
                currentIndex = slick.getCurrent();
                $sliderTabs.eq(currentIndex).addClass(activeTabClass).attr('aria-selected', true);
                slick.$slides.attr({
                    //'id' : slideId + '-panel-' + slick.$slides.index(),
                    'role' : 'tabpanel'
                    //'aria-labelledby' : slideId + '-tab-' + slick.$slides.index()
                });
            },
            'swipe' : function(event, slick, direction) {
                currentIndex = $(this).slick('slickCurrentSlide');
                $sliderTabs.eq(currentIndex)
                .addClass(activeTabClass).attr('aria-selected', true)
                .siblings().removeClass(activeTabClass).attr('aria-selected', false);
            }
        });

        $sliderTabs.on('click', function(event) {
			currentIndex = $(this).data('slick-index');
            $sliderTabs.eq(currentIndex)
            .addClass(activeTabClass).attr('aria-selected', true)
            .siblings().removeClass(activeTabClass).attr('aria-selected', false);
            $(obj).slick('slickGoTo', currentIndex);
        });

        $(obj).slick({
            slidesToShow: 1,
            arrows: false,
            dots: false,
        });
    },

    //Tab type 3
    sliderTab3 : function(obj, tab){

        if($(obj).length < 1) return;

		var $sliderTabs = $(tab).find('[role=tab]');
		var currentIndex = 1;
        var activeTabClass = 'is-active';
        var slideId = $(obj).data('slider-id');


        $sliderTabs.each(function(i,e){
            $(e).attr({
                'data-slick-index' : i,
                'aria-selected' : false
            });
        });

        $(obj).on({
            'init' : function(event, slick){
                currentIndex = slick.getCurrent();
                $sliderTabs.eq(currentIndex).addClass(activeTabClass).attr('aria-selected', true);
                slick.$slides.attr({
                    'role' : 'tabpanel'
                });
            },
            'swipe' : function(event, slick, direction) {
                currentIndex = $(this).slick('slickCurrentSlide');
                $sliderTabs.eq(currentIndex)
                .addClass(activeTabClass).attr('aria-selected', true)
                .siblings().removeClass(activeTabClass).attr('aria-selected', false);
            }
        });

        $sliderTabs.on('click', function(event) {
			currentIndex = $(this).data('slick-index');
            $sliderTabs.eq(currentIndex)
            .addClass(activeTabClass).attr('aria-selected', true)
            .siblings().removeClass(activeTabClass).attr('aria-selected', false);
            $(obj).slick('slickGoTo', currentIndex);
        });

        $(obj).slick({
            slidesToShow: 1,
            arrows: false,
            dots: false,
        });
    },

    //Tab type 4
    sliderTab4 : function(obj, tab, curr){

        if($(obj).length < 1) return;

		var $sliderTabs = $(tab).find('[role=tab]');
		var currentIndex = curr;
        var activeTabClass = 'is-active';
        var slideId = $(obj).data('slider-id');


        $sliderTabs.each(function(i,e){
            $(e).attr({
                'data-slick-index' : i,
                'aria-selected' : false
            });
        });

        $(obj).on({
            'init' : function(event, slick){
                currentIndex = slick.getCurrent();
                $sliderTabs.eq(currentIndex).addClass(activeTabClass).attr('aria-selected', true);
                slick.$slides.attr({
                    'role' : 'tabpanel'
                });
            },
            'swipe' : function(event, slick, direction) {
                currentIndex = $(this).slick('slickCurrentSlide');
                $sliderTabs.eq(currentIndex)
                .addClass(activeTabClass).attr('aria-selected', true)
                .siblings().removeClass(activeTabClass).attr('aria-selected', false);
            }
        });

        $sliderTabs.on('click', function(event) {
			currentIndex = $(this).data('slick-index');
            $sliderTabs.eq(currentIndex)
            .addClass(activeTabClass).attr('aria-selected', true)
            .siblings().removeClass(activeTabClass).attr('aria-selected', false);
            $(obj).slick('slickGoTo', currentIndex);
        });

        $(obj).slick({
            initialSlide:currentIndex,
            slidesToShow: 1,
            arrows: false,
            dots: false,
            adaptiveHeight: true
        });
    },

    //Dot in Tab type 1
    sliderDotinTab1 : function(obj){

        if($(obj).length < 1) return;

        var $obj = $(obj);
        var tab = '> div > [role=tablist] [role=tab], > [role=tablist] [role=tab]';
        var panel = '> div > [role=tabpanel], > [role=tabpanel]';
        var activeClass = 'is-active';



        $obj.each(function(idx, el){
            $(el).find(tab).each(function(i, e){
                if($(e).is('.' + activeClass)){
                    $(e).attr('aria-selected', 'true');
                }else{
                    $(e).attr('aria-selected', 'false');
                }
                $(e).attr('data-tab-index', i);
            });
            $(el).find(panel).each(function(i, e){
                $(e).children().slick({
                    slidesToShow: 1,
                    dots: true,
                    arrows: false
                });
            });
        });

        $obj.on('click', tab, function(){
            var instance = $(this).closest($obj);
            var idx = $(this).data('tab-index');

            $(this).attr('aria-selected', 'true').addClass(activeClass);
            instance.find(tab).not(this).attr('aria-selected', 'false').removeClass(activeClass);
            instance.find(panel).eq(idx).addClass(activeClass).children().slick('setPosition');
            instance.find(panel).eq(idx).siblings('[role=tabpanel]').removeClass(activeClass);
        });
    },

    //Dot in Tab type 2 (hash tag)
    sliderDotinTab2 : function(obj){

        if($(obj).length < 1) return;

        var $obj = $(obj);
        var tab = '.remit-category-tab__button';
        var panel = '> [role=tabpanel]';
        var activeClass = 'is-active';
        var anchorPosition = [];

        $obj.find('[role=tablist]').removeAttr('role');
        $obj.find('.remit-category-tab__menu').attr('role', 'radiogroup');

        $(tab).each(function(i,e){
            anchorPosition[i] = parseFloat($(e).offset().left - 24).toFixed()
        });

        $obj.each(function(idx, el){
            $(el).find(tab).each(function(i, e){
                if($(e).is('.' + activeClass)){
                    $(e).attr('aria-selected', 'true');
                }else{
                    $(e).attr('aria-selected', 'false');
                }

                $(e).attr({
                        'role' : 'radio',
                        'data-tab-index' : i
                    })

            });
            $(el).find(panel).each(function(i, e){
                $(e)
                    .removeAttr('role')
                    .addClass('remit-panel')
                    .children()
                    .slick({
                        slidesToShow: 1,
                        dots: true,
                        arrows: false
                    });
            });
        });

        panel = '.remit-panel';

        $obj.on('click', tab, function(){
            var instance = $(this).closest($obj);
            var idx = $(this).data('tab-index');

            $(this)
                .attr('aria-selected', 'true')
                .addClass(activeClass)
                .parents('.remit-category-tab')
                .animate({ 'scrollLeft' : anchorPosition[idx-1] + 'px' }, 200)
            instance.find(tab).not(this).attr('aria-selected', 'false').removeClass(activeClass);
            instance.find(panel).eq(idx).addClass(activeClass).children().slick('setPosition');
            instance.find(panel).eq(idx).siblings(panel).removeClass(activeClass);
        });
    },

    //Dot in Tab type 3
    sliderDotinTab3 : function(obj){

        if($(obj).length < 1) return;

        var $obj = $(obj);
        var tab = '> [role=tablist] [role=tab]';
        var panel = '> div > [role=tabpanel]';
        var activeClass = 'is-active';

        $obj.each(function(idx, el){
            $(el).find(tab).each(function(i, e){
                if($(e).is('.' + activeClass)){
                    $(e).attr('aria-selected', 'true');
                }else{
                    $(e).attr('aria-selected', 'false');
                }
                $(e).attr('data-tab-index', i);
            });
            $(el).find(panel).each(function(i, e){
                $(e).children().slick({
                    slidesToShow: 1,
                    dots: true,
                    arrows: false
                });
            });
        });

        $obj.on('click', tab, function(){
            var instance = $(this).closest($obj);
            var idx = $(this).data('tab-index');

            $(this).attr('aria-selected', 'true').addClass(activeClass);
            instance.find(tab).not(this).attr('aria-selected', 'false').removeClass(activeClass);
            instance.find(panel).eq(idx).addClass(activeClass).children().slick('setPosition');
            instance.find(panel).eq(idx).siblings('[role=tabpanel]').removeClass(activeClass);
        });
    },

    sliderStack1 : function(obj){

        if($(obj).length < 1) return;
        
        var $obj = null;
        var $item = null;
        var $list = null;
        var $indicator = null;

        var indicator = '';
        var active = 0;

        function init(obj){
            $obj = $(obj);
            $item = $obj.children();
            
            $obj.addClass('stack-slide');
            $item.wrap('<div class="stack-slide__item" />');
            $obj.find('.stack-slide__item').wrapAll('<div class="stack-slide__overview"><div class="stack-slide__list" /></div>');

            $item = $obj.find('.stack-slide__item');
            $item.each(function(i,e){
                $(e).attr({'aria-hidden' : 'true', 'data-slide-index' : i});
            })
            $item.eq(active).attr({'aria-hidden': 'false', 'data-position': 'active'}).next().attr('data-position', 'next').next().attr('data-position', 'afternext')

            indicator += '<ul class="stack-slide__indicator" role="tablist">';
            for(var i=0; i<$item.length; i++){
                indicator += '<li role="presentation"><button type="button" role="tab" aria-selected="false" aria-label="총 ' + $item.length + '페이지 중 ' + (i + 1) + '페이지'  +'"></button></li>'
            }
            indicator += '</ul>';
            $obj.append(indicator);
            $indicator = $obj.find('.stack-slide__indicator > li');
            $indicator.eq(active).addClass('is-active').children().attr('aria-selected', 'true');

            $('[data-slider=panel1]').slick('setPosition');
        }

        function event(){
            $obj.on('touchmove', function(e){
                e.stopPropagation();
            })
            swipe();
            page();
        }

        function swipe(){
            var startX = 0;
            var objX = 0;
            var endX = 0;
            var min = $obj.outerWidth()/4;

            $obj.on({
                'touchstart' : function(e){
                    startX = e.originalEvent.touches[0].pageX
                    endX = objX;
                    $(this).css('transition', 'none');
                },
                'touchmove' : function(e){
                    objX = e.originalEvent.touches[0].pageX - startX;
                     $(this).css({'transform': 'translate3d(' + objX + 'px, 0, 0)'});
                },
                'touchend' : function(e){
                    var current = $(this);

                    $(this).removeAttr('style');

                    if(Math.abs(objX) <= min){
                        $(this).css({'transform' : 'translate3d(0, 0, 0)'});
                    }else if(objX > min && objX !== endX){
                        if($(this).data('slide-index') == 0){
                            $(this).css({'transform' : 'translate3d(0, 0, 0)'});
                        }else{
                            $(this).css({'transform' : 'translate3d(100%, 0, 0)'});
                            prev(current);
                        }
                    }else if(objX < 0 && objX < -min && objX !== endX){
                        if($(this).data('slide-index') == ($item.length - 1)){
                            $(this).css({'transform' : 'translate3d(0, 0, 0)'});
                        }else{
                            $(this).css({'transform' : 'translate3d(-100%, 0, 0)'});
                            next(current);
                        }
                    }
                }
            }, '[data-position=active]')
        }

        function next(current){
            var target = current
            active = target.index() + 1

            $item.not(target).removeAttr('data-position style').attr('aria-hidden', 'true')
            setTimeout(function(){
                target.removeAttr('data-position style').attr('aria-hidden', 'true')
            },200)
            target
                .next().attr({'data-position': 'active', 'aria-hidden': 'false'})
                .next().attr({'data-position': 'next', 'aria-hidden': 'true'})
                .next().attr({'data-position': 'afternext', 'aria-hidden': 'true'});

            $indicator.eq(active).addClass('is-active').children().attr('aria-selected', 'true');
            $indicator.eq(active).siblings().removeClass('is-active').children().attr('aria-selected', 'false');
        }

        function prev(current){
            var target = current
            active = target.index() - 1

            $item.removeAttr('data-position style').attr('aria-hidden', 'true')

            target.prev().attr({'data-position': 'prev'});
            setTimeout(function(){
                target.prev().attr({'data-position': 'active', 'aria-hidden': 'false'})
            },200)
            target
                .attr({'data-position': 'next', 'aria-hidden': 'true'})
                .next().attr({'data-position': 'afternext', 'aria-hidden': 'true'});

            $indicator.eq(active).addClass('is-active').children().attr('aria-selected', 'true');
            $indicator.eq(active).siblings().removeClass('is-active').children().attr('aria-selected', 'false');
        }

        function page(){
            $indicator.on('click', 'button',function(e){
                var $parent = $(this).parent();
                active = $parent.index();

                if(!$parent.is('.is-active')){
                    $item
                        .removeAttr('data-position style').attr('aria-hidden', 'true')
                        .eq(active).attr({'data-position': 'active', 'aria-hidden': 'false'})
                        .next().attr({'data-position': 'next', 'aria-hidden': 'true'})
                        .next().attr({'data-position': 'afternext', 'aria-hidden': 'true'});

                    $(this).attr('aria-selected', 'true');
                    $parent.addClass('is-active').siblings().removeClass('is-active').children().attr('aria-selected', 'false');
                }
            })
        }

        init(obj);
        event();
    },

    sliderStack2 : function(obj){

        if($(obj).length < 1) return;
        var $objLength;
        var $obj = null;
        var $item = null;
        var $indicator = null;

        var indicator = '';
        var active = 0;

        function init(obj){
            $obj = $(obj);
            $item = $obj.children();
            $objLength = $item.length;
            $obj.addClass('stack-slide');
            $item.wrap('<div class="stack-slide__item" />');
            $obj.find('.stack-slide__item').wrapAll('<div class="stack-slide__overview"><div class="stack-slide__list" /></div>');

            $item = $obj.find('.stack-slide__item');
            $item.each(function(i,e){
                $(e).attr({'aria-hidden' : 'true', 'data-slide-index' : i});
            })
            $item.eq(active).attr({'aria-hidden': 'false', 'data-position': 'active'}).next().attr('data-position', 'next').next().attr('data-position', 'afternext')

            indicator += '<ul class="stack-slide__indicator" role="tablist">';
            for(var i=0; i<$item.length; i++){
                indicator += '<li role="presentation"><button type="button" role="tab" aria-selected="false" aria-label="총 ' + $item.length + '페이지 중 ' + (i + 1) + '페이지'  +'"></button></li>'
            }
            indicator += '</ul>';
            $obj.append(indicator);
            $indicator = $obj.find('.stack-slide__indicator > li');
            $indicator.eq(active).addClass('is-active').children().attr('aria-selected', 'true');

            $('[data-slider=panel1]').slick('setPosition');
        }

        function event(){
            $obj.on('touchmove', function(e){
                e.stopPropagation();
            })
            swipe();
            page();
        }

        function swipe(){
            var startX = 0;
            var objX = 0;
            var endX = 0;
            var min = $obj.outerWidth()/4;

            $obj.on({
                'touchstart' : function(e){
                    startX = e.originalEvent.touches[0].pageX
                    endX = objX;
                    $(this).css('transition', 'none');
                },
                'touchmove' : function(e){
                    objX = e.originalEvent.touches[0].pageX - startX;
                     $(this).css({'transform': 'translate3d(' + objX + 'px, 0, 0)'});
                },
                'touchend' : function(e){
                    var current = $(this);

                    $(this).removeAttr('style');

                    if(Math.abs(objX) <= min){
                        $(this).css({'transform' : 'translate3d(0, 0, 0)'});
                    }else if(objX > min && objX !== endX){
                        if($(this).data('slide-index') == 0){
                            $(this).css({'transform' : 'translate3d(0, 0, 0)'});
                        }else{
                            $(this).css({'transform' : 'translate3d(100%, 0, 0)'});
                            prev(current);
                        }
                    }else if(objX < 0 && objX < -min && objX !== endX){
                        if($(this).data('slide-index') == ($item.length - 1)){
                            $(this).css({'transform' : 'translate3d(0, 0, 0)'});
                        }else{
                            $(this).css({'transform' : 'translate3d(-100%, 0, 0)'});
                            next(current);
                        }
                    }
                    endX = objX;
                }
            }, '[data-position=active]')
        }

        function next(current){
            var target = current
            active = target.index() + 1

            $item.not(target).removeAttr('data-position style').attr('aria-hidden', 'true')
            setTimeout(function(){
                target.removeAttr('data-position style').attr('aria-hidden', 'true')
            },200)
            target
                .next().attr({'data-position': 'active', 'aria-hidden': 'false'})
                .next().attr({'data-position': 'next', 'aria-hidden': 'true'})
                .next().attr({'data-position': 'afternext', 'aria-hidden': 'true'});

            $indicator.eq(active).addClass('is-active').children().attr('aria-selected', 'true');
            $indicator.eq(active).siblings().removeClass('is-active').children().attr('aria-selected', 'false');
        }

        function prev(current){
            var target = current
            active = target.index() - 1

            $item.removeAttr('data-position style').attr('aria-hidden', 'true')

            target.prev().attr({'data-position': 'prev'});
            setTimeout(function(){
                target.prev().attr({'data-position': 'active', 'aria-hidden': 'false'})
            },200)
            target
                .attr({'data-position': 'next', 'aria-hidden': 'true'})
                .next().attr({'data-position': 'afternext', 'aria-hidden': 'true'});

            $indicator.eq(active).addClass('is-active').children().attr('aria-selected', 'true');
            $indicator.eq(active).siblings().removeClass('is-active').children().attr('aria-selected', 'false');
        }

        function page(){
            $indicator.on('click', 'button',function(e){
                var $parent = $(this).parent();
                active = $parent.index();

                if(!$parent.is('.is-active')){
                    $item
                        .removeAttr('data-position style').attr('aria-hidden', 'true')
                        .eq(active).attr({'data-position': 'active', 'aria-hidden': 'false'})
                        .next().attr({'data-position': 'next', 'aria-hidden': 'true'})
                        .next().attr({'data-position': 'afternext', 'aria-hidden': 'true'});

                    $(this).attr('aria-selected', 'true');
                    $parent.addClass('is-active').siblings().removeClass('is-active').children().attr('aria-selected', 'false');
                }
            })
        }

        init(obj);
        event();
        
        setInterval(function(){
            if($objLength > $('[data-slider=stack2] [data-position=active]').data('slide-index')+1){
                $('[data-slider=stack2] [data-position=active]').animate( {
                    left: '-100px'
                } );
                setTimeout(function(){
                    $('[data-slider=stack2] [data-position=active]').animate( {
                        left: '0px'
                    }, 300,
                        next($('[data-slider=stack2] [data-position=active]'))
                    );
                },500)
            } else {
                $indicator.eq(0).find('button').trigger('click');
            }
        },2500)
    },
    
    // 금융상품몰 슬라이더 추가 210624
    sliderStack3 : function(obj){

        if($(obj).length < 1) return;
        var $objLength;
        var $obj = null;
        var $item = null;
        var $indicator = null;

        var indicator = '';
        var active = 0;

        function init(obj){
            $obj = $(obj);
            $item = $obj.children();
            $objLength = $item.length;
            $obj.addClass('stack-slide');
            $item.wrap('<div class="stack-slide__item" />');
            $obj.find('.stack-slide__item').wrapAll('<div class="stack-slide__overview"><div class="stack-slide__list" /></div>');

            $item = $obj.find('.stack-slide__item');
            $item.each(function(i,e){
                $(e).attr({'aria-hidden' : 'true', 'data-slide-index' : i});
            })
            $item.eq(active).attr({'aria-hidden': 'false', 'data-position': 'active'}).next().attr('data-position', 'next').next().attr('data-position', 'afternext')


            $('[data-slider=panel1]').slick('setPosition');
        }

        function event(){
            $obj.on('touchmove', function(e){
                e.stopPropagation();
            })
            swipe();
        }

        function swipe(){
            var startX = 0;
            var objX = 0;
            var endX = 0;
            var min = $obj.outerWidth()/3;

            $obj.on({
                'touchstart' : function(e){
                    startX = e.originalEvent.touches[0].pageX
                    endX = objX;
                    $(this).css('transition', 'none');
                },
                'touchmove' : function(e){
                    objX = e.originalEvent.touches[0].pageX - startX;
                     $(this).css({'transform': 'translate3d(' + objX/4 + 'px, 0, 0)'});
                },
                'touchend' : function(e){
                    var current = $(this);

                    $(this).removeAttr('style');

                    if(Math.abs(objX) <= min){
                        $(this).css({'transform' : 'translate3d(0, 0, 0)'});
                    }else if(objX > min && objX !== endX){
                        if($(this).data('slide-index') == 0){
                            $(this).css({'transform' : 'translate3d(0, 0, 0)'});
                        }else{
                            $(this).css({'transform' : 'translate3d(100%, 0, 0)'});
                        }
                    }else if(objX < 0 && objX < -min && objX !== endX){
                        if($(this).data('slide-index') == ($item.length - 1)){
                            $(this).css({'transform' : 'translate3d(0, 0, 0)'});
                        }else{
                            $(this).css({'transform' : 'translate3d(-100%, 0, 0)'});
                        }
                    }
                    endX = objX;
                }
            }, '[data-position=active]')
        }

        init(obj);
        event();
        
    },

    

    /****************************
        Drag and Drop
    *****************************/

    /* Sortable */
    sortable1 : function(obj, type){
        
        if($(obj).length < 1) return;
        
        var $obj = null;
        var $typeSelector = null;
        var $dragHandler = null;
        
        var $list = null;
        var $upBtn = null;
        var $downBtn = null;

        function init(obj, type){

            $obj = $(obj);
            $typeSelector = $(type);

            $dragHandler = $('[data-handler=drag]');
            $clickHandler = $('[data-handler=click]');

            $list = '[data-element=sortable__item]';
            $upBtn = '[data-element=sortable-handle-up]';
            $downBtn = '[data-element=sortable-handle-down]';

            $(obj).sortable({
                handle : $dragHandler
            });

            triggerInit();
        }

        function event(){
            $typeSelector.on('click', 'button', function(){
                var $drag = $('.shuffle-type__drag');
                var $click = $('.shuffle-type__click');

                if($(this).is('.shuffle-type__click')){
                    $click.attr('aria-checked', 'true');
                    $drag.attr('aria-checked', 'false');
                    $clickHandler.show();
                    $dragHandler.hide();
                    triggerInit();
                }else{
                    $click.attr('aria-checked', 'false');
                    $drag.attr('aria-checked', 'true');
                    $clickHandler.hide();
                    $dragHandler.show();
                }
            })

            $obj.on('click', '.sortable__handle > button', function(e){
                var target = $(e.target);
                var $item = $(this).closest($list);

                if($(this).is($upBtn)){
                    $item.prev().before($item.detach());
                }else if($(this).is($downBtn)){
                    $item.next().after($item.detach());
                }

                triggerInit(target);

                if($(this).prop('disabled') == false){
                    $(this).focus();
                }else{
                    $(this).siblings().focus();
                }
            })
        }

        function triggerInit(target){
            if(target){
                var $item = target.closest($obj).find($list);
                $item.each(function(i,e){
                    if($(e).index() == 0){
                        $(e).find($upBtn).prop('disabled', true);
                        $(e).find($downBtn).prop('disabled', false);
                    }else if($(e).index() > 0 && $(e).index() < $item.length - 1){
                        $(e).find($upBtn + ',' + $downBtn).prop('disabled', false);
                    }else if($(e).index() == $item.length - 1){
                        $(e).find($upBtn).prop('disabled', false);
                        $(e).find($downBtn).prop('disabled', true);
                    }
                });
            }else{
                $($upBtn + ',' + $downBtn).removeAttr('disabled');
                $obj.each(function(i,e){
                    $(e).find($list).each(function(j,f){
                        var listLength = $(e).find($list).length-1; 
                        if($(f).index() == 0){
                            $(f).find($upBtn).prop('disabled', true);
                            $(f).find($downBtn).prop('disabled', false);
                        }else if($(f).index() == listLength){
                            $(f).find($upBtn).prop('disabled', false);
                            $(f).find($downBtn).prop('disabled', true);
                        } 
                        if(listLength == 0){
                            $(e).find($upBtn).prop('disabled', true);
                            $(e).find($downBtn).prop('disabled', true);
                        }
                    })
                });
            }
        }

        init(obj, type);
        event();
        
    }










};




