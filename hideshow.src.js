/* hideshow work in progress https://github.com/davesmiths/hideshow */
(function($) {

	'use strict';

	var resized;

	$.fn.hideshow = function(o) {

		var $this = $(this)
		;

		if (o === 'resized') {
			resized.call(this);
			return this;
		}

		$this.each(function() {

			var $hs = $(this)
				,showHTML = $hs.data('hideshow-show') || 'Read more'
				,hideHTML = $hs.data('hideshow-hide') || 'Read less'
				,linkHTML = '<a href="">' + showHTML + '</a>'
				,hideshowID = $hs.data('hideshow')
				,$links
				,$wrap
			;

			$wrap = $hs.wrap('<div class="hideshow-wrap"></div>').parent();

			$wrap.css('max-height', $hs.outerHeight());

			$hs.data('hideshow-hide', true).addClass('hideshow-primed');

			if (hideshowID) {
				// Look for links for it
				$links = $('[data-hideshow-for="' + hideshowID + '"]');
				$links.each(function() {
					var $link = $(this)
					;

					if ($link.is('a') === false) {
						$link = $link.wrap('<a href=""></a>');
					}
					$link.html($link.data('hideshow-show') || showHTML);
				});
			}
			if ($links === undefined || $links.length === 0) {
				$links = $(linkHTML).insertBefore($hs);
			}

			$links.on('click', function() {

				if ($hs.data('hideshow-hide')) {
					$links.each(function() {
						var $each = $(this);
						$each.html($each.data('hideshow-hide') || hideHTML);
					});
					$hs.data('hideshow-hide', false).removeClass('hideshow-hide').addClass('hideshow-show');
				}
				else {
					$links.each(function() {
						var $each = $(this);
						$each.html($each.data('hideshow-show') || showHTML);
					});
					$hs.data('hideshow-hide', true).removeClass('hideshow-show').addClass('hideshow-hide');
				}

				return false;
			});

		});

		return this;

	};

	// To help cope with web fonts loading and resizing windows, though I haven't put any window.resize stuff in here
	// Simple call $('[data-hideshow]').hideshow('resized'); to run
	resized = function() {


		$(this).each(function() {

			var $hs = $(this)
			;

			// Redo the maxheight on the wrapper
			$hs.css('max-height', 'none');
			$hs.parent().css('max-height', $hs.outerHeight());
			$hs.css('max-height', '');

		});

		return this;

	};

}(jQuery));
