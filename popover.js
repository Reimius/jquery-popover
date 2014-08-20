var Popover = function(options) {
	
	var me = this;
	me.openedFromElement = null;
	
	var defaults = {
		openEvent: null,
		closeEvent: null,
		offsetX: 0,
		offsetY: 0
	};
	options = $.extend(defaults, options);

	// HTML floater box
	var header = $(options.header).detach();
	var content = $(options.content).detach();
	var triangle = $('<div class="triangle"></div>').appendTo('body');
	var floater = $('<div class="popover">'
		+ '<div class="header"></div>'
		+ '<div class="content"></div>'
		+ '</div>').appendTo('body');
	$('.header', floater).append(header);
	$('.content', floater).append(content);

	// Document click closes active popover
	$(document).bind("click", function(event) {
		if (me.openedFromElement != me.openedFromElement)
		{
			me.hidePopover();
		}
	});

	me.showPopover = function(button) {
		// Already opened?
		if (me.openedFromElement === button) {
			me.hidePopover();
			return false;
		} else if(me.openedFromElement != null){
			me.openedFromElement.trigger('hidePopover');
		}

		// Set this first for the layout calculations to work.
		floater.css('display', 'block');

		// position and resize
		var leftOff = 0;
		var topOff = 0;
		var docWidth = $(document).width();
		var docHeight = $(document).height();
		var triangleSize = parseInt(triangle.css("border-bottom-width"));
		var contentWidth = floater.outerWidth();
		var contentHeight = floater.outerHeight();
		var buttonWidth = button.outerWidth();
		var buttonHeight = button.outerHeight();
		var offset = button.offset();
		
		if(options.panzoomElement)
		{
			var zoomModifier = options.panzoomElement.panzoom("getMatrix")[0];
			buttonWidth = buttonWidth * zoomModifier;
			buttonHeight = buttonHeight * zoomModifier;
		}

		// Calculate topOff
		topOff = offset.top + buttonHeight + triangleSize;
		var diffHeight = docHeight - (topOff + contentHeight + triangleSize);
		if (diffHeight < 0){
		//resize the floater
			floater.height(floater.height() + diffHeight);
		}

		// Padding against document borders
		var padding = 18;

		// Calculate leftOff
		leftOff = offset.left + (buttonWidth - contentWidth)/2;

		var diffWidth = 0;
		if (leftOff < padding) {
			// out of the document at left
			diffWidth = leftOff - padding;
		} else if (leftOff + contentWidth > docWidth) {
			// left of the screen right
			diffWidth = leftOff + contentWidth - docWidth + padding;
		}

		var positionLeft = offset.left + (buttonWidth / 2) - 25;
		var boxLeft = leftOff - diffWidth + options.offsetX;
		
		if(positionLeft < boxLeft)
			positionLeft = boxLeft + 3;

		// position triangle
		triangle.offset({
			top: topOff + options.offsetY - 50,
			left: positionLeft
		});

		floater.offset({
			top: topOff + options.offsetY,
			left: boxLeft
		});
		floater.show();
		triangle.show();
		//Timeout for webkit transitions to take effect
		window.setTimeout(function() {
			floater.addClass("active");
			// Fixes some browser bugs
			$(window).resize();
		}, 0);
		if ($.isFunction(options.openEvent))
			options.openEvent();
		me.openedFromElement = button;
		return false;
	};
	
	me.hidePopover = function(){
		if(me.openedFromElement != null)
		{
			floater.removeClass("active").attr("style", "").css('display', 'none');
			triangle.attr("style", "").css('display', 'none');
			if ($.isFunction(options.closeEvent)) {
				options.closeEvent();
			}
			me.openedFromElement = null;
			window.setTimeout(function() {
				// Fixes some browser bugs
				$(window).resize();
			}, 0);
			return false;
		}
	};
};
