/* hideshow work in progress https://github.com/davesmiths/hideshow */
(function($) {

	'use strict';

	var resized,
		max_height_str = 'max-height',
		padding_str = 'padding',
		hideshow_str = 'hideshow',
		hide_data_str = hideshow_str + '-hide',
		show_data_str = hideshow_str + '-show',
		hideshow_selector_str = '[data-'+hideshow_str+']',
		hide_selector_str = '[data-'+hide_data_str+']',
		show_selector_str = '[data-'+show_data_str+']'
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
				showHTML = $hs.data(show_data_str) || 'Show more',
				hideHTML = $hs.data(hide_data_str) || 'Hide',
				linkHTML = '<p><a href="">' + showHTML + '</a></p>',
				hideshowID = $hs.data(hideshow_str),
				$els,
				$wrap
			;

			$wrap = $hs.wrap('<div class="'+hideshow_str+'-wrap"></div>').parent();
			$wrap.css(padding_str,'1px 0');
			$wrap.css(max_height_str, $wrap.outerHeight()-2);
			$wrap.css(padding_str,'');

			$hs.data(hide_data_str, true).addClass(hideshow_str+'-ready');

			// Does the hideshow panel have an id
			if (hideshowID) {

				// Get elements that point to the panel
				$els = $('[data-'+hideshow_str+'-for="'+hideshowID+'"]');

				$els.each(function() {

					var $el = $(this)
						,show
						,hide
					;

					// If el has the data-hideshow-hide|show attribute but no value is set, use the default
					if ($el.is(hide_selector_str) && !$el.data(hide_data_str)) {
						$el.data(hide_data_str, hideHTML);
					}
					if ($el.is(show_selector_str) && !$el.data(show_data_str)) {
						$el.data(show_data_str, showHTML);
					}

					// Show only the hide HTML
					if (!$el.data(hide_data_str) || $el.data(show_data_str)) {
						$el.html($el.data(show_data_str));
					}

				});

			}

			// If no elements were found that point to the panel, insert a hideshow link before the panel
			if ($els === undefined || $els.length === 0) {
				$els = $(linkHTML).insertBefore($wrap).find('a').data(show_data_str,showHTML).data(hide_data_str, hideHTML);
			}

			// Handle click events
			$els.on('click', function() {

				// If the panel is currently hidden, change each linked element to use the show HTML
				if ($hs.data(hide_data_str)) {
					$els.each(function() {
						var $el = $(this);
						if ($el.data(hide_data_str)) {
							$el.html($el.data(hide_data_str));
						}
						else {
							$el.html('');
						}
					});

					// Update the panel
					$hs.data(hide_data_str, false).removeClass(hide_data_str).addClass(show_data_str);
				}
				// Otherwise change each linked element to use the hide HTML
				else {
					$els.each(function() {
						var $el = $(this);
						$el.html($el.data(show_data_str) ? $el.data(show_data_str) : '');
					});
					$hs.data(hide_data_str, true).removeClass(show_data_str).addClass(hide_data_str);
				}

				return false;

			});

		});

		return this;

	};


	// To help cope with web fonts loading and resizing windows, though I haven't put any window.resize stuff in here
	// Call $('[data-hideshow]').hideshow('resized'); to run
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
