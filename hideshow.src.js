/* hideshow work in progress https://github.com/davesmiths/hideshow */
(function($) {

	'use strict';

	var resized,
		max_height_str = 'max-height',
		overflow_str = 'overflow',
		hideshow_str = 'hideshow',
		toggle_wrap_data_str = hideshow_str + '-toggle-wrap',
		detached_hideshow_str = hideshow_str + '-detached',
		hide_data_str = hideshow_str + '-hide',
		show_data_str = hideshow_str + '-show',
		placeholder_data_str = hideshow_str + '-placeholder',
		hideshow_selector_str = '[data-'+hideshow_str+']',
		hide_selector_str = '[data-'+hide_data_str+']',
		show_selector_str = '[data-'+show_data_str+']',
		toggle_wrap_selector_str = '[data-'+toggle_wrap_data_str+']',
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

			var $panel = $(this),
				showToggleHTML = $panel.data(show_data_str) || 'Show more',
				hideToggleHTML = $panel.data(hide_data_str) || 'Hide',
				toggleHTML = '<a href="">' + showToggleHTML + '</a>',
				toggleWrapHTML = $panel.data(toggle_wrap_data_str) || '<p></p>',
				hideshowID = $panel.data(hideshow_str),
				$toggles,
				$wrap
			;


			// Only apply hideshow if it hasn't been done previously
			// This allows multiple calls to $('[data-hideshow]').hideshow(); and keeps things good
			if ($panel.hasClass(hideshow_str+'-ready') === false) {

				if ($panel.is(toggle_wrap_selector_str) && !$panel.data(toggle_wrap_data_str)) {
					toggleWrapHTML = '';
				}

				// Wrap the panel, capture the panel height with margins uncollapsed
				// and set its max-height to the panel height
				$wrap = $panel.wrap('<div class="'+hideshow_str+'-wrap"></div>').parent();
				$wrap.css(overflow_str,'hidden');
				$wrap.css(max_height_str, $wrap.outerHeight());
				$wrap.css(overflow_str,'');

				// Add a ready class to the panel
				$panel.data(hide_data_str, true).addClass(hideshow_str+'-ready');

				// If the panel has an id
				//		Check for toggles for the panel, set their HTML
				//		and temporarily remove any hide toggles
				// Else
				//		There are no toggles for the panel, but
				//		there will be so generate a panel id and apply to the panel
				if (hideshowID) {

					// Get any toggles for the panel
					$toggles = $('[data-'+hideshow_str+'-for="'+hideshowID+'"]');
					$toggles.each(function() {

						var $toggle = $(this),
							$placeholder
						;

						// If the toggle has the data-hideshow-hide|show attribute
						// but no value is set, use the default HTML
						if ($toggle.is(hide_selector_str) && !$toggle.data(hide_data_str)) {
							$toggle.data(hide_data_str, hideToggleHTML);
						}
						if ($toggle.is(show_selector_str) && !$toggle.data(show_data_str)) {
							$toggle.data(show_data_str, showToggleHTML);
						}

						// Apply the HTML to the toggle
						$toggle.html($toggle.data(show_data_str));

						// Temporarily remove hide only toggles
						if ($toggle.data(hide_data_str) && !$toggle.data(show_data_str)) {
							$placeholder = $toggle.before('<span data-'+placeholder_data_str+'></span>').prev();
							$toggle.detach().data(detached_hideshow_str, true).data(placeholder_data_str, $placeholder);
						}

					});

				}
				else {
					hideshowID = hideshow_str + hideshow_str + hsIDCount;
					hsIDCount += 1;
					$panel.data(hideshow_str, hideshowID);
				}

				// If no toggles for the panel were found, insert
				// a show/hide toggle before the panel
				if ($toggles === undefined || $toggles.length === 0) {
					$toggles = $(toggleHTML).insertBefore($wrap).wrapAll(toggleWrapHTML).data(show_data_str,showToggleHTML).data(hide_data_str, hideToggleHTML).data(hideshow_str+'-for', hideshowID);
				}

				// Handle toggle click events
				$toggles.on('click', function() {

					// If the panel is currently hidden, change each toggle
					// to use the show HTML or temporarily remove the toggle
					if ($panel.data(hide_data_str)) {

						$toggles.each(function() {

							var $toggle = $(this),
								$placeholder
							;

							if ($toggle.data(hide_data_str)) {
								if ($toggle.data(detached_hideshow_str)) {
									$toggle.data(placeholder_data_str).replaceWith($toggle);
								}
								$toggle.html($toggle.data(hide_data_str));
							}
							else {
								$placeholder = $toggle.before('<span data-'+placeholder_data_str+'></span>').prev();
								$toggle.detach().data(detached_hideshow_str, true).data(placeholder_data_str, $placeholder);
							}

						});

						// Update the panel
						$panel.data(hide_data_str, false).removeClass(hide_data_str).addClass(show_data_str);

					}
					// Otherwise change each toggle to use the hide HTML
					// or temporarily remove the toggle
					else {

						$toggles.each(function() {

							var $toggle = $(this),
								$placeholder;

							if ($toggle.data(show_data_str)) {
								if ($toggle.data(detached_hideshow_str)) {
									$toggle.data(placeholder_data_str).replaceWith($toggle);
								}
								$toggle.html($toggle.data(show_data_str));
							}
							else {
								$placeholder = $toggle.before('<span data-'+placeholder_data_str+'></span>').prev();
								$toggle.detach().data(detached_hideshow_str, true).data(placeholder_data_str, $placeholder);
							}

						});
						$panel.data(hide_data_str, true).removeClass(show_data_str).addClass(hide_data_str);
					}

					return false;

				});

			}

		});

		return this;

	};


	// To help cope with web fonts loading and resizing windows, though I
	// haven't put any window.resize stuff in here, call
	// $('[data-hideshow]').hideshow('resized'); to recalculate the panel
	// max height and apply to the wrap
	resized = function() {

		$(this).each(function() {

			var $panel = $(this)
			;

			// Redo the maxheight on the wrapper
			$panel.css(max_height_str, 'none');
			$panel.parent().css(max_height_str, $panel.outerHeight());
			$panel.css(max_height_str, '');

		});

		return this;

	};

}(jQuery));
