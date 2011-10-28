// jQuery Plugin Boilerplate
// A boilerplate for jumpstarting jQuery plugins development
// version 1.0, Jun 24th, 2011
// by François Germain

(function($) {

	//	Static private vars
	var pluginName = 'keyboard',
		emptyKey = {
			//	Static public vars
			text:	'',
			alt:	[],
			name:	''
		};

	$[pluginName] = function(dom, options) {
		var
		plugin		= this,
		event		= $(document.createElement('div')),
		dom			= dom,
		element		= $(dom),
		defaults	= {
			elements:	{
				keyboard:	'<div class="keyboard"></div>',
				row:		'<ul class="keyboard-row"></ul>',
				key:		'<li class="keyboard-key"></li>',
				alt:		'<ul class="keyboard-alt"></ul>',
				altKey:		'<li class="keyboard-alt-key"></li>'
			},
			altDelay:		500,
			classPrefix:	'keyboard',
			keyboard: [],
			plugin: function(e) {
				e[pluginName]('bind', 'print', function(e, o) {
					console.log(o.text);
				});
			}
		},
		settings	= {},
		//TODO: clean all this vars
		keyboard,
		timer	= NaN,
		rows	= [],
		cap		= false,
		locked	= false,
		keyPressed,
		
		// Private methods
		init = function(rows) {
			// Settings
			settings	= $.extend({}, defaults, options);
			if(typeof settings.plugin !== 'object') {
				settings.plugin	= [settings.plugin];
			}
			
			// Keyboard
			keyboard	= $(settings.elements.keyboard).appendTo(element);
			plugin.methods.keyboard(settings.keyboard);
			
			// Events
			$(document).bind('mouseup.'+pluginName, function(){
				releaseKey();
			});
			
			// Plugins
			for(i in settings.plugin) {
				plugin.methods.plug(settings.plugin[i]);
			}
		},
		releaseKey = function(key, alt) {
			if(keyPressed) {
				keyPressed.removeClass(settings.classPrefix + '-held');
				keyPressed	= null;
				clearTimeout(timer);
				timer		= NaN;
				if(typeof key !== 'undefined') {
					if(typeof alt === 'undefined') {
						alt	= false;
					}
					var	text	= alt !== false
								? (cap ? key.cap.alt[alt] : key.alt[alt])
								: (cap ? key.cap.text : key.text);
					if(key.action !== false && (!key.action || key.action(element) !== false)) {
						trigger('print', {key: key, cap: cap, alt:alt, text: text});
						if(!locked && cap) {
							plugin.methods.capToggle();
						}
					}
					trigger('release', {key: key, cap: cap, alt:alt, text: text});
				}
			}
		},
		isValidRow	= function(row) {
			return	typeof row === 'number' && row === Math.round(row);
		},
		newKeyboard = function(newKeyboard) {
			keyboard.html('');
			rows	= [];
			for(i in newKeyboard) {
				plugin.methods.addRow(newKeyboard[i]);
			}
		},
		newRow = function(row) {
			var i	= rows.length;
			while(i <= row) {
				rows.push([]);
				keyboard.append(settings.elements.row);
				i++;
			}
		},
		newKey = function(row, key) {
			if(typeof key !== 'object') {
				key	= {text: key};
			}
			key	= $.extend({}, emptyKey, key);
			if(typeof key.cap !== 'object') {
				if(typeof key.cap !== 'undefined') {
					key.cap	= {text: key.cap};
				} else {
					key.cap	= {};
				}
			}
			if(typeof key.cap.alt === 'undefined') {
				key.cap.alt	= [];
				for(var i in key.alt) {
					key.cap.alt[i]	= key.alt[i].toUpperCase();
				}
			}
			if(typeof key.cap.text === 'undefined') {
				key.cap.text	= key.text.toUpperCase()
			}
			rows[row].push(key);
			var keyEl	= $(settings.elements.key).appendTo(keyboard.children(':eq('+row+')'));
			keyEl.data(pluginName+'-key', key);
			keyEl.text(cap ? key.cap.text : key.text);
			if(key.name) {
				keyEl.addClass(settings.classPrefix + '-key-' + key.name);
			}
			updateAlts(keyEl);
			keyEl.bind('mouseup.' + pluginName, function() {
				if(keyPressed) {
					releaseKey(key);
				}
			});
			keyEl.bind('mousedown.' + pluginName, function() {
				keyPressed	=	keyEl;
				timer	=	setTimeout(function() {
					keyEl.addClass(settings.classPrefix + '-held');
				}, settings.altDelay);
			});
		},
		updateAlts = function(keyEl) {
			var key = keyEl.data(pluginName + '-key');
			if(key.alt) {
				var	altEl	= $(settings.elements.alt).appendTo(keyEl);
				for(var k in key.alt) {
					var	altKeyEl	= $(settings.elements.altKey).appendTo(altEl);
					altKeyEl.data(pluginName + '-key', key);
					altKeyEl.data(pluginName + '-alt', k);
					altKeyEl.text(cap ? key.cap.alt[k] : key.alt[k]);
					altKeyEl.bind('mouseup.' + pluginName, function() {
						releaseKey($(this).data(pluginName + '-key'), $(this).data(pluginName + '-alt'));
					});
				}
			}
		},
		updateKeys = function() {
			for(var i in rows) {
				var rowEl	= keyboard.children(':eq('+i+')');
				for(j in rows[i]) {
					var key			= rows[i][j];
					var keyEl		= rowEl.children(':eq('+j+')');
					if(cap) {
						keyEl.text(key.cap.text);
					} else {
						keyEl.text(key.text);
					}
					updateAlts(keyEl);
				}
			}
		},
		trigger	= function() {
			arguments[0]	= pluginName + '-' +  arguments[0];
			element.trigger.apply(element, arguments);
			return	dom;
		};
		
		// Public methods
		plugin.methods = {
			bind: function() {
				arguments[0]	= pluginName + '-' +  arguments[0];
				element.bind.apply(element, arguments);
				return	dom;
			},
			addRow: function(keys) {
				row	= rows.length;
				newRow(row);
				for(var i in keys) {
					newKey(row, keys[i]);
				}
				return	dom;
			},
			addKeys: function(row, keys) {
				if(isValidRow(row)) {
					if(!rows[row]) {
						newRow(row);
					}
					for(var i in keys) {
						newKey(row, keys[i]);
					}
				}
				return	dom;
			},
			addKey: function(row, key) {
				if(isValidRow(row)) {
					if(!rows[row]) {
						newRow(row);
					}
					newKey(row, key);
				}
				return	dom;
			},
			plug: function(newPlugin) {
				if(typeof newPlugin === 'string') {
					newPlugin	= $[pluginName].plugins[newPlugin];
				}
				if(typeof newPlugin === 'function') {
					newPlugin(element);
				}
			},
			capToggle: function(lock) {
				cap		= !cap;
				locked	= Boolean(lock) && cap;
				if(cap && locked) {
					element.addClass('keyboard-capsLocked');
					element.removeClass('keyboard-caps');
				} else if(cap) {
					element.addClass('keyboard-caps');
					element.removeClass('keyboard-capsLocked');
				} else {
					element.removeClass('keyboard-caps');
					element.removeClass('keyboard-capsLocked');
				}
				updateKeys();
				return	dom;
			},
			cap: function(lock) {
				cap		= true;
				locked	= Boolean(lock);
				if(cap && locked) {
					element.addClass('keyboard-capsLocked');
					element.removeClass('keyboard-caps');
				} else {
					element.addClass('keyboard-caps');
					element.removeClass('keyboard-capsLocked');
				}
				updateKeys();
				return	dom;
			},
			unCap: function() {
				cap		= false;
				locked	= false;
				element.removeClass('keyboard-caps');
				element.removeClass('keyboard-capsLocked');
				updateKeys();
				return	dom;
			},
			keyboard: function(def) {
				if(typeof def === 'string') {
					def	= $[pluginName].keyboards[def];
				}
				if(typeof def === 'object') {
					newKeyboard(def);
				}
				return	keyboard;
			}
		};

		element.data(pluginName, plugin);
		init();

	}
	$[pluginName].keyboards	= {};
	$[pluginName].plugins	= {};

	$.fn[pluginName] = function(options) {
		var	args	= arguments,
			chain	= this;
        this.each(function() {
        	var	i	=	$(this);
            if (undefined == (plugin = i.data(pluginName))) {
                var plugin = new $[pluginName](this, options);
            }
            if (plugin.methods[options]) {
            	if((r = plugin.methods[options].apply( plugin, Array.prototype.slice.call( args, 1 ))) !== this) {
	            	chain	= r;
	            	return	false;
            	}
            }
        });
		return	chain;
	}

})(jQuery);