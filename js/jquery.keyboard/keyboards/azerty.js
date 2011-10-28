(function($) {
	$.keyboard.keyboards.azerty	= [
		['@','1','2','3','4','5','6','7','8','9','0',{text:'⌫',name:'backSpace',action:function(e){return false;}}],
		[{text:'⇥', cap: {text:'⇤'},name:'tab', action:false},{text:'a', alt:['à']},'z',{text:'e', alt:['é','è','ê']},'r','t','y',{text:'u',alt:['ù']},'i','o','p',{text:'⏎',name:'return',action:false}],
		[{text:'⇪',name:'capsLock',action:function(e){e.keyboard('capToggle',true); return false;}},'q','s','d','f','g','h','j','k','l','m'],
		[{text:'⇧',name:'leftShift',action:function(e){e.keyboard('capToggle'); return false;}},'w','x','c','v','b','n',{text:',', alt:[':',';']},{text:'.', alt:['?','!',';']},'\'',{text:':)', alt:[';)','X)','8)',':(']},{text:'⇧',name:'rightShift',action:function(e){e.keyboard('capToggle'); return false;}}],
		[{text:' ',name:'space'},{text:'←',action:false,name:'leftArrow'},{text:'→',action:false,name:'rightArrow'}]
	];
})(jQuery);