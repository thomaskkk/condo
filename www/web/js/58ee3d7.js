/*
 * VARIABLES
 * Description: All Global Vars
 */
	// Impacts the responce rate of some of the responsive elements (lower value affects CPU but improves speed)
	$.throttle_delay = 350;
	
	// The rate at which the menu expands revealing child elements on click
	$.menu_speed = 235;
	
	// Note: You will also need to change this variable in the "variable.less" file.
	$.navbar_height = 49; 

/*
 * APP DOM REFERENCES
 * Description: Obj DOM reference, please try to avoid changing these
 */	
	$.root_ = $('body');
	$.left_panel = $('#left-panel');
	$.shortcut_dropdown = $('#shortcut');

/*
 * APP CONFIGURATION
 * Description: Enable / disable certain theme features here
 */		
	$.navAsAjax = false; // Your left nav in your app will no longer fire ajax calls
	
	// Please make sure you have included "jarvis.widget.js" for this below feature to work
	$.enableJarvisWidgets = false;
	// $.enableJarvisWidgets needs to be true it to work (could potentially 
	// crash your webApp if you have too many widgets running on mobile view)	
	$.enableMobileWidgets = false;
	
	// Plugin dependency "smartclick.js"
	$.enableFastClick = false; // remove the 300 ms delay in iDevices


/*
 * DETECT MOBILE DEVICES
 * Description: Detects mobile device - if any of the listed device is detected
 * a class is inserted to $.root_ and the variable $.device is decleard. 
 */	

/* so far this is covering most hand held devices */
var ismobile = (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));

	if (!ismobile) {
		// Desktop
		$.root_.addClass("desktop-detected");
		$.device = "desktop";
	} else {
		// Mobile
		$.root_.addClass("mobile-detected");
		$.device = "mobile";
		
		// remove 300ms delay from apple touch devices
		// dependency: plugin/smartclick/smartclick.js
		if ($.enableFastClick){
			$('nav ul a').noClickDelay();
			$('#hide-menu a').noClickDelay();
		}
	}

/* ~ END: CHECK MOBILE DEVICE */

/*
 * DOCUMENT LOADED EVENT
 * Description: Fire when DOM is ready
 */

$(document).ready(function() {
	/*
	 * Fire tooltips
	 */
	if ($("[rel=tooltip]").length) {
		$("[rel=tooltip]").tooltip();
	}

	//TODO: was moved from window.load due to IE not firing consist
	nav_page_height()

	// INITIALIZE LEFT NAV
	if (!null) {
		$('nav ul').jarvismenu({
			accordion : true,
			speed : $.menu_speed,
			closedSign : '<em class="fa fa-expand-o"></em>',
			openedSign : '<em class="fa fa-collapse-o"></em>'
		});
	} else {
		alert("Error - menu anchor does not exist");
	}

	// COLLAPSE LEFT NAV
	$('.minifyme').click(function(e) {
		$('body').toggleClass("minified");
		$(this).effect("highlight", {}, 500);
		e.preventDefault();
	});

	// HIDE MENU
	$('#hide-menu >:first-child > a').click(function(e) {
		$('body').toggleClass("hidden-menu");
		e.preventDefault();
	});
	
	$('#show-shortcut').click(function(e) {
		if ($.shortcut_dropdown.is(":visible")) {
			shortcut_buttons_hide();
		} else {
			shortcut_buttons_show();
		}
		e.preventDefault();
	});

	// SHOW & HIDE MOBILE SEARCH FIELD
	$('#search-mobile').click(function() {
		$.root_.addClass('search-mobile');
	});

	$('#cancel-search-js').click(function() {
		$.root_.removeClass('search-mobile');
	});

	// ACTIVITY
	// ajax drop
	$('#activity').click(function(e) {
		$this = $(this);

		if ($this.find('.badge').hasClass('bg-color-red')) {
			$this.find('.badge').removeClassPrefix('bg-color-');
			$this.find('.badge').text("0");
			// console.log("Ajax call for activity")
		}

		if (!$this.next('.ajax-dropdown').is(':visible')) {
			$this.next('.ajax-dropdown').fadeIn(150);
			$this.addClass('active');
		} else {
			$this.next('.ajax-dropdown').fadeOut(150);
			$this.removeClass('active')
		}

		var mytest = $this.next('.ajax-dropdown').find('.btn-group > .active > input').attr('id');
		//console.log(mytest)

		e.preventDefault();
	});

	$('input[name="activity"]').change(function() {
		//alert($(this).val())
		$this = $(this);

		url = $this.attr('id');
		container = $('.ajax-notifications');

		loadURL(url, container);

	});

	$(document).mouseup(function(e) {
		if (!$('.ajax-dropdown').is(e.target)// if the target of the click isn't the container...
		&& $('.ajax-dropdown').has(e.target).length === 0) {
			$('.ajax-dropdown').fadeOut(150);
			$('.ajax-dropdown').prev().removeClass("active")
		}
	});

	$('button[data-loading-text]').on('click', function() {
		var btn = $(this)
		btn.button('loading')
		setTimeout(function() {
			btn.button('reset')
		}, 3000)
	});

	// NOTIFICATION IS PRESENT

	function notification_check() {
		$this = $('#activity > .badge');

		if (parseInt($this.text()) > 0) {
			$this.addClass("bg-color-red bounceIn animated")
		}
	}

	notification_check();

	// RESET WIDGETS
	$('#refresh').click(function(e) {
		$.SmartMessageBox({
			title : "<i class='fa fa-refresh' style='color:green'></i> Clear Local Storage",
			content : "Would you like to RESET all your saved widgets and clear LocalStorage?",
			buttons : '[No][Yes]'
		}, function(ButtonPressed) {
			if (ButtonPressed == "Yes" && localStorage) {
				localStorage.clear();
				location.reload();
			}

		});
		e.preventDefault();
	});

	// LOGOUT BUTTON
	$('#logout a').click(function(e) {
		//get the link
		$.loginURL = $(this).attr('href');

		// ask verification
		$.SmartMessageBox({
			title : "<i class='fa fa-sign-out txt-color-orangeDark'></i> Logout <span class='txt-color-orangeDark'><strong>" + $('#show-shortcut').text() + "</strong></span> ?",
			content : "You can improve your security further after logging out by closing this opened browser",
			buttons : '[No][Yes]'

		}, function(ButtonPressed) {
			if (ButtonPressed == "Yes") {
				$.root_.addClass('animated fadeOutUp');
				setTimeout(logout, 1000)
			}

		});
		e.preventDefault();
	});

	/*
	 * LOGOUT ACTION
	 */

	function logout() {
		window.location = $.loginURL;
	}

	/*
	* SHORTCUTS
	*/

	// SHORT CUT (buttons that appear when clicked on user name)
	$.shortcut_dropdown.find('a').click(function(e) {

		e.preventDefault();

		window.location = $(this).attr('href');
		setTimeout(shortcut_buttons_hide, 300);

	});

	// SHORTCUT buttons goes away if mouse is clicked outside of the area
	$(document).mouseup(function(e) {
		if (!$.shortcut_dropdown.is(e.target)// if the target of the click isn't the container...
		&& $.shortcut_dropdown.has(e.target).length === 0) {
			shortcut_buttons_hide()
		}
	});

	// SHORTCUT ANIMATE HIDE
	function shortcut_buttons_hide() {
		$.shortcut_dropdown.animate({
			height : "hide"
		}, 300, "easeOutCirc");
		$.root_.removeClass('shortcut-on');

	}

	// SHORTCUT ANIMATE SHOW
	function shortcut_buttons_show() {
		$.shortcut_dropdown.animate({
			height : "show"
		}, 200, "easeOutCirc")
		$.root_.addClass('shortcut-on');
	}

});

/*
 * RESIZER WITH THROTTLE
 * Source: http://benalman.com/code/projects/jquery-resize/examples/resize/
 */

(function($, window, undefined) {

	var elems = $([]), jq_resize = $.resize = $.extend($.resize, {}), timeout_id, str_setTimeout = 'setTimeout', str_resize = 'resize', str_data = str_resize + '-special-event', str_delay = 'delay', str_throttle = 'throttleWindow';

	jq_resize[str_delay] = $.throttle_delay;

	jq_resize[str_throttle] = true;

	$.event.special[str_resize] = {

		setup : function() {
			if (!jq_resize[str_throttle] && this[str_setTimeout]) {
				return false;
			}

			var elem = $(this);
			elems = elems.add(elem);
			$.data(this, str_data, {
				w : elem.width(),
				h : elem.height()
			});
			if (elems.length === 1) {
				loopy();
			}
		},
		teardown : function() {
			if (!jq_resize[str_throttle] && this[str_setTimeout]) {
				return false;
			}

			var elem = $(this);
			elems = elems.not(elem);
			elem.removeData(str_data);
			if (!elems.length) {
				clearTimeout(timeout_id);
			}
		},

		add : function(handleObj) {
			if (!jq_resize[str_throttle] && this[str_setTimeout]) {
				return false;
			}
			var old_handler;

			function new_handler(e, w, h) {
				var elem = $(this), data = $.data(this, str_data);
				data.w = w !== undefined ? w : elem.width();
				data.h = h !== undefined ? h : elem.height();

				old_handler.apply(this, arguments);
			};
			if ($.isFunction(handleObj)) {
				old_handler = handleObj;
				return new_handler;
			} else {
				old_handler = handleObj.handler;
				handleObj.handler = new_handler;
			}
		}
	};

	function loopy() {
		timeout_id = window[str_setTimeout](function() {
			elems.each(function() {
				var elem = $(this), width = elem.width(), height = elem.height(), data = $.data(this, str_data);
				if (width !== data.w || height !== data.h) {
					elem.trigger(str_resize, [data.w = width, data.h = height]);
				}

			});
			loopy();

		}, jq_resize[str_delay]);

	};

})(jQuery, this);

/*
* NAV OR #LEFT-BAR RESIZE DETECT
* Description: changes the page min-width of #CONTENT and NAV when navigation is resized.
* This is to counter bugs for min page width on many desktop and mobile devices.
* Note: This script uses JSthrottle technique so don't worry about memory/CPU usage
*/

// Fix page and nav height
function nav_page_height() {
	setHeight = $('#main').height();
	menuHeight = $.left_panel.height();
	windowHeight = $(window).height() - $.navbar_height;
	//set height

	if (setHeight > windowHeight) {// if content height exceedes actual window height and menuHeight
		$.left_panel.css('min-height', setHeight + 'px');
		$.root_.css('min-height', setHeight + $.navbar_height + 'px');

	} else {
		$.left_panel.css('min-height', windowHeight + 'px');
		$.root_.css('min-height', windowHeight + 'px');
	}
}

$('#main').resize(function() {
	nav_page_height();
	check_if_mobile_width();
})

$('nav').resize(function() {
	nav_page_height();
})

function check_if_mobile_width() {
	if ($(window).width() < 979) {
		$.root_.addClass('mobile-view-activated')
	} else if ($.root_.hasClass('mobile-view-activated')) {
		$.root_.removeClass('mobile-view-activated');
	}
}

/* ~ END: NAV OR #LEFT-BAR RESIZE DETECT */

/*
 * DETECT IE VERSION
 * Description: A short snippet for detecting versions of IE in JavaScript
 * without resorting to user-agent sniffing
 * RETURNS:
 * If you're not in IE (or IE version is less than 5) then:
 * //ie === undefined
 *
 * If you're in IE (>=5) then you can determine which version:
 * // ie === 7; // IE7
 *
 * Thus, to detect IE:
 * // if (ie) {}
 *
 * And to detect the version:
 * ie === 6 // IE6
 * ie > 7 // IE8, IE9 ...
 * ie < 9 // Anything less than IE9
 */

// TODO: delete this function later on - no longer needed (?)
var ie = ( function() {

		var undef, v = 3, div = document.createElement('div'), all = div.getElementsByTagName('i');

		while (div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->', all[0]);

		return v > 4 ? v : undef;

	}()); // do we need this? 

/* ~ END: DETECT IE VERSION */

/*
 * CUSTOM MENU PLUGIN
 */

$.fn.extend({

	//pass the options variable to the function
	jarvismenu : function(options) {

		var defaults = {
			accordion : 'true',
			speed : 200,
			closedSign : '[+]',
			openedSign : '[-]'
		};

		// Extend our default options with those provided.
		var opts = $.extend(defaults, options);
		//Assign current element to variable, in this case is UL element
		var $this = $(this);

		//add a mark [+] to a multilevel menu
		$this.find("li").each(function() {
			if ($(this).find("ul").size() != 0) {
				//add the multilevel sign next to the link
				$(this).find("a:first").append("<b class='collapse-sign'>" + opts.closedSign + "</b>");

				//avoid jumping to the top of the page when the href is an #
				if ($(this).find("a:first").attr('href') == "#") {
					$(this).find("a:first").click(function() {
						return false;
					});
				}
			}
		});

		//open active level
		$this.find("li.active").each(function() {
			$(this).parents("ul").slideDown(opts.speed);
			$(this).parents("ul").parent("li").find("b:first").html(opts.openedSign);
			$(this).parents("ul").parent("li").addClass("open")
		});

		$this.find("li a").click(function() {

			if ($(this).parent().find("ul").size() != 0) {

				if (opts.accordion) {
					//Do nothing when the list is open
					if (!$(this).parent().find("ul").is(':visible')) {
						parents = $(this).parent().parents("ul");
						visible = $this.find("ul:visible");
						visible.each(function(visibleIndex) {
							var close = true;
							parents.each(function(parentIndex) {
								if (parents[parentIndex] == visible[visibleIndex]) {
									close = false;
									return false;
								}
							});
							if (close) {
								if ($(this).parent().find("ul") != visible[visibleIndex]) {
									$(visible[visibleIndex]).slideUp(opts.speed, function() {
										$(this).parent("li").find("b:first").html(opts.closedSign);
										$(this).parent("li").removeClass("open");
									});

								}
							}
						});
					}
				}// end if
				if ($(this).parent().find("ul:first").is(":visible") && !$(this).parent().find("ul:first").hasClass("active")) {
					$(this).parent().find("ul:first").slideUp(opts.speed, function() {
						$(this).parent("li").removeClass("open");
						$(this).parent("li").find("b:first").delay(opts.speed).html(opts.closedSign);
					});

				} else {
					$(this).parent().find("ul:first").slideDown(opts.speed, function() {
						/*$(this).effect("highlight", {color : '#616161'}, 500); - disabled due to CPU clocking on phones*/
						$(this).parent("li").addClass("open");
						$(this).parent("li").find("b:first").delay(opts.speed).html(opts.openedSign);
					});
				} // end else
			} // end if
		});
	} // end function
});

/* ~ END: CUSTOM MENU PLUGIN */

/*
 * ELEMENT EXIST OR NOT
 * Description: returns true or false
 * Usage: $('#myDiv').doesExist();
 */

jQuery.fn.doesExist = function() {
	return jQuery(this).length > 0;
};

/* ~ END: ELEMENT EXIST OR NOT */

/*
 * INITIALIZE FORMS
 * Description: Select2, Masking, Datepicker, Autocomplete
 */

function runAllForms() {

	/*
	 * BOOTSTRAP SLIDER PLUGIN
	 * Usage:
	 * Dependency: js/plugin/bootstrap-slider
	 */
	if ($.fn.slider) {
		$('.slider').slider();
	}

	/*
	 * SELECT2 PLUGIN
	 * Usage:
	 * Dependency: js/plugin/select2/
	 */
	if ($.fn.select2) {
		$('.select2').each(function() {
			$this = $(this);
			var width = $this.attr('data-select-width') || '100%';
			//, _showSearchInput = $this.attr('data-select-search') === 'true';
			$this.select2({
				//showSearchInput : _showSearchInput,
				allowClear : true,
				width : width
			})
		})
	}

	/*
	 * MASKING
	 * Dependency: js/plugin/masked-input/
	 */
	if ($.fn.mask) {
		$('[data-mask]').each(function() {

			$this = $(this);
			var mask = $this.attr('data-mask') || 'error...', mask_placeholder = $this.attr('data-mask-placeholder') || 'X';

			$this.mask(mask, {
				placeholder : mask_placeholder
			});
		})
	}

	/*
	 * Autocomplete
	 * Dependency: js/jqui
	 */
	if ($.fn.autocomplete) {
		$('[data-autocomplete]').each(function() {

			$this = $(this);
			var availableTags = $this.data('autocomplete') || ["The", "Quick", "Brown", "Fox", "Jumps", "Over", "Three", "Lazy", "Dogs"];

			$this.autocomplete({
				source : availableTags
			});
		})
	}

	/*
	 * JQUERY UI DATE
	 * Dependency: js/libs/jquery-ui-1.10.3.min.js
	 * Usage:
	 */
	if ($.fn.datepicker) {
		$('.datepicker').each(function() {

			$this = $(this);
			var dataDateFormat = $this.attr('data-dateformat') || 'dd.mm.yy';

			$this.datepicker({
				dateFormat : dataDateFormat,
				prevText : '<i class="fa fa-chevron-left"></i>',
				nextText : '<i class="fa fa-chevron-right"></i>',
			});
		})
	}

	/*
	 * AJAX BUTTON LOADING TEXT
	 * Usage: <button type="button" data-loading-text="Loading..." class="btn btn-xs btn-default ajax-refresh"> .. </button>
	 */
	$('button[data-loading-text]').on('click', function() {
		var btn = $(this)
		btn.button('loading')
		setTimeout(function() {
			btn.button('reset')
		}, 3000)
	});

}

/* ~ END: INITIALIZE FORMS */

/*
 * INITIALIZE CHARTS
 * Description: Sparklines, PieCharts
 */

function runAllCharts() {
	/*
	 * SPARKLINES
	 * DEPENDENCY: js/plugins/sparkline/jquery.sparkline.min.js
	 * See usage example below...
	 */

	/* Usage:
	 * 		<div class="sparkline-line txt-color-blue" data-fill-color="transparent" data-sparkline-height="26px">
	 *			5,6,7,9,9,5,9,6,5,6,6,7,7,6,7,8,9,7
	 *		</div>
	 */

	if ($.fn.sparkline) {

		$('.sparkline').each(function() {
			$this = $(this);
			var sparklineType = $this.data('sparkline-type') || 'bar';

			// BAR CHART
			if (sparklineType == 'bar') {

				var barColor = $this.data('sparkline-bar-color') || $this.css('color') || '#0000f0', sparklineHeight = $this.data('sparkline-height') || '26px', sparklineBarWidth = $this.data('sparkline-barwidth') || 5, sparklineBarSpacing = $this.data('sparkline-barspacing') || 2, sparklineNegBarColor = $this.data('sparkline-negbar-color') || '#A90329', sparklineStackedColor = $this.data('sparkline-barstacked-color') || ["#A90329", "#0099c6", "#98AA56", "#da532c", "#4490B1", "#6E9461", "#990099", "#B4CAD3"];

				$this.sparkline('html', {
					type : 'bar',
					barColor : barColor,
					type : sparklineType,
					height : sparklineHeight,
					barWidth : sparklineBarWidth,
					barSpacing : sparklineBarSpacing,
					stackedBarColor : sparklineStackedColor,
					negBarColor : sparklineNegBarColor,
					zeroAxis : 'false'
				});

			}

			//LINE CHART
			if (sparklineType == 'line') {

				var sparklineHeight = $this.data('sparkline-height') || '20px', sparklineWidth = $this.data('sparkline-width') || '90px', thisLineColor = $this.data('sparkline-line-color') || $this.css('color') || '#0000f0', thisLineWidth = $this.data('sparkline-line-width') || 1, thisFill = $this.data('fill-color') || '#c0d0f0', thisSpotColor = $this.data('sparkline-spot-color') || '#f08000', thisMinSpotColor = $this.data('sparkline-minspot-color') || '#ed1c24', thisMaxSpotColor = $this.data('sparkline-maxspot-color') || '#f08000', thishighlightSpotColor = $this.data('sparkline-highlightspot-color') || '#50f050', thisHighlightLineColor = $this.data('sparkline-highlightline-color') || 'f02020', thisSpotRadius = $this.data('sparkline-spotradius') || 1.5;
				thisChartMinYRange = $this.data('sparkline-min-y') || 'undefined', thisChartMaxYRange = $this.data('sparkline-max-y') || 'undefined', thisChartMinXRange = $this.data('sparkline-min-x') || 'undefined', thisChartMaxXRange = $this.data('sparkline-max-x') || 'undefined', thisMinNormValue = $this.data('min-val') || 'undefined', thisMaxNormValue = $this.data('max-val') || 'undefined', thisNormColor = $this.data('norm-color') || '#c0c0c0', thisDrawNormalOnTop = $this.data('draw-normal') || false;

				$this.sparkline('html', {
					type : 'line',
					width : sparklineWidth,
					height : sparklineHeight,
					lineWidth : thisLineWidth,
					lineColor : thisLineColor,
					fillColor : thisFill,
					spotColor : thisSpotColor,
					minSpotColor : thisMinSpotColor,
					maxSpotColor : thisMaxSpotColor,
					highlightSpotColor : thishighlightSpotColor,
					highlightLineColor : thisHighlightLineColor,
					spotRadius : thisSpotRadius,
					chartRangeMin : thisChartMinYRange,
					chartRangeMax : thisChartMaxYRange,
					chartRangeMinX : thisChartMinXRange,
					chartRangeMaxX : thisChartMaxXRange,
					normalRangeMin : thisMinNormValue,
					normalRangeMax : thisMaxNormValue,
					normalRangeColor : thisNormColor,
					drawNormalOnTop : thisDrawNormalOnTop

				});

			}

			//PIE CHART
			if (sparklineType == 'pie') {

				var pieColors = $this.data('sparkline-piecolor') || ["#B4CAD3", "#4490B1", "#98AA56", "#da532c", "#6E9461", "#0099c6", "#990099", "#717D8A"], pieWidthHeight = $this.data('sparkline-piesize') || 90, pieBorderColor = $this.data('border-color') || '#45494C', pieOffset = $this.data('sparkline-offset') || 0;

				$this.sparkline('html', {
					type : 'pie',
					width : pieWidthHeight,
					height : pieWidthHeight,
					tooltipFormat : '<span style="color: {{color}}">&#9679;</span> ({{percent.1}}%)',
					sliceColors : pieColors,
					offset : 0,
					borderWidth : 1,
					offset : pieOffset,
					borderColor : pieBorderColor
				});

			}

			//BOX PLOT
			if (sparklineType == 'box') {

				var thisBoxWidth = $this.data('sparkline-width') || 'auto', thisBoxHeight = $this.data('sparkline-height') || 'auto', thisBoxRaw = $this.data('sparkline-boxraw') || false, thisBoxTarget = $this.data('sparkline-targetval') || 'undefined', thisBoxMin = $this.data('sparkline-min') || 'undefined', thisBoxMax = $this.data('sparkline-max') || 'undefined', thisShowOutlier = $this.data('sparkline-showoutlier') || true, thisIQR = $this.data('sparkline-outlier-iqr') || 1.5, thisBoxSpotRadius = $this.data('sparkline-spotradius') || 1.5, thisBoxLineColor = $this.css('color') || '#000000', thisBoxFillColor = $this.data('fill-color') || '#c0d0f0', thisBoxWhisColor = $this.data('sparkline-whis-color') || '#000000', thisBoxOutlineColor = $this.data('sparkline-outline-color') || '#303030', thisBoxOutlineFill = $this.data('sparkline-outlinefill-color') || '#f0f0f0', thisBoxMedianColor = $this.data('sparkline-outlinemedian-color') || '#f00000', thisBoxTargetColor = $this.data('sparkline-outlinetarget-color') || '#40a020';

				$this.sparkline('html', {
					type : 'box',
					width : thisBoxWidth,
					height : thisBoxHeight,
					raw : thisBoxRaw,
					target : thisBoxTarget,
					minValue : thisBoxMin,
					maxValue : thisBoxMax,
					showOutliers : thisShowOutlier,
					outlierIQR : thisIQR,
					spotRadius : thisBoxSpotRadius,
					boxLineColor : thisBoxLineColor,
					boxFillColor : thisBoxFillColor,
					whiskerColor : thisBoxWhisColor,
					outlierLineColor : thisBoxOutlineColor,
					outlierFillColor : thisBoxOutlineFill,
					medianColor : thisBoxMedianColor,
					targetColor : thisBoxTargetColor

				})

			}

			//BULLET
			if (sparklineType == 'bullet') {

				var thisBulletHeight = $this.data('sparkline-height') || 'auto', thisBulletWidth = $this.data('sparkline-width') || 2, thisBulletColor = $this.data('sparkline-bullet-color') || '#ed1c24', thisBulletPerformanceColor = $this.data('sparkline-performance-color') || '#3030f0', thisBulletRangeColors = $this.data('sparkline-bulletrange-color') || ["#d3dafe", "#a8b6ff", "#7f94ff"]

				$this.sparkline('html', {

					type : 'bullet',
					height : thisBulletHeight,
					targetWidth : thisBulletWidth,
					targetColor : thisBulletColor,
					performanceColor : thisBulletPerformanceColor,
					rangeColors : thisBulletRangeColors

				})

			}

			//DISCRETE
			if (sparklineType == 'discrete') {

				var thisDiscreteHeight = $this.data('sparkline-height') || 26, thisDiscreteWidth = $this.data('sparkline-width') || 50, thisDiscreteLineColor = $this.css('color'), thisDiscreteLineHeight = $this.data('sparkline-line-height') || 5, thisDiscreteThrushold = $this.data('sparkline-threshold') || 'undefined', thisDiscreteThrusholdColor = $this.data('sparkline-threshold-color') || '#ed1c24';

				$this.sparkline('html', {

					type : 'discrete',
					width : thisDiscreteWidth,
					height : thisDiscreteHeight,
					lineColor : thisDiscreteLineColor,
					lineHeight : thisDiscreteLineHeight,
					thresholdValue : thisDiscreteThrushold,
					thresholdColor : thisDiscreteThrusholdColor

				})

			}

			//TRISTATE
			if (sparklineType == 'tristate') {

				var thisTristateHeight = $this.data('sparkline-height') || 26, thisTristatePosBarColor = $this.data('sparkline-posbar-color') || '#60f060', thisTristateNegBarColor = $this.data('sparkline-negbar-color') || '#f04040', thisTristateZeroBarColor = $this.data('sparkline-zerobar-color') || '#909090', thisTristateBarWidth = $this.data('sparkline-barwidth') || 5, thisTristateBarSpacing = $this.data('sparkline-barspacing') || 2, thisZeroAxis = $this.data('sparkline-zeroaxis') || false;

				$this.sparkline('html', {

					type : 'tristate',
					height : thisTristateHeight,
					posBarColor : thisBarColor,
					negBarColor : thisTristateNegBarColor,
					zeroBarColor : thisTristateZeroBarColor,
					barWidth : thisTristateBarWidth,
					barSpacing : thisTristateBarSpacing,
					zeroAxis : thisZeroAxis

				})

			}

			//COMPOSITE: BAR
			if (sparklineType == 'compositebar') {

				var sparklineHeight = $this.data('sparkline-height') || '20px', sparklineWidth = $this.data('sparkline-width') || '100%', sparklineBarWidth = $this.data('sparkline-barwidth') || 3, thisLineWidth = $this.data('sparkline-line-width') || 1, thisLineColor = $this.data('sparkline-color-top') || '#ed1c24', thisBarColor = $this.data('sparkline-color-bottom') || '#333333'

				$this.sparkline($this.data('sparkline-bar-val'), {

					type : 'bar',
					width : sparklineWidth,
					height : sparklineHeight,
					barColor : thisBarColor,
					barWidth : sparklineBarWidth
					//barSpacing: 5

				})

				$this.sparkline($this.data('sparkline-line-val'), {

					width : sparklineWidth,
					height : sparklineHeight,
					lineColor : thisLineColor,
					lineWidth : thisLineWidth,
					composite : true,
					fillColor : false

				})

			}

			//COMPOSITE: LINE
			if (sparklineType == 'compositeline') {

				var sparklineHeight = $this.data('sparkline-height') || '20px', sparklineWidth = $this.data('sparkline-width') || '90px', sparklineValue = $this.data('sparkline-bar-val'), sparklineValueSpots1 = $this.data('sparkline-bar-val-spots-top') || null, sparklineValueSpots2 = $this.data('sparkline-bar-val-spots-bottom') || null, thisLineWidth1 = $this.data('sparkline-line-width-top') || 1, thisLineWidth2 = $this.data('sparkline-line-width-bottom') || 1, thisLineColor1 = $this.data('sparkline-color-top') || '#333333', thisLineColor2 = $this.data('sparkline-color-bottom') || '#ed1c24', thisSpotRadius1 = $this.data('sparkline-spotradius-top') || 1.5, thisSpotRadius2 = $this.data('sparkline-spotradius-bottom') || thisSpotRadius1, thisSpotColor = $this.data('sparkline-spot-color') || '#f08000', thisMinSpotColor1 = $this.data('sparkline-minspot-color-top') || '#ed1c24', thisMaxSpotColor1 = $this.data('sparkline-maxspot-color-top') || '#f08000', thisMinSpotColor2 = $this.data('sparkline-minspot-color-bottom') || thisMinSpotColor1, thisMaxSpotColor2 = $this.data('sparkline-maxspot-color-bottom') || thisMaxSpotColor1, thishighlightSpotColor1 = $this.data('sparkline-highlightspot-color-top') || '#50f050', thisHighlightLineColor1 = $this.data('sparkline-highlightline-color-top') || '#f02020', thishighlightSpotColor2 = $this.data('sparkline-highlightspot-color-bottom') || thishighlightSpotColor1, thisHighlightLineColor2 = $this.data('sparkline-highlightline-color-bottom') || thisHighlightLineColor1, thisFillColor1 = $this.data('sparkline-fillcolor-top') || 'transparent', thisFillColor2 = $this.data('sparkline-fillcolor-bottom') || 'transparent';

				$this.sparkline(sparklineValue, {

					type : 'line',
					spotRadius : thisSpotRadius1,

					spotColor : thisSpotColor,
					minSpotColor : thisMinSpotColor1,
					maxSpotColor : thisMaxSpotColor1,
					highlightSpotColor : thishighlightSpotColor1,
					highlightLineColor : thisHighlightLineColor1,

					valueSpots : sparklineValueSpots1,

					lineWidth : thisLineWidth1,
					width : sparklineWidth,
					height : sparklineHeight,
					lineColor : thisLineColor1,
					fillColor : thisFillColor1

				})

				$this.sparkline($this.data('sparkline-line-val'), {

					type : 'line',
					spotRadius : thisSpotRadius2,

					spotColor : thisSpotColor,
					minSpotColor : thisMinSpotColor2,
					maxSpotColor : thisMaxSpotColor2,
					highlightSpotColor : thishighlightSpotColor2,
					highlightLineColor : thisHighlightLineColor2,

					valueSpots : sparklineValueSpots2,

					lineWidth : thisLineWidth2,
					width : sparklineWidth,
					height : sparklineHeight,
					lineColor : thisLineColor2,
					composite : true,
					fillColor : thisFillColor2

				})

			}

		});

	}// end if

	/*
	 * EASY PIE CHARTS
	 * DEPENDENCY: js/plugins/easy-pie-chart/jquery.easy-pie-chart.min.js
	 * Usage: <div class="easy-pie-chart txt-color-orangeDark" data-pie-percent="33" data-pie-size="72" data-size="72">
	 *			<span class="percent percent-sign">35</span>
	 * 	  	  </div>
	 */

	if ($.fn.easyPieChart) {

		$('.easy-pie-chart').each(function() {
			$this = $(this);
			var barColor = $this.css('color') || $this.data('pie-color'), trackColor = $this.data('pie-track-color') || '#eeeeee', size = parseInt($this.data('pie-size')) || 25;
			$this.easyPieChart({
				barColor : barColor,
				trackColor : trackColor,
				scaleColor : false,
				lineCap : 'butt',
				lineWidth : parseInt(size / 8.5),
				animate : 1500,
				rotate : -90,
				size : size,
				onStep : function(value) {
					this.$el.find('span').text(~~value);
				}
			});
		});

	} // end if

}

/* ~ END: INITIALIZE CHARTS */

/*
 * INITIALIZE JARVIS WIDGETS
 */

// Setup Desktop Widgets
function setup_widgets_desktop() {

	if ($.fn.jarvisWidgets && $.enableJarvisWidgets) {

		$('#widget-grid').jarvisWidgets({

			grid : 'article',
			widgets : '.jarviswidget',
			localStorage : true,
			deleteSettingsKey : '#deletesettingskey-options',
			settingsKeyLabel : 'Reset settings?',
			deletePositionKey : '#deletepositionkey-options',
			positionKeyLabel : 'Reset position?',
			sortable : true,
			buttonsHidden : false,
			// toggle button
			toggleButton : true,
			toggleClass : 'fa fa-minus | fa fa-plus',
			toggleSpeed : 200,
			onToggle : function() {
			},
			// delete btn
			deleteButton : true,
			deleteClass : 'fa fa-times',
			deleteSpeed : 200,
			onDelete : function() {
			},
			// edit btn
			editButton : true,
			editPlaceholder : '.jarviswidget-editbox',
			editClass : 'fa fa-cog | fa fa-save',
			editSpeed : 200,
			onEdit : function() {
			},
			// color button
			colorButton : true,
			// full screen
			fullscreenButton : true,
			fullscreenClass : 'fa fa-resize-full | fa fa-resize-small',
			fullscreenDiff : 3,
			onFullscreen : function() {
			},
			// custom btn
			customButton : false,
			customClass : 'folder-10 | next-10',
			customStart : function() {
				alert('Hello you, this is a custom button...')
			},
			customEnd : function() {
				alert('bye, till next time...')
			},
			// order
			buttonOrder : '%refresh% %custom% %edit% %toggle% %fullscreen% %delete%',
			opacity : 1.0,
			dragHandle : '> header',
			placeholderClass : 'jarviswidget-placeholder',
			indicator : true,
			indicatorTime : 600,
			ajax : true,
			timestampPlaceholder : '.jarviswidget-timestamp',
			timestampFormat : 'Last update: %m%/%d%/%y% %h%:%i%:%s%',
			refreshButton : true,
			refreshButtonClass : 'fa fa-refresh',
			labelError : 'Sorry but there was a error:',
			labelUpdated : 'Last Update:',
			labelRefresh : 'Refresh',
			labelDelete : 'Delete widget:',
			afterLoad : function() {
			},
			rtl : false, // best not to toggle this!
			onChange : function() {
				
			},
			onSave : function() {
				
			},
			ajaxnav : $.navAsAjax // declears how the localstorage should be saved

		});

	}

}

// Setup Desktop Widgets
function setup_widgets_mobile() {

	if ($.enableMobileWidgets && $.enableJarvisWidgets) {
		setup_widgets_desktop();
	}

}

/* ~ END: INITIALIZE JARVIS WIDGETS */

/*
 * GOOGLE MAPS
 * description: Append google maps to head dynamically
 */

var gMapsLoaded = false;
window.gMapsCallback = function() {
	gMapsLoaded = true;
	$(window).trigger('gMapsLoaded');
}
window.loadGoogleMaps = function() {
	if (gMapsLoaded)
		return window.gMapsCallback();
	var script_tag = document.createElement('script');
	script_tag.setAttribute("type", "text/javascript");
	script_tag.setAttribute("src", "http://maps.google.com/maps/api/js?sensor=false&callback=gMapsCallback");
	(document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
}
/* ~ END: GOOGLE MAPS */

/*
 * LOAD SCRIPTS
 * Usage:
 * Define function = myPrettyCode ()...
 * loadScript("js/my_lovely_script.js", myPrettyCode);
 */

var jsArray = {};

function loadScript(scriptName, callback) {

	if (!jsArray[scriptName]) {
		jsArray[scriptName] = true;

		// adding the script tag to the head as suggested before
		var body = document.getElementsByTagName('body')[0];
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = scriptName;

		// then bind the event to the callback function
		// there are several events for cross browser compatibility
		//script.onreadystatechange = callback;
		script.onload = callback;

		// fire the loading
		body.appendChild(script);

	} else if (callback) {// changed else to else if(callback)
		//console.log("JS file already added!");
		//execute function
		callback();
	}

}

/* ~ END: LOAD SCRIPTS */

/*
* APP AJAX REQUEST SETUP
* Description: Executes and fetches all ajax requests also
* updates naivgation elements to active
*/
if($.navAsAjax)
{
    // fire this on page load if nav exists
    if ($('nav').length) {
	    checkURL();
    };

    $(document).on('click', 'nav a[href!="#"]', function(e) {
	    e.preventDefault();
	    $this = $(e.currentTarget);

	    // if parent is not active then get hash, or else page is assumed to be loaded
	    if (!$this.parent().hasClass("active") && !$this.attr('target')) {

		    // update window with hash
		    // you could also do here:  $.device === "mobile" - and save a little more memory
		
		    if ($.root_.hasClass('mobile-view-activated')) {
			    $.root_.removeClass('hidden-menu');
			    window.setTimeout(function() {
				    window.location.hash = $this.attr('href')
			    }, 150);
			    // it may not need this delay...
		    } else {
			    window.location.hash = $this.attr('href');
		    }
	    }

    });

    // fire links with targets on different window
    $(document).on('click', 'nav a[target="_blank"]', function(e) {
	    e.preventDefault();
	    $this = $(e.currentTarget);

	    window.open($this.attr('href'));
    });

    // fire links with targets on same window
    $(document).on('click', 'nav a[target="_top"]', function(e) {
	    e.preventDefault();
	    $this = $(e.currentTarget);

	    window.location = ($this.attr('href'));
    });

    // all links with hash tags are ignored
    $(document).on('click', 'nav a[href="#"]', function(e) {
	    e.preventDefault();
    });

    // DO on hash change
    $(window).on('hashchange', function() {
	    checkURL();
    });
}

// CHECK TO SEE IF URL EXISTS
function checkURL() {

	//get the url by removing the hash
	url = location.hash.replace(/^#/, '');

	container = $('#content');
	// Do this if url exists (for page refresh, etc...)
	if (url) {
		// remove all active class
		$('nav li.active').removeClass("active");
		// match the url and add the active class
		$('nav li:has(a[href="' + url + '"])').addClass("active");
		title = ($('nav a[href="' + url + '"]').attr('title'))

		// change page title from global var
		document.title = (title || document.title);
		//console.log("page title: " + document.title);

		// parse url to jquery
		loadURL(url, container);
	} else {

		// grab the first URL from nav
		$this = $('nav > ul > li:first-child > a[href!="#"]');

		//update hash
		window.location.hash = $this.attr('href');

	}

}

// LOAD AJAX PAGES

function loadURL(url, container) {
	//console.log(container)

	$.ajax({
		type : "GET",
		url : url,
		dataType : 'html',
		cache : true, // (warning: this will cause a timestamp and will call the request twice)
		beforeSend : function() {
			// cog placed
			container.html('<h1><i class="fa fa-cog fa-spin"></i> Loading...</h1>');

			// Only draw breadcrumb if it is main content material
			// TODO: see the framerate for the animation in touch devices
			
			if (container[0] == $("#content")[0]) {
				drawBreadCrumb();
				// update title with breadcrumb...
				document.title = $(".breadcrumb li:last-child").text();
				// scroll up
				$("html, body").animate({
					scrollTop : 0
				}, "fast");
			} else {
				container.animate({
					scrollTop : 0
				}, "fast");
			}
		},
		/*complete: function(){
	    	// Handle the complete event
	    	// alert("complete")
		},*/
		success : function(data) {
			// cog replaced here...
			// alert("success")
			
			container.css({
				opacity : '0.0'
			}).html(data).delay(50).animate({
				opacity : '1.0'
			}, 300);
			

		},
		error : function(xhr, ajaxOptions, thrownError) {
			container.html('<h4 style="margin-top:10px; display:block; text-align:left"><i class="fa fa-warning txt-color-orangeDark"></i> Error 404! Page not found.</h4>');
		},
		async : false
	});

	//console.log("ajax request sent");
}

// UPDATE BREADCRUMB
function drawBreadCrumb() {

	//console.log("breadcrumb")
	$("#ribbon ol.breadcrumb").empty();
	$("#ribbon ol.breadcrumb").append($("<li>Home</li>"));
	$('nav li.active > a').each(function() {
		$("#ribbon ol.breadcrumb").append($("<li></li>").html($.trim($(this).clone().children(".badge").remove().end().text())));
	});

}

/* ~ END: APP AJAX REQUEST SETUP */

/*
 * PAGE SETUP
 * Description: fire certain scripts that run through the page
 * to check for form elements, tooltip activation, popovers, etc...
 */
function pageSetUp() {

	if ($.device === "desktop"){
		// is desktop
		
		// activate tooltips
		$("[rel=tooltip]").tooltip();
	
		// activate popovers
		$("[rel=popover]").popover();
	
		// activate popovers with hover states
		$("[rel=popover-hover]").popover({
			trigger : "hover"
		});
	
		// activate inline charts
		runAllCharts();
	
		// setup widgets
		setup_widgets_desktop();
	
		//setup nav height (dynamic)
		nav_page_height();
	
		// run form elements
		runAllForms();

	} else {
		
		// is mobile
		
		// activate popovers
		$("[rel=popover]").popover();
	
		// activate popovers with hover states
		$("[rel=popover-hover]").popover({
			trigger : "hover"
		});
	
		// activate inline charts
		runAllCharts();
	
		// setup widgets
		setup_widgets_mobile();
	
		//setup nav height (dynamic)
		nav_page_height();
	
		// run form elements
		runAllForms();
		
	}

}

// Keep only 1 active popover per trigger - also check and hide active popover if user clicks on document
$('body').on('click', function(e) {
	$('[rel="popover"]').each(function() {
		//the 'is' for buttons that trigger popups
		//the 'has' for icons within a button that triggers a popup
		if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
			$(this).popover('hide');
		}
	});
}); 
(function(window,document,undefined){(function(factory){if(typeof define==="function"&&define.amd){define(["../../../../../../../../"],factory);}else{if(jQuery&&!jQuery.fn.dataTable){factory(jQuery);}}}(function($){var DataTable=function(oInit){function _fnAddColumn(oSettings,nTh){var oDefaults=DataTable.defaults.columns;var iCol=oSettings.aoColumns.length;var oCol=$.extend({},DataTable.models.oColumn,oDefaults,{sSortingClass:oSettings.oClasses.sSortable,sSortingClassJUI:oSettings.oClasses.sSortJUI,nTh:nTh?nTh:document.createElement("th"),sTitle:oDefaults.sTitle?oDefaults.sTitle:nTh?nTh.innerHTML:"",aDataSort:oDefaults.aDataSort?oDefaults.aDataSort:[iCol],mData:oDefaults.mData?oDefaults.oDefaults:iCol});oSettings.aoColumns.push(oCol);if(oSettings.aoPreSearchCols[iCol]===undefined||oSettings.aoPreSearchCols[iCol]===null){oSettings.aoPreSearchCols[iCol]=$.extend({},DataTable.models.oSearch);}else{var oPre=oSettings.aoPreSearchCols[iCol];if(oPre.bRegex===undefined){oPre.bRegex=true;}if(oPre.bSmart===undefined){oPre.bSmart=true;}if(oPre.bCaseInsensitive===undefined){oPre.bCaseInsensitive=true;}}_fnColumnOptions(oSettings,iCol,null);}function _fnColumnOptions(oSettings,iCol,oOptions){var oCol=oSettings.aoColumns[iCol];if(oOptions!==undefined&&oOptions!==null){if(oOptions.mDataProp&&!oOptions.mData){oOptions.mData=oOptions.mDataProp;}if(oOptions.sType!==undefined){oCol.sType=oOptions.sType;oCol._bAutoType=false;}$.extend(oCol,oOptions);_fnMap(oCol,oOptions,"sWidth","sWidthOrig");if(oOptions.iDataSort!==undefined){oCol.aDataSort=[oOptions.iDataSort];}_fnMap(oCol,oOptions,"aDataSort");}var mRender=oCol.mRender?_fnGetObjectDataFn(oCol.mRender):null;var mData=_fnGetObjectDataFn(oCol.mData);oCol.fnGetData=function(oData,sSpecific){var innerData=mData(oData,sSpecific);if(oCol.mRender&&(sSpecific&&sSpecific!=="")){return mRender(innerData,sSpecific,oData);}return innerData;};oCol.fnSetData=_fnSetObjectDataFn(oCol.mData);if(!oSettings.oFeatures.bSort){oCol.bSortable=false;}if(!oCol.bSortable||($.inArray("asc",oCol.asSorting)==-1&&$.inArray("desc",oCol.asSorting)==-1)){oCol.sSortingClass=oSettings.oClasses.sSortableNone;oCol.sSortingClassJUI="";}else{if($.inArray("asc",oCol.asSorting)==-1&&$.inArray("desc",oCol.asSorting)==-1){oCol.sSortingClass=oSettings.oClasses.sSortable;oCol.sSortingClassJUI=oSettings.oClasses.sSortJUI;}else{if($.inArray("asc",oCol.asSorting)!=-1&&$.inArray("desc",oCol.asSorting)==-1){oCol.sSortingClass=oSettings.oClasses.sSortableAsc;oCol.sSortingClassJUI=oSettings.oClasses.sSortJUIAscAllowed;}else{if($.inArray("asc",oCol.asSorting)==-1&&$.inArray("desc",oCol.asSorting)!=-1){oCol.sSortingClass=oSettings.oClasses.sSortableDesc;oCol.sSortingClassJUI=oSettings.oClasses.sSortJUIDescAllowed;}}}}}function _fnAdjustColumnSizing(oSettings){if(oSettings.oFeatures.bAutoWidth===false){return false;}_fnCalculateColumnWidths(oSettings);for(var i=0,iLen=oSettings.aoColumns.length;i<iLen;i++){oSettings.aoColumns[i].nTh.style.width=oSettings.aoColumns[i].sWidth;}}function _fnVisibleToColumnIndex(oSettings,iMatch){var aiVis=_fnGetColumns(oSettings,"bVisible");return typeof aiVis[iMatch]==="number"?aiVis[iMatch]:null;}function _fnColumnIndexToVisible(oSettings,iMatch){var aiVis=_fnGetColumns(oSettings,"bVisible");var iPos=$.inArray(iMatch,aiVis);return iPos!==-1?iPos:null;}function _fnVisbleColumns(oSettings){return _fnGetColumns(oSettings,"bVisible").length;}function _fnGetColumns(oSettings,sParam){var a=[];$.map(oSettings.aoColumns,function(val,i){if(val[sParam]){a.push(i);}});return a;}function _fnDetectType(sData){var aTypes=DataTable.ext.aTypes;var iLen=aTypes.length;for(var i=0;i<iLen;i++){var sType=aTypes[i](sData);if(sType!==null){return sType;}}return"string";}function _fnReOrderIndex(oSettings,sColumns){var aColumns=sColumns.split(",");var aiReturn=[];for(var i=0,iLen=oSettings.aoColumns.length;i<iLen;i++){for(var j=0;j<iLen;j++){if(oSettings.aoColumns[i].sName==aColumns[j]){aiReturn.push(j);break;}}}return aiReturn;}function _fnColumnOrdering(oSettings){var sNames="";for(var i=0,iLen=oSettings.aoColumns.length;i<iLen;i++){sNames+=oSettings.aoColumns[i].sName+",";}if(sNames.length==iLen){return"";}return sNames.slice(0,-1);}function _fnApplyColumnDefs(oSettings,aoColDefs,aoCols,fn){var i,iLen,j,jLen,k,kLen;if(aoColDefs){for(i=aoColDefs.length-1;i>=0;i--){var aTargets=aoColDefs[i].aTargets;if(!$.isArray(aTargets)){_fnLog(oSettings,1,"aTargets must be an array of targets, not a "+(typeof aTargets));}for(j=0,jLen=aTargets.length;j<jLen;j++){if(typeof aTargets[j]==="number"&&aTargets[j]>=0){while(oSettings.aoColumns.length<=aTargets[j]){_fnAddColumn(oSettings);}fn(aTargets[j],aoColDefs[i]);}else{if(typeof aTargets[j]==="number"&&aTargets[j]<0){fn(oSettings.aoColumns.length+aTargets[j],aoColDefs[i]);}else{if(typeof aTargets[j]==="string"){for(k=0,kLen=oSettings.aoColumns.length;k<kLen;k++){if(aTargets[j]=="_all"||$(oSettings.aoColumns[k].nTh).hasClass(aTargets[j])){fn(k,aoColDefs[i]);}}}}}}}}if(aoCols){for(i=0,iLen=aoCols.length;i<iLen;i++){fn(i,aoCols[i]);}}}function _fnAddData(oSettings,aDataSupplied){var oCol;var aDataIn=($.isArray(aDataSupplied))?aDataSupplied.slice():$.extend(true,{},aDataSupplied);var iRow=oSettings.aoData.length;var oData=$.extend(true,{},DataTable.models.oRow);oData._aData=aDataIn;oSettings.aoData.push(oData);var nTd,sThisType;for(var i=0,iLen=oSettings.aoColumns.length;i<iLen;i++){oCol=oSettings.aoColumns[i];if(typeof oCol.fnRender==="function"&&oCol.bUseRendered&&oCol.mData!==null){_fnSetCellData(oSettings,iRow,i,_fnRender(oSettings,iRow,i));}else{_fnSetCellData(oSettings,iRow,i,_fnGetCellData(oSettings,iRow,i));}if(oCol._bAutoType&&oCol.sType!="string"){var sVarType=_fnGetCellData(oSettings,iRow,i,"type");if(sVarType!==null&&sVarType!==""){sThisType=_fnDetectType(sVarType);if(oCol.sType===null){oCol.sType=sThisType;}else{if(oCol.sType!=sThisType&&oCol.sType!="html"){oCol.sType="string";}}}}}oSettings.aiDisplayMaster.push(iRow);if(!oSettings.oFeatures.bDeferRender){_fnCreateTr(oSettings,iRow);}return iRow;}function _fnGatherData(oSettings){var iLoop,i,iLen,j,jLen,jInner,nTds,nTrs,nTd,nTr,aLocalData,iThisIndex,iRow,iRows,iColumn,iColumns,sNodeName,oCol,oData;if(oSettings.bDeferLoading||oSettings.sAjaxSource===null){nTr=oSettings.nTBody.firstChild;while(nTr){if(nTr.nodeName.toUpperCase()=="TR"){iThisIndex=oSettings.aoData.length;nTr._DT_RowIndex=iThisIndex;oSettings.aoData.push($.extend(true,{},DataTable.models.oRow,{nTr:nTr}));oSettings.aiDisplayMaster.push(iThisIndex);nTd=nTr.firstChild;jInner=0;while(nTd){sNodeName=nTd.nodeName.toUpperCase();if(sNodeName=="TD"||sNodeName=="TH"){_fnSetCellData(oSettings,iThisIndex,jInner,$.trim(nTd.innerHTML));jInner++;}nTd=nTd.nextSibling;}}nTr=nTr.nextSibling;}}nTrs=_fnGetTrNodes(oSettings);nTds=[];for(i=0,iLen=nTrs.length;i<iLen;i++){nTd=nTrs[i].firstChild;while(nTd){sNodeName=nTd.nodeName.toUpperCase();if(sNodeName=="TD"||sNodeName=="TH"){nTds.push(nTd);}nTd=nTd.nextSibling;}}for(iColumn=0,iColumns=oSettings.aoColumns.length;iColumn<iColumns;iColumn++){oCol=oSettings.aoColumns[iColumn];if(oCol.sTitle===null){oCol.sTitle=oCol.nTh.innerHTML;}var bAutoType=oCol._bAutoType,bRender=typeof oCol.fnRender==="function",bClass=oCol.sClass!==null,bVisible=oCol.bVisible,nCell,sThisType,sRendered,sValType;if(bAutoType||bRender||bClass||!bVisible){for(iRow=0,iRows=oSettings.aoData.length;iRow<iRows;iRow++){oData=oSettings.aoData[iRow];nCell=nTds[(iRow*iColumns)+iColumn];if(bAutoType&&oCol.sType!="string"){sValType=_fnGetCellData(oSettings,iRow,iColumn,"type");if(sValType!==""){sThisType=_fnDetectType(sValType);if(oCol.sType===null){oCol.sType=sThisType;}else{if(oCol.sType!=sThisType&&oCol.sType!="html"){oCol.sType="string";}}}}if(oCol.mRender){nCell.innerHTML=_fnGetCellData(oSettings,iRow,iColumn,"display");}else{if(oCol.mData!==iColumn){nCell.innerHTML=_fnGetCellData(oSettings,iRow,iColumn,"display");}}if(bRender){sRendered=_fnRender(oSettings,iRow,iColumn);nCell.innerHTML=sRendered;if(oCol.bUseRendered){_fnSetCellData(oSettings,iRow,iColumn,sRendered);}}if(bClass){nCell.className+=" "+oCol.sClass;}if(!bVisible){oData._anHidden[iColumn]=nCell;nCell.parentNode.removeChild(nCell);}else{oData._anHidden[iColumn]=null;}if(oCol.fnCreatedCell){oCol.fnCreatedCell.call(oSettings.oInstance,nCell,_fnGetCellData(oSettings,iRow,iColumn,"display"),oData._aData,iRow,iColumn);}}}}if(oSettings.aoRowCreatedCallback.length!==0){for(i=0,iLen=oSettings.aoData.length;i<iLen;i++){oData=oSettings.aoData[i];_fnCallbackFire(oSettings,"aoRowCreatedCallback",null,[oData.nTr,oData._aData,i]);}}}function _fnNodeToDataIndex(oSettings,n){return(n._DT_RowIndex!==undefined)?n._DT_RowIndex:null;}function _fnNodeToColumnIndex(oSettings,iRow,n){var anCells=_fnGetTdNodes(oSettings,iRow);for(var i=0,iLen=oSettings.aoColumns.length;i<iLen;i++){if(anCells[i]===n){return i;}}return -1;}function _fnGetRowData(oSettings,iRow,sSpecific,aiColumns){var out=[];for(var i=0,iLen=aiColumns.length;i<iLen;i++){out.push(_fnGetCellData(oSettings,iRow,aiColumns[i],sSpecific));}return out;}function _fnGetCellData(oSettings,iRow,iCol,sSpecific){var sData;var oCol=oSettings.aoColumns[iCol];var oData=oSettings.aoData[iRow]._aData;if((sData=oCol.fnGetData(oData,sSpecific))===undefined){if(oSettings.iDrawError!=oSettings.iDraw&&oCol.sDefaultContent===null){_fnLog(oSettings,0,"Requested unknown parameter "+(typeof oCol.mData=="function"?"{mData function}":"'"+oCol.mData+"'")+" from the data source for row "+iRow);oSettings.iDrawError=oSettings.iDraw;}return oCol.sDefaultContent;}if(sData===null&&oCol.sDefaultContent!==null){sData=oCol.sDefaultContent;}else{if(typeof sData==="function"){return sData();}}if(sSpecific=="display"&&sData===null){return"";}return sData;}function _fnSetCellData(oSettings,iRow,iCol,val){var oCol=oSettings.aoColumns[iCol];var oData=oSettings.aoData[iRow]._aData;oCol.fnSetData(oData,val);}var __reArray=/\[.*?\]$/;function _fnGetObjectDataFn(mSource){if(mSource===null){return function(data,type){return null;};}else{if(typeof mSource==="function"){return function(data,type,extra){return mSource(data,type,extra);};}else{if(typeof mSource==="string"&&(mSource.indexOf(".")!==-1||mSource.indexOf("[")!==-1)){var fetchData=function(data,type,src){var a=src.split(".");var arrayNotation,out,innerSrc;if(src!==""){for(var i=0,iLen=a.length;i<iLen;i++){arrayNotation=a[i].match(__reArray);if(arrayNotation){a[i]=a[i].replace(__reArray,"");if(a[i]!==""){data=data[a[i]];}out=[];a.splice(0,i+1);innerSrc=a.join(".");for(var j=0,jLen=data.length;j<jLen;j++){out.push(fetchData(data[j],type,innerSrc));}var join=arrayNotation[0].substring(1,arrayNotation[0].length-1);data=(join==="")?out:out.join(join);break;}if(data===null||data[a[i]]===undefined){return undefined;}data=data[a[i]];}}return data;};return function(data,type){return fetchData(data,type,mSource);};}else{return function(data,type){return data[mSource];};}}}}function _fnSetObjectDataFn(mSource){if(mSource===null){return function(data,val){};}else{if(typeof mSource==="function"){return function(data,val){mSource(data,"set",val);};}else{if(typeof mSource==="string"&&(mSource.indexOf(".")!==-1||mSource.indexOf("[")!==-1)){var setData=function(data,val,src){var a=src.split("."),b;var arrayNotation,o,innerSrc;for(var i=0,iLen=a.length-1;i<iLen;i++){arrayNotation=a[i].match(__reArray);if(arrayNotation){a[i]=a[i].replace(__reArray,"");data[a[i]]=[];b=a.slice();b.splice(0,i+1);innerSrc=b.join(".");for(var j=0,jLen=val.length;j<jLen;j++){o={};setData(o,val[j],innerSrc);data[a[i]].push(o);}return;}if(data[a[i]]===null||data[a[i]]===undefined){data[a[i]]={};}data=data[a[i]];}data[a[a.length-1].replace(__reArray,"")]=val;};return function(data,val){return setData(data,val,mSource);};}else{return function(data,val){data[mSource]=val;};}}}}function _fnGetDataMaster(oSettings){var aData=[];var iLen=oSettings.aoData.length;for(var i=0;i<iLen;i++){aData.push(oSettings.aoData[i]._aData);}return aData;}function _fnClearTable(oSettings){oSettings.aoData.splice(0,oSettings.aoData.length);oSettings.aiDisplayMaster.splice(0,oSettings.aiDisplayMaster.length);oSettings.aiDisplay.splice(0,oSettings.aiDisplay.length);_fnCalculateEnd(oSettings);}function _fnDeleteIndex(a,iTarget){var iTargetIndex=-1;for(var i=0,iLen=a.length;i<iLen;i++){if(a[i]==iTarget){iTargetIndex=i;}else{if(a[i]>iTarget){a[i]--;}}}if(iTargetIndex!=-1){a.splice(iTargetIndex,1);}}function _fnRender(oSettings,iRow,iCol){var oCol=oSettings.aoColumns[iCol];return oCol.fnRender({iDataRow:iRow,iDataColumn:iCol,oSettings:oSettings,aData:oSettings.aoData[iRow]._aData,mDataProp:oCol.mData},_fnGetCellData(oSettings,iRow,iCol,"display"));}function _fnCreateTr(oSettings,iRow){var oData=oSettings.aoData[iRow];var nTd;if(oData.nTr===null){oData.nTr=document.createElement("tr");oData.nTr._DT_RowIndex=iRow;if(oData._aData.DT_RowId){oData.nTr.id=oData._aData.DT_RowId;}if(oData._aData.DT_RowClass){oData.nTr.className=oData._aData.DT_RowClass;}for(var i=0,iLen=oSettings.aoColumns.length;i<iLen;i++){var oCol=oSettings.aoColumns[i];nTd=document.createElement(oCol.sCellType);nTd.innerHTML=(typeof oCol.fnRender==="function"&&(!oCol.bUseRendered||oCol.mData===null))?_fnRender(oSettings,iRow,i):_fnGetCellData(oSettings,iRow,i,"display");if(oCol.sClass!==null){nTd.className=oCol.sClass;}if(oCol.bVisible){oData.nTr.appendChild(nTd);oData._anHidden[i]=null;}else{oData._anHidden[i]=nTd;}if(oCol.fnCreatedCell){oCol.fnCreatedCell.call(oSettings.oInstance,nTd,_fnGetCellData(oSettings,iRow,i,"display"),oData._aData,iRow,i);}}_fnCallbackFire(oSettings,"aoRowCreatedCallback",null,[oData.nTr,oData._aData,iRow]);}}function _fnBuildHead(oSettings){var i,nTh,iLen,j,jLen;var iThs=$("th, td",oSettings.nTHead).length;var iCorrector=0;var jqChildren;if(iThs!==0){for(i=0,iLen=oSettings.aoColumns.length;i<iLen;i++){nTh=oSettings.aoColumns[i].nTh;nTh.setAttribute("role","columnheader");if(oSettings.aoColumns[i].bSortable){nTh.setAttribute("tabindex",oSettings.iTabIndex);nTh.setAttribute("aria-controls",oSettings.sTableId);}if(oSettings.aoColumns[i].sClass!==null){$(nTh).addClass(oSettings.aoColumns[i].sClass);}if(oSettings.aoColumns[i].sTitle!=nTh.innerHTML){nTh.innerHTML=oSettings.aoColumns[i].sTitle;}}}else{var nTr=document.createElement("tr");for(i=0,iLen=oSettings.aoColumns.length;i<iLen;i++){nTh=oSettings.aoColumns[i].nTh;nTh.innerHTML=oSettings.aoColumns[i].sTitle;nTh.setAttribute("tabindex","0");if(oSettings.aoColumns[i].sClass!==null){$(nTh).addClass(oSettings.aoColumns[i].sClass);}nTr.appendChild(nTh);}$(oSettings.nTHead).html("")[0].appendChild(nTr);_fnDetectHeader(oSettings.aoHeader,oSettings.nTHead);}$(oSettings.nTHead).children("tr").attr("role","row");if(oSettings.bJUI){for(i=0,iLen=oSettings.aoColumns.length;i<iLen;i++){nTh=oSettings.aoColumns[i].nTh;var nDiv=document.createElement("div");nDiv.className=oSettings.oClasses.sSortJUIWrapper;$(nTh).contents().appendTo(nDiv);var nSpan=document.createElement("span");nSpan.className=oSettings.oClasses.sSortIcon;nDiv.appendChild(nSpan);nTh.appendChild(nDiv);}}if(oSettings.oFeatures.bSort){for(i=0;i<oSettings.aoColumns.length;i++){if(oSettings.aoColumns[i].bSortable!==false){_fnSortAttachListener(oSettings,oSettings.aoColumns[i].nTh,i);}else{$(oSettings.aoColumns[i].nTh).addClass(oSettings.oClasses.sSortableNone);}}}if(oSettings.oClasses.sFooterTH!==""){$(oSettings.nTFoot).children("tr").children("th").addClass(oSettings.oClasses.sFooterTH);}if(oSettings.nTFoot!==null){var anCells=_fnGetUniqueThs(oSettings,null,oSettings.aoFooter);for(i=0,iLen=oSettings.aoColumns.length;i<iLen;i++){if(anCells[i]){oSettings.aoColumns[i].nTf=anCells[i];if(oSettings.aoColumns[i].sClass){$(anCells[i]).addClass(oSettings.aoColumns[i].sClass);}}}}}function _fnDrawHead(oSettings,aoSource,bIncludeHidden){var i,iLen,j,jLen,k,kLen,n,nLocalTr;var aoLocal=[];var aApplied=[];var iColumns=oSettings.aoColumns.length;var iRowspan,iColspan;if(bIncludeHidden===undefined){bIncludeHidden=false;}for(i=0,iLen=aoSource.length;i<iLen;i++){aoLocal[i]=aoSource[i].slice();aoLocal[i].nTr=aoSource[i].nTr;for(j=iColumns-1;j>=0;j--){if(!oSettings.aoColumns[j].bVisible&&!bIncludeHidden){aoLocal[i].splice(j,1);}}aApplied.push([]);}for(i=0,iLen=aoLocal.length;i<iLen;i++){nLocalTr=aoLocal[i].nTr;if(nLocalTr){while((n=nLocalTr.firstChild)){nLocalTr.removeChild(n);}}for(j=0,jLen=aoLocal[i].length;j<jLen;j++){iRowspan=1;iColspan=1;if(aApplied[i][j]===undefined){nLocalTr.appendChild(aoLocal[i][j].cell);aApplied[i][j]=1;while(aoLocal[i+iRowspan]!==undefined&&aoLocal[i][j].cell==aoLocal[i+iRowspan][j].cell){aApplied[i+iRowspan][j]=1;iRowspan++;}while(aoLocal[i][j+iColspan]!==undefined&&aoLocal[i][j].cell==aoLocal[i][j+iColspan].cell){for(k=0;k<iRowspan;k++){aApplied[i+k][j+iColspan]=1;}iColspan++;}aoLocal[i][j].cell.rowSpan=iRowspan;aoLocal[i][j].cell.colSpan=iColspan;}}}}function _fnDraw(oSettings){var aPreDraw=_fnCallbackFire(oSettings,"aoPreDrawCallback","preDraw",[oSettings]);if($.inArray(false,aPreDraw)!==-1){_fnProcessingDisplay(oSettings,false);return;}var i,iLen,n;var anRows=[];var iRowCount=0;var iStripes=oSettings.asStripeClasses.length;var iOpenRows=oSettings.aoOpenRows.length;oSettings.bDrawing=true;if(oSettings.iInitDisplayStart!==undefined&&oSettings.iInitDisplayStart!=-1){if(oSettings.oFeatures.bServerSide){oSettings._iDisplayStart=oSettings.iInitDisplayStart;}else{oSettings._iDisplayStart=(oSettings.iInitDisplayStart>=oSettings.fnRecordsDisplay())?0:oSettings.iInitDisplayStart;}oSettings.iInitDisplayStart=-1;_fnCalculateEnd(oSettings);}if(oSettings.bDeferLoading){oSettings.bDeferLoading=false;oSettings.iDraw++;}else{if(!oSettings.oFeatures.bServerSide){oSettings.iDraw++;}else{if(!oSettings.bDestroying&&!_fnAjaxUpdate(oSettings)){return;}}}if(oSettings.aiDisplay.length!==0){var iStart=oSettings._iDisplayStart;var iEnd=oSettings._iDisplayEnd;if(oSettings.oFeatures.bServerSide){iStart=0;iEnd=oSettings.aoData.length;}for(var j=iStart;j<iEnd;j++){var aoData=oSettings.aoData[oSettings.aiDisplay[j]];if(aoData.nTr===null){_fnCreateTr(oSettings,oSettings.aiDisplay[j]);}var nRow=aoData.nTr;if(iStripes!==0){var sStripe=oSettings.asStripeClasses[iRowCount%iStripes];if(aoData._sRowStripe!=sStripe){$(nRow).removeClass(aoData._sRowStripe).addClass(sStripe);aoData._sRowStripe=sStripe;}}_fnCallbackFire(oSettings,"aoRowCallback",null,[nRow,oSettings.aoData[oSettings.aiDisplay[j]]._aData,iRowCount,j]);anRows.push(nRow);iRowCount++;if(iOpenRows!==0){for(var k=0;k<iOpenRows;k++){if(nRow==oSettings.aoOpenRows[k].nParent){anRows.push(oSettings.aoOpenRows[k].nTr);break;}}}}}else{anRows[0]=document.createElement("tr");if(oSettings.asStripeClasses[0]){anRows[0].className=oSettings.asStripeClasses[0];}var oLang=oSettings.oLanguage;var sZero=oLang.sZeroRecords;if(oSettings.iDraw==1&&oSettings.sAjaxSource!==null&&!oSettings.oFeatures.bServerSide){sZero=oLang.sLoadingRecords;}else{if(oLang.sEmptyTable&&oSettings.fnRecordsTotal()===0){sZero=oLang.sEmptyTable;}}var nTd=document.createElement("td");nTd.setAttribute("valign","top");nTd.colSpan=_fnVisbleColumns(oSettings);nTd.className=oSettings.oClasses.sRowEmpty;nTd.innerHTML=_fnInfoMacros(oSettings,sZero);anRows[iRowCount].appendChild(nTd);}_fnCallbackFire(oSettings,"aoHeaderCallback","header",[$(oSettings.nTHead).children("tr")[0],_fnGetDataMaster(oSettings),oSettings._iDisplayStart,oSettings.fnDisplayEnd(),oSettings.aiDisplay]);_fnCallbackFire(oSettings,"aoFooterCallback","footer",[$(oSettings.nTFoot).children("tr")[0],_fnGetDataMaster(oSettings),oSettings._iDisplayStart,oSettings.fnDisplayEnd(),oSettings.aiDisplay]);var nAddFrag=document.createDocumentFragment(),nRemoveFrag=document.createDocumentFragment(),nBodyPar,nTrs;if(oSettings.nTBody){nBodyPar=oSettings.nTBody.parentNode;nRemoveFrag.appendChild(oSettings.nTBody);if(!oSettings.oScroll.bInfinite||!oSettings._bInitComplete||oSettings.bSorted||oSettings.bFiltered){while((n=oSettings.nTBody.firstChild)){oSettings.nTBody.removeChild(n);}}for(i=0,iLen=anRows.length;i<iLen;i++){nAddFrag.appendChild(anRows[i]);}oSettings.nTBody.appendChild(nAddFrag);if(nBodyPar!==null){nBodyPar.appendChild(oSettings.nTBody);}}_fnCallbackFire(oSettings,"aoDrawCallback","draw",[oSettings]);oSettings.bSorted=false;oSettings.bFiltered=false;oSettings.bDrawing=false;if(oSettings.oFeatures.bServerSide){_fnProcessingDisplay(oSettings,false);if(!oSettings._bInitComplete){_fnInitComplete(oSettings);}}}function _fnReDraw(oSettings){if(oSettings.oFeatures.bSort){_fnSort(oSettings,oSettings.oPreviousSearch);}else{if(oSettings.oFeatures.bFilter){_fnFilterComplete(oSettings,oSettings.oPreviousSearch);}else{_fnCalculateEnd(oSettings);_fnDraw(oSettings);}}}function _fnAddOptionsHtml(oSettings){var nHolding=$("<div></div>")[0];oSettings.nTable.parentNode.insertBefore(nHolding,oSettings.nTable);oSettings.nTableWrapper=$('<div id="'+oSettings.sTableId+'_wrapper" class="'+oSettings.oClasses.sWrapper+'" role="grid"></div>')[0];oSettings.nTableReinsertBefore=oSettings.nTable.nextSibling;var nInsertNode=oSettings.nTableWrapper;var aDom=oSettings.sDom.split("");var nTmp,iPushFeature,cOption,nNewNode,cNext,sAttr,j;for(var i=0;i<aDom.length;i++){iPushFeature=0;cOption=aDom[i];if(cOption=="<"){nNewNode=$("<div></div>")[0];cNext=aDom[i+1];if(cNext=="'"||cNext=='"'){sAttr="";j=2;while(aDom[i+j]!=cNext){sAttr+=aDom[i+j];j++;}if(sAttr=="H"){sAttr=oSettings.oClasses.sJUIHeader;}else{if(sAttr=="F"){sAttr=oSettings.oClasses.sJUIFooter;}}if(sAttr.indexOf(".")!=-1){var aSplit=sAttr.split(".");nNewNode.id=aSplit[0].substr(1,aSplit[0].length-1);nNewNode.className=aSplit[1];}else{if(sAttr.charAt(0)=="#"){nNewNode.id=sAttr.substr(1,sAttr.length-1);}else{nNewNode.className=sAttr;}}i+=j;}nInsertNode.appendChild(nNewNode);nInsertNode=nNewNode;}else{if(cOption==">"){nInsertNode=nInsertNode.parentNode;}else{if(cOption=="l"&&oSettings.oFeatures.bPaginate&&oSettings.oFeatures.bLengthChange){nTmp=_fnFeatureHtmlLength(oSettings);iPushFeature=1;}else{if(cOption=="f"&&oSettings.oFeatures.bFilter){nTmp=_fnFeatureHtmlFilter(oSettings);iPushFeature=1;}else{if(cOption=="r"&&oSettings.oFeatures.bProcessing){nTmp=_fnFeatureHtmlProcessing(oSettings);iPushFeature=1;}else{if(cOption=="t"){nTmp=_fnFeatureHtmlTable(oSettings);iPushFeature=1;}else{if(cOption=="i"&&oSettings.oFeatures.bInfo){nTmp=_fnFeatureHtmlInfo(oSettings);iPushFeature=1;}else{if(cOption=="p"&&oSettings.oFeatures.bPaginate){nTmp=_fnFeatureHtmlPaginate(oSettings);iPushFeature=1;}else{if(DataTable.ext.aoFeatures.length!==0){var aoFeatures=DataTable.ext.aoFeatures;for(var k=0,kLen=aoFeatures.length;k<kLen;k++){if(cOption==aoFeatures[k].cFeature){nTmp=aoFeatures[k].fnInit(oSettings);if(nTmp){iPushFeature=1;}break;}}}}}}}}}}}if(iPushFeature==1&&nTmp!==null){if(typeof oSettings.aanFeatures[cOption]!=="object"){oSettings.aanFeatures[cOption]=[];}oSettings.aanFeatures[cOption].push(nTmp);nInsertNode.appendChild(nTmp);}}nHolding.parentNode.replaceChild(oSettings.nTableWrapper,nHolding);}function _fnDetectHeader(aLayout,nThead){var nTrs=$(nThead).children("tr");var nTr,nCell;var i,k,l,iLen,jLen,iColShifted,iColumn,iColspan,iRowspan;var bUnique;var fnShiftCol=function(a,i,j){var k=a[i];while(k[j]){j++;}return j;};aLayout.splice(0,aLayout.length);for(i=0,iLen=nTrs.length;i<iLen;i++){aLayout.push([]);}for(i=0,iLen=nTrs.length;i<iLen;i++){nTr=nTrs[i];iColumn=0;nCell=nTr.firstChild;while(nCell){if(nCell.nodeName.toUpperCase()=="TD"||nCell.nodeName.toUpperCase()=="TH"){iColspan=nCell.getAttribute("colspan")*1;iRowspan=nCell.getAttribute("rowspan")*1;iColspan=(!iColspan||iColspan===0||iColspan===1)?1:iColspan;iRowspan=(!iRowspan||iRowspan===0||iRowspan===1)?1:iRowspan;iColShifted=fnShiftCol(aLayout,i,iColumn);bUnique=iColspan===1?true:false;for(l=0;l<iColspan;l++){for(k=0;k<iRowspan;k++){aLayout[i+k][iColShifted+l]={cell:nCell,unique:bUnique};aLayout[i+k].nTr=nTr;}}}nCell=nCell.nextSibling;}}}function _fnGetUniqueThs(oSettings,nHeader,aLayout){var aReturn=[];if(!aLayout){aLayout=oSettings.aoHeader;if(nHeader){aLayout=[];_fnDetectHeader(aLayout,nHeader);}}for(var i=0,iLen=aLayout.length;i<iLen;i++){for(var j=0,jLen=aLayout[i].length;j<jLen;j++){if(aLayout[i][j].unique&&(!aReturn[j]||!oSettings.bSortCellsTop)){aReturn[j]=aLayout[i][j].cell;}}}return aReturn;}function _fnAjaxUpdate(oSettings){if(oSettings.bAjaxDataGet){oSettings.iDraw++;_fnProcessingDisplay(oSettings,true);var iColumns=oSettings.aoColumns.length;var aoData=_fnAjaxParameters(oSettings);_fnServerParams(oSettings,aoData);oSettings.fnServerData.call(oSettings.oInstance,oSettings.sAjaxSource,aoData,function(json){_fnAjaxUpdateDraw(oSettings,json);},oSettings);return false;}else{return true;}}function _fnAjaxParameters(oSettings){var iColumns=oSettings.aoColumns.length;var aoData=[],mDataProp,aaSort,aDataSort;var i,j;aoData.push({name:"sEcho",value:oSettings.iDraw});aoData.push({name:"iColumns",value:iColumns});aoData.push({name:"sColumns",value:_fnColumnOrdering(oSettings)});aoData.push({name:"iDisplayStart",value:oSettings._iDisplayStart});aoData.push({name:"iDisplayLength",value:oSettings.oFeatures.bPaginate!==false?oSettings._iDisplayLength:-1});for(i=0;i<iColumns;i++){mDataProp=oSettings.aoColumns[i].mData;aoData.push({name:"mDataProp_"+i,value:typeof(mDataProp)==="function"?"function":mDataProp});}if(oSettings.oFeatures.bFilter!==false){aoData.push({name:"sSearch",value:oSettings.oPreviousSearch.sSearch});aoData.push({name:"bRegex",value:oSettings.oPreviousSearch.bRegex});for(i=0;i<iColumns;i++){aoData.push({name:"sSearch_"+i,value:oSettings.aoPreSearchCols[i].sSearch});aoData.push({name:"bRegex_"+i,value:oSettings.aoPreSearchCols[i].bRegex});aoData.push({name:"bSearchable_"+i,value:oSettings.aoColumns[i].bSearchable});}}if(oSettings.oFeatures.bSort!==false){var iCounter=0;aaSort=(oSettings.aaSortingFixed!==null)?oSettings.aaSortingFixed.concat(oSettings.aaSorting):oSettings.aaSorting.slice();for(i=0;i<aaSort.length;i++){aDataSort=oSettings.aoColumns[aaSort[i][0]].aDataSort;for(j=0;j<aDataSort.length;j++){aoData.push({name:"iSortCol_"+iCounter,value:aDataSort[j]});aoData.push({name:"sSortDir_"+iCounter,value:aaSort[i][1]});iCounter++;}}aoData.push({name:"iSortingCols",value:iCounter});for(i=0;i<iColumns;i++){aoData.push({name:"bSortable_"+i,value:oSettings.aoColumns[i].bSortable});}}return aoData;}function _fnServerParams(oSettings,aoData){_fnCallbackFire(oSettings,"aoServerParams","serverParams",[aoData]);}function _fnAjaxUpdateDraw(oSettings,json){if(json.sEcho!==undefined){if(json.sEcho*1<oSettings.iDraw){return;}else{oSettings.iDraw=json.sEcho*1;}}if(!oSettings.oScroll.bInfinite||(oSettings.oScroll.bInfinite&&(oSettings.bSorted||oSettings.bFiltered))){_fnClearTable(oSettings);}oSettings._iRecordsTotal=parseInt(json.iTotalRecords,10);oSettings._iRecordsDisplay=parseInt(json.iTotalDisplayRecords,10);var sOrdering=_fnColumnOrdering(oSettings);var bReOrder=(json.sColumns!==undefined&&sOrdering!==""&&json.sColumns!=sOrdering);var aiIndex;if(bReOrder){aiIndex=_fnReOrderIndex(oSettings,json.sColumns);}var aData=_fnGetObjectDataFn(oSettings.sAjaxDataProp)(json);for(var i=0,iLen=aData.length;i<iLen;i++){if(bReOrder){var aDataSorted=[];for(var j=0,jLen=oSettings.aoColumns.length;j<jLen;j++){aDataSorted.push(aData[i][aiIndex[j]]);}_fnAddData(oSettings,aDataSorted);}else{_fnAddData(oSettings,aData[i]);}}oSettings.aiDisplay=oSettings.aiDisplayMaster.slice();oSettings.bAjaxDataGet=false;_fnDraw(oSettings);oSettings.bAjaxDataGet=true;_fnProcessingDisplay(oSettings,false);}function _fnFeatureHtmlFilter(oSettings){var oPreviousSearch=oSettings.oPreviousSearch;var sSearchStr=oSettings.oLanguage.sSearch;sSearchStr=(sSearchStr.indexOf("_INPUT_")!==-1)?sSearchStr.replace("_INPUT_",'<input class="form-control"  placeholder="Filter" type="text">'):sSearchStr===""?'<input type="text" />':sSearchStr+' <input type="text" />';var nFilter=document.createElement("div");nFilter.className=oSettings.oClasses.sFilter;nFilter.innerHTML='<div class="input-group"><span class="input-group-addon"><i class="fa fa-search"></i></span>'+sSearchStr+"</div>";if(!oSettings.aanFeatures.f){nFilter.id=oSettings.sTableId+"_filter";}var jqFilter=$('input[type="text"]',nFilter);nFilter._DT_Input=jqFilter[0];jqFilter.val(oPreviousSearch.sSearch.replace('"',"&quot;"));jqFilter.bind("keyup.DT",function(e){var n=oSettings.aanFeatures.f;var val=this.value===""?"":this.value;for(var i=0,iLen=n.length;i<iLen;i++){if(n[i]!=$(this).parents("div.dataTables_filter")[0]){$(n[i]._DT_Input).val(val);}}if(val!=oPreviousSearch.sSearch){_fnFilterComplete(oSettings,{sSearch:val,bRegex:oPreviousSearch.bRegex,bSmart:oPreviousSearch.bSmart,bCaseInsensitive:oPreviousSearch.bCaseInsensitive});}});jqFilter.attr("aria-controls",oSettings.sTableId).bind("keypress.DT",function(e){if(e.keyCode==13){return false;}});return nFilter;}function _fnFilterComplete(oSettings,oInput,iForce){var oPrevSearch=oSettings.oPreviousSearch;var aoPrevSearch=oSettings.aoPreSearchCols;var fnSaveFilter=function(oFilter){oPrevSearch.sSearch=oFilter.sSearch;oPrevSearch.bRegex=oFilter.bRegex;oPrevSearch.bSmart=oFilter.bSmart;oPrevSearch.bCaseInsensitive=oFilter.bCaseInsensitive;};if(!oSettings.oFeatures.bServerSide){_fnFilter(oSettings,oInput.sSearch,iForce,oInput.bRegex,oInput.bSmart,oInput.bCaseInsensitive);fnSaveFilter(oInput);for(var i=0;i<oSettings.aoPreSearchCols.length;i++){_fnFilterColumn(oSettings,aoPrevSearch[i].sSearch,i,aoPrevSearch[i].bRegex,aoPrevSearch[i].bSmart,aoPrevSearch[i].bCaseInsensitive);}_fnFilterCustom(oSettings);}else{fnSaveFilter(oInput);}oSettings.bFiltered=true;$(oSettings.oInstance).trigger("filter",oSettings);oSettings._iDisplayStart=0;_fnCalculateEnd(oSettings);_fnDraw(oSettings);_fnBuildSearchArray(oSettings,0);}function _fnFilterCustom(oSettings){var afnFilters=DataTable.ext.afnFiltering;var aiFilterColumns=_fnGetColumns(oSettings,"bSearchable");for(var i=0,iLen=afnFilters.length;i<iLen;i++){var iCorrector=0;for(var j=0,jLen=oSettings.aiDisplay.length;j<jLen;j++){var iDisIndex=oSettings.aiDisplay[j-iCorrector];var bTest=afnFilters[i](oSettings,_fnGetRowData(oSettings,iDisIndex,"filter",aiFilterColumns),iDisIndex);if(!bTest){oSettings.aiDisplay.splice(j-iCorrector,1);iCorrector++;}}}}function _fnFilterColumn(oSettings,sInput,iColumn,bRegex,bSmart,bCaseInsensitive){if(sInput===""){return;}var iIndexCorrector=0;var rpSearch=_fnFilterCreateSearch(sInput,bRegex,bSmart,bCaseInsensitive);for(var i=oSettings.aiDisplay.length-1;i>=0;i--){var sData=_fnDataToSearch(_fnGetCellData(oSettings,oSettings.aiDisplay[i],iColumn,"filter"),oSettings.aoColumns[iColumn].sType);if(!rpSearch.test(sData)){oSettings.aiDisplay.splice(i,1);iIndexCorrector++;}}}function _fnFilter(oSettings,sInput,iForce,bRegex,bSmart,bCaseInsensitive){var i;var rpSearch=_fnFilterCreateSearch(sInput,bRegex,bSmart,bCaseInsensitive);var oPrevSearch=oSettings.oPreviousSearch;if(!iForce){iForce=0;}if(DataTable.ext.afnFiltering.length!==0){iForce=1;}if(sInput.length<=0){oSettings.aiDisplay.splice(0,oSettings.aiDisplay.length);oSettings.aiDisplay=oSettings.aiDisplayMaster.slice();}else{if(oSettings.aiDisplay.length==oSettings.aiDisplayMaster.length||oPrevSearch.sSearch.length>sInput.length||iForce==1||sInput.indexOf(oPrevSearch.sSearch)!==0){oSettings.aiDisplay.splice(0,oSettings.aiDisplay.length);_fnBuildSearchArray(oSettings,1);for(i=0;i<oSettings.aiDisplayMaster.length;i++){if(rpSearch.test(oSettings.asDataSearch[i])){oSettings.aiDisplay.push(oSettings.aiDisplayMaster[i]);}}}else{var iIndexCorrector=0;for(i=0;i<oSettings.asDataSearch.length;i++){if(!rpSearch.test(oSettings.asDataSearch[i])){oSettings.aiDisplay.splice(i-iIndexCorrector,1);iIndexCorrector++;}}}}}function _fnBuildSearchArray(oSettings,iMaster){if(!oSettings.oFeatures.bServerSide){oSettings.asDataSearch=[];var aiFilterColumns=_fnGetColumns(oSettings,"bSearchable");var aiIndex=(iMaster===1)?oSettings.aiDisplayMaster:oSettings.aiDisplay;for(var i=0,iLen=aiIndex.length;i<iLen;i++){oSettings.asDataSearch[i]=_fnBuildSearchRow(oSettings,_fnGetRowData(oSettings,aiIndex[i],"filter",aiFilterColumns));}}}function _fnBuildSearchRow(oSettings,aData){var sSearch=aData.join("  ");if(sSearch.indexOf("&")!==-1){sSearch=$("<div>").html(sSearch).text();}return sSearch.replace(/[\n\r]/g," ");}function _fnFilterCreateSearch(sSearch,bRegex,bSmart,bCaseInsensitive){var asSearch,sRegExpString;if(bSmart){asSearch=bRegex?sSearch.split(" "):_fnEscapeRegex(sSearch).split(" ");sRegExpString="^(?=.*?"+asSearch.join(")(?=.*?")+").*$";return new RegExp(sRegExpString,bCaseInsensitive?"i":"");}else{sSearch=bRegex?sSearch:_fnEscapeRegex(sSearch);return new RegExp(sSearch,bCaseInsensitive?"i":"");}}function _fnDataToSearch(sData,sType){if(typeof DataTable.ext.ofnSearch[sType]==="function"){return DataTable.ext.ofnSearch[sType](sData);}else{if(sData===null){return"";}else{if(sType=="html"){return sData.replace(/[\r\n]/g," ").replace(/<.*?>/g,"");}else{if(typeof sData==="string"){return sData.replace(/[\r\n]/g," ");}}}}return sData;}function _fnEscapeRegex(sVal){var acEscape=["/",".","*","+","?","|","(",")","[","]","{","}","\\","$","^","-"];var reReplace=new RegExp("(\\"+acEscape.join("|\\")+")","g");return sVal.replace(reReplace,"\\$1");}function _fnFeatureHtmlInfo(oSettings){var nInfo=document.createElement("div");nInfo.className=oSettings.oClasses.sInfo;if(!oSettings.aanFeatures.i){oSettings.aoDrawCallback.push({fn:_fnUpdateInfo,sName:"information"});nInfo.id=oSettings.sTableId+"_info";}oSettings.nTable.setAttribute("aria-describedby",oSettings.sTableId+"_info");return nInfo;}function _fnUpdateInfo(oSettings){if(!oSettings.oFeatures.bInfo||oSettings.aanFeatures.i.length===0){return;}var oLang=oSettings.oLanguage,iStart=oSettings._iDisplayStart+1,iEnd=oSettings.fnDisplayEnd(),iMax=oSettings.fnRecordsTotal(),iTotal=oSettings.fnRecordsDisplay(),sOut;if(iTotal===0){sOut=oLang.sInfoEmpty;}else{sOut=oLang.sInfo;}if(iTotal!=iMax){sOut+=" "+oLang.sInfoFiltered;}sOut+=oLang.sInfoPostFix;sOut=_fnInfoMacros(oSettings,sOut);if(oLang.fnInfoCallback!==null){sOut=oLang.fnInfoCallback.call(oSettings.oInstance,oSettings,iStart,iEnd,iMax,iTotal,sOut);}var n=oSettings.aanFeatures.i;for(var i=0,iLen=n.length;i<iLen;i++){$(n[i]).html(sOut);}}function _fnInfoMacros(oSettings,str){var iStart=oSettings._iDisplayStart+1,sStart=oSettings.fnFormatNumber(iStart),iEnd=oSettings.fnDisplayEnd(),sEnd=oSettings.fnFormatNumber(iEnd),iTotal=oSettings.fnRecordsDisplay(),sTotal=oSettings.fnFormatNumber(iTotal),iMax=oSettings.fnRecordsTotal(),sMax=oSettings.fnFormatNumber(iMax);if(oSettings.oScroll.bInfinite){sStart=oSettings.fnFormatNumber(1);}return str.replace(/_START_/g,sStart).replace(/_END_/g,sEnd).replace(/_TOTAL_/g,sTotal).replace(/_MAX_/g,sMax);}function _fnInitialise(oSettings){var i,iLen,iAjaxStart=oSettings.iInitDisplayStart;if(oSettings.bInitialised===false){setTimeout(function(){_fnInitialise(oSettings);},200);return;}_fnAddOptionsHtml(oSettings);_fnBuildHead(oSettings);_fnDrawHead(oSettings,oSettings.aoHeader);if(oSettings.nTFoot){_fnDrawHead(oSettings,oSettings.aoFooter);}_fnProcessingDisplay(oSettings,true);if(oSettings.oFeatures.bAutoWidth){_fnCalculateColumnWidths(oSettings);}for(i=0,iLen=oSettings.aoColumns.length;i<iLen;i++){if(oSettings.aoColumns[i].sWidth!==null){oSettings.aoColumns[i].nTh.style.width=_fnStringToCss(oSettings.aoColumns[i].sWidth);}}if(oSettings.oFeatures.bSort){_fnSort(oSettings);}else{if(oSettings.oFeatures.bFilter){_fnFilterComplete(oSettings,oSettings.oPreviousSearch);}else{oSettings.aiDisplay=oSettings.aiDisplayMaster.slice();_fnCalculateEnd(oSettings);_fnDraw(oSettings);}}if(oSettings.sAjaxSource!==null&&!oSettings.oFeatures.bServerSide){var aoData=[];_fnServerParams(oSettings,aoData);oSettings.fnServerData.call(oSettings.oInstance,oSettings.sAjaxSource,aoData,function(json){var aData=(oSettings.sAjaxDataProp!=="")?_fnGetObjectDataFn(oSettings.sAjaxDataProp)(json):json;for(i=0;i<aData.length;i++){_fnAddData(oSettings,aData[i]);}oSettings.iInitDisplayStart=iAjaxStart;if(oSettings.oFeatures.bSort){_fnSort(oSettings);}else{oSettings.aiDisplay=oSettings.aiDisplayMaster.slice();_fnCalculateEnd(oSettings);_fnDraw(oSettings);}_fnProcessingDisplay(oSettings,false);_fnInitComplete(oSettings,json);},oSettings);return;}if(!oSettings.oFeatures.bServerSide){_fnProcessingDisplay(oSettings,false);_fnInitComplete(oSettings);}}function _fnInitComplete(oSettings,json){oSettings._bInitComplete=true;_fnCallbackFire(oSettings,"aoInitComplete","init",[oSettings,json]);}function _fnLanguageCompat(oLanguage){var oDefaults=DataTable.defaults.oLanguage;if(!oLanguage.sEmptyTable&&oLanguage.sZeroRecords&&oDefaults.sEmptyTable==="No data available in table"){_fnMap(oLanguage,oLanguage,"sZeroRecords","sEmptyTable");}if(!oLanguage.sLoadingRecords&&oLanguage.sZeroRecords&&oDefaults.sLoadingRecords==="Loading..."){_fnMap(oLanguage,oLanguage,"sZeroRecords","sLoadingRecords");}}function _fnFeatureHtmlLength(oSettings){if(oSettings.oScroll.bInfinite){return null;}var sName='name="'+oSettings.sTableId+'_length"';var sStdMenu='<select size="1" '+sName+">";var i,iLen;var aLengthMenu=oSettings.aLengthMenu;if(aLengthMenu.length==2&&typeof aLengthMenu[0]==="object"&&typeof aLengthMenu[1]==="object"){for(i=0,iLen=aLengthMenu[0].length;i<iLen;i++){sStdMenu+='<option value="'+aLengthMenu[0][i]+'">'+aLengthMenu[1][i]+"</option>";}}else{for(i=0,iLen=aLengthMenu.length;i<iLen;i++){sStdMenu+='<option value="'+aLengthMenu[i]+'">'+aLengthMenu[i]+"</option>";}}sStdMenu+="</select>";var nLength=document.createElement("div");if(!oSettings.aanFeatures.l){nLength.id=oSettings.sTableId+"_length";}nLength.className=oSettings.oClasses.sLength;nLength.innerHTML='<span class="smart-form"><label class="select" style="width:60px">'+oSettings.oLanguage.sLengthMenu.replace("_MENU_",sStdMenu)+"<i></i></label></span>";$('select option[value="'+oSettings._iDisplayLength+'"]',nLength).attr("selected",true);$("select",nLength).bind("change.DT",function(e){var iVal=$(this).val();var n=oSettings.aanFeatures.l;for(i=0,iLen=n.length;i<iLen;i++){if(n[i]!=this.parentNode){$("select",n[i]).val(iVal);}}oSettings._iDisplayLength=parseInt(iVal,10);_fnCalculateEnd(oSettings);if(oSettings.fnDisplayEnd()==oSettings.fnRecordsDisplay()){oSettings._iDisplayStart=oSettings.fnDisplayEnd()-oSettings._iDisplayLength;if(oSettings._iDisplayStart<0){oSettings._iDisplayStart=0;}}if(oSettings._iDisplayLength==-1){oSettings._iDisplayStart=0;}_fnDraw(oSettings);});$("select",nLength).attr("aria-controls",oSettings.sTableId);return nLength;}function _fnCalculateEnd(oSettings){if(oSettings.oFeatures.bPaginate===false){oSettings._iDisplayEnd=oSettings.aiDisplay.length;}else{if(oSettings._iDisplayStart+oSettings._iDisplayLength>oSettings.aiDisplay.length||oSettings._iDisplayLength==-1){oSettings._iDisplayEnd=oSettings.aiDisplay.length;}else{oSettings._iDisplayEnd=oSettings._iDisplayStart+oSettings._iDisplayLength;}}}function _fnFeatureHtmlPaginate(oSettings){if(oSettings.oScroll.bInfinite){return null;}var nPaginate=document.createElement("div");nPaginate.className=oSettings.oClasses.sPaging+oSettings.sPaginationType;DataTable.ext.oPagination[oSettings.sPaginationType].fnInit(oSettings,nPaginate,function(oSettings){_fnCalculateEnd(oSettings);_fnDraw(oSettings);});if(!oSettings.aanFeatures.p){oSettings.aoDrawCallback.push({fn:function(oSettings){DataTable.ext.oPagination[oSettings.sPaginationType].fnUpdate(oSettings,function(oSettings){_fnCalculateEnd(oSettings);_fnDraw(oSettings);});},sName:"pagination"});}return nPaginate;}function _fnPageChange(oSettings,mAction){var iOldStart=oSettings._iDisplayStart;if(typeof mAction==="number"){oSettings._iDisplayStart=mAction*oSettings._iDisplayLength;if(oSettings._iDisplayStart>oSettings.fnRecordsDisplay()){oSettings._iDisplayStart=0;}}else{if(mAction=="first"){oSettings._iDisplayStart=0;}else{if(mAction=="previous"){oSettings._iDisplayStart=oSettings._iDisplayLength>=0?oSettings._iDisplayStart-oSettings._iDisplayLength:0;if(oSettings._iDisplayStart<0){oSettings._iDisplayStart=0;}}else{if(mAction=="next"){if(oSettings._iDisplayLength>=0){if(oSettings._iDisplayStart+oSettings._iDisplayLength<oSettings.fnRecordsDisplay()){oSettings._iDisplayStart+=oSettings._iDisplayLength;}}else{oSettings._iDisplayStart=0;}}else{if(mAction=="last"){if(oSettings._iDisplayLength>=0){var iPages=parseInt((oSettings.fnRecordsDisplay()-1)/oSettings._iDisplayLength,10)+1;oSettings._iDisplayStart=(iPages-1)*oSettings._iDisplayLength;}else{oSettings._iDisplayStart=0;}}else{_fnLog(oSettings,0,"Unknown paging action: "+mAction);}}}}}$(oSettings.oInstance).trigger("page",oSettings);return iOldStart!=oSettings._iDisplayStart;}function _fnFeatureHtmlProcessing(oSettings){var nProcessing=document.createElement("div");if(!oSettings.aanFeatures.r){nProcessing.id=oSettings.sTableId+"_processing";}nProcessing.innerHTML=oSettings.oLanguage.sProcessing;nProcessing.className=oSettings.oClasses.sProcessing;oSettings.nTable.parentNode.insertBefore(nProcessing,oSettings.nTable);return nProcessing;}function _fnProcessingDisplay(oSettings,bShow){if(oSettings.oFeatures.bProcessing){var an=oSettings.aanFeatures.r;for(var i=0,iLen=an.length;i<iLen;i++){an[i].style.visibility=bShow?"visible":"hidden";}}$(oSettings.oInstance).trigger("processing",[oSettings,bShow]);}function _fnFeatureHtmlTable(oSettings){if(oSettings.oScroll.sX===""&&oSettings.oScroll.sY===""){return oSettings.nTable;}var nScroller=document.createElement("div"),nScrollHead=document.createElement("div"),nScrollHeadInner=document.createElement("div"),nScrollBody=document.createElement("div"),nScrollFoot=document.createElement("div"),nScrollFootInner=document.createElement("div"),nScrollHeadTable=oSettings.nTable.cloneNode(false),nScrollFootTable=oSettings.nTable.cloneNode(false),nThead=oSettings.nTable.getElementsByTagName("thead")[0],nTfoot=oSettings.nTable.getElementsByTagName("tfoot").length===0?null:oSettings.nTable.getElementsByTagName("tfoot")[0],oClasses=oSettings.oClasses;nScrollHead.appendChild(nScrollHeadInner);nScrollFoot.appendChild(nScrollFootInner);nScrollBody.appendChild(oSettings.nTable);nScroller.appendChild(nScrollHead);nScroller.appendChild(nScrollBody);nScrollHeadInner.appendChild(nScrollHeadTable);nScrollHeadTable.appendChild(nThead);if(nTfoot!==null){nScroller.appendChild(nScrollFoot);nScrollFootInner.appendChild(nScrollFootTable);nScrollFootTable.appendChild(nTfoot);}nScroller.className=oClasses.sScrollWrapper;nScrollHead.className=oClasses.sScrollHead;nScrollHeadInner.className=oClasses.sScrollHeadInner;nScrollBody.className=oClasses.sScrollBody;nScrollFoot.className=oClasses.sScrollFoot;nScrollFootInner.className=oClasses.sScrollFootInner;if(oSettings.oScroll.bAutoCss){nScrollHead.style.overflow="hidden";nScrollHead.style.position="relative";nScrollFoot.style.overflow="hidden";nScrollBody.style.overflow="auto";}nScrollHead.style.border="0";nScrollHead.style.width="100%";nScrollFoot.style.border="0";nScrollHeadInner.style.width=oSettings.oScroll.sXInner!==""?oSettings.oScroll.sXInner:"100%";nScrollHeadTable.removeAttribute("id");nScrollHeadTable.style.marginLeft="0";oSettings.nTable.style.marginLeft="0";if(nTfoot!==null){nScrollFootTable.removeAttribute("id");nScrollFootTable.style.marginLeft="0";}var nCaption=$(oSettings.nTable).children("caption");if(nCaption.length>0){nCaption=nCaption[0];if(nCaption._captionSide==="top"){nScrollHeadTable.appendChild(nCaption);}else{if(nCaption._captionSide==="bottom"&&nTfoot){nScrollFootTable.appendChild(nCaption);}}}if(oSettings.oScroll.sX!==""){nScrollHead.style.width=_fnStringToCss(oSettings.oScroll.sX);nScrollBody.style.width=_fnStringToCss(oSettings.oScroll.sX);if(nTfoot!==null){nScrollFoot.style.width=_fnStringToCss(oSettings.oScroll.sX);}$(nScrollBody).scroll(function(e){nScrollHead.scrollLeft=this.scrollLeft;if(nTfoot!==null){nScrollFoot.scrollLeft=this.scrollLeft;}});}if(oSettings.oScroll.sY!==""){nScrollBody.style.height=_fnStringToCss(oSettings.oScroll.sY);}oSettings.aoDrawCallback.push({fn:_fnScrollDraw,sName:"scrolling"});if(oSettings.oScroll.bInfinite){$(nScrollBody).scroll(function(){if(!oSettings.bDrawing&&$(this).scrollTop()!==0){if($(this).scrollTop()+$(this).height()>$(oSettings.nTable).height()-oSettings.oScroll.iLoadGap){if(oSettings.fnDisplayEnd()<oSettings.fnRecordsDisplay()){_fnPageChange(oSettings,"next");_fnCalculateEnd(oSettings);_fnDraw(oSettings);}}}});}oSettings.nScrollHead=nScrollHead;oSettings.nScrollFoot=nScrollFoot;return nScroller;}function _fnScrollDraw(o){var nScrollHeadInner=o.nScrollHead.getElementsByTagName("div")[0],nScrollHeadTable=nScrollHeadInner.getElementsByTagName("table")[0],nScrollBody=o.nTable.parentNode,i,iLen,j,jLen,anHeadToSize,anHeadSizers,anFootSizers,anFootToSize,oStyle,iVis,nTheadSize,nTfootSize,iWidth,aApplied=[],aAppliedFooter=[],iSanityWidth,nScrollFootInner=(o.nTFoot!==null)?o.nScrollFoot.getElementsByTagName("div")[0]:null,nScrollFootTable=(o.nTFoot!==null)?nScrollFootInner.getElementsByTagName("table")[0]:null,ie67=o.oBrowser.bScrollOversize,zeroOut=function(nSizer){oStyle=nSizer.style;oStyle.paddingTop="0";oStyle.paddingBottom="0";oStyle.borderTopWidth="0";oStyle.borderBottomWidth="0";oStyle.height=0;};$(o.nTable).children("thead, tfoot").remove();nTheadSize=$(o.nTHead).clone()[0];o.nTable.insertBefore(nTheadSize,o.nTable.childNodes[0]);anHeadToSize=o.nTHead.getElementsByTagName("tr");anHeadSizers=nTheadSize.getElementsByTagName("tr");if(o.nTFoot!==null){nTfootSize=$(o.nTFoot).clone()[0];o.nTable.insertBefore(nTfootSize,o.nTable.childNodes[1]);anFootToSize=o.nTFoot.getElementsByTagName("tr");anFootSizers=nTfootSize.getElementsByTagName("tr");}if(o.oScroll.sX===""){nScrollBody.style.width="100%";nScrollHeadInner.parentNode.style.width="100%";}var nThs=_fnGetUniqueThs(o,nTheadSize);for(i=0,iLen=nThs.length;i<iLen;i++){iVis=_fnVisibleToColumnIndex(o,i);nThs[i].style.width=o.aoColumns[iVis].sWidth;}if(o.nTFoot!==null){_fnApplyToChildren(function(n){n.style.width="";},anFootSizers);}if(o.oScroll.bCollapse&&o.oScroll.sY!==""){nScrollBody.style.height=(nScrollBody.offsetHeight+o.nTHead.offsetHeight)+"px";}iSanityWidth=$(o.nTable).outerWidth();if(o.oScroll.sX===""){o.nTable.style.width="100%";if(ie67&&($("tbody",nScrollBody).height()>nScrollBody.offsetHeight||$(nScrollBody).css("overflow-y")=="scroll")){o.nTable.style.width=_fnStringToCss($(o.nTable).outerWidth()-o.oScroll.iBarWidth);}}else{if(o.oScroll.sXInner!==""){o.nTable.style.width=_fnStringToCss(o.oScroll.sXInner);}else{if(iSanityWidth==$(nScrollBody).width()&&$(nScrollBody).height()<$(o.nTable).height()){o.nTable.style.width=_fnStringToCss(iSanityWidth-o.oScroll.iBarWidth);if($(o.nTable).outerWidth()>iSanityWidth-o.oScroll.iBarWidth){o.nTable.style.width=_fnStringToCss(iSanityWidth);}}else{o.nTable.style.width=_fnStringToCss(iSanityWidth);}}}iSanityWidth=$(o.nTable).outerWidth();_fnApplyToChildren(zeroOut,anHeadSizers);_fnApplyToChildren(function(nSizer){aApplied.push(_fnStringToCss($(nSizer).width()));},anHeadSizers);_fnApplyToChildren(function(nToSize,i){nToSize.style.width=aApplied[i];},anHeadToSize);$(anHeadSizers).height(0);if(o.nTFoot!==null){_fnApplyToChildren(zeroOut,anFootSizers);_fnApplyToChildren(function(nSizer){aAppliedFooter.push(_fnStringToCss($(nSizer).width()));},anFootSizers);_fnApplyToChildren(function(nToSize,i){nToSize.style.width=aAppliedFooter[i];},anFootToSize);$(anFootSizers).height(0);}_fnApplyToChildren(function(nSizer,i){nSizer.innerHTML="";nSizer.style.width=aApplied[i];},anHeadSizers);if(o.nTFoot!==null){_fnApplyToChildren(function(nSizer,i){nSizer.innerHTML="";nSizer.style.width=aAppliedFooter[i];},anFootSizers);}if($(o.nTable).outerWidth()<iSanityWidth){var iCorrection=((nScrollBody.scrollHeight>nScrollBody.offsetHeight||$(nScrollBody).css("overflow-y")=="scroll"))?iSanityWidth+o.oScroll.iBarWidth:iSanityWidth;if(ie67&&(nScrollBody.scrollHeight>nScrollBody.offsetHeight||$(nScrollBody).css("overflow-y")=="scroll")){o.nTable.style.width=_fnStringToCss(iCorrection-o.oScroll.iBarWidth);}nScrollBody.style.width=_fnStringToCss(iCorrection);o.nScrollHead.style.width=_fnStringToCss(iCorrection);if(o.nTFoot!==null){o.nScrollFoot.style.width=_fnStringToCss(iCorrection);}if(o.oScroll.sX===""){_fnLog(o,1,"The table cannot fit into the current element which will cause column misalignment. The table has been drawn at its minimum possible width.");}else{if(o.oScroll.sXInner!==""){_fnLog(o,1,"The table cannot fit into the current element which will cause column misalignment. Increase the sScrollXInner value or remove it to allow automatic calculation");}}}else{nScrollBody.style.width=_fnStringToCss("100%");o.nScrollHead.style.width=_fnStringToCss("100%");if(o.nTFoot!==null){o.nScrollFoot.style.width=_fnStringToCss("100%");}}if(o.oScroll.sY===""){if(ie67){nScrollBody.style.height=_fnStringToCss(o.nTable.offsetHeight+o.oScroll.iBarWidth);}}if(o.oScroll.sY!==""&&o.oScroll.bCollapse){nScrollBody.style.height=_fnStringToCss(o.oScroll.sY);var iExtra=(o.oScroll.sX!==""&&o.nTable.offsetWidth>nScrollBody.offsetWidth)?o.oScroll.iBarWidth:0;if(o.nTable.offsetHeight<nScrollBody.offsetHeight){nScrollBody.style.height=_fnStringToCss(o.nTable.offsetHeight+iExtra);}}var iOuterWidth=$(o.nTable).outerWidth();nScrollHeadTable.style.width=_fnStringToCss(iOuterWidth);nScrollHeadInner.style.width=_fnStringToCss(iOuterWidth);var bScrolling=$(o.nTable).height()>nScrollBody.clientHeight||$(nScrollBody).css("overflow-y")=="scroll";nScrollHeadInner.style.paddingRight=bScrolling?o.oScroll.iBarWidth+"px":"0px";if(o.nTFoot!==null){nScrollFootTable.style.width=_fnStringToCss(iOuterWidth);nScrollFootInner.style.width=_fnStringToCss(iOuterWidth);nScrollFootInner.style.paddingRight=bScrolling?o.oScroll.iBarWidth+"px":"0px";}$(nScrollBody).scroll();if(o.bSorted||o.bFiltered){nScrollBody.scrollTop=0;}}function _fnApplyToChildren(fn,an1,an2){var index=0,i=0,iLen=an1.length;var nNode1,nNode2;while(i<iLen){nNode1=an1[i].firstChild;nNode2=an2?an2[i].firstChild:null;while(nNode1){if(nNode1.nodeType===1){if(an2){fn(nNode1,nNode2,index);}else{fn(nNode1,index);}index++;}nNode1=nNode1.nextSibling;nNode2=an2?nNode2.nextSibling:null;}i++;}}function _fnConvertToWidth(sWidth,nParent){if(!sWidth||sWidth===null||sWidth===""){return 0;}if(!nParent){nParent=document.body;}var iWidth;var nTmp=document.createElement("div");nTmp.style.width=_fnStringToCss(sWidth);nParent.appendChild(nTmp);iWidth=nTmp.offsetWidth;nParent.removeChild(nTmp);return(iWidth);}function _fnCalculateColumnWidths(oSettings){var iTableWidth=oSettings.nTable.offsetWidth;var iUserInputs=0;var iTmpWidth;var iVisibleColumns=0;var iColums=oSettings.aoColumns.length;var i,iIndex,iCorrector,iWidth;var oHeaders=$("th",oSettings.nTHead);var widthAttr=oSettings.nTable.getAttribute("width");var nWrapper=oSettings.nTable.parentNode;for(i=0;i<iColums;i++){if(oSettings.aoColumns[i].bVisible){iVisibleColumns++;if(oSettings.aoColumns[i].sWidth!==null){iTmpWidth=_fnConvertToWidth(oSettings.aoColumns[i].sWidthOrig,nWrapper);if(iTmpWidth!==null){oSettings.aoColumns[i].sWidth=_fnStringToCss(iTmpWidth);}iUserInputs++;}}}if(iColums==oHeaders.length&&iUserInputs===0&&iVisibleColumns==iColums&&oSettings.oScroll.sX===""&&oSettings.oScroll.sY===""){for(i=0;i<oSettings.aoColumns.length;i++){iTmpWidth=$(oHeaders[i]).width();if(iTmpWidth!==null){oSettings.aoColumns[i].sWidth=_fnStringToCss(iTmpWidth);}}}else{var nCalcTmp=oSettings.nTable.cloneNode(false),nTheadClone=oSettings.nTHead.cloneNode(true),nBody=document.createElement("tbody"),nTr=document.createElement("tr"),nDivSizing;nCalcTmp.removeAttribute("id");nCalcTmp.appendChild(nTheadClone);if(oSettings.nTFoot!==null){nCalcTmp.appendChild(oSettings.nTFoot.cloneNode(true));_fnApplyToChildren(function(n){n.style.width="";},nCalcTmp.getElementsByTagName("tr"));}nCalcTmp.appendChild(nBody);nBody.appendChild(nTr);var jqColSizing=$("thead th",nCalcTmp);if(jqColSizing.length===0){jqColSizing=$("tbody tr:eq(0)>td",nCalcTmp);}var nThs=_fnGetUniqueThs(oSettings,nTheadClone);iCorrector=0;for(i=0;i<iColums;i++){var oColumn=oSettings.aoColumns[i];if(oColumn.bVisible&&oColumn.sWidthOrig!==null&&oColumn.sWidthOrig!==""){nThs[i-iCorrector].style.width=_fnStringToCss(oColumn.sWidthOrig);}else{if(oColumn.bVisible){nThs[i-iCorrector].style.width="";}else{iCorrector++;}}}for(i=0;i<iColums;i++){if(oSettings.aoColumns[i].bVisible){var nTd=_fnGetWidestNode(oSettings,i);if(nTd!==null){nTd=nTd.cloneNode(true);if(oSettings.aoColumns[i].sContentPadding!==""){nTd.innerHTML+=oSettings.aoColumns[i].sContentPadding;}nTr.appendChild(nTd);}}}nWrapper.appendChild(nCalcTmp);if(oSettings.oScroll.sX!==""&&oSettings.oScroll.sXInner!==""){nCalcTmp.style.width=_fnStringToCss(oSettings.oScroll.sXInner);}else{if(oSettings.oScroll.sX!==""){nCalcTmp.style.width="";if($(nCalcTmp).width()<nWrapper.offsetWidth){nCalcTmp.style.width=_fnStringToCss(nWrapper.offsetWidth);}}else{if(oSettings.oScroll.sY!==""){nCalcTmp.style.width=_fnStringToCss(nWrapper.offsetWidth);}else{if(widthAttr){nCalcTmp.style.width=_fnStringToCss(widthAttr);}}}}nCalcTmp.style.visibility="hidden";_fnScrollingWidthAdjust(oSettings,nCalcTmp);var oNodes=$("tbody tr:eq(0)",nCalcTmp).children();if(oNodes.length===0){oNodes=_fnGetUniqueThs(oSettings,$("thead",nCalcTmp)[0]);}if(oSettings.oScroll.sX!==""){var iTotal=0;iCorrector=0;for(i=0;i<oSettings.aoColumns.length;i++){if(oSettings.aoColumns[i].bVisible){if(oSettings.aoColumns[i].sWidthOrig===null){iTotal+=$(oNodes[iCorrector]).outerWidth();}else{iTotal+=parseInt(oSettings.aoColumns[i].sWidth.replace("px",""),10)+($(oNodes[iCorrector]).outerWidth()-$(oNodes[iCorrector]).width());}iCorrector++;}}nCalcTmp.style.width=_fnStringToCss(iTotal);oSettings.nTable.style.width=_fnStringToCss(iTotal);}iCorrector=0;for(i=0;i<oSettings.aoColumns.length;i++){if(oSettings.aoColumns[i].bVisible){iWidth=$(oNodes[iCorrector]).width();if(iWidth!==null&&iWidth>0){oSettings.aoColumns[i].sWidth=_fnStringToCss(iWidth);}iCorrector++;}}var cssWidth=$(nCalcTmp).css("width");oSettings.nTable.style.width=(cssWidth.indexOf("%")!==-1)?cssWidth:_fnStringToCss($(nCalcTmp).outerWidth());nCalcTmp.parentNode.removeChild(nCalcTmp);}if(widthAttr){oSettings.nTable.style.width=_fnStringToCss(widthAttr);}}function _fnScrollingWidthAdjust(oSettings,n){if(oSettings.oScroll.sX===""&&oSettings.oScroll.sY!==""){var iOrigWidth=$(n).width();n.style.width=_fnStringToCss($(n).outerWidth()-oSettings.oScroll.iBarWidth);}else{if(oSettings.oScroll.sX!==""){n.style.width=_fnStringToCss($(n).outerWidth());}}}function _fnGetWidestNode(oSettings,iCol){var iMaxIndex=_fnGetMaxLenString(oSettings,iCol);if(iMaxIndex<0){return null;}if(oSettings.aoData[iMaxIndex].nTr===null){var n=document.createElement("td");n.innerHTML=_fnGetCellData(oSettings,iMaxIndex,iCol,"");return n;}return _fnGetTdNodes(oSettings,iMaxIndex)[iCol];}function _fnGetMaxLenString(oSettings,iCol){var iMax=-1;var iMaxIndex=-1;for(var i=0;i<oSettings.aoData.length;i++){var s=_fnGetCellData(oSettings,i,iCol,"display")+"";s=s.replace(/<.*?>/g,"");if(s.length>iMax){iMax=s.length;iMaxIndex=i;}}return iMaxIndex;}function _fnStringToCss(s){if(s===null){return"0px";}if(typeof s=="number"){if(s<0){return"0px";}return s+"px";}var c=s.charCodeAt(s.length-1);if(c<48||c>57){return s;}return s+"px";}function _fnScrollBarWidth(){var inner=document.createElement("p");var style=inner.style;style.width="100%";style.height="200px";style.padding="0px";var outer=document.createElement("div");style=outer.style;style.position="absolute";style.top="0px";style.left="0px";style.visibility="hidden";style.width="200px";style.height="150px";style.padding="0px";style.overflow="hidden";outer.appendChild(inner);document.body.appendChild(outer);var w1=inner.offsetWidth;outer.style.overflow="scroll";var w2=inner.offsetWidth;if(w1==w2){w2=outer.clientWidth;}document.body.removeChild(outer);return(w1-w2);}function _fnSort(oSettings,bApplyClasses){var i,iLen,j,jLen,k,kLen,sDataType,nTh,aaSort=[],aiOrig=[],oSort=DataTable.ext.oSort,aoData=oSettings.aoData,aoColumns=oSettings.aoColumns,oAria=oSettings.oLanguage.oAria;if(!oSettings.oFeatures.bServerSide&&(oSettings.aaSorting.length!==0||oSettings.aaSortingFixed!==null)){aaSort=(oSettings.aaSortingFixed!==null)?oSettings.aaSortingFixed.concat(oSettings.aaSorting):oSettings.aaSorting.slice();for(i=0;i<aaSort.length;i++){var iColumn=aaSort[i][0];var iVisColumn=_fnColumnIndexToVisible(oSettings,iColumn);sDataType=oSettings.aoColumns[iColumn].sSortDataType;if(DataTable.ext.afnSortData[sDataType]){var aData=DataTable.ext.afnSortData[sDataType].call(oSettings.oInstance,oSettings,iColumn,iVisColumn);if(aData.length===aoData.length){for(j=0,jLen=aoData.length;j<jLen;j++){_fnSetCellData(oSettings,j,iColumn,aData[j]);}}else{_fnLog(oSettings,0,"Returned data sort array (col "+iColumn+") is the wrong length");}}}for(i=0,iLen=oSettings.aiDisplayMaster.length;i<iLen;i++){aiOrig[oSettings.aiDisplayMaster[i]]=i;}var iSortLen=aaSort.length;var fnSortFormat,aDataSort;for(i=0,iLen=aoData.length;i<iLen;i++){for(j=0;j<iSortLen;j++){aDataSort=aoColumns[aaSort[j][0]].aDataSort;for(k=0,kLen=aDataSort.length;k<kLen;k++){sDataType=aoColumns[aDataSort[k]].sType;fnSortFormat=oSort[(sDataType?sDataType:"string")+"-pre"];aoData[i]._aSortData[aDataSort[k]]=fnSortFormat?fnSortFormat(_fnGetCellData(oSettings,i,aDataSort[k],"sort")):_fnGetCellData(oSettings,i,aDataSort[k],"sort");}}}oSettings.aiDisplayMaster.sort(function(a,b){var k,l,lLen,iTest,aDataSort,sDataType;for(k=0;k<iSortLen;k++){aDataSort=aoColumns[aaSort[k][0]].aDataSort;for(l=0,lLen=aDataSort.length;l<lLen;l++){sDataType=aoColumns[aDataSort[l]].sType;iTest=oSort[(sDataType?sDataType:"string")+"-"+aaSort[k][1]](aoData[a]._aSortData[aDataSort[l]],aoData[b]._aSortData[aDataSort[l]]);if(iTest!==0){return iTest;}}}return oSort["numeric-asc"](aiOrig[a],aiOrig[b]);});}if((bApplyClasses===undefined||bApplyClasses)&&!oSettings.oFeatures.bDeferRender){_fnSortingClasses(oSettings);}for(i=0,iLen=oSettings.aoColumns.length;i<iLen;i++){var sTitle=aoColumns[i].sTitle.replace(/<.*?>/g,"");nTh=aoColumns[i].nTh;nTh.removeAttribute("aria-sort");nTh.removeAttribute("aria-label");if(aoColumns[i].bSortable){if(aaSort.length>0&&aaSort[0][0]==i){nTh.setAttribute("aria-sort",aaSort[0][1]=="asc"?"ascending":"descending");var nextSort=(aoColumns[i].asSorting[aaSort[0][2]+1])?aoColumns[i].asSorting[aaSort[0][2]+1]:aoColumns[i].asSorting[0];nTh.setAttribute("aria-label",sTitle+(nextSort=="asc"?oAria.sSortAscending:oAria.sSortDescending));}else{nTh.setAttribute("aria-label",sTitle+(aoColumns[i].asSorting[0]=="asc"?oAria.sSortAscending:oAria.sSortDescending));}}else{nTh.setAttribute("aria-label",sTitle);}}oSettings.bSorted=true;$(oSettings.oInstance).trigger("sort",oSettings);if(oSettings.oFeatures.bFilter){_fnFilterComplete(oSettings,oSettings.oPreviousSearch,1);}else{oSettings.aiDisplay=oSettings.aiDisplayMaster.slice();oSettings._iDisplayStart=0;_fnCalculateEnd(oSettings);_fnDraw(oSettings);}}function _fnSortAttachListener(oSettings,nNode,iDataIndex,fnCallback){_fnBindAction(nNode,{},function(e){if(oSettings.aoColumns[iDataIndex].bSortable===false){return;}var fnInnerSorting=function(){var iColumn,iNextSort;if(e.shiftKey){var bFound=false;for(var i=0;i<oSettings.aaSorting.length;i++){if(oSettings.aaSorting[i][0]==iDataIndex){bFound=true;iColumn=oSettings.aaSorting[i][0];iNextSort=oSettings.aaSorting[i][2]+1;if(!oSettings.aoColumns[iColumn].asSorting[iNextSort]){oSettings.aaSorting.splice(i,1);}else{oSettings.aaSorting[i][1]=oSettings.aoColumns[iColumn].asSorting[iNextSort];oSettings.aaSorting[i][2]=iNextSort;}break;}}if(bFound===false){oSettings.aaSorting.push([iDataIndex,oSettings.aoColumns[iDataIndex].asSorting[0],0]);}}else{if(oSettings.aaSorting.length==1&&oSettings.aaSorting[0][0]==iDataIndex){iColumn=oSettings.aaSorting[0][0];iNextSort=oSettings.aaSorting[0][2]+1;if(!oSettings.aoColumns[iColumn].asSorting[iNextSort]){iNextSort=0;}oSettings.aaSorting[0][1]=oSettings.aoColumns[iColumn].asSorting[iNextSort];oSettings.aaSorting[0][2]=iNextSort;}else{oSettings.aaSorting.splice(0,oSettings.aaSorting.length);oSettings.aaSorting.push([iDataIndex,oSettings.aoColumns[iDataIndex].asSorting[0],0]);}}_fnSort(oSettings);};if(!oSettings.oFeatures.bProcessing){fnInnerSorting();}else{_fnProcessingDisplay(oSettings,true);setTimeout(function(){fnInnerSorting();if(!oSettings.oFeatures.bServerSide){_fnProcessingDisplay(oSettings,false);}},0);}if(typeof fnCallback=="function"){fnCallback(oSettings);}});}function _fnSortingClasses(oSettings){var i,iLen,j,jLen,iFound;var aaSort,sClass;var iColumns=oSettings.aoColumns.length;var oClasses=oSettings.oClasses;for(i=0;i<iColumns;i++){if(oSettings.aoColumns[i].bSortable){$(oSettings.aoColumns[i].nTh).removeClass(oClasses.sSortAsc+" "+oClasses.sSortDesc+" "+oSettings.aoColumns[i].sSortingClass);}}if(oSettings.aaSortingFixed!==null){aaSort=oSettings.aaSortingFixed.concat(oSettings.aaSorting);}else{aaSort=oSettings.aaSorting.slice();}for(i=0;i<oSettings.aoColumns.length;i++){if(oSettings.aoColumns[i].bSortable){sClass=oSettings.aoColumns[i].sSortingClass;iFound=-1;for(j=0;j<aaSort.length;j++){if(aaSort[j][0]==i){sClass=(aaSort[j][1]=="asc")?oClasses.sSortAsc:oClasses.sSortDesc;iFound=j;break;}}$(oSettings.aoColumns[i].nTh).addClass(sClass);if(oSettings.bJUI){var jqSpan=$("span."+oClasses.sSortIcon,oSettings.aoColumns[i].nTh);jqSpan.removeClass(oClasses.sSortJUIAsc+" "+oClasses.sSortJUIDesc+" "+oClasses.sSortJUI+" "+oClasses.sSortJUIAscAllowed+" "+oClasses.sSortJUIDescAllowed);var sSpanClass;if(iFound==-1){sSpanClass=oSettings.aoColumns[i].sSortingClassJUI;}else{if(aaSort[iFound][1]=="asc"){sSpanClass=oClasses.sSortJUIAsc;}else{sSpanClass=oClasses.sSortJUIDesc;}}jqSpan.addClass(sSpanClass);}}else{$(oSettings.aoColumns[i].nTh).addClass(oSettings.aoColumns[i].sSortingClass);}}sClass=oClasses.sSortColumn;if(oSettings.oFeatures.bSort&&oSettings.oFeatures.bSortClasses){var nTds=_fnGetTdNodes(oSettings);var iClass,iTargetCol;var asClasses=[];for(i=0;i<iColumns;i++){asClasses.push("");}for(i=0,iClass=1;i<aaSort.length;i++){iTargetCol=parseInt(aaSort[i][0],10);asClasses[iTargetCol]=sClass+iClass;if(iClass<3){iClass++;}}var reClass=new RegExp(sClass+"[123]");var sTmpClass,sCurrentClass,sNewClass;for(i=0,iLen=nTds.length;i<iLen;i++){iTargetCol=i%iColumns;sCurrentClass=nTds[i].className;sNewClass=asClasses[iTargetCol];sTmpClass=sCurrentClass.replace(reClass,sNewClass);if(sTmpClass!=sCurrentClass){nTds[i].className=$.trim(sTmpClass);}else{if(sNewClass.length>0&&sCurrentClass.indexOf(sNewClass)==-1){nTds[i].className=sCurrentClass+" "+sNewClass;}}}}}function _fnSaveState(oSettings){if(!oSettings.oFeatures.bStateSave||oSettings.bDestroying){return;}var i,iLen,bInfinite=oSettings.oScroll.bInfinite;var oState={iCreate:new Date().getTime(),iStart:(bInfinite?0:oSettings._iDisplayStart),iEnd:(bInfinite?oSettings._iDisplayLength:oSettings._iDisplayEnd),iLength:oSettings._iDisplayLength,aaSorting:$.extend(true,[],oSettings.aaSorting),oSearch:$.extend(true,{},oSettings.oPreviousSearch),aoSearchCols:$.extend(true,[],oSettings.aoPreSearchCols),abVisCols:[]};for(i=0,iLen=oSettings.aoColumns.length;i<iLen;i++){oState.abVisCols.push(oSettings.aoColumns[i].bVisible);}_fnCallbackFire(oSettings,"aoStateSaveParams","stateSaveParams",[oSettings,oState]);oSettings.fnStateSave.call(oSettings.oInstance,oSettings,oState);}function _fnLoadState(oSettings,oInit){if(!oSettings.oFeatures.bStateSave){return;}var oData=oSettings.fnStateLoad.call(oSettings.oInstance,oSettings);if(!oData){return;}var abStateLoad=_fnCallbackFire(oSettings,"aoStateLoadParams","stateLoadParams",[oSettings,oData]);if($.inArray(false,abStateLoad)!==-1){return;}oSettings.oLoadedState=$.extend(true,{},oData);oSettings._iDisplayStart=oData.iStart;oSettings.iInitDisplayStart=oData.iStart;oSettings._iDisplayEnd=oData.iEnd;oSettings._iDisplayLength=oData.iLength;oSettings.aaSorting=oData.aaSorting.slice();oSettings.saved_aaSorting=oData.aaSorting.slice();$.extend(oSettings.oPreviousSearch,oData.oSearch);$.extend(true,oSettings.aoPreSearchCols,oData.aoSearchCols);oInit.saved_aoColumns=[];for(var i=0;i<oData.abVisCols.length;i++){oInit.saved_aoColumns[i]={};oInit.saved_aoColumns[i].bVisible=oData.abVisCols[i];}_fnCallbackFire(oSettings,"aoStateLoaded","stateLoaded",[oSettings,oData]);}function _fnCreateCookie(sName,sValue,iSecs,sBaseName,fnCallback){var date=new Date();date.setTime(date.getTime()+(iSecs*1000));var aParts=window.location.pathname.split("/");var sNameFile=sName+"_"+aParts.pop().replace(/[\/:]/g,"").toLowerCase();var sFullCookie,oData;if(fnCallback!==null){oData=(typeof $.parseJSON==="function")?$.parseJSON(sValue):eval("("+sValue+")");sFullCookie=fnCallback(sNameFile,oData,date.toGMTString(),aParts.join("/")+"/");}else{sFullCookie=sNameFile+"="+encodeURIComponent(sValue)+"; expires="+date.toGMTString()+"; path="+aParts.join("/")+"/";}var aCookies=document.cookie.split(";"),iNewCookieLen=sFullCookie.split(";")[0].length,aOldCookies=[];if(iNewCookieLen+document.cookie.length+10>4096){for(var i=0,iLen=aCookies.length;i<iLen;i++){if(aCookies[i].indexOf(sBaseName)!=-1){var aSplitCookie=aCookies[i].split("=");try{oData=eval("("+decodeURIComponent(aSplitCookie[1])+")");if(oData&&oData.iCreate){aOldCookies.push({name:aSplitCookie[0],time:oData.iCreate});}}catch(e){}}}aOldCookies.sort(function(a,b){return b.time-a.time;});while(iNewCookieLen+document.cookie.length+10>4096){if(aOldCookies.length===0){return;}var old=aOldCookies.pop();document.cookie=old.name+"=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path="+aParts.join("/")+"/";}}document.cookie=sFullCookie;}function _fnReadCookie(sName){var aParts=window.location.pathname.split("/"),sNameEQ=sName+"_"+aParts[aParts.length-1].replace(/[\/:]/g,"").toLowerCase()+"=",sCookieContents=document.cookie.split(";");for(var i=0;i<sCookieContents.length;i++){var c=sCookieContents[i];while(c.charAt(0)==" "){c=c.substring(1,c.length);}if(c.indexOf(sNameEQ)===0){return decodeURIComponent(c.substring(sNameEQ.length,c.length));}}return null;}function _fnSettingsFromNode(nTable){for(var i=0;i<DataTable.settings.length;i++){if(DataTable.settings[i].nTable===nTable){return DataTable.settings[i];}}return null;}function _fnGetTrNodes(oSettings){var aNodes=[];var aoData=oSettings.aoData;for(var i=0,iLen=aoData.length;i<iLen;i++){if(aoData[i].nTr!==null){aNodes.push(aoData[i].nTr);}}return aNodes;}function _fnGetTdNodes(oSettings,iIndividualRow){var anReturn=[];var iCorrector;var anTds,nTd;var iRow,iRows=oSettings.aoData.length,iColumn,iColumns,oData,sNodeName,iStart=0,iEnd=iRows;if(iIndividualRow!==undefined){iStart=iIndividualRow;iEnd=iIndividualRow+1;}for(iRow=iStart;iRow<iEnd;iRow++){oData=oSettings.aoData[iRow];if(oData.nTr!==null){anTds=[];nTd=oData.nTr.firstChild;while(nTd){sNodeName=nTd.nodeName.toLowerCase();if(sNodeName=="td"||sNodeName=="th"){anTds.push(nTd);}nTd=nTd.nextSibling;}iCorrector=0;for(iColumn=0,iColumns=oSettings.aoColumns.length;iColumn<iColumns;iColumn++){if(oSettings.aoColumns[iColumn].bVisible){anReturn.push(anTds[iColumn-iCorrector]);}else{anReturn.push(oData._anHidden[iColumn]);iCorrector++;}}}}return anReturn;}function _fnLog(oSettings,iLevel,sMesg){var sAlert=(oSettings===null)?"DataTables warning: "+sMesg:"DataTables warning (table id = '"+oSettings.sTableId+"'): "+sMesg;if(iLevel===0){if(DataTable.ext.sErrMode=="alert"){alert(sAlert);}else{throw new Error(sAlert);}return;}else{if(window.console&&console.log){console.log(sAlert);}}}function _fnMap(oRet,oSrc,sName,sMappedName){if(sMappedName===undefined){sMappedName=sName;}if(oSrc[sName]!==undefined){oRet[sMappedName]=oSrc[sName];}}function _fnExtend(oOut,oExtender){var val;for(var prop in oExtender){if(oExtender.hasOwnProperty(prop)){val=oExtender[prop];if(typeof oInit[prop]==="object"&&val!==null&&$.isArray(val)===false){$.extend(true,oOut[prop],val);}else{oOut[prop]=val;}}}return oOut;}function _fnBindAction(n,oData,fn){$(n).bind("click.DT",oData,function(e){n.blur();fn(e);}).bind("keypress.DT",oData,function(e){if(e.which===13){fn(e);}}).bind("selectstart.DT",function(){return false;});}function _fnCallbackReg(oSettings,sStore,fn,sName){if(fn){oSettings[sStore].push({fn:fn,sName:sName});}}function _fnCallbackFire(oSettings,sStore,sTrigger,aArgs){var aoStore=oSettings[sStore];var aRet=[];for(var i=aoStore.length-1;i>=0;i--){aRet.push(aoStore[i].fn.apply(oSettings.oInstance,aArgs));}if(sTrigger!==null){$(oSettings.oInstance).trigger(sTrigger,aArgs);}return aRet;}var _fnJsonString=(window.JSON)?JSON.stringify:function(o){var sType=typeof o;if(sType!=="object"||o===null){if(sType==="string"){o='"'+o+'"';}return o+"";}var sProp,mValue,json=[],bArr=$.isArray(o);for(sProp in o){mValue=o[sProp];sType=typeof mValue;if(sType==="string"){mValue='"'+mValue+'"';}else{if(sType==="object"&&mValue!==null){mValue=_fnJsonString(mValue);}}json.push((bArr?"":'"'+sProp+'":')+mValue);}return(bArr?"[":"{")+json+(bArr?"]":"}");};function _fnBrowserDetect(oSettings){var n=$('<div style="position:absolute; top:0; left:0; height:1px; width:1px; overflow:hidden"><div style="position:absolute; top:1px; left:1px; width:100px; overflow:scroll;"><div id="DT_BrowserTest" style="width:100%; height:10px;"></div></div></div>')[0];document.body.appendChild(n);oSettings.oBrowser.bScrollOversize=$("#DT_BrowserTest",n)[0].offsetWidth===100?true:false;document.body.removeChild(n);}this.$=function(sSelector,oOpts){var i,iLen,a=[],tr;var oSettings=_fnSettingsFromNode(this[DataTable.ext.iApiIndex]);var aoData=oSettings.aoData;var aiDisplay=oSettings.aiDisplay;var aiDisplayMaster=oSettings.aiDisplayMaster;if(!oOpts){oOpts={};}oOpts=$.extend({},{filter:"none",order:"current",page:"all"},oOpts);if(oOpts.page=="current"){for(i=oSettings._iDisplayStart,iLen=oSettings.fnDisplayEnd();i<iLen;i++){tr=aoData[aiDisplay[i]].nTr;if(tr){a.push(tr);}}}else{if(oOpts.order=="current"&&oOpts.filter=="none"){for(i=0,iLen=aiDisplayMaster.length;i<iLen;i++){tr=aoData[aiDisplayMaster[i]].nTr;if(tr){a.push(tr);}}}else{if(oOpts.order=="current"&&oOpts.filter=="applied"){for(i=0,iLen=aiDisplay.length;i<iLen;i++){tr=aoData[aiDisplay[i]].nTr;if(tr){a.push(tr);}}}else{if(oOpts.order=="original"&&oOpts.filter=="none"){for(i=0,iLen=aoData.length;i<iLen;i++){tr=aoData[i].nTr;if(tr){a.push(tr);}}}else{if(oOpts.order=="original"&&oOpts.filter=="applied"){for(i=0,iLen=aoData.length;i<iLen;i++){tr=aoData[i].nTr;if($.inArray(i,aiDisplay)!==-1&&tr){a.push(tr);}}}else{_fnLog(oSettings,1,"Unknown selection options");}}}}}var jqA=$(a);var jqTRs=jqA.filter(sSelector);var jqDescendants=jqA.find(sSelector);return $([].concat($.makeArray(jqTRs),$.makeArray(jqDescendants)));};this._=function(sSelector,oOpts){var aOut=[];var i,iLen,iIndex;var aTrs=this.$(sSelector,oOpts);for(i=0,iLen=aTrs.length;i<iLen;i++){aOut.push(this.fnGetData(aTrs[i]));}return aOut;};this.fnAddData=function(mData,bRedraw){if(mData.length===0){return[];}var aiReturn=[];var iTest;var oSettings=_fnSettingsFromNode(this[DataTable.ext.iApiIndex]);if(typeof mData[0]==="object"&&mData[0]!==null){for(var i=0;i<mData.length;i++){iTest=_fnAddData(oSettings,mData[i]);if(iTest==-1){return aiReturn;}aiReturn.push(iTest);}}else{iTest=_fnAddData(oSettings,mData);if(iTest==-1){return aiReturn;}aiReturn.push(iTest);}oSettings.aiDisplay=oSettings.aiDisplayMaster.slice();if(bRedraw===undefined||bRedraw){_fnReDraw(oSettings);}return aiReturn;};this.fnAdjustColumnSizing=function(bRedraw){var oSettings=_fnSettingsFromNode(this[DataTable.ext.iApiIndex]);_fnAdjustColumnSizing(oSettings);if(bRedraw===undefined||bRedraw){this.fnDraw(false);}else{if(oSettings.oScroll.sX!==""||oSettings.oScroll.sY!==""){this.oApi._fnScrollDraw(oSettings);}}};this.fnClearTable=function(bRedraw){var oSettings=_fnSettingsFromNode(this[DataTable.ext.iApiIndex]);_fnClearTable(oSettings);if(bRedraw===undefined||bRedraw){_fnDraw(oSettings);}};this.fnClose=function(nTr){var oSettings=_fnSettingsFromNode(this[DataTable.ext.iApiIndex]);for(var i=0;i<oSettings.aoOpenRows.length;i++){if(oSettings.aoOpenRows[i].nParent==nTr){var nTrParent=oSettings.aoOpenRows[i].nTr.parentNode;if(nTrParent){nTrParent.removeChild(oSettings.aoOpenRows[i].nTr);}oSettings.aoOpenRows.splice(i,1);return 0;}}return 1;};this.fnDeleteRow=function(mTarget,fnCallBack,bRedraw){var oSettings=_fnSettingsFromNode(this[DataTable.ext.iApiIndex]);var i,iLen,iAODataIndex;iAODataIndex=(typeof mTarget==="object")?_fnNodeToDataIndex(oSettings,mTarget):mTarget;var oData=oSettings.aoData.splice(iAODataIndex,1);for(i=0,iLen=oSettings.aoData.length;i<iLen;i++){if(oSettings.aoData[i].nTr!==null){oSettings.aoData[i].nTr._DT_RowIndex=i;}}var iDisplayIndex=$.inArray(iAODataIndex,oSettings.aiDisplay);oSettings.asDataSearch.splice(iDisplayIndex,1);_fnDeleteIndex(oSettings.aiDisplayMaster,iAODataIndex);_fnDeleteIndex(oSettings.aiDisplay,iAODataIndex);if(typeof fnCallBack==="function"){fnCallBack.call(this,oSettings,oData);}if(oSettings._iDisplayStart>=oSettings.fnRecordsDisplay()){oSettings._iDisplayStart-=oSettings._iDisplayLength;if(oSettings._iDisplayStart<0){oSettings._iDisplayStart=0;}}if(bRedraw===undefined||bRedraw){_fnCalculateEnd(oSettings);_fnDraw(oSettings);}return oData;};this.fnDestroy=function(bRemove){var oSettings=_fnSettingsFromNode(this[DataTable.ext.iApiIndex]);var nOrig=oSettings.nTableWrapper.parentNode;var nBody=oSettings.nTBody;var i,iLen;bRemove=(bRemove===undefined)?false:bRemove;oSettings.bDestroying=true;_fnCallbackFire(oSettings,"aoDestroyCallback","destroy",[oSettings]);if(!bRemove){for(i=0,iLen=oSettings.aoColumns.length;i<iLen;i++){if(oSettings.aoColumns[i].bVisible===false){this.fnSetColumnVis(i,true);}}}$(oSettings.nTableWrapper).find("*").andSelf().unbind(".DT");$("tbody>tr>td."+oSettings.oClasses.sRowEmpty,oSettings.nTable).parent().remove();if(oSettings.nTable!=oSettings.nTHead.parentNode){$(oSettings.nTable).children("thead").remove();oSettings.nTable.appendChild(oSettings.nTHead);}if(oSettings.nTFoot&&oSettings.nTable!=oSettings.nTFoot.parentNode){$(oSettings.nTable).children("tfoot").remove();oSettings.nTable.appendChild(oSettings.nTFoot);}oSettings.nTable.parentNode.removeChild(oSettings.nTable);$(oSettings.nTableWrapper).remove();oSettings.aaSorting=[];oSettings.aaSortingFixed=[];_fnSortingClasses(oSettings);$(_fnGetTrNodes(oSettings)).removeClass(oSettings.asStripeClasses.join(" "));$("th, td",oSettings.nTHead).removeClass([oSettings.oClasses.sSortable,oSettings.oClasses.sSortableAsc,oSettings.oClasses.sSortableDesc,oSettings.oClasses.sSortableNone].join(" "));if(oSettings.bJUI){$("th span."+oSettings.oClasses.sSortIcon+", td span."+oSettings.oClasses.sSortIcon,oSettings.nTHead).remove();$("th, td",oSettings.nTHead).each(function(){var jqWrapper=$("div."+oSettings.oClasses.sSortJUIWrapper,this);var kids=jqWrapper.contents();$(this).append(kids);jqWrapper.remove();});}if(!bRemove&&oSettings.nTableReinsertBefore){nOrig.insertBefore(oSettings.nTable,oSettings.nTableReinsertBefore);}else{if(!bRemove){nOrig.appendChild(oSettings.nTable);}}for(i=0,iLen=oSettings.aoData.length;i<iLen;i++){if(oSettings.aoData[i].nTr!==null){nBody.appendChild(oSettings.aoData[i].nTr);}}if(oSettings.oFeatures.bAutoWidth===true){oSettings.nTable.style.width=_fnStringToCss(oSettings.sDestroyWidth);}iLen=oSettings.asDestroyStripes.length;if(iLen){var anRows=$(nBody).children("tr");for(i=0;i<iLen;i++){anRows.filter(":nth-child("+iLen+"n + "+i+")").addClass(oSettings.asDestroyStripes[i]);}}for(i=0,iLen=DataTable.settings.length;i<iLen;i++){if(DataTable.settings[i]==oSettings){DataTable.settings.splice(i,1);}}oSettings=null;oInit=null;};this.fnDraw=function(bComplete){var oSettings=_fnSettingsFromNode(this[DataTable.ext.iApiIndex]);if(bComplete===false){_fnCalculateEnd(oSettings);_fnDraw(oSettings);}else{_fnReDraw(oSettings);}};this.fnFilter=function(sInput,iColumn,bRegex,bSmart,bShowGlobal,bCaseInsensitive){var oSettings=_fnSettingsFromNode(this[DataTable.ext.iApiIndex]);if(!oSettings.oFeatures.bFilter){return;}if(bRegex===undefined||bRegex===null){bRegex=false;}if(bSmart===undefined||bSmart===null){bSmart=true;}if(bShowGlobal===undefined||bShowGlobal===null){bShowGlobal=true;}if(bCaseInsensitive===undefined||bCaseInsensitive===null){bCaseInsensitive=true;}if(iColumn===undefined||iColumn===null){_fnFilterComplete(oSettings,{sSearch:sInput+"",bRegex:bRegex,bSmart:bSmart,bCaseInsensitive:bCaseInsensitive},1);if(bShowGlobal&&oSettings.aanFeatures.f){var n=oSettings.aanFeatures.f;for(var i=0,iLen=n.length;i<iLen;i++){try{if(n[i]._DT_Input!=document.activeElement){$(n[i]._DT_Input).val(sInput);}}catch(e){$(n[i]._DT_Input).val(sInput);}}}}else{$.extend(oSettings.aoPreSearchCols[iColumn],{sSearch:sInput+"",bRegex:bRegex,bSmart:bSmart,bCaseInsensitive:bCaseInsensitive});_fnFilterComplete(oSettings,oSettings.oPreviousSearch,1);}};this.fnGetData=function(mRow,iCol){var oSettings=_fnSettingsFromNode(this[DataTable.ext.iApiIndex]);if(mRow!==undefined){var iRow=mRow;if(typeof mRow==="object"){var sNode=mRow.nodeName.toLowerCase();if(sNode==="tr"){iRow=_fnNodeToDataIndex(oSettings,mRow);}else{if(sNode==="td"){iRow=_fnNodeToDataIndex(oSettings,mRow.parentNode);iCol=_fnNodeToColumnIndex(oSettings,iRow,mRow);}}}if(iCol!==undefined){return _fnGetCellData(oSettings,iRow,iCol,"");}return(oSettings.aoData[iRow]!==undefined)?oSettings.aoData[iRow]._aData:null;}return _fnGetDataMaster(oSettings);};this.fnGetNodes=function(iRow){var oSettings=_fnSettingsFromNode(this[DataTable.ext.iApiIndex]);if(iRow!==undefined){return(oSettings.aoData[iRow]!==undefined)?oSettings.aoData[iRow].nTr:null;}return _fnGetTrNodes(oSettings);};this.fnGetPosition=function(nNode){var oSettings=_fnSettingsFromNode(this[DataTable.ext.iApiIndex]);var sNodeName=nNode.nodeName.toUpperCase();if(sNodeName=="TR"){return _fnNodeToDataIndex(oSettings,nNode);}else{if(sNodeName=="TD"||sNodeName=="TH"){var iDataIndex=_fnNodeToDataIndex(oSettings,nNode.parentNode);var iColumnIndex=_fnNodeToColumnIndex(oSettings,iDataIndex,nNode);return[iDataIndex,_fnColumnIndexToVisible(oSettings,iColumnIndex),iColumnIndex];}}return null;};this.fnIsOpen=function(nTr){var oSettings=_fnSettingsFromNode(this[DataTable.ext.iApiIndex]);var aoOpenRows=oSettings.aoOpenRows;for(var i=0;i<oSettings.aoOpenRows.length;i++){if(oSettings.aoOpenRows[i].nParent==nTr){return true;}}return false;};this.fnOpen=function(nTr,mHtml,sClass){var oSettings=_fnSettingsFromNode(this[DataTable.ext.iApiIndex]);var nTableRows=_fnGetTrNodes(oSettings);if($.inArray(nTr,nTableRows)===-1){return;}this.fnClose(nTr);var nNewRow=document.createElement("tr");var nNewCell=document.createElement("td");nNewRow.appendChild(nNewCell);nNewCell.className=sClass;nNewCell.colSpan=_fnVisbleColumns(oSettings);if(typeof mHtml==="string"){nNewCell.innerHTML=mHtml;}else{$(nNewCell).html(mHtml);}var nTrs=$("tr",oSettings.nTBody);if($.inArray(nTr,nTrs)!=-1){$(nNewRow).insertAfter(nTr);}oSettings.aoOpenRows.push({nTr:nNewRow,nParent:nTr});return nNewRow;};this.fnPageChange=function(mAction,bRedraw){var oSettings=_fnSettingsFromNode(this[DataTable.ext.iApiIndex]);_fnPageChange(oSettings,mAction);_fnCalculateEnd(oSettings);if(bRedraw===undefined||bRedraw){_fnDraw(oSettings);}};this.fnSetColumnVis=function(iCol,bShow,bRedraw){var oSettings=_fnSettingsFromNode(this[DataTable.ext.iApiIndex]);var i,iLen;var aoColumns=oSettings.aoColumns;var aoData=oSettings.aoData;var nTd,bAppend,iBefore;if(aoColumns[iCol].bVisible==bShow){return;}if(bShow){var iInsert=0;for(i=0;i<iCol;i++){if(aoColumns[i].bVisible){iInsert++;}}bAppend=(iInsert>=_fnVisbleColumns(oSettings));if(!bAppend){for(i=iCol;i<aoColumns.length;i++){if(aoColumns[i].bVisible){iBefore=i;break;}}}for(i=0,iLen=aoData.length;i<iLen;i++){if(aoData[i].nTr!==null){if(bAppend){aoData[i].nTr.appendChild(aoData[i]._anHidden[iCol]);}else{aoData[i].nTr.insertBefore(aoData[i]._anHidden[iCol],_fnGetTdNodes(oSettings,i)[iBefore]);}}}}else{for(i=0,iLen=aoData.length;i<iLen;i++){if(aoData[i].nTr!==null){nTd=_fnGetTdNodes(oSettings,i)[iCol];aoData[i]._anHidden[iCol]=nTd;nTd.parentNode.removeChild(nTd);}}}aoColumns[iCol].bVisible=bShow;_fnDrawHead(oSettings,oSettings.aoHeader);if(oSettings.nTFoot){_fnDrawHead(oSettings,oSettings.aoFooter);}for(i=0,iLen=oSettings.aoOpenRows.length;i<iLen;i++){oSettings.aoOpenRows[i].nTr.colSpan=_fnVisbleColumns(oSettings);}if(bRedraw===undefined||bRedraw){_fnAdjustColumnSizing(oSettings);_fnDraw(oSettings);}_fnSaveState(oSettings);};this.fnSettings=function(){return _fnSettingsFromNode(this[DataTable.ext.iApiIndex]);};this.fnSort=function(aaSort){var oSettings=_fnSettingsFromNode(this[DataTable.ext.iApiIndex]);oSettings.aaSorting=aaSort;_fnSort(oSettings);};this.fnSortListener=function(nNode,iColumn,fnCallback){_fnSortAttachListener(_fnSettingsFromNode(this[DataTable.ext.iApiIndex]),nNode,iColumn,fnCallback);};this.fnUpdate=function(mData,mRow,iColumn,bRedraw,bAction){var oSettings=_fnSettingsFromNode(this[DataTable.ext.iApiIndex]);var i,iLen,sDisplay;var iRow=(typeof mRow==="object")?_fnNodeToDataIndex(oSettings,mRow):mRow;if($.isArray(mData)&&iColumn===undefined){oSettings.aoData[iRow]._aData=mData.slice();for(i=0;i<oSettings.aoColumns.length;i++){this.fnUpdate(_fnGetCellData(oSettings,iRow,i),iRow,i,false,false);}}else{if($.isPlainObject(mData)&&iColumn===undefined){oSettings.aoData[iRow]._aData=$.extend(true,{},mData);for(i=0;i<oSettings.aoColumns.length;i++){this.fnUpdate(_fnGetCellData(oSettings,iRow,i),iRow,i,false,false);}}else{_fnSetCellData(oSettings,iRow,iColumn,mData);sDisplay=_fnGetCellData(oSettings,iRow,iColumn,"display");var oCol=oSettings.aoColumns[iColumn];if(oCol.fnRender!==null){sDisplay=_fnRender(oSettings,iRow,iColumn);if(oCol.bUseRendered){_fnSetCellData(oSettings,iRow,iColumn,sDisplay);}}if(oSettings.aoData[iRow].nTr!==null){_fnGetTdNodes(oSettings,iRow)[iColumn].innerHTML=sDisplay;}}}var iDisplayIndex=$.inArray(iRow,oSettings.aiDisplay);oSettings.asDataSearch[iDisplayIndex]=_fnBuildSearchRow(oSettings,_fnGetRowData(oSettings,iRow,"filter",_fnGetColumns(oSettings,"bSearchable")));if(bAction===undefined||bAction){_fnAdjustColumnSizing(oSettings);}if(bRedraw===undefined||bRedraw){_fnReDraw(oSettings);}return 0;};this.fnVersionCheck=DataTable.ext.fnVersionCheck;function _fnExternApiFunc(sFunc){return function(){var aArgs=[_fnSettingsFromNode(this[DataTable.ext.iApiIndex])].concat(Array.prototype.slice.call(arguments));return DataTable.ext.oApi[sFunc].apply(this,aArgs);};}this.oApi={_fnExternApiFunc:_fnExternApiFunc,_fnInitialise:_fnInitialise,_fnInitComplete:_fnInitComplete,_fnLanguageCompat:_fnLanguageCompat,_fnAddColumn:_fnAddColumn,_fnColumnOptions:_fnColumnOptions,_fnAddData:_fnAddData,_fnCreateTr:_fnCreateTr,_fnGatherData:_fnGatherData,_fnBuildHead:_fnBuildHead,_fnDrawHead:_fnDrawHead,_fnDraw:_fnDraw,_fnReDraw:_fnReDraw,_fnAjaxUpdate:_fnAjaxUpdate,_fnAjaxParameters:_fnAjaxParameters,_fnAjaxUpdateDraw:_fnAjaxUpdateDraw,_fnServerParams:_fnServerParams,_fnAddOptionsHtml:_fnAddOptionsHtml,_fnFeatureHtmlTable:_fnFeatureHtmlTable,_fnScrollDraw:_fnScrollDraw,_fnAdjustColumnSizing:_fnAdjustColumnSizing,_fnFeatureHtmlFilter:_fnFeatureHtmlFilter,_fnFilterComplete:_fnFilterComplete,_fnFilterCustom:_fnFilterCustom,_fnFilterColumn:_fnFilterColumn,_fnFilter:_fnFilter,_fnBuildSearchArray:_fnBuildSearchArray,_fnBuildSearchRow:_fnBuildSearchRow,_fnFilterCreateSearch:_fnFilterCreateSearch,_fnDataToSearch:_fnDataToSearch,_fnSort:_fnSort,_fnSortAttachListener:_fnSortAttachListener,_fnSortingClasses:_fnSortingClasses,_fnFeatureHtmlPaginate:_fnFeatureHtmlPaginate,_fnPageChange:_fnPageChange,_fnFeatureHtmlInfo:_fnFeatureHtmlInfo,_fnUpdateInfo:_fnUpdateInfo,_fnFeatureHtmlLength:_fnFeatureHtmlLength,_fnFeatureHtmlProcessing:_fnFeatureHtmlProcessing,_fnProcessingDisplay:_fnProcessingDisplay,_fnVisibleToColumnIndex:_fnVisibleToColumnIndex,_fnColumnIndexToVisible:_fnColumnIndexToVisible,_fnNodeToDataIndex:_fnNodeToDataIndex,_fnVisbleColumns:_fnVisbleColumns,_fnCalculateEnd:_fnCalculateEnd,_fnConvertToWidth:_fnConvertToWidth,_fnCalculateColumnWidths:_fnCalculateColumnWidths,_fnScrollingWidthAdjust:_fnScrollingWidthAdjust,_fnGetWidestNode:_fnGetWidestNode,_fnGetMaxLenString:_fnGetMaxLenString,_fnStringToCss:_fnStringToCss,_fnDetectType:_fnDetectType,_fnSettingsFromNode:_fnSettingsFromNode,_fnGetDataMaster:_fnGetDataMaster,_fnGetTrNodes:_fnGetTrNodes,_fnGetTdNodes:_fnGetTdNodes,_fnEscapeRegex:_fnEscapeRegex,_fnDeleteIndex:_fnDeleteIndex,_fnReOrderIndex:_fnReOrderIndex,_fnColumnOrdering:_fnColumnOrdering,_fnLog:_fnLog,_fnClearTable:_fnClearTable,_fnSaveState:_fnSaveState,_fnLoadState:_fnLoadState,_fnCreateCookie:_fnCreateCookie,_fnReadCookie:_fnReadCookie,_fnDetectHeader:_fnDetectHeader,_fnGetUniqueThs:_fnGetUniqueThs,_fnScrollBarWidth:_fnScrollBarWidth,_fnApplyToChildren:_fnApplyToChildren,_fnMap:_fnMap,_fnGetRowData:_fnGetRowData,_fnGetCellData:_fnGetCellData,_fnSetCellData:_fnSetCellData,_fnGetObjectDataFn:_fnGetObjectDataFn,_fnSetObjectDataFn:_fnSetObjectDataFn,_fnApplyColumnDefs:_fnApplyColumnDefs,_fnBindAction:_fnBindAction,_fnExtend:_fnExtend,_fnCallbackReg:_fnCallbackReg,_fnCallbackFire:_fnCallbackFire,_fnJsonString:_fnJsonString,_fnRender:_fnRender,_fnNodeToColumnIndex:_fnNodeToColumnIndex,_fnInfoMacros:_fnInfoMacros,_fnBrowserDetect:_fnBrowserDetect,_fnGetColumns:_fnGetColumns};$.extend(DataTable.ext.oApi,this.oApi);for(var sFunc in DataTable.ext.oApi){if(sFunc){this[sFunc]=_fnExternApiFunc(sFunc);}}var _that=this;this.each(function(){var i=0,iLen,j,jLen,k,kLen;var sId=this.getAttribute("id");var bInitHandedOff=false;var bUsePassedData=false;if(this.nodeName.toLowerCase()!="table"){_fnLog(null,0,"Attempted to initialise DataTables on a node which is not a table: "+this.nodeName);return;}for(i=0,iLen=DataTable.settings.length;i<iLen;i++){if(DataTable.settings[i].nTable==this){if(oInit===undefined||oInit.bRetrieve){return DataTable.settings[i].oInstance;}else{if(oInit.bDestroy){DataTable.settings[i].oInstance.fnDestroy();break;}else{_fnLog(DataTable.settings[i],0,"Cannot reinitialise DataTable.\n\nTo retrieve the DataTables object for this table, pass no arguments or see the docs for bRetrieve and bDestroy");return;}}}if(DataTable.settings[i].sTableId==this.id){DataTable.settings.splice(i,1);break;}}if(sId===null||sId===""){sId="DataTables_Table_"+(DataTable.ext._oExternConfig.iNextUnique++);this.id=sId;}var oSettings=$.extend(true,{},DataTable.models.oSettings,{nTable:this,oApi:_that.oApi,oInit:oInit,sDestroyWidth:$(this).width(),sInstance:sId,sTableId:sId});DataTable.settings.push(oSettings);oSettings.oInstance=(_that.length===1)?_that:$(this).dataTable();if(!oInit){oInit={};}if(oInit.oLanguage){_fnLanguageCompat(oInit.oLanguage);}oInit=_fnExtend($.extend(true,{},DataTable.defaults),oInit);_fnMap(oSettings.oFeatures,oInit,"bPaginate");_fnMap(oSettings.oFeatures,oInit,"bLengthChange");_fnMap(oSettings.oFeatures,oInit,"bFilter");_fnMap(oSettings.oFeatures,oInit,"bSort");_fnMap(oSettings.oFeatures,oInit,"bInfo");_fnMap(oSettings.oFeatures,oInit,"bProcessing");_fnMap(oSettings.oFeatures,oInit,"bAutoWidth");_fnMap(oSettings.oFeatures,oInit,"bSortClasses");_fnMap(oSettings.oFeatures,oInit,"bServerSide");_fnMap(oSettings.oFeatures,oInit,"bDeferRender");_fnMap(oSettings.oScroll,oInit,"sScrollX","sX");_fnMap(oSettings.oScroll,oInit,"sScrollXInner","sXInner");_fnMap(oSettings.oScroll,oInit,"sScrollY","sY");_fnMap(oSettings.oScroll,oInit,"bScrollCollapse","bCollapse");_fnMap(oSettings.oScroll,oInit,"bScrollInfinite","bInfinite");_fnMap(oSettings.oScroll,oInit,"iScrollLoadGap","iLoadGap");_fnMap(oSettings.oScroll,oInit,"bScrollAutoCss","bAutoCss");_fnMap(oSettings,oInit,"asStripeClasses");_fnMap(oSettings,oInit,"asStripClasses","asStripeClasses");_fnMap(oSettings,oInit,"fnServerData");_fnMap(oSettings,oInit,"fnFormatNumber");_fnMap(oSettings,oInit,"sServerMethod");_fnMap(oSettings,oInit,"aaSorting");_fnMap(oSettings,oInit,"aaSortingFixed");_fnMap(oSettings,oInit,"aLengthMenu");_fnMap(oSettings,oInit,"sPaginationType");_fnMap(oSettings,oInit,"sAjaxSource");_fnMap(oSettings,oInit,"sAjaxDataProp");_fnMap(oSettings,oInit,"iCookieDuration");_fnMap(oSettings,oInit,"sCookiePrefix");_fnMap(oSettings,oInit,"sDom");_fnMap(oSettings,oInit,"bSortCellsTop");_fnMap(oSettings,oInit,"iTabIndex");_fnMap(oSettings,oInit,"oSearch","oPreviousSearch");_fnMap(oSettings,oInit,"aoSearchCols","aoPreSearchCols");_fnMap(oSettings,oInit,"iDisplayLength","_iDisplayLength");_fnMap(oSettings,oInit,"bJQueryUI","bJUI");_fnMap(oSettings,oInit,"fnCookieCallback");_fnMap(oSettings,oInit,"fnStateLoad");_fnMap(oSettings,oInit,"fnStateSave");_fnMap(oSettings.oLanguage,oInit,"fnInfoCallback");_fnCallbackReg(oSettings,"aoDrawCallback",oInit.fnDrawCallback,"user");_fnCallbackReg(oSettings,"aoServerParams",oInit.fnServerParams,"user");_fnCallbackReg(oSettings,"aoStateSaveParams",oInit.fnStateSaveParams,"user");_fnCallbackReg(oSettings,"aoStateLoadParams",oInit.fnStateLoadParams,"user");_fnCallbackReg(oSettings,"aoStateLoaded",oInit.fnStateLoaded,"user");_fnCallbackReg(oSettings,"aoRowCallback",oInit.fnRowCallback,"user");_fnCallbackReg(oSettings,"aoRowCreatedCallback",oInit.fnCreatedRow,"user");_fnCallbackReg(oSettings,"aoHeaderCallback",oInit.fnHeaderCallback,"user");_fnCallbackReg(oSettings,"aoFooterCallback",oInit.fnFooterCallback,"user");_fnCallbackReg(oSettings,"aoInitComplete",oInit.fnInitComplete,"user");_fnCallbackReg(oSettings,"aoPreDrawCallback",oInit.fnPreDrawCallback,"user");if(oSettings.oFeatures.bServerSide&&oSettings.oFeatures.bSort&&oSettings.oFeatures.bSortClasses){_fnCallbackReg(oSettings,"aoDrawCallback",_fnSortingClasses,"server_side_sort_classes");}else{if(oSettings.oFeatures.bDeferRender){_fnCallbackReg(oSettings,"aoDrawCallback",_fnSortingClasses,"defer_sort_classes");}}if(oInit.bJQueryUI){$.extend(oSettings.oClasses,DataTable.ext.oJUIClasses);if(oInit.sDom===DataTable.defaults.sDom&&DataTable.defaults.sDom==="lfrtip"){oSettings.sDom='<"H"lfr>t<"F"ip>';}}else{$.extend(oSettings.oClasses,DataTable.ext.oStdClasses);}$(this).addClass(oSettings.oClasses.sTable);if(oSettings.oScroll.sX!==""||oSettings.oScroll.sY!==""){oSettings.oScroll.iBarWidth=_fnScrollBarWidth();}if(oSettings.iInitDisplayStart===undefined){oSettings.iInitDisplayStart=oInit.iDisplayStart;oSettings._iDisplayStart=oInit.iDisplayStart;}if(oInit.bStateSave){oSettings.oFeatures.bStateSave=true;_fnLoadState(oSettings,oInit);_fnCallbackReg(oSettings,"aoDrawCallback",_fnSaveState,"state_save");}if(oInit.iDeferLoading!==null){oSettings.bDeferLoading=true;var tmp=$.isArray(oInit.iDeferLoading);oSettings._iRecordsDisplay=tmp?oInit.iDeferLoading[0]:oInit.iDeferLoading;oSettings._iRecordsTotal=tmp?oInit.iDeferLoading[1]:oInit.iDeferLoading;}if(oInit.aaData!==null){bUsePassedData=true;}if(oInit.oLanguage.sUrl!==""){oSettings.oLanguage.sUrl=oInit.oLanguage.sUrl;$.getJSON(oSettings.oLanguage.sUrl,null,function(json){_fnLanguageCompat(json);$.extend(true,oSettings.oLanguage,oInit.oLanguage,json);_fnInitialise(oSettings);});bInitHandedOff=true;}else{$.extend(true,oSettings.oLanguage,oInit.oLanguage);}if(oInit.asStripeClasses===null){oSettings.asStripeClasses=[oSettings.oClasses.sStripeOdd,oSettings.oClasses.sStripeEven];}iLen=oSettings.asStripeClasses.length;oSettings.asDestroyStripes=[];if(iLen){var bStripeRemove=false;var anRows=$(this).children("tbody").children("tr:lt("+iLen+")");for(i=0;i<iLen;i++){if(anRows.hasClass(oSettings.asStripeClasses[i])){bStripeRemove=true;oSettings.asDestroyStripes.push(oSettings.asStripeClasses[i]);}}if(bStripeRemove){anRows.removeClass(oSettings.asStripeClasses.join(" "));}}var anThs=[];var aoColumnsInit;var nThead=this.getElementsByTagName("thead");if(nThead.length!==0){_fnDetectHeader(oSettings.aoHeader,nThead[0]);anThs=_fnGetUniqueThs(oSettings);}if(oInit.aoColumns===null){aoColumnsInit=[];for(i=0,iLen=anThs.length;i<iLen;i++){aoColumnsInit.push(null);}}else{aoColumnsInit=oInit.aoColumns;}for(i=0,iLen=aoColumnsInit.length;i<iLen;i++){if(oInit.saved_aoColumns!==undefined&&oInit.saved_aoColumns.length==iLen){if(aoColumnsInit[i]===null){aoColumnsInit[i]={};}aoColumnsInit[i].bVisible=oInit.saved_aoColumns[i].bVisible;}_fnAddColumn(oSettings,anThs?anThs[i]:null);}_fnApplyColumnDefs(oSettings,oInit.aoColumnDefs,aoColumnsInit,function(iCol,oDef){_fnColumnOptions(oSettings,iCol,oDef);});for(i=0,iLen=oSettings.aaSorting.length;i<iLen;i++){if(oSettings.aaSorting[i][0]>=oSettings.aoColumns.length){oSettings.aaSorting[i][0]=0;}var oColumn=oSettings.aoColumns[oSettings.aaSorting[i][0]];if(oSettings.aaSorting[i][2]===undefined){oSettings.aaSorting[i][2]=0;}if(oInit.aaSorting===undefined&&oSettings.saved_aaSorting===undefined){oSettings.aaSorting[i][1]=oColumn.asSorting[0];}for(j=0,jLen=oColumn.asSorting.length;j<jLen;j++){if(oSettings.aaSorting[i][1]==oColumn.asSorting[j]){oSettings.aaSorting[i][2]=j;break;}}}_fnSortingClasses(oSettings);_fnBrowserDetect(oSettings);var captions=$(this).children("caption").each(function(){this._captionSide=$(this).css("caption-side");});var thead=$(this).children("thead");if(thead.length===0){thead=[document.createElement("thead")];this.appendChild(thead[0]);}oSettings.nTHead=thead[0];var tbody=$(this).children("tbody");if(tbody.length===0){tbody=[document.createElement("tbody")];this.appendChild(tbody[0]);}oSettings.nTBody=tbody[0];oSettings.nTBody.setAttribute("role","alert");oSettings.nTBody.setAttribute("aria-live","polite");oSettings.nTBody.setAttribute("aria-relevant","all");var tfoot=$(this).children("tfoot");if(tfoot.length===0&&captions.length>0&&(oSettings.oScroll.sX!==""||oSettings.oScroll.sY!=="")){tfoot=[document.createElement("tfoot")];this.appendChild(tfoot[0]);}if(tfoot.length>0){oSettings.nTFoot=tfoot[0];_fnDetectHeader(oSettings.aoFooter,oSettings.nTFoot);}if(bUsePassedData){for(i=0;i<oInit.aaData.length;i++){_fnAddData(oSettings,oInit.aaData[i]);}}else{_fnGatherData(oSettings);}oSettings.aiDisplay=oSettings.aiDisplayMaster.slice();oSettings.bInitialised=true;if(bInitHandedOff===false){_fnInitialise(oSettings);}});_that=null;return this;};DataTable.fnVersionCheck=function(sVersion){var fnZPad=function(Zpad,count){while(Zpad.length<count){Zpad+="0";}return Zpad;};var aThis=DataTable.ext.sVersion.split(".");var aThat=sVersion.split(".");var sThis="",sThat="";for(var i=0,iLen=aThat.length;i<iLen;i++){sThis+=fnZPad(aThis[i],3);sThat+=fnZPad(aThat[i],3);}return parseInt(sThis,10)>=parseInt(sThat,10);};DataTable.fnIsDataTable=function(nTable){var o=DataTable.settings;for(var i=0;i<o.length;i++){if(o[i].nTable===nTable||o[i].nScrollHead===nTable||o[i].nScrollFoot===nTable){return true;}}return false;};DataTable.fnTables=function(bVisible){var out=[];jQuery.each(DataTable.settings,function(i,o){if(!bVisible||(bVisible===true&&$(o.nTable).is(":visible"))){out.push(o.nTable);}});return out;};DataTable.version="1.9.4";DataTable.settings=[];DataTable.models={};DataTable.models.ext={afnFiltering:[],afnSortData:[],aoFeatures:[],aTypes:[],fnVersionCheck:DataTable.fnVersionCheck,iApiIndex:0,ofnSearch:{},oApi:{},oStdClasses:{},oJUIClasses:{},oPagination:{},oSort:{},sVersion:DataTable.version,sErrMode:"alert",_oExternConfig:{iNextUnique:0}};DataTable.models.oSearch={bCaseInsensitive:true,sSearch:"",bRegex:false,bSmart:true};DataTable.models.oRow={nTr:null,_aData:[],_aSortData:[],_anHidden:[],_sRowStripe:""};DataTable.models.oColumn={aDataSort:null,asSorting:null,bSearchable:null,bSortable:null,bUseRendered:null,bVisible:null,_bAutoType:true,fnCreatedCell:null,fnGetData:null,fnRender:null,fnSetData:null,mData:null,mRender:null,nTh:null,nTf:null,sClass:null,sContentPadding:null,sDefaultContent:null,sName:null,sSortDataType:"std",sSortingClass:null,sSortingClassJUI:null,sTitle:null,sType:null,sWidth:null,sWidthOrig:null};DataTable.defaults={aaData:null,aaSorting:[[0,"asc"]],aaSortingFixed:null,aLengthMenu:[10,25,50,100],aoColumns:null,aoColumnDefs:null,aoSearchCols:[],asStripeClasses:null,bAutoWidth:true,bDeferRender:false,bDestroy:false,bFilter:true,bInfo:true,bJQueryUI:false,bLengthChange:true,bPaginate:true,bProcessing:false,bRetrieve:false,bScrollAutoCss:true,bScrollCollapse:false,bScrollInfinite:false,bServerSide:false,bSort:true,bSortCellsTop:false,bSortClasses:true,bStateSave:false,fnCookieCallback:null,fnCreatedRow:null,fnDrawCallback:null,fnFooterCallback:null,fnFormatNumber:function(iIn){if(iIn<1000){return iIn;}var s=(iIn+""),a=s.split(""),out="",iLen=s.length;for(var i=0;i<iLen;i++){if(i%3===0&&i!==0){out=this.oLanguage.sInfoThousands+out;}out=a[iLen-i-1]+out;}return out;},fnHeaderCallback:null,fnInfoCallback:null,fnInitComplete:null,fnPreDrawCallback:null,fnRowCallback:null,fnServerData:function(sUrl,aoData,fnCallback,oSettings){oSettings.jqXHR=$.ajax({url:sUrl,data:aoData,success:function(json){if(json.sError){oSettings.oApi._fnLog(oSettings,0,json.sError);}$(oSettings.oInstance).trigger("xhr",[oSettings,json]);fnCallback(json);},dataType:"json",cache:false,type:oSettings.sServerMethod,error:function(xhr,error,thrown){if(error=="parsererror"){oSettings.oApi._fnLog(oSettings,0,"DataTables warning: JSON data from server could not be parsed. This is caused by a JSON formatting error.");}}});},fnServerParams:null,fnStateLoad:function(oSettings){var sData=this.oApi._fnReadCookie(oSettings.sCookiePrefix+oSettings.sInstance);var oData;try{oData=(typeof $.parseJSON==="function")?$.parseJSON(sData):eval("("+sData+")");}catch(e){oData=null;}return oData;},fnStateLoadParams:null,fnStateLoaded:null,fnStateSave:function(oSettings,oData){this.oApi._fnCreateCookie(oSettings.sCookiePrefix+oSettings.sInstance,this.oApi._fnJsonString(oData),oSettings.iCookieDuration,oSettings.sCookiePrefix,oSettings.fnCookieCallback);},fnStateSaveParams:null,iCookieDuration:7200,iDeferLoading:null,iDisplayLength:10,iDisplayStart:0,iScrollLoadGap:100,iTabIndex:0,oLanguage:{oAria:{sSortAscending:": activate to sort column ascending",sSortDescending:": activate to sort column descending"},oPaginate:{sFirst:"First",sLast:"Last",sNext:"Next",sPrevious:"Previous"},sEmptyTable:"No data available in table",sInfo:"Showing _START_ to _END_ of _TOTAL_ entries",sInfoEmpty:"Showing 0 to 0 of 0 entries",sInfoFiltered:"(filtered from _MAX_ total entries)",sInfoPostFix:"",sInfoThousands:",",sLengthMenu:"Show _MENU_ entries",sLoadingRecords:"Loading...",sProcessing:"Processing...",sSearch:"Search:",sUrl:"",sZeroRecords:"<i class='fa fa-warning text-warning'></i> No matching records found"},oSearch:$.extend({},DataTable.models.oSearch),sAjaxDataProp:"aaData",sAjaxSource:null,sCookiePrefix:"SpryMedia_DataTables_",sDom:"lfrtip",sPaginationType:"two_button",sScrollX:"",sScrollXInner:"",sScrollY:"",sServerMethod:"GET"};DataTable.defaults.columns={aDataSort:null,asSorting:["asc","desc"],bSearchable:true,bSortable:true,bUseRendered:true,bVisible:true,fnCreatedCell:null,fnRender:null,iDataSort:-1,mData:null,mRender:null,sCellType:"td",sClass:"",sContentPadding:"",sDefaultContent:null,sName:"",sSortDataType:"std",sTitle:null,sType:null,sWidth:null};DataTable.models.oSettings={oFeatures:{bAutoWidth:null,bDeferRender:null,bFilter:null,bInfo:null,bLengthChange:null,bPaginate:null,bProcessing:null,bServerSide:null,bSort:null,bSortClasses:null,bStateSave:null},oScroll:{bAutoCss:null,bCollapse:null,bInfinite:null,iBarWidth:0,iLoadGap:null,sX:null,sXInner:null,sY:null},oLanguage:{fnInfoCallback:null},oBrowser:{bScrollOversize:false},aanFeatures:[],aoData:[],aiDisplay:[],aiDisplayMaster:[],aoColumns:[],aoHeader:[],aoFooter:[],asDataSearch:[],oPreviousSearch:{},aoPreSearchCols:[],aaSorting:null,aaSortingFixed:null,asStripeClasses:null,asDestroyStripes:[],sDestroyWidth:0,aoRowCallback:[],aoHeaderCallback:[],aoFooterCallback:[],aoDrawCallback:[],aoRowCreatedCallback:[],aoPreDrawCallback:[],aoInitComplete:[],aoStateSaveParams:[],aoStateLoadParams:[],aoStateLoaded:[],sTableId:"",nTable:null,nTHead:null,nTFoot:null,nTBody:null,nTableWrapper:null,bDeferLoading:false,bInitialised:false,aoOpenRows:[],sDom:null,sPaginationType:"two_button",iCookieDuration:0,sCookiePrefix:"",fnCookieCallback:null,aoStateSave:[],aoStateLoad:[],oLoadedState:null,sAjaxSource:null,sAjaxDataProp:null,bAjaxDataGet:true,jqXHR:null,fnServerData:null,aoServerParams:[],sServerMethod:null,fnFormatNumber:null,aLengthMenu:null,iDraw:0,bDrawing:false,iDrawError:-1,_iDisplayLength:10,_iDisplayStart:0,_iDisplayEnd:10,_iRecordsTotal:0,_iRecordsDisplay:0,bJUI:null,oClasses:{},bFiltered:false,bSorted:false,bSortCellsTop:null,oInit:null,aoDestroyCallback:[],fnRecordsTotal:function(){if(this.oFeatures.bServerSide){return parseInt(this._iRecordsTotal,10);}else{return this.aiDisplayMaster.length;}},fnRecordsDisplay:function(){if(this.oFeatures.bServerSide){return parseInt(this._iRecordsDisplay,10);}else{return this.aiDisplay.length;}},fnDisplayEnd:function(){if(this.oFeatures.bServerSide){if(this.oFeatures.bPaginate===false||this._iDisplayLength==-1){return this._iDisplayStart+this.aiDisplay.length;}else{return Math.min(this._iDisplayStart+this._iDisplayLength,this._iRecordsDisplay);}}else{return this._iDisplayEnd;}},oInstance:null,sInstance:null,iTabIndex:0,nScrollHead:null,nScrollFoot:null};DataTable.ext=$.extend(true,{},DataTable.models.ext);$.extend(DataTable.ext.oStdClasses,{sTable:"dataTable",sPagePrevEnabled:"paginate_enabled_previous",sPagePrevDisabled:"paginate_disabled_previous",sPageNextEnabled:"paginate_enabled_next",sPageNextDisabled:"paginate_disabled_next",sPageJUINext:"",sPageJUIPrev:"",sPageButton:"paginate_button",sPageButtonActive:"paginate_active",sPageButtonStaticDisabled:"paginate_button paginate_button_disabled",sPageFirst:"first",sPagePrevious:"previous",sPageNext:"next",sPageLast:"last",sStripeOdd:"odd",sStripeEven:"even",sRowEmpty:"dataTables_empty",sWrapper:"dataTables_wrapper",sFilter:"dataTables_filter",sInfo:"dataTables_info",sPaging:"dataTables_paginate paging_",sLength:"dataTables_length",sProcessing:"dataTables_processing",sSortAsc:"sorting_asc",sSortDesc:"sorting_desc",sSortable:"sorting",sSortableAsc:"sorting_asc_disabled",sSortableDesc:"sorting_desc_disabled",sSortableNone:"sorting_disabled",sSortColumn:"sorting_",sSortJUIAsc:"",sSortJUIDesc:"",sSortJUI:"",sSortJUIAscAllowed:"",sSortJUIDescAllowed:"",sSortJUIWrapper:"",sSortIcon:"",sScrollWrapper:"dataTables_scroll",sScrollHead:"dataTables_scrollHead",sScrollHeadInner:"dataTables_scrollHeadInner",sScrollBody:"dataTables_scrollBody",sScrollFoot:"dataTables_scrollFoot",sScrollFootInner:"dataTables_scrollFootInner",sFooterTH:"",sJUIHeader:"",sJUIFooter:""});$.extend(DataTable.ext.oJUIClasses,DataTable.ext.oStdClasses,{sPagePrevEnabled:"fg-button ui-button ui-state-default ui-corner-left",sPagePrevDisabled:"fg-button ui-button ui-state-default ui-corner-left ui-state-disabled",sPageNextEnabled:"fg-button ui-button ui-state-default ui-corner-right",sPageNextDisabled:"fg-button ui-button ui-state-default ui-corner-right ui-state-disabled",sPageJUINext:"ui-icon ui-icon-circle-arrow-e",sPageJUIPrev:"ui-icon ui-icon-circle-arrow-w",sPageButton:"fg-button ui-button ui-state-default",sPageButtonActive:"fg-button ui-button ui-state-default ui-state-disabled",sPageButtonStaticDisabled:"fg-button ui-button ui-state-default ui-state-disabled",sPageFirst:"first ui-corner-tl ui-corner-bl",sPageLast:"last ui-corner-tr ui-corner-br",sPaging:"dataTables_paginate fg-buttonset ui-buttonset fg-buttonset-multi ui-buttonset-multi paging_",sSortAsc:"ui-state-default",sSortDesc:"ui-state-default",sSortable:"ui-state-default",sSortableAsc:"ui-state-default",sSortableDesc:"ui-state-default",sSortableNone:"ui-state-default",sSortJUIAsc:"css_right ui-icon ui-icon-triangle-1-n",sSortJUIDesc:"css_right ui-icon ui-icon-triangle-1-s",sSortJUI:"css_right ui-icon ui-icon-carat-2-n-s",sSortJUIAscAllowed:"css_right ui-icon ui-icon-carat-1-n",sSortJUIDescAllowed:"css_right ui-icon ui-icon-carat-1-s",sSortJUIWrapper:"DataTables_sort_wrapper",sSortIcon:"DataTables_sort_icon",sScrollHead:"dataTables_scrollHead ui-state-default",sScrollFoot:"dataTables_scrollFoot ui-state-default",sFooterTH:"ui-state-default",sJUIHeader:"fg-toolbar ui-toolbar ui-widget-header ui-corner-tl ui-corner-tr ui-helper-clearfix",sJUIFooter:"fg-toolbar ui-toolbar ui-widget-header ui-corner-bl ui-corner-br ui-helper-clearfix"});$.extend(DataTable.ext.oPagination,{two_button:{fnInit:function(oSettings,nPaging,fnCallbackDraw){var oLang=oSettings.oLanguage.oPaginate;var oClasses=oSettings.oClasses;var fnClickHandler=function(e){if(oSettings.oApi._fnPageChange(oSettings,e.data.action)){fnCallbackDraw(oSettings);}};var sAppend=(!oSettings.bJUI)?'<a class="'+oSettings.oClasses.sPagePrevDisabled+'" tabindex="'+oSettings.iTabIndex+'" role="button">'+oLang.sPrevious+'</a><a class="'+oSettings.oClasses.sPageNextDisabled+'" tabindex="'+oSettings.iTabIndex+'" role="button">'+oLang.sNext+"</a>":'<a class="'+oSettings.oClasses.sPagePrevDisabled+'" tabindex="'+oSettings.iTabIndex+'" role="button"><span class="'+oSettings.oClasses.sPageJUIPrev+'"></span></a><a class="'+oSettings.oClasses.sPageNextDisabled+'" tabindex="'+oSettings.iTabIndex+'" role="button"><span class="'+oSettings.oClasses.sPageJUINext+'"></span></a>';$(nPaging).append(sAppend);var els=$("a",nPaging);var nPrevious=els[0],nNext=els[1];oSettings.oApi._fnBindAction(nPrevious,{action:"previous"},fnClickHandler);oSettings.oApi._fnBindAction(nNext,{action:"next"},fnClickHandler);if(!oSettings.aanFeatures.p){nPaging.id=oSettings.sTableId+"_paginate";nPrevious.id=oSettings.sTableId+"_previous";nNext.id=oSettings.sTableId+"_next";nPrevious.setAttribute("aria-controls",oSettings.sTableId);nNext.setAttribute("aria-controls",oSettings.sTableId);}},fnUpdate:function(oSettings,fnCallbackDraw){if(!oSettings.aanFeatures.p){return;}var oClasses=oSettings.oClasses;var an=oSettings.aanFeatures.p;var nNode;for(var i=0,iLen=an.length;i<iLen;i++){nNode=an[i].firstChild;if(nNode){nNode.className=(oSettings._iDisplayStart===0)?oClasses.sPagePrevDisabled:oClasses.sPagePrevEnabled;nNode=nNode.nextSibling;nNode.className=(oSettings.fnDisplayEnd()==oSettings.fnRecordsDisplay())?oClasses.sPageNextDisabled:oClasses.sPageNextEnabled;}}}},iFullNumbersShowPages:5,full_numbers:{fnInit:function(oSettings,nPaging,fnCallbackDraw){var oLang=oSettings.oLanguage.oPaginate;var oClasses=oSettings.oClasses;var fnClickHandler=function(e){if(oSettings.oApi._fnPageChange(oSettings,e.data.action)){fnCallbackDraw(oSettings);}};$(nPaging).append('<a  tabindex="'+oSettings.iTabIndex+'" class="'+oClasses.sPageButton+" "+oClasses.sPageFirst+'">'+oLang.sFirst+'</a><a  tabindex="'+oSettings.iTabIndex+'" class="'+oClasses.sPageButton+" "+oClasses.sPagePrevious+'">'+oLang.sPrevious+'</a><span></span><a tabindex="'+oSettings.iTabIndex+'" class="'+oClasses.sPageButton+" "+oClasses.sPageNext+'">'+oLang.sNext+'</a><a tabindex="'+oSettings.iTabIndex+'" class="'+oClasses.sPageButton+" "+oClasses.sPageLast+'">'+oLang.sLast+"</a>");var els=$("a",nPaging);var nFirst=els[0],nPrev=els[1],nNext=els[2],nLast=els[3];oSettings.oApi._fnBindAction(nFirst,{action:"first"},fnClickHandler);oSettings.oApi._fnBindAction(nPrev,{action:"previous"},fnClickHandler);oSettings.oApi._fnBindAction(nNext,{action:"next"},fnClickHandler);oSettings.oApi._fnBindAction(nLast,{action:"last"},fnClickHandler);if(!oSettings.aanFeatures.p){nPaging.id=oSettings.sTableId+"_paginate";nFirst.id=oSettings.sTableId+"_first";nPrev.id=oSettings.sTableId+"_previous";nNext.id=oSettings.sTableId+"_next";nLast.id=oSettings.sTableId+"_last";}},fnUpdate:function(oSettings,fnCallbackDraw){if(!oSettings.aanFeatures.p){return;}var iPageCount=DataTable.ext.oPagination.iFullNumbersShowPages;var iPageCountHalf=Math.floor(iPageCount/2);var iPages=Math.ceil((oSettings.fnRecordsDisplay())/oSettings._iDisplayLength);var iCurrentPage=Math.ceil(oSettings._iDisplayStart/oSettings._iDisplayLength)+1;var sList="";var iStartButton,iEndButton,i,iLen;var oClasses=oSettings.oClasses;var anButtons,anStatic,nPaginateList,nNode;var an=oSettings.aanFeatures.p;var fnBind=function(j){oSettings.oApi._fnBindAction(this,{page:j+iStartButton-1},function(e){oSettings.oApi._fnPageChange(oSettings,e.data.page);fnCallbackDraw(oSettings);e.preventDefault();});};if(oSettings._iDisplayLength===-1){iStartButton=1;iEndButton=1;iCurrentPage=1;}else{if(iPages<iPageCount){iStartButton=1;iEndButton=iPages;}else{if(iCurrentPage<=iPageCountHalf){iStartButton=1;iEndButton=iPageCount;}else{if(iCurrentPage>=(iPages-iPageCountHalf)){iStartButton=iPages-iPageCount+1;iEndButton=iPages;}else{iStartButton=iCurrentPage-Math.ceil(iPageCount/2)+1;iEndButton=iStartButton+iPageCount-1;}}}}for(i=iStartButton;i<=iEndButton;i++){sList+=(iCurrentPage!==i)?'<a tabindex="'+oSettings.iTabIndex+'" class="'+oClasses.sPageButton+'">'+oSettings.fnFormatNumber(i)+"</a>":'<a tabindex="'+oSettings.iTabIndex+'" class="'+oClasses.sPageButtonActive+'">'+oSettings.fnFormatNumber(i)+"</a>";}for(i=0,iLen=an.length;i<iLen;i++){nNode=an[i];if(!nNode.hasChildNodes()){continue;}$("span:eq(0)",nNode).html(sList).children("a").each(fnBind);anButtons=nNode.getElementsByTagName("a");anStatic=[anButtons[0],anButtons[1],anButtons[anButtons.length-2],anButtons[anButtons.length-1]];$(anStatic).removeClass(oClasses.sPageButton+" "+oClasses.sPageButtonActive+" "+oClasses.sPageButtonStaticDisabled);$([anStatic[0],anStatic[1]]).addClass((iCurrentPage==1)?oClasses.sPageButtonStaticDisabled:oClasses.sPageButton);$([anStatic[2],anStatic[3]]).addClass((iPages===0||iCurrentPage===iPages||oSettings._iDisplayLength===-1)?oClasses.sPageButtonStaticDisabled:oClasses.sPageButton);}}}});$.extend(DataTable.ext.oSort,{"string-pre":function(a){if(typeof a!="string"){a=(a!==null&&a.toString)?a.toString():"";}return a.toLowerCase();},"string-asc":function(x,y){return((x<y)?-1:((x>y)?1:0));},"string-desc":function(x,y){return((x<y)?1:((x>y)?-1:0));},"html-pre":function(a){return a.replace(/<.*?>/g,"").toLowerCase();},"html-asc":function(x,y){return((x<y)?-1:((x>y)?1:0));},"html-desc":function(x,y){return((x<y)?1:((x>y)?-1:0));},"date-pre":function(a){var x=Date.parse(a);if(isNaN(x)||x===""){x=Date.parse("01/01/1970 00:00:00");}return x;},"date-asc":function(x,y){return x-y;},"date-desc":function(x,y){return y-x;},"numeric-pre":function(a){return(a=="-"||a==="")?0:a*1;},"numeric-asc":function(x,y){return x-y;},"numeric-desc":function(x,y){return y-x;}});$.extend(DataTable.ext.aTypes,[function(sData){if(typeof sData==="number"){return"numeric";}else{if(typeof sData!=="string"){return null;}}var sValidFirstChars="0123456789-";var sValidChars="0123456789.";var Char;var bDecimal=false;Char=sData.charAt(0);if(sValidFirstChars.indexOf(Char)==-1){return null;}for(var i=1;i<sData.length;i++){Char=sData.charAt(i);if(sValidChars.indexOf(Char)==-1){return null;}if(Char=="."){if(bDecimal){return null;}bDecimal=true;}}return"numeric";},function(sData){var iParse=Date.parse(sData);if((iParse!==null&&!isNaN(iParse))||(typeof sData==="string"&&sData.length===0)){return"date";}return null;},function(sData){if(typeof sData==="string"&&sData.indexOf("<")!=-1&&sData.indexOf(">")!=-1){return"html";}return null;}]);$.fn.DataTable=DataTable;$.fn.dataTable=DataTable;$.fn.dataTableSettings=DataTable.settings;$.fn.dataTableExt=DataTable.ext;}));}(window,document));
/*
 * File:        ColReorder.min.js
 * Version:     1.0.8
 * Author:      Allan Jardine (www.sprymedia.co.uk)
 * 
 * Copyright 2010-2012 Allan Jardine, all rights reserved.
 *
 * This source file is free software, under either the GPL v2 license or a
 * BSD (3 point) style license, as supplied with this software.
 * 
 * This source file is distributed in the hope that it will be useful, but 
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY 
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 */
(function(f,o,g){function m(a){for(var b=[],d=0,c=a.length;d<c;d++)b[a[d]]=d;return b}function j(a,b,d){b=a.splice(b,1)[0];a.splice(d,0,b)}function n(a,b,d){for(var c=[],e=0,f=a.childNodes.length;e<f;e++)1==a.childNodes[e].nodeType&&c.push(a.childNodes[e]);b=c[b];null!==d?a.insertBefore(b,c[d]):a.appendChild(b)}f.fn.dataTableExt.oApi.fnColReorder=function(a,b,d){var c,e,h,l,k=a.aoColumns.length,i;if(b!=d)if(0>b||b>=k)this.oApi._fnLog(a,1,"ColReorder 'from' index is out of bounds: "+b);else if(0>d||
d>=k)this.oApi._fnLog(a,1,"ColReorder 'to' index is out of bounds: "+d);else{var g=[];c=0;for(e=k;c<e;c++)g[c]=c;j(g,b,d);g=m(g);c=0;for(e=a.aaSorting.length;c<e;c++)a.aaSorting[c][0]=g[a.aaSorting[c][0]];if(null!==a.aaSortingFixed){c=0;for(e=a.aaSortingFixed.length;c<e;c++)a.aaSortingFixed[c][0]=g[a.aaSortingFixed[c][0]]}c=0;for(e=k;c<e;c++){i=a.aoColumns[c];h=0;for(l=i.aDataSort.length;h<l;h++)i.aDataSort[h]=g[i.aDataSort[h]]}c=0;for(e=k;c<e;c++)i=a.aoColumns[c],"number"==typeof i.mData&&(i.mData=
g[i.mData],i.fnGetData=a.oApi._fnGetObjectDataFn(i.mData),i.fnSetData=a.oApi._fnSetObjectDataFn(i.mData));if(a.aoColumns[b].bVisible){l=this.oApi._fnColumnIndexToVisible(a,b);i=null;for(c=d<b?d:d+1;null===i&&c<k;)i=this.oApi._fnColumnIndexToVisible(a,c),c++;h=a.nTHead.getElementsByTagName("tr");c=0;for(e=h.length;c<e;c++)n(h[c],l,i);if(null!==a.nTFoot){h=a.nTFoot.getElementsByTagName("tr");c=0;for(e=h.length;c<e;c++)n(h[c],l,i)}c=0;for(e=a.aoData.length;c<e;c++)null!==a.aoData[c].nTr&&n(a.aoData[c].nTr,
l,i)}j(a.aoColumns,b,d);j(a.aoPreSearchCols,b,d);c=0;for(e=a.aoData.length;c<e;c++)f.isArray(a.aoData[c]._aData)&&j(a.aoData[c]._aData,b,d),j(a.aoData[c]._anHidden,b,d);c=0;for(e=a.aoHeader.length;c<e;c++)j(a.aoHeader[c],b,d);if(null!==a.aoFooter){c=0;for(e=a.aoFooter.length;c<e;c++)j(a.aoFooter[c],b,d)}c=0;for(e=k;c<e;c++)f(a.aoColumns[c].nTh).unbind("click"),this.oApi._fnSortAttachListener(a,a.aoColumns[c].nTh,c);f(a.oInstance).trigger("column-reorder",[a,{iFrom:b,iTo:d,aiInvertMapping:g}]);"undefined"!=
typeof a.oInstance._oPluginFixedHeader&&a.oInstance._oPluginFixedHeader.fnUpdate()}};ColReorder=function(a,b){(!this.CLASS||"ColReorder"!=this.CLASS)&&alert("Warning: ColReorder must be initialised with the keyword 'new'");"undefined"==typeof b&&(b={});this.s={dt:null,init:b,fixed:0,dropCallback:null,mouse:{startX:-1,startY:-1,offsetX:-1,offsetY:-1,target:-1,targetIndex:-1,fromIndex:-1},aoTargets:[]};this.dom={drag:null,pointer:null};this.s.dt=a.oInstance.fnSettings();this._fnConstruct();a.oApi._fnCallbackReg(a,
"aoDestroyCallback",jQuery.proxy(this._fnDestroy,this),"ColReorder");ColReorder.aoInstances.push(this);return this};ColReorder.prototype={fnReset:function(){for(var a=[],b=0,d=this.s.dt.aoColumns.length;b<d;b++)a.push(this.s.dt.aoColumns[b]._ColReorder_iOrigCol);this._fnOrderColumns(a)},_fnConstruct:function(){var a=this,b,d;"undefined"!=typeof this.s.init.iFixedColumns&&(this.s.fixed=this.s.init.iFixedColumns);"undefined"!=typeof this.s.init.fnReorderCallback&&(this.s.dropCallback=this.s.init.fnReorderCallback);
b=0;for(d=this.s.dt.aoColumns.length;b<d;b++)b>this.s.fixed-1&&this._fnMouseListener(b,this.s.dt.aoColumns[b].nTh),this.s.dt.aoColumns[b]._ColReorder_iOrigCol=b;this.s.dt.oApi._fnCallbackReg(this.s.dt,"aoStateSaveParams",function(c,b){a._fnStateSave.call(a,b)},"ColReorder_State");var c=null;"undefined"!=typeof this.s.init.aiOrder&&(c=this.s.init.aiOrder.slice());this.s.dt.oLoadedState&&("undefined"!=typeof this.s.dt.oLoadedState.ColReorder&&this.s.dt.oLoadedState.ColReorder.length==this.s.dt.aoColumns.length)&&
(c=this.s.dt.oLoadedState.ColReorder);if(c)if(a.s.dt._bInitComplete)b=m(c),a._fnOrderColumns.call(a,b);else{var e=!1;this.s.dt.aoDrawCallback.push({fn:function(){if(!a.s.dt._bInitComplete&&!e){e=true;var b=m(c);a._fnOrderColumns.call(a,b)}},sName:"ColReorder_Pre"})}},_fnOrderColumns:function(a){if(a.length!=this.s.dt.aoColumns.length)this.s.dt.oInstance.oApi._fnLog(this.s.dt,1,"ColReorder - array reorder does not match known number of columns. Skipping.");else{for(var b=0,d=a.length;b<d;b++){var c=
f.inArray(b,a);b!=c&&(j(a,c,b),this.s.dt.oInstance.fnColReorder(c,b))}(""!==this.s.dt.oScroll.sX||""!==this.s.dt.oScroll.sY)&&this.s.dt.oInstance.fnAdjustColumnSizing();this.s.dt.oInstance.oApi._fnSaveState(this.s.dt)}},_fnStateSave:function(a){var b,d,c,e=this.s.dt;for(b=0;b<a.aaSorting.length;b++)a.aaSorting[b][0]=e.aoColumns[a.aaSorting[b][0]]._ColReorder_iOrigCol;aSearchCopy=f.extend(!0,[],a.aoSearchCols);a.ColReorder=[];b=0;for(d=e.aoColumns.length;b<d;b++)c=e.aoColumns[b]._ColReorder_iOrigCol,
a.aoSearchCols[c]=aSearchCopy[b],a.abVisCols[c]=e.aoColumns[b].bVisible,a.ColReorder.push(c)},_fnMouseListener:function(a,b){var d=this;f(b).bind("mousedown.ColReorder",function(a){a.preventDefault();d._fnMouseDown.call(d,a,b)})},_fnMouseDown:function(a,b){var d=this,c=this.s.dt.aoColumns,e="TH"==a.target.nodeName?a.target:f(a.target).parents("TH")[0],e=f(e).offset();this.s.mouse.startX=a.pageX;this.s.mouse.startY=a.pageY;this.s.mouse.offsetX=a.pageX-e.left;this.s.mouse.offsetY=a.pageY-e.top;this.s.mouse.target=
b;this.s.mouse.targetIndex=f("th",b.parentNode).index(b);this.s.mouse.fromIndex=this.s.dt.oInstance.oApi._fnVisibleToColumnIndex(this.s.dt,this.s.mouse.targetIndex);this.s.aoTargets.splice(0,this.s.aoTargets.length);this.s.aoTargets.push({x:f(this.s.dt.nTable).offset().left,to:0});for(var h=e=0,j=c.length;h<j;h++)h!=this.s.mouse.fromIndex&&e++,c[h].bVisible&&this.s.aoTargets.push({x:f(c[h].nTh).offset().left+f(c[h].nTh).outerWidth(),to:e});0!==this.s.fixed&&this.s.aoTargets.splice(0,this.s.fixed);
f(g).bind("mousemove.ColReorder",function(a){d._fnMouseMove.call(d,a)});f(g).bind("mouseup.ColReorder",function(a){d._fnMouseUp.call(d,a)})},_fnMouseMove:function(a){if(null===this.dom.drag){if(5>Math.pow(Math.pow(a.pageX-this.s.mouse.startX,2)+Math.pow(a.pageY-this.s.mouse.startY,2),0.5))return;this._fnCreateDragNode()}this.dom.drag.style.left=a.pageX-this.s.mouse.offsetX+"px";this.dom.drag.style.top=a.pageY-this.s.mouse.offsetY+"px";for(var b=!1,d=1,c=this.s.aoTargets.length;d<c;d++)if(a.pageX<
this.s.aoTargets[d-1].x+(this.s.aoTargets[d].x-this.s.aoTargets[d-1].x)/2){this.dom.pointer.style.left=this.s.aoTargets[d-1].x+"px";this.s.mouse.toIndex=this.s.aoTargets[d-1].to;b=!0;break}b||(this.dom.pointer.style.left=this.s.aoTargets[this.s.aoTargets.length-1].x+"px",this.s.mouse.toIndex=this.s.aoTargets[this.s.aoTargets.length-1].to)},_fnMouseUp:function(){f(g).unbind("mousemove.ColReorder");f(g).unbind("mouseup.ColReorder");null!==this.dom.drag&&(g.body.removeChild(this.dom.drag),g.body.removeChild(this.dom.pointer),
this.dom.drag=null,this.dom.pointer=null,this.s.dt.oInstance.fnColReorder(this.s.mouse.fromIndex,this.s.mouse.toIndex),(""!==this.s.dt.oScroll.sX||""!==this.s.dt.oScroll.sY)&&this.s.dt.oInstance.fnAdjustColumnSizing(),null!==this.s.dropCallback&&this.s.dropCallback.call(this),this.s.dt.oInstance.oApi._fnSaveState(this.s.dt))},_fnCreateDragNode:function(){var a=this;this.dom.drag=f(this.s.dt.nTHead.parentNode).clone(!0)[0];for(this.dom.drag.className+=" DTCR_clonedTable";0<this.dom.drag.getElementsByTagName("caption").length;)this.dom.drag.removeChild(this.dom.drag.getElementsByTagName("caption")[0]);
for(;0<this.dom.drag.getElementsByTagName("tbody").length;)this.dom.drag.removeChild(this.dom.drag.getElementsByTagName("tbody")[0]);for(;0<this.dom.drag.getElementsByTagName("tfoot").length;)this.dom.drag.removeChild(this.dom.drag.getElementsByTagName("tfoot")[0]);f("thead tr:eq(0)",this.dom.drag).each(function(){f("th",this).eq(a.s.mouse.targetIndex).siblings().remove()});f("tr",this.dom.drag).height(f("tr:eq(0)",a.s.dt.nTHead).height());f("thead tr:gt(0)",this.dom.drag).remove();f("thead th:eq(0)",
this.dom.drag).each(function(){this.style.width=f("th:eq("+a.s.mouse.targetIndex+")",a.s.dt.nTHead).width()+"px"});this.dom.drag.style.position="absolute";this.dom.drag.style.top="0px";this.dom.drag.style.left="0px";this.dom.drag.style.width=f("th:eq("+a.s.mouse.targetIndex+")",a.s.dt.nTHead).outerWidth()+"px";this.dom.pointer=g.createElement("div");this.dom.pointer.className="DTCR_pointer";this.dom.pointer.style.position="absolute";""===this.s.dt.oScroll.sX&&""===this.s.dt.oScroll.sY?(this.dom.pointer.style.top=
f(this.s.dt.nTable).offset().top+"px",this.dom.pointer.style.height=f(this.s.dt.nTable).height()+"px"):(this.dom.pointer.style.top=f("div.dataTables_scroll",this.s.dt.nTableWrapper).offset().top+"px",this.dom.pointer.style.height=f("div.dataTables_scroll",this.s.dt.nTableWrapper).height()+"px");g.body.appendChild(this.dom.pointer);g.body.appendChild(this.dom.drag)},_fnDestroy:function(){for(var a=0,b=ColReorder.aoInstances.length;a<b;a++)if(ColReorder.aoInstances[a]===this){ColReorder.aoInstances.splice(a,
1);break}f(this.s.dt.nTHead).find("*").unbind(".ColReorder");this.s=this.s.dt.oInstance._oPluginColReorder=null}};ColReorder.aoInstances=[];ColReorder.fnReset=function(a){for(var b=0,d=ColReorder.aoInstances.length;b<d;b++)ColReorder.aoInstances[b].s.dt.oInstance==a&&ColReorder.aoInstances[b].fnReset()};ColReorder.prototype.CLASS="ColReorder";ColReorder.VERSION="1.0.8";ColReorder.prototype.VERSION=ColReorder.VERSION;"function"==typeof f.fn.dataTable&&"function"==typeof f.fn.dataTableExt.fnVersionCheck&&
f.fn.dataTableExt.fnVersionCheck("1.9.3")?f.fn.dataTableExt.aoFeatures.push({fnInit:function(a){var b=a.oInstance;"undefined"==typeof b._oPluginColReorder?b._oPluginColReorder=new ColReorder(a,"undefined"!=typeof a.oInit.oColReorder?a.oInit.oColReorder:{}):b.oApi._fnLog(a,1,"ColReorder attempted to initialise twice. Ignoring second");return null},cFeature:"R",sFeature:"ColReorder"}):alert("Warning: ColReorder requires DataTables 1.9.3 or greater - www.datatables.net/download")})(jQuery,window,document);

var FixedColumns;(function(c,b,a){FixedColumns=function(e,d){var f=this;if(!this instanceof FixedColumns){alert("FixedColumns warning: FixedColumns must be initialised with the 'new' keyword.");return}if(typeof d=="undefined"){d={}}this.s={dt:e.fnSettings(),iTableColumns:e.fnSettings().aoColumns.length,aiOuterWidths:[],aiInnerWidths:[]};this.dom={scroller:null,header:null,body:null,footer:null,grid:{wrapper:null,dt:null,left:{wrapper:null,head:null,body:null,foot:null},right:{wrapper:null,head:null,body:null,foot:null}},clone:{left:{header:null,body:null,footer:null},right:{header:null,body:null,footer:null}}};this.s.dt.oFixedColumns=this;if(!this.s.dt._bInitComplete){this.s.dt.oApi._fnCallbackReg(this.s.dt,"aoInitComplete",function(){f._fnConstruct(d)},"FixedColumns")}else{this._fnConstruct(d)}};FixedColumns.prototype={fnUpdate:function(){this._fnDraw(true)},fnRedrawLayout:function(){this._fnColCalc();this._fnGridLayout();this.fnUpdate()},fnRecalculateHeight:function(d){delete d._DTTC_iHeight;d.style.height="auto"},fnSetRowHeight:function(e,d){e.style.height=d+"px"},_fnConstruct:function(e){var f,d,j,h=this;if(typeof this.s.dt.oInstance.fnVersionCheck!="function"||this.s.dt.oInstance.fnVersionCheck("1.8.0")!==true){alert("FixedColumns "+FixedColumns.VERSION+" required DataTables 1.8.0 or later. Please upgrade your DataTables installation");return}if(this.s.dt.oScroll.sX===""){this.s.dt.oInstance.oApi._fnLog(this.s.dt,1,"FixedColumns is not needed (no x-scrolling in DataTables enabled), so no action will be taken. Use 'FixedHeader' for column fixing when scrolling is not enabled");return}this.s=c.extend(true,this.s,FixedColumns.defaults,e);this.dom.grid.dt=c(this.s.dt.nTable).parents("div.dataTables_scroll")[0];this.dom.scroller=c("div.dataTables_scrollBody",this.dom.grid.dt)[0];this._fnColCalc();this._fnGridSetup();c(this.dom.scroller).scroll(function(){if(h.s.iLeftColumns>0){h.dom.grid.left.liner.scrollTop=h.dom.scroller.scrollTop}if(h.s.iRightColumns>0){h.dom.grid.right.liner.scrollTop=h.dom.scroller.scrollTop}});if(h.s.iLeftColumns>0){c(h.dom.grid.left.liner).scroll(function(){h.dom.scroller.scrollTop=h.dom.grid.left.liner.scrollTop;if(h.s.iRightColumns>0){h.dom.grid.right.liner.scrollTop=h.dom.grid.left.liner.scrollTop}});c(h.dom.grid.left.liner).bind("mousewheel",function(k){var i=k.originalEvent.wheelDeltaX/3;h.dom.scroller.scrollLeft-=i})}if(h.s.iRightColumns>0){c(h.dom.grid.right.liner).scroll(function(){h.dom.scroller.scrollTop=h.dom.grid.right.liner.scrollTop;if(h.s.iLeftColumns>0){h.dom.grid.left.liner.scrollTop=h.dom.grid.right.liner.scrollTop}});c(h.dom.grid.right.liner).bind("mousewheel",function(k){var i=k.originalEvent.wheelDeltaX/3;h.dom.scroller.scrollLeft-=i})}c(b).resize(function(){h._fnGridLayout.call(h)});var g=true;this.s.dt.aoDrawCallback=[{fn:function(){h._fnDraw.call(h,g);h._fnGridLayout(h);g=false},sName:"FixedColumns"}].concat(this.s.dt.aoDrawCallback);this._fnGridLayout();this.s.dt.oInstance.fnDraw(false)},_fnColCalc:function(){var g=this;var d=c(this.dom.grid.dt).width();var f=0;var e=0;this.s.aiInnerWidths=[];c("tbody>tr:eq(0)>td, tbody>tr:eq(0)>th",this.s.dt.nTable).each(function(h){g.s.aiInnerWidths.push(c(this).width());var j=c(this).outerWidth();g.s.aiOuterWidths.push(j);if(h<g.s.iLeftColumns){f+=j}if(g.s.iTableColumns-g.s.iRightColumns<=h){e+=j}});this.s.iLeftWidth=this.s.sLeftWidth=="fixed"?f:(f/d)*100;this.s.iRightWidth=this.s.sRightWidth=="fixed"?e:(e/d)*100},_fnGridSetup:function(){var h=this;var d=this._fnDTOverflow();var i;this.dom.body=this.s.dt.nTable;this.dom.header=this.s.dt.nTHead.parentNode;this.dom.header.parentNode.parentNode.style.position="relative";var f=c('<div class="DTFC_ScrollWrapper" style="position:relative; clear:both;"><div class="DTFC_LeftWrapper" style="position:absolute; top:0; left:0;"><div class="DTFC_LeftHeadWrapper" style="position:relative; top:0; left:0; overflow:hidden;"></div><div class="DTFC_LeftBodyWrapper" style="position:relative; top:0; left:0; overflow:hidden;"><div class="DTFC_LeftBodyLiner" style="position:relative; top:0; left:0; overflow-y:scroll;"></div></div><div class="DTFC_LeftFootWrapper" style="position:relative; top:0; left:0; overflow:hidden;"></div></div><div class="DTFC_RightWrapper" style="position:absolute; top:0; left:0;"><div class="DTFC_RightHeadWrapper" style="position:relative; top:0; left:0;"><div class="DTFC_RightHeadBlocker DTFC_Blocker" style="position:absolute; top:0; bottom:0;"></div></div><div class="DTFC_RightBodyWrapper" style="position:relative; top:0; left:0; overflow:hidden;"><div class="DTFC_RightBodyLiner" style="position:relative; top:0; left:0; overflow-y:scroll;"></div></div><div class="DTFC_RightFootWrapper" style="position:relative; top:0; left:0;"><div class="DTFC_RightFootBlocker DTFC_Blocker" style="position:absolute; top:0; bottom:0;"></div></div></div></div>')[0];var g=f.childNodes[0];var e=f.childNodes[1];this.dom.grid.dt.parentNode.insertBefore(f,this.dom.grid.dt);f.appendChild(this.dom.grid.dt);this.dom.grid.wrapper=f;if(this.s.iLeftColumns>0){this.dom.grid.left.wrapper=g;this.dom.grid.left.head=g.childNodes[0];this.dom.grid.left.body=g.childNodes[1];this.dom.grid.left.liner=c("div.DTFC_LeftBodyLiner",f)[0];f.appendChild(g)}if(this.s.iRightColumns>0){this.dom.grid.right.wrapper=e;this.dom.grid.right.head=e.childNodes[0];this.dom.grid.right.body=e.childNodes[1];this.dom.grid.right.liner=c("div.DTFC_RightBodyLiner",f)[0];i=c("div.DTFC_RightHeadBlocker",f)[0];i.style.width=d.bar+"px";i.style.right=-d.bar+"px";this.dom.grid.right.headBlock=i;i=c("div.DTFC_RightFootBlocker",f)[0];i.style.width=d.bar+"px";i.style.right=-d.bar+"px";this.dom.grid.right.footBlock=i;f.appendChild(e)}if(this.s.dt.nTFoot){this.dom.footer=this.s.dt.nTFoot.parentNode;if(this.s.iLeftColumns>0){this.dom.grid.left.foot=g.childNodes[2]}if(this.s.iRightColumns>0){this.dom.grid.right.foot=e.childNodes[2]}}},_fnGridLayout:function(){var k=this.dom.grid;var j=c(k.wrapper).width();var f=c(this.s.dt.nTable.parentNode).height();var i=c(this.s.dt.nTable.parentNode.parentNode).height();var h,g,e;var d=this._fnDTOverflow();if(this.s.sLeftWidth=="fixed"){h=this.s.iLeftWidth}else{h=(this.s.iLeftWidth/100)*j}if(this.s.sRightWidth=="fixed"){e=this.s.iRightWidth}else{e=(this.s.iRightWidth/100)*j}if(d.x){f-=d.bar}k.wrapper.style.height=i+"px";if(this.s.iLeftColumns>0){k.left.wrapper.style.width=h+"px";k.left.wrapper.style.height=i+"px";k.left.body.style.height=f+"px";if(k.left.foot){k.left.foot.style.top=(d.x?d.bar:0)+"px"}k.left.liner.style.width=(h+d.bar)+"px";k.left.liner.style.height=f+"px"}if(this.s.iRightColumns>0){g=j-e;if(d.y){g-=d.bar}k.right.wrapper.style.width=e+"px";k.right.wrapper.style.left=g+"px";k.right.wrapper.style.height=i+"px";k.right.body.style.height=f+"px";if(k.right.foot){k.right.foot.style.top=(d.x?d.bar:0)+"px"}k.right.liner.style.width=(e+d.bar)+"px";k.right.liner.style.height=f+"px";k.right.headBlock.style.display=d.x?"block":"none";k.right.footBlock.style.display=d.x?"block":"none"}},_fnDTOverflow:function(){var f=this.s.dt.nTable;var d=f.parentNode;var e={x:false,y:false,bar:this.s.dt.oScroll.iBarWidth};if(f.offsetWidth>d.offsetWidth){e.x=true}if(f.offsetHeight>d.offsetHeight){e.y=true}return e},_fnDraw:function(d){this._fnCloneLeft(d);this._fnCloneRight(d);if(this.s.fnDrawCallback!==null){this.s.fnDrawCallback.call(this,this.dom.clone.left,this.dom.clone.right)}c(this).trigger("draw",{leftClone:this.dom.clone.left,rightClone:this.dom.clone.right})},_fnCloneRight:function(e){if(this.s.iRightColumns<=0){return}var g=this,d,h,f=[];for(d=this.s.iTableColumns-this.s.iRightColumns;d<this.s.iTableColumns;d++){f.push(d)}this._fnClone(this.dom.clone.right,this.dom.grid.right,f,e)},_fnCloneLeft:function(e){if(this.s.iLeftColumns<=0){return}var g=this,d,h,f=[];for(d=0;d<this.s.iLeftColumns;d++){f.push(d)}this._fnClone(this.dom.clone.left,this.dom.grid.left,f,e)},_fnCopyLayout:function(o,q){var n=[];var l=[];var f=[];for(var h=0,e=o.length;h<e;h++){var m=[];m.nTr=c(o[h].nTr).clone(true)[0];for(var g=0,p=this.s.iTableColumns;g<p;g++){if(c.inArray(g,q)===-1){continue}var k=c.inArray(o[h][g].cell,f);if(k===-1){var d=c(o[h][g].cell).clone(true)[0];l.push(d);f.push(o[h][g].cell);m.push({cell:d,unique:o[h][g].unique})}else{m.push({cell:l[k],unique:o[h][g].unique})}}n.push(m)}return n},_fnClone:function(u,t,f,d){var l=this,w,s,v,A,r,h,x,p,m,g,n,B;if(d){if(u.header!==null){u.header.parentNode.removeChild(u.header)}u.header=c(this.dom.header).clone(true)[0];u.header.className+=" DTFC_Cloned";u.header.style.width="100%";t.head.appendChild(u.header);g=this._fnCopyLayout(this.s.dt.aoHeader,f);n=c(">thead",u.header);n.empty();for(w=0,s=g.length;w<s;w++){n[0].appendChild(g[w].nTr)}this.s.dt.oApi._fnDrawHead(this.s.dt,g,true)}else{g=this._fnCopyLayout(this.s.dt.aoHeader,f);B=[];this.s.dt.oApi._fnDetectHeader(B,c(">thead",u.header)[0]);for(w=0,s=g.length;w<s;w++){for(v=0,A=g[w].length;v<A;v++){B[w][v].cell.className=g[w][v].cell.className;c("span.DataTables_sort_icon",B[w][v].cell).each(function(){this.className=c("span.DataTables_sort_icon",g[w][v].cell)[0].className})}}}this._fnEqualiseHeights("thead",this.dom.header,u.header);if(this.s.sHeightMatch=="auto"){c(">tbody>tr",l.dom.body).css("height","auto")}if(u.body!==null){u.body.parentNode.removeChild(u.body);u.body=null}u.body=c(this.dom.body).clone(true)[0];u.body.className+=" DTFC_Cloned";u.body.style.paddingBottom=this.s.dt.oScroll.iBarWidth+"px";u.body.style.marginBottom=(this.s.dt.oScroll.iBarWidth*2)+"px";if(u.body.getAttribute("id")!==null){u.body.removeAttribute("id")}c(">thead>tr",u.body).empty();c(">tfoot",u.body).remove();var o=c("tbody",u.body)[0];c(o).empty();if(this.s.dt.aiDisplay.length>0){var k=c(">thead>tr",u.body)[0];for(m=0;m<f.length;m++){x=f[m];p=c(this.s.dt.aoColumns[x].nTh).clone(true)[0];p.innerHTML="";var q=p.style;q.paddingTop="0";q.paddingBottom="0";q.borderTopWidth="0";q.borderBottomWidth="0";q.height=0;q.width=l.s.aiInnerWidths[x]+"px";k.appendChild(p)}c(">tbody>tr",l.dom.body).each(function(D){var E=this.cloneNode(false);var j=l.s.dt.oFeatures.bServerSide===false?l.s.dt.aiDisplay[l.s.dt._iDisplayStart+D]:D;for(m=0;m<f.length;m++){var C=l.s.dt.oApi._fnGetTdNodes(l.s.dt,j);x=f[m];if(C.length>0){p=c(C[x]).clone(true)[0];E.appendChild(p)}}o.appendChild(E)})}else{c(">tbody>tr",l.dom.body).each(function(i){p=this.cloneNode(true);p.className+=" DTFC_NoData";c("td",p).html("");o.appendChild(p)})}u.body.style.width="100%";u.body.style.margin="0";u.body.style.padding="0";if(d){if(typeof this.s.dt.oScroller!="undefined"){t.liner.appendChild(this.s.dt.oScroller.dom.force.cloneNode(true))}}t.liner.appendChild(u.body);this._fnEqualiseHeights("tbody",l.dom.body,u.body);if(this.s.dt.nTFoot!==null){if(d){if(u.footer!==null){u.footer.parentNode.removeChild(u.footer)}u.footer=c(this.dom.footer).clone(true)[0];u.footer.className+=" DTFC_Cloned";u.footer.style.width="100%";t.foot.appendChild(u.footer);g=this._fnCopyLayout(this.s.dt.aoFooter,f);var e=c(">tfoot",u.footer);e.empty();for(w=0,s=g.length;w<s;w++){e[0].appendChild(g[w].nTr)}this.s.dt.oApi._fnDrawHead(this.s.dt,g,true)}else{g=this._fnCopyLayout(this.s.dt.aoFooter,f);var y=[];this.s.dt.oApi._fnDetectHeader(y,c(">tfoot",u.footer)[0]);for(w=0,s=g.length;w<s;w++){for(v=0,A=g[w].length;v<A;v++){y[w][v].cell.className=g[w][v].cell.className}}}this._fnEqualiseHeights("tfoot",this.dom.footer,u.footer)}var z=this.s.dt.oApi._fnGetUniqueThs(this.s.dt,c(">thead",u.header)[0]);c(z).each(function(j){x=f[j];this.style.width=l.s.aiInnerWidths[x]+"px"});if(l.s.dt.nTFoot!==null){z=this.s.dt.oApi._fnGetUniqueThs(this.s.dt,c(">tfoot",u.footer)[0]);c(z).each(function(j){x=f[j];this.style.width=l.s.aiInnerWidths[x]+"px"})}},_fnGetTrNodes:function(e){var g=[];for(var f=0,d=e.childNodes.length;f<d;f++){if(e.childNodes[f].nodeName.toUpperCase()=="TR"){g.push(e.childNodes[f])}}return g},_fnEqualiseHeights:function(p,e,o){if(this.s.sHeightMatch=="none"&&p!=="thead"&&p!=="tfoot"){return}var m=this,j,f,d,h,t,s,l=e.getElementsByTagName(p)[0],n=o.getElementsByTagName(p)[0],g=c(">"+p+">tr:eq(0)",e).children(":first"),r=g.outerHeight()-g.height(),k=this._fnGetTrNodes(l),q=this._fnGetTrNodes(n);for(j=0,f=q.length;j<f;j++){t=k[j].offsetHeight;s=q[j].offsetHeight;d=s>t?s:t;if(this.s.sHeightMatch=="semiauto"){k[j]._DTTC_iHeight=d}q[j].style.height=d+"px";k[j].style.height=d+"px"}}};FixedColumns.defaults={iLeftColumns:1,iRightColumns:0,fnDrawCallback:null,sLeftWidth:"fixed",iLeftWidth:null,sRightWidth:"fixed",iRightWidth:null,sHeightMatch:"semiauto"};FixedColumns.prototype.CLASS="FixedColumns";FixedColumns.VERSION="2.5.0.dev"})(jQuery,window,document);
/*
 * File:        ColVis.min.js
 * Version:     1.0.8
 * Author:      Allan Jardine (www.sprymedia.co.uk)
 * Info:        www.datatables.net
 * 
 * Copyright 2008-2012 Allan Jardine, all rights reserved.
 *
 * This source file is free software, under either the GPL v2 license or a
 * BSD style license, available at:
 *   http://datatables.net/license_gpl2
 *   http://datatables.net/license_bsd
 * 
 * This source file is distributed in the hope that it will be useful, but 
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY 
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 */
(function(d){ColVis=function(a,b){if(!this.CLASS||this.CLASS!="ColVis")alert("Warning: ColVis must be initialised with the keyword 'new'");if(typeof b=="undefined")b={};this.s={dt:null,oInit:b,fnStateChange:null,activate:"click",sAlign:"left",buttonText:"Show / hide columns",hidden:true,aiExclude:[],abOriginal:[],bShowAll:false,sShowAll:"Show All",bRestore:false,sRestore:"Restore original",iOverlayFade:500,fnLabel:null,sSize:"auto",bCssPosition:false};this.dom={wrapper:null,button:null,collection:null,
background:null,catcher:null,buttons:[],restore:null};ColVis.aInstances.push(this);this.s.dt=a;this._fnConstruct();return this};ColVis.prototype={fnRebuild:function(){for(var a=this.dom.buttons.length-1;a>=0;a--)this.dom.buttons[a]!==null&&this.dom.collection.removeChild(this.dom.buttons[a]);this.dom.buttons.splice(0,this.dom.buttons.length);this.dom.restore&&this.dom.restore.parentNode(this.dom.restore);this._fnAddButtons();this._fnDrawCallback()},_fnConstruct:function(){this._fnApplyCustomisation();
var a=this,b,c;this.dom.wrapper=document.createElement("div");this.dom.wrapper.className="ColVis TableTools";this.dom.button=this._fnDomBaseButton(this.s.buttonText);this.dom.button.className+=" ColVis_MasterButton";this.dom.wrapper.appendChild(this.dom.button);this.dom.catcher=this._fnDomCatcher();this.dom.collection=this._fnDomCollection();this.dom.background=this._fnDomBackground();this._fnAddButtons();b=0;for(c=this.s.dt.aoColumns.length;b<c;b++)this.s.abOriginal.push(this.s.dt.aoColumns[b].bVisible);
this.s.dt.aoDrawCallback.push({fn:function(){a._fnDrawCallback.call(a)},sName:"ColVis"});d(this.s.dt.oInstance).bind("column-reorder",function(e,g,f){b=0;for(c=a.s.aiExclude.length;b<c;b++)a.s.aiExclude[b]=f.aiInvertMapping[a.s.aiExclude[b]];e=a.s.abOriginal.splice(f.iFrom,1)[0];a.s.abOriginal.splice(f.iTo,0,e);a.fnRebuild()})},_fnApplyCustomisation:function(){var a=this.s.oInit;if(typeof a.activate!="undefined")this.s.activate=a.activate;if(typeof a.buttonText!="undefined")this.s.buttonText=a.buttonText;
if(typeof a.aiExclude!="undefined")this.s.aiExclude=a.aiExclude;if(typeof a.bRestore!="undefined")this.s.bRestore=a.bRestore;if(typeof a.sRestore!="undefined")this.s.sRestore=a.sRestore;if(typeof a.bShowAll!="undefined")this.s.bShowAll=a.bShowAll;if(typeof a.sShowAll!="undefined")this.s.sShowAll=a.sShowAll;if(typeof a.sAlign!="undefined")this.s.sAlign=a.sAlign;if(typeof a.fnStateChange!="undefined")this.s.fnStateChange=a.fnStateChange;if(typeof a.iOverlayFade!="undefined")this.s.iOverlayFade=a.iOverlayFade;
if(typeof a.fnLabel!="undefined")this.s.fnLabel=a.fnLabel;if(typeof a.sSize!="undefined")this.s.sSize=a.sSize;if(typeof a.bCssPosition!="undefined")this.s.bCssPosition=a.bCssPosition},_fnDrawCallback:function(){for(var a=this.s.dt.aoColumns,b=0,c=a.length;b<c;b++)if(this.dom.buttons[b]!==null)a[b].bVisible?d("input",this.dom.buttons[b]).attr("checked","checked"):d("input",this.dom.buttons[b]).removeAttr("checked")},_fnAddButtons:function(){for(var a,b=","+this.s.aiExclude.join(",")+",",c=0,e=this.s.dt.aoColumns.length;c<
e;c++)if(b.indexOf(","+c+",")==-1){a=this._fnDomColumnButton(c);this.dom.buttons.push(a);this.dom.collection.appendChild(a)}else this.dom.buttons.push(null);if(this.s.bRestore){a=this._fnDomRestoreButton();a.className+=" ColVis_Restore";this.dom.buttons.push(a);this.dom.collection.appendChild(a)}if(this.s.bShowAll){a=this._fnDomShowAllButton();a.className+=" ColVis_ShowAll";this.dom.buttons.push(a);this.dom.collection.appendChild(a)}},_fnDomRestoreButton:function(){var a=this,b=document.createElement("button"),
c=document.createElement("span");b.className=!this.s.dt.bJUI?"ColVis_Button TableTools_Button":"ColVis_Button TableTools_Button ui-button ui-state-default";b.appendChild(c);d(c).html('<span class="ColVis_title">'+this.s.sRestore+"</span>");d(b).click(function(){for(var e=0,g=a.s.abOriginal.length;e<g;e++)a.s.dt.oInstance.fnSetColumnVis(e,a.s.abOriginal[e],false);a._fnAdjustOpenRows();a.s.dt.oInstance.fnAdjustColumnSizing(false);a.s.dt.oInstance.fnDraw(false)});return b},_fnDomShowAllButton:function(){var a=
this,b=document.createElement("button"),c=document.createElement("span");b.className=!this.s.dt.bJUI?"ColVis_Button TableTools_Button":"ColVis_Button TableTools_Button ui-button ui-state-default";b.appendChild(c);d(c).html('<span class="ColVis_title">'+this.s.sShowAll+"</span>");d(b).click(function(){for(var e=0,g=a.s.abOriginal.length;e<g;e++)a.s.aiExclude.indexOf(e)===-1&&a.s.dt.oInstance.fnSetColumnVis(e,true,false);a._fnAdjustOpenRows();a.s.dt.oInstance.fnAdjustColumnSizing(false);a.s.dt.oInstance.fnDraw(false)});
return b},_fnDomColumnButton:function(a){var b=this,c=this.s.dt.aoColumns[a],e=document.createElement("button"),g=document.createElement("span"),f=this.s.dt;e.className=!f.bJUI?"ColVis_Button TableTools_Button":"ColVis_Button TableTools_Button ui-button ui-state-default";e.appendChild(g);c=this.s.fnLabel===null?c.sTitle:this.s.fnLabel(a,c.sTitle,c.nTh);d(g).html('<span class="ColVis_radio"><input type="checkbox"/></span><span class="ColVis_title">'+c+"</span>");d(e).click(function(h){var i=!d("input",
this).is(":checked");if(h.target.nodeName.toLowerCase()=="input")i=d("input",this).is(":checked");h=d.fn.dataTableExt.iApiIndex;d.fn.dataTableExt.iApiIndex=b._fnDataTablesApiIndex.call(b);if(f.oFeatures.bServerSide&&(f.oScroll.sX!==""||f.oScroll.sY!=="")){b.s.dt.oInstance.fnSetColumnVis(a,i,false);b.s.dt.oInstance.fnAdjustColumnSizing(false);b.s.dt.oInstance.oApi._fnScrollDraw(b.s.dt);b._fnDrawCallback()}else b.s.dt.oInstance.fnSetColumnVis(a,i);d.fn.dataTableExt.iApiIndex=h;b.s.fnStateChange!==null&&
b.s.fnStateChange.call(b,a,i)});return e},_fnDataTablesApiIndex:function(){for(var a=0,b=this.s.dt.oInstance.length;a<b;a++)if(this.s.dt.oInstance[a]==this.s.dt.nTable)return a;return 0},_fnDomBaseButton:function(a){var b=this,c=document.createElement("button"),e=document.createElement("span"),g=this.s.activate=="mouseover"?"mouseover":"click";c.className=!this.s.dt.bJUI?"ColVis_Button TableTools_Button":"ColVis_Button TableTools_Button ui-button ui-state-default";c.appendChild(e);e.innerHTML=a;d(c).bind(g,
function(f){b._fnCollectionShow();f.preventDefault()});return c},_fnDomCollection:function(){var a=document.createElement("div");a.style.display="none";a.className=!this.s.dt.bJUI?"ColVis_collection TableTools_collection":"ColVis_collection TableTools_collection ui-buttonset ui-buttonset-multi";if(!this.s.bCssPosition)a.style.position="absolute";d(a).css("opacity",0);return a},_fnDomCatcher:function(){var a=this,b=document.createElement("div");b.className="ColVis_catcher TableTools_catcher";d(b).click(function(){a._fnCollectionHide.call(a,
null,null)});return b},_fnDomBackground:function(){var a=this,b=document.createElement("div");b.style.position="absolute";b.style.left="0px";b.style.top="0px";b.className="ColVis_collectionBackground TableTools_collectionBackground";d(b).css("opacity",0);d(b).click(function(){a._fnCollectionHide.call(a,null,null)});this.s.activate=="mouseover"&&d(b).mouseover(function(){a.s.overcollection=false;a._fnCollectionHide.call(a,null,null)});return b},_fnCollectionShow:function(){var a=this,b,c;b=d(this.dom.button).offset();
var e=this.dom.collection,g=this.dom.background,f=parseInt(b.left,10),h=parseInt(b.top+d(this.dom.button).outerHeight(),10);if(!this.s.bCssPosition){e.style.top=h+"px";e.style.left=f+"px"}e.style.display="block";d(e).css("opacity",0);c=d(window).height();var i=d(document).height(),j=d(window).width();h=d(document).width();g.style.height=(c>i?c:i)+"px";g.style.width=(j<h?j:h)+"px";c=this.dom.catcher.style;c.height=d(this.dom.button).outerHeight()+"px";c.width=d(this.dom.button).outerWidth()+"px";c.top=
b.top+"px";c.left=f+"px";document.body.appendChild(g);document.body.appendChild(e);document.body.appendChild(this.dom.catcher);if(this.s.sSize=="auto"){i=[];this.dom.collection.style.width="auto";b=0;for(c=this.dom.buttons.length;b<c;b++)if(this.dom.buttons[b]!==null){this.dom.buttons[b].style.width="auto";i.push(d(this.dom.buttons[b]).outerWidth())}iMax=Math.max.apply(window,i);b=0;for(c=this.dom.buttons.length;b<c;b++)if(this.dom.buttons[b]!==null)this.dom.buttons[b].style.width=iMax+"px";this.dom.collection.style.width=
iMax+"px"}if(!this.s.bCssPosition){e.style.left=this.s.sAlign=="left"?f+"px":f-d(e).outerWidth()+d(this.dom.button).outerWidth()+"px";b=d(e).outerWidth();d(e).outerHeight();if(f+b>h)e.style.left=h-b+"px"}setTimeout(function(){d(e).animate({opacity:1},a.s.iOverlayFade);d(g).animate({opacity:0.1},a.s.iOverlayFade,"linear",function(){jQuery.browser.msie&&jQuery.browser.version=="6.0"&&a._fnDrawCallback()})},10);this.s.hidden=false},_fnCollectionHide:function(){var a=this;if(!this.s.hidden&&this.dom.collection!==
null){this.s.hidden=true;d(this.dom.collection).animate({opacity:0},a.s.iOverlayFade,function(){this.style.display="none"});d(this.dom.background).animate({opacity:0},a.s.iOverlayFade,function(){document.body.removeChild(a.dom.background);document.body.removeChild(a.dom.catcher)})}},_fnAdjustOpenRows:function(){for(var a=this.s.dt.aoOpenRows,b=this.s.dt.oApi._fnVisbleColumns(this.s.dt),c=0,e=a.length;c<e;c++)a[c].nTr.getElementsByTagName("td")[0].colSpan=b}};ColVis.fnRebuild=function(a){var b=null;
if(typeof a!="undefined")b=a.fnSettings().nTable;for(var c=0,e=ColVis.aInstances.length;c<e;c++)if(typeof a=="undefined"||b==ColVis.aInstances[c].s.dt.nTable)ColVis.aInstances[c].fnRebuild()};ColVis.aInstances=[];ColVis.prototype.CLASS="ColVis";ColVis.VERSION="1.0.8";ColVis.prototype.VERSION=ColVis.VERSION;typeof d.fn.dataTable=="function"&&typeof d.fn.dataTableExt.fnVersionCheck=="function"&&d.fn.dataTableExt.fnVersionCheck("1.7.0")?d.fn.dataTableExt.aoFeatures.push({fnInit:function(a){return(new ColVis(a,
typeof a.oInit.oColVis=="undefined"?{}:a.oInit.oColVis)).dom.wrapper},cFeature:"C",sFeature:"ColVis"}):alert("Warning: ColVis requires DataTables 1.7 or greater - www.datatables.net/download")})(jQuery);
// Simple Set Clipboard System
// Author: Joseph Huckaby

var ZeroClipboard_TableTools = {
	
	version: "1.0.4-TableTools2",
	clients: {}, // registered upload clients on page, indexed by id
	moviePath: '', // URL to movie
	nextId: 1, // ID of next movie
	
	$: function(thingy) {
		// simple DOM lookup utility function
		if (typeof(thingy) == 'string') thingy = document.getElementById(thingy);
		if (!thingy.addClass) {
			// extend element with a few useful methods
			thingy.hide = function() { this.style.display = 'none'; };
			thingy.show = function() { this.style.display = ''; };
			thingy.addClass = function(name) { this.removeClass(name); this.className += ' ' + name; };
			thingy.removeClass = function(name) {
				this.className = this.className.replace( new RegExp("\\s*" + name + "\\s*"), " ").replace(/^\s+/, '').replace(/\s+$/, '');
			};
			thingy.hasClass = function(name) {
				return !!this.className.match( new RegExp("\\s*" + name + "\\s*") );
			}
		}
		return thingy;
	},
	
	setMoviePath: function(path) {
		// set path to ZeroClipboard.swf
		this.moviePath = path;
	},
	
	dispatch: function(id, eventName, args) {
		// receive event from flash movie, send to client		
		var client = this.clients[id];
		if (client) {
			client.receiveEvent(eventName, args);
		}
	},
	
	register: function(id, client) {
		// register new client to receive events
		this.clients[id] = client;
	},
	
	getDOMObjectPosition: function(obj) {
		// get absolute coordinates for dom element
		var info = {
			left: 0, 
			top: 0, 
			width: obj.width ? obj.width : obj.offsetWidth, 
			height: obj.height ? obj.height : obj.offsetHeight
		};
		
		if ( obj.style.width != "" )
			info.width = obj.style.width.replace("px","");
		
		if ( obj.style.height != "" )
			info.height = obj.style.height.replace("px","");

		while (obj) {
			info.left += obj.offsetLeft;
			info.top += obj.offsetTop;
			obj = obj.offsetParent;
		}

		return info;
	},
	
	Client: function(elem) {
		// constructor for new simple upload client
		this.handlers = {};
		
		// unique ID
		this.id = ZeroClipboard_TableTools.nextId++;
		this.movieId = 'ZeroClipboard_TableToolsMovie_' + this.id;
		
		// register client with singleton to receive flash events
		ZeroClipboard_TableTools.register(this.id, this);
		
		// create movie
		if (elem) this.glue(elem);
	}
};

ZeroClipboard_TableTools.Client.prototype = {
	
	id: 0, // unique ID for us
	ready: false, // whether movie is ready to receive events or not
	movie: null, // reference to movie object
	clipText: '', // text to copy to clipboard
	fileName: '', // default file save name
	action: 'copy', // action to perform
	handCursorEnabled: true, // whether to show hand cursor, or default pointer cursor
	cssEffects: true, // enable CSS mouse effects on dom container
	handlers: null, // user event handlers
	sized: false,
	
	glue: function(elem, title) {
		// glue to DOM element
		// elem can be ID or actual DOM element object
		this.domElement = ZeroClipboard_TableTools.$(elem);
		
		// float just above object, or zIndex 99 if dom element isn't set
		var zIndex = 99;
		if (this.domElement.style.zIndex) {
			zIndex = parseInt(this.domElement.style.zIndex) + 1;
		}
		
		// find X/Y position of domElement
		var box = ZeroClipboard_TableTools.getDOMObjectPosition(this.domElement);
		
		// create floating DIV above element
		this.div = document.createElement('div');
		var style = this.div.style;
		style.position = 'absolute';
		style.left = '0px';
		style.top = '0px';
		style.width = (box.width) + 'px';
		style.height = box.height + 'px';
		style.zIndex = zIndex;
		
		if ( typeof title != "undefined" && title != "" ) {
			this.div.title = title;
		}
		if ( box.width != 0 && box.height != 0 ) {
			this.sized = true;
		}
		
		// style.backgroundColor = '#f00'; // debug
		if ( this.domElement ) {
			this.domElement.appendChild(this.div);
			this.div.innerHTML = this.getHTML( box.width, box.height );
		}
	},
	
	positionElement: function() {
		var box = ZeroClipboard_TableTools.getDOMObjectPosition(this.domElement);
		var style = this.div.style;
		
		style.position = 'absolute';
		//style.left = (this.domElement.offsetLeft)+'px';
		//style.top = this.domElement.offsetTop+'px';
		style.width = box.width + 'px';
		style.height = box.height + 'px';
		
		if ( box.width != 0 && box.height != 0 ) {
			this.sized = true;
		} else {
			return;
		}
		
		var flash = this.div.childNodes[0];
		flash.width = box.width;
		flash.height = box.height;
	},
	
	getHTML: function(width, height) {
		// return HTML for movie
		var html = '';
		var flashvars = 'id=' + this.id + 
			'&width=' + width + 
			'&height=' + height;
			
		if (navigator.userAgent.match(/MSIE/)) {
			// IE gets an OBJECT tag
			var protocol = location.href.match(/^https/i) ? 'https://' : 'http://';
			html += '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="'+protocol+'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,0,0,0" width="'+width+'" height="'+height+'" id="'+this.movieId+'" align="middle"><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="false" /><param name="movie" value="'+ZeroClipboard_TableTools.moviePath+'" /><param name="loop" value="false" /><param name="menu" value="false" /><param name="quality" value="best" /><param name="bgcolor" value="#ffffff" /><param name="flashvars" value="'+flashvars+'"/><param name="wmode" value="transparent"/></object>';
		}
		else {
			// all other browsers get an EMBED tag
			html += '<embed id="'+this.movieId+'" src="'+ZeroClipboard_TableTools.moviePath+'" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="'+width+'" height="'+height+'" name="'+this.movieId+'" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="'+flashvars+'" wmode="transparent" />';
		}
		return html;
	},
	
	hide: function() {
		// temporarily hide floater offscreen
		if (this.div) {
			this.div.style.left = '-2000px';
		}
	},
	
	show: function() {
		// show ourselves after a call to hide()
		this.reposition();
	},
	
	destroy: function() {
		// destroy control and floater
		if (this.domElement && this.div) {
			this.hide();
			this.div.innerHTML = '';
			
			var body = document.getElementsByTagName('body')[0];
			try { body.removeChild( this.div ); } catch(e) {;}
			
			this.domElement = null;
			this.div = null;
		}
	},
	
	reposition: function(elem) {
		// reposition our floating div, optionally to new container
		// warning: container CANNOT change size, only position
		if (elem) {
			this.domElement = ZeroClipboard_TableTools.$(elem);
			if (!this.domElement) this.hide();
		}
		
		if (this.domElement && this.div) {
			var box = ZeroClipboard_TableTools.getDOMObjectPosition(this.domElement);
			var style = this.div.style;
			style.left = '' + box.left + 'px';
			style.top = '' + box.top + 'px';
		}
	},
	
	clearText: function() {
		// clear the text to be copy / saved
		this.clipText = '';
		if (this.ready) this.movie.clearText();
	},
	
	appendText: function(newText) {
		// append text to that which is to be copied / saved
		this.clipText += newText;
		if (this.ready) { this.movie.appendText(newText) ;}
	},
	
	setText: function(newText) {
		// set text to be copied to be copied / saved
		this.clipText = newText;
		if (this.ready) { this.movie.setText(newText) ;}
	},
	
	setCharSet: function(charSet) {
		// set the character set (UTF16LE or UTF8)
		this.charSet = charSet;
		if (this.ready) { this.movie.setCharSet(charSet) ;}
	},
	
	setBomInc: function(bomInc) {
		// set if the BOM should be included or not
		this.incBom = bomInc;
		if (this.ready) { this.movie.setBomInc(bomInc) ;}
	},
	
	setFileName: function(newText) {
		// set the file name
		this.fileName = newText;
		if (this.ready) this.movie.setFileName(newText);
	},
	
	setAction: function(newText) {
		// set action (save or copy)
		this.action = newText;
		if (this.ready) this.movie.setAction(newText);
	},
	
	addEventListener: function(eventName, func) {
		// add user event listener for event
		// event types: load, queueStart, fileStart, fileComplete, queueComplete, progress, error, cancel
		eventName = eventName.toString().toLowerCase().replace(/^on/, '');
		if (!this.handlers[eventName]) this.handlers[eventName] = [];
		this.handlers[eventName].push(func);
	},
	
	setHandCursor: function(enabled) {
		// enable hand cursor (true), or default arrow cursor (false)
		this.handCursorEnabled = enabled;
		if (this.ready) this.movie.setHandCursor(enabled);
	},
	
	setCSSEffects: function(enabled) {
		// enable or disable CSS effects on DOM container
		this.cssEffects = !!enabled;
	},
	
	receiveEvent: function(eventName, args) {
		// receive event from flash
		eventName = eventName.toString().toLowerCase().replace(/^on/, '');
		
		// special behavior for certain events
		switch (eventName) {
			case 'load':
				// movie claims it is ready, but in IE this isn't always the case...
				// bug fix: Cannot extend EMBED DOM elements in Firefox, must use traditional function
				this.movie = document.getElementById(this.movieId);
				if (!this.movie) {
					var self = this;
					setTimeout( function() { self.receiveEvent('load', null); }, 1 );
					return;
				}
				
				// firefox on pc needs a "kick" in order to set these in certain cases
				if (!this.ready && navigator.userAgent.match(/Firefox/) && navigator.userAgent.match(/Windows/)) {
					var self = this;
					setTimeout( function() { self.receiveEvent('load', null); }, 100 );
					this.ready = true;
					return;
				}
				
				this.ready = true;
				this.movie.clearText();
				this.movie.appendText( this.clipText );
				this.movie.setFileName( this.fileName );
				this.movie.setAction( this.action );
				this.movie.setCharSet( this.charSet );
				this.movie.setBomInc( this.incBom );
				this.movie.setHandCursor( this.handCursorEnabled );
				break;
			
			case 'mouseover':
				if (this.domElement && this.cssEffects) {
					//this.domElement.addClass('hover');
					if (this.recoverActive) this.domElement.addClass('active');
				}
				break;
			
			case 'mouseout':
				if (this.domElement && this.cssEffects) {
					this.recoverActive = false;
					if (this.domElement.hasClass('active')) {
						this.domElement.removeClass('active');
						this.recoverActive = true;
					}
					//this.domElement.removeClass('hover');
				}
				break;
			
			case 'mousedown':
				if (this.domElement && this.cssEffects) {
					this.domElement.addClass('active');
				}
				break;
			
			case 'mouseup':
				if (this.domElement && this.cssEffects) {
					this.domElement.removeClass('active');
					this.recoverActive = false;
				}
				break;
		} // switch eventName
		
		if (this.handlers[eventName]) {
			for (var idx = 0, len = this.handlers[eventName].length; idx < len; idx++) {
				var func = this.handlers[eventName][idx];
			
				if (typeof(func) == 'function') {
					// actual function reference
					func(this, args);
				}
				else if ((typeof(func) == 'object') && (func.length == 2)) {
					// PHP style object + method, i.e. [myObject, 'myMethod']
					func[0][ func[1] ](this, args);
				}
				else if (typeof(func) == 'string') {
					// name of function
					window[func](this, args);
				}
			} // foreach event handler defined
		} // user defined handler for event
	}
	
};

// Simple Set Clipboard System
// Author: Joseph Huckaby
var ZeroClipboard_TableTools={version:"1.0.4-TableTools2",clients:{},moviePath:"",nextId:1,$:function(a){"string"==typeof a&&(a=document.getElementById(a));a.addClass||(a.hide=function(){this.style.display="none"},a.show=function(){this.style.display=""},a.addClass=function(a){this.removeClass(a);this.className+=" "+a},a.removeClass=function(a){this.className=this.className.replace(RegExp("\\s*"+a+"\\s*")," ").replace(/^\s+/,"").replace(/\s+$/,"")},a.hasClass=function(a){return!!this.className.match(RegExp("\\s*"+
a+"\\s*"))});return a},setMoviePath:function(a){this.moviePath=a},dispatch:function(a,b,c){(a=this.clients[a])&&a.receiveEvent(b,c)},register:function(a,b){this.clients[a]=b},getDOMObjectPosition:function(a){var b={left:0,top:0,width:a.width?a.width:a.offsetWidth,height:a.height?a.height:a.offsetHeight};""!=a.style.width&&(b.width=a.style.width.replace("px",""));""!=a.style.height&&(b.height=a.style.height.replace("px",""));for(;a;)b.left+=a.offsetLeft,b.top+=a.offsetTop,a=a.offsetParent;return b},
Client:function(a){this.handlers={};this.id=ZeroClipboard_TableTools.nextId++;this.movieId="ZeroClipboard_TableToolsMovie_"+this.id;ZeroClipboard_TableTools.register(this.id,this);a&&this.glue(a)}};
ZeroClipboard_TableTools.Client.prototype={id:0,ready:!1,movie:null,clipText:"",fileName:"",action:"copy",handCursorEnabled:!0,cssEffects:!0,handlers:null,sized:!1,glue:function(a,b){this.domElement=ZeroClipboard_TableTools.$(a);var c=99;this.domElement.style.zIndex&&(c=parseInt(this.domElement.style.zIndex)+1);var d=ZeroClipboard_TableTools.getDOMObjectPosition(this.domElement);this.div=document.createElement("div");var e=this.div.style;e.position="absolute";e.left="0px";e.top="0px";e.width=d.width+
"px";e.height=d.height+"px";e.zIndex=c;"undefined"!=typeof b&&""!=b&&(this.div.title=b);0!=d.width&&0!=d.height&&(this.sized=!0);this.domElement&&(this.domElement.appendChild(this.div),this.div.innerHTML=this.getHTML(d.width,d.height))},positionElement:function(){var a=ZeroClipboard_TableTools.getDOMObjectPosition(this.domElement),b=this.div.style;b.position="absolute";b.width=a.width+"px";b.height=a.height+"px";0!=a.width&&0!=a.height&&(this.sized=!0,b=this.div.childNodes[0],b.width=a.width,b.height=
a.height)},getHTML:function(a,b){var c="",d="id="+this.id+"&width="+a+"&height="+b;if(navigator.userAgent.match(/MSIE/))var e=location.href.match(/^https/i)?"https://":"http://",c=c+('<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="'+e+'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,0,0,0" width="'+a+'" height="'+b+'" id="'+this.movieId+'" align="middle"><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="false" /><param name="movie" value="'+
ZeroClipboard_TableTools.moviePath+'" /><param name="loop" value="false" /><param name="menu" value="false" /><param name="quality" value="best" /><param name="bgcolor" value="#ffffff" /><param name="flashvars" value="'+d+'"/><param name="wmode" value="transparent"/></object>');else c+='<embed id="'+this.movieId+'" src="'+ZeroClipboard_TableTools.moviePath+'" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="'+a+'" height="'+b+'" name="'+this.movieId+'" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="'+
d+'" wmode="transparent" />';return c},hide:function(){this.div&&(this.div.style.left="-2000px")},show:function(){this.reposition()},destroy:function(){if(this.domElement&&this.div){this.hide();this.div.innerHTML="";var a=document.getElementsByTagName("body")[0];try{a.removeChild(this.div)}catch(b){}this.div=this.domElement=null}},reposition:function(a){a&&((this.domElement=ZeroClipboard_TableTools.$(a))||this.hide());if(this.domElement&&this.div){var a=ZeroClipboard_TableTools.getDOMObjectPosition(this.domElement),
b=this.div.style;b.left=""+a.left+"px";b.top=""+a.top+"px"}},clearText:function(){this.clipText="";this.ready&&this.movie.clearText()},appendText:function(a){this.clipText+=a;this.ready&&this.movie.appendText(a)},setText:function(a){this.clipText=a;this.ready&&this.movie.setText(a)},setCharSet:function(a){this.charSet=a;this.ready&&this.movie.setCharSet(a)},setBomInc:function(a){this.incBom=a;this.ready&&this.movie.setBomInc(a)},setFileName:function(a){this.fileName=a;this.ready&&this.movie.setFileName(a)},
setAction:function(a){this.action=a;this.ready&&this.movie.setAction(a)},addEventListener:function(a,b){a=a.toString().toLowerCase().replace(/^on/,"");this.handlers[a]||(this.handlers[a]=[]);this.handlers[a].push(b)},setHandCursor:function(a){this.handCursorEnabled=a;this.ready&&this.movie.setHandCursor(a)},setCSSEffects:function(a){this.cssEffects=!!a},receiveEvent:function(a,b){a=a.toString().toLowerCase().replace(/^on/,"");switch(a){case "load":this.movie=document.getElementById(this.movieId);
if(!this.movie){var c=this;setTimeout(function(){c.receiveEvent("load",null)},1);return}if(!this.ready&&navigator.userAgent.match(/Firefox/)&&navigator.userAgent.match(/Windows/)){c=this;setTimeout(function(){c.receiveEvent("load",null)},100);this.ready=!0;return}this.ready=!0;this.movie.clearText();this.movie.appendText(this.clipText);this.movie.setFileName(this.fileName);this.movie.setAction(this.action);this.movie.setCharSet(this.charSet);this.movie.setBomInc(this.incBom);this.movie.setHandCursor(this.handCursorEnabled);
break;case "mouseover":this.domElement&&this.cssEffects&&this.recoverActive&&this.domElement.addClass("active");break;case "mouseout":this.domElement&&this.cssEffects&&(this.recoverActive=!1,this.domElement.hasClass("active")&&(this.domElement.removeClass("active"),this.recoverActive=!0));break;case "mousedown":this.domElement&&this.cssEffects&&this.domElement.addClass("active");break;case "mouseup":this.domElement&&this.cssEffects&&(this.domElement.removeClass("active"),this.recoverActive=!1)}if(this.handlers[a])for(var d=
0,e=this.handlers[a].length;d<e;d++){var f=this.handlers[a][d];if("function"==typeof f)f(this,b);else if("object"==typeof f&&2==f.length)f[0][f[1]](this,b);else if("string"==typeof f)window[f](this,b)}}};


/*
 * File:        TableTools.min.js
 * Version:     2.1.4
 * Author:      Allan Jardine (www.sprymedia.co.uk)
 * 
 * Copyright 2009-2012 Allan Jardine, all rights reserved.
 *
 * This source file is free software, under either the GPL v2 license or a
 * BSD (3 point) style license, as supplied with this software.
 * 
 * This source file is distributed in the hope that it will be useful, but 
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY 
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 */
var TableTools;
(function(f,n,g){TableTools=function(a,b){!this instanceof TableTools&&alert("Warning: TableTools must be initialised with the keyword 'new'");this.s={that:this,dt:a.fnSettings(),print:{saveStart:-1,saveLength:-1,saveScroll:-1,funcEnd:function(){}},buttonCounter:0,select:{type:"",selected:[],preRowSelect:null,postSelected:null,postDeselected:null,all:!1,selectedClass:""},custom:{},swfPath:"",buttonSet:[],master:!1,tags:{}};this.dom={container:null,table:null,print:{hidden:[],message:null},collection:{collection:null,
background:null}};this.classes=f.extend(!0,{},TableTools.classes);this.s.dt.bJUI&&f.extend(!0,this.classes,TableTools.classes_themeroller);this.fnSettings=function(){return this.s};"undefined"==typeof b&&(b={});this._fnConstruct(b);return this};TableTools.prototype={fnGetSelected:function(a){var b=[],c=this.s.dt.aoData,d=this.s.dt.aiDisplay,e;if(a){a=0;for(e=d.length;a<e;a++)c[d[a]]._DTTT_selected&&b.push(c[d[a]].nTr)}else{a=0;for(e=c.length;a<e;a++)c[a]._DTTT_selected&&b.push(c[a].nTr)}return b},
fnGetSelectedData:function(){var a=[],b=this.s.dt.aoData,c,d;c=0;for(d=b.length;c<d;c++)b[c]._DTTT_selected&&a.push(this.s.dt.oInstance.fnGetData(c));return a},fnIsSelected:function(a){a=this.s.dt.oInstance.fnGetPosition(a);return!0===this.s.dt.aoData[a]._DTTT_selected?!0:!1},fnSelectAll:function(a){var b=this._fnGetMasterSettings();this._fnRowSelect(!0===a?b.dt.aiDisplay:b.dt.aoData)},fnSelectNone:function(a){this._fnGetMasterSettings();this._fnRowDeselect(this.fnGetSelected(a))},fnSelect:function(a){"single"==
this.s.select.type?(this.fnSelectNone(),this._fnRowSelect(a)):"multi"==this.s.select.type&&this._fnRowSelect(a)},fnDeselect:function(a){this._fnRowDeselect(a)},fnGetTitle:function(a){var b="";"undefined"!=typeof a.sTitle&&""!==a.sTitle?b=a.sTitle:(a=g.getElementsByTagName("title"),0<a.length&&(b=a[0].innerHTML));return 4>"\u00a1".toString().length?b.replace(/[^a-zA-Z0-9_\u00A1-\uFFFF\.,\-_ !\(\)]/g,""):b.replace(/[^a-zA-Z0-9_\.,\-_ !\(\)]/g,"")},fnCalcColRatios:function(a){var b=this.s.dt.aoColumns,
a=this._fnColumnTargets(a.mColumns),c=[],d=0,e=0,f,g;f=0;for(g=a.length;f<g;f++)a[f]&&(d=b[f].nTh.offsetWidth,e+=d,c.push(d));f=0;for(g=c.length;f<g;f++)c[f]/=e;return c.join("\t")},fnGetTableData:function(a){if(this.s.dt)return this._fnGetDataTablesData(a)},fnSetText:function(a,b){this._fnFlashSetText(a,b)},fnResizeButtons:function(){for(var a in ZeroClipboard_TableTools.clients)if(a){var b=ZeroClipboard_TableTools.clients[a];"undefined"!=typeof b.domElement&&b.domElement.parentNode&&b.positionElement()}},
fnResizeRequired:function(){for(var a in ZeroClipboard_TableTools.clients)if(a){var b=ZeroClipboard_TableTools.clients[a];if("undefined"!=typeof b.domElement&&b.domElement.parentNode==this.dom.container&&!1===b.sized)return!0}return!1},fnPrint:function(a,b){void 0===b&&(b={});void 0===a||a?this._fnPrintStart(b):this._fnPrintEnd()},fnInfo:function(a,b){var c=g.createElement("div");c.className=this.classes.print.info;c.innerHTML=a;g.body.appendChild(c);setTimeout(function(){f(c).fadeOut("normal",function(){g.body.removeChild(c)})},
b)},_fnConstruct:function(a){var b=this;this._fnCustomiseSettings(a);this.dom.container=g.createElement(this.s.tags.container);this.dom.container.className=this.classes.container;"none"!=this.s.select.type&&this._fnRowSelectConfig();this._fnButtonDefinations(this.s.buttonSet,this.dom.container);this.s.dt.aoDestroyCallback.push({sName:"TableTools",fn:function(){b.dom.container.innerHTML=""}})},_fnCustomiseSettings:function(a){"undefined"==typeof this.s.dt._TableToolsInit&&(this.s.master=!0,this.s.dt._TableToolsInit=
!0);this.dom.table=this.s.dt.nTable;this.s.custom=f.extend({},TableTools.DEFAULTS,a);this.s.swfPath=this.s.custom.sSwfPath;"undefined"!=typeof ZeroClipboard_TableTools&&(ZeroClipboard_TableTools.moviePath=this.s.swfPath);this.s.select.type=this.s.custom.sRowSelect;this.s.select.preRowSelect=this.s.custom.fnPreRowSelect;this.s.select.postSelected=this.s.custom.fnRowSelected;this.s.select.postDeselected=this.s.custom.fnRowDeselected;this.s.custom.sSelectedClass&&(this.classes.select.row=this.s.custom.sSelectedClass);
this.s.tags=this.s.custom.oTags;this.s.buttonSet=this.s.custom.aButtons},_fnButtonDefinations:function(a,b){for(var c,d=0,e=a.length;d<e;d++){if("string"==typeof a[d]){if("undefined"==typeof TableTools.BUTTONS[a[d]]){alert("TableTools: Warning - unknown button type: "+a[d]);continue}c=f.extend({},TableTools.BUTTONS[a[d]],!0)}else{if("undefined"==typeof TableTools.BUTTONS[a[d].sExtends]){alert("TableTools: Warning - unknown button type: "+a[d].sExtends);continue}c=f.extend({},TableTools.BUTTONS[a[d].sExtends],
!0);c=f.extend(c,a[d],!0)}b.appendChild(this._fnCreateButton(c,f(b).hasClass(this.classes.collection.container)))}},_fnCreateButton:function(a,b){var c=this._fnButtonBase(a,b);a.sAction.match(/flash/)?this._fnFlashConfig(c,a):"text"==a.sAction?this._fnTextConfig(c,a):"div"==a.sAction?this._fnTextConfig(c,a):"collection"==a.sAction&&(this._fnTextConfig(c,a),this._fnCollectionConfig(c,a));return c},_fnButtonBase:function(a,b){var c,d,e;b?(c="default"!==a.sTag?a.sTag:this.s.tags.collection.button,d=
"default"!==a.sLinerTag?a.sLiner:this.s.tags.collection.liner,e=this.classes.collection.buttons.normal):(c="default"!==a.sTag?a.sTag:this.s.tags.button,d="default"!==a.sLinerTag?a.sLiner:this.s.tags.liner,e=this.classes.buttons.normal);c=g.createElement(c);d=g.createElement(d);var f=this._fnGetMasterSettings();c.className=e+" "+a.sButtonClass;c.setAttribute("id","ToolTables_"+this.s.dt.sInstance+"_"+f.buttonCounter);c.appendChild(d);d.innerHTML=a.sButtonText;f.buttonCounter++;return c},_fnGetMasterSettings:function(){if(this.s.master)return this.s;
for(var a=TableTools._aInstances,b=0,c=a.length;b<c;b++)if(this.dom.table==a[b].s.dt.nTable)return a[b].s},_fnCollectionConfig:function(a,b){var c=g.createElement(this.s.tags.collection.container);c.style.display="none";c.className=this.classes.collection.container;b._collection=c;g.body.appendChild(c);this._fnButtonDefinations(b.aButtons,c)},_fnCollectionShow:function(a,b){var c=this,d=f(a).offset(),e=b._collection,j=d.left,d=d.top+f(a).outerHeight(),m=f(n).height(),h=f(g).height(),k=f(n).width(),
o=f(g).width();e.style.position="absolute";e.style.left=j+"px";e.style.top=d+"px";e.style.display="block";f(e).css("opacity",0);var l=g.createElement("div");l.style.position="absolute";l.style.left="0px";l.style.top="0px";l.style.height=(m>h?m:h)+"px";l.style.width=(k>o?k:o)+"px";l.className=this.classes.collection.background;f(l).css("opacity",0);g.body.appendChild(l);g.body.appendChild(e);m=f(e).outerWidth();k=f(e).outerHeight();j+m>o&&(e.style.left=o-m+"px");d+k>h&&(e.style.top=d-k-f(a).outerHeight()+
"px");this.dom.collection.collection=e;this.dom.collection.background=l;setTimeout(function(){f(e).animate({opacity:1},500);f(l).animate({opacity:0.25},500)},10);this.fnResizeButtons();f(l).click(function(){c._fnCollectionHide.call(c,null,null)})},_fnCollectionHide:function(a,b){!(null!==b&&"collection"==b.sExtends)&&null!==this.dom.collection.collection&&(f(this.dom.collection.collection).animate({opacity:0},500,function(){this.style.display="none"}),f(this.dom.collection.background).animate({opacity:0},
500,function(){this.parentNode.removeChild(this)}),this.dom.collection.collection=null,this.dom.collection.background=null)},_fnRowSelectConfig:function(){if(this.s.master){var a=this,b=this.s.dt;f(b.nTable).addClass(this.classes.select.table);f("tr",b.nTBody).live("click",function(c){this.parentNode==b.nTBody&&null!==b.oInstance.fnGetData(this)&&(a.fnIsSelected(this)?a._fnRowDeselect(this,c):"single"==a.s.select.type?(a.fnSelectNone(),a._fnRowSelect(this,c)):"multi"==a.s.select.type&&a._fnRowSelect(this,
c))});b.oApi._fnCallbackReg(b,"aoRowCreatedCallback",function(c,d,e){b.aoData[e]._DTTT_selected&&f(c).addClass(a.classes.select.row)},"TableTools-SelectAll")}},_fnRowSelect:function(a,b){var c=this._fnSelectData(a),d=[],e,j;e=0;for(j=c.length;e<j;e++)c[e].nTr&&d.push(c[e].nTr);if(null===this.s.select.preRowSelect||this.s.select.preRowSelect.call(this,b,d,!0)){e=0;for(j=c.length;e<j;e++)c[e]._DTTT_selected=!0,c[e].nTr&&f(c[e].nTr).addClass(this.classes.select.row);null!==this.s.select.postSelected&&
this.s.select.postSelected.call(this,d);TableTools._fnEventDispatch(this,"select",d,!0)}},_fnRowDeselect:function(a,b){var c=this._fnSelectData(a),d=[],e,j;e=0;for(j=c.length;e<j;e++)c[e].nTr&&d.push(c[e].nTr);if(null===this.s.select.preRowSelect||this.s.select.preRowSelect.call(this,b,d,!1)){e=0;for(j=c.length;e<j;e++)c[e]._DTTT_selected=!1,c[e].nTr&&f(c[e].nTr).removeClass(this.classes.select.row);null!==this.s.select.postDeselected&&this.s.select.postDeselected.call(this,d);TableTools._fnEventDispatch(this,
"select",d,!1)}},_fnSelectData:function(a){var b=[],c,d,e;if(a.nodeName)c=this.s.dt.oInstance.fnGetPosition(a),b.push(this.s.dt.aoData[c]);else if("undefined"!==typeof a.length){d=0;for(e=a.length;d<e;d++)a[d].nodeName?(c=this.s.dt.oInstance.fnGetPosition(a[d]),b.push(this.s.dt.aoData[c])):"number"===typeof a[d]?b.push(this.s.dt.aoData[a[d]]):b.push(a[d])}else b.push(a);return b},_fnTextConfig:function(a,b){var c=this;null!==b.fnInit&&b.fnInit.call(this,a,b);""!==b.sToolTip&&(a.title=b.sToolTip);
f(a).hover(function(){b.fnMouseover!==null&&b.fnMouseover.call(this,a,b,null)},function(){b.fnMouseout!==null&&b.fnMouseout.call(this,a,b,null)});null!==b.fnSelect&&TableTools._fnEventListen(this,"select",function(d){b.fnSelect.call(c,a,b,d)});f(a).click(function(){b.fnClick!==null&&b.fnClick.call(c,a,b,null);b.fnComplete!==null&&b.fnComplete.call(c,a,b,null,null);c._fnCollectionHide(a,b)})},_fnFlashConfig:function(a,b){var c=this,d=new ZeroClipboard_TableTools.Client;null!==b.fnInit&&b.fnInit.call(this,
a,b);d.setHandCursor(!0);"flash_save"==b.sAction?(d.setAction("save"),d.setCharSet("utf16le"==b.sCharSet?"UTF16LE":"UTF8"),d.setBomInc(b.bBomInc),d.setFileName(b.sFileName.replace("*",this.fnGetTitle(b)))):"flash_pdf"==b.sAction?(d.setAction("pdf"),d.setFileName(b.sFileName.replace("*",this.fnGetTitle(b)))):d.setAction("copy");d.addEventListener("mouseOver",function(){b.fnMouseover!==null&&b.fnMouseover.call(c,a,b,d)});d.addEventListener("mouseOut",function(){b.fnMouseout!==null&&b.fnMouseout.call(c,
a,b,d)});d.addEventListener("mouseDown",function(){b.fnClick!==null&&b.fnClick.call(c,a,b,d)});d.addEventListener("complete",function(e,f){b.fnComplete!==null&&b.fnComplete.call(c,a,b,d,f);c._fnCollectionHide(a,b)});this._fnFlashGlue(d,a,b.sToolTip)},_fnFlashGlue:function(a,b,c){var d=this,e=b.getAttribute("id");g.getElementById(e)?a.glue(b,c):setTimeout(function(){d._fnFlashGlue(a,b,c)},100)},_fnFlashSetText:function(a,b){var c=this._fnChunkData(b,8192);a.clearText();for(var d=0,e=c.length;d<e;d++)a.appendText(c[d])},
_fnColumnTargets:function(a){var b=[],c=this.s.dt;if("object"==typeof a){i=0;for(iLen=c.aoColumns.length;i<iLen;i++)b.push(!1);i=0;for(iLen=a.length;i<iLen;i++)b[a[i]]=!0}else if("visible"==a){i=0;for(iLen=c.aoColumns.length;i<iLen;i++)b.push(c.aoColumns[i].bVisible?!0:!1)}else if("hidden"==a){i=0;for(iLen=c.aoColumns.length;i<iLen;i++)b.push(c.aoColumns[i].bVisible?!1:!0)}else if("sortable"==a){i=0;for(iLen=c.aoColumns.length;i<iLen;i++)b.push(c.aoColumns[i].bSortable?!0:!1)}else{i=0;for(iLen=c.aoColumns.length;i<
iLen;i++)b.push(!0)}return b},_fnNewline:function(a){return"auto"==a.sNewLine?navigator.userAgent.match(/Windows/)?"\r\n":"\n":a.sNewLine},_fnGetDataTablesData:function(a){var b,c,d,e,j,g=[],h="",k=this.s.dt,o,l=RegExp(a.sFieldBoundary,"g"),n=this._fnColumnTargets(a.mColumns);d="undefined"!=typeof a.bSelectedOnly?a.bSelectedOnly:!1;if(a.bHeader){j=[];b=0;for(c=k.aoColumns.length;b<c;b++)n[b]&&(h=k.aoColumns[b].sTitle.replace(/\n/g," ").replace(/<.*?>/g,"").replace(/^\s+|\s+$/g,""),h=this._fnHtmlDecode(h),
j.push(this._fnBoundData(h,a.sFieldBoundary,l)));g.push(j.join(a.sFieldSeperator))}var p=k.aiDisplay;e=this.fnGetSelected();if("none"!==this.s.select.type&&d&&0!==e.length){p=[];b=0;for(c=e.length;b<c;b++)p.push(k.oInstance.fnGetPosition(e[b]))}d=0;for(e=p.length;d<e;d++){o=k.aoData[p[d]].nTr;j=[];b=0;for(c=k.aoColumns.length;b<c;b++)n[b]&&(h=k.oApi._fnGetCellData(k,p[d],b,"display"),a.fnCellRender?h=a.fnCellRender(h,b,o,p[d])+"":"string"==typeof h?(h=h.replace(/\n/g," "),h=h.replace(/<img.*?\s+alt\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s>]+)).*?>/gi,
"$1$2$3"),h=h.replace(/<.*?>/g,"")):h+="",h=h.replace(/^\s+/,"").replace(/\s+$/,""),h=this._fnHtmlDecode(h),j.push(this._fnBoundData(h,a.sFieldBoundary,l)));g.push(j.join(a.sFieldSeperator));a.bOpenRows&&(b=f.grep(k.aoOpenRows,function(a){return a.nParent===o}),1===b.length&&(h=this._fnBoundData(f("td",b[0].nTr).html(),a.sFieldBoundary,l),g.push(h)))}if(a.bFooter&&null!==k.nTFoot){j=[];b=0;for(c=k.aoColumns.length;b<c;b++)n[b]&&null!==k.aoColumns[b].nTf&&(h=k.aoColumns[b].nTf.innerHTML.replace(/\n/g,
" ").replace(/<.*?>/g,""),h=this._fnHtmlDecode(h),j.push(this._fnBoundData(h,a.sFieldBoundary,l)));g.push(j.join(a.sFieldSeperator))}return _sLastData=g.join(this._fnNewline(a))},_fnBoundData:function(a,b,c){return""===b?a:b+a.replace(c,b+b)+b},_fnChunkData:function(a,b){for(var c=[],d=a.length,e=0;e<d;e+=b)e+b<d?c.push(a.substring(e,e+b)):c.push(a.substring(e,d));return c},_fnHtmlDecode:function(a){if(-1===a.indexOf("&"))return a;var b=g.createElement("div");return a.replace(/&([^\s]*);/g,function(a,
d){if("#"===a.substr(1,1))return String.fromCharCode(Number(d.substr(1)));b.innerHTML=a;return b.childNodes[0].nodeValue})},_fnPrintStart:function(a){var b=this,c=this.s.dt;this._fnPrintHideNodes(c.nTable);this.s.print.saveStart=c._iDisplayStart;this.s.print.saveLength=c._iDisplayLength;a.bShowAll&&(c._iDisplayStart=0,c._iDisplayLength=-1,c.oApi._fnCalculateEnd(c),c.oApi._fnDraw(c));if(""!==c.oScroll.sX||""!==c.oScroll.sY)this._fnPrintScrollStart(c),f(this.s.dt.nTable).bind("draw.DTTT_Print",function(){b._fnPrintScrollStart(c)});
var d=c.aanFeatures,e;for(e in d)if("i"!=e&&"t"!=e&&1==e.length)for(var j=0,m=d[e].length;j<m;j++)this.dom.print.hidden.push({node:d[e][j],display:"block"}),d[e][j].style.display="none";f(g.body).addClass(this.classes.print.body);""!==a.sInfo&&this.fnInfo(a.sInfo,3E3);a.sMessage&&(this.dom.print.message=g.createElement("div"),this.dom.print.message.className=this.classes.print.message,this.dom.print.message.innerHTML=a.sMessage,g.body.insertBefore(this.dom.print.message,g.body.childNodes[0]));this.s.print.saveScroll=
f(n).scrollTop();n.scrollTo(0,0);f(g).bind("keydown.DTTT",function(a){if(a.keyCode==27){a.preventDefault();b._fnPrintEnd.call(b,a)}})},_fnPrintEnd:function(){var a=this.s.dt,b=this.s.print,c=this.dom.print;this._fnPrintShowNodes();if(""!==a.oScroll.sX||""!==a.oScroll.sY)f(this.s.dt.nTable).unbind("draw.DTTT_Print"),this._fnPrintScrollEnd();n.scrollTo(0,b.saveScroll);null!==c.message&&(g.body.removeChild(c.message),c.message=null);f(g.body).removeClass("DTTT_Print");a._iDisplayStart=b.saveStart;a._iDisplayLength=
b.saveLength;a.oApi._fnCalculateEnd(a);a.oApi._fnDraw(a);f(g).unbind("keydown.DTTT")},_fnPrintScrollStart:function(){var a=this.s.dt;a.nScrollHead.getElementsByTagName("div")[0].getElementsByTagName("table");var b=a.nTable.parentNode,c=a.nTable.getElementsByTagName("thead");0<c.length&&a.nTable.removeChild(c[0]);null!==a.nTFoot&&(c=a.nTable.getElementsByTagName("tfoot"),0<c.length&&a.nTable.removeChild(c[0]));c=a.nTHead.cloneNode(!0);a.nTable.insertBefore(c,a.nTable.childNodes[0]);null!==a.nTFoot&&
(c=a.nTFoot.cloneNode(!0),a.nTable.insertBefore(c,a.nTable.childNodes[1]));""!==a.oScroll.sX&&(a.nTable.style.width=f(a.nTable).outerWidth()+"px",b.style.width=f(a.nTable).outerWidth()+"px",b.style.overflow="visible");""!==a.oScroll.sY&&(b.style.height=f(a.nTable).outerHeight()+"px",b.style.overflow="visible")},_fnPrintScrollEnd:function(){var a=this.s.dt,b=a.nTable.parentNode;""!==a.oScroll.sX&&(b.style.width=a.oApi._fnStringToCss(a.oScroll.sX),b.style.overflow="auto");""!==a.oScroll.sY&&(b.style.height=
a.oApi._fnStringToCss(a.oScroll.sY),b.style.overflow="auto")},_fnPrintShowNodes:function(){for(var a=this.dom.print.hidden,b=0,c=a.length;b<c;b++)a[b].node.style.display=a[b].display;a.splice(0,a.length)},_fnPrintHideNodes:function(a){for(var b=this.dom.print.hidden,c=a.parentNode,d=c.childNodes,e=0,g=d.length;e<g;e++)if(d[e]!=a&&1==d[e].nodeType){var m=f(d[e]).css("display");"none"!=m&&(b.push({node:d[e],display:m}),d[e].style.display="none")}"BODY"!=c.nodeName&&this._fnPrintHideNodes(c)}};TableTools._aInstances=
[];TableTools._aListeners=[];TableTools.fnGetMasters=function(){for(var a=[],b=0,c=TableTools._aInstances.length;b<c;b++)TableTools._aInstances[b].s.master&&a.push(TableTools._aInstances[b]);return a};TableTools.fnGetInstance=function(a){"object"!=typeof a&&(a=g.getElementById(a));for(var b=0,c=TableTools._aInstances.length;b<c;b++)if(TableTools._aInstances[b].s.master&&TableTools._aInstances[b].dom.table==a)return TableTools._aInstances[b];return null};TableTools._fnEventListen=function(a,b,c){TableTools._aListeners.push({that:a,
type:b,fn:c})};TableTools._fnEventDispatch=function(a,b,c,d){for(var e=TableTools._aListeners,f=0,g=e.length;f<g;f++)a.dom.table==e[f].that.dom.table&&e[f].type==b&&e[f].fn(c,d)};TableTools.buttonBase={sAction:"text",sTag:"default",sLinerTag:"default",sButtonClass:"DTTT_button_text",sButtonText:"Button text",sTitle:"",sToolTip:"",sCharSet:"utf8",bBomInc:!1,sFileName:"*.csv",sFieldBoundary:"",sFieldSeperator:"\t",sNewLine:"auto",mColumns:"all",bHeader:!0,bFooter:!0,bOpenRows:!1,bSelectedOnly:!1,fnMouseover:null,
fnMouseout:null,fnClick:null,fnSelect:null,fnComplete:null,fnInit:null,fnCellRender:null};TableTools.BUTTONS={csv:f.extend({},TableTools.buttonBase,{sAction:"flash_save",sButtonClass:"DTTT_button_csv",sButtonText:"CSV",sFieldBoundary:'"',sFieldSeperator:",",fnClick:function(a,b,c){this.fnSetText(c,this.fnGetTableData(b))}}),xls:f.extend({},TableTools.buttonBase,{sAction:"flash_save",sCharSet:"utf16le",bBomInc:!0,sButtonClass:"DTTT_button_xls",sButtonText:"Excel",fnClick:function(a,b,c){this.fnSetText(c,
this.fnGetTableData(b))}}),copy:f.extend({},TableTools.buttonBase,{sAction:"flash_copy",sButtonClass:"DTTT_button_copy",sButtonText:"Copy",fnClick:function(a,b,c){this.fnSetText(c,this.fnGetTableData(b))},fnComplete:function(a,b,c,d){a=d.split("\n").length;a=null===this.s.dt.nTFoot?a-1:a-2;this.fnInfo("<h6>Table copied</h6><p>Copied "+a+" row"+(1==a?"":"s")+" to the clipboard.</p>",1500)}}),pdf:f.extend({},TableTools.buttonBase,{sAction:"flash_pdf",sNewLine:"\n",sFileName:"*.pdf",sButtonClass:"DTTT_button_pdf",
sButtonText:"PDF",sPdfOrientation:"portrait",sPdfSize:"A4",sPdfMessage:"",fnClick:function(a,b,c){this.fnSetText(c,"title:"+this.fnGetTitle(b)+"\nmessage:"+b.sPdfMessage+"\ncolWidth:"+this.fnCalcColRatios(b)+"\norientation:"+b.sPdfOrientation+"\nsize:"+b.sPdfSize+"\n--/TableToolsOpts--\n"+this.fnGetTableData(b))}}),print:f.extend({},TableTools.buttonBase,{sInfo:"<h6>Print view</h6><p>Please use your browser's print function to print this table. Press escape when finished.",sMessage:null,bShowAll:!0,
sToolTip:"View print view",sButtonClass:"DTTT_button_print",sButtonText:"Print",fnClick:function(a,b){this.fnPrint(!0,b)}}),text:f.extend({},TableTools.buttonBase),select:f.extend({},TableTools.buttonBase,{sButtonText:"Select button",fnSelect:function(a){0!==this.fnGetSelected().length?f(a).removeClass(this.classes.buttons.disabled):f(a).addClass(this.classes.buttons.disabled)},fnInit:function(a){f(a).addClass(this.classes.buttons.disabled)}}),select_single:f.extend({},TableTools.buttonBase,{sButtonText:"Select button",
fnSelect:function(a){1==this.fnGetSelected().length?f(a).removeClass(this.classes.buttons.disabled):f(a).addClass(this.classes.buttons.disabled)},fnInit:function(a){f(a).addClass(this.classes.buttons.disabled)}}),select_all:f.extend({},TableTools.buttonBase,{sButtonText:"Select all",fnClick:function(){this.fnSelectAll()},fnSelect:function(a){this.fnGetSelected().length==this.s.dt.fnRecordsDisplay()?f(a).addClass(this.classes.buttons.disabled):f(a).removeClass(this.classes.buttons.disabled)}}),select_none:f.extend({},
TableTools.buttonBase,{sButtonText:"Deselect all",fnClick:function(){this.fnSelectNone()},fnSelect:function(a){0!==this.fnGetSelected().length?f(a).removeClass(this.classes.buttons.disabled):f(a).addClass(this.classes.buttons.disabled)},fnInit:function(a){f(a).addClass(this.classes.buttons.disabled)}}),ajax:f.extend({},TableTools.buttonBase,{sAjaxUrl:"/xhr.php",sButtonText:"Ajax button",fnClick:function(a,b){var c=this.fnGetTableData(b);f.ajax({url:b.sAjaxUrl,data:[{name:"tableData",value:c}],success:b.fnAjaxComplete,
dataType:"json",type:"POST",cache:!1,error:function(){alert("Error detected when sending table data to server")}})},fnAjaxComplete:function(){alert("Ajax complete")}}),div:f.extend({},TableTools.buttonBase,{sAction:"div",sTag:"div",sButtonClass:"DTTT_nonbutton",sButtonText:"Text button"}),collection:f.extend({},TableTools.buttonBase,{sAction:"collection",sButtonClass:"DTTT_button_collection",sButtonText:"Collection",fnClick:function(a,b){this._fnCollectionShow(a,b)}})};TableTools.classes={container:"DTTT_container",
buttons:{normal:"DTTT_button",disabled:"DTTT_disabled"},collection:{container:"DTTT_collection",background:"DTTT_collection_background",buttons:{normal:"DTTT_button",disabled:"DTTT_disabled"}},select:{table:"DTTT_selectable",row:"DTTT_selected"},print:{body:"DTTT_Print",info:"DTTT_print_info",message:"DTTT_PrintMessage"}};TableTools.classes_themeroller={container:"DTTT_container ui-buttonset ui-buttonset-multi",buttons:{normal:"DTTT_button ui-button ui-state-default"},collection:{container:"DTTT_collection ui-buttonset ui-buttonset-multi"}};
TableTools.DEFAULTS={sSwfPath:"media/swf/copy_csv_xls_pdf.swf",sRowSelect:"none",sSelectedClass:null,fnPreRowSelect:null,fnRowSelected:null,fnRowDeselected:null,aButtons:["copy","csv","xls","pdf","print"],oTags:{container:"div",button:"a",liner:"span",collection:{container:"div",button:"a",liner:"span"}}};TableTools.prototype.CLASS="TableTools";TableTools.VERSION="2.1.4";TableTools.prototype.VERSION=TableTools.VERSION;"function"==typeof f.fn.dataTable&&"function"==typeof f.fn.dataTableExt.fnVersionCheck&&
f.fn.dataTableExt.fnVersionCheck("1.9.0")?f.fn.dataTableExt.aoFeatures.push({fnInit:function(a){a=new TableTools(a.oInstance,"undefined"!=typeof a.oInit.oTableTools?a.oInit.oTableTools:{});TableTools._aInstances.push(a);return a.dom.container},cFeature:"T",sFeature:"TableTools"}):alert("Warning: TableTools 2 requires DataTables 1.9.0 or newer - www.datatables.net/download");f.fn.DataTable.TableTools=TableTools})(jQuery,window,document);

/* Set the defaults for DataTables initialisation */
$.extend( true, $.fn.dataTable.defaults, {
	"sDom": "<'dt-top-row'lf>r<'dt-wrapper't><'dt-row dt-bottom-row'<'row'<'col-sm-6'i><'col-sm-6 text-right'p>",
	"sPaginationType": "bootstrap",
	"oLanguage": {
		"sLengthMenu": "_MENU_",
		"sSearch": "_INPUT_"
	}
} );


/* Default class modification */
$.extend( $.fn.dataTableExt.oStdClasses, {
	"sWrapper": "dataTables_wrapper form-inline"
} );


/* API method to get paging information */
$.fn.dataTableExt.oApi.fnPagingInfo = function ( oSettings )
{
	return {
		"iStart":         oSettings._iDisplayStart,
		"iEnd":           oSettings.fnDisplayEnd(),
		"iLength":        oSettings._iDisplayLength,
		"iTotal":         oSettings.fnRecordsTotal(),
		"iFilteredTotal": oSettings.fnRecordsDisplay(),
		"iPage":          oSettings._iDisplayLength === -1 ? 0 : Math.ceil( oSettings._iDisplayStart / oSettings._iDisplayLength ),
		"iTotalPages":    oSettings._iDisplayLength === -1 ? 0 : Math.ceil( oSettings.fnRecordsDisplay() / oSettings._iDisplayLength )
	};
};


/* Bootstrap style pagination control */
$.extend( $.fn.dataTableExt.oPagination, {
	"bootstrap": {
		"fnInit": function( oSettings, nPaging, fnDraw ) {
			var oLang = oSettings.oLanguage.oPaginate;
			var fnClickHandler = function ( e ) {
				e.preventDefault();
				if ( oSettings.oApi._fnPageChange(oSettings, e.data.action) ) {
					fnDraw( oSettings );
				}
			};

			$(nPaging).append(
				'<ul class="pagination">'+
					'<li class="prev disabled"><a href="#">'+oLang.sPrevious+'</a></li>'+
					'<li class="next disabled"><a href="#">'+oLang.sNext+'</a></li>'+
				'</ul>'
			);
			var els = $('a', nPaging);
			$(els[0]).bind( 'click.DT', { action: "previous" }, fnClickHandler );
			$(els[1]).bind( 'click.DT', { action: "next" }, fnClickHandler );
		},

		"fnUpdate": function ( oSettings, fnDraw ) {
			var iListLength = 5;
			var oPaging = oSettings.oInstance.fnPagingInfo();
			var an = oSettings.aanFeatures.p;
			var i, ien, j, sClass, iStart, iEnd, iHalf=Math.floor(iListLength/2);

			if ( oPaging.iTotalPages < iListLength) {
				iStart = 1;
				iEnd = oPaging.iTotalPages;
			}
			else if ( oPaging.iPage <= iHalf ) {
				iStart = 1;
				iEnd = iListLength;
			} else if ( oPaging.iPage >= (oPaging.iTotalPages-iHalf) ) {
				iStart = oPaging.iTotalPages - iListLength + 1;
				iEnd = oPaging.iTotalPages;
			} else {
				iStart = oPaging.iPage - iHalf + 1;
				iEnd = iStart + iListLength - 1;
			}

			for ( i=0, ien=an.length ; i<ien ; i++ ) {
				// Remove the middle elements
				$('li:gt(0)', an[i]).filter(':not(:last)').remove();

				// Add the new list items and their event handlers
				for ( j=iStart ; j<=iEnd ; j++ ) {
					sClass = (j==oPaging.iPage+1) ? 'class="active"' : '';
					$('<li '+sClass+'><a href="#">'+j+'</a></li>')
						.insertBefore( $('li:last', an[i])[0] )
						.bind('click', function (e) {
							e.preventDefault();
							oSettings._iDisplayStart = (parseInt($('a', this).text(),10)-1) * oPaging.iLength;
							fnDraw( oSettings );
						} );
				}

				// Add / remove disabled classes from the static elements
				if ( oPaging.iPage === 0 ) {
					$('li:first', an[i]).addClass('disabled');
				} else {
					$('li:first', an[i]).removeClass('disabled');
				}

				if ( oPaging.iPage === oPaging.iTotalPages-1 || oPaging.iTotalPages === 0 ) {
					$('li:last', an[i]).addClass('disabled');
				} else {
					$('li:last', an[i]).removeClass('disabled');
				}
			}
		}
	}
} );


/* Bootstrap style pagination control */
$.extend( $.fn.dataTableExt.oPagination, {
	"bootstrap_full": {
		"fnInit": function( oSettings, nPaging, fnDraw ) {
			var oLang = oSettings.oLanguage.oPaginate;
			var fnClickHandler = function ( e ) {
				e.preventDefault();
				if ( oSettings.oApi._fnPageChange(oSettings, e.data.action) ) {
					fnDraw( oSettings );
				}
			};

			$(nPaging).append(
				'<ul class="pagination">'+
					'<li class="first disabled"><a href="#">'+oLang.sFirst+'</a></li>'+
					'<li class="prev disabled"><a href="#">'+oLang.sPrevious+'</a></li>'+
					'<li class="next disabled"><a href="#">'+oLang.sNext+'</a></li>'+
					'<li class="last disabled"><a href="#">'+oLang.sLast+'</a></li>'+
				'</ul>'
			);
			var els = $('a', nPaging);
			$(els[0]).bind( 'click.DT', { action: "first" }, fnClickHandler );
			$(els[1]).bind( 'click.DT', { action: "previous" }, fnClickHandler );
			$(els[2]).bind( 'click.DT', { action: "next" }, fnClickHandler );
			$(els[3]).bind( 'click.DT', { action: "last" }, fnClickHandler );
		},

		"fnUpdate": function ( oSettings, fnDraw ) {
			var iListLength = 5;
			var oPaging = oSettings.oInstance.fnPagingInfo();
			var an = oSettings.aanFeatures.p;
			var i, j, sClass, iStart, iEnd, iHalf=Math.floor(iListLength/2);

			if ( oPaging.iTotalPages < iListLength) {
				iStart = 1;
				iEnd = oPaging.iTotalPages;
			}
			else if ( oPaging.iPage <= iHalf ) {
				iStart = 1;
				iEnd = iListLength;
			} else if ( oPaging.iPage >= (oPaging.iTotalPages-iHalf) ) {
				iStart = oPaging.iTotalPages - iListLength + 1;
				iEnd = oPaging.iTotalPages;
			} else {
				iStart = oPaging.iPage - iHalf + 1;
				iEnd = iStart + iListLength - 1;
			}

			for ( i=0, iLen=an.length ; i<iLen ; i++ ) {
				// Remove the middle elements
				$('li', an[i]).filter(":not(.first)").filter(":not(.last)").filter(":not(.prev)").filter(":not(.next)").remove();

				// Add the new list items and their event handlers
				for ( j=iStart ; j<=iEnd ; j++ ) {
					sClass = (j==oPaging.iPage+1) ? 'class="active"' : '';
					$('<li '+sClass+'><a href="#">'+j+'</a></li>')
						.insertBefore( $('li.next', an[i])[0] )
						.bind('click', function (e) {
							e.preventDefault();
							oSettings._iDisplayStart = (parseInt($('a', this).text(),10)-1) * oPaging.iLength;
							fnDraw( oSettings );
						} );
				}

				// Add / remove disabled classes from the static elements
				if ( oPaging.iPage === 0 ) {
					$('li.first', an[i]).addClass('disabled');
					$('li.prev', an[i]).addClass('disabled');
				} else {
					$('li.prev', an[i]).removeClass('disabled');
					$('li.first', an[i]).removeClass('disabled');
				}

				if ( oPaging.iPage === oPaging.iTotalPages-1 || oPaging.iTotalPages === 0 ) {
					$('li.last', an[i]).addClass('disabled');
					$('li.next', an[i]).addClass('disabled');
				} else {
					$('li.next', an[i]).removeClass('disabled');
					$('li.last', an[i]).removeClass('disabled');
				}
			}
		}
	}
} );


/*
 * TableTools Bootstrap compatibility
 * Required TableTools 2.1+
 */
if ( $.fn.DataTable.TableTools ) {
	// Set the classes that TableTools uses to something suitable for Bootstrap
	$.extend( true, $.fn.DataTable.TableTools.classes, {
		"container": "DTTT btn-group",
		"buttons": {
			"normal": "btn btn-default btn-sm",
			"disabled": "disabled"
		},
		"collection": {
			"container": "DTTT_dropdown dropdown-menu",
			"buttons": {
				"normal": "",
				"disabled": "disabled"
			}
		},
		"print": {
			"info": "DTTT_print_info modal"
		},
		"select": {
			"row": "active"
		}
	} );

	// Have the collection use a bootstrap compatible dropdown
	$.extend( true, $.fn.DataTable.TableTools.DEFAULTS.oTags, {
		"collection": {
			"container": "ul",
			"button": "li",
			"liner": "a"
		}
	} );
}

// DO NOT REMOVE : GLOBAL FUNCTIONS!

$(document).ready(function() {

    pageSetUp();



    /*
     * BASIC
     */
    $('#dt_basic').dataTable({
        "sPaginationType" : "bootstrap_full",
        "oLanguage" : {
            "sEmptyTable": "Nenhum dado disponível",
            "sInfo": "Total _TOTAL_ (_START_ ao _END_)",
            "sInfoEmpty": "Nenhum registro",
            "sInfoFiltered": " - filtrando de _MAX_ registros",
            "sInfoThousands": ".",
            "sLoadingRecords": "Aguarde - carregando...",
            "sProcessing": "Aguarde",
            "sZeroRecords": "Nenhum registro",
            "oAria": {
                "sSortAscending": " - clique para ordenar crescente",
                "sSortDescending": " - clique para ordernar decrescente"
            },
            "oPaginate": {
                "sFirst": "Primeira",
                "sLast": "Última",
                "sNext": "Próxima",
                "sPrevious": "Anterior"
            }
        }
    });


    /* END BASIC */

    /* Add the events etc before DataTables hides a column */
    $("#datatable_fixed_column thead input").keyup(function() {
        oTable.fnFilter(this.value, oTable.oApi._fnVisibleToColumnIndex(oTable.fnSettings(), $("thead input").index(this)));
    });

    $("#datatable_fixed_column thead input").each(function(i) {
        this.initVal = this.value;
    });
    $("#datatable_fixed_column thead input").focus(function() {
        if (this.className == "search_init") {
            this.className = "";
            this.value = "";
        }
    });
    $("#datatable_fixed_column thead input").blur(function(i) {
        if (this.value == "") {
            this.className = "search_init";
            this.value = this.initVal;
        }
    });


    var oTable = $('#datatable_fixed_column').dataTable({
        "sDom" : "<'dt-top-row'><'dt-wrapper't><'dt-row dt-bottom-row'<'row'<'col-sm-6'i><'col-sm-6 text-right'p>>",
        //"sDom" : "t<'row dt-wrapper'<'col-sm-6'i><'dt-row dt-bottom-row'<'row'<'col-sm-6'i><'col-sm-6 text-right'>>",
        "oLanguage" : {
            "sSearch" : "Search all columns:"
        },
        "bSortCellsTop" : true
    });



    /*
     * COL ORDER
     */
    $('#datatable_col_reorder').dataTable({
        "sPaginationType" : "bootstrap",
        "sDom" : "R<'dt-top-row'Clf>r<'dt-wrapper't><'dt-row dt-bottom-row'<'row'<'col-sm-6'i><'col-sm-6 text-right'p>>",
        "fnInitComplete" : function(oSettings, json) {
            $('.ColVis_Button').addClass('btn btn-default btn-sm').html('Columns <i class="icon-arrow-down"></i>');
        }
    });

    /* END COL ORDER */

    /* TABLE TOOLS */
    $('#datatable_tabletools').dataTable({
        "sDom" : "<'dt-top-row'Tlf>r<'dt-wrapper't><'dt-row dt-bottom-row'<'row'<'col-sm-6'i><'col-sm-6 text-right'p>>",
        "oTableTools" : {
            "aButtons" : ["copy", "print", {
                "sExtends" : "collection",
                "sButtonText" : 'Save <span class="caret" />',
                "aButtons" : ["csv", "xls", "pdf"]
            }],
            "sSwfPath" : "js/plugin/datatables/media/swf/copy_csv_xls_pdf.swf"
        },
        "fnInitComplete" : function(oSettings, json) {
            $(this).closest('#dt_table_tools_wrapper').find('.DTTT.btn-group').addClass('table_tools_group').children('a.btn').each(function() {
                $(this).addClass('btn-sm btn-default');
            });
        }
    });

    /* END TABLE TOOLS */
})