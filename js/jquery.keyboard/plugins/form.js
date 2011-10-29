(function($) {
	$.keyboard.plugins.form	= function(e) {
		function trace(e) {
			o = {};
			for (i in e) {
				o[i]	=	e[i];
			}
			console.log(o);
		}
		var input		= null,
			blured		= null,
			delay		= 500,
			shown		= false,
			keyboard	= e.keyboard('keyboard'),
			setFocus	= function(e) {
				input	= e;
				blured	= false;
				if(!shown) {
					keyboard.stop(true, true).slideDown();
					shown	= true;
				}
			},
			unsetFocus	= function(e) {
				// IE trigger setFocus before blur
				if(e.get(0) === input.get(0)) {
					blured	= true;
					// Let time to a potencial blur event
					setTimeout(function() {
						if(blured) {
							input	= null;
							if(shown) {
								keyboard.stop(true, true).slideUp();
								shown	= false;
							}
						}
					}, delay);
				}
			};
		
		// Use
		e.keyboard('bind', 'print', function(e, o) {
			if(input) {
				input.selection().replace(o.text);
			}
		});
		e.keyboard('bind', 'release', function(e, o) {
			if(input !== null) {
				//	Tabulation
				if(o.key.name === 'tab') {
					if(o.cap) {
						newInput	=	$(":input:eq(" + ($(":input").index(input) - 1) + ")");
					} else {
						newInput	=	$(":input:eq(" + ($(":input").index(input) + 1) + ")");
					}
					if(newInput.length) {
						input		= newInput;
					} else {
						return	input.trigger('blur');
					}
				//	Submition
				} else if(o.key.name === 'enter') {
					var form	= input.parents('form');
					if(form.length() > 0) {
						form.submit();
					}
				//	Delete backward
				} else if(o.key.name === 'backSpace') {
					if(input.selection().length()) {
						input.selection().clear();
					} else {
						input.selection().set(input.selection().start() - 1, 1).clear();
					}
				//	Move carret
				} else if(o.key.name === 'leftArrow') {
					input.selection().set(input.selection().start() - 1, 0);
				} else if(o.key.name === 'rightArrow') {
					input.selection().set(input.selection().start() + 1, 0);
				}
				input.trigger('focus');
			}
		});
		
		// Show
		$('input[type!="submit"],textarea').live('focus', function(e) {
			setFocus($(e.target));
		});
		
		// Hide
		$('[type="text"],textarea').bind('blur.keyboard', function(e) {
			unsetFocus($(e.target));
		});
		
		// Keyboard init
		if(!keyboard.attr('tabindex')) {
			if(input) {
				keyboard.attr('tabindex', '0');
			}
		}
		keyboard.bind('focus', function() {
					input.trigger('focus');
				})
				.bind('mousedown.keyboard', function() {
					blured	=	false;
					return	false;
				})
				.hide();
	};
})(jQuery);