/* hideshow work in progress https://github.com/davesmiths/hideshow */
(function($) {

	'use strict';

	var resized,
		max_height_str = 'max-height',
		overflow_str = 'overflow',
		hideshow_str = 'hideshow',
		detached_hideshow_str = hideshow_str + '-detached',
		hide_data_str = hideshow_str + '-hide',
		show_data_str = hideshow_str + '-show',
		placeholder_data_str = hideshow_str + '-placeholder',
		hideshow_selector_str = '[data-'+hideshow_str+']',
		hide_selector_str = '[data-'+hide_data_str+']',
		show_selector_str = '[data-'+show_data_str+']',
		hsIDCount = 0
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

			// Only apply hideshow if it hasn't been done previously
			// This allows multiple calls to $('[data-hideshow]').hideshow(); and keeps things good
			if ($hs.hasClass(hideshow_str+'-ready') === false) {

				$wrap = $hs.wrap('<div class="'+hideshow_str+'-wrap"></div>').parent();

				$wrap.css(overflow_str,'hidden');
				$wrap.css(max_height_str, $wrap.outerHeight());
				$wrap.css(overflow_str,'');

				$hs.data(hide_data_str, true).addClass(hideshow_str+'-ready');

				// Does the hideshow panel have an id
				if (hideshowID) {

					// Get elements that point to the panel
					$els = $('[data-'+hideshow_str+'-for="'+hideshowID+'"]');

					$els.each(function() {

						var $el = $(this),
							$placeholder
						;

						// If el has the data-hideshow-hide|show attribute but no value is set, use the default
						if ($el.is(hide_selector_str) && !$el.data(hide_data_str)) {
							$el.data(hide_data_str, hideHTML);
						}
						if ($el.is(show_selector_str) && !$el.data(show_data_str)) {
							$el.data(show_data_str, showHTML);
						}

						// Apply the HTML
						$el.html($el.data(show_data_str));

						// Hide the hide
						if ($el.data(hide_data_str)) {
							$placeholder = $el.before('<span data-'+placeholder_data_str+'></span>').prev();
							$el.detach().data(detached_hideshow_str, true).data(placeholder_data_str, $placeholder);
						}

					});

				}
				else {
					hideshowID = hideshow_str + hideshow_str + hsIDCount;
					hsIDCount += 1;
					$hs.data(hideshow_str, hideshowID);
				}

				// If no elements were found that point to the panel, insert a hideshow link before the panel
				if ($els === undefined || $els.length === 0) {
					$els = $(linkHTML).insertBefore($wrap).find('a').data(show_data_str,showHTML).data(hide_data_str, hideHTML).data(hideshow_str+'-for', hideshowID);
				}

				// Handle click events
				$els.on('click', function() {

					// If the panel is currently hidden, change each linked element to use the show HTML
					if ($hs.data(hide_data_str)) {

						$els.each(function() {

							var $el = $(this),
								$placeholder
							;

							if ($el.data(hide_data_str)) {
								if ($el.data(detached_hideshow_str)) {
									$el.data(placeholder_data_str).replaceWith($el);
								}
								$el.html($el.data(hide_data_str));
							}
							else {
								$placeholder = $el.before('<span data-'+placeholder_data_str+'></span>').prev();
								$el.detach().data(detached_hideshow_str, true).data(placeholder_data_str, $placeholder);
							}

						});

						// Update the panel
						$hs.data(hide_data_str, false).removeClass(hide_data_str).addClass(show_data_str);

					}
					// Otherwise change each linked element to use the hide HTML
					else {

						$els.each(function() {

							var $el = $(this),
								$placeholder;

							if ($el.data(show_data_str)) {
								if ($el.data(detached_hideshow_str)) {
									$el.data(placeholder_data_str).replaceWith($el);
								}
								$el.html($el.data(show_data_str));
							}
							else {
								$placeholder = $el.before('<span data-'+placeholder_data_str+'></span>').prev();
								$el.detach().data(detached_hideshow_str, true).data(placeholder_data_str, $placeholder);
							}

						});
						$hs.data(hide_data_str, true).removeClass(show_data_str).addClass(hide_data_str);
					}

					return false;

				});

			}

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
