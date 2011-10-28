(function($) {
	$.keyboard.keyboards.qwerty	= [
		['@','1','2','3','4','5','6','7','8','9','0',{text:'⌫',name:'backSpace',action:function(e){return false;}}],
		[{text:'⇥', cap: {text:'⇤'},name:'tab', action:false},'q','w','e','r','t','y','u','i','o','p',{text:'⏎',name:'return',action:false}],
		[{text:'⇪',name:'capsLock',action:function(e){e.keyboard('capToggle',true); return false;}},'a','s','d','f','g','h','j','k','l',{text:',', alt:[':',';']}],
		[{text:'⇧',name:'leftShift',action:function(e){e.keyboard('capToggle'); return false;}},'z','x','c','v','b','n','m',{text:'.', alt:['?','!',';']},'\'',{text:':)', alt:[';)','X)','8)',':(']},{text:'⇧',name:'rightShift',action:function(e){e.keyboard('capToggle'); return false;}}],
		[{text:' ',name:'space'},{text:'←',action:false,name:'leftArrow'},{text:'→',action:false,name:'rightArrow'}]
	];
})(jQuery);