/* SCEditor v1.5.0 | (C) 2016, Sam Clarke | sceditor.com/license */
(function(modules) {
    var installedModules = {};
    function __webpack_require__(moduleId) {
        if (installedModules[moduleId]) {
            return installedModules[moduleId].exports;
        }
        var module = installedModules[moduleId] = {
            exports: {},
            id: moduleId,
            loaded: false
        };
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        module.loaded = true;
        return module.exports;
    }
    __webpack_require__.m = modules;
    __webpack_require__.c = installedModules;
    __webpack_require__.p = "";
    return __webpack_require__(0);
}
)([function(module, exports, __webpack_require__) {
    var __WEBPACK_AMD_DEFINE_RESULT__;
    !(__WEBPACK_AMD_DEFINE_RESULT__ = function(require) {
        var $ = __webpack_require__(1);
        var SCEditor = __webpack_require__(2);
        var PluginManager = __webpack_require__(3);
        var browser = __webpack_require__(6);
        var escape = __webpack_require__(7);
        $.sceditor = SCEditor;
        SCEditor.commands = __webpack_require__(9);
        SCEditor.defaultOptions = __webpack_require__(10);
        SCEditor.RangeHelper = __webpack_require__(4);
        SCEditor.dom = __webpack_require__(5);
        SCEditor.ie = browser.ie;
        SCEditor.ios = browser.ios;
        SCEditor.isWysiwygSupported = browser.isWysiwygSupported;
        SCEditor.regexEscape = escape.regex;
        SCEditor.escapeEntities = escape.entities;
        SCEditor.escapeUriScheme = escape.uriScheme;
        SCEditor.PluginManager = PluginManager;
        SCEditor.plugins = PluginManager.plugins;
        $.fn.sceditor = function(options) {
            var $this, instance, ret = [];
            options = options || {};
            if (!options.runWithoutWysiwygSupport && !browser.isWysiwygSupported) {
                return;
            }
            this.each(function() {
                $this = this.jquery ? this : $(this);
                instance = $this.data("sceditor");
                if ($this.parents(".sceditor-container").length > 0) {
                    return;
                }
                if (options === "state") {
                    ret.push(!!instance);
                } else {
                    if (options === "instance") {
                        ret.push(instance);
                    } else {
                        if (!instance) {
                            (new SCEditor(this,options));
                        }
                    }
                }
            });
            if (!ret.length) {
                return this;
            }
            return ret.length === 1 ? ret[0] : $(ret);
        }
        ;
    }
    .call(exports, __webpack_require__, exports, module),
    __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}
, function(module, exports) {
    module.exports = jQuery;
}
, function(module, exports, __webpack_require__) {
    var __WEBPACK_AMD_DEFINE_RESULT__;
    !(__WEBPACK_AMD_DEFINE_RESULT__ = function(require) {
        var $ = __webpack_require__(1);
        var PluginManager = __webpack_require__(3);
        var RangeHelper = __webpack_require__(4);
        var dom = __webpack_require__(5);
        var escape = __webpack_require__(7);
        var browser = __webpack_require__(6);
        var _tmpl = __webpack_require__(8);
        var globalWin = window;
        var globalDoc = document;
        var $globalWin = $(globalWin);
        var $globalDoc = $(globalDoc);
        var IE_VER = browser.ie;
        var IE_BR_FIX = IE_VER && IE_VER < 11;
        var SCEditor = function(el, options) {
            var base = this;
            var original = el.get ? el.get(0) : el;
            var $original = $(original);
            var $editorContainer;
            var $toolbar;
            var $wysiwygEditor;
            var wysiwygEditor;
            var $wysiwygBody;
            var $wysiwygDoc;
            var $sourceEditor;
            var sourceEditor;
            var $dropdown;
            var lastRange;
            var locale;
            var preLoadCache = [];
            var rangeHelper;
            var requireNewLineFix = [];
            var btnStateHandlers = [];
            var pluginManager;
            var currentNode;
            var currentBlockNode;
            var currentSelection;
            var isSelectionCheckPending;
            var isRequired;
            var inlineCss;
            var shortcutHandlers = {};
            var currentEmoticons = [];
            var toolbarButtons = {};
            var autoUpdateCanceled;
            var init, replaceEmoticons, handleCommand, saveRange, initEditor, initPlugins, initLocale, initToolBar, initOptions, initEvents, initCommands, initResize, initEmoticons, getWysiwygDoc, handlePasteEvt, handlePasteData, handleKeyDown, handleBackSpace, handleKeyPress, handleFormReset, handleMouseDown, handleEvent, handleDocumentClick, handleWindowResize, updateToolBar, updateActiveButtons, sourceEditorSelectedText, appendNewLine, checkSelectionChanged, checkNodeChanged, autofocus, emoticonsKeyPress, emoticonsCheckWhitespace, currentStyledBlockNode, triggerValueChanged, valueChangedBlur, valueChangedKeyUp, autoUpdate;
            base.commands = $.extend(true, {}, (options.commands || SCEditor.commands));
            base.opts = options = $.extend({}, SCEditor.defaultOptions, options);
            init = function() {
                $original.data("sceditor", base);
                $.each(options, function(key, val) {
                    if ($.isPlainObject(val)) {
                        options[key] = $.extend(true, {}, val);
                    }
                });
                if (options.locale && options.locale !== "en") {
                    initLocale();
                }
                $editorContainer = $('<div class="sceditor-container" />').insertAfter($original).css("z-index", options.zIndex);
                if (IE_VER) {
                    $editorContainer.addClass("ie ie" + IE_VER);
                }
                isRequired = !!$original.attr("required");
                $original.removeAttr("required");
                initPlugins();
                initEmoticons();
                initToolBar();
                initEditor(!!options.startInSourceMode);
                initCommands();
                initOptions();
                initEvents();
                if (!browser.isWysiwygSupported) {
                    base.toggleSourceMode();
                }
                updateActiveButtons();
                var loaded = function() {
                    $globalWin.off("load", loaded);
                    if (options.autofocus) {
                        autofocus();
                    }
                    if (options.autoExpand) {
                        base.expandToContent();
                    }
                    handleWindowResize();
                    pluginManager.call("ready");
                };
                $globalWin.on("load", loaded);
                if (globalDoc.readyState && globalDoc.readyState === "complete") {
                    loaded();
                }
            }
            ;
            initPlugins = function() {
                var plugins = options.plugins;
                plugins = plugins ? plugins.toString().split(",") : [];
                pluginManager = new PluginManager(base);
                $.each(plugins, function(idx, plugin) {
                    pluginManager.register($.trim(plugin));
                });
            }
            ;
            initLocale = function() {
                var lang;
                locale = SCEditor.locale[options.locale];
                if (!locale) {
                    lang = options.locale.split("-");
                    locale = SCEditor.locale[lang[0]];
                }
                if (locale && locale.dateFormat) {
                    options.dateFormat = locale.dateFormat;
                }
            }
            ;
            initEditor = function(startInSourceMode) {
                var doc, tabIndex;
                $sourceEditor = $("<textarea></textarea>");
                $wysiwygEditor = $('<iframe frameborder="0" allowfullscreen="true"></iframe>');
                if (startInSourceMode) {
                    $editorContainer.addClass("sourceMode");
                    $wysiwygEditor.hide();
                } else {
                    $editorContainer.addClass("wysiwygMode");
                    $sourceEditor.hide();
                }
                if (!options.spellcheck) {
                    $sourceEditor.attr("spellcheck", "false");
                }
                if (globalWin.location.protocol === "https:") {
                    $wysiwygEditor.attr("src", "javascript:false");
                }
                $editorContainer.append($wysiwygEditor).append($sourceEditor);
                wysiwygEditor = $wysiwygEditor[0];
                sourceEditor = $sourceEditor[0];
                base.dimensions(options.width || $original.width(), options.height || $original.height());
                doc = getWysiwygDoc();
                doc.open();
                doc.write(_tmpl("html", {
                    attrs: IE_VER ? ' class="ie ie' + IE_VER + '"' : "",
                    spellcheck: options.spellcheck ? "" : 'spellcheck="false"',
                    charset: options.charset,
                    style: options.style
                }));
                doc.close();
                $wysiwygDoc = $(doc);
                $wysiwygBody = $(doc.body);
                base.readOnly(!!options.readOnly);
                if (browser.ios || IE_VER) {
                    $wysiwygBody.height("100%");
                    if (!IE_VER) {
                        $wysiwygBody.on("touchend", base.focus);
                    }
                }
                tabIndex = $original.attr("tabindex");
                $sourceEditor.attr("tabindex", tabIndex);
                $wysiwygEditor.attr("tabindex", tabIndex);
                rangeHelper = new RangeHelper(wysiwygEditor.contentWindow);
                base.val($original.hide().val());
            }
            ;
            initOptions = function() {
                if (options.autoUpdate) {
                    $wysiwygBody.on("blur", autoUpdate);
                    $sourceEditor.on("blur", autoUpdate);
                }
                if (options.rtl === null) {
                    options.rtl = $sourceEditor.css("direction") === "rtl";
                }
                base.rtl(!!options.rtl);
                if (options.autoExpand) {
                    $wysiwygDoc.on("keyup", base.expandToContent);
                }
                if (options.resizeEnabled) {
                    initResize();
                }
                $editorContainer.attr("id", options.id);
                base.emoticons(options.emoticonsEnabled);
            }
            ;
            initEvents = function() {
                var CHECK_SELECTION_EVENTS = IE_VER ? "selectionchange" : "keyup focus blur contextmenu mouseup touchend click";
                var EVENTS_TO_FORWARD = "keydown keyup keypress " + "focus blur contextmenu";
                $globalDoc.click(handleDocumentClick);
                $(original.form).on("reset", handleFormReset).submit(base.updateOriginal);
                $globalWin.on("resize orientationChanged", handleWindowResize);
                $wysiwygBody.keypress(handleKeyPress).keydown(handleKeyDown).keydown(handleBackSpace).keyup(appendNewLine).blur(valueChangedBlur).keyup(valueChangedKeyUp).on("paste", handlePasteEvt).on(CHECK_SELECTION_EVENTS, checkSelectionChanged).on(EVENTS_TO_FORWARD, handleEvent);
                if (options.emoticonsCompat && globalWin.getSelection) {
                    $wysiwygBody.keyup(emoticonsCheckWhitespace);
                }
                $sourceEditor.blur(valueChangedBlur).keyup(valueChangedKeyUp).keydown(handleKeyDown).on(EVENTS_TO_FORWARD, handleEvent);
                $wysiwygDoc.mousedown(handleMouseDown).blur(valueChangedBlur).on(CHECK_SELECTION_EVENTS, checkSelectionChanged).on("beforedeactivate keyup mouseup", saveRange).keyup(appendNewLine).focus(function() {
                    lastRange = null;
                });
                $editorContainer.on("selectionchanged", checkNodeChanged).on("selectionchanged", updateActiveButtons).on("selectionchanged valuechanged nodechanged", handleEvent);
            }
            ;
            initToolBar = function() {
                var $group, commands = base.commands, exclude = (options.toolbarExclude || "").split(","), groups = options.toolbar.split("|");
                $toolbar = $('<div class="sceditor-toolbar" unselectable="on" />');
                $.each(groups, function(idx, group) {
                    $group = $('<div class="sceditor-group" />');
                    $.each(group.split(","), function(idx, commandName) {
                        var $button, shortcut, command = commands[commandName];
                        if (!command || $.inArray(commandName, exclude) > -1) {
                            return;
                        }
                        shortcut = command.shortcut;
                        $button = _tmpl("toolbarButton", {
                            name: commandName,
                            dispName: base._(command.name || command.tooltip || commandName)
                        }, true);
                        $button.data("sceditor-txtmode", !!command.txtExec).data("sceditor-wysiwygmode", !!command.exec).toggleClass("disabled", !command.exec).mousedown(function() {
                            if (!IE_VER || IE_VER < 9) {
                                autoUpdateCanceled = true;
                            }
                        }).click(function() {
                            var $this = $(this);
                            if (!$this.hasClass("disabled")) {
                                handleCommand($this, command);
                            }
                            updateActiveButtons();
                            return false;
                        });
                        if (command.tooltip) {
                            $button.attr("title", base._(command.tooltip) + (shortcut ? " (" + shortcut + ")" : ""));
                        }
                        if (shortcut) {
                            base.addShortcut(shortcut, commandName);
                        }
                        if (command.state) {
                            btnStateHandlers.push({
                                name: commandName,
                                state: command.state
                            });
                        } else {
                            if (typeof command.exec === "string") {
                                btnStateHandlers.push({
                                    name: commandName,
                                    state: command.exec
                                });
                            }
                        }
                        $group.append($button);
                        toolbarButtons[commandName] = $button;
                    });
                    if ($group[0].firstChild) {
                        $toolbar.append($group);
                    }
                });
                $(options.toolbarContainer || $editorContainer).append($toolbar);
            }
            ;
            initCommands = function() {
                $.each(base.commands, function(name, cmd) {
                    if (cmd.forceNewLineAfter && $.isArray(cmd.forceNewLineAfter)) {
                        requireNewLineFix = $.merge(requireNewLineFix, cmd.forceNewLineAfter);
                    }
                });
                appendNewLine();
            }
            ;
            initResize = function() {
                var minHeight, maxHeight, minWidth, maxWidth, mouseMoveFunc, mouseUpFunc, $grip = $('<div class="sceditor-grip" />'), $cover = $('<div class="sceditor-resize-cover" />'), moveEvents = "touchmove mousemove", endEvents = "touchcancel touchend mouseup", startX = 0, startY = 0, newX = 0, newY = 0, startWidth = 0, startHeight = 0, origWidth = $editorContainer.width(), origHeight = $editorContainer.height(), isDragging = false, rtl = base.rtl();
                minHeight = options.resizeMinHeight || origHeight / 1.5;
                maxHeight = options.resizeMaxHeight || origHeight * 2.5;
                minWidth = options.resizeMinWidth || origWidth / 1.25;
                maxWidth = options.resizeMaxWidth || origWidth * 1.25;
                mouseMoveFunc = function(e) {
                    if (e.type === "touchmove") {
                        e = globalWin.event;
                        newX = e.changedTouches[0].pageX;
                        newY = e.changedTouches[0].pageY;
                    } else {
                        newX = e.pageX;
                        newY = e.pageY;
                    }
                    var newHeight = startHeight + (newY - startY)
                      , newWidth = rtl ? startWidth - (newX - startX) : startWidth + (newX - startX);
                    if (maxWidth > 0 && newWidth > maxWidth) {
                        newWidth = maxWidth;
                    }
                    if (minWidth > 0 && newWidth < minWidth) {
                        newWidth = minWidth;
                    }
                    if (!options.resizeWidth) {
                        newWidth = false;
                    }
                    if (maxHeight > 0 && newHeight > maxHeight) {
                        newHeight = maxHeight;
                    }
                    if (minHeight > 0 && newHeight < minHeight) {
                        newHeight = minHeight;
                    }
                    if (!options.resizeHeight) {
                        newHeight = false;
                    }
                    if (newWidth || newHeight) {
                        base.dimensions(newWidth, newHeight);
                        if (IE_VER < 7) {
                            $editorContainer.height(newHeight);
                        }
                    }
                    e.preventDefault();
                }
                ;
                mouseUpFunc = function(e) {
                    if (!isDragging) {
                        return;
                    }
                    isDragging = false;
                    $cover.hide();
                    $editorContainer.removeClass("resizing").height("auto");
                    $globalDoc.off(moveEvents, mouseMoveFunc);
                    $globalDoc.off(endEvents, mouseUpFunc);
                    e.preventDefault();
                }
                ;
                $editorContainer.append($grip);
                $editorContainer.append($cover.hide());
                $grip.on("touchstart mousedown", function(e) {
                    if (e.type === "touchstart") {
                        e = globalWin.event;
                        startX = e.touches[0].pageX;
                        startY = e.touches[0].pageY;
                    } else {
                        startX = e.pageX;
                        startY = e.pageY;
                    }
                    startWidth = $editorContainer.width();
                    startHeight = $editorContainer.height();
                    isDragging = true;
                    $editorContainer.addClass("resizing");
                    $cover.show();
                    $globalDoc.on(moveEvents, mouseMoveFunc);
                    $globalDoc.on(endEvents, mouseUpFunc);
                    if (IE_VER < 7) {
                        $editorContainer.height(startHeight);
                    }
                    e.preventDefault();
                });
            }
            ;
            initEmoticons = function() {
                var emoticon, emoticons = options.emoticons, root = options.emoticonsRoot;
                if (!$.isPlainObject(emoticons) || !options.emoticonsEnabled) {
                    return;
                }
                $.each(emoticons, function(idx, val) {
                    $.each(val, function(key, url) {
                        if (root) {
                            url = {
                                url: root + (url.url || url),
                                tooltip: url.tooltip || key
                            };
                            emoticons[idx][key] = url;
                        }
                        emoticon = globalDoc.createElement("img");
                        emoticon.src = url.url || url;
                        preLoadCache.push(emoticon);
                    });
                });
            }
            ;
            autofocus = function() {
                var range, txtPos, doc = $wysiwygDoc[0], body = $wysiwygBody[0], node = body.firstChild, focusEnd = !!options.autofocusEnd;
                if (!$editorContainer.is(":visible")) {
                    return;
                }
                if (base.sourceMode()) {
                    txtPos = focusEnd ? sourceEditor.value.length : 0;
                    if (sourceEditor.setSelectionRange) {
                        sourceEditor.setSelectionRange(txtPos, txtPos);
                    } else {
                        range = sourceEditor.createTextRange();
                        range.moveEnd("character", txtPos);
                        range.collapse(false);
                        range.select();
                    }
                    return;
                }
                dom.removeWhiteSpace(body);
                if (focusEnd) {
                    if (!(node = body.lastChild)) {
                        node = doc.createElement("p");
                        $wysiwygBody.append(node);
                    }
                    while (node.lastChild) {
                        node = node.lastChild;
                        if (!IE_BR_FIX && $(node).is("br") && node.previousSibling) {
                            node = node.previousSibling;
                        }
                    }
                }
                if (doc.createRange) {
                    range = doc.createRange();
                    if (!dom.canHaveChildren(node)) {
                        range.setStartBefore(node);
                        if (focusEnd) {
                            range.setStartAfter(node);
                        }
                    } else {
                        range.selectNodeContents(node);
                    }
                } else {
                    range = body.createTextRange();
                    range.moveToElementText(node.nodeType !== 3 ? node : node.parentNode);
                }
                range.collapse(!focusEnd);
                rangeHelper.selectRange(range);
                currentSelection = range;
                if (focusEnd) {
                    $wysiwygDoc.scrollTop(body.scrollHeight);
                    $wysiwygBody.scrollTop(body.scrollHeight);
                }
                base.focus();
            }
            ;
            base.readOnly = function(readOnly) {
                if (typeof readOnly !== "boolean") {
                    return $sourceEditor.attr("readonly") === "readonly";
                }
                $wysiwygBody[0].contentEditable = !readOnly;
                if (!readOnly) {
                    $sourceEditor.removeAttr("readonly");
                } else {
                    $sourceEditor.attr("readonly", "readonly");
                }
                updateToolBar(readOnly);
                return base;
            }
            ;
            base.rtl = function(rtl) {
                var dir = rtl ? "rtl" : "ltr";
                if (typeof rtl !== "boolean") {
                    return $sourceEditor.attr("dir") === "rtl";
                }
                $wysiwygBody.attr("dir", dir);
                $sourceEditor.attr("dir", dir);
                $editorContainer.removeClass("rtl").removeClass("ltr").addClass(dir);
                return base;
            }
            ;
            updateToolBar = function(disable) {
                var mode = base.inSourceMode() ? "txtmode" : "wysiwygmode";
                $.each(toolbarButtons, function(idx, $button) {
                    if (disable === true || !$button.data("sceditor-" + mode)) {
                        $button.addClass("disabled");
                    } else {
                        $button.removeClass("disabled");
                    }
                });
            }
            ;
            base.width = function(width, saveWidth) {
                if (!width && width !== 0) {
                    return $editorContainer.width();
                }
                base.dimensions(width, null, saveWidth);
                return base;
            }
            ;
            base.dimensions = function(width, height, save) {
                var ieBorder = IE_VER < 8 || globalDoc.documentMode < 8 ? 2 : 0;
                var undef;
                width = (!width && width !== 0) ? false : width;
                height = (!height && height !== 0) ? false : height;
                if (width === false && height === false) {
                    return {
                        width: base.width(),
                        height: base.height()
                    };
                }
                if ($wysiwygEditor.data("outerWidthOffset") === undef) {
                    base.updateStyleCache();
                }
                if (width !== false) {
                    if (save !== false) {
                        options.width = width;
                    }
                    if (height === false) {
                        height = $editorContainer.height();
                        save = false;
                    }
                    $editorContainer.width(width);
                    if (width && width.toString().indexOf("%") > -1) {
                        width = $editorContainer.width();
                    }
                    $wysiwygEditor.width(width - $wysiwygEditor.data("outerWidthOffset"));
                    $sourceEditor.width(width - $sourceEditor.data("outerWidthOffset"));
                    if (browser.ios && $wysiwygBody) {
                        $wysiwygBody.width(width - $wysiwygEditor.data("outerWidthOffset") - ($wysiwygBody.outerWidth(true) - $wysiwygBody.width()));
                    }
                }
                if (height !== false) {
                    if (save !== false) {
                        options.height = height;
                    }
                    if (height && height.toString().indexOf("%") > -1) {
                        height = $editorContainer.height(height).height();
                        $editorContainer.height("auto");
                    }
                    height -= !options.toolbarContainer ? $toolbar.outerHeight(true) : 0;
                    $wysiwygEditor.height(height - $wysiwygEditor.data("outerHeightOffset"));
                    $sourceEditor.height(height - ieBorder - $sourceEditor.data("outerHeightOffset"));
                }
                return base;
            }
            ;
            base.updateStyleCache = function() {
                $wysiwygEditor.data("outerWidthOffset", $wysiwygEditor.outerWidth(true) - $wysiwygEditor.width());
                $sourceEditor.data("outerWidthOffset", $sourceEditor.outerWidth(true) - $sourceEditor.width());
                $wysiwygEditor.data("outerHeightOffset", $wysiwygEditor.outerHeight(true) - $wysiwygEditor.height());
                $sourceEditor.data("outerHeightOffset", $sourceEditor.outerHeight(true) - $sourceEditor.height());
            }
            ;
            base.height = function(height, saveHeight) {
                if (!height && height !== 0) {
                    return $editorContainer.height();
                }
                base.dimensions(null, height, saveHeight);
                return base;
            }
            ;
            base.maximize = function(maximize) {
                if (typeof maximize === "undefined") {
                    return $editorContainer.is(".sceditor-maximize");
                }
                maximize = !!maximize;
                if (IE_VER < 7) {
                    $("html, body").toggleClass("sceditor-maximize", maximize);
                }
                $editorContainer.toggleClass("sceditor-maximize", maximize);
                base.width(maximize ? "100%" : options.width, false);
                base.height(maximize ? "100%" : options.height, false);
                return base;
            }
            ;
            base.expandToContent = function(ignoreMaxHeight) {
                var currentHeight = $editorContainer.height()
                  , padding = (currentHeight - $wysiwygEditor.height())
                  , height = $wysiwygBody[0].scrollHeight || $wysiwygDoc[0].documentElement.scrollHeight
                  , maxHeight = options.resizeMaxHeight || ((options.height || $original.height()) * 2);
                height += padding;
                if ((ignoreMaxHeight === true || height <= maxHeight) && height > currentHeight) {
                    base.height(height);
                }
            }
            ;
            base.destroy = function() {
                if (!pluginManager) {
                    return;
                }
                pluginManager.destroy();
                rangeHelper = null;
                lastRange = null;
                pluginManager = null;
                if ($dropdown) {
                    $dropdown.off().remove();
                }
                $globalDoc.off("click", handleDocumentClick);
                $globalWin.off("resize orientationChanged", handleWindowResize);
                $(original.form).off("reset", handleFormReset).off("submit", base.updateOriginal);
                $wysiwygBody.off();
                $wysiwygDoc.off().find("*").remove();
                $sourceEditor.off().remove();
                $toolbar.remove();
                $editorContainer.off().find("*").off().remove();
                $editorContainer.remove();
                $original.removeData("sceditor").removeData("sceditorbbcode").show();
                if (isRequired) {
                    $original.attr("required", "required");
                }
            }
            ;
            base.createDropDown = function(menuItem, name, content, ieFix) {
                var dropDownCss, cssClass = "sceditor-" + name, onlyclose = $dropdown && $dropdown.is("." + cssClass);
                base.closeDropDown(true);
                if (onlyclose) {
                    return;
                }
                if (ieFix !== false) {
                    $(content).find(":not(input,textarea)").filter(function() {
                        return this.nodeType === 1;
                    }).attr("unselectable", "on");
                }
                dropDownCss = {
                    top: menuItem.offset().top,
                    left: menuItem.offset().left,
                    marginTop: menuItem.outerHeight()
                };
                $.extend(dropDownCss, options.dropDownCss);
                $dropdown = $('<div class="sceditor-dropdown ' + cssClass + '" />').css(dropDownCss).append(content).appendTo($("body")).on("click focusin", function(e) {
                    e.stopPropagation();
                });
                setTimeout(function() {
                    if ($dropdown) {
                        $dropdown.find("input,textarea").first().focus();
                    }
                });
            }
            ;
            handleDocumentClick = function(e) {
                if (e.which !== 3 && $dropdown) {
                    autoUpdate();
                    base.closeDropDown();
                }
            }
            ;
            handlePasteEvt = function(e) {
                var html, handlePaste, scrollTop, elm = $wysiwygBody[0], doc = $wysiwygDoc[0], checkCount = 0, pastearea = globalDoc.createElement("div"), prePasteContent = doc.createDocumentFragment(), clipboardData = e ? e.clipboardData : false;
                if (options.disablePasting) {
                    return false;
                }
                if (!options.enablePasteFiltering) {
                    return;
                }
                rangeHelper.saveRange();
                globalDoc.body.appendChild(pastearea);
                if (clipboardData && clipboardData.getData) {
                    if ((html = clipboardData.getData("text/html")) || (html = clipboardData.getData("text/plain"))) {
                        pastearea.innerHTML = html;
                        handlePasteData(elm, pastearea);
                        return false;
                    }
                }
                scrollTop = $wysiwygBody.scrollTop() || $wysiwygDoc.scrollTop();
                while (elm.firstChild) {
                    prePasteContent.appendChild(elm.firstChild);
                }
                handlePaste = function(elm, pastearea) {
                    if (elm.childNodes.length > 0 || checkCount > 25) {
                        while (elm.firstChild) {
                            pastearea.appendChild(elm.firstChild);
                        }
                        while (prePasteContent.firstChild) {
                            elm.appendChild(prePasteContent.firstChild);
                        }
                        $wysiwygBody.scrollTop(scrollTop);
                        $wysiwygDoc.scrollTop(scrollTop);
                        if (pastearea.childNodes.length > 0) {
                            handlePasteData(elm, pastearea);
                        } else {
                            rangeHelper.restoreRange();
                        }
                    } else {
                        checkCount++;
                        setTimeout(function() {
                            handlePaste(elm, pastearea);
                        }, 20);
                    }
                }
                ;
                handlePaste(elm, pastearea);
                base.focus();
                return true;
            }
            ;
            handlePasteData = function(elm, pastearea) {
                dom.fixNesting(pastearea);
                var pasteddata = pastearea.innerHTML;
                if (pluginManager.hasHandler("toSource")) {
                    pasteddata = pluginManager.callOnlyFirst("toSource", pasteddata, $(pastearea));
                }
                pastearea.parentNode.removeChild(pastearea);
                if (pluginManager.hasHandler("toWysiwyg")) {
                    pasteddata = pluginManager.callOnlyFirst("toWysiwyg", pasteddata, true);
                }
                rangeHelper.restoreRange();
                base.wysiwygEditorInsertHtml(pasteddata, null, true);
            }
            ;
            base.closeDropDown = function(focus) {
                if ($dropdown) {
                    $dropdown.off().remove();
                    $dropdown = null;
                }
                if (focus === true) {
                    base.focus();
                }
            }
            ;
            getWysiwygDoc = function() {
                if (wysiwygEditor.contentDocument) {
                    return wysiwygEditor.contentDocument;
                }
                if (wysiwygEditor.contentWindow && wysiwygEditor.contentWindow.document) {
                    return wysiwygEditor.contentWindow.document;
                }
                return wysiwygEditor.document;
            }
            ;
            base.wysiwygEditorInsertHtml = function(html, endHtml, overrideCodeBlocking) {
                var $marker, scrollTop, scrollTo, editorHeight = $wysiwygEditor.height();
                base.focus();
                if (!overrideCodeBlocking && ($(currentBlockNode).is("code") || $(currentBlockNode).parents("code").length !== 0)) {
                    return;
                }
                rangeHelper.insertHTML(html, endHtml);
                rangeHelper.saveRange();
                replaceEmoticons($wysiwygBody[0]);
                $marker = $wysiwygBody.find("#sceditor-end-marker").show();
                scrollTop = $wysiwygBody.scrollTop() || $wysiwygDoc.scrollTop();
                scrollTo = (dom.getOffset($marker[0]).top + ($marker.outerHeight(true) * 1.5)) - editorHeight;
                $marker.hide();
                if (scrollTo > scrollTop || scrollTo + editorHeight < scrollTop) {
                    $wysiwygBody.scrollTop(scrollTo);
                    $wysiwygDoc.scrollTop(scrollTo);
                }
                triggerValueChanged(false);
                rangeHelper.restoreRange();
                appendNewLine();
            }
            ;
            base.wysiwygEditorInsertText = function(text, endText) {
                base.wysiwygEditorInsertHtml(escape.entities(text), escape.entities(endText));
            }
            ;
            base.insertText = function(text, endText) {
                if (base.inSourceMode()) {
                    base.sourceEditorInsertText(text, endText);
                } else {
                    base.wysiwygEditorInsertText(text, endText);
                }
                return base;
            }
            ;
            base.sourceEditorInsertText = function(text, endText) {
                var range, scrollTop, currentValue, startPos = sourceEditor.selectionStart, endPos = sourceEditor.selectionEnd;
                scrollTop = sourceEditor.scrollTop;
                sourceEditor.focus();
                if (typeof startPos !== "undefined") {
                    currentValue = sourceEditor.value;
                    if (endText) {
                        text += currentValue.substring(startPos, endPos) + endText;
                    }
                    sourceEditor.value = currentValue.substring(0, startPos) + text + currentValue.substring(endPos, currentValue.length);
                    sourceEditor.selectionStart = (startPos + text.length) - (endText ? endText.length : 0);
                    sourceEditor.selectionEnd = sourceEditor.selectionStart;
                } else {
                    range = globalDoc.selection.createRange();
                    if (endText) {
                        text += range.text + endText;
                    }
                    range.text = text;
                    if (endText) {
                        range.moveEnd("character", 0 - endText.length);
                    }
                    range.moveStart("character", range.End - range.Start);
                    range.select();
                }
                sourceEditor.scrollTop = scrollTop;
                sourceEditor.focus();
                triggerValueChanged();
            }
            ;
            base.getRangeHelper = function() {
                return rangeHelper;
            }
            ;
            base.sourceEditorCaret = function(position) {
                var range, ret = {};
                sourceEditor.focus();
                if (typeof sourceEditor.selectionStart !== "undefined") {
                    if (position) {
                        sourceEditor.selectionStart = position.start;
                        sourceEditor.selectionEnd = position.end;
                    } else {
                        ret.start = sourceEditor.selectionStart;
                        ret.end = sourceEditor.selectionEnd;
                    }
                } else {
                    range = globalDoc.selection.createRange();
                    if (position) {
                        range.moveEnd("character", position.end);
                        range.moveStart("character", position.start);
                        range.select();
                    } else {
                        ret.start = range.Start;
                        ret.end = range.End;
                    }
                }
                return position ? this : ret;
            }
            ;
            base.val = function(val, filter) {
                if (typeof val !== "string") {
                    return base.inSourceMode() ? base.getSourceEditorValue(false) : base.getWysiwygEditorValue(filter);
                }
                if (!base.inSourceMode()) {
                    if (filter !== false && pluginManager.hasHandler("toWysiwyg")) {
                        val = pluginManager.callOnlyFirst("toWysiwyg", val);
                    }
                    base.setWysiwygEditorValue(val);
                } else {
                    base.setSourceEditorValue(val);
                }
                return base;
            }
            ;
            base.insert = function(start, end, filter, convertEmoticons, allowMixed) {
                if (base.inSourceMode()) {
                    base.sourceEditorInsertText(start, end);
                    return base;
                }
                if (end) {
                    var html = rangeHelper.selectedHtml()
                      , $div = $("<div>").appendTo($("body")).hide().html(html);
                    if (filter !== false && pluginManager.hasHandler("toSource")) {
                        html = pluginManager.callOnlyFirst("toSource", html, $div);
                    }
                    $div.remove();
                    start += html + end;
                }
                if (filter !== false && pluginManager.hasHandler("toWysiwyg")) {
                    start = pluginManager.callOnlyFirst("toWysiwyg", start, true);
                }
                if (filter !== false && allowMixed === true) {
                    start = start.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
                }
                base.wysiwygEditorInsertHtml(start);
                return base;
            }
            ;
            base.getWysiwygEditorValue = function(filter) {
                var html;
                var $tmp = $("<div>").appendTo(document.body).append($($wysiwygBody[0].childNodes).clone());
                dom.fixNesting($tmp[0]);
                html = $tmp.html();
                if (filter !== false && pluginManager.hasHandler("toSource")) {
                    html = pluginManager.callOnlyFirst("toSource", html, $tmp);
                }
                $tmp.remove();
                return html;
            }
            ;
            base.getBody = function() {
                return $wysiwygBody;
            }
            ;
            base.getContentAreaContainer = function() {
                return $wysiwygEditor;
            }
            ;
            base.getSourceEditorValue = function(filter) {
                var val = $sourceEditor.val();
                if (filter !== false && pluginManager.hasHandler("toWysiwyg")) {
                    val = pluginManager.callOnlyFirst("toWysiwyg", val);
                }
                return val;
            }
            ;
            base.setWysiwygEditorValue = function(value) {
                if (!value) {
                    value = "<p>" + (IE_VER ? "" : "<br />") + "</p>";
                }
                $wysiwygBody[0].innerHTML = value;
                replaceEmoticons($wysiwygBody[0]);
                appendNewLine();
                triggerValueChanged();
            }
            ;
            base.setSourceEditorValue = function(value) {
                $sourceEditor.val(value);
                triggerValueChanged();
            }
            ;
            base.updateOriginal = function() {
                $original.val(base.val());
            }
            ;
            replaceEmoticons = function(node) {
                if (!options.emoticonsEnabled || $(node).parents("code").length) {
                    return;
                }
                var doc = node.ownerDocument
                  , whitespace = "\\s|\xA0|\u2002|\u2003|\u2009|&nbsp;"
                  , emoticonCodes = []
                  , emoticonRegex = []
                  , emoticons = $.extend({}, options.emoticons.more, options.emoticons.dropdown, options.emoticons.hidden);
                $.each(emoticons, function(key) {
                    if (options.emoticonsCompat) {
                        emoticonRegex[key] = new RegExp("(>|^|" + whitespace + ")" + escape.regex(key) + "($|<|" + whitespace + ")");
                    }
                    emoticonCodes.push(key);
                });
                var convertEmoticons = function(node) {
                    node = node.firstChild;
                    while (node) {
                        var parts, key, emoticon, parsedHtml, emoticonIdx, nextSibling, matchPos, nodeParent = node.parentNode, nodeValue = node.nodeValue;
                        if (node.nodeType !== 3) {
                            if (!$(node).is("code")) {
                                convertEmoticons(node);
                            }
                        } else {
                            if (nodeValue) {
                                emoticonIdx = emoticonCodes.length;
                                while (emoticonIdx--) {
                                    key = emoticonCodes[emoticonIdx];
                                    matchPos = options.emoticonsCompat ? nodeValue.search(emoticonRegex[key]) : nodeValue.indexOf(key);
                                    if (matchPos > -1) {
                                        nextSibling = node.nextSibling;
                                        emoticon = emoticons[key];
                                        parts = nodeValue.substr(matchPos).split(key);
                                        nodeValue = nodeValue.substr(0, matchPos) + parts.shift();
                                        node.nodeValue = nodeValue;
                                        parsedHtml = dom.parseHTML(_tmpl("emoticon", {
                                            key: key,
                                            url: emoticon.url || emoticon,
                                            tooltip: emoticon.tooltip || key
                                        }), doc);
                                        nodeParent.insertBefore(parsedHtml[0], nextSibling);
                                        nodeParent.insertBefore(doc.createTextNode(parts.join(key)), nextSibling);
                                    }
                                }
                            }
                        }
                        node = node.nextSibling;
                    }
                };
                convertEmoticons(node);
                if (options.emoticonsCompat) {
                    currentEmoticons = $wysiwygBody.find("img[data-sceditor-emoticon]");
                }
            }
            ;
            base.inSourceMode = function() {
                return $editorContainer.hasClass("sourceMode");
            }
            ;
            base.sourceMode = function(enable) {
                var inSourceMode = base.inSourceMode();
                if (typeof enable !== "boolean") {
                    return inSourceMode;
                }
                if ((inSourceMode && !enable) || (!inSourceMode && enable)) {
                    base.toggleSourceMode();
                }
                return base;
            }
            ;
            base.toggleSourceMode = function() {
                var sourceMode = base.inSourceMode();
                if (!browser.isWysiwygSupported && sourceMode) {
                    return;
                }
                if (!sourceMode) {
                    rangeHelper.saveRange();
                    rangeHelper.clear();
                }
                base.blur();
                if (sourceMode) {
                    base.setWysiwygEditorValue(base.getSourceEditorValue());
                } else {
                    base.setSourceEditorValue(base.getWysiwygEditorValue());
                }
                lastRange = null;
                $sourceEditor.toggle();
                $wysiwygEditor.toggle();
                $editorContainer.toggleClass("wysiwygMode", sourceMode).toggleClass("sourceMode", !sourceMode);
                updateToolBar();
                updateActiveButtons();
            }
            ;
            sourceEditorSelectedText = function() {
                sourceEditor.focus();
                if (typeof sourceEditor.selectionStart !== "undefined") {
                    return sourceEditor.value.substring(sourceEditor.selectionStart, sourceEditor.selectionEnd);
                } else {
                    return globalDoc.selection.createRange().text;
                }
            }
            ;
            handleCommand = function(caller, cmd) {
                if (base.inSourceMode()) {
                    if (cmd.txtExec) {
                        if ($.isArray(cmd.txtExec)) {
                            base.sourceEditorInsertText.apply(base, cmd.txtExec);
                        } else {
                            cmd.txtExec.call(base, caller, sourceEditorSelectedText());
                        }
                    }
                } else {
                    if (cmd.exec) {
                        if ($.isFunction(cmd.exec)) {
                            cmd.exec.call(base, caller);
                        } else {
                            base.execCommand(cmd.exec, cmd.hasOwnProperty("execParam") ? cmd.execParam : null);
                        }
                    }
                }
            }
            ;
            saveRange = function() {
                if (IE_VER) {
                    lastRange = rangeHelper.selectedRange();
                }
            }
            ;
            base.execCommand = function(command, param) {
                var executed = false
                  , commandObj = base.commands[command]
                  , $parentNode = $(rangeHelper.parentNode());
                base.focus();
                if ($parentNode.is("code") || $parentNode.parents("code").length !== 0) {
                    return;
                }
                try {
                    executed = $wysiwygDoc[0].execCommand(command, false, param);
                } catch (ex) {}
                if (!executed && commandObj && commandObj.errorMessage) {
                    alert(base._(commandObj.errorMessage));
                }
                updateActiveButtons();
            }
            ;
            checkSelectionChanged = function() {
                function check() {
                    if (rangeHelper && !rangeHelper.compare(currentSelection)) {
                        currentSelection = rangeHelper.cloneSelected();
                        $editorContainer.trigger($.Event("selectionchanged"));
                    }
                    isSelectionCheckPending = false;
                }
                if (isSelectionCheckPending) {
                    return;
                }
                isSelectionCheckPending = true;
                if (IE_VER) {
                    check();
                } else {
                    setTimeout(check, 100);
                }
            }
            ;
            checkNodeChanged = function() {
                var oldNode, node = rangeHelper.parentNode();
                if (currentNode !== node) {
                    oldNode = currentNode;
                    currentNode = node;
                    currentBlockNode = rangeHelper.getFirstBlockParent(node);
                    $editorContainer.trigger($.Event("nodechanged", {
                        oldNode: oldNode,
                        newNode: currentNode
                    }));
                }
            }
            ;
            base.currentNode = function() {
                return currentNode;
            }
            ;
            base.currentBlockNode = function() {
                return currentBlockNode;
            }
            ;
            updateActiveButtons = function(e) {
                var firstBlock, parent;
                var activeClass = "active";
                var doc = $wysiwygDoc[0];
                var isSource = base.sourceMode();
                if (base.readOnly()) {
                    $toolbar.find(activeClass).removeClass(activeClass);
                    return;
                }
                if (!isSource) {
                    parent = e ? e.newNode : rangeHelper.parentNode();
                    firstBlock = rangeHelper.getFirstBlockParent(parent);
                }
                for (var i = 0; i < btnStateHandlers.length; i++) {
                    var state = 0;
                    var $btn = toolbarButtons[btnStateHandlers[i].name];
                    var stateFn = btnStateHandlers[i].state;
                    var isDisabled = (isSource && !$btn.data("sceditor-txtmode")) || (!isSource && !$btn.data("sceditor-wysiwygmode"));
                    if (typeof stateFn === "string") {
                        if (!isSource) {
                            try {
                                state = doc.queryCommandEnabled(stateFn) ? 0 : -1;
                                if (state > -1) {
                                    state = doc.queryCommandState(stateFn) ? 1 : 0;
                                }
                            } catch (ex) {}
                        }
                    } else {
                        if (!isDisabled) {
                            state = stateFn.call(base, parent, firstBlock);
                        }
                    }
                    $btn.toggleClass("disabled", isDisabled || state < 0).toggleClass(activeClass, state > 0);
                }
            }
            ;
            handleKeyPress = function(e) {
                var $closestTag, br, brParent, lastChild;
                var DUPLICATED_TAGS = "code,blockquote,pre";
                var LIST_TAGS = "li,ul,ol";
                if (e.originalEvent.defaultPrevented) {
                    return;
                }
                base.closeDropDown();
                $closestTag = $(currentBlockNode).closest(DUPLICATED_TAGS + "," + LIST_TAGS).first();
                if (e.which === 13 && $closestTag.length && !$closestTag.is(LIST_TAGS)) {
                    lastRange = null;
                    br = $wysiwygDoc[0].createElement("br");
                    rangeHelper.insertNode(br);
                    if (!IE_BR_FIX) {
                        brParent = br.parentNode;
                        lastChild = brParent.lastChild;
                        if (lastChild && lastChild.nodeType === 3 && lastChild.nodeValue === "") {
                            brParent.removeChild(lastChild);
                            lastChild = brParent.lastChild;
                        }
                        if (!dom.isInline(brParent, true) && lastChild === br && dom.isInline(br.previousSibling)) {
                            rangeHelper.insertHTML("<br>");
                        }
                    }
                    return false;
                }
            }
            ;
            appendNewLine = function() {
                var name, requiresNewLine, paragraph, body = $wysiwygBody[0];
                dom.rTraverse(body, function(node) {
                    name = node.nodeName.toLowerCase();
                    if ($.inArray(name, requireNewLineFix) > -1) {
                        requiresNewLine = true;
                    }
                    if ((node.nodeType === 3 && !/^\s*$/.test(node.nodeValue)) || name === "br" || (IE_BR_FIX && !node.firstChild && !dom.isInline(node, false))) {
                        if (requiresNewLine) {
                            paragraph = $wysiwygDoc[0].createElement("p");
                            paragraph.className = "sceditor-nlf";
                            paragraph.innerHTML = !IE_BR_FIX ? "<br />" : "";
                            body.appendChild(paragraph);
                        }
                        return false;
                    }
                });
            }
            ;
            handleFormReset = function() {
                base.val($original.val());
            }
            ;
            handleMouseDown = function() {
                base.closeDropDown();
                lastRange = null;
            }
            ;
            handleWindowResize = function() {
                var height = options.height
                  , width = options.width;
                if (!base.maximize()) {
                    if ((height && height.toString().indexOf("%") > -1) || (width && width.toString().indexOf("%") > -1)) {
                        base.dimensions(width, height);
                    }
                } else {
                    base.dimensions("100%", "100%", false);
                }
            }
            ;
            base._ = function() {
                var undef, args = arguments;
                if (locale && locale[args[0]]) {
                    args[0] = locale[args[0]];
                }
                return args[0].replace(/\{(\d+)\}/g, function(str, p1) {
                    return args[p1 - 0 + 1] !== undef ? args[p1 - 0 + 1] : "{" + p1 + "}";
                });
            }
            ;
            handleEvent = function(e) {
                pluginManager.call(e.type + "Event", e, base);
                var prefix = e.target === sourceEditor ? "scesrc" : "scewys";
                var customEvent = $.Event(e);
                customEvent.type = prefix + e.type;
                $editorContainer.trigger(customEvent, base);
            }
            ;
            base.bind = function(events, handler, excludeWysiwyg, excludeSource) {
                events = events.split(" ");
                var i = events.length;
                while (i--) {
                    if ($.isFunction(handler)) {
                        if (!excludeWysiwyg) {
                            $editorContainer.on("scewys" + events[i], handler);
                        }
                        if (!excludeSource) {
                            $editorContainer.on("scesrc" + events[i], handler);
                        }
                        if (events[i] === "valuechanged") {
                            triggerValueChanged.hasHandler = true;
                        }
                    }
                }
                return base;
            }
            ;
            base.unbind = function(events, handler, excludeWysiwyg, excludeSource) {
                events = events.split(" ");
                var i = events.length;
                while (i--) {
                    if ($.isFunction(handler)) {
                        if (!excludeWysiwyg) {
                            $editorContainer.off("scewys" + events[i], handler);
                        }
                        if (!excludeSource) {
                            $editorContainer.off("scesrc" + events[i], handler);
                        }
                    }
                }
                return base;
            }
            ;
            base.blur = function(handler, excludeWysiwyg, excludeSource) {
                if ($.isFunction(handler)) {
                    base.on("blur", handler, excludeWysiwyg, excludeSource);
                } else {
                    if (!base.sourceMode()) {
                        $wysiwygBody.blur();
                    } else {
                        $sourceEditor.blur();
                    }
                }
                return base;
            }
            ;
            base.focus = function(handler, excludeWysiwyg, excludeSource) {
                if ($.isFunction(handler)) {
                    base.on("focus", handler, excludeWysiwyg, excludeSource);
                } else {
                    if (!base.inSourceMode()) {
                        var container, rng = rangeHelper.selectedRange();
                        if (!currentSelection && !rangeHelper.hasSelection()) {
                            autofocus();
                        }
                        if (!IE_BR_FIX && rng && rng.endOffset === 1 && rng.collapsed) {
                            container = rng.endContainer;
                            if (container && container.childNodes.length === 1 && $(container.firstChild).is("br")) {
                                rng.setStartBefore(container.firstChild);
                                rng.collapse(true);
                                rangeHelper.selectRange(rng);
                            }
                        }
                        wysiwygEditor.contentWindow.focus();
                        $wysiwygBody[0].focus();
                        if (lastRange) {
                            rangeHelper.selectRange(lastRange);
                            lastRange = null;
                        }
                    } else {
                        sourceEditor.focus();
                    }
                }
                updateActiveButtons();
                return base;
            }
            ;
            base.keyDown = function(handler, excludeWysiwyg, excludeSource) {
                return base.on("keydown", handler, excludeWysiwyg, excludeSource);
            }
            ;
            base.keyPress = function(handler, excludeWysiwyg, excludeSource) {
                return base.on("keypress", handler, excludeWysiwyg, excludeSource);
            }
            ;
            base.keyUp = function(handler, excludeWysiwyg, excludeSource) {
                return base.on("keyup", handler, excludeWysiwyg, excludeSource);
            }
            ;
            base.nodeChanged = function(handler) {
                return base.on("nodechanged", handler, false, true);
            }
            ;
            base.selectionChanged = function(handler) {
                return base.on("selectionchanged", handler, false, true);
            }
            ;
            base.valueChanged = function(handler, excludeWysiwyg, excludeSource) {
                return base.on("valuechanged", handler, excludeWysiwyg, excludeSource);
            }
            ;
            emoticonsKeyPress = function(e) {
                var replacedEmoticon, cachePos = 0, emoticonsCache = base.emoticonsCache, curChar = String.fromCharCode(e.which);
                if ($(currentBlockNode).is("code") || $(currentBlockNode).parents("code").length) {
                    return;
                }
                if (!emoticonsCache) {
                    emoticonsCache = [];
                    $.each($.extend({}, options.emoticons.more, options.emoticons.dropdown, options.emoticons.hidden), function(key, url) {
                        emoticonsCache[cachePos++] = [key, _tmpl("emoticon", {
                            key: key,
                            url: url.url || url,
                            tooltip: url.tooltip || key
                        })];
                    });
                    emoticonsCache.sort(function(a, b) {
                        return a[0].length - b[0].length;
                    });
                    base.emoticonsCache = emoticonsCache;
                    base.longestEmoticonCode = emoticonsCache[emoticonsCache.length - 1][0].length;
                }
                replacedEmoticon = rangeHelper.replaceKeyword(base.emoticonsCache, true, true, base.longestEmoticonCode, options.emoticonsCompat, curChar);
                if (replacedEmoticon && options.emoticonsCompat) {
                    currentEmoticons = $wysiwygBody.find("img[data-sceditor-emoticon]");
                    return /^\s$/.test(curChar);
                }
                return !replacedEmoticon;
            }
            ;
            emoticonsCheckWhitespace = function() {
                if (!currentEmoticons.length) {
                    return;
                }
                var prev, next, parent, range, previousText, rangeStartContainer, currentBlock = base.currentBlockNode(), rangeStart = false, noneWsRegex = /[^\s\xA0\u2002\u2003\u2009\u00a0]+/;
                currentEmoticons = $.map(currentEmoticons, function(emoticon) {
                    if (!emoticon || !emoticon.parentNode) {
                        return null;
                    }
                    if (!$.contains(currentBlock, emoticon)) {
                        return emoticon;
                    }
                    prev = emoticon.previousSibling;
                    next = emoticon.nextSibling;
                    previousText = prev.nodeValue;
                    if (previousText === null) {
                        previousText = prev.innerText || "";
                    }
                    if ((!prev || !noneWsRegex.test(prev.nodeValue.slice(-1))) && (!next || !noneWsRegex.test((next.nodeValue || "")[0]))) {
                        return emoticon;
                    }
                    parent = emoticon.parentNode;
                    range = rangeHelper.cloneSelected();
                    rangeStartContainer = range.startContainer;
                    previousText = previousText + $(emoticon).data("sceditor-emoticon");
                    if (rangeStartContainer === next) {
                        rangeStart = previousText.length + range.startOffset;
                    } else {
                        if (rangeStartContainer === currentBlock && currentBlock.childNodes[range.startOffset] === next) {
                            rangeStart = previousText.length;
                        } else {
                            if (rangeStartContainer === prev) {
                                rangeStart = range.startOffset;
                            }
                        }
                    }
                    if (!next || next.nodeType !== 3) {
                        next = parent.insertBefore(parent.ownerDocument.createTextNode(""), next);
                    }
                    next.insertData(0, previousText);
                    parent.removeChild(prev);
                    parent.removeChild(emoticon);
                    if (rangeStart !== false) {
                        range.setStart(next, rangeStart);
                        range.collapse(true);
                        rangeHelper.selectRange(range);
                    }
                    return null;
                });
            }
            ;
            base.emoticons = function(enable) {
                if (!enable && enable !== false) {
                    return options.emoticonsEnabled;
                }
                options.emoticonsEnabled = enable;
                if (enable) {
                    $wysiwygBody.keypress(emoticonsKeyPress);
                    if (!base.sourceMode()) {
                        rangeHelper.saveRange();
                        replaceEmoticons($wysiwygBody[0]);
                        currentEmoticons = $wysiwygBody.find("img[data-sceditor-emoticon]");
                        triggerValueChanged(false);
                        rangeHelper.restoreRange();
                    }
                } else {
                    $wysiwygBody.find("img[data-sceditor-emoticon]").replaceWith(function() {
                        return $(this).data("sceditor-emoticon");
                    });
                    currentEmoticons = [];
                    $wysiwygBody.off("keypress", emoticonsKeyPress);
                    triggerValueChanged();
                }
                return base;
            }
            ;
            base.css = function(css) {
                if (!inlineCss) {
                    inlineCss = $('<style id="#inline" />', $wysiwygDoc[0]).appendTo($wysiwygDoc.find("head"))[0];
                }
                if (typeof css !== "string") {
                    return inlineCss.styleSheet ? inlineCss.styleSheet.cssText : inlineCss.innerHTML;
                }
                if (inlineCss.styleSheet) {
                    inlineCss.styleSheet.cssText = css;
                } else {
                    inlineCss.innerHTML = css;
                }
                return base;
            }
            ;
            handleKeyDown = function(e) {
                var shortcut = []
                  , SHIFT_KEYS = {
                    "`": "~",
                    "1": "!",
                    "2": "@",
                    "3": "#",
                    "4": "$",
                    "5": "%",
                    "6": "^",
                    "7": "&",
                    "8": "*",
                    "9": "(",
                    "0": ")",
                    "-": "_",
                    "=": "+",
                    ";": ": ",
                    "'": '"',
                    ",": "<",
                    ".": ">",
                    "/": "?",
                    "\\": "|",
                    "[": "{",
                    "]": "}"
                }
                  , SPECIAL_KEYS = {
                    8: "backspace",
                    9: "tab",
                    13: "enter",
                    19: "pause",
                    20: "capslock",
                    27: "esc",
                    32: "space",
                    33: "pageup",
                    34: "pagedown",
                    35: "end",
                    36: "home",
                    37: "left",
                    38: "up",
                    39: "right",
                    40: "down",
                    45: "insert",
                    46: "del",
                    91: "win",
                    92: "win",
                    93: "select",
                    96: "0",
                    97: "1",
                    98: "2",
                    99: "3",
                    100: "4",
                    101: "5",
                    102: "6",
                    103: "7",
                    104: "8",
                    105: "9",
                    106: "*",
                    107: "+",
                    109: "-",
                    110: ".",
                    111: "/",
                    112: "f1",
                    113: "f2",
                    114: "f3",
                    115: "f4",
                    116: "f5",
                    117: "f6",
                    118: "f7",
                    119: "f8",
                    120: "f9",
                    121: "f10",
                    122: "f11",
                    123: "f12",
                    144: "numlock",
                    145: "scrolllock",
                    186: ";",
                    187: "=",
                    188: ",",
                    189: "-",
                    190: ".",
                    191: "/",
                    192: "`",
                    219: "[",
                    220: "\\",
                    221: "]",
                    222: "'"
                }
                  , NUMPAD_SHIFT_KEYS = {
                    109: "-",
                    110: "del",
                    111: "/",
                    96: "0",
                    97: "1",
                    98: "2",
                    99: "3",
                    100: "4",
                    101: "5",
                    102: "6",
                    103: "7",
                    104: "8",
                    105: "9"
                }
                  , which = e.which
                  , character = SPECIAL_KEYS[which] || String.fromCharCode(which).toLowerCase();
                if (e.ctrlKey || e.metaKey) {
                    shortcut.push("ctrl");
                }
                if (e.altKey) {
                    shortcut.push("alt");
                }
                if (e.shiftKey) {
                    shortcut.push("shift");
                    if (NUMPAD_SHIFT_KEYS[which]) {
                        character = NUMPAD_SHIFT_KEYS[which];
                    } else {
                        if (SHIFT_KEYS[character]) {
                            character = SHIFT_KEYS[character];
                        }
                    }
                }
                if (character && (which < 16 || which > 18)) {
                    shortcut.push(character);
                }
                shortcut = shortcut.join("+");
                if (shortcutHandlers[shortcut]) {
                    return shortcutHandlers[shortcut].call(base);
                }
            }
            ;
            base.addShortcut = function(shortcut, cmd) {
                shortcut = shortcut.toLowerCase();
                if (typeof cmd === "string") {
                    shortcutHandlers[shortcut] = function() {
                        handleCommand(toolbarButtons[cmd], base.commands[cmd]);
                        return false;
                    }
                    ;
                } else {
                    shortcutHandlers[shortcut] = cmd;
                }
                return base;
            }
            ;
            base.removeShortcut = function(shortcut) {
                delete shortcutHandlers[shortcut.toLowerCase()];
                return base;
            }
            ;
            handleBackSpace = function(e) {
                var node, offset, tmpRange, range, parent;
                if (options.disableBlockRemove || e.which !== 8 || !(range = rangeHelper.selectedRange())) {
                    return;
                }
                if (!globalWin.getSelection) {
                    node = range.parentElement();
                    tmpRange = $wysiwygDoc[0].selection.createRange();
                    tmpRange.moveToElementText(node);
                    tmpRange.setEndPoint("EndToStart", range);
                    offset = tmpRange.text.length;
                } else {
                    node = range.startContainer;
                    offset = range.startOffset;
                }
                if (offset !== 0 || !(parent = currentStyledBlockNode())) {
                    return;
                }
                while (node !== parent) {
                    while (node.previousSibling) {
                        node = node.previousSibling;
                        if (node.nodeType !== 3 || node.nodeValue) {
                            return;
                        }
                    }
                    if (!(node = node.parentNode)) {
                        return;
                    }
                }
                if (!parent || $(parent).is("body")) {
                    return;
                }
                base.clearBlockFormatting(parent);
                return false;
            }
            ;
            currentStyledBlockNode = function() {
                var block = currentBlockNode;
                while (!dom.hasStyling(block) || dom.isInline(block, true)) {
                    if (!(block = block.parentNode) || $(block).is("body")) {
                        return;
                    }
                }
                return block;
            }
            ;
            base.clearBlockFormatting = function(block) {
                block = block || currentStyledBlockNode();
                if (!block || $(block).is("body")) {
                    return base;
                }
                rangeHelper.saveRange();
                block.className = "";
                lastRange = null;
                $(block).attr("style", "");
                if (!$(block).is("p,div,td")) {
                    dom.convertElement(block, "p");
                }
                rangeHelper.restoreRange();
                return base;
            }
            ;
            triggerValueChanged = function(saveRange) {
                if (!pluginManager || (!pluginManager.hasHandler("valuechangedEvent") && !triggerValueChanged.hasHandler)) {
                    return;
                }
                var currentHtml, sourceMode = base.sourceMode(), hasSelection = !sourceMode && rangeHelper.hasSelection();
                saveRange = saveRange !== false && !$wysiwygDoc[0].getElementById("sceditor-start-marker");
                if (valueChangedKeyUp.timer) {
                    clearTimeout(valueChangedKeyUp.timer);
                    valueChangedKeyUp.timer = false;
                }
                if (hasSelection && saveRange) {
                    rangeHelper.saveRange();
                }
                currentHtml = sourceMode ? $sourceEditor.val() : $wysiwygBody.html();
                if (currentHtml !== triggerValueChanged.lastHtmlValue) {
                    triggerValueChanged.lastHtmlValue = currentHtml;
                    $editorContainer.trigger($.Event("valuechanged", {
                        rawValue: sourceMode ? base.val() : currentHtml
                    }));
                }
                if (hasSelection && saveRange) {
                    rangeHelper.removeMarkers();
                }
            }
            ;
            valueChangedBlur = function() {
                if (valueChangedKeyUp.timer) {
                    triggerValueChanged();
                }
            }
            ;
            valueChangedKeyUp = function(e) {
                var which = e.which
                  , lastChar = valueChangedKeyUp.lastChar
                  , lastWasSpace = (lastChar === 13 || lastChar === 32)
                  , lastWasDelete = (lastChar === 8 || lastChar === 46);
                valueChangedKeyUp.lastChar = which;
                if (which === 13 || which === 32) {
                    if (!lastWasSpace) {
                        triggerValueChanged();
                    } else {
                        valueChangedKeyUp.triggerNextChar = true;
                    }
                } else {
                    if (which === 8 || which === 46) {
                        if (!lastWasDelete) {
                            triggerValueChanged();
                        } else {
                            valueChangedKeyUp.triggerNextChar = true;
                        }
                    } else {
                        if (valueChangedKeyUp.triggerNextChar) {
                            triggerValueChanged();
                            valueChangedKeyUp.triggerNextChar = false;
                        }
                    }
                }
                if (valueChangedKeyUp.timer) {
                    clearTimeout(valueChangedKeyUp.timer);
                }
                valueChangedKeyUp.timer = setTimeout(function() {
                    triggerValueChanged();
                }, 1500);
            }
            ;
            autoUpdate = function() {
                if (!autoUpdateCanceled) {
                    base.updateOriginal();
                }
                autoUpdateCanceled = false;
            }
            ;
            init();
        };
        SCEditor.locale = {};
        SCEditor.command = {
            get: function(name) {
                return SCEditor.commands[name] || null;
            },
            set: function(name, cmd) {
                if (!name || !cmd) {
                    return false;
                }
                cmd = $.extend(SCEditor.commands[name] || {}, cmd);
                cmd.remove = function() {
                    SCEditor.command.remove(name);
                }
                ;
                SCEditor.commands[name] = cmd;
                return this;
            },
            remove: function(name) {
                if (SCEditor.commands[name]) {
                    delete SCEditor.commands[name];
                }
                return this;
            }
        };
        return SCEditor;
    }
    .call(exports, __webpack_require__, exports, module),
    __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}
, function(module, exports, __webpack_require__) {
    var __WEBPACK_AMD_DEFINE_RESULT__;
    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
        var plugins = {};
        var PluginManager = function(thisObj) {
            var base = this;
            var registeredPlugins = [];
            var formatSignalName = function(signal) {
                return "signal" + signal.charAt(0).toUpperCase() + signal.slice(1);
            };
            var callHandlers = function(args, returnAtFirst) {
                args = [].slice.call(args);
                var idx, ret, signal = formatSignalName(args.shift());
                for (idx = 0; idx < registeredPlugins.length; idx++) {
                    if (signal in registeredPlugins[idx]) {
                        ret = registeredPlugins[idx][signal].apply(thisObj, args);
                        if (returnAtFirst) {
                            return ret;
                        }
                    }
                }
            };
            base.call = function() {
                callHandlers(arguments, false);
            }
            ;
            base.callOnlyFirst = function() {
                return callHandlers(arguments, true);
            }
            ;
            base.hasHandler = function(signal) {
                var i = registeredPlugins.length;
                signal = formatSignalName(signal);
                while (i--) {
                    if (signal in registeredPlugins[i]) {
                        return true;
                    }
                }
                return false;
            }
            ;
            base.exists = function(plugin) {
                if (plugin in plugins) {
                    plugin = plugins[plugin];
                    return typeof plugin === "function" && typeof plugin.prototype === "object";
                }
                return false;
            }
            ;
            base.isRegistered = function(plugin) {
                if (base.exists(plugin)) {
                    var idx = registeredPlugins.length;
                    while (idx--) {
                        if (registeredPlugins[idx]instanceof plugins[plugin]) {
                            return true;
                        }
                    }
                }
                return false;
            }
            ;
            base.register = function(plugin) {
                if (!base.exists(plugin) || base.isRegistered(plugin)) {
                    return false;
                }
                plugin = new plugins[plugin]();
                registeredPlugins.push(plugin);
                if ("init"in plugin) {
                    plugin.init.call(thisObj);
                }
                return true;
            }
            ;
            base.deregister = function(plugin) {
                var removedPlugin, pluginIdx = registeredPlugins.length, removed = false;
                if (!base.isRegistered(plugin)) {
                    return removed;
                }
                while (pluginIdx--) {
                    if (registeredPlugins[pluginIdx]instanceof plugins[plugin]) {
                        removedPlugin = registeredPlugins.splice(pluginIdx, 1)[0];
                        removed = true;
                        if ("destroy"in removedPlugin) {
                            removedPlugin.destroy.call(thisObj);
                        }
                    }
                }
                return removed;
            }
            ;
            base.destroy = function() {
                var i = registeredPlugins.length;
                while (i--) {
                    if ("destroy"in registeredPlugins[i]) {
                        registeredPlugins[i].destroy.call(thisObj);
                    }
                }
                registeredPlugins = [];
                thisObj = null;
            }
            ;
        };
        PluginManager.plugins = plugins;
        return PluginManager;
    }
    .call(exports, __webpack_require__, exports, module),
    __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}
, function(module, exports, __webpack_require__) {
    var __WEBPACK_AMD_DEFINE_RESULT__;
    !(__WEBPACK_AMD_DEFINE_RESULT__ = function(require) {
        var $ = __webpack_require__(1);
        var dom = __webpack_require__(5);
        var escape = __webpack_require__(7);
        var browser = __webpack_require__(6);
        var IE_VER = browser.ie;
        var IE_BR_FIX = IE_VER && IE_VER < 11;
        var _nodeToHtml = function(node) {
            return $("<p>", node.ownerDocument).append(node).html();
        };
        var outerText = function(range, isLeft, length) {
            var nodeValue, remaining, start, end, node, text = "", next = range.startContainer, offset = range.startOffset;
            if (next && next.nodeType !== 3) {
                next = next.childNodes[offset];
                offset = 0;
            }
            start = end = offset;
            while (length > text.length && next && next.nodeType === 3) {
                nodeValue = next.nodeValue;
                remaining = length - text.length;
                if (node) {
                    end = nodeValue.length;
                    start = 0;
                }
                node = next;
                if (isLeft) {
                    start = Math.max(end - remaining, 0);
                    offset = start;
                    text = nodeValue.substr(start, end - start) + text;
                    next = node.previousSibling;
                } else {
                    end = Math.min(remaining, nodeValue.length);
                    offset = start + end;
                    text += nodeValue.substr(start, end);
                    next = node.nextSibling;
                }
            }
            return {
                node: node || next,
                offset: offset,
                text: text
            };
        };
        var RangeHelper = function(w, d) {
            var _createMarker, _isOwner, _prepareInput, doc = d || w.contentDocument || w.document, win = w, isW3C = !!w.getSelection, startMarker = "sceditor-start-marker", endMarker = "sceditor-end-marker", CHARACTER = "character", base = this;
            base.insertHTML = function(html, endHTML) {
                var node, div, range = base.selectedRange();
                if (!range) {
                    return false;
                }
                if (isW3C) {
                    if (endHTML) {
                        html += base.selectedHtml() + endHTML;
                    }
                    div = doc.createElement("p");
                    node = doc.createDocumentFragment();
                    div.innerHTML = html;
                    while (div.firstChild) {
                        node.appendChild(div.firstChild);
                    }
                    base.insertNode(node);
                } else {
                    range.pasteHTML(_prepareInput(html, endHTML, true));
                    base.restoreRange();
                }
            }
            ;
            _prepareInput = function(node, endNode, returnHtml) {
                var lastChild, $lastChild, div = doc.createElement("div"), $div = $(div);
                if (typeof node === "string") {
                    if (endNode) {
                        node += base.selectedHtml() + endNode;
                    }
                    $div.html(node);
                } else {
                    $div.append(node);
                    if (endNode) {
                        $div.append(base.selectedRange().extractContents()).append(endNode);
                    }
                }
                if (!(lastChild = div.lastChild)) {
                    return;
                }
                while (!dom.isInline(lastChild.lastChild, true)) {
                    lastChild = lastChild.lastChild;
                }
                if (dom.canHaveChildren(lastChild)) {
                    $lastChild = $(lastChild);
                    if (!lastChild.lastChild) {
                        $lastChild.append("\u200B");
                    }
                }
                if (IE_VER && IE_VER < 9 && $(lastChild).is("img")) {
                    $div.append("\u200B");
                }
                base.removeMarkers();
                ($lastChild || $div).append(_createMarker(startMarker)).append(_createMarker(endMarker));
                if (returnHtml) {
                    return $div.html();
                }
                return $(doc.createDocumentFragment()).append($div.contents())[0];
            }
            ;
            base.insertNode = function(node, endNode) {
                if (isW3C) {
                    var input = _prepareInput(node, endNode)
                      , range = base.selectedRange()
                      , parent = range.commonAncestorContainer;
                    if (!input) {
                        return false;
                    }
                    range.deleteContents();
                    if (parent && parent.nodeType !== 3 && !dom.canHaveChildren(parent)) {
                        parent.parentNode.insertBefore(input, parent);
                    } else {
                        range.insertNode(input);
                    }
                    base.restoreRange();
                } else {
                    base.insertHTML(_nodeToHtml(node), endNode ? _nodeToHtml(endNode) : null);
                }
            }
            ;
            base.cloneSelected = function() {
                var range = base.selectedRange();
                if (range) {
                    return isW3C ? range.cloneRange() : range.duplicate();
                }
            }
            ;
            base.selectedRange = function() {
                var range, firstChild, sel = isW3C ? win.getSelection() : doc.selection;
                if (!sel) {
                    return;
                }
                if (sel.getRangeAt && sel.rangeCount <= 0) {
                    firstChild = doc.body;
                    while (firstChild.firstChild) {
                        firstChild = firstChild.firstChild;
                    }
                    range = doc.createRange();
                    range.setStartBefore(firstChild);
                    sel.addRange(range);
                }
                if (isW3C && sel.rangeCount > 0) {
                    range = sel.getRangeAt(0);
                }
                if (!isW3C && sel.type !== "Control") {
                    range = sel.createRange();
                }
                return _isOwner(range) ? range : null;
            }
            ;
            _isOwner = function(range) {
                var parent;
                if (range && !isW3C) {
                    parent = range.parentElement();
                }
                return parent ? parent.ownerDocument === doc : true;
            }
            ;
            base.hasSelection = function() {
                var sel = isW3C ? win.getSelection() : doc.selection;
                if (isW3C || !sel) {
                    return sel && sel.rangeCount > 0;
                }
                return sel.type !== "None" && _isOwner(sel.createRange());
            }
            ;
            base.selectedHtml = function() {
                var div, range = base.selectedRange();
                if (range) {
                    if (isW3C) {
                        div = doc.createElement("p");
                        div.appendChild(range.cloneContents());
                        return div.innerHTML;
                    } else {
                        if (range.text !== "" && range.htmlText) {
                            return range.htmlText;
                        }
                    }
                }
                return "";
            }
            ;
            base.parentNode = function() {
                var range = base.selectedRange();
                if (range) {
                    return range.parentElement ? range.parentElement() : range.commonAncestorContainer;
                }
            }
            ;
            base.getFirstBlockParent = function(n) {
                var func = function(node) {
                    if (!dom.isInline(node, true)) {
                        return node;
                    }
                    node = node ? node.parentNode : null;
                    return node ? func(node) : node;
                };
                return func(n || base.parentNode());
            }
            ;
            base.insertNodeAt = function(start, node) {
                var currentRange = base.selectedRange()
                  , range = base.cloneSelected();
                if (!range) {
                    return false;
                }
                range.collapse(start);
                if (isW3C) {
                    range.insertNode(node);
                } else {
                    range.pasteHTML(_nodeToHtml(node));
                }
                base.selectRange(currentRange);
            }
            ;
            _createMarker = function(id) {
                base.removeMarker(id);
                var marker = doc.createElement("span");
                marker.id = id;
                marker.style.lineHeight = "0";
                marker.style.display = "none";
                marker.className = "sceditor-selection sceditor-ignore";
                marker.innerHTML = " ";
                return marker;
            }
            ;
            base.insertMarkers = function() {
                base.insertNodeAt(true, _createMarker(startMarker));
                base.insertNodeAt(false, _createMarker(endMarker));
            }
            ;
            base.getMarker = function(id) {
                return doc.getElementById(id);
            }
            ;
            base.removeMarker = function(id) {
                var marker = base.getMarker(id);
                if (marker) {
                    marker.parentNode.removeChild(marker);
                }
            }
            ;
            base.removeMarkers = function() {
                base.removeMarker(startMarker);
                base.removeMarker(endMarker);
            }
            ;
            base.saveRange = function() {
                base.insertMarkers();
            }
            ;
            base.selectRange = function(range) {
                if (isW3C) {
                    var lastChild;
                    var sel = win.getSelection();
                    var container = range.endContainer;
                    if (!IE_BR_FIX && range.collapsed && container && !dom.isInline(container, true)) {
                        lastChild = container.lastChild;
                        while (lastChild && $(lastChild).is(".sceditor-ignore")) {
                            lastChild = lastChild.previousSibling;
                        }
                        if ($(lastChild).is("br")) {
                            var rng = doc.createRange();
                            rng.setEndAfter(lastChild);
                            rng.collapse(false);
                            if (base.compare(range, rng)) {
                                range.setStartBefore(lastChild);
                                range.collapse(true);
                            }
                        }
                    }
                    if (sel) {
                        base.clear();
                        sel.addRange(range);
                    }
                } else {
                    range.select();
                }
            }
            ;
            base.restoreRange = function() {
                var marker, isCollapsed, previousSibling, range = base.selectedRange(), start = base.getMarker(startMarker), end = base.getMarker(endMarker);
                if (!start || !end || !range) {
                    return false;
                }
                isCollapsed = start.nextSibling === end;
                if (!isW3C) {
                    range = doc.body.createTextRange();
                    marker = doc.body.createTextRange();
                    previousSibling = start.previousSibling;
                    if (start.nextSibling === end && (!previousSibling || !dom.isInline(previousSibling, true) || $(previousSibling).is("br"))) {
                        $(start).before("\u200B");
                    }
                    marker.moveToElementText(start);
                    range.setEndPoint("StartToStart", marker);
                    range.moveStart(CHARACTER, 0);
                    marker.moveToElementText(end);
                    range.setEndPoint("EndToStart", marker);
                    range.moveEnd(CHARACTER, 0);
                } else {
                    range = doc.createRange();
                    range.setStartBefore(start);
                    range.setEndAfter(end);
                }
                if (isCollapsed) {
                    range.collapse(true);
                }
                base.selectRange(range);
                base.removeMarkers();
            }
            ;
            base.selectOuterText = function(left, right) {
                var start, end, range = base.cloneSelected();
                if (!range) {
                    return false;
                }
                range.collapse(false);
                if (!isW3C) {
                    range.moveStart(CHARACTER, 0 - left);
                    range.moveEnd(CHARACTER, right);
                } else {
                    start = outerText(range, true, left);
                    end = outerText(range, false, right);
                    range.setStart(start.node, start.offset);
                    range.setEnd(end.node, end.offset);
                }
                base.selectRange(range);
            }
            ;
            base.getOuterText = function(before, length) {
                var range = base.cloneSelected();
                if (!range) {
                    return "";
                }
                range.collapse(!before);
                if (!isW3C) {
                    if (before) {
                        range.moveStart(CHARACTER, 0 - length);
                    } else {
                        range.moveEnd(CHARACTER, length);
                    }
                    return range.text;
                }
                return outerText(range, before, length).text;
            }
            ;
            base.replaceKeyword = function(keywords, includeAfter, keywordsSorted, longestKeyword, requireWhitespace, keypressChar) {
                if (!keywordsSorted) {
                    keywords.sort(function(a, b) {
                        return a[0].length - b[0].length;
                    });
                }
                var outerText, matchPos, startIndex, leftLen, charsLeft, keyword, keywordLen, whitespaceRegex = "[\\s\xA0\u2002\u2003\u2009]", keywordIdx = keywords.length, whitespaceLen = requireWhitespace ? 1 : 0, maxKeyLen = longestKeyword || keywords[keywordIdx - 1][0].length;
                if (requireWhitespace) {
                    if (!isW3C) {
                        return false;
                    }
                    maxKeyLen++;
                }
                keypressChar = keypressChar || "";
                outerText = base.getOuterText(true, maxKeyLen);
                leftLen = outerText.length;
                outerText += keypressChar;
                if (includeAfter) {
                    outerText += base.getOuterText(false, maxKeyLen);
                }
                while (keywordIdx--) {
                    keyword = keywords[keywordIdx][0];
                    keywordLen = keyword.length;
                    startIndex = Math.max(0, leftLen - keywordLen - whitespaceLen);
                    if (requireWhitespace) {
                        matchPos = outerText.substr(startIndex).search(new RegExp("(?:" + whitespaceRegex + ")" + escape.regex(keyword) + "(?=" + whitespaceRegex + ")"));
                    } else {
                        matchPos = outerText.indexOf(keyword, startIndex);
                    }
                    if (matchPos > -1) {
                        if (requireWhitespace) {
                            matchPos += startIndex + 1;
                        }
                        if (matchPos <= leftLen && matchPos + keywordLen + whitespaceLen >= leftLen) {
                            charsLeft = leftLen - matchPos;
                            base.selectOuterText(charsLeft, keywordLen - charsLeft - (/^\S/.test(keypressChar) ? 1 : 0));
                            base.insertHTML(keywords[keywordIdx][1]);
                            return true;
                        }
                    }
                }
                return false;
            }
            ;
            base.compare = function(rangeA, rangeB) {
                var END_TO_END = isW3C ? Range.END_TO_END : "EndToEnd"
                  , START_TO_START = isW3C ? Range.START_TO_START : "StartToStart"
                  , comparePoints = isW3C ? "compareBoundaryPoints" : "compareEndPoints";
                if (!rangeB) {
                    rangeB = base.selectedRange();
                }
                if (!rangeA || !rangeB) {
                    return !rangeA && !rangeB;
                }
                return _isOwner(rangeA) && _isOwner(rangeB) && rangeA[comparePoints](END_TO_END, rangeB) === 0 && rangeA[comparePoints](START_TO_START, rangeB) === 0;
            }
            ;
            base.clear = function() {
                var sel = isW3C ? win.getSelection() : doc.selection;
                if (sel) {
                    if (sel.removeAllRanges) {
                        sel.removeAllRanges();
                    } else {
                        if (sel.empty) {
                            sel.empty();
                        }
                    }
                }
            }
            ;
        };
        return RangeHelper;
    }
    .call(exports, __webpack_require__, exports, module),
    __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}
, function(module, exports, __webpack_require__) {
    var __WEBPACK_AMD_DEFINE_RESULT__;
    !(__WEBPACK_AMD_DEFINE_RESULT__ = function(require) {
        var $ = __webpack_require__(1);
        var browser = __webpack_require__(6);
        var _propertyNameCache = {};
        var dom = {
            traverse: function(node, func, innermostFirst, siblingsOnly, reverse) {
                if (node) {
                    node = reverse ? node.lastChild : node.firstChild;
                    while (node) {
                        var next = reverse ? node.previousSibling : node.nextSibling;
                        if ((!innermostFirst && func(node) === false) || (!siblingsOnly && dom.traverse(node, func, innermostFirst, siblingsOnly, reverse) === false) || (innermostFirst && func(node) === false)) {
                            return false;
                        }
                        node = next;
                    }
                }
            },
            rTraverse: function(node, func, innermostFirst, siblingsOnly) {
                this.traverse(node, func, innermostFirst, siblingsOnly, true);
            },
            parseHTML: function(html, context) {
                var ret = []
                  , tmp = (context || document).createElement("div");
                tmp.innerHTML = html;
                $.merge(ret, tmp.childNodes);
                return ret;
            },
            hasStyling: function(elm) {
                var $elm = $(elm);
                return elm && (!$elm.is("p,div") || elm.className || $elm.attr("style") || !$.isEmptyObject($elm.data()));
            },
            convertElement: function(oldElm, toTagName) {
                var child, attr, oldAttrs = oldElm.attributes, attrsIdx = oldAttrs.length, newElm = oldElm.ownerDocument.createElement(toTagName);
                while (attrsIdx--) {
                    attr = oldAttrs[attrsIdx];
                    if (!browser.ie || attr.specified) {
                        if (browser.ie < 8 && /style/i.test(attr.name)) {
                            dom.copyCSS(oldElm, newElm);
                        } else {
                            try {
                                newElm.setAttribute(attr.name, attr.value);
                            } catch (ex) {}
                        }
                    }
                }
                while ((child = oldElm.firstChild)) {
                    newElm.appendChild(child);
                }
                oldElm.parentNode.replaceChild(newElm, oldElm);
                return newElm;
            },
            blockLevelList: "|body|hr|p|div|h1|h2|h3|h4|h5|h6|address|pre|form|" + "table|tbody|thead|tfoot|th|tr|td|li|ol|ul|blockquote|center|",
            canHaveChildren: function(node) {
                if (!/11?|9/.test(node.nodeType)) {
                    return false;
                }
                return ("|iframe|area|base|basefont|br|col|frame|hr|img|input|wbr" + "|isindex|link|meta|param|command|embed|keygen|source|track|" + "object|").indexOf("|" + node.nodeName.toLowerCase() + "|") < 0;
            },
            isInline: function(elm, includeCodeAsBlock) {
                var tagName, nodeType = (elm || {}).nodeType || 3;
                if (nodeType !== 1) {
                    return nodeType === 3;
                }
                tagName = elm.tagName.toLowerCase();
                if (tagName === "code") {
                    return !includeCodeAsBlock;
                }
                return dom.blockLevelList.indexOf("|" + tagName + "|") < 0;
            },
            copyCSS: function(from, to) {
                to.style.cssText = from.style.cssText + to.style.cssText;
            },
            fixNesting: function(node) {
                var getLastInlineParent = function(node) {
                    while (dom.isInline(node.parentNode, true)) {
                        node = node.parentNode;
                    }
                    return node;
                };
                dom.traverse(node, function(node) {
                    if (node.nodeType === 1 && !dom.isInline(node, true) && dom.isInline(node.parentNode, true)) {
                        var parent = getLastInlineParent(node)
                          , rParent = parent.parentNode
                          , before = dom.extractContents(parent, node)
                          , middle = node;
                        dom.copyCSS(parent, middle);
                        rParent.insertBefore(before, parent);
                        rParent.insertBefore(middle, parent);
                    }
                });
            },
            findCommonAncestor: function(node1, node2) {
                return $(node1).parents().has($(node2)).first();
            },
            getSibling: function(node, previous) {
                if (!node) {
                    return null;
                }
                return (previous ? node.previousSibling : node.nextSibling) || dom.getSibling(node.parentNode, previous);
            },
            removeWhiteSpace: function(root, preserveNewLines) {
                var nodeValue, nodeType, next, previous, previousSibling, cssWhiteSpace, nextNode, trimStart, getSibling = dom.getSibling, isInline = dom.isInline, node = root.firstChild;
                while (node) {
                    nextNode = node.nextSibling;
                    nodeValue = node.nodeValue;
                    nodeType = node.nodeType;
                    if (nodeType === 1 && node.firstChild) {
                        cssWhiteSpace = $(node).css("whiteSpace");
                        if (!/pre(\-wrap)?$/i.test(cssWhiteSpace)) {
                            dom.removeWhiteSpace(node, /line$/i.test(cssWhiteSpace));
                        }
                    }
                    if (nodeType === 3 && nodeValue) {
                        next = getSibling(node);
                        previous = getSibling(node, true);
                        trimStart = false;
                        while ($(previous).hasClass("sceditor-ignore")) {
                            previous = getSibling(previous, true);
                        }
                        if (isInline(node) && previous) {
                            previousSibling = previous;
                            while (previousSibling.lastChild) {
                                previousSibling = previousSibling.lastChild;
                            }
                            trimStart = previousSibling.nodeType === 3 ? /[\t\n\r ]$/.test(previousSibling.nodeValue) : !isInline(previousSibling);
                        }
                        nodeValue = nodeValue.replace(/\u200B/g, "");
                        if (!previous || !isInline(previous) || trimStart) {
                            nodeValue = nodeValue.replace(preserveNewLines ? /^[\t ]+/ : /^[\t\n\r ]+/, "");
                        }
                        if (!next || !isInline(next)) {
                            nodeValue = nodeValue.replace(preserveNewLines ? /[\t ]+$/ : /[\t\n\r ]+$/, "");
                        }
                        if (!nodeValue.length) {
                            root.removeChild(node);
                        } else {
                            node.nodeValue = nodeValue.replace(preserveNewLines ? /[\t ]+/g : /[\t\n\r ]+/g, " ");
                        }
                    }
                    node = nextNode;
                }
            },
            extractContents: function(startNode, endNode) {
                var extract, commonAncestor = dom.findCommonAncestor(startNode, endNode).get(0), startReached = false, endReached = false;
                extract = function(root) {
                    var clone, docFrag = startNode.ownerDocument.createDocumentFragment();
                    dom.traverse(root, function(node) {
                        if (endReached || node === endNode) {
                            endReached = true;
                            return false;
                        }
                        if (node === startNode) {
                            startReached = true;
                        }
                        if ($.contains(node, startNode) || (startReached && $.contains(node, endNode))) {
                            clone = node.cloneNode(false);
                            clone.appendChild(extract(node));
                            docFrag.appendChild(clone);
                        } else {
                            if (startReached && !$.contains(docFrag, node)) {
                                docFrag.appendChild(node);
                            }
                        }
                    }, false);
                    return docFrag;
                }
                ;
                return extract(commonAncestor);
            },
            getOffset: function(obj) {
                var pLeft = 0
                  , pTop = 0;
                while (obj) {
                    pLeft += obj.offsetLeft;
                    pTop += obj.offsetTop;
                    obj = obj.offsetParent;
                }
                return {
                    left: pLeft,
                    top: pTop
                };
            },
            getStyle: function(elm, property) {
                var $elm, direction, styleValue, elmStyle = elm.style;
                if (!elmStyle) {
                    return "";
                }
                if (!_propertyNameCache[property]) {
                    _propertyNameCache[property] = $.camelCase(property);
                }
                property = _propertyNameCache[property];
                styleValue = elmStyle[property];
                if ("textAlign" === property) {
                    $elm = $(elm);
                    direction = elmStyle.direction;
                    styleValue = styleValue || $elm.css(property);
                    if ($elm.parent().css(property) === styleValue || $elm.css("display") !== "block" || $elm.is("hr") || $elm.is("th")) {
                        return "";
                    }
                    if ((/right/i.test(styleValue) && direction === "rtl") || (/left/i.test(styleValue) && direction === "ltr")) {
                        return "";
                    }
                }
                return styleValue;
            },
            hasStyle: function(elm, property, values) {
                var styleValue = dom.getStyle(elm, property);
                if (!styleValue) {
                    return false;
                }
                return !values || styleValue === values || ($.isArray(values) && $.inArray(styleValue, values) > -1);
            }
        };
        return dom;
    }
    .call(exports, __webpack_require__, exports, module),
    __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}
, function(module, exports, __webpack_require__) {
    var __WEBPACK_AMD_DEFINE_RESULT__;
    !(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports) {
        var $ = __webpack_require__(1);
        var USER_AGENT = navigator.userAgent;
        exports.ie = (function() {
            var undef, v = 3, doc = document, div = doc.createElement("div"), all = div.getElementsByTagName("i");
            do {
                div.innerHTML = "<!--[if gt IE " + (++v) + "]><i></i><![endif]-->";
            } while (all[0]);
            if ((doc.documentMode && doc.all && window.atob)) {
                v = 10;
            }
            if (v === 4 && doc.documentMode) {
                v = 11;
            }
            return v > 4 ? v : undef;
        }());
        exports.ios = /iPhone|iPod|iPad| wosbrowser\//i.test(USER_AGENT);
        exports.isWysiwygSupported = (function() {
            var match, isUnsupported, undef, editableAttr = $('<p contenteditable="true">')[0].contentEditable;
            if (editableAttr === undef || editableAttr === "inherit") {
                return false;
            }
            isUnsupported = /Opera Mobi|Opera Mini/i.test(USER_AGENT);
            if (/Android/i.test(USER_AGENT)) {
                isUnsupported = true;
                if (/Safari/.test(USER_AGENT)) {
                    match = /Safari\/(\d+)/.exec(USER_AGENT);
                    isUnsupported = (!match || !match[1] ? true : match[1] < 534);
                }
            }
            if (/ Silk\//i.test(USER_AGENT)) {
                match = /AppleWebKit\/(\d+)/.exec(USER_AGENT);
                isUnsupported = (!match || !match[1] ? true : match[1] < 534);
            }
            if (exports.ios) {
                isUnsupported = /OS [0-4](_\d)+ like Mac/i.test(USER_AGENT);
            }
            if (/Firefox/i.test(USER_AGENT)) {
                isUnsupported = false;
            }
            if (/OneBrowser/i.test(USER_AGENT)) {
                isUnsupported = false;
            }
            if (navigator.vendor === "UCWEB") {
                isUnsupported = false;
            }
            return !isUnsupported;
        }());
    }
    .call(exports, __webpack_require__, exports, module),
    __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}
, function(module, exports, __webpack_require__) {
    var __WEBPACK_AMD_DEFINE_RESULT__;
    !(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports) {
        var VALID_SCHEME_REGEX = /^(?:https?|s?ftp|mailto|spotify|skype|ssh|teamspeak|tel):|(?:\/\/)/i;
        exports.regex = function(str) {
            return str.replace(/([\-.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        }
        ;
        exports.entities = function(str, noQuotes) {
            if (!str) {
                return str;
            }
            var replacements = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                "  ": " &nbsp;",
                "\r\n": "\n",
                "\r": "\n",
                "\n": "<br />"
            };
            if (noQuotes !== false) {
                replacements['"'] = "&#34;";
                replacements["'"] = "&#39;";
                replacements["`"] = "&#96;";
            }
            str = str.replace(/ {2}|\r\n|[&<>\r\n'"`]/g, function(match) {
                return replacements[match] || match;
            });
            return str;
        }
        ;
        exports.uriScheme = function(url) {
            var path, hasScheme = /^[^\/]*:/i, location = window.location;
            if ((!url || !hasScheme.test(url)) || VALID_SCHEME_REGEX.test(url)) {
                return url;
            }
            path = location.pathname.split("/");
            path.pop();
            return location.protocol + "//" + location.host + path.join("/") + "/" + url;
        }
        ;
    }
    .call(exports, __webpack_require__, exports, module),
    __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}
, function(module, exports, __webpack_require__) {
    var __WEBPACK_AMD_DEFINE_RESULT__;
    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
        var _templates = {
            html: "<!DOCTYPE html>" + "<html{attrs}>" + "<head>" + "<style>.ie * {min-height: auto !important} " + ".ie table td {height:15px} " + "@supports (-ms-ime-align:auto) { " + "* { min-height: auto !important; } " + "}" + "</style>" + '<meta http-equiv="Content-Type" ' + 'content="text/html;charset={charset}" />' + '<link rel="stylesheet" type="text/css" href="{style}" />' + "</head>" + '<body contenteditable="true" {spellcheck}><p></p></body>' + "</html>",
            toolbarButton: '<a class="sceditor-button sceditor-button-{name}" ' + 'data-sceditor-command="{name}" unselectable="on">' + '<div unselectable="on">{dispName}</div></a>',
            emoticon: '<img src="{url}" data-sceditor-emoticon="{key}" ' + 'alt="{key}" title="{tooltip}" />',
            fontOpt: '<a class="sceditor-font-option" href="#" ' + 'data-font="{font}"><font face="{font}">{font}</font></a>',
            sizeOpt: '<a class="sceditor-fontsize-option" data-size="{size}" ' + 'href="#"><font size="{size}">{size}</font></a>',
            pastetext: '<div><label for="txt">{label}</label> ' + '<textarea cols="20" rows="7" id="txt"></textarea></div>' + '<div><input type="button" class="button" value="{insert}" />' + "</div>",
            table: '<div><label for="rows">{rows}</label><input type="text" ' + 'id="rows" value="2" /></div>' + '<div><label for="cols">{cols}</label><input type="text" ' + 'id="cols" value="2" /></div>' + '<div><input type="button" class="button" value="{insert}"' + " /></div>",
            image: '<div><label for="link">{url}</label> ' + '<input type="text" id="image" placeholder="http://" /></div>' + '<div><label for="width">{width}</label> ' + '<input type="text" id="width" size="2" /></div>' + '<div><label for="height">{height}</label> ' + '<input type="text" id="height" size="2" /></div>' + '<div><input type="button" class="button" value="{insert}" />' + "</div>",
            email: '<div><label for="email">{label}</label> ' + '<input type="text" id="email" /></div>' + '<div><label for="des">{desc}</label> ' + '<input type="text" id="des" /></div>' + '<div><input type="button" class="button" value="{insert}" />' + "</div>",
            link: '<div><label for="link">{url}</label> ' + '<input type="text" id="link" placeholder="http://" /></div>' + '<div><label for="des">{desc}</label> ' + '<input type="text" id="des" /></div>' + '<div><input type="button" class="button" value="{ins}" /></div>',
            youtubeMenu: '<div><label for="link">{label}</label> ' + '<input type="text" id="link" placeholder="https://" /></div>' + '<div><input type="button" class="button" value="{insert}" />' + "</div>",
            youtube: '<iframe width="560" height="315" ' + 'src="https://www.youtube.com/embed/{id}?wmode=opaque" ' + 'data-youtube-id="{id}" frameborder="0" allowfullscreen></iframe>'
        };
        return function(name, params, createHtml) {
            var template = _templates[name];
            $.each(params, function(name, val) {
                template = template.replace(new RegExp("\\{" + name + "\\}","g"), val);
            });
            if (createHtml) {
                template = $(template);
            }
            return template;
        }
        ;
    }
    .call(exports, __webpack_require__, exports, module),
    __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}
, function(module, exports, __webpack_require__) {
    var __WEBPACK_AMD_DEFINE_RESULT__;
    !(__WEBPACK_AMD_DEFINE_RESULT__ = function(require) {
        var $ = __webpack_require__(1);
        var IE_VER = __webpack_require__(6).ie;
        var _tmpl = __webpack_require__(8);
        var IE_BR_FIX = IE_VER && IE_VER < 11;
        var defaultCommnds = {
            bold: {
                exec: "bold",
                tooltip: "Bold",
                shortcut: "Ctrl+B"
            },
            italic: {
                exec: "italic",
                tooltip: "Italic",
                shortcut: "Ctrl+I"
            },
            underline: {
                exec: "underline",
                tooltip: "Underline",
                shortcut: "Ctrl+U"
            },
            strike: {
                exec: "strikethrough",
                tooltip: "Strikethrough"
            },
            subscript: {
                exec: "subscript",
                tooltip: "Subscript"
            },
            superscript: {
                exec: "superscript",
                tooltip: "Superscript"
            },
            left: {
                exec: "justifyleft",
                tooltip: "Align left"
            },
            center: {
                exec: "justifycenter",
                tooltip: "Center"
            },
            right: {
                exec: "justifyright",
                tooltip: "Align right"
            },
            justify: {
                exec: "justifyfull",
                tooltip: "Justify"
            },
            font: {
                _dropDown: function(editor, caller, callback) {
                    var fontIdx = 0
                      , fonts = editor.opts.fonts.split(",")
                      , content = $("<div />")
                      , clickFunc = function() {
                        callback($(this).data("font"));
                        editor.closeDropDown(true);
                        return false;
                    };
                    for (; fontIdx < fonts.length; fontIdx++) {
                        content.append(_tmpl("fontOpt", {
                            font: fonts[fontIdx]
                        }, true).click(clickFunc));
                    }
                    editor.createDropDown(caller, "font-picker", content);
                },
                exec: function(caller) {
                    var editor = this;
                    defaultCommnds.font._dropDown(editor, caller, function(fontName) {
                        editor.execCommand("fontname", fontName);
                    });
                },
                tooltip: "Font Name"
            },
            size: {
                _dropDown: function(editor, caller, callback) {
                    var content = $("<div />")
                      , clickFunc = function(e) {
                        callback($(this).data("size"));
                        editor.closeDropDown(true);
                        e.preventDefault();
                    };
                    for (var i = 1; i <= 7; i++) {
                        content.append(_tmpl("sizeOpt", {
                            size: i
                        }, true).click(clickFunc));
                    }
                    editor.createDropDown(caller, "fontsize-picker", content);
                },
                exec: function(caller) {
                    var editor = this;
                    defaultCommnds.size._dropDown(editor, caller, function(fontSize) {
                        editor.execCommand("fontsize", fontSize);
                    });
                },
                tooltip: "Font Size"
            },
            color: {
                _dropDown: function(editor, caller, callback) {
                    var i, x, color, colors, genColor = {
                        r: 255,
                        g: 255,
                        b: 255
                    }, content = $("<div />"), colorColumns = editor.opts.colors ? editor.opts.colors.split("|") : new Array(21), html = [], cmd = defaultCommnds.color;
                    if (!cmd._htmlCache) {
                        for (i = 0; i < colorColumns.length; ++i) {
                            colors = colorColumns[i] ? colorColumns[i].split(",") : new Array(21);
                            html.push('<div class="sceditor-color-column">');
                            for (x = 0; x < colors.length; ++x) {
                                color = colors[x] || "#" + genColor.r.toString(16) + genColor.g.toString(16) + genColor.b.toString(16);
                                html.push('<a href="#" class="sceditor-color-option"' + ' style="background-color: ' + color + '"' + ' data-color="' + color + '"></a>');
                                if (x % 5 === 0) {
                                    genColor.g -= 51;
                                    genColor.b = 255;
                                } else {
                                    genColor.b -= 51;
                                }
                            }
                            html.push("</div>");
                            if (i % 5 === 0) {
                                genColor.r -= 51;
                                genColor.g = 255;
                                genColor.b = 255;
                            } else {
                                genColor.g = 255;
                                genColor.b = 255;
                            }
                        }
                        cmd._htmlCache = html.join("");
                    }
                    content.append(cmd._htmlCache).find("a").click(function(e) {
                        callback($(this).attr("data-color"));
                        editor.closeDropDown(true);
                        e.preventDefault();
                    });
                    editor.createDropDown(caller, "color-picker", content);
                },
                exec: function(caller) {
                    var editor = this;
                    defaultCommnds.color._dropDown(editor, caller, function(color) {
                        editor.execCommand("forecolor", color);
                    });
                },
                tooltip: "Font Color"
            },
            removeformat: {
                exec: "removeformat",
                tooltip: "Remove Formatting"
            },
            cut: {
                exec: "cut",
                tooltip: "Cut",
                errorMessage: "Your browser does not allow the cut command. " + "Please use the keyboard shortcut Ctrl/Cmd-X"
            },
            copy: {
                exec: "copy",
                tooltip: "Copy",
                errorMessage: "Your browser does not allow the copy command. " + "Please use the keyboard shortcut Ctrl/Cmd-C"
            },
            paste: {
                exec: "paste",
                tooltip: "Paste",
                errorMessage: "Your browser does not allow the paste command. " + "Please use the keyboard shortcut Ctrl/Cmd-V"
            },
            pastetext: {
                exec: function(caller) {
                    var val, content, editor = this;
                    content = _tmpl("pastetext", {
                        label: editor._("Paste your text inside the following box:"),
                        insert: editor._("Insert")
                    }, true);
                    content.find(".button").click(function(e) {
                        val = content.find("#txt").val();
                        if (val) {
                            editor.wysiwygEditorInsertText(val);
                        }
                        editor.closeDropDown(true);
                        e.preventDefault();
                    });
                    editor.createDropDown(caller, "pastetext", content);
                },
                tooltip: "Paste Text"
            },
            bulletlist: {
                exec: "insertunorderedlist",
                tooltip: "Bullet list"
            },
            orderedlist: {
                exec: "insertorderedlist",
                tooltip: "Numbered list"
            },
            indent: {
                state: function(parents, firstBlock) {
                    var range, startParent, endParent, $firstBlock = $(firstBlock), parentLists = $firstBlock.parents("ul,ol,menu"), parentList = parentLists.first();
                    if (parentLists.length > 1 || parentList.children().length > 1) {
                        return 0;
                    }
                    if ($firstBlock.is("ul,ol,menu")) {
                        range = this.getRangeHelper().selectedRange();
                        if (window.Range && range instanceof Range) {
                            startParent = range.startContainer.parentNode;
                            endParent = range.endContainer.parentNode;
                            if (startParent !== startParent.parentNode.firstElementChild || ($(endParent).is("li") && endParent !== endParent.parentNode.lastElementChild)) {
                                return 0;
                            }
                        } else {
                            return $firstBlock.is("li,ul,ol,menu") ? 0 : -1;
                        }
                    }
                    return -1;
                },
                exec: function() {
                    var editor = this
                      , $elm = $(editor.getRangeHelper().getFirstBlockParent());
                    editor.focus();
                    if ($elm.parents("ul,ol,menu")) {
                        editor.execCommand("indent");
                    }
                },
                tooltip: "Add indent"
            },
            outdent: {
                state: function(parents, firstBlock) {
                    return $(firstBlock).is("ul,ol,menu") || $(firstBlock).parents("ul,ol,menu").length > 0 ? 0 : -1;
                },
                exec: function() {
                    var editor = this
                      , $elm = $(editor.getRangeHelper().getFirstBlockParent());
                    if ($elm.parents("ul,ol,menu")) {
                        editor.execCommand("outdent");
                    }
                },
                tooltip: "Remove one indent"
            },
            table: {
                forceNewLineAfter: ["table"],
                exec: function(caller) {
                    var editor = this
                      , content = _tmpl("table", {
                        rows: editor._("Rows:"),
                        cols: editor._("Cols:"),
                        insert: editor._("Insert")
                    }, true);
                    content.find(".button").click(function(e) {
                        var row, col, rows = content.find("#rows").val() - 0, cols = content.find("#cols").val() - 0, html = "<table>";
                        if (rows < 1 || cols < 1) {
                            return;
                        }
                        for (row = 0; row < rows; row++) {
                            html += "<tr>";
                            for (col = 0; col < cols; col++) {
                                html += "<td>" + (IE_BR_FIX ? "" : "<br />") + "</td>";
                            }
                            html += "</tr>";
                        }
                        html += "</table>";
                        editor.wysiwygEditorInsertHtml(html);
                        editor.closeDropDown(true);
                        e.preventDefault();
                    });
                    editor.createDropDown(caller, "inserttable", content);
                },
                tooltip: "Insert a table"
            },
            horizontalrule: {
                exec: "inserthorizontalrule",
                tooltip: "Insert a horizontal rule"
            },
            code: {
                forceNewLineAfter: ["code"],
                exec: function() {
                    this.wysiwygEditorInsertHtml("<code>", (IE_BR_FIX ? "" : "<br />") + "</code>");
                },
                tooltip: "Code"
            },
            image: {
                exec: function(caller) {
                    var editor = this
                      , content = _tmpl("image", {
                        url: editor._("URL:"),
                        width: editor._("Width (optional):"),
                        height: editor._("Height (optional):"),
                        insert: editor._("Insert")
                    }, true);
                    content.find(".button").click(function(e) {
                        var val = content.find("#image").val()
                          , width = content.find("#width").val()
                          , height = content.find("#height").val()
                          , attrs = "";
                        if (width) {
                            attrs += ' width="' + width + '"';
                        }
                        if (height) {
                            attrs += ' height="' + height + '"';
                        }
                        if (val) {
                            editor.wysiwygEditorInsertHtml("<img" + attrs + ' src="' + val + '" />');
                        }
                        editor.closeDropDown(true);
                        e.preventDefault();
                    });
                    editor.createDropDown(caller, "insertimage", content);
                },
                tooltip: "Insert an image"
            },
            email: {
                exec: function(caller) {
                    var editor = this
                      , content = _tmpl("email", {
                        label: editor._("E-mail:"),
                        desc: editor._("Description (optional):"),
                        insert: editor._("Insert")
                    }, true);
                    content.find(".button").click(function(e) {
                        var val = content.find("#email").val()
                          , description = content.find("#des").val();
                        if (val) {
                            editor.focus();
                            if (!editor.getRangeHelper().selectedHtml() || description) {
                                description = description || val;
                                editor.wysiwygEditorInsertHtml('<a href="' + "mailto:" + val + '">' + description + "</a>");
                            } else {
                                editor.execCommand("createlink", "mailto:" + val);
                            }
                        }
                        editor.closeDropDown(true);
                        e.preventDefault();
                    });
                    editor.createDropDown(caller, "insertemail", content);
                },
                tooltip: "Insert an email"
            },
            link: {
                exec: function(caller) {
                    var editor = this
                      , content = _tmpl("link", {
                        url: editor._("URL:"),
                        desc: editor._("Description (optional):"),
                        ins: editor._("Insert")
                    }, true);
                    content.find(".button").click(function(e) {
                        var val = content.find("#link").val()
                          , description = content.find("#des").val();
                        if (val) {
                            editor.focus();
                            if (!editor.getRangeHelper().selectedHtml() || description) {
                                description = description || val;
                                editor.wysiwygEditorInsertHtml('<a href="' + val + '">' + description + "</a>");
                            } else {
                                editor.execCommand("createlink", val);
                            }
                        }
                        editor.closeDropDown(true);
                        e.preventDefault();
                    });
                    editor.createDropDown(caller, "insertlink", content);
                },
                tooltip: "Insert a link"
            },
            unlink: {
                state: function() {
                    var $current = $(this.currentNode());
                    return $current.is("a") || $current.parents("a").length > 0 ? 0 : -1;
                },
                exec: function() {
                    var $current = $(this.currentNode())
                      , $anchor = $current.is("a") ? $current : $current.parents("a").first();
                    if ($anchor.length) {
                        $anchor.replaceWith($anchor.contents());
                    }
                },
                tooltip: "Unlink"
            },
            quote: {
                forceNewLineAfter: ["blockquote"],
                exec: function(caller, html, author) {
                    var before = "<blockquote>"
                      , end = "</blockquote>";
                    if (html) {
                        author = (author ? "<cite>" + author + "</cite>" : "");
                        before = before + author + html + end;
                        end = null;
                    } else {
                        if (this.getRangeHelper().selectedHtml() === "") {
                            end = (IE_BR_FIX ? "" : "<br />") + end;
                        }
                    }
                    this.wysiwygEditorInsertHtml(before, end);
                },
                tooltip: "Insert a Quote"
            },
            emoticon: {
                exec: function(caller) {
                    var editor = this;
                    var createContent = function(includeMore) {
                        var $moreLink, emoticonsCompat = editor.opts.emoticonsCompat, rangeHelper = editor.getRangeHelper(), startSpace = emoticonsCompat && rangeHelper.getOuterText(true, 1) !== " " ? " " : "", endSpace = emoticonsCompat && rangeHelper.getOuterText(false, 1) !== " " ? " " : "", $content = $("<div />"), $line = $("<div />").appendTo($content), perLine = 0, emoticons = $.extend({}, editor.opts.emoticons.dropdown, includeMore ? editor.opts.emoticons.more : {});
                        $.each(emoticons, function() {
                            perLine++;
                        });
                        perLine = Math.sqrt(perLine);
                        $.each(emoticons, function(code, emoticon) {
                            $line.append($("<img />").attr({
                                src: emoticon.url || emoticon,
                                alt: code,
                                title: emoticon.tooltip || code
                            }).click(function() {
                                editor.insert(startSpace + $(this).attr("alt") + endSpace, null, false).closeDropDown(true);
                                return false;
                            }));
                            if ($line.children().length >= perLine) {
                                $line = $("<div />").appendTo($content);
                            }
                        });
                        if (!includeMore && editor.opts.emoticons.more) {
                            $moreLink = $('<a class="sceditor-more">' + editor._("More") + "</a>").click(function() {
                                editor.createDropDown(caller, "more-emoticons", createContent(true));
                                return false;
                            });
                            $content.append($moreLink);
                        }
                        return $content;
                    };
                    editor.createDropDown(caller, "emoticons", createContent(false));
                },
                txtExec: function(caller) {
                    defaultCommnds.emoticon.exec.call(this, caller);
                },
                tooltip: "Insert an emoticon"
            },
            youtube: {
                _dropDown: function(editor, caller, handleIdFunc) {
                    var matches, content = _tmpl("youtubeMenu", {
                        label: editor._("Video URL:"),
                        insert: editor._("Insert")
                    }, true);
                    content.find(".button").click(function(e) {
                        var val = content.find("#link").val();
                        if (val) {
                            matches = val.match(/(?:v=|v\/|embed\/|youtu.be\/)(.{11})/);
                            if (matches) {
                                val = matches[1];
                            }
                            if (/^[a-zA-Z0-9_\-]{11}$/.test(val)) {
                                handleIdFunc(val);
                            } else {
                                alert("Invalid YouTube video");
                            }
                        }
                        editor.closeDropDown(true);
                        e.preventDefault();
                    });
                    editor.createDropDown(caller, "insertlink", content);
                },
                exec: function(caller) {
                    var editor = this;
                    defaultCommnds.youtube._dropDown(editor, caller, function(id) {
                        editor.wysiwygEditorInsertHtml(_tmpl("youtube", {
                            id: id
                        }));
                    });
                },
                tooltip: "Insert a YouTube video"
            },
            date: {
                _date: function(editor) {
                    var now = new Date()
                      , year = now.getYear()
                      , month = now.getMonth() + 1
                      , day = now.getDate();
                    if (year < 2000) {
                        year = 1900 + year;
                    }
                    if (month < 10) {
                        month = "0" + month;
                    }
                    if (day < 10) {
                        day = "0" + day;
                    }
                    return editor.opts.dateFormat.replace(/year/i, year).replace(/month/i, month).replace(/day/i, day);
                },
                exec: function() {
                    this.insertText(defaultCommnds.date._date(this));
                },
                txtExec: function() {
                    this.insertText(defaultCommnds.date._date(this));
                },
                tooltip: "Insert current date"
            },
            time: {
                _time: function() {
                    var now = new Date()
                      , hours = now.getHours()
                      , mins = now.getMinutes()
                      , secs = now.getSeconds();
                    if (hours < 10) {
                        hours = "0" + hours;
                    }
                    if (mins < 10) {
                        mins = "0" + mins;
                    }
                    if (secs < 10) {
                        secs = "0" + secs;
                    }
                    return hours + ":" + mins + ":" + secs;
                },
                exec: function() {
                    this.insertText(defaultCommnds.time._time());
                },
                txtExec: function() {
                    this.insertText(defaultCommnds.time._time());
                },
                tooltip: "Insert current time"
            },
            ltr: {
                state: function(parents, firstBlock) {
                    return firstBlock && firstBlock.style.direction === "ltr";
                },
                exec: function() {
                    var editor = this
                      , elm = editor.getRangeHelper().getFirstBlockParent()
                      , $elm = $(elm);
                    editor.focus();
                    if (!elm || $elm.is("body")) {
                        editor.execCommand("formatBlock", "p");
                        elm = editor.getRangeHelper().getFirstBlockParent();
                        $elm = $(elm);
                        if (!elm || $elm.is("body")) {
                            return;
                        }
                    }
                    if ($elm.css("direction") === "ltr") {
                        $elm.css("direction", "");
                    } else {
                        $elm.css("direction", "ltr");
                    }
                },
                tooltip: "Left-to-Right"
            },
            rtl: {
                state: function(parents, firstBlock) {
                    return firstBlock && firstBlock.style.direction === "rtl";
                },
                exec: function() {
                    var editor = this
                      , elm = editor.getRangeHelper().getFirstBlockParent()
                      , $elm = $(elm);
                    editor.focus();
                    if (!elm || $elm.is("body")) {
                        editor.execCommand("formatBlock", "p");
                        elm = editor.getRangeHelper().getFirstBlockParent();
                        $elm = $(elm);
                        if (!elm || $elm.is("body")) {
                            return;
                        }
                    }
                    if ($elm.css("direction") === "rtl") {
                        $elm.css("direction", "");
                    } else {
                        $elm.css("direction", "rtl");
                    }
                },
                tooltip: "Right-to-Left"
            },
            print: {
                exec: "print",
                tooltip: "Print"
            },
            maximize: {
                state: function() {
                    return this.maximize();
                },
                exec: function() {
                    this.maximize(!this.maximize());
                },
                txtExec: function() {
                    this.maximize(!this.maximize());
                },
                tooltip: "Maximize",
                shortcut: "Ctrl+Shift+M"
            },
            source: {
                state: function() {
                    return this.sourceMode();
                },
                exec: function() {
                    this.toggleSourceMode();
                },
                txtExec: function() {
                    this.toggleSourceMode();
                },
                tooltip: "View source",
                shortcut: "Ctrl+Shift+S"
            },
            ignore: {}
        };
        return defaultCommnds;
    }
    .call(exports, __webpack_require__, exports, module),
    __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}
, function(module, exports, __webpack_require__) {
    var __WEBPACK_AMD_DEFINE_RESULT__;
    !(__WEBPACK_AMD_DEFINE_RESULT__ = function(require) {
        var $ = __webpack_require__(1);
        return {
            toolbar: "bold,italic,underline,strike,subscript,superscript|" + "left,center,right,justify|font,size,color,removeformat|" + "cut,copy,paste,pastetext|bulletlist,orderedlist,indent,outdent|" + "table|code,quote|horizontalrule,image,email,link,unlink|" + "emoticon,youtube,date,time|ltr,rtl|print,maximize,source",
            toolbarExclude: null,
            style: "jquery.sceditor.default.css",
            fonts: "Arial,Arial Black,Comic Sans MS,Courier New,Georgia,Impact," + "Sans-serif,Serif,Times New Roman,Trebuchet MS,Verdana",
            colors: null,
            locale: $("html").attr("lang") || "en",
            charset: "utf-8",
            emoticonsCompat: false,
            emoticonsEnabled: true,
            emoticonsRoot: "",
            emoticons: {
                dropdown: {
                    ":)": "emoticons/smile.png",
                    ":angel:": "emoticons/angel.png",
                    ":angry:": "emoticons/angry.png",
                    "8-)": "emoticons/cool.png",
                    ":'(": "emoticons/cwy.png",
                    ":ermm:": "emoticons/ermm.png",
                    ":D": "emoticons/grin.png",
                    "<3": "emoticons/heart.png",
                    ":(": "emoticons/sad.png",
                    ":O": "emoticons/shocked.png",
                    ":P": "emoticons/tongue.png",
                    ";)": "emoticons/wink.png"
                },
                more: {
                    ":alien:": "emoticons/alien.png",
                    ":blink:": "emoticons/blink.png",
                    ":blush:": "emoticons/blush.png",
                    ":cheerful:": "emoticons/cheerful.png",
                    ":devil:": "emoticons/devil.png",
                    ":dizzy:": "emoticons/dizzy.png",
                    ":getlost:": "emoticons/getlost.png",
                    ":happy:": "emoticons/happy.png",
                    ":kissing:": "emoticons/kissing.png",
                    ":ninja:": "emoticons/ninja.png",
                    ":pinch:": "emoticons/pinch.png",
                    ":pouty:": "emoticons/pouty.png",
                    ":sick:": "emoticons/sick.png",
                    ":sideways:": "emoticons/sideways.png",
                    ":silly:": "emoticons/silly.png",
                    ":sleeping:": "emoticons/sleeping.png",
                    ":unsure:": "emoticons/unsure.png",
                    ":woot:": "emoticons/w00t.png",
                    ":wassat:": "emoticons/wassat.png"
                },
                hidden: {
                    ":whistling:": "emoticons/whistling.png",
                    ":love:": "emoticons/wub.png"
                }
            },
            width: null,
            height: null,
            resizeEnabled: true,
            resizeMinWidth: null,
            resizeMinHeight: null,
            resizeMaxHeight: null,
            resizeMaxWidth: null,
            resizeHeight: true,
            resizeWidth: true,
            dateFormat: "year-month-day",
            toolbarContainer: null,
            enablePasteFiltering: false,
            disablePasting: false,
            readOnly: false,
            rtl: false,
            autofocus: false,
            autofocusEnd: true,
            autoExpand: false,
            autoUpdate: false,
            spellcheck: true,
            runWithoutWysiwygSupport: false,
            startInSourceMode: false,
            id: null,
            plugins: "",
            zIndex: null,
            bbcodeTrim: false,
            disableBlockRemove: false,
            parserOptions: {},
            dropDownCss: {}
        };
    }
    .call(exports, __webpack_require__, exports, module),
    __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}
]);
(function($, window, document) {
    var SCEditor = $.sceditor;
    var sceditorPlugins = SCEditor.plugins;
    var escapeEntities = SCEditor.escapeEntities;
    var escapeUriScheme = SCEditor.escapeUriScheme;
    var IE_VER = SCEditor.ie;
    var IE_BR_FIX = IE_VER && IE_VER < 11;
    var getEditorCommand = SCEditor.command.get;
    var defaultCommandsOverrides = {
        bold: {
            txtExec: ["[b]", "[/b]"]
        },
        italic: {
            txtExec: ["[i]", "[/i]"]
        },
        underline: {
            txtExec: ["[u]", "[/u]"]
        },
        strike: {
            txtExec: ["[s]", "[/s]"]
        },
        subscript: {
            txtExec: ["[sub]", "[/sub]"]
        },
        superscript: {
            txtExec: ["[sup]", "[/sup]"]
        },
        left: {
            txtExec: ["[left]", "[/left]"]
        },
        center: {
            txtExec: ["[center]", "[/center]"]
        },
        right: {
            txtExec: ["[right]", "[/right]"]
        },
        justify: {
            txtExec: ["[justify]", "[/justify]"]
        },
        font: {
            txtExec: function(caller) {
                var editor = this;
                getEditorCommand("font")._dropDown(editor, caller, function(fontName) {
                    editor.insertText("[font=" + fontName + "]", "[/font]");
                });
            }
        },
        size: {
            txtExec: function(caller) {
                var editor = this;
                getEditorCommand("size")._dropDown(editor, caller, function(fontSize) {
                    editor.insertText("[size=" + fontSize + "]", "[/size]");
                });
            }
        },
        color: {
            txtExec: function(caller) {
                var editor = this;
                getEditorCommand("color")._dropDown(editor, caller, function(color) {
                    editor.insertText("[color=" + color + "]", "[/color]");
                });
            }
        },
        bulletlist: {
            txtExec: function(caller, selected) {
                var content = "";
                $.each(selected.split(/\r?\n/), function() {
                    content += (content ? "\n" : "") + "[li]" + this + "[/li]";
                });
                this.insertText("[ul]\n" + content + "\n[/ul]");
            }
        },
        orderedlist: {
            txtExec: function(caller, selected) {
                var content = "";
                $.each(selected.split(/\r?\n/), function() {
                    content += (content ? "\n" : "") + "[li]" + this + "[/li]";
                });
                sceditorPlugins.bbcode.bbcode.get("");
                this.insertText("[ol]\n" + content + "\n[/ol]");
            }
        },
        table: {
            txtExec: ["[table][tr][td]", "[/td][/tr][/table]"]
        },
        horizontalrule: {
            txtExec: ["[hr]"]
        },
        code: {
            txtExec: ["[code]", "[/code]"]
        },
        image: {
            txtExec: function(caller, selected) {
                var editor = this
                  , url = prompt(editor._("Enter the image URL:"), selected);
                if (url) {
                    editor.insertText("[img]" + url + "[/img]");
                }
            }
        },
        email: {
            txtExec: function(caller, selected) {
                var editor = this
                  , display = selected && selected.indexOf("@") > -1 ? null : selected
                  , email = prompt(editor._("Enter the e-mail address:"), (display ? "" : selected))
                  , text = prompt(editor._("Enter the displayed text:"), display || email) || email;
                if (email) {
                    editor.insertText("[email=" + email + "]" + text + "[/email]");
                }
            }
        },
        link: {
            txtExec: function(caller, selected) {
                var editor = this
                  , display = /^[a-z]+:\/\//i.test($.trim(selected)) ? null : selected
                  , url = prompt(editor._("Enter URL:"), (display ? "http://" : $.trim(selected)))
                  , text = prompt(editor._("Enter the displayed text:"), display || url) || url;
                if (url) {
                    editor.insertText("[url=" + url + "]" + text + "[/url]");
                }
            }
        },
        quote: {
            txtExec: ["[quote]", "[/quote]"]
        },
        youtube: {
            txtExec: function(caller) {
                var editor = this;
                getEditorCommand("youtube")._dropDown(editor, caller, function(id) {
                    editor.insertText("[youtube]" + id + "[/youtube]");
                });
            }
        },
        rtl: {
            txtExec: ["[rtl]", "[/rtl]"]
        },
        ltr: {
            txtExec: ["[ltr]", "[/ltr]"]
        }
    };
    var _stripQuotes = function(str) {
        return str ? str.replace(/\\(.)/g, "$1").replace(/^(["'])(.*?)\1$/, "$2") : str;
    };
    var _formatString = function() {
        var undef;
        var args = arguments;
        return args[0].replace(/\{(\d+)\}/g, function(str, p1) {
            return args[p1 - 0 + 1] !== undef ? args[p1 - 0 + 1] : "{" + p1 + "}";
        });
    };
    var TokenType = {
        OPEN: "open",
        CONTENT: "content",
        NEWLINE: "newline",
        CLOSE: "close"
    };
    var TokenizeToken = function(type, name, val, attrs, children, closing) {
        var base = this;
        base.type = type;
        base.name = name;
        base.val = val;
        base.attrs = attrs || {};
        base.children = children || [];
        base.closing = closing || null;
    };
    TokenizeToken.prototype = {
        clone: function(includeChildren) {
            var base = this;
            return new TokenizeToken(base.type,base.name,base.val,base.attrs,includeChildren ? base.children : [],base.closing ? base.closing.clone() : null);
        },
        splitAt: function(splitAt) {
            var clone;
            var base = this;
            var splitAtLength = 0;
            var childrenLen = base.children.length;
            if (typeof splitAt !== "number") {
                splitAt = $.inArray(splitAt, base.children);
            }
            if (splitAt < 0 || splitAt > childrenLen) {
                return null;
            }
            while (childrenLen--) {
                if (childrenLen >= splitAt) {
                    splitAtLength++;
                } else {
                    childrenLen = 0;
                }
            }
            clone = base.clone();
            clone.children = base.children.splice(splitAt, splitAtLength);
            return clone;
        }
    };
    var BBCodeParser = function(options) {
        if (!(this instanceof BBCodeParser)) {
            return new BBCodeParser(options);
        }
        var base = this;
        var init, tokenizeTag, tokenizeAttrs, parseTokens, normaliseNewLines, fixNesting, isChildAllowed, removeEmpty, fixChildren, convertToHTML, convertToBBCode, hasTag, quote, lower, last;
        init = function() {
            base.bbcodes = sceditorPlugins.bbcode.bbcodes;
            base.opts = $.extend({}, BBCodeParser.defaults, options);
        }
        ;
        base.tokenize = function(str) {
            var matches, type, i;
            var toks = [];
            var tokens = [{
                type: TokenType.CLOSE,
                regex: /^\[\/[^\[\]]+\]/
            }, {
                type: TokenType.OPEN,
                regex: /^\[[^\[\]]+\]/
            }, {
                type: TokenType.NEWLINE,
                regex: /^(\r\n|\r|\n)/
            }, {
                type: TokenType.CONTENT,
                regex: /^([^\[\r\n]+|\[)/
            }];
            tokens.reverse();
            strloop: while (str.length) {
                i = tokens.length;
                while (i--) {
                    type = tokens[i].type;
                    if (!(matches = str.match(tokens[i].regex)) || !matches[0]) {
                        continue;
                    }
                    toks.push(tokenizeTag(type, matches[0]));
                    str = str.substr(matches[0].length);
                    continue strloop;
                }
                if (str.length) {
                    toks.push(tokenizeTag(TokenType.CONTENT, str));
                }
                str = "";
            }
            return toks;
        }
        ;
        tokenizeTag = function(type, val) {
            var matches, attrs, name, openRegex = /\[([^\]\s=]+)(?:([^\]]+))?\]/, closeRegex = /\[\/([^\[\]]+)\]/;
            if (type === TokenType.OPEN && (matches = val.match(openRegex))) {
                name = lower(matches[1]);
                if (matches[2] && (matches[2] = $.trim(matches[2]))) {
                    attrs = tokenizeAttrs(matches[2]);
                }
            }
            if (type === TokenType.CLOSE && (matches = val.match(closeRegex))) {
                name = lower(matches[1]);
            }
            if (type === TokenType.NEWLINE) {
                name = "#newline";
            }
            if (!name || ((type === TokenType.OPEN || type === TokenType.CLOSE) && !sceditorPlugins.bbcode.bbcodes[name])) {
                type = TokenType.CONTENT;
                name = "#";
            }
            return new TokenizeToken(type,name,val,attrs);
        }
        ;
        tokenizeAttrs = function(attrs) {
            var matches, attrRegex = /([^\s=]+)=(?:(?:(["'])((?:\\\2|[^\2])*?)\2)|((?:.(?!\s\S+=))*.))/g, ret = {};
            if (attrs.charAt(0) === "=" && attrs.indexOf("=", 1) < 0) {
                ret.defaultattr = _stripQuotes(attrs.substr(1));
            } else {
                if (attrs.charAt(0) === "=") {
                    attrs = "defaultattr" + attrs;
                }
                while ((matches = attrRegex.exec(attrs))) {
                    ret[lower(matches[1])] = _stripQuotes(matches[3]) || matches[4];
                }
            }
            return ret;
        }
        ;
        base.parse = function(str, preserveNewLines) {
            var ret = parseTokens(base.tokenize(str));
            var opts = base.opts;
            if (opts.fixInvalidChildren) {
                fixChildren(ret);
            }
            if (opts.removeEmptyTags) {
                removeEmpty(ret);
            }
            if (opts.fixInvalidNesting) {
                fixNesting(ret);
            }
            normaliseNewLines(ret, null, preserveNewLines);
            if (opts.removeEmptyTags) {
                removeEmpty(ret);
            }
            return ret;
        }
        ;
        hasTag = function(name, type, arr) {
            var i = arr.length;
            while (i--) {
                if (arr[i].type === type && arr[i].name === name) {
                    return true;
                }
            }
            return false;
        }
        ;
        isChildAllowed = function(parent, child) {
            var parentBBCode = parent ? base.bbcodes[parent.name] : {}
              , allowedChildren = parentBBCode.allowedChildren;
            if (base.opts.fixInvalidChildren && allowedChildren) {
                return $.inArray(child.name || "#", allowedChildren) > -1;
            }
            return true;
        }
        ;
        parseTokens = function(toks) {
            var token, bbcode, curTok, clone, i, previous, next, cloned = [], output = [], openTags = [], currentOpenTag = function() {
                return last(openTags);
            }, addTag = function(token) {
                if (currentOpenTag()) {
                    currentOpenTag().children.push(token);
                } else {
                    output.push(token);
                }
            }, closesCurrentTag = function(name) {
                return currentOpenTag() && (bbcode = base.bbcodes[currentOpenTag().name]) && bbcode.closedBy && $.inArray(name, bbcode.closedBy) > -1;
            };
            while ((token = toks.shift())) {
                next = toks[0];
                switch (token.type) {
                case TokenType.OPEN:
                    if (closesCurrentTag(token.name)) {
                        openTags.pop();
                    }
                    addTag(token);
                    bbcode = base.bbcodes[token.name];
                    if ((!bbcode || !bbcode.isSelfClosing) && (bbcode.closedBy || hasTag(token.name, TokenType.CLOSE, toks))) {
                        openTags.push(token);
                    } else {
                        if (!bbcode || !bbcode.isSelfClosing) {
                            token.type = TokenType.CONTENT;
                        }
                    }
                    break;
                case TokenType.CLOSE:
                    if (currentOpenTag() && token.name !== currentOpenTag().name && closesCurrentTag("/" + token.name)) {
                        openTags.pop();
                    }
                    if (currentOpenTag() && token.name === currentOpenTag().name) {
                        currentOpenTag().closing = token;
                        openTags.pop();
                    } else {
                        if (hasTag(token.name, TokenType.OPEN, openTags)) {
                            while ((curTok = openTags.pop())) {
                                if (curTok.name === token.name) {
                                    curTok.closing = token;
                                    break;
                                }
                                clone = curTok.clone();
                                if (cloned.length > 1) {
                                    clone.children.push(last(cloned));
                                }
                                cloned.push(clone);
                            }
                            addTag(last(cloned));
                            i = cloned.length;
                            while (i--) {
                                openTags.push(cloned[i]);
                            }
                            cloned.length = 0;
                        } else {
                            token.type = TokenType.CONTENT;
                            addTag(token);
                        }
                    }
                    break;
                case TokenType.NEWLINE:
                    if (currentOpenTag() && next && closesCurrentTag((next.type === TokenType.CLOSE ? "/" : "") + next.name)) {
                        if (!(next.type === TokenType.CLOSE && next.name === currentOpenTag().name)) {
                            bbcode = base.bbcodes[currentOpenTag().name];
                            if (bbcode && bbcode.breakAfter) {
                                openTags.pop();
                            } else {
                                if (bbcode && bbcode.isInline === false && base.opts.breakAfterBlock && bbcode.breakAfter !== false) {
                                    openTags.pop();
                                }
                            }
                        }
                    }
                    addTag(token);
                    break;
                default:
                    addTag(token);
                    break;
                }
                previous = token;
            }
            return output;
        }
        ;
        normaliseNewLines = function(children, parent, onlyRemoveBreakAfter) {
            var token, left, right, parentBBCode, bbcode, removedBreakEnd, removedBreakBefore, remove;
            var childrenLength = children.length;
            if (parent) {
                parentBBCode = base.bbcodes[parent.name];
            }
            var i = childrenLength;
            while (i--) {
                if (!(token = children[i])) {
                    continue;
                }
                if (token.type === TokenType.NEWLINE) {
                    left = i > 0 ? children[i - 1] : null;
                    right = i < childrenLength - 1 ? children[i + 1] : null;
                    remove = false;
                    if (!onlyRemoveBreakAfter && parentBBCode && parentBBCode.isSelfClosing !== true) {
                        if (!left) {
                            if (parentBBCode.isInline === false && base.opts.breakStartBlock && parentBBCode.breakStart !== false) {
                                remove = true;
                            }
                            if (parentBBCode.breakStart) {
                                remove = true;
                            }
                        } else {
                            if (!removedBreakEnd && !right) {
                                if (parentBBCode.isInline === false && base.opts.breakEndBlock && parentBBCode.breakEnd !== false) {
                                    remove = true;
                                }
                                if (parentBBCode.breakEnd) {
                                    remove = true;
                                }
                                removedBreakEnd = remove;
                            }
                        }
                    }
                    if (left && left.type === TokenType.OPEN) {
                        if ((bbcode = base.bbcodes[left.name])) {
                            if (!onlyRemoveBreakAfter) {
                                if (bbcode.isInline === false && base.opts.breakAfterBlock && bbcode.breakAfter !== false) {
                                    remove = true;
                                }
                                if (bbcode.breakAfter) {
                                    remove = true;
                                }
                            } else {
                                if (bbcode.isInline === false) {
                                    remove = true;
                                }
                            }
                        }
                    }
                    if (!onlyRemoveBreakAfter && !removedBreakBefore && right && right.type === TokenType.OPEN) {
                        if ((bbcode = base.bbcodes[right.name])) {
                            if (bbcode.isInline === false && base.opts.breakBeforeBlock && bbcode.breakBefore !== false) {
                                remove = true;
                            }
                            if (bbcode.breakBefore) {
                                remove = true;
                            }
                            removedBreakBefore = remove;
                            if (remove) {
                                children.splice(i, 1);
                                continue;
                            }
                        }
                    }
                    if (remove) {
                        children.splice(i, 1);
                    }
                    removedBreakBefore = false;
                } else {
                    if (token.type === TokenType.OPEN) {
                        normaliseNewLines(token.children, token, onlyRemoveBreakAfter);
                    }
                }
            }
        }
        ;
        fixNesting = function(children, parents, insideInline, rootArr) {
            var token, i, parent, parentIndex, parentParentChildren, right;
            var isInline = function(token) {
                var bbcode = base.bbcodes[token.name];
                return !bbcode || bbcode.isInline !== false;
            };
            parents = parents || [];
            rootArr = rootArr || children;
            for (i = 0; i < children.length; i++) {
                if (!(token = children[i]) || token.type !== TokenType.OPEN) {
                    continue;
                }
                if (!isInline(token) && insideInline) {
                    parent = last(parents);
                    right = parent.splitAt(token);
                    parentParentChildren = parents.length > 1 ? parents[parents.length - 2].children : rootArr;
                    parentIndex = $.inArray(parent, parentParentChildren);
                    if (parentIndex > -1) {
                        right.children.splice($.inArray(token, right.children), 1);
                        parentParentChildren.splice(parentIndex + 1, 0, token, right);
                        return;
                    }
                }
                parents.push(token);
                fixNesting(token.children, parents, insideInline || isInline(token), rootArr);
                parents.pop(token);
            }
        }
        ;
        fixChildren = function(children, parent) {
            var token, args;
            var i = children.length;
            while (i--) {
                if (!(token = children[i])) {
                    continue;
                }
                if (!isChildAllowed(parent, token)) {
                    token.name = null;
                    token.type = TokenType.CONTENT;
                    if (isChildAllowed(parent, token)) {
                        args = [i + 1, 0].concat(token.children);
                        if (token.closing) {
                            token.closing.name = null;
                            token.closing.type = TokenType.CONTENT;
                            args.push(token.closing);
                        }
                        i += args.length - 1;
                        Array.prototype.splice.apply(children, args);
                    } else {
                        parent.children.splice(i, 1);
                    }
                }
                if (token.type === TokenType.OPEN) {
                    fixChildren(token.children, token);
                }
            }
        }
        ;
        removeEmpty = function(tokens) {
            var token, bbcode;
            var isTokenWhiteSpace = function(children) {
                var j = children.length;
                while (j--) {
                    var type = children[j].type;
                    if (type === TokenType.OPEN || type === TokenType.CLOSE) {
                        return false;
                    }
                    if (type === TokenType.CONTENT && /\S|\u00A0/.test(children[j].val)) {
                        return false;
                    }
                }
                return true;
            };
            var i = tokens.length;
            while (i--) {
                if (!(token = tokens[i]) || token.type !== TokenType.OPEN) {
                    continue;
                }
                bbcode = base.bbcodes[token.name];
                removeEmpty(token.children);
                if (isTokenWhiteSpace(token.children) && bbcode && !bbcode.isSelfClosing && !bbcode.allowsEmpty) {
                    tokens.splice.apply(tokens, $.merge([i, 1], token.children));
                }
            }
        }
        ;
        base.toHTML = function(str, preserveNewLines) {
            return convertToHTML(base.parse(str, preserveNewLines), true);
        }
        ;
        convertToHTML = function(tokens, isRoot) {
            var undef, token, bbcode, content, html, needsBlockWrap, blockWrapOpen, isInline, lastChild, ret = [];
            isInline = function(bbcode) {
                return (!bbcode || (bbcode.isHtmlInline !== undef ? bbcode.isHtmlInline : bbcode.isInline)) !== false;
            }
            ;
            while (tokens.length > 0) {
                if (!(token = tokens.shift())) {
                    continue;
                }
                if (token.type === TokenType.OPEN) {
                    lastChild = token.children[token.children.length - 1] || {};
                    bbcode = base.bbcodes[token.name];
                    needsBlockWrap = isRoot && isInline(bbcode);
                    content = convertToHTML(token.children, false);
                    if (bbcode && bbcode.html) {
                        if (!isInline(bbcode) && isInline(base.bbcodes[lastChild.name]) && !bbcode.isPreFormatted && !bbcode.skipLastLineBreak) {
                            if (!IE_BR_FIX) {
                                content += "<br />";
                            }
                        }
                        if (!$.isFunction(bbcode.html)) {
                            token.attrs["0"] = content;
                            html = sceditorPlugins.bbcode.formatBBCodeString(bbcode.html, token.attrs);
                        } else {
                            html = bbcode.html.call(base, token, token.attrs, content);
                        }
                    } else {
                        html = token.val + content + (token.closing ? token.closing.val : "");
                    }
                } else {
                    if (token.type === TokenType.NEWLINE) {
                        if (!isRoot) {
                            ret.push("<br />");
                            continue;
                        }
                        if (!blockWrapOpen) {
                            ret.push("<div>");
                            if (IE_VER < 8 || (document.documentMode && document.documentMode < 8)) {
                                ret.push("\u00a0");
                            }
                        }
                        if (!IE_BR_FIX) {
                            ret.push("<br />");
                        }
                        if (!tokens.length) {
                            ret.push("<br />");
                        }
                        ret.push("</div>\n");
                        blockWrapOpen = false;
                        continue;
                    } else {
                        needsBlockWrap = isRoot;
                        html = escapeEntities(token.val, true);
                    }
                }
                if (needsBlockWrap && !blockWrapOpen) {
                    ret.push("<div>");
                    blockWrapOpen = true;
                } else {
                    if (!needsBlockWrap && blockWrapOpen) {
                        ret.push("</div>\n");
                        blockWrapOpen = false;
                    }
                }
                ret.push(html);
            }
            if (blockWrapOpen) {
                ret.push("</div>\n");
            }
            return ret.join("");
        }
        ;
        base.toBBCode = function(str, preserveNewLines) {
            return convertToBBCode(base.parse(str, preserveNewLines));
        }
        ;
        convertToBBCode = function(toks) {
            var token, attr, bbcode, isBlock, isSelfClosing, quoteType, breakBefore, breakStart, breakEnd, breakAfter, ret = [];
            while (toks.length > 0) {
                if (!(token = toks.shift())) {
                    continue;
                }
                bbcode = base.bbcodes[token.name];
                isBlock = !(!bbcode || bbcode.isInline !== false);
                isSelfClosing = bbcode && bbcode.isSelfClosing;
                breakBefore = (isBlock && base.opts.breakBeforeBlock && bbcode.breakBefore !== false) || (bbcode && bbcode.breakBefore);
                breakStart = (isBlock && !isSelfClosing && base.opts.breakStartBlock && bbcode.breakStart !== false) || (bbcode && bbcode.breakStart);
                breakEnd = (isBlock && base.opts.breakEndBlock && bbcode.breakEnd !== false) || (bbcode && bbcode.breakEnd);
                breakAfter = (isBlock && base.opts.breakAfterBlock && bbcode.breakAfter !== false) || (bbcode && bbcode.breakAfter);
                quoteType = (bbcode ? bbcode.quoteType : null) || base.opts.quoteType || BBCodeParser.QuoteType.auto;
                if (!bbcode && token.type === TokenType.OPEN) {
                    ret.push(token.val);
                    if (token.children) {
                        ret.push(convertToBBCode(token.children));
                    }
                    if (token.closing) {
                        ret.push(token.closing.val);
                    }
                } else {
                    if (token.type === TokenType.OPEN) {
                        if (breakBefore) {
                            ret.push("\n");
                        }
                        ret.push("[" + token.name);
                        if (token.attrs) {
                            if (token.attrs.defaultattr) {
                                ret.push("=", quote(token.attrs.defaultattr, quoteType, "defaultattr"));
                                delete token.attrs.defaultattr;
                            }
                            for (attr in token.attrs) {
                                if (token.attrs.hasOwnProperty(attr)) {
                                    ret.push(" ", attr, "=", quote(token.attrs[attr], quoteType, attr));
                                }
                            }
                        }
                        ret.push("]");
                        if (breakStart) {
                            ret.push("\n");
                        }
                        if (token.children) {
                            ret.push(convertToBBCode(token.children));
                        }
                        if (!isSelfClosing && !bbcode.excludeClosing) {
                            if (breakEnd) {
                                ret.push("\n");
                            }
                            ret.push("[/" + token.name + "]");
                        }
                        if (breakAfter) {
                            ret.push("\n");
                        }
                        if (token.closing && isSelfClosing) {
                            ret.push(token.closing.val);
                        }
                    } else {
                        ret.push(token.val);
                    }
                }
            }
            return ret.join("");
        }
        ;
        quote = function(str, quoteType, name) {
            var QuoteTypes = BBCodeParser.QuoteType
              , needsQuotes = /\s|=/.test(str);
            if ($.isFunction(quoteType)) {
                return quoteType(str, name);
            }
            if (quoteType === QuoteTypes.never || (quoteType === QuoteTypes.auto && !needsQuotes)) {
                return str;
            }
            return '"' + str.replace("\\", "\\\\").replace('"', '\\"') + '"';
        }
        ;
        last = function(arr) {
            if (arr.length) {
                return arr[arr.length - 1];
            }
            return null;
        }
        ;
        lower = function(str) {
            return str.toLowerCase();
        }
        ;
        init();
    };
    BBCodeParser.QuoteType = {
        always: 1,
        never: 2,
        auto: 3
    };
    BBCodeParser.defaults = {
        breakBeforeBlock: false,
        breakStartBlock: false,
        breakEndBlock: false,
        breakAfterBlock: true,
        removeEmptyTags: true,
        fixInvalidNesting: true,
        fixInvalidChildren: true,
        quoteType: BBCodeParser.QuoteType.auto
    };
    $.sceditorBBCodePlugin = sceditorPlugins.bbcode = function() {
        var base = this;
        var buildBbcodeCache, handleStyles, handleTags, removeFirstLastDiv;
        base.bbcodes = sceditorPlugins.bbcode.bbcodes;
        base.stripQuotes = _stripQuotes;
        var tagsToBBCodes = {};
        var stylesToBBCodes = {};
        var validChildren = {
            ul: ["li", "ol", "ul"],
            ol: ["li", "ol", "ul"],
            table: ["tr"],
            tr: ["td", "th"],
            code: ["br", "p", "div"]
        };
        base.init = function() {
            base.opts = this.opts;
            buildBbcodeCache();
            this.commands = $.extend(true, {}, defaultCommandsOverrides, this.commands);
            this.toBBCode = base.signalToSource;
            this.fromBBCode = base.signalToWysiwyg;
        }
        ;
        buildBbcodeCache = function() {
            $.each(base.bbcodes, function(bbcode) {
                var isBlock, tags = base.bbcodes[bbcode].tags, styles = base.bbcodes[bbcode].styles;
                if (tags) {
                    $.each(tags, function(tag, values) {
                        isBlock = base.bbcodes[bbcode].isInline === false;
                        tagsToBBCodes[tag] = tagsToBBCodes[tag] || {};
                        tagsToBBCodes[tag][isBlock] = tagsToBBCodes[tag][isBlock] || {};
                        tagsToBBCodes[tag][isBlock][bbcode] = values;
                    });
                }
                if (styles) {
                    $.each(styles, function(style, values) {
                        isBlock = base.bbcodes[bbcode].isInline === false;
                        stylesToBBCodes[isBlock] = stylesToBBCodes[isBlock] || {};
                        stylesToBBCodes[isBlock][style] = stylesToBBCodes[isBlock][style] || {};
                        stylesToBBCodes[isBlock][style][bbcode] = values;
                    });
                }
            });
        }
        ;
        handleStyles = function($element, content, blockLevel) {
            var styleValue, format, getStyle = SCEditor.dom.getStyle;
            blockLevel = !!blockLevel;
            if (!stylesToBBCodes[blockLevel]) {
                return content;
            }
            $.each(stylesToBBCodes[blockLevel], function(property, bbcodes) {
                styleValue = getStyle($element[0], property);
                if (!styleValue || getStyle($element.parent()[0], property) === styleValue) {
                    return;
                }
                $.each(bbcodes, function(bbcode, values) {
                    if (!values || $.inArray(styleValue.toString(), values) > -1) {
                        format = base.bbcodes[bbcode].format;
                        if ($.isFunction(format)) {
                            content = format.call(base, $element, content);
                        } else {
                            content = _formatString(format, content);
                        }
                    }
                });
            });
            return content;
        }
        ;
        handleTags = function($element, content, blockLevel) {
            var convertBBCode, format, element = $element[0], tag = element.nodeName.toLowerCase();
            blockLevel = !!blockLevel;
            if (tagsToBBCodes[tag] && tagsToBBCodes[tag][blockLevel]) {
                $.each(tagsToBBCodes[tag][blockLevel], function(bbcode, bbcodeAttribs) {
                    if (bbcodeAttribs) {
                        convertBBCode = false;
                        $.each(bbcodeAttribs, function(attrib, values) {
                            if (!$element.attr(attrib) || (values && $.inArray($element.attr(attrib), values) < 0)) {
                                return;
                            }
                            convertBBCode = true;
                            return false;
                        });
                        if (!convertBBCode) {
                            return;
                        }
                    }
                    format = base.bbcodes[bbcode].format;
                    if ($.isFunction(format)) {
                        content = format.call(base, $element, content);
                    } else {
                        content = _formatString(format, content);
                    }
                });
            }
            var isInline = SCEditor.dom.isInline;
            if (blockLevel && (!isInline(element, true) || tag === "br")) {
                var isLastBlockChild, parent, parentLastChild, previousSibling = element.previousSibling;
                while (previousSibling && previousSibling.nodeType === 1 && !$(previousSibling).is("br") && isInline(previousSibling, true) && !previousSibling.firstChild) {
                    previousSibling = previousSibling.previousSibling;
                }
                do {
                    parent = element.parentNode;
                    parentLastChild = parent.lastChild;
                    isLastBlockChild = parentLastChild === element;
                    element = parent;
                } while (parent && isLastBlockChild && isInline(parent, true));
                if (!isLastBlockChild || tag === "li" || (tag === "br" && IE_BR_FIX)) {
                    content += "\n";
                }
                if (tag !== "br" && previousSibling && !$(previousSibling).is("br") && isInline(previousSibling, true)) {
                    content = "\n" + content;
                }
            }
            return content;
        }
        ;
        base.signalToSource = function(html, $body) {
            var $tmpContainer, bbcode, parser = new BBCodeParser(base.opts.parserOptions);
            if (!$body) {
                if (typeof html === "string") {
                    $tmpContainer = $("<div />").css("visibility", "hidden").appendTo(document.body).html(html);
                    $body = $tmpContainer;
                } else {
                    $body = $(html);
                }
            }
            if (!$body || !$body.jquery) {
                return "";
            }
            SCEditor.dom.removeWhiteSpace($body[0]);
            $(".sceditor-ignore", $body).remove();
            bbcode = base.elementToBbcode($body);
            if ($tmpContainer) {
                $tmpContainer.remove();
            }
            bbcode = parser.toBBCode(bbcode, true);
            if (base.opts.bbcodeTrim) {
                bbcode = $.trim(bbcode);
            }
            return bbcode;
        }
        ;
        base.elementToBbcode = function($element) {
            var toBBCode = function(node, vChildren) {
                var ret = "";
                SCEditor.dom.traverse(node, function(node) {
                    var $node = $(node)
                      , curTag = ""
                      , nodeType = node.nodeType
                      , tag = node.nodeName.toLowerCase()
                      , vChild = validChildren[tag]
                      , firstChild = node.firstChild
                      , isValidChild = true;
                    if (typeof vChildren === "object") {
                        isValidChild = $.inArray(tag, vChildren) > -1;
                        if ($node.is("img") && $node.data("sceditor-emoticon")) {
                            isValidChild = true;
                        }
                        if (!isValidChild) {
                            vChild = vChildren;
                        }
                    }
                    if (nodeType !== 3 && nodeType !== 1) {
                        return;
                    }
                    if (nodeType === 1) {
                        if ($node.hasClass("sceditor-nlf")) {
                            if (!firstChild || (!IE_BR_FIX && node.childNodes.length === 1 && /br/i.test(firstChild.nodeName))) {
                                return;
                            }
                        }
                        if (tag !== "iframe") {
                            curTag = toBBCode(node, vChild);
                        }
                        if (isValidChild) {
                            if (tag !== "code") {
                                curTag = handleStyles($node, curTag);
                                curTag = handleTags($node, curTag);
                                curTag = handleStyles($node, curTag, true);
                            }
                            ret += handleTags($node, curTag, true);
                        } else {
                            ret += curTag;
                        }
                    } else {
                        ret += node.nodeValue;
                    }
                }, false, true);
                return ret;
            };
            return toBBCode($element[0]);
        }
        ;
        base.signalToWysiwyg = function(text, asFragment) {
            var parser = new BBCodeParser(base.opts.parserOptions)
              , html = parser.toHTML(base.opts.bbcodeTrim ? $.trim(text) : text);
            return asFragment ? removeFirstLastDiv(html) : html;
        }
        ;
        removeFirstLastDiv = function(html) {
            var node, next, removeDiv, $output = $("<div />").hide().appendTo(document.body), output = $output[0];
            removeDiv = function(node, isFirst) {
                if (SCEditor.dom.hasStyling(node)) {
                    return;
                }
                if (IE_BR_FIX || (node.childNodes.length !== 1 || !$(node.firstChild).is("br"))) {
                    while ((next = node.firstChild)) {
                        output.insertBefore(next, node);
                    }
                }
                if (isFirst) {
                    var lastChild = output.lastChild;
                    if (node !== lastChild && $(lastChild).is("div") && node.nextSibling === lastChild) {
                        output.insertBefore(document.createElement("br"), node);
                    }
                }
                output.removeChild(node);
            }
            ;
            output.innerHTML = html.replace(/<\/div>\n/g, "</div>");
            if ((node = output.firstChild) && $(node).is("div")) {
                removeDiv(node, true);
            }
            if ((node = output.lastChild) && $(node).is("div")) {
                removeDiv(node);
            }
            output = output.innerHTML;
            $output.remove();
            return output;
        }
        ;
    }
    ;
    sceditorPlugins.bbcode.formatBBCodeString = function(str, obj) {
        return str.replace(/\{([^}]+)\}/g, function(match, group) {
            var undef, escape = true;
            if (group.charAt(0) === "!") {
                escape = false;
                group = group.substring(1);
            }
            if (group === "0") {
                escape = false;
            }
            if (obj[group] === undef) {
                return match;
            }
            return escape ? escapeEntities(obj[group], true) : obj[group];
        });
    }
    ;
    var toHex = function(number) {
        number = parseInt(number, 10);
        if (isNaN(number)) {
            return "00";
        }
        number = Math.max(0, Math.min(number, 255)).toString(16);
        return number.length < 2 ? "0" + number : number;
    };
    var _normaliseColour = function(colorStr) {
        var match;
        colorStr = colorStr || "#000";
        if ((match = colorStr.match(/rgb\((\d{1,3}),\s*?(\d{1,3}),\s*?(\d{1,3})\)/i))) {
            return "#" + toHex(match[1]) + toHex(match[2] - 0) + toHex(match[3] - 0);
        }
        if ((match = colorStr.match(/#([0-f])([0-f])([0-f])\s*?$/i))) {
            return "#" + match[1] + match[1] + match[2] + match[2] + match[3] + match[3];
        }
        return colorStr;
    };
    var bbcodes = {
        b: {
            tags: {
                b: null,
                strong: null
            },
            styles: {
                "font-weight": ["bold", "bolder", "401", "700", "800", "900"]
            },
            format: "[b]{0}[/b]",
            html: "<strong>{0}</strong>"
        },
        i: {
            tags: {
                i: null,
                em: null
            },
            styles: {
                "font-style": ["italic", "oblique"]
            },
            format: "[i]{0}[/i]",
            html: "<em>{0}</em>"
        },
        u: {
            tags: {
                u: null
            },
            styles: {
                "text-decoration": ["underline"]
            },
            format: "[u]{0}[/u]",
            html: "<u>{0}</u>"
        },
        s: {
            tags: {
                s: null,
                strike: null
            },
            styles: {
                "text-decoration": ["line-through"]
            },
            format: "[s]{0}[/s]",
            html: "<s>{0}</s>"
        },
        sub: {
            tags: {
                sub: null
            },
            format: "[sub]{0}[/sub]",
            html: "<sub>{0}</sub>"
        },
        sup: {
            tags: {
                sup: null
            },
            format: "[sup]{0}[/sup]",
            html: "<sup>{0}</sup>"
        },
        font: {
            tags: {
                font: {
                    face: null
                }
            },
            styles: {
                "font-family": null
            },
            quoteType: BBCodeParser.QuoteType.never,
            format: function($element, content) {
                var font;
                if (!$element.is("font") || !(font = $element.attr("face"))) {
                    font = $element.css("font-family");
                }
                return "[font=" + _stripQuotes(font) + "]" + content + "[/font]";
            },
            html: '<font face="{defaultattr}">{0}</font>'
        },
        size: {
            tags: {
                font: {
                    size: null
                }
            },
            styles: {
                "font-size": null
            },
            format: function(element, content) {
                var fontSize = element.attr("size")
                  , size = 2;
                if (!fontSize) {
                    fontSize = element.css("fontSize");
                }
                if (fontSize.indexOf("px") > -1) {
                    fontSize = fontSize.replace("px", "") - 0;
                    if (fontSize < 12) {
                        size = 1;
                    }
                    if (fontSize > 15) {
                        size = 3;
                    }
                    if (fontSize > 17) {
                        size = 4;
                    }
                    if (fontSize > 23) {
                        size = 5;
                    }
                    if (fontSize > 31) {
                        size = 6;
                    }
                    if (fontSize > 47) {
                        size = 7;
                    }
                } else {
                    size = fontSize;
                }
                return "[size=" + size + "]" + content + "[/size]";
            },
            html: '<font size="{defaultattr}">{!0}</font>'
        },
        color: {
            tags: {
                font: {
                    color: null
                }
            },
            styles: {
                color: null
            },
            quoteType: BBCodeParser.QuoteType.never,
            format: function($element, content) {
                var color;
                if (!$element.is("font") || !(color = $element.attr("color"))) {
                    color = $element[0].style.color || $element.css("color");
                }
                return "[color=" + _normaliseColour(color) + "]" + content + "[/color]";
            },
            html: function(token, attrs, content) {
                return '<font color="' + escapeEntities(_normaliseColour(attrs.defaultattr), true) + '">' + content + "</font>";
            }
        },
        ul: {
            tags: {
                ul: null
            },
            breakStart: true,
            isInline: false,
            skipLastLineBreak: true,
            format: "[ul]{0}[/ul]",
            html: "<ul>{0}</ul>"
        },
        list: {
            breakStart: true,
            isInline: false,
            skipLastLineBreak: true,
            html: "<ul>{0}</ul>"
        },
        ol: {
            tags: {
                ol: null
            },
            breakStart: true,
            isInline: false,
            skipLastLineBreak: true,
            format: "[ol]{0}[/ol]",
            html: "<ol>{0}</ol>"
        },
        li: {
            tags: {
                li: null
            },
            isInline: false,
            closedBy: ["/ul", "/ol", "/list", "*", "li"],
            format: "[li]{0}[/li]",
            html: "<li>{0}</li>"
        },
        "*": {
            isInline: false,
            closedBy: ["/ul", "/ol", "/list", "*", "li"],
            html: "<li>{0}</li>"
        },
        table: {
            tags: {
                table: null
            },
            isInline: false,
            isHtmlInline: true,
            skipLastLineBreak: true,
            format: "[table]{0}[/table]",
            html: "<table>{0}</table>"
        },
        tr: {
            tags: {
                tr: null
            },
            isInline: false,
            skipLastLineBreak: true,
            format: "[tr]{0}[/tr]",
            html: "<tr>{0}</tr>"
        },
        th: {
            tags: {
                th: null
            },
            allowsEmpty: true,
            isInline: false,
            format: "[th]{0}[/th]",
            html: "<th>{0}</th>"
        },
        td: {
            tags: {
                td: null
            },
            allowsEmpty: true,
            isInline: false,
            format: "[td]{0}[/td]",
            html: "<td>{0}</td>"
        },
        emoticon: {
            allowsEmpty: true,
            tags: {
                img: {
                    src: null,
                    "data-sceditor-emoticon": null
                }
            },
            format: function($elm, content) {
                return $elm.data("sceditor-emoticon") + content;
            },
            html: "{0}"
        },
        hr: {
            tags: {
                hr: null
            },
            allowsEmpty: true,
            isSelfClosing: true,
            isInline: false,
            format: "[hr]{0}",
            html: "<hr />"
        },
        img: {
            allowsEmpty: true,
            tags: {
                img: {
                    src: null
                }
            },
            allowedChildren: ["#"],
            quoteType: BBCodeParser.QuoteType.never,
            format: function($element, content) {
                var width, height, attribs = "", element = $element[0], style = function(name) {
                    return element.style ? element.style[name] : null;
                };
                if ($element.attr("data-sceditor-emoticon")) {
                    return content;
                }
                width = $element.attr("width") || style("width");
                height = $element.attr("height") || style("height");
                if ((element.complete && (width || height)) || (width && height)) {
                    attribs = "=" + $element.width() + "x" + $element.height();
                }
                return "[img" + attribs + "]" + $element.attr("src") + "[/img]";
            },
            html: function(token, attrs, content) {
                var undef, width, height, match, attribs = "";
                width = attrs.width;
                height = attrs.height;
                if (attrs.defaultattr) {
                    match = attrs.defaultattr.split(/x/i);
                    width = match[0];
                    height = (match.length === 2 ? match[1] : match[0]);
                }
                if (width !== undef) {
                    attribs += ' width="' + escapeEntities(width, true) + '"';
                }
                if (height !== undef) {
                    attribs += ' height="' + escapeEntities(height, true) + '"';
                }
                return "<img" + attribs + ' src="' + escapeUriScheme(content) + '" />';
            }
        },
        url: {
            allowsEmpty: true,
            tags: {
                a: {
                    href: null
                }
            },
            quoteType: BBCodeParser.QuoteType.never,
            format: function(element, content) {
                var url = element.attr("href");
                if (url.substr(0, 7) === "mailto:") {
                    return '[email="' + url.substr(7) + '"]' + content + "[/email]";
                }
                return "[url=" + url + "]" + content + "[/url]";
            },
            html: function(token, attrs, content) {
                attrs.defaultattr = escapeEntities(attrs.defaultattr, true) || content;
                return '<a href="' + escapeUriScheme(attrs.defaultattr) + '">' + content + "</a>";
            }
        },
        email: {
            quoteType: BBCodeParser.QuoteType.never,
            html: function(token, attrs, content) {
                return '<a href="mailto:' + (escapeEntities(attrs.defaultattr, true) || content) + '">' + content + "</a>";
            }
        },
        quote: {
            tags: {
                blockquote: null
            },
            isInline: false,
            quoteType: BBCodeParser.QuoteType.never,
            format: function(element, content) {
                var author = "";
                var $elm = $(element);
                var $cite = $elm.children("cite").first();
                if ($cite.length === 1 || $elm.data("author")) {
                    author = $cite.text() || $elm.data("author");
                    $elm.data("author", author);
                    $cite.remove();
                    content = this.elementToBbcode($(element));
                    author = "=" + author.replace(/(^\s+|\s+$)/g, "");
                    $elm.prepend($cite);
                }
                return "[quote" + author + "]" + content + "[/quote]";
            },
            html: function(token, attrs, content) {
                if (attrs.defaultattr) {
                    content = "<cite>" + escapeEntities(attrs.defaultattr) + "</cite>" + content;
                }
                return "<blockquote>" + content + "</blockquote>";
            }
        },
        code: {
            tags: {
                code: null
            },
            isInline: false,
            allowedChildren: ["#", "#newline"],
            format: "[code]{0}[/code]",
            html: "<code>{0}</code>"
        },
        left: {
            styles: {
                "text-align": ["left", "-webkit-left", "-moz-left", "-khtml-left"]
            },
            isInline: false,
            format: "[left]{0}[/left]",
            html: '<div align="left">{0}</div>'
        },
        center: {
            styles: {
                "text-align": ["center", "-webkit-center", "-moz-center", "-khtml-center"]
            },
            isInline: false,
            format: "[center]{0}[/center]",
            html: '<div align="center">{0}</div>'
        },
        right: {
            styles: {
                "text-align": ["right", "-webkit-right", "-moz-right", "-khtml-right"]
            },
            isInline: false,
            format: "[right]{0}[/right]",
            html: '<div align="right">{0}</div>'
        },
        justify: {
            styles: {
                "text-align": ["justify", "-webkit-justify", "-moz-justify", "-khtml-justify"]
            },
            isInline: false,
            format: "[justify]{0}[/justify]",
            html: '<div align="justify">{0}</div>'
        },
        youtube: {
            allowsEmpty: true,
            tags: {
                iframe: {
                    "data-youtube-id": null
                }
            },
            format: function(element, content) {
                element = element.attr("data-youtube-id");
                return element ? "[youtube]" + element + "[/youtube]" : content;
            },
            html: '<iframe width="560" height="315" frameborder="0" ' + 'src="https://www.youtube.com/embed/{0}?wmode=opaque" ' + 'data-youtube-id="{0}" allowfullscreen></iframe>'
        },
        rtl: {
            styles: {
                direction: ["rtl"]
            },
            format: "[rtl]{0}[/rtl]",
            html: '<div style="direction: rtl">{0}</div>'
        },
        ltr: {
            styles: {
                direction: ["ltr"]
            },
            format: "[ltr]{0}[/ltr]",
            html: '<div style="direction: ltr">{0}</div>'
        },
        ignore: {}
    };
    sceditorPlugins.bbcode.bbcode = {
        get: function(name) {
            return bbcodes[name] || null;
        },
        set: function(name, bbcode) {
            if (!name || !bbcode) {
                return false;
            }
            bbcode = $.extend(bbcodes[name] || {}, bbcode);
            bbcode.remove = function() {
                delete bbcodes[name];
            }
            ;
            bbcodes[name] = bbcode;
            return this;
        },
        rename: function(name, newName) {
            if (name in bbcodes) {
                bbcodes[newName] = bbcodes[name];
                delete bbcodes[name];
            } else {
                return false;
            }
            return this;
        },
        remove: function(name) {
            if (name in bbcodes) {
                delete bbcodes[name];
            }
            return this;
        }
    };
    $.fn.sceditorBBCodePlugin = function(options) {
        options = options || {};
        if ($.isPlainObject(options)) {
            options.plugins = (options.plugins || "") + "bbcode";
        }
        return this.sceditor(options);
    }
    ;
    sceditorPlugins.bbcode.normaliseColour = _normaliseColour;
    sceditorPlugins.bbcode.formatString = _formatString;
    sceditorPlugins.bbcode.stripQuotes = _stripQuotes;
    sceditorPlugins.bbcode.bbcodes = bbcodes;
    SCEditor.BBCodeParser = BBCodeParser;
}
)(jQuery, window, document);
