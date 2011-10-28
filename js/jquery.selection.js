// jQuery Plugin Boilerplate
// A boilerplate for jumpstarting jQuery plugins development
// version 1.0, Jun 24th, 2011
// by François Germain

(function($) {
	function trace(node) {
		var e	= {};
		for(i in node) {
			e[i]	=	node[i];
		}
		console.log(e);
	}
	// Start
	function getSelectionStart(node) {
		if('selectionStart' in node) {
			return	node.selectionStart;
		} else if('getSelection' in document) {
			if(!node.ownerDocument.getSelection().rangeCount) {
				return	node.innerText.length;
			} else {
				return	node.ownerDocument.getSelection().getRangeAt(0).startOffset;
			}
		} else if('selection' in document) {
			console.log('IE');
		}
	}
	function setSelectionStart(node, start) {
		if('selectionStart' in node) {
			return	node.selectionStart	= start;
		} else if('getSelection' in document) {
			var	selection	= node.ownerDocument.getSelection(),
				range		= document.createRange(),
				end			= getSelectionEnd(node);
			selection.removeAllRanges();
	        range.setStart(node.firstChild, start);
	        range.setEnd(node.firstChild, end);
	        selection.addRange(range);
		} else if('selection' in document) {
			console.log('IE');
		}
	}
	
	// End
	function getSelectionEnd(node) {
		if('selectionStart' in node) {
			return	node.selectionEnd;
		} else if('getSelection' in document) {
			if(!node.ownerDocument.getSelection().rangeCount) {
				return	node.innerText.length;
			} else {
				return	node.ownerDocument.getSelection().getRangeAt(0).endOffset;
			}
		} else if('selection' in document) {
			console.log('IE');
		}
	}
	function setSelectionEnd(node, end) {
		if('selectionStart' in node) {
			return	node.selectionEnd	= end;
		} else if('getSelection' in document) {
			var	selection	= node.ownerDocument.getSelection(),
				range		= document.createRange(),
				start		= getSelectionStart(node);
			selection.removeAllRanges();
	        range.setStart(node.firstChild, start);
	        range.setEnd(node.firstChild, end);
	        selection.addRange(range);
		} else if('selection' in document) {
			console.log('IE');
		}
	}
	
	// length
	function getSelectionLength(node) {
		return	getSelectionEnd(node) - getSelectionStart(node);
	}
	function setSelectionLength(node, length) {
		setSelectionEnd(node, getSelectionStart(node) + length);
	}
	
	function set(node, start, n, end) {
		setSelectionStart(node, start);
		if(end) {
			setSelectionEnd(node, n);
		} else {
			setSelectionLength(node, n);
		}
	}
	
	function replace(node, replace) {
		var	el	= $(node),
			str;
		if(el.is('input,textarea')) {
			str	= el.val();
			el.val(	str.substring(0, getSelectionStart(node))
				+	replace
				+	str.substring(getSelectionEnd(node)));
		} else {
			str	= el.text();
			console.log(getSelectionStart(node));
			el.text(str.substring(0, getSelectionStart(node))
				+	replace
				+	str.substring(getSelectionEnd(node)));
		}
	}
	
	$.fn.selection = function(length) {
		var node	= this.jquery ? this.get(0) : this;
		return	{
			start: function(start) {
				if(typeof start !== 'undefined') {
					setSelectionStart(node, start);
					return	this;
				} else {
					return	getSelectionStart(node);
				}
			},
			end: function(end) {
				if(typeof end !== 'undefined') {
					setSelectionEnd(node, end);
					return	this;
				} else {
					return	getSelectionEnd(node);
				}
			},
			length: function(length) {
				if(typeof length !== 'undefined') {
					setSelectionLength(node, length);
					return	this;
				} else {
					return	getSelectionLength(node);
				}
			},
			set: function(start, n, end) {
				set(node, start, n, end);
				return	this;
			},
			clear: function() {
				this.replace('');
			},
			replace: function(string) {
				var start	= getSelectionStart(node);
				replace(node, string);
				set(node, start + string.length, 0);
				return	this;
			},
			before: function(string) {
				var start	= getSelectionStart(node);
				setSelectionLength(node, 0);
				replace(node, string);
				set(node, start + string.length, 0);
			},
			after: function(string) {
				var start	= getSelectionEnd(node);
				set(node, start, 0);
				replace(node, string);
				set(node, start + string.length, 0);
			}
		};
	}

})(jQuery);