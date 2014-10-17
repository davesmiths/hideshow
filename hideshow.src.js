/* hideshow work in progress https://github.com/davesmiths/hideshow */
(function($) {

	'use strict';

	var resized,
		handleTransitions,
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
		placeholder_selector_str = '[data-'+placeholder_data_str + ']',
		insert_fn_str = 'insertAfter',
		hsIDCount = 0
	;

	var el = document.createElement('fakeelement');

	var transitions = {
		'transition':'transitionend',
		'OTransition':'oTransitionEnd',
		'MozTransition':'transitionend',
		'WebkitTransition':'webkitTransitionEnd'
	}
//el.click = 'return;';
console.log(el.style.transitionend);
console.log(el.style.bob);


	if (('ontransitionend' in el)) {
		console.log('asd');
	}

	$.fn.hideshow = function(o) {

		var $this = $(this),
			showToggleHTMLDefault = o && o.show ? o.show : 'Show more',
			hideToggleHTMLDefault = o && o.hide ? o.hide : 'Show less',
			generatedToggleWrapHTMLDefault = o && o.toggleWrap ? o.toggleWrap : '<p></p>'
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
				generatedToggleWrapHTML = '',
				panelIsBlock = $panel.css('display') === 'block',
				hideshowID = $panel.data(hideshow_str),
				$toggles,
				$panelWrap,
				panelWrapTag = panelIsBlock ? 'div' : 'span'
			;
			if (panelIsBlock) {
				generatedToggleWrapHTML = $panel.data(toggle_wrap_data_str) || generatedToggleWrapHTMLDefault;
			}

			// Only apply hideshow if it hasn't been done previously
			// This allows multiple calls to $('[data-hideshow]').hideshow(); and keeps things good
			if ($panel.hasClass(hideshow_str+'-ready') === false) {

				if ($panel.is(toggle_wrap_selector_str) && !$panel.data(toggle_wrap_data_str)) {
					generatedToggleWrapHTML = '';
				}

				// Wrap the panel, capture the panel height with margins uncollapsed
				// and set its max-height to the panel height
				$panelWrap = $panel.wrap('<'+panelWrapTag+' class="'+hideshow_str+'-wrap"></'+panelWrapTag+'>').parent();
				$panelWrap.css(overflow_str,'hidden');
				$panelWrap.css(max_height_str, $panelWrap.outerHeight());
				$panelWrap.css(overflow_str,'');

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

					if ($panel.is('[data-hideshow-before]')) {
						insert_fn_str = 'insertBefore';
					}

					$toggles = $(generatedToggleHTML)[insert_fn_str]($panelWrap).wrapAll(generatedToggleWrapHTML).data(hideshow_str+'-for', hideshowID);

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
					console.log('show');
					$panel.off('hidden');
					$panel.data(hide_data_str, false).removeClass(hide_data_str + ' hideshow-hidden');
					$panel.addClass('hideshow-showing');
					$panel.addClass(show_data_str);
					handleTransitions.call($panel, function() {
						$panel.removeClass('hideshow-showing');
						$panel.trigger('showed');
					});
				});
				$panel.on('showed', function() {
					console.log('showed');
					$panel.removeClass(show_data_str).addClass('hideshow-showed');
				});
				$panel.on('hide', function() {
					console.log('hide');
					$panel.off('showed');
					$panel.data(hide_data_str, true).removeClass(show_data_str + ' hideshow-showed');
					$panel.addClass('istrans');
					$panel.addClass(hide_data_str);
					handleTransitions.call($panel, function() {
						$panel.trigger('hidden');
						$panel.removeClass('istrans');
					});
				});
				$panel.on('hidden', function() {
					console.log('hidden');
					$panel.removeClass(hide_data_str).addClass('hideshow-hidden');
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

			var $panel = $(this)
				,$placeholders
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
	handleTransitions = function(callback){

		var cl = ["transition-duration", "-moz-transition-duration", "-webkit-transition-duration", "-o-transition-duration"],
			clLength = 4,
			duration,
			i
		;

		return this.each(function() {

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
				//$el[0].offsetWidth;
				// check offsetWidth to force the style rendering
			}
			else {
				callback();
			}
		});
	};
}(jQuery));
