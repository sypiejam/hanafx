/*
 ** PluginName: Pualugin
 ** Auth: Pual
 */

(function ($, win, doc, undefined) {
  "use strict";

  /*
   ** Local Variables
   */
  var COMMON = {};

  /*
   ** COMMON
   */
  (function () {
    COMMON.uuid = (function () {
      var _uuid = 0;
      return function (prefix) {
        var id = ++_uuid;
        prefix = prefix ? prefix : "";
        return prefix + id;
      };
    })();

    COMMON.findFocusElement = function (element) {
      var _basket = [];

      $(element)
        .find("*")
        .each(function (i, val) {
          if (
            val.tagName.match(
              /^A$|AREA|INPUT|TEXTAREA|SELECT|BUTTON/gim
            ) &&
            parseInt(val.getAttribute("tabIndex")) !== -1
          ) {
            _basket.push(val);
          }
          if (
            val.getAttribute("tabIndex") !== null &&
            parseInt(val.getAttribute("tabIndex")) >= 0 &&
            val.getAttribute("tabIndex", 2) !== 32768
          ) {
            _basket.push(val);
          }
        });

      return [_basket[0], _basket[_basket.length - 1]];
    };
    
    COMMON.checkPrevId = function ($element, pluginName) {
      if($element.attr('id') == pluginName.substring(9,18)){
        return false;
      }else{
        return true;
      }
      
      
      // return $element.attr("id").indexOf(pluginName) !== -1 ?
      //   false :
      //   true;
    };

    COMMON.checkFocusibleElement = function ($element) {
      var tagName = $element.get(0).tagName.toLowerCase();

      if (tagName === "a" || tagName === "button") {
        return true;
      } else {
        return false;
      }
    };
  })();

  /*
   ** Plugin - Toggle
   */
  (function ($, win, doc, undefined) {
    var pluginName = "toggle";

    var defaults = {
      mode: "static", // static, slide, fade
      event: "click", // 'focusin'
      speed: 300,
      easing: "swing",
      anchorEl: '[data-element="toggle__anchor"]',
      panelEl: '[data-element="toggle__panel"]',
      onChangeBeforeText: null,
      onChangeAfterText: null,
      activeClassName: "is-active",
      isOpened: false
    };

    function Plugin(element, options) {
      this.element = element;
      this._name = pluginName;
      this._defaults = defaults;
      this.options = $.extend({}, this._defaults, options);
      this.flag = false;
      this.textFlag = false;
      this.init();
    }

    $.extend(Plugin.prototype, {
      init: function () {
        var plugin = this;

        plugin.buildCache();
        plugin.bindEvents();

        plugin.options.isOpened ? plugin.open() : plugin.close();
      },
      destroy: function () {
        var plugin = this;

        plugin.flag = false;
        plugin.textFlag = false;

        plugin.unbindEvents().removeCache();

        plugin.$element.removeData("plugin_" + plugin._name);
      },
      buildCache: function () {
        var plugin = this;

        plugin.$element = $(plugin.element);
        plugin.$anchor = plugin.$element.find(plugin.options.anchorEl);
        plugin.$panel = plugin.$element.find(plugin.options.panelEl);

        !COMMON.checkFocusibleElement(plugin.$anchor) &&
          plugin.$anchor.attr({
            role: "button",
            tabindex: 0
          });

        // var _id = plugin.$panel.attr("id") ?
        //   plugin.$panel.attr("id") :
        //   COMMON.uuid(plugin._name + "-");

        // plugin.$anchor.attr({"aria-controls": _id});
        // plugin.$panel.attr("id", _id);

        if (
          plugin.options.onChangeAfterText !== null &&
          plugin.options.onChangeBeforeText !== null
        ) {
          plugin.textFlag = true;
        }
      },
      removeCache: function () {
        var plugin = this;

        plugin.$anchor.removeAttr(
          "aria-expanded aria-controls tabindex role"
        );
        plugin.$panel.removeAttr("aria-expanded style");

        // !COMMON.checkPrevId(plugin.$panel, plugin._name) &&
        //   plugin.$panel.removeAttr("id");
      },
      bindEvents: function () {
        var plugin = this;

        var eventName = (function () {
          var events = plugin.options.event;

          if (events === "focusin") {
            return (
              "focusin." +
              plugin._name +
              " mouseenter." +
              plugin._name
            );
          } else if (events === "click") {
            return (
              "click." + plugin._name + " keydown." + plugin._name
            );
          }
          return events + "." + plugin._name;
        })();

        plugin.$anchor.off(eventName).on(eventName, function (e) {
          e.stopPropagation();

          var key = e.which || e.keyCode;

          if (
            e.type === "click" ||
            e.type === "focusin" ||
            key === 13 ||
            key === 32
          ) {
            plugin.idx = $(this).data("index");
            plugin.toggle();
            e.preventDefault();
          }
        });

        plugin.$element
          .off("show." + plugin._name)
          .on("show." + plugin._name, function (e) {
            plugin.show();
          });

        plugin.$element
          .off("hide." + plugin._name)
          .on("hide." + plugin._name, function (e) {
            plugin.hide();
          });
      },
      unbindEvents: function () {
        var plugin = this;

        plugin.$anchor.off("." + plugin._name);
        plugin.$element.off("." + plugin._name);
      },
      beforeChange: function ($anchor, $panel) {
        var plugin = this;

        plugin.$element.trigger("beforeChange", [
          plugin,
          $anchor,
          $panel
        ]);
      },
      afterChange: function ($anchor, $panel) {
        var plugin = this;

        plugin.$element.trigger("afterChange", [
          plugin,
          $anchor,
          $panel
        ]);

        $panel.find(".slick-initialized").length &&
          $panel.find(".slick-initialized").slick("setPosition");
      },
      toggle: function () {
        var plugin = this;

        plugin.flag ? plugin.close() : plugin.open();
      },
      open: function () {
        var plugin = this;

        plugin.flag = true;

        plugin.beforeChange(plugin.$anchor, plugin.$panel);

        plugin.textFlag &&
          plugin.$anchor.text(plugin.options.onChangeAfterText);

        plugin.$anchor
          .addClass(plugin.options.activeClassName)
          .attr({"aria-expanded": true});

        if (plugin.options.mode === "fade") {
          plugin.$panel
            .stop()
            .fadeIn(
              plugin.options.speed,
              plugin.options.easing,
              function () {
                plugin.afterChange(
                  plugin.$anchor,
                  plugin.$panel
                );
              }
            );
        } else if (plugin.options.mode === "slide") {
          plugin.$panel
            .stop()
            .slideDown(
              plugin.options.speed,
              plugin.options.easing,
              function () {
                plugin.afterChange(
                  plugin.$anchor,
                  plugin.$panel
                );
              }
            );
        } else {
          plugin.$panel.stop().show();
          plugin.afterChange(plugin.$anchor, plugin.$panel);
        }

        plugin.afterChange(plugin.$anchor, plugin.$panel);
      },
      close: function () {
        var plugin = this;

        plugin.flag = false;

        plugin.beforeChange(plugin.$anchor, plugin.$panel);

        plugin.textFlag &&
          plugin.$anchor.text(plugin.options.onChangeBeforeText);

        plugin.$anchor
          .removeClass(plugin.options.activeClassName)
          .attr({"aria-expanded": false});

        if (plugin.options.mode === "fade") {
          plugin.$panel
            .stop()
            .fadeOut(plugin.options.speed, plugin.options.easing);
        } else if (plugin.options.mode === "slide") {
          plugin.$panel
            .stop()
            .slideUp(plugin.options.speed, plugin.options.easing);
        } else {
          plugin.$panel.stop().hide();
        }

        plugin.afterChange(plugin.$anchor, plugin.$panel);
      },
      reInit: function () {
        var plugin = this;

        plugin.flag = false;
        plugin.textFlag = false;

        plugin
          .unbindEvents()
          .removeCache()
          .init();
      }
    });

    $.fn[pluginName] = function (options) {
      return this.each(function () {
        if (!$.data(this, "plugin_" + pluginName)) {
          $.data(
            this,
            "plugin_" + pluginName,
            new Plugin(this, options || $(this).data("options"))
          );
        }
      });
    };

    $(function () {
      $("[data-element=toggle]").toggle();
    });
  })(jQuery, window, document, undefined);

  /*
   ** Plugin - Tooltip
   */

  (function ($, win, doc, undefined) {
    var pluginName = "tooltip";

    var defaults = {
      position: "right", //left, top, bottom
      mode: "tooltip", // popover
      indent: 10,
      button: "[data-element=tooltip__button]",
      panel: "[data-element=tooltip__panel]",
      tooltipContainerClassName: "pualugin-tooltip-container",
      activeClassName: "is-active",
      zindex: 100
    };

    function Plugin(element, options) {
      this.element = element;
      this._name = pluginName;
      this._defaults = defaults;
      this.options = $.extend({}, this._defaults, options);
      this.flag = false;
      this.init();
    }

    $.extend(Plugin.prototype, {
      init: function () {
        var plugin = this;

        plugin.buildCache();
        plugin.bindEvents();
      },
      destroy: function () {
        var plugin = this;

        plugin.flag = false;

        plugin.$element.removeData("plugin_" + plugin._name);
        plugin.unbindEvents().removeCache();
      },
      buildCache: function () {
        var plugin = this;
        var container = "." + plugin.options.tooltipContainerClassName;

        plugin.$element = $(plugin.element);
        plugin.$button = plugin.$element.find(plugin.options.button);
        plugin.$panel = plugin.$element.find(plugin.options.panel);
        plugin.$container = $(container).length ?
          $(container) :
          $("body").append(
            "<div class=" +
            plugin.options.tooltipContainerClassName +
            "></div>"
          );
        plugin.$win = $(win);

        var _id = plugin.$panel.attr("id") ?
          plugin.$panel.attr("id") :
          COMMON.uuid(plugin._name);

        var focusible = COMMON.checkFocusibleElement(plugin.$button);

        plugin.$element.css("display", "inline-block");

        plugin.$button.attr({
          "aria-describedby": _id,
          "aria-controls": _id,
          "aria-expanded": false,
          tabindex: focusible ? "" : 0
        });

        plugin.$panel
          .css("z-index", plugin.options.zindex)
          .attr({
              "id": _id,
              role: "tooltip",
            }
          )
          .hide()
          .appendTo($(container));
      },
      removeCache: function () {
        var plugin = this;

        plugin.$element
          .removeAttr("style")
          .removeData("plugin_" + plugin._name);
        plugin.$panel.appendTo(plugin.$element).removeAttr("style");

        plugin.$button.removeAttr(
          "aria-describedby aria-controls aria-expanded"
        );
        plugin.$container.find(plugin.options.panel).length === 0 &&
          plugin.$container.remove();

        !COMMON.checkPrevId(plugin.$panel, plugin._name) &&
          plugin.$panel.removeAttr("id");
      },
      bindEvents: function () {
        var plugin = this;

        var eventName = (function () {
          var events = plugin.options.mode;

          if (events === "tooltip") {
            return [
              "focusin." +
              plugin._name +
              " mouseenter." +
              plugin._name,
              "focusout." +
              plugin._name +
              " mouseleave." +
              plugin._name
            ];
          } else {
            return ["click." + plugin._name];
          }
        })();

        if (eventName.length == 1) {
          plugin.$button.on(eventName[0], function (e) {
            e.preventDefault();
            plugin.toggle();
          });

          plugin.$win.on(eventName[0], function (e) {
            if (plugin.flag) {
              if (
                !plugin.$element.is(e.target) &&
                plugin.$element.has(e.target).length === 0
              ) {
                plugin.close();
              }
            }
          });
        } else if (eventName.length == 2) {
          plugin.$button
            .on(eventName[0], function (e) {
              e.preventDefault();

              plugin.open();
            })
            .on(eventName[1], function (e) {
              e.preventDefault();

              plugin.close();
            });
        }
      },
      unbindEvents: function () {
        var plugin = this;

        plugin.$button.off("." + plugin._name);
        plugin.$win.off("." + plugin._name);
      },
      toggle: function () {
        var plugin = this;

        plugin.flag ? plugin.close() : plugin.open();
      },
      open: function () {
        var plugin = this;

        plugin.flag = true;
        plugin.$button.attr("aria-expanded", true);
        plugin.$panel
          .css("position", "absolute")
          .addClass(plugin.options.activeClassName)
          .show();
        plugin.setPosition();
      },
      close: function () {
        var plugin = this;

        plugin.flag = false;
        plugin.$button.attr("aria-expanded", false);
        plugin.$panel
          .css("position", "")
          .removeClass(plugin.options.activeClassName)
          .hide();
      },
      setPosition: function () {
        var plugin = this;

        var buttonWidth = plugin.$button.outerWidth(),
          buttonHeight = plugin.$button.outerHeight(),
          panelWidth = plugin.$panel.outerWidth(),
          panelHeight = plugin.$panel.outerHeight();

        var buttonOffset = plugin.$button.offset(),
          buttonTop = buttonOffset.top,
          buttonLeft = buttonOffset.left;

        switch (plugin.options.position) {
          case "left":
            plugin.$panel.css({
              top: buttonTop + (buttonHeight - panelHeight) / 2,
              left: buttonLeft - panelWidth - plugin.options.indent
            });
            break;
          case "top":
            plugin.$panel.css({
              top: buttonTop - panelHeight - plugin.options.indent,
              left: Math.abs(buttonLeft + buttonWidth / 2) -
                Math.abs(panelWidth / 2)
            });
            break;
          case "bottom":
            plugin.$panel.css({
              top: buttonTop +
                buttonHeight +
                plugin.options.indent,
              left: Math.abs(buttonLeft + buttonWidth / 2) -
                Math.abs(panelWidth / 2)
            });
            break;
          default:
            plugin.$panel.css({
              top: buttonTop + (buttonHeight - panelHeight) / 2,
              left: buttonLeft + buttonWidth + plugin.options.indent
            });
        }
      },
      reInit: function () {
        var plugin = this;

        plugin.flag = false;
        plugin
          .unbindEvents()
          .removeCache()
          .init();
      }
    });

    $.fn[pluginName] = function (options) {
      return this.each(function () {
        if (!$.data(this, "plugin_" + pluginName)) {
          $.data(
            this,
            "plugin_" + pluginName,
            new Plugin(this, options || $(this).data("options"))
          );
        }
      });
    };

    $(function () {
      $("[data-element=tooltip]").tooltip();
    });
  })(jQuery, window, document, undefined);

  /*
   ** Plugin - Tab
   */
  (function ($, win, doc, undefined) {
    var pluginName = "tab";

    var defaults = {
      mode: "static", // static, slide, fade
      event: "click", // 'focusin'
      speed: 300,
      easing: "swing",
      list: '[data-element="tab__list"]',
      anchor: '[data-element="tab__anchor"]',
      panel: '[data-element="tab__panel"]',
      activeClassName: "is-active",
      disabledClassName: "is-disabled",
      autoScroll: false,
      isInitActive: true,
      initIndex: 0
    };

    function Plugin(element, options) {
      this.element = element;
      this._name = pluginName;
      this._defaults = defaults;
      this.options = $.extend({}, this._defaults, options);
      this.flag = false;
      this.initialized = false;
      this.idx = 0;
      this.init();
    }

    $.extend(Plugin.prototype, {
      init: function () {
        var plugin = this;

        plugin.buildCache();
        plugin.bindEvents();

        plugin.options.isInitActive &&
          plugin.$anchor
          .eq(plugin.options.initIndex)
          .trigger(plugin.options.event);

        plugin.initialized = true;
      },
      destroy: function () {
        var plugin = this;

        plugin.idx = 0;
        plugin.flag = false;
        plugin.initialized = false;

        plugin.$element.removeData("plugin_" + plugin._name);
        plugin.unbindEvents().removeCache();
      },
      buildCache: function () {
        var plugin = this;
        //var anchorsId = [];

        plugin.$element = $(plugin.element);
        plugin.$anchor = plugin.$element.find(plugin.options.anchor);
        plugin.$panel = plugin.$element.find(plugin.options.panel);
        plugin.$list = plugin.$element.find(plugin.options.list);

        plugin.$anchor.each(function (idx) {
          var $this = $(this);
          // var _id = $this.attr("id") ?
          //   $this.attr("id") :
          //   COMMON.uuid("pualugin-" + plugin._name + "-");
          var focusible = COMMON.checkFocusibleElement($this);

          $this
            .data(plugin._name + "_target", plugin.$panel.eq(idx))
            .attr({
              role: "tab"
              //id: _id,
              //tabindex: focusible ? "" : 0
            });

          //anchorsId.push(_id);
        });

        plugin.$panel.each(function (idx) {
          $(this).attr({
            role: "tabpanel"
            // "aria-labelledby": anchorsId[idx],
            //tabindex: 0
          });
        });

        plugin.$element.find('.tab-wrap__menu').attr({"role": "tablist"});
        plugin.$list.attr("role", "presentation");
      },
      removeCache: function () {
        var plugin = this;

        plugin.$list.removeAttr("role");
        plugin.$anchor
          .removeData(plugin._name + "_target")
          .removeAttr("style role")
          .removeClass(plugin.options.activeClassName);
        plugin.$panel
          .removeClass(plugin.options.activeClassName);  
          // .removeAttr("style role aria-labelledby")
        //  !COMMON.checkPrevId(plugin.$panel, plugin._name) &&
        //    plugin.$panel.removeAttr("id");
      },
      bindEvents: function () {
        var plugin = this;

        var eventName = (function () {
          var events = plugin.options.event;

          if (events === "focusin") {
            return (
              "focusin." +
              plugin._name +
              " mouseenter." +
              plugin._name
            );
          } else if (events === "click") {
            return (
              "click." + plugin._name + " keydown." + plugin._name
            );
          }
          return events + "." + plugin._name;
        })();

        plugin.$anchor.on(eventName, function (e) {
          e.stopPropagation();
          var $this = $(this);

          if (
            $this.hasClass(plugin.options.activeClassName) ||
            $this.hasClass(plugin.options.disabledClassName) ||
            plugin.flag
          )
            return false;

          var key = e.which;

          if (
            e.type === "click" ||
            e.type === "focusin" ||
            key === 13 ||
            key === 32
          ) {
            plugin.idx = $(this).data("index");
            plugin.close(this);
            plugin.open(this);
            e.preventDefault();
          }
        });
      },
      unbindEvents: function () {
        var plugin = this;

        plugin.$anchor.off("." + plugin._name);
        plugin.$element.off("." + plugin._name);
      },
      beforeChange: function ($anchor, $panel) {
        var plugin = this;

        plugin.$element.trigger("beforeChange", [
          plugin,
          $anchor,
          $panel
        ]);
      },
      afterChange: function ($anchor, $panel) {
        var plugin = this;

        plugin.$element.trigger("afterChange", [
          plugin,
          $anchor,
          $panel
        ]);

        $panel.find(".slick-initialized").length &&
          $panel.find(".slick-initialized").slick("setPosition");
      },
      open: function (target) {
        var plugin = this,
          $anchor = $(target);

        var $panel = $anchor
          .addClass(plugin.options.activeClassName)
          .attr({
            "aria-selected": true
            //"aria-expanded": true
          })
          .data(plugin._name + "_target")
          .addClass(plugin.options.activeClassName);
        
        if($anchor.is('.img-anchor')){
          if($anchor.is('.' + plugin.options.activeClassName)){
            $anchor.children().attr('src', $anchor.children().attr('src').replace('.png', '_active.png'));
          }
        }

        plugin.flag = true;

        plugin.beforeChange($anchor, $panel);

        if (plugin.options.mode === "fade") {
          $panel
            .stop()
            .fadeIn(
              plugin.options.speed,
              plugin.options.easing,
              function () {
                plugin.flag = false;
                plugin.afterChange($anchor, $panel);
              }
            );
        } else if (plugin.options.mode === "slide") {
          $panel
            .stop()
            .slideDown(
              plugin.options.speed,
              plugin.options.easing,
              function () {
                plugin.flag = false;
                plugin.afterChange($anchor, $panel);
              }
            );
        } else {
          $panel.stop().show();
          plugin.flag = false;
          plugin.afterChange($anchor, $panel);
        }

        if (plugin.options.autoScroll && plugin.initialized) {
          $("html, body")
            .stop()
            .animate({
                scrollTop: plugin.$element.offset().top
              },
              plugin.options.speed
            );
        }
      },
      close: function (target) {
        var plugin = this;
        
        if($(target).is('.img-anchor')){
          plugin.$anchor.not(target).children().attr('src', plugin.$anchor.not(target).children().attr('src').replace('_active.png', '.png'));
        }
        
        plugin.$anchor.not(target).each(function () {
          var $panel = $(this)
            .removeClass(plugin.options.activeClassName)
            .attr({
              "aria-selected": false
              //"aria-expanded": false
            })
            .removeAttr("title")
            .data(plugin._name + "_target")
            .removeClass(plugin.options.activeClassName);

          if (plugin.options.mode === "fade") {
            $panel
              .stop()
              .fadeOut(
                plugin.options.speed,
                plugin.options.easing
              );
          } else if (plugin.options.mode === "slide") {
            $panel
              .stop()
              .slideUp(
                plugin.options.speed,
                plugin.options.easing
              );
          } else {
            $panel.stop().hide();
          }
        });
      },
      go: function (idx, autoScroll) {
        var plugin = this;

        plugin.$anchor.eq(idx).trigger(plugin.options.event);

        if (autoScroll && plugin.initialized) {
          $("html, body")
            .stop()
            .animate({
                scrollTop: plugin.$element.offset().top
              },
              plugin.options.speed
            );
        }
      },
      reInit: function () {
        var plugin = this;

        plugin.idx = 0;
        plugin.flag = false;
        plugin.initialized = false;

        plugin
          .unbindEvents()
          .removeCache()
          .init();
      }
    });

    $.fn[pluginName] = function (options) {
      return this.each(function () {
        if (!$.data(this, "plugin_" + pluginName)) {
          $.data(
            this,
            "plugin_" + pluginName,
            new Plugin(this, options || $(this).data("options"))
          );
        }
      });
    };

    $(function () {
      $("[data-element=tab]").tab();
    });
  })(jQuery, window, document, undefined);

  /*
   ** Plugin - Accordion
   */
  (function ($, win, doc, undefined) {
    var pluginName = "accordion";

    var defaults = {
      mode: "slide", // static, slide
      speed: 200,
      easing: "linear",
      item: '[data-element="accordion__item"]',
      anchor: '[data-element="accordion__anchor"]',
      panel: '[data-element="accordion__panel"]',
      activeClassName: "is-active",
      initIndex: 0,
      isInitActive: false,
      isInitActiveAll: false,
      autoFold: true,
      autoScroll: false,
    };

    function Plugin(element, options) {
      var plugin = this;

      plugin.element = element;
      plugin._name = pluginName;
      plugin._defaults = defaults;
      plugin.options = $.extend({}, plugin._defaults, options);
      plugin.flag = false;
      plugin.openCheck = false;
      plugin.initialized = false;
      plugin.init();
    }

    $.extend(Plugin.prototype, {
      init: function () {
        var plugin = this;

        plugin.buildCache();
        plugin.bindEvents();

        plugin.options.isInitActive &&
          plugin.open(plugin.$anchor.eq(plugin.options.initIndex));

        if (plugin.options.isInitActiveAll) {
          plugin.open(plugin.$anchor);
          plugin.$panel.addClass(plugin.options.activeClassName).show();
        }

        plugin.initialized = true;
      },
      destroy: function () {
        var plugin = this;

        plugin.flag = false;
        plugin.openCheck = false;
        plugin.initialized = false;
        plugin.$element.removeData("plugin_" + plugin._name);
        plugin.unbindEvents();
        plugin.removeCache();
      },
      buildCache: function () {
        var plugin = this;

        plugin.$element = $(plugin.element).attr(
          "role",
          "presentation"
        );
        plugin.$header = plugin.$element.find(plugin.options.item);
        plugin.$anchor = plugin.$element.find(plugin.options.anchor);
        plugin.$panel = plugin.$element
          .find(plugin.options.panel)
          .hide();

        //var tabsId = [];

        plugin.$anchor.each(function (idx) {
          var $this = $(this);
          // var _id = $this.attr("id") ?
          //   $this.attr("id") :
          //   COMMON.uuid("pualugin-" + plugin._name + "-");

          $this
            .data(plugin._name + "_target", plugin.$panel.eq(idx))
            .data("title", $.trim($this.text()))
            .attr({
              //id: _id,
              "aria-expanded": false,
              //"aria-controls": _id + "-panel",
              "role": "button"
            })
            .removeAttr('title aria-label');

            //tabsId.push(_id);
        });

        plugin.$panel.each(function (idx) {
          $(this)
            // .attr({
            //   "aria-labelledby": tabsId[idx],
            //   role: "region"
            // })
            .hide();
        });
      },
      removeCache: function () {
        var plugin = this;

        plugin.$anchor
          .removeData(plugin._name + "_target")
          .removeData("title")
          .removeAttr("id aria-expanded aria-controls role")
          .removeClass(plugin.options.activeClassName);

        plugin.$panel
          .removeAttr("aria-labelledby role")
          .removeClass(plugin.options.activeClassName);
        // !COMMON.checkPrevId(plugin.$anchor, plugin._name) &&
        //   plugin.$anchor.removeAttr("id");
      },
      bindEvents: function () {
        var plugin = this;

        plugin.$element.on(
          "click" + "." + plugin._name,
          plugin.options.anchor,
          function (e) {
            e.stopPropagation();
            e.preventDefault();

            if (plugin.flag) {
              return false;
            }
            plugin.toggle($(this));
          }
        );

        plugin.$anchor.on("open." + plugin._name, function () {
          plugin.open($(this));
        });

        plugin.$anchor.on("close." + plugin._name, function () {
          plugin.close($(this));
        });
      },
      unbindEvents: function () {
        var plugin = this;

        plugin.$element.off("." + plugin._name);
        plugin.$header.off("." + plugin._name);
      },
      beforeChange: function ($activeTarget) {
        var plugin = this;

        plugin.$element.trigger("beforeChange", [
          plugin,
          $activeTarget
        ]);
      },
      afterChange: function ($activeTarget) {
        var plugin = this;

        plugin.$element.trigger("afterChange", [plugin, $activeTarget]);
      },
      toggle: function ($targetAnchor) {
        var plugin = this;

        plugin.flag = true;

        $targetAnchor.hasClass(plugin.options.activeClassName) ?
          plugin.close($targetAnchor) :
          plugin.open($targetAnchor);
      },
      open: function ($targetAnchor) {
        var plugin = this;

        plugin.beforeChange($targetAnchor);

        
        if(plugin.openCheck == true){
          return plugin.flag = false, plugin.openCheck = false;
        }
        
        var $panel = $targetAnchor
          .attr("aria-expanded", true)
          .addClass(plugin.options.activeClassName)
          .data(plugin._name + "_target")
          .addClass(plugin.options.activeClassName);

        if (plugin.initialized && plugin.options.mode == "slide") {
          $panel
            .stop(true)
            .slideDown(
              plugin.options.speed,
              plugin.options.easing,
              function () {
                plugin.flag = false;

                if (plugin.options.autoScroll) {
                  $("html, body")
                    .stop()
                    .animate({
                        scrollTop: $targetAnchor.offset()
                          .top
                      },
                      100
                    );
                }
              }
            );
        } else {
          $panel.stop(true).show();
          plugin.flag = false;
        }

        if (plugin.options.autoFold) {
          plugin.$anchor.not($targetAnchor).each(function () {
            plugin.close($(this));
          });
        }

        plugin.afterChange($targetAnchor);
      },

      openCustom : function ($targetAnchor) {
        var plugin = this;

        var $panel = $targetAnchor
          .attr("aria-expanded", true)
          .addClass(plugin.options.activeClassName)
          .data(plugin._name + "_target")
          .addClass(plugin.options.activeClassName);

        if (plugin.initialized && plugin.options.mode == "slide") {
          $panel
            .stop(true)
            .slideDown(
              plugin.options.speed,
              plugin.options.easing,
              function () {
                plugin.flag = false;

                if (plugin.options.autoScroll) {
                  $("html, body")
                    .stop()
                    .animate({
                        scrollTop: $targetAnchor.offset()
                          .top
                      },
                      100
                    );
                }
              }
            );
        } else {
          $panel.stop().show();
          plugin.flag = false;
        }
      },

      close: function ($targetAnchor) {
        var plugin = this;

        plugin.beforeChange($targetAnchor);

        var $panel = $targetAnchor
          .attr("aria-expanded", false)
          .removeClass(plugin.options.activeClassName)
          .data(plugin._name + "_target")
          .removeClass(plugin.options.activeClassName);

        if (plugin.options.mode === "slide") {
          $panel
            .stop(true)
            .slideUp(
              plugin.options.speed,
              plugin.options.easing,
              function () {
                plugin.flag = false;
              }
            );
        } else {
          $panel.stop(true).hide();
          plugin.flag = false;
        }

        plugin.afterChange($targetAnchor);
      },
      go: function (idx, autoScroll) {
        var plugin = this;

        plugin.$anchor.eq(idx).trigger("click");

        if (autoScroll) {
          plugin.autoScroll();
        }
      },
      autoScroll: function () {
        var plugin = this;

        $("html, body")
          .stop()
          .animate({
              scrollTop: plugin.$wrap.offset().top
            },
            plugin.options.speed
          );
      },
      manualClose : function(){
        var plugin = this;

        var $panel = plugin.$anchor
          .attr("aria-expanded", false)
          .removeClass(plugin.options.activeClassName)
          .data(plugin._name + "_target")
          .removeClass(plugin.options.activeClassName);

        if (plugin.options.mode === "slide") {
          $panel
            .stop()
            .slideUp(
              plugin.options.speed,
              plugin.options.easing,
              function () {
                plugin.flag = false;
              }
            );
        } else {
          $panel.stop().hide();
          plugin.flag = false;
        }

      },
      reInit: function () {
        var plugin = this;

        plugin.flag = false;
        plugin.initialized = false;

        plugin.unbindEvents();
        plugin.removeCache();
        plugin.init();
      },
      customInit: function () {
        var plugin = this;

        plugin.flag = false;
        plugin.initialized = false;

        plugin.unbindEvents();

        //remove cache
        plugin.$anchor
          .removeData(plugin._name + "_target")
          .removeAttr("aria-expanded role")
        
        //build cache
        plugin.$header = plugin.$element.find(plugin.options.item);
        plugin.$anchor = plugin.$element.find(plugin.options.anchor);
        plugin.$panel = plugin.$element.find(plugin.options.panel);

        plugin.$anchor.each(function (idx) {
          var $this = $(this);

          $this
            .data(plugin._name + "_target", plugin.$panel.eq(idx))
            .attr({
              "aria-expanded": false,
              "role": "button"
            });
        });

        plugin.bindEvents();

        plugin.$anchor.each(function(i,e){
          if($(e).is('.' + plugin.options.activeClassName)){
            $(e)
            .attr('aria-expanded', 'true')
            .data(plugin._name + "_target")
            .addClass(plugin.options.activeClassName)
            .show();
          }
        })

        plugin.initialized = true;

      }
    });

    $.fn[pluginName] = function (options) {
      return this.each(function () {
        if (!$.data(this, "plugin_" + pluginName)) {
          $.data(
            this,
            "plugin_" + pluginName,
            new Plugin(this, options || $(this).data("options"))
          );
        }
      });
    };

    $(function () {
      $("[data-element=accordion]").accordion();
    });
  })(jQuery, window, document, undefined);

  /*
   ** Plugin - Sticky
   */
  (function ($, win, doc, undefined) {
    var pluginName = "sticky";

    var defaults = {
      position: "top", //bottom, middle
      top: 0,
      sectionEl: "[data-element=sticky__section]",
      headerEl: "[data-element=sticky__target-parent]",
      targetEl: "[data-element=sticky__target]",
      activeClassName: "is-sticky"
    };

    function Plugin(element, options) {
      this.element = element;
      this._name = pluginName;
      this._defaults = defaults;
      this.options = $.extend({}, this._defaults, options);
      this.flag = false;
      this.headerHeight = 0;
      this.init();
    }

    $.extend(Plugin.prototype, {
      init: function () {
        var plugin = this;

        plugin.buildCache();
        plugin.bindEvents();
      },
      destroy: function () {
        var plugin = this;

        plugin.flag = false;
        plugin.headerHeight = 0;

        plugin.$element.removeData("plugin_" + plugin._name);
        plugin
          .unbindEvents()
          .removeCache()
          .init();
      },
      buildCache: function () {
        var plugin = this;

        plugin.$element = $(plugin.element);
        plugin.$header = plugin.$element.find(plugin.options.headerEl);
        plugin.$target = plugin.$element.find(plugin.options.targetEl);
        plugin.$win = $(win);

        plugin.headerHeight = plugin.$header.outerHeight();
      },
      removeCache: function () {
        var plugin = this;

        plugin.$element.removeAttr("style");
        plugin.$header.removeAttr("style");
        plugin.$target.removeAttr("style");
      },
      bindEvents: function () {
        var plugin = this;

        plugin.$win
          .on("scroll." + plugin._name, function () {
            var scrTop = $(this).scrollTop();

            plugin.toggle(scrTop);
          })
          .on("resize." + plugin._name, function () {
            $(this).trigger("scroll");
          });
      },
      unbindEvents: function () {
        plugin.$win.off("." + plugin._name);
      },
      toggle: function (scrTop) {
        var plugin = this;

        plugin.getPosition();

        if (scrTop > plugin.bottom) {
          plugin.unFixed();
          plugin.bottomRelative();
        } else if (scrTop >= plugin.top) {
          plugin.bottomFixed();
          plugin.setFixed();
        } else if (scrTop <= plugin.top) {
          plugin.unFixed();
        }
      },
      setFixed: function () {
        var plugin = this;

        plugin.beforeChange();
        plugin.$header.css("height", plugin.headerHeight);
        plugin.$target.addClass(plugin.options.activeClassName).css({
          position: "fixed",
          top: plugin.options.top,
          left: plugin.$header.offset().left,
          width: plugin.$header.outerWidth()
        });
        plugin.afterChange();
      },
      unFixed: function () {
        var plugin = this;

        plugin.$header.css("height", plugin.headerHeight);
        plugin.$target.removeClass(plugin.options.activeClassName).css({
          position: "",
          top: "",
          left: "",
          width: ""
        });
      },
      bottomFixed: function () {
        var plugin = this;

        plugin.$element.css({
          position: ""
        });

        plugin.$target.css({
          position: "",
          bottom: "",
          width: ""
        });
      },
      bottomRelative: function () {
        var plugin = this;

        plugin.$element.css("position", "relative");
        plugin.$target.css({
          position: "absolute",
          bottom: "0",
          top: "auto",
          width: "100%"
        });
      },
      getOffsetTop: function (target) {
        var plugin = this;
        var wrapTop = plugin.$element.offset().top;
        var headerHeight = plugin.$header.height();
        var position = plugin.options.position;
        var topValue = plugin.options.top;

        if (target) {
          return $(target).offset().top - topValue;
        } else if (position === "bottom") {
          return wrapTop + headerHeight - topValue;
        } else if (position === "middle") {
          return wrapTop + headerHeight / 2 - topValue;
        } else {
          return wrapTop - topValue;
        }
      },
      getPosition: function () {
        var plugin = this;
        plugin.top = plugin.getOffsetTop(plugin.$element);
        plugin.bottom =
          plugin.top +
          (plugin.$element.outerHeight() - plugin.headerHeight);
      },
      beforeChange: function () {
        var plugin = this;

        plugin.$element.trigger("beforeChange", [
          plugin,
          plugin.$target
        ]);
      },
      afterChange: function () {
        var plugin = this;

        plugin.$element.trigger("afterChange", [
          plugin,
          plugin.$target
        ]);
      },
      reInit: function () {
        var plugin = this;

        plugin.flag = false;
        plugin.headerHeight = 0;

        plugin
          .unbindEvents()
          .removeCache()
          .init();
      }
    });

    $.fn[pluginName] = function (options) {
      return this.each(function () {
        if (!$.data(this, "plugin_" + pluginName)) {
          $.data(
            this,
            "plugin_" + pluginName,
            new Plugin(
              this,
              $.extend({}, options, $(this).data("options"))
            )
          );
        }
      });
    };

    $(function () {
      $("[data-element=sticky]").sticky();
    });
  })(jQuery, window, document, undefined);

  /*
   ** Plugin - Form Control
   */
  (function ($, win, doc, undefined) {
    var pluginName = "formCtrl";

    var defaults = {
      input: "[data-element=form-ctrl__input]",
      textarea: "[data-element=form-ctrl__textarea]",
      delete: "[data-element=form-ctrl__delete]",
      count: "[data-element=form-ctrl__count]",
      countCurrent: "[data-element=form-ctrl__count-current]",
      countTotal: "[data-element=form-ctrl__count-total]",
      activeClassName: "is-active",
      autoHeight: false //true
    };

    function Plugin(element, options) {
      this.element = element;
      this._name = pluginName;
      this._defaults = defaults;
      this.options = $.extend({}, this._defaults, options);
      this.init();
    }

    $.extend(Plugin.prototype, {
      init: function () {
        var plugin = this;
        plugin.buildCache();
        plugin.bindEvents();
      },
      buildCache: function () {
        var plugin = this;
        plugin.$element = $(plugin.element);
        plugin.$input = plugin.$element.find(plugin.options.input);
        plugin.$textarea = plugin.$element.find(
          plugin.options.textarea
        );
        plugin.$delete = plugin.$element.find(plugin.options.delete);
        plugin.$count = plugin.$element.find(plugin.options.count);
        plugin.$countCurrunt = plugin.$element.find(
          plugin.options.countCurrent
        );
        plugin.$countTotal = plugin.$element.find(
          plugin.options.countTotal
        );
      },
      bindEvents: function () {
        var plugin = this;

        plugin.$input
          .on("keyup." + plugin._name, function (e) {
            plugin.toggle(this);
          })
          .keyup();

        plugin.$delete.on("click." + plugin._name, function (e) {
          e.preventDefault();
          plugin.delete();
        });

        plugin.$textarea
          .on(
            "keyup." + plugin._name + " input." + plugin._name,
            function (e) {
              plugin.count(e);
              if (plugin.options.autoHeight) {
                plugin.resize();
              }
            }
          )
          .keyup();
      },
      toggle: function (self) {
        var plugin = this;
        var $self = $(self);

        $self.val().length > 0 ? plugin.show() : plugin.hide();
      },
      show: function () {
        var plugin = this;

        if (plugin.$input.attr("class").indexOf("search") != -1) {
          $(".search__COMMON-button-box").hide();
        }
        plugin.$delete.addClass(plugin.options.activeClassName);
      },
      hide: function () {
        var plugin = this;

        plugin.$delete.removeClass(plugin.options.activeClassName);
        if (plugin.$input.attr("class").indexOf("search") != -1) {
          $(".search__COMMON-button-box").show();
        }
      },
      delete: function () {
        var plugin = this;
        plugin.$input.val("").focus();
        plugin.hide();
      },
      count: function (e) {
        var plugin = this;
        var maxLength = plugin.$countTotal.text() || 500;
        var curruntLength = plugin.$textarea.val().length;

        if (curruntLength <= maxLength) {
          plugin.$countCurrunt.text(curruntLength);
        } else {
          plugin.$countCurrunt.text(plugin.$countTotal.text());
        }
      },
      resize: function () {
        var plugin = this;
        var paddingTop = plugin.$textarea
          .css("padding-top")
          .replace("px", "");
        var paddingBtm = plugin.$textarea
          .css("padding-bottom")
          .replace("px", "");
        plugin.$textarea
          .css({
            height: "auto",
            overflow: "hidden"
          })
          .height(
            plugin.$textarea[0].scrollHeight -
            paddingTop -
            paddingBtm
          );
      }
    });

    $.fn[pluginName] = function (options) {
      return this.each(function () {
        if (!$.data(this, "plugin_" + pluginName)) {
          $.data(
            this,
            "plugin_" + pluginName,
            new Plugin(this, options || $(this).data("options"))
          );
        }
      });
    };

    $(function () {
      $("[data-element=form-ctrl]").formCtrl();
    });
  })(jQuery, window, document, undefined);

  /*
   ** Plugin - Modal
   */
  ;
	(function ($, win, doc, undefined) {
		var pluginName = "modal";

		var defaults = {
			closeExisting: true,
			stackLevel: 10,
			mobileResolution: 1280,
      activeClassName: 'is-open',
			wrapperClassName: '#wrap, .modal-full',
			modalClassName: 'pualugin-modal',
			modalMaskClassName: 'pualugin-modal__mask',
			container: '[data-element=modal]',
			modal: '[data-element=modal__element]',
			modalInner: '[data-element=modal__element-container]',
			mask: '[data-element=modal__mask]',
			close: '[data-element=modal__close]',
      open: '[data-element=modal__open]',
      focus : '[data-element=focus]',
      slideClass : '.modal--slide'
		}

		function Plugin(element, options) {
			this.element = element;
			this._name = pluginName;
			this._defaults = defaults;
			this.options = $.extend({}, this._defaults, options);
			this.flag = false;
			this.stackLevel = this.options.stackLevel;
			this.currentScrollTop = 0;
			this.isMobile = false;
			this.init();
		}

		$.extend(Plugin.prototype, {
			init: function() {
        var plugin = this;

        // 모달 컨테이너 생성
				var container = $('<div />')
          .addClass(plugin.options.modalClassName)
          .attr('data-element', 'modal')
          .appendTo('body');

        // document에 있는 모달을 찾아서 모달 컨테이너에 append
        $( plugin.options.modal ).appendTo( container );

				plugin.buildCache();
        plugin.bindEvents();
			},
			destroy: function() {
				var plugin = this;

				plugin.flag = false;
				plugin.stackLevel = 10;

				plugin.$element.removeData('plugin_' + plugin._name);
				plugin
					.unbindEvents()
					.removeCache();
      },
      buildCache: function() {
        var plugin = this;

				plugin.$element = $(plugin.element);
        plugin.$container = plugin.$element.find(plugin.options.container);
				plugin.$modal = plugin.$element.find( plugin.options.modal );
				plugin.$modalInner = plugin.$element.find( plugin.options.modalInner );
				plugin.$open = plugin.$element.find( plugin.options.open );
        plugin.$close = plugin.$element.find( plugin.options.close );
        plugin.$focus = plugin.$element.find( plugin.options.focus );
        plugin.$wrap = $(plugin.options.wrapperClassName);
				plugin.$win = $(win);
        plugin.$doc = $(doc);

        // 모바일 체크
        plugin.isMobile = plugin.$element.width() < plugin.options.mobileResolution && true;

				plugin.$modal.attr({
					'role': 'dialog',
          'aria-modal': true,
          'aria-hidden': true
        })

        plugin.$open.each(function(i,e){
          $(e).attr({
            'aria-controls': plugin.$open.eq(i).data('target')
          })
        })

			},
			remoevCache: function() {
				var plugin = this;

				plugin.$modal
					.removeClass( plugin.options.activeClassName )
          .removeAttr('role aria-modal aria-hidden z-index');
          
        plugin.$open.removeAttr('aria-controls');

			},
			bindEvents: function() {
				var plugin = this;

				plugin.$close.on('click.' + plugin._name, function(e) {
          e.preventDefault();

					plugin.close( $(this).closest(plugin.options.modal) );
				})

				plugin.$open.on('click.' + plugin._name, function(e) {
          e.preventDefault();

          var $this = $(this);
          plugin.open( $this.data('target') );
          
				})
        
        // 딤드 클릭시 모달 close 함수
				// plugin.$doc.on('click.' + plugin._name, function(e) {
				// 	if ( plugin.$modal.is('.is-open') ) {
				// 		if (!plugin.$modalInner.is(e.target) && plugin.$modalInner.has(e.target).length === 0){
				// 			plugin.close( e.target );
				// 		}
				// 	}
				// })

        // 모달내에서 웹포커스 이동 함수
				// plugin.$modal.each(function() {
				// 	var focusEl = COMMON.findFocusElement( this );
				// 	var focusElFirst = $(focusEl[0]);
				// 	var focusElLast = $(focusEl[1]);

				// 	focusElFirst.on('keydown.' + plugin._name, function(e) {
				// 		var keyCode = e.keyCode || e.which;
				// 		if ( e.shiftKey && keyCode === 9 ) {
				// 			e.preventDefault();
				// 			focusElLast.focus();
				// 		}
				// 	})

				// 	focusElLast.on('keydown.' + plugin._name, function(e) {
				// 		var keyCode = e.keyCode || e.which;
				// 		if ( keyCode == 9 && !e.shiftKey ) {
				// 			e.preventDefault();
				// 			focusElFirst.focus();
				// 		}
				// 	})
				// })
			},
			unbindEvents: function () {
				var plugin = this;

				plugin.$open !== null && plugin.$open.off('.' + plugin._name);
				plugin.$close.off('.' + plugin._name);
				plugin.$doc.off('.' + plugin._name);

				// plugin.$modal.each(function() {
				// 	var focusEl = COMMON.findFocusElement( this );
				// 	$(focusEl[0]).off('.' + plugin._name);
				// 	$(focusEl[1]).off('.' + plugin._name);
				// })
			},
			open: function( target ) {
				var plugin = this;
        var $target = $(target);

        // 모달이 이미 열려 있는 경우 return
        if ( $(target).hasClass('is-open') ) return;

        // 단일 모달, 다중 모달에 따른 분기 처리
				// if ( plugin.options.closeExisting ) {
				// 	plugin.$modal.not( $target ).each(function() {
				// 		plugin.close( this );
				// 	})
				// } else {
				// 	plugin.stackLevel += 10;
				// }

        // 모달에 타이틀이 있는 경우 포커스 받을 data 속성 추가
        if ($target.find('h1').length) {
          $target.find('h1').attr({
            'data-element' : 'focus'
          })
        }

        // 모달 형제노드 aria-hidden 유무 체크
        if(!$('body').is('.modal-open')){
          $('body').children().each(function(i,e){
            if ($(e).is('[aria-hidden=true]')) {
              $(e).attr({
                'data-aria-hidden' : 'has'
              });
            }
          })
        }

        // 모달 형제노드 aria-hidden 속성 추가
        if($('body').is('.modal-open')){
          $('body').addClass('stack');
          $target.siblings().attr('aria-hidden', 'true');
        }else{
          plugin.$container
            .siblings()
            .not('[data-aria-hidden=has]')
            .attr({
              'aria-hidden' : true
            })
        }

        plugin.fixedContents();

        if($target.is(plugin.options.slideClass)){
          
          var $slideLayer = $target.find(plugin.options.modalInner);
          
          $target.addClass(plugin.options.activeClassName);
          $slideLayer
            .css({
              'bottom' : - $slideLayer.outerHeight(true) + 'px'
            })
            .animate({
              'bottom' : 0
            }, 300, function(){
              $target
                .attr({
                  'aria-hidden': false,
                  'z-index': plugin.stackLevel
                })
                .find(plugin.options.focus)
                .attr('tabindex', '0')
                .focus();
            })

            //슬라이드팝업내 탭이 있는 경우
            if($slideLayer.find('[data-element=tab]').length){
              $slideLayer.find('.modal__contents').addClass('modal__contents--tabscroll');
            }
          
        }else{
          $target.addClass(plugin.options.activeClassName);
          $target
                .attr({
                  'aria-hidden': false,
                  'z-index': plugin.stackLevel
                })
                .find(plugin.options.focus)
                .attr('tabindex', '0')
                .focus();
        }

				plugin.$element.trigger('modalOpen', [plugin, $target]);
			},
			close: function( target ) {
				var plugin = this;
        var $target = $(target);
        var $targetID = $target.attr('id');
        var $targetButton = $('[data-target="#' + $targetID + '"]');

        // 모달이 닫혀 있는 경우 return
        if ( !$(target).hasClass('is-open') ) return;

        // 다중 모달인 경우 stackLevel down
				//!plugin.options.closeExisting && (plugin.stackLevel -= 10);

        setTimeout(function(){
          plugin.unfixedContents();
        }, 0)
        

				$target
					.removeClass(plugin.options.activeClassName)
					.attr({
            'aria-hidden': true,
						'z-index': ''
          });

        // 모달 호출 버튼으로 포커스 이동
        $targetButton.focus();

        // 모달 형제노드 aria-hidden 속성 제거
        plugin.$container
          .siblings()
          .not('[data-aria-hidden=has]')
          .removeAttr('aria-hidden')
        
        // 모달 형제노드 aria-hidden 유무 data 속성 제거
        $('body').children().removeAttr('data-aria-hidden');

        $target.siblings().each(function(i,e){
          if($(e).is('.is-open')){
            $(e).attr('aria-hidden', 'false');
          }
        })

				plugin.$element.trigger('modalClose', [plugin, $target]);
      },
      fixedContents: function() {
        var plugin = this;
        var $header = $('.app-header, .modal-full .modal__header');
        var $sticky = $('[data-sticky=wrap]');

        if( $('body').is('.modal-open') ) return

        plugin.currentScrollTop = plugin.$win.scrollTop();

        // if($header.is('.is-active')){
        //   $header.css('background-color', '#fff');
        // }

        if($sticky.is('.is-active')){
          $sticky.hide();  
          /*
            $sticky.children('[data-sticky]').css({
              'position' : '',
              'left' : '',
              'top' : '',
              'background-color' : '',
              'z-index' : ''
            })
            $sticky.removeClass('is-active');
            */
        }
        
        plugin.$wrap
          .css({
            "position": "fixed",
            "width": "100%",
            "height": "100%",
            "overflow": "hidden"
          })
          .scrollTop( plugin.currentScrollTop )
        
        $('body').addClass('modal-open');

        //plugin.$win.scrollTop(0);
      },
			unfixedContents: function() {
        var plugin = this;
        var $header = $('.app-header, .modal-full .modal__header');

        if( $('body').is('.stack') ) {
          $('body').removeClass('stack')
          return
        }

        $('body').removeClass('modal-open');

				plugin.$wrap
          .css({
            "position": "",
            "width": "",
            "height": "",
            "overflow": ""
          })
          
        // $header.css('background-color', '');
        plugin.$win.scrollTop( plugin.currentScrollTop );
        $('[data-sticky=wrap]').show();
        hanaUI.sticky('[data-sticky=normal]');
        
			}
		});

		$.fn[pluginName] = function ( options ) {
			return this.each(function () {
				if (!$.data(this, "plugin_" + pluginName)) {
					$.data(this, "plugin_" + pluginName, new Plugin(this, options || $(this).data('options')));
				}
			});
		}

		$(function () {
			$('body').modal();
		});

	})(jQuery, window, document, undefined)

  /*
   ** Plugin - Checkbox Control
   */
  ;(function ($, wino, doc, undefined) {
    var pluginName = "checkbox";

    var defaults = {
      checkbox: "[data-element=checkbox__input]",
      all: "[data-element=checkbox__all]"
    };

    function Plugin(element, options) {
      this.element = element;
      this._defaults = defaults;
      this.options = $.extend({}, this._defaults, options);
      this.init();
    }

    $.extend(Plugin.prototype, {
      init: function () {
        var plugin = this;

        plugin.buildCache();
        plugin.bindEvents();
      },
      buildCache: function () {
        var plugin = this;

        plugin.$element = $(plugin.element);
        plugin.$checkbox = plugin.$element
          .find(plugin.options.checkbox)
          .not(":disabled");
        plugin.$all = plugin.$element
          .find(plugin.options.all)
          .not(":disabled");
      },
      bindEvents: function () {
        var plugin = this;

        plugin.$checkbox.on("change", function (e) {
          plugin.checkedAction();
        });

        plugin.$all.on("change", function (e) {
          plugin.allCheckedAction(this);
        });
      },
      checkedAction: function () {
        var plugin = this;

        var checkboxLength = plugin.$checkbox.length,
          checkedLength = plugin.$checkbox.filter(":checked").length;

        if (checkboxLength === checkedLength) {
          plugin.$all.prop("checked", true);
        } else {
          plugin.$all.prop("checked") &&
            plugin.$all.prop("checked", false);
        }
      },
      allCheckedAction: function (target) {
        var plugin = this;

        if ($(target).prop("checked")) {
          plugin.$checkbox.prop("checked", true);
        } else {
          plugin.$checkbox.prop("checked", false);
        }
      }
    });

    $.fn[pluginName] = function (options) {
      return this.each(function () {
        if (!$.data(this, "plugin_" + pluginName)) {
          $.data(
            this,
            "plugin_" + pluginName,
            new Plugin(this, options || $(this).data("options"))
          );
        }
      });
    };

    $(function () {
      $("[data-element=checkbox]").checkbox();
    });
  })(jQuery, window, document, undefined);

  /*
   ** Plugin - Slick
   */
  (function ($, win, doc, undefined) {
    var pluginName = "customSlick";

    var defaults = {
      slickContainer: '[data-element=slick__container]',
      prevArrow: '<button type="button" class="pualugin-slick__prev"><i class="fas fa-chevron-left"></i></button>',
      nextArrow: '<button type="button" class="pualugin-slick__next"><i class="fas fa-chevron-right"></i></button>',
      dotsClass: 'pualugin-slick__dots',
      control: "false",
      controlContainer: '[data-element=slick__controls]',
      controlButton: '[data-element=slick__play-stop]',
      controlText: ["start", "stop"],
      controlActiveClassName: 'is-pause',
      status: '[data-element=slick__status]',
      statusCurrent: '[data-element=slick__status-current]',
      statusTotal: '[data-element=slick__status-total]',
      breakpointMobile: 400,
      breakpointTablet: 750,
    };

    function Plugin(element, options) {
      this.element = element;
      this._defaults = defaults;
      this._name = pluginName;
      this.options = $.extend({}, this._defaults, options);
      this.playFlag = this.options.autoplay === true || this.options.control === true ? true : false;
      this.init();
    }

    $.extend(Plugin.prototype, {
      init: function () {
        var plugin = this;

        plugin.buildCache();
        plugin.setResponsive();
        plugin.bindEvents();
        plugin.initSlick();
      },
      buildCache: function () {
        var plugin = this;

        plugin.$element = $(plugin.element);
        plugin.$slick = plugin.$element.find(plugin.options.slickContainer);
        plugin.$controlContainer = plugin.$element.find(plugin.options.controlContainer);
        plugin.$status = plugin.$element.find(plugin.options.status);
        plugin.$statusCurrent = plugin.$element.find(plugin.options.statusCurrent);
        plugin.$statusTotal = plugin.$element.find(plugin.options.statusTotal);

        if (plugin.playFlag) {
          plugin.$contrlButton = $('<button class="pualugin-slick__play-stop" data-element="slick__play-stop"></button>').appendTo(plugin.$controlContainer);
          plugin.$controlText = $('<span class="pualugin-slick__play-stop-text"></span>').appendTo(plugin.$contrlButton).text(plugin.options.controlText[1])
        }
      },
      setResponsive: function () {
        var plugin = this;
        var options = plugin.options.responsiveOptions;

        options && (
          plugin.options.responsive = [{
              breakpoint: plugin.options.breakpointTablet,
              settings: {
                slidesToShow: options.tablet.show,
                slidesToScroll: options.tablet.scroll
              } || null
            },
            {
              breakpoint: plugin.options.breakpointMobile,
              settings: {
                slidesToShow: options.mobile.show,
                slidesToScroll: options.mobile.scroll
              } || null
            }
          ]
        );
      },
      bindEvents: function () {
        var plugin = this;

        plugin.$element
          .on('init.' + plugin._name, function(e, slick) {
            //initEvent
            plugin.$statusCurrent.text(slick.options.initialSlide + 1);
            plugin.$statusTotal.text(slick.slideCount);
          })
          .on('beforeChange.' + plugin._name, function(e, slick) {
            //beforeEvent
          })
          .on('afterChange.' + plugin._name, function(e, slick, currentSlide) {
            //afterEvent
            plugin.$statusCurrent.text(currentSlide + 1);
          })
          .on('breakpoint.' + plugin._name, function(e, slick, breakpoint) {
            //breakpointEvent
          })
          .on('refresh.' + plugin._name, function(e, slick) {
            //initEvent
            plugin.$statusCurrent.text(slick.options.initialSlide + 1);
            plugin.$statusTotal.text(slick.slideCount);
          })
          .on('destroy.' + plugin._name, function(e, slick) {
            //destoryEvent
          })
        plugin.playFlag && (
          plugin.$contrlButton.on('click.' + plugin._name, function () {
            plugin.toggleControl();
          })
        )
      },
      initSlick: function () {
        var plugin = this;

        plugin.$slick.slick(plugin.options);
      },
      toggleControl: function () {
        var plugin = this;
        plugin.playFlag ? plugin.slickPause() : plugin.slickPlay();
      },
      slickPlay: function () {
        var plugin = this;

        plugin.playFlag = true;
        plugin.$slick.slick('slickPlay');

        plugin.$contrlButton.removeClass(plugin.options.controlActiveClassName);
        plugin.$controlText.text(plugin.options.controlText[1]);
      },
      slickPause: function () {
        var plugin = this;

        plugin.playFlag = false;
        plugin.$slick.slick('slickPause');

        plugin.$contrlButton.addClass(plugin.options.controlActiveClassName)
        plugin.$controlText.text(plugin.options.controlText[0]);
      }
    });

    $.fn[pluginName] = function (options) {
      return this.each(function () {
        if (!$.data(this, "plugin_" + pluginName)) {
          $.data(
            this,
            "plugin_" + pluginName,
            new Plugin(this, options || $(this).data("options"))
          );
        }
      });
    };

    $(function () {
      $('[data-element=slick]').customSlick();
    });
  })(jQuery, window, document, undefined);

  /*
	** Plugin - Select
	*/
	;
	(function ($, win, doc, undefined) {
		var pluginName = 'select';

		var defaults = {
			mode: "static", // slide
			containerClassName: "pualugin-select"
		}

		function Plugin( element, options ) {
			this.element = element;
			this._defaults = defaults;
			this.options = $.extend({}, this._defaults, options);
			this._basket = [];
			this._name = pluginName;
			this.flag = false;
			this.init();
		}

		$.extend(Plugin.prototype, {
			init: function() {
				var plugin = this;

				plugin.buildCache();
				plugin.setOptions();
				plugin.bindEvents();
			},
			buildCache: function() {
				var plugin = this;

				// Elements cache
				plugin.$win = $(win);
				plugin.$doc = $(doc);
				plugin.$body = $('body');
				plugin.$element = $(plugin.element);
				plugin.$elementWrap = $('<div class="pualugin-select"></div>');
				plugin.$trigger = $('<button class="pualugin-select__trigger" />');
				plugin.$listbox = $('<ul class="pualugin-select__container"/>');
				plugin.$option = $('<div class="pualugin-select__option" />');

        plugin.$elementWrap
          .insertAfter(plugin.$element)
          .append(plugin.$element);

        // Initislized elements
				plugin.$trigger
					.text(
						plugin.$element
							.find('option:selected')
							.text()
					)
					.attr({
						"aria-haspopup": "listbox",
						"tabindex": "0"
          })
          .prependTo(plugin.$elementWrap);

				// Initialized aria-role
				plugin.$listbox.attr({
					role: "listbox",
					tabindex: -1
				});

				// Append elements
				// plugin.$element.prepend(plugin.$trigger);
				plugin.$body.append(plugin.$listbox);
			},
			bindEvents: function() {
				var plugin = this;

				plugin.$trigger
					.on('keydown.' + plugin._name, function(e) {
						if (e.which === 40) {
							e.preventDefault();
							plugin.open();
						}
					})
					.on('click.' + plugin._name, function(e) {
						e.preventDefault();
						plugin.toggle();
					});

				plugin.$listitem.not('.is-disabled')
					.on('click.' + plugin._name, function(e) {
						plugin.selected( this );
					})
					.on('keydown.' + plugin._name, function(e) {
						var key = e.which || e.keyCode;

						switch(key) {
							case 13:
								e.preventDefault();
								plugin.selected( this );
								break;

							case 9:
								e.preventDefault();
								plugin.close();
								break;
							case 40:
								e.preventDefault();
								plugin.next(this);
								break;
							case 38:
								e.preventDefault();
								plugin.prev(this);
								break;
							case 27:
								e.preventDefault();
								plugin.close();
								break;
						}
					});

				plugin.$element.on('change.' + plugin._name, function(e) {
					plugin.$element.trigger('onChange', [$(this), $(this).val()]);
				});

				plugin.$element
					.on('onChange.' + plugin._name, function( e, target, targetVal ) {
						console.log( 'onChange' )
					})
					.on('refresh.' + plugin._name, function() {
						plugin.setOptions();
						plugin.bindEvents();
					})

				plugin.$win
					.on('load.' + plugin._name, function() {
						plugin.setPosition();
          })
          .on('resize.' + plugin._name, function() {
            plugin.setPosition();
          })
					.on('click.' + plugin._name , function(e) {
						if ( plugin.flag ) {
							if (
								!plugin.$trigger.is(e.target)
								&& plugin.$trigger.has(e.target).length === 0
								&& !plugin.$listbox.is(e.target)
								&& plugin.$listbox.has(e.target).length === 0
							) {
								plugin.close();
							}
						}
					});
			},
			getOptions: function() {
				var plugin = this;

				plugin.$element.find('option').each(function() {
					plugin._basket.push({
						name: $(this).text(),
						selected: $(this).attr('selected') !== undefined ? true : false,
						disabled: $(this).attr('disabled') !== undefined ? true : false
					});
				})

				return plugin._basket;
			},
			setOptions: function() {
				var plugin = this;

				var options = plugin.getOptions();

				options.forEach(function(option, idx) {
					$("<li/>")
						.appendTo(plugin.$listbox)
						.text( option.name )
						.attr({
							"class": option.selected ? 'pualugin-select__container-li is-selected' : 'pualugin-select__container-li',
							"role": "option",
							"data-index": idx
						})
						.addClass( option.disabled ? 'is-disabled' : '' );
				})

				plugin.$listitem = plugin.$listbox.find('li');
				plugin.$listitem
					.not('.is-disabled')
					.attr('tabindex', 0);
			},
			setPosition: function() {
				var plugin = this;

				var triggerPositionTop = plugin.$trigger.offset().top;
				var triggerPositionLeft = plugin.$trigger.offset().left;
				var triggerButtonWidth = plugin.$trigger.outerWidth();
				var triggerButtonHeight = plugin.$trigger.outerHeight();

				plugin.$listbox.css({
					position: "absolute",
					top: triggerPositionTop + triggerButtonHeight,
					left: triggerPositionLeft,
					width: triggerButtonWidth,
					zIndex: 111
				});
			},
			toggle: function() {
				var plugin = this;
				console.log('toggle')
				plugin.flag ? plugin.close() : plugin.open();
			},
			open: function() {
				var plugin = this;

				if ( plugin.flag ) return false;

				plugin.flag = true;

				console.log('open')

				plugin.$listbox.show();
				plugin.$trigger.addClass('is-active');
				plugin.$listitem.filter('.is-selected').focus();
			},
			close: function() {
				var plugin = this;

				if ( !plugin.flag ) return false;

				plugin.flag = false;

				plugin.$trigger
					.removeClass('is-active')
					.focus();

				plugin.$listbox.hide();
			},
			selected: function( option ) {
				var plugin = this;
				var $option = $(option);

				$option.addClass('is-selected');

				plugin.$listitem
					.not($option)
					.removeClass('is-selected');

				plugin.$trigger.text($option.text());

				plugin.$element
					.find('option')
					.eq($option.data('index'))
					.prop('selected', true)
					.change();

				plugin.close();
			},
			next: function( option ) {
				$(option).nextAll('[tabindex="0"]').first().focus();
			},
			prev: function( option ) {
				$(option).prevAll('[tabindex="0"]').first().focus();
			}
		});

		$.fn[pluginName] = function ( options ) {
			return this.each(function () {
				if (!$.data(this, "plugin_" + pluginName)) {
					$.data(this, "plugin_" + pluginName, new Plugin(this, options || $(this).data('options')));
				}
			});
		}

		$(function() {
			$('[data-element=select]').select();
		})
	})(jQuery, window, document, undefined)

  /*
   ** Pualugin Default
   */
  ;(function ($, win, doc, undefined) {
    /*
    ** highlight.js Initialized
    */
    //hljs.initHighlightingOnLoad();

    $(function() {
      /*
      ** 네비게이션 컨트롤
      */
      $('[data-element=nav__anchor]').on('click', function (e) {
        e.preventDefault();

        var $this = $(this);
        var location = $this.attr('href');

        $('html, body').stop().animate({
          scrollTop: $(location).offset().top
        }, 300);
        $this
          .closest('.pualugin__header')
          .removeClass('is-active');
      });
      $('.pualugin__menu-button').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).closest('.pualugin__header').toggleClass('is-active');
      });

      /* ==================================== */

      /*
      ** 예재코드 클립보드 복사
      */
      function appendClipboard() {
        var bindFunctionName = 'appendClipboard';
        var $clipboard = $('.code').append('<button class=code__clipboard> <i class="fa fa-clipboard"></i> </button>');
        var $tooltip = $('.code').append('<span class="code__tooltip">클릭시 클럽보드에 복사됩니다.</span>');

        $clipboard.on('click.' + bindFunctionName, function (e) {
          e.stopPropagation();
          e.preventDefault();

          var code = $.trim($(this).closest('.code').find('code').text());
          var _doc = document;

          var textarea = _doc.createElement("textarea");

          _doc.body.appendChild(textarea);
          textarea.value = code;
          textarea.select();
          _doc.execCommand('copy');
          _doc.body.removeChild(textarea);
        })
      }

      appendClipboard();

      /* ==================================== */
    })
  })(jQuery, window, document, undefined);

})(jQuery, window, document, undefined);


// VERSION: 2.3 LAST UPDATE: 11.07.2013
/* 
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 * 
 * Made by Wilq32, wilq32@gmail.com, Wroclaw, Poland, 01.2009
 * Website: http://code.google.com/p/jqueryrotate/ 
 */

(function($) {
  var supportedCSS,supportedCSSOrigin, styles=document.getElementsByTagName("head")[0].style,toCheck="transformProperty WebkitTransform OTransform msTransform MozTransform".split(" ");
  for (var a = 0; a < toCheck.length; a++) if (styles[toCheck[a]] !== undefined) { supportedCSS = toCheck[a]; }
  if (supportedCSS) {
    supportedCSSOrigin = supportedCSS.replace(/[tT]ransform/,"TransformOrigin");
    if (supportedCSSOrigin[0] == "T") supportedCSSOrigin[0] = "t";
  }

  // Bad eval to preven google closure to remove it from code o_O
  eval('IE = "v"=="\v"');

  jQuery.fn.extend({
      rotate:function(parameters)
      {
        if (this.length===0||typeof parameters=="undefined") return;
        if (typeof parameters=="number") parameters={angle:parameters};
        var returned=[];
        for (var i=0,i0=this.length;i<i0;i++)
        {
          var element=this.get(i);	
          if (!element.Wilq32 || !element.Wilq32.PhotoEffect) {

            var paramClone = $.extend(true, {}, parameters); 
            var newRotObject = new Wilq32.PhotoEffect(element,paramClone)._rootObj;

            returned.push($(newRotObject));
          }
          else {
            element.Wilq32.PhotoEffect._handleRotation(parameters);
          }
        }
        return returned;
      },
      getRotateAngle: function(){
        var ret = [];
        for (var i=0,i0=this.length;i<i0;i++)
        {
          var element=this.get(i);	
          if (element.Wilq32 && element.Wilq32.PhotoEffect) {
            ret[i] = element.Wilq32.PhotoEffect._angle;
          }
        }
        return ret;
      },
      stopRotate: function(){
        for (var i=0,i0=this.length;i<i0;i++)
        {
          var element=this.get(i);	
          if (element.Wilq32 && element.Wilq32.PhotoEffect) {
            clearTimeout(element.Wilq32.PhotoEffect._timer);
          }
        }
      }
  });

  // Library agnostic interface

  Wilq32=window.Wilq32||{};
  Wilq32.PhotoEffect=(function(){

    if (supportedCSS) {
      return function(img,parameters){
        img.Wilq32 = {
          PhotoEffect: this
        };

        this._img = this._rootObj = this._eventObj = img;
        this._handleRotation(parameters);
      }
    } else {
      return function(img,parameters) {
        this._img = img;
        this._onLoadDelegate = [parameters];

        this._rootObj=document.createElement('span');
        this._rootObj.style.display="inline-block";
        this._rootObj.Wilq32 = 
          {
            PhotoEffect: this
          };
        img.parentNode.insertBefore(this._rootObj,img);

        if (img.complete) {
          this._Loader();
        } else {
          var self=this;
          // TODO: Remove jQuery dependency
          jQuery(this._img).bind("load", function(){ self._Loader(); });
        }
      }
    }
  })();

  Wilq32.PhotoEffect.prototype = {
    _setupParameters : function (parameters){
      this._parameters = this._parameters || {};
      if (typeof this._angle !== "number") { this._angle = 0 ; }
      if (typeof parameters.angle==="number") { this._angle = parameters.angle; }
      this._parameters.animateTo = (typeof parameters.animateTo === "number") ? (parameters.animateTo) : (this._angle); 

      this._parameters.step = parameters.step || this._parameters.step || null;
      this._parameters.easing = parameters.easing || this._parameters.easing || this._defaultEasing;
      this._parameters.duration = parameters.duration || this._parameters.duration || 1000;
      this._parameters.callback = parameters.callback || this._parameters.callback || this._emptyFunction;
      this._parameters.center = parameters.center || this._parameters.center || ["50%","50%"];
      if (typeof this._parameters.center[0] == "string") {
        this._rotationCenterX = (parseInt(this._parameters.center[0],10) / 100) * this._imgWidth * this._aspectW;
      } else {
        this._rotationCenterX = this._parameters.center[0];
      }
      if (typeof this._parameters.center[1] == "string") {
        this._rotationCenterY = (parseInt(this._parameters.center[1],10) / 100) * this._imgHeight * this._aspectH;
      } else {
        this._rotationCenterY = this._parameters.center[1];
      }

      if (parameters.bind && parameters.bind != this._parameters.bind) { this._BindEvents(parameters.bind); }
    },
    _emptyFunction: function(){},
    _defaultEasing: function (x, t, b, c, d) { return -c * ((t=t/d-1)*t*t*t - 1) + b }, 
    _handleRotation : function(parameters, dontcheck){
      if (!supportedCSS && !this._img.complete && !dontcheck) {
        this._onLoadDelegate.push(parameters);
        return;
      }
      this._setupParameters(parameters);
      if (this._angle==this._parameters.animateTo) {
        this._rotate(this._angle);
      }
      else { 
        this._animateStart();          
      }
    },

    _BindEvents:function(events){
      if (events && this._eventObj) 
      {
        // Unbinding previous Events
        if (this._parameters.bind){
          var oldEvents = this._parameters.bind;
          for (var a in oldEvents) if (oldEvents.hasOwnProperty(a)) 
            // TODO: Remove jQuery dependency
            jQuery(this._eventObj).unbind(a,oldEvents[a]);
        }

      this._parameters.bind = events;
      for (var a in events) if (events.hasOwnProperty(a)) 
        // TODO: Remove jQuery dependency
        jQuery(this._eventObj).bind(a,events[a]);
      }
    },

    _Loader:(function()
    {
      if (IE)
        return function() {
          var width=this._img.width;
          var height=this._img.height;
          this._imgWidth = width;
          this._imgHeight = height; 
          this._img.parentNode.removeChild(this._img);

          this._vimage = this.createVMLNode('image');
          this._vimage.src=this._img.src;
          this._vimage.style.height=height+"px";
          this._vimage.style.width=width+"px";
          this._vimage.style.position="absolute"; // FIXES IE PROBLEM - its only rendered if its on absolute position!
          this._vimage.style.top = "0px";
          this._vimage.style.left = "0px";
          this._aspectW = this._aspectH = 1;

          /* Group minifying a small 1px precision problem when rotating object */
          this._container = this.createVMLNode('group');
          this._container.style.width=width;
          this._container.style.height=height;
          this._container.style.position="absolute";
          this._container.style.top="0px";
          this._container.style.left="0px";
          this._container.setAttribute('coordsize',width-1+','+(height-1)); // This -1, -1 trying to fix ugly problem with small displacement on IE
          this._container.appendChild(this._vimage);

          this._rootObj.appendChild(this._container);
          this._rootObj.style.position="relative"; // FIXES IE PROBLEM
          this._rootObj.style.width=width+"px";
          this._rootObj.style.height=height+"px";
          this._rootObj.setAttribute('id',this._img.getAttribute('id'));
          this._rootObj.className=this._img.className;			
          this._eventObj = this._rootObj;	
          var parameters;
          while (parameters = this._onLoadDelegate.shift()) {
            this._handleRotation(parameters, true);	
          }
        }
        else return function () {
          this._rootObj.setAttribute('id',this._img.getAttribute('id'));
          this._rootObj.className=this._img.className;

          this._imgWidth=this._img.naturalWidth;
          this._imgHeight=this._img.naturalHeight;
          var _widthMax=Math.sqrt((this._imgHeight)*(this._imgHeight) + (this._imgWidth) * (this._imgWidth));
          this._width = _widthMax * 3;
          this._height = _widthMax * 3;

          this._aspectW = this._img.offsetWidth/this._img.naturalWidth;
          this._aspectH = this._img.offsetHeight/this._img.naturalHeight;

          this._img.parentNode.removeChild(this._img);	


          this._canvas=document.createElement('canvas');
          this._canvas.setAttribute('width',this._width);
          this._canvas.style.position="relative";
          this._canvas.style.left = -this._img.height * this._aspectW + "px";
          this._canvas.style.top = -this._img.width * this._aspectH + "px";
          this._canvas.Wilq32 = this._rootObj.Wilq32;

          this._rootObj.appendChild(this._canvas);
          this._rootObj.style.width=this._img.width*this._aspectW+"px";
          this._rootObj.style.height=this._img.height*this._aspectH+"px";
          this._eventObj = this._canvas;

          this._cnv=this._canvas.getContext('2d');
          var parameters;
          while (parameters = this._onLoadDelegate.shift()) {
            this._handleRotation(parameters, true);	
          }
        }
    })(),

    _animateStart:function()
    {	
      if (this._timer) {
        clearTimeout(this._timer);
      }
      this._animateStartTime = +new Date;
      this._animateStartAngle = this._angle;
      this._animate();
    },
    _animate:function()
    {
      var actualTime = +new Date;
      var checkEnd = actualTime - this._animateStartTime > this._parameters.duration;

      // TODO: Bug for animatedGif for static rotation ? (to test)
      if (checkEnd && !this._parameters.animatedGif) 
      {
        clearTimeout(this._timer);
      }
      else 
      {
        if (this._canvas||this._vimage||this._img) {
          var angle = this._parameters.easing(0, actualTime - this._animateStartTime, this._animateStartAngle, this._parameters.animateTo - this._animateStartAngle, this._parameters.duration);
          this._rotate((~~(angle*10))/10);
        }
        if (this._parameters.step) {
          this._parameters.step(this._angle);
        }
        var self = this;
        this._timer = setTimeout(function()
        {
          self._animate.call(self);
        }, 10);
      }

    // To fix Bug that prevents using recursive function in callback I moved this function to back
    if (this._parameters.callback && checkEnd){
      this._angle = this._parameters.animateTo;
      this._rotate(this._angle);
      this._parameters.callback.call(this._rootObj);
    }
    },

    _rotate : (function()
    {
      var rad = Math.PI/180;
      if (IE)
        return function(angle)
      {
        this._angle = angle;
        this._container.style.rotation=(angle%360)+"deg";
        this._vimage.style.top = -(this._rotationCenterY - this._imgHeight/2) + "px";
        this._vimage.style.left = -(this._rotationCenterX - this._imgWidth/2) + "px";
        this._container.style.top = this._rotationCenterY - this._imgHeight/2 + "px";
        this._container.style.left = this._rotationCenterX - this._imgWidth/2 + "px";

      }
        else if (supportedCSS)
        return function(angle){
          this._angle = angle;
          this._img.style[supportedCSS]="rotate("+(angle%360)+"deg)";
          this._img.style[supportedCSSOrigin]=this._parameters.center.join(" ");
        }
        else 
          return function(angle)
        {
          this._angle = angle;
          angle=(angle%360)* rad;
          // clear canvas	
          this._canvas.width = this._width;//+this._widthAdd;
          this._canvas.height = this._height;//+this._heightAdd;

          // REMEMBER: all drawings are read from backwards.. so first function is translate, then rotate, then translate, translate..
          this._cnv.translate(this._imgWidth*this._aspectW,this._imgHeight*this._aspectH);	// at least center image on screen
          this._cnv.translate(this._rotationCenterX,this._rotationCenterY);			// we move image back to its orginal 
          this._cnv.rotate(angle);										// rotate image
          this._cnv.translate(-this._rotationCenterX,-this._rotationCenterY);		// move image to its center, so we can rotate around its center
          this._cnv.scale(this._aspectW,this._aspectH); // SCALE - if needed ;)
          this._cnv.drawImage(this._img, 0, 0);							// First - we draw image
        }

    })()
    }

    if (IE)
    {
      Wilq32.PhotoEffect.prototype.createVMLNode=(function(){
        document.createStyleSheet().addRule(".rvml", "behavior:url(#default#VML)");
        try {
          !document.namespaces.rvml && document.namespaces.add("rvml", "urn:schemas-microsoft-com:vml");
          return function (tagName) {
            return document.createElement('<rvml:' + tagName + ' class="rvml">');
          };
        } catch (e) {
          return function (tagName) {
            return document.createElement('<' + tagName + ' xmlns="urn:schemas-microsoft.com:vml" class="rvml">');
          };
        }		
      })();
    }

})(jQuery);


