/* hideshow work in progress https://github.com/davesmiths/hideshow */
(function($) {

	'use strict';

	var resized,
		max_height_str = 'max-height',
		padding_str = 'padding',
		hideshow_str = 'hideshow',
		hideshow_hide_str = hideshow_str + '-hide',
		hideshow_show_str = hideshow_str + '-show'
	;

	$.fn.hideshow = function(o) {

		var $this = $(this)
		;

		if (o === 'resized') {
			resized.call(this);
			return this;
		}

		$this.each(function() {

			var $hs = $(this),
				showHTML = $hs.data(hideshow_show_str) || 'Show more',
				hideHTML = $hs.data(hideshow_hide_str) || 'Hide',
				linkHTML = '<p><a href="">' + showHTML + '</a></p>',
				hideshowID = $hs.data(hideshow_str),
				$links,
				$wrap
			;

			$wrap = $hs.wrap('<div class="'+hideshow_str+'-wrap"></div>').parent();
			$wrap.css(padding_str,'1px 0');
			$wrap.css(max_height_str, $wrap.outerHeight()-2);
			$wrap.css(padding_str,'');

			$hs.data(hideshow_hide_str, true).addClass(hideshow_str+'-primed');

			if (hideshowID) {
				// Look for links for it
				$links = $('[data-'+hideshow_str+'-for="'+hideshowID+'"]');
				$links.each(function() {
					var $link = $(this)
					;

					if ($link.is('a') === false) {
						$link = $link.wrap('<a href=""></a>');
					}

					if ($link.is('[data-'+hideshow_hide_str+']') && !$link.data(hideshow_hide_str)) {
						$link.data(hideshow_hide_str, hideHTML);
					}
					if ($link.is('[data-'+hideshow_show_str+']') && !$link.data(hideshow_show_str)) {
						$link.data(hideshow_show_str, showHTML);
					}

					if (!$link.data(hideshow_hide_str) || $link.data(hideshow_show_str)) {
						$link.html($link.data(hideshow_show_str));
					}

				});
			}
			if ($links === undefined || $links.length === 0) {
				$links = $(linkHTML).insertBefore($wrap).find('a').data(hideshow_show_str,showHTML).data(hideshow_hide_str, hideHTML);
			}

			$links.on('click', function() {

				if ($hs.data(hideshow_hide_str)) {
					$links.each(function() {
						var $each = $(this);
						$each.html($each.data(hideshow_hide_str) ? $each.data(hideshow_hide_str) : '');
					});
					$hs.data(hideshow_hide_str, false).removeClass(hideshow_hide_str).addClass(hideshow_show_str);
				}
				else {
					$links.each(function() {
						var $each = $(this);
						$each.html($each.data(hideshow_show_str) ? $each.data(hideshow_show_str) : '');
					});
					$hs.data(hideshow_hide_str, true).removeClass(hideshow_show_str).addClass(hideshow_hide_str);
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
			$hs.css(max_height_str, 'none');
			$hs.parent().css(max_height_str, $hs.outerHeight());
			$hs.css(max_height_str, '');

		});

		return this;

	};

}(jQuery));
