/* hideshow work in progress https://github.com/davesmiths/hideshow */
(function($) {

	'use strict';

	var resized,
		handleTransitions,

		hideshow_str = 'hideshow',
		hideshow_selector_str = '[data-'+hideshow_str+']',

		max_height_str = 'max-height',
		overflow_str = 'overflow',

		detached_hideshow_str = hideshow_str + '-detached',

		hide_data_str = hideshow_str + '-hide',
		hide_class_str_default = hide_data_str,
		hide_selector_str = '[data-'+hide_data_str+']',

		show_data_str = hideshow_str + '-show',
		show_class_str_default = show_data_str,
		show_selector_str = '[data-'+show_data_str+']',

		intransition_class_str_default = hideshow_str + '-intransition',
		placeholder_data_str = hideshow_str + '-placeholder',
		placeholder_selector_str = '[data-'+placeholder_data_str + ']',

		insert_fn_str = 'insertAfter',

		ready_class_str_default = hideshow_str+'-ready',
		wrap_class_str_default = hideshow_str+'-wrap',

		hsIDCount = 0
	;

	$.fn.hideshow = function(o) {

		var $this = $(this),
			showToggleHTMLDefault = o && o.show ? o.show : 'Show more',
			hideToggleHTMLDefault = o && o.hide ? o.hide : 'Show less'
		;

		if (o === 'resized') {
			resized.call(this);
			return this;
		}

		$this.each(function() {

			var $panel = $(this),
				showToggleHTML = $panel.data(show_data_str) || showToggleHTMLDefault,
				hideToggleHTML = $panel.data(hide_data_str) || hideToggleHTMLDefault,
				generatedToggleHTML = '<a href="">' + showToggleHTML + '</a>',
				panelIsBlock = $panel.css('display') === 'block',
				hideshowID = $panel.data(hideshow_str),
				$toggles,
				$panelWrap,
				panelWrapTag = panelIsBlock ? 'div' : 'span',
				show_class_str = show_class_str_default,
				intransition_class_str = intransition_class_str_default,
				hide_class_str = hide_class_str_default,
				ready_class_str = ready_class_str_default,
				wrap_class_str = wrap_class_str_default,
				extendClass = $panel.data('hideshow-class') ? '-' + $panel.data('hideshow-class') : ''
			;
			if (!extendClass && !panelIsBlock) {
				extendClass = '-inline';
			}

			show_class_str += extendClass;
			intransition_class_str += extendClass;
			hide_class_str += extendClass;
			ready_class_str += extendClass;
			wrap_class_str += extendClass;


			// Only apply hideshow if it hasn't been done previously
			// This allows multiple calls to $('[data-hideshow]').hideshow(); and keeps things good
			if ($panel.hasClass(ready_class_str) === false && $panel.hasClass(ready_class_str_default) === false) {

				// Wrap the panel, capture the panel height with margins uncollapsed
				// and set its max-height to the panel height
				$panelWrap = $panel.wrap('<'+panelWrapTag+' class="'+wrap_class_str+'"></'+panelWrapTag+'>').parent();
				$panelWrap.css(max_height_str, $panelWrap.outerHeight());

				// Add a ready class to the panel
				$panel.data(hide_data_str, true).addClass(ready_class_str);

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

					if ($panel.is('[data-hideshow-before]')) {
						insert_fn_str = 'insertBefore';
					}

					$toggles = $(generatedToggleHTML)[insert_fn_str]($panelWrap).data(hideshow_str+'-for', hideshowID);

					if (!$panel.is(show_selector_str) && !$panel.is(hide_selector_str)) {
						$toggles.data(show_data_str,showToggleHTML).data(hide_data_str, hideToggleHTML);
					}
					else {
						if ($panel.is(show_selector_str)) {
							$toggles.data(show_data_str,showToggleHTML);
						}
						if ($panel.is(hide_selector_str)) {
							$toggles.data(hide_data_str, hideToggleHTML);
						}
					}
				}

				$panel.on('show', function() {
					//console.log('show');
					$panel.data(hide_data_str, false);
					$panel.addClass(intransition_class_str);
					handleTransitions($panel, function() {
						$panel.removeClass(intransition_class_str);
					}).removeClass(hide_class_str).addClass(show_class_str);
				});
				$panel.on('hide', function() {
					//console.log('hide');
					$panel.data(hide_data_str, true);
					$panel.addClass(intransition_class_str);
					handleTransitions($panel, function() {
						$panel.removeClass(intransition_class_str);
					}).removeClass(show_class_str).addClass(hide_class_str);
				});

				// Handle toggle click events
				$toggles.on('click', function() {

					// If the panel is currently hidden, change each toggle
					// to use the show HTML or temporarily remove the toggle
					if ($panel.data(hide_data_str)) {

						$panel.trigger('show');

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

					}
					// Otherwise change each toggle to use the hide HTML
					// or temporarily remove the toggle
					else {

						$panel.trigger('hide');

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

			var $panel = $(this),
				$placeholders
			;

			// Redo the maxheight on the wrapper
			$panel.css(max_height_str, 'none');
			// Where there are placeholders, make sure they take up vertical space
			$placeholders = $panel.find(placeholder_selector_str).html('&nbsp;');
			$panel.parent().css(max_height_str, $panel.outerHeight());
			$placeholders.html('');
			$panel.css(max_height_str, '');

		});

		return this;

	};
	// Super-awesome thanks to Snook
	// https://github.com/snookca/prepareTransition/blob/master/preparetransition.js
	// Modified a bit to suit hideshow needs
	handleTransitions = function($els, callback){

		var cl = ["transition-duration", "-moz-transition-duration", "-webkit-transition-duration", "-o-transition-duration"],
			clLength = 4,
			duration,
			i
		;

		return $els.each(function() {

			var $el = $(this);

			duration = 0;

			// check the various CSS properties to see if a duration has been set
			for (i = 0; i < clLength; i++) {
				duration = duration || (duration = parseFloat($el.css(cl[i])));
			}

			// if I have a duration then add the class
			if (duration > 0) {
				// remove the transition class upon completion
				$el.one('TransitionEnd webkitTransitionEnd transitionend oTransitionEnd', callback);
				$el[0].offsetWidth;
				// check offsetWidth to force the style rendering
			}
			else {
				callback();
			}
		});
	};
}(jQuery));