/*
 * jQuery css bezier animation support -- Jonah Fox
 * version 0.0.1
 * Released under the MIT license.
 */
/*
  var path = $.path.bezier({
    start: {x:10, y:10, angle: 20, length: 0.3},
    end:   {x:20, y:30, angle: -20, length: 0.2}
  })
  $("myobj").animate({path: path}, duration)

*/

;(function($){

  $.path = {};

  var V = {
    rotate: function(p, degrees) {
      var radians = degrees * Math.PI / 180,
        c = Math.cos(radians),
        s = Math.sin(radians);
      return [c*p[0] - s*p[1], s*p[0] + c*p[1]];
    },
    scale: function(p, n) {
      return [n*p[0], n*p[1]];
    },
    add: function(a, b) {
      return [a[0]+b[0], a[1]+b[1]];
    },
    minus: function(a, b) {
      return [a[0]-b[0], a[1]-b[1]];
    }
  };

  $.path.bezier = function( params, rotate ) {
    params.start = $.extend( {angle: 0, length: 0.3333}, params.start );
    params.end = $.extend( {angle: 0, length: 0.3333}, params.end );

    this.p1 = [params.start.x, params.start.y];
    this.p4 = [params.end.x, params.end.y];

    var v14 = V.minus( this.p4, this.p1 ),
      v12 = V.scale( v14, params.start.length ),
      v41 = V.scale( v14, -1 ),
      v43 = V.scale( v41, params.end.length );

    v12 = V.rotate( v12, params.start.angle );
    this.p2 = V.add( this.p1, v12 );

    v43 = V.rotate(v43, params.end.angle );
    this.p3 = V.add( this.p4, v43 );

    this.f1 = function(t) { return (t*t*t); };
    this.f2 = function(t) { return (3*t*t*(1-t)); };
    this.f3 = function(t) { return (3*t*(1-t)*(1-t)); };
    this.f4 = function(t) { return ((1-t)*(1-t)*(1-t)); };

    /* p from 0 to 1 */
    this.css = function(p) {
      var f1 = this.f1(p), f2 = this.f2(p), f3 = this.f3(p), f4=this.f4(p), css = {};
      if (rotate) {
        css.prevX = this.x;
        css.prevY = this.y;
      }
      css.x = this.x = ( this.p1[0]*f1 + this.p2[0]*f2 +this.p3[0]*f3 + this.p4[0]*f4 +.5 )|0;
      css.y = this.y = ( this.p1[1]*f1 + this.p2[1]*f2 +this.p3[1]*f3 + this.p4[1]*f4 +.5 )|0;
      css.left = css.x + "px";
      css.top = css.y + "px";
      return css;
    };
  };

  $.path.arc = function(params, rotate) {
    for ( var i in params ) {
      this[i] = params[i];
    }

    this.dir = this.dir || 1;

    while ( this.start > this.end && this.dir > 0 ) {
      this.start -= 360;
    }

    while ( this.start < this.end && this.dir < 0 ) {
      this.start += 360;
    }

    this.css = function(p) {
      var a = ( this.start * (p ) + this.end * (1-(p )) ) * Math.PI / 180,
        css = {};

      if (rotate) {
        css.prevX = this.x;
        css.prevY = this.y;
      }
      css.x = this.x = ( Math.sin(a) * this.radius + this.center[0] +.5 )|0;
      css.y = this.y = ( Math.cos(a) * this.radius + this.center[1] +.5 )|0;
      css.left = css.x + "px";
      css.top = css.y + "px";
      return css;
    };
  };

  $.fx.step.path = function(fx) {
    var css = fx.end.css( 1 - fx.pos );
    if ( css.prevX != null ) {
      $.cssHooks.transform.set( fx.elem, "rotate(" + Math.atan2(css.prevY - css.y, css.prevX - css.x) + ")" );
    }
    fx.elem.style.top = css.top;
    fx.elem.style.left = css.left;
  };

})(jQuery);


/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 * 
 * Open source under the BSD License. 
 * 
 * Copyright 짤 2008 George McGinley Smith
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
*/

// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend( jQuery.easing,
{
	def: 'easeOutQuad',
	swing: function (x, t, b, c, d) {
		//alert(jQuery.easing.default);
		return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
	},
	easeInQuad: function (x, t, b, c, d) {
		return c*(t/=d)*t + b;
	},
	easeOutQuad: function (x, t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeInOutQuad: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function (x, t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (x, t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (x, t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (x, t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function (x, t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function (x, t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (x, t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (x, t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function (x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function (x, t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	easeInBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158; 
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeInBounce: function (x, t, b, c, d) {
		return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
	},
	easeOutBounce: function (x, t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	easeInOutBounce: function (x, t, b, c, d) {
		if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
		return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
});

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright 짤 2001 Robert Penner
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */