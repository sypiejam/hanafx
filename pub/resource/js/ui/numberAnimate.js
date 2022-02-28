/*global define:false, WebKitCSSMatrix:false */
/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, evil:true, 
    laxbreak:true, bitwise:true, strict:true, undef:true, unused:true, browser:true,
    jquery:true, indent:4, curly:false, maxerr:50 */

//Set the plugin up so that it'll work as a AMD module or regular import
//See: https://github.com/umdjs/umd/blob/master/jqueryPlugin.js..
(function (factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        factory(jQuery);
    }
}(function ($) {
    "use strict";
    var prefixes = ["", "O", "ms", "Webkit", "Moz"];
    var testDivStyle = document.createElement('div').style;
    var css3Prefix = null;
    for (var i = 0, len = prefixes.length; i < len; i++) {
        if (prefixes[i] + "Transition" in testDivStyle &&
                prefixes[i] + "Transform" in testDivStyle) {
            css3Prefix = prefixes[i];
            break;
        }
    }
    var animationSupported = css3Prefix !== null;
    var transitionEndEvent;
    switch (css3Prefix) {
    case "O":
        transitionEndEvent = "otransitionend";
        break;
    case "ms":
        transitionEndEvent = "msTransitionEnd";
        break;
    case "Webkit":
        transitionEndEvent = "webkitTransitionEnd";
        break;
    default:
        transitionEndEvent = "transitionend";
    }
    
    var translateOpen = window.WebKitCSSMatrix 
                && 'm11' in new WebKitCSSMatrix() ? "translate3d(0, " : "translate(0, ";
    var translateClose = window.WebKitCSSMatrix
                && 'm11' in new WebKitCSSMatrix() ? "px ,0)" : "px)";

    var bindToTransitionEndForSingleRun = function ($el, funcToExec, maxMSTillTransitionEnd) {
        var firedFunc = false;
        var wrappedFunc = function () {
            funcToExec();
            firedFunc = true;
            $el.unbind(transitionEndEvent, wrappedFunc);
        };
        $el.bind(transitionEndEvent, wrappedFunc);
        setTimeout(function () {
            if (!firedFunc) wrappedFunc();
        }, maxMSTillTransitionEnd + 100);
    };
    
    var allChars = ', . 0 1 2 3 4 5 6 7 8 9';

    var checkValue = function (str) {
        for (var i = 0, len = str.length; i < len; i++) {
            if (allChars.indexOf(str.charAt(i)) < 0) {
                $.error("numberAnimate plugin requires that value used " +
                    "only contain character in: \"" + allChars + "\"");
                return false;
            }                
        }
        return true;
    };
    
    var shiftToChar = function ($holderDiv, character, shiftTime) {
        var innerStyle = $holderDiv.children()[0].style;
        innerStyle[css3Prefix + 'Transition'] = "all " + shiftTime + "ms cubic-bezier(0.18, 0.89, 0.32, 1.28)";
 
        var indexOfChar = allChars.indexOf(character);
        var transformY;
        if (indexOfChar < 0 || /\s/.test(character)) {
            transformY = $holderDiv.height();
        } else {
            transformY = 0 - (indexOfChar / 2) * $holderDiv.height();
        }
        innerStyle[css3Prefix + 'Transform'] = translateOpen + transformY + translateClose;
    };

    var createDivForChar = function (character, height, width, position, animationTimes) {
        var creationTime = animationTimes[0];
        var shiftTime = animationTimes[1];

        var holderDiv = $(document.createElement('div')).css({
            width: characterChk(character),
            height: height + 'px',
            overflow: 'hidden',
            display: 'inline-block'
        }).attr("data-numberAnimate-pos", position);

        function characterChk(character){
            if(character == ',' || character == '.') {
                return '7px';
            } else {
                return (creationTime ? 0 : width) + 'px';
            }
        }
        
        var innerDiv = $(document.createElement('div')).html(allChars);
        if (css3Prefix === 'Webkit')
            innerDiv[0].style['-webkit-backface-visibility'] = 'hidden';

        innerDiv[0].style[css3Prefix + 'Transform'] =  translateOpen + height + translateClose;
        holderDiv.append(innerDiv);

        var shiftToCorrectChar = function () {
            shiftToChar(holderDiv, character, shiftTime);
        };

        if (creationTime) {            
            setTimeout(function () {
                bindToTransitionEndForSingleRun(holderDiv, shiftToCorrectChar, creationTime);
                var holderStyle = holderDiv[0].style;
                holderStyle[css3Prefix + 'Transition'] = "all " + creationTime + "ms cubic-bezier(0.18, 0.89, 0.32, 1.28)";
                holderStyle.width = width + "px";
            }, 20);
        } else if (shiftTime) {
            setTimeout(shiftToCorrectChar, 20); 
        } else {
            shiftToCorrectChar();
        }

        return holderDiv[0];
    };
    
    var removeDivsForChars = function ($divs, animationTimes) {
        var shiftTime = animationTimes[1];
        var removeTime = animationTimes[2];

        $divs.removeAttr("data-numberAnimate-pos");
        $divs.each(function (i, div) {
            var $div = $(div);
            var style = div.style;

            var animateRemoval = function () {
                style[css3Prefix + 'Transition'] = "all " + removeTime + "ms cubic-bezier(0.18, 0.89, 0.32, 1.28)";
                style.width = "1px";

                bindToTransitionEndForSingleRun($div, function () {
                    $div.remove();
                }, removeTime); 
            };
            if (shiftTime) {
                bindToTransitionEndForSingleRun($div, animateRemoval, shiftTime); 
            } else {
                animateRemoval();
            }
            shiftToChar($div, 'not there', shiftTime);
        });
    };

    var methods = {
        init: function (options) {
            var settings = $.extend({}, {
                animationTimes: [500, 500, 500] //creation, animation, removal ms
            }, options);

            this.css('display', 'inline-block'); 
            
            $.each(this, function () {
                var $this = $(this);
                var valueStr = this.innerHTML;
                if (!checkValue(valueStr)) return;

                $this.attr("data-numberAnimate-value", valueStr);
                
                if (!animationSupported) return; 
                $this.html("1");
                var characterWidth = $this.width();
                var characterHeight = $this.height();
                $this.attr("data-numberAnimate-characterHeight", characterHeight);
                $this.attr("data-numberAnimate-characterWidth", characterWidth);
                $this.html("");
                $this.css({
                    "vertical-align": "top",
                    "display": "inline-block",
                    "height": characterHeight + "px"
                });

                $this.attr("data-numberAnimate-animationTimes", "[" + settings.animationTimes + "]");
                var indexOfPoint = valueStr.indexOf(".");
                if (indexOfPoint < 0) indexOfPoint = valueStr.length;
                var docFrag = document.createDocumentFragment();
                for (var i = 0, len = valueStr.length; i < len; i++) {
                    var character = valueStr.charAt(i);
                    docFrag.appendChild(
                        createDivForChar(character, characterHeight,
                            characterWidth, indexOfPoint - i, [0, 0, 0])
                    );
                }
                $this.append(docFrag); 
            });
            
            return this;
        },
        val: function () {
            return this.attr("data-numberAnimate-value");
        },
        set: function (newValue, animationTimes) {
            if (typeof newValue === 'number')
                newValue = "" + newValue;
            if (!animationTimes)
                animationTimes = $.parseJSON(this.attr('data-numberAnimate-animationTimes'));
            if (!checkValue(newValue))  return;
            this.attr("data-numberAnimate-value", newValue);
            if (!animationSupported) {
                this.html(newValue);
                return;
            }
            var indexOfPoint = newValue.indexOf(".");
            if (indexOfPoint < 0) indexOfPoint = newValue.length;
            
            $.each(this, function () {
                var $this = $(this);
            
                var numberHolderDivs = $this.find("[data-numberAnimate-pos]");
                var characterHeight = $this.attr('data-numberAnimate-characterHeight') * 1;
                var characterWidth = $this.attr('data-numberAnimate-characterWidth') * 1;
                var newlyCreatedHoldingDiv;
                var largestCurrentPos = numberHolderDivs.attr('data-numberAnimate-pos') * 1;
                if (isNaN(largestCurrentPos)) largestCurrentPos = 0;
                var largestRequiredPos = indexOfPoint;
                var docFragment, pos, character, index;
                if (largestCurrentPos < largestRequiredPos) {
                    docFragment = document.createDocumentFragment();
                    for (pos = largestRequiredPos, index = 0;
                            pos >= largestCurrentPos + 1; pos--, index++) {
                        character = newValue.charAt(index);
                        docFragment.appendChild(
                            createDivForChar(character, characterHeight,
                                    characterWidth, pos, animationTimes)
                        );
                    }
                    newlyCreatedHoldingDiv = docFragment.firstChild;
                    $this.prepend(docFragment);
                } else if (largestCurrentPos > largestRequiredPos) {
                    removeDivsForChars(
                        numberHolderDivs.slice(0, largestCurrentPos - largestRequiredPos),
                        animationTimes
                    );
                }
                var smallestCurrentPos =  numberHolderDivs.last()
                        .attr('data-numberAnimate-pos') * 1;
                if (isNaN(smallestCurrentPos)) smallestCurrentPos = 1;
                var smallestRequiredPos = indexOfPoint - newValue.length + 1;
                if (smallestRequiredPos < smallestCurrentPos) {
                    docFragment = document.createDocumentFragment();
                    for (pos = smallestCurrentPos - 1,
                            index = newValue.length - (smallestCurrentPos - smallestRequiredPos);
                            pos >= smallestRequiredPos; pos--, index++) {
                        character = newValue.charAt(index);
                        docFragment.appendChild(
                            createDivForChar(character, characterHeight,
                                    characterWidth, pos, animationTimes)
                        );
                    }
                    newlyCreatedHoldingDiv = docFragment.firstChild;
                    $this.append(docFragment);
                } else if (smallestRequiredPos > smallestCurrentPos) {
                    removeDivsForChars(
                        numberHolderDivs.slice(
                            numberHolderDivs.length - (smallestRequiredPos - smallestCurrentPos)
                        ),
                        animationTimes
                    );
                }
                var shiftPresentCharacters = function () {
                    var shiftTime = animationTimes[1];
                    pos = Math.min(largestRequiredPos, largestCurrentPos);
                    var endPos = Math.max(smallestRequiredPos, smallestCurrentPos);
                    index = indexOfPoint - pos;
                    for (; pos >= endPos; pos--, index++) {
                        character = newValue.charAt(index);
                        var holdingDiv = $this.find("[data-numberAnimate-pos=" + pos + "]");
                        shiftToChar(holdingDiv, character, shiftTime);
                    }
                };
                if (newlyCreatedHoldingDiv) {
                    bindToTransitionEndForSingleRun(
                        $(newlyCreatedHoldingDiv), shiftPresentCharacters, animationTimes[0] + 100);
                } else {
                    shiftPresentCharacters();
                }
            });
            
            return this;
        },
        destroy: function () {
            $.each(this, function () {
                var $this = $(this);
                
                var value = $this.numberAnimate('val');
                if (value === null) return;

                $this.html(value);
                var attributesToRemove = $.map(this.attributes, function (attr) {
                    var name = attr.name;
                    return name.indexOf('data-numberanimate') === 0 ? name : null; 
                });
                $this.removeAttr(attributesToRemove.join(' '));
            });
            
            return this;
        }
    };

    $.fn.numberAnimate = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' +  method + ' does not exist on jQuery.numberAnimate');
        }
    };

}));