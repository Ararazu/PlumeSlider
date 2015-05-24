/**
* jquery.plume-slider.js v1.0.0
* http://www.ararazu.com
*
* Licensed under the MIT license.
* http://www.opensource.org/licenses/mit-license.php
* 
* Copyright 2014, Ararazu
* http://www.ararazu.com
*/

(function( $ ){
	
	$.fn.plumeSlider = function(options) {
		
		// Default Parameters
		var opt = {
			width:		'full',
			height:		'full',
			type:		'fade',
			interval:	8000,
			transition:	1000,
			autoplay:	true,
			invert:		false,
			callback: {
				loaded: function() { },
				start: function() { },
				complete: function() { }
			}
		};
		
		// Settings
		var settings = $.extend( { }, opt, options );

		this.each(function() {

			// Caching
			var plume			= $(this);
			var plSlider		= plume.find('.plume-slider');
			var plSlide			= plSlider.find('.plume-slide');

			var Slider = function(){
				
				this.sldStarted	= 0;
				this.sldInterval= 0;
				this.navPrev	= plume.find('.prev');
				this.navNext	= plume.find('.next');
				this.slides		= plume.find('.plume-slide').length;
				this.allBgImg	= plume.find('.plume-slide .bg-img');
				this.allElems	= plume.find('.plume-slide .animation');
				this.bullets	= plume.find('.plume-bullets a');

				// Setting width
				this.setWidth = function(newWidth) {
					settings.slideWidth = newWidth;
					plume.css('width', newWidth);
					if (settings.type === 'carousel') {						
						if ( newWidth === '100%' ) {
							plSlider.css('width', ''+(100*this.slides)+'%');
							plSlide.css('width', ''+(100/this.slides)+'%');
						} else {
							plSlider.css('width', (settings.slideWidth*this.slides));
							plSlide.css('width', settings.slideWidth);
						}
					}
				};
				
				// Setting height
				this.setHeight = function(newHeight) {
					if (settings.height !== 'full') {
						settings.slideHeight = settings.height;
					}
					plume.css('height', newHeight);
				};

				// If mode = carousel (adjusting total width of slider)
				if (settings.type === 'carousel') {
					this.allBgImg.css('visibility', 'visible').animate({opacity: 1}, 10);
					plSlider.addClass('carousel');
				}
				
				// Reset Interval
				this.resetInterval = function() {
					clearInterval( this.sldInterval );
					if (settings.autoplay === true) { this.autoplay(); }
				};

				// Autoplay Option
				this.autoplay = function() {
					var interval = settings.interval;					
					this.sldInterval = setInterval( function(){
						if (settings.invert === true) { slider.go('prev'); } else { slider.go('next'); }
					}, interval);
				};
				
				// Next Slide
				this.next = function(){
					this.go('next');
				};

				// Previous Slide
				this.prev = function(){
					this.go('prev');
				};

				// Bullets
				this.goBullet = function(slideNumber){
					this.go(slideNumber);
				};

				// Slideshow Animations
				this.go = function(direction) {
					// Add a input to control the slide number
					if ( this.sldStarted == 0 ) {
						this.sldStarted++;
						$('body').append('<input name="plumeControl" id="plumeControl" type="hidden" value="0" style="visibility:hidden; display: none;" />');
					}
					var pc = $('#plumeControl');
					settings.callback.start( pc.val() );

					if ( !(isNaN(direction)) ) {
						var pcval = ( direction );
					} else {
						if (direction=='next' || (!direction) ) {
							var pcval = ( parseInt(pc.val()) + 1);
						} else {
							var pcval = ( parseInt(pc.val()) - 1);
							if (pcval <= 0) { pcval = this.slides; }
						}
						if (pcval > this.slides) { pcval = 1; }
					}

					// Current Slider
					var cS = $('.plume-slider #slide-'+(pcval)+'');
					
					// Elements
					var elements = cS.find('.animation').length;

					// Positions, Type, Time and Delay
					var toXY, toX, toY, newX, newY, offsetX, offsetY, type, time, delay, cE = '';
					
					// Assigning the object to variable
					var slideColPat	= $('.plume-slider #slide-'+(pcval)+' .over-color, .plume-slider #slide-'+(pcval)+' .over-pattern'); // color / pattern
					var otherSlides	= $('.plume-slider .plume-slide:not(#slide-'+(pcval)+')');
					var otherBgImgs	= $('.plume-slider .plume-slide:not(#slide-'+(pcval)+') .bg-img');
					var otherColPat	= $('.plume-slider .plume-slide:not(#slide-'+(pcval)+') .over-color, .plume-slider .plume-slide:not(#slide-'+(pcval)+') .over-pattern');
					var csBgImg		= cS.find('.bg-img');

					switch(settings.type) {
						case 'fading':
							// Hide other slides
							otherSlides.stop().css('visibility', 'hidden').animate({opacity: 0}, 1, function(){
								otherSlides.css('z-index', 2);
								otherBgImgs.css('visibility', 'hidden').animate({opacity: 0}, 1);
								otherColPat.css('visibility', 'hidden');
							});
							cS.stop().css('visibility', 'visible').css('z-index', 3).animate({opacity: 1}, (settings.transition/2), function() {
								// Enable all bg images
								cS.find('.bg-img').css('visibility', 'visible').animate({opacity: 1}, (settings.transition/2));
							});
							// Hide all elements from previous slide
							this.allElems.stop().css('visibility', 'hidden').animate({opacity: 0}, (settings.transition/2));
							// Enable color and pattern again
							slideColPat.stop().css('visibility', 'visible');							
							break;
						
						case 'carousel':
							csBgImg.animate({marginLeft: 0}, settings.transition);
							this.allElems.stop().css('visibility', 'hidden').animate({opacity: 0}, 10);
							slideColPat.stop().css('visibility', 'visible');

							if ( settings.width === 'full' ) {
								settings.slideWidth = (100);
								plSlider.stop().animate({marginLeft: "-"+((pcval-1) * settings.slideWidth)+'%' }, settings.transition);
							} else {
								plSlider.stop().animate({marginLeft: "-"+((pcval-1) * settings.slideWidth) }, settings.transition);
							}

							break;
					}
					// Saving the current number
					pc.val( pcval );
					settings.callback.complete( pcval );
					
					// Current bullet
					this.bullets.removeClass('active');
					$('#bullet-'+pcval).addClass('active');
					
					// Show elements from current slide
					var y = 0;
					while (y < elements) {
						// Current element
						cE			= cS.find('.elem-'+(y+1)+'');
						toXY		= cE.data('xy');
						var dataSplitXY = toXY.split(',');
						offsetX		= cE.offset().top;
						offsetY		= cE.offset().left;
						toX			= parseInt(dataSplitXY[0].replace(" ",""));
						toY			= parseInt(dataSplitXY[1].replace(" ",""));
						type		= cE.data('type');
						time		= cE.data('time');
						delay		= cE.data('delay') + settings.transition;
						
						// Element directions / positions
						cE.stop().css('visibility', 'hidden').animate({ opacity: 0 }, (settings.transition/2) );
						if (cE.hasClass('top'))		{ cE.stop().css('margin-top',	toX);	}
						if (cE.hasClass('vcenter'))	{ cE.stop().css('margin-top',	toX);	}
						if (cE.hasClass('bottom'))	{ cE.stop().css('margin-bottom',-toX);	}

						if (cE.hasClass('left'))	{ cE.stop().css('margin-left',	toY);	}
						if (cE.hasClass('center'))	{ cE.stop().css('margin-left',	toY);	}
						if (cE.hasClass('right'))	{ cE.stop().css('margin-right',	-toY);	}						

						cE.stop().delay(delay).css('visibility', 'visible').animate({ margin: 0, opacity: 1 }, time, type);
						y++; // Go to next element
					}
				};

				// Set width and height
				this.setDimensions = function(){					
					viewportWidth = $(window).width();
					viewportHeight = $(window).height();

					if (settings.width !== 'full') {
						if (settings.width > viewportWidth) {
							settings.slideWidth = viewportWidth;
						} else {
							settings.slideWidth = settings.width;
						}
						slider.setWidth( settings.slideWidth );
					} else {
						slider.setWidth( '100%' );
					}

					if (settings.height === 'full') {
						slider.setHeight( viewportHeight );
					} else {
						slider.setHeight( settings.height );
					}

					// Carousel adjusts
					if (settings.type === 'carousel') {
						plSlider.stop().animate({marginLeft: "-"+(($('#plumeControl').val()-1) * settings.slideWidth) }, (settings.transition/4));
					}

					var sizeFont = 'font-xlarge';
					var widthToSetFont = settings.slideWidth;
					if (widthToSetFont == '100%') {
						widthToSetFont = viewportWidth;
					}

					if (widthToSetFont <= 480)	{ sizeFont = 'font-mobile';	}
					if (widthToSetFont >= 481)	{ sizeFont = 'font-xsmall';	}
					if (widthToSetFont >= 768)	{ sizeFont = 'font-small';	}
					if (widthToSetFont >= 960)	{ sizeFont = 'font-medium';	}
					if (widthToSetFont >= 1200)	{ sizeFont = 'font-large';	}
					if (widthToSetFont >= 1400)	{ sizeFont = 'font-xlarge';	}
					plume.removeClass('font-mobile font-xsmall font-small font-medium font-large font-xlarge').addClass(sizeFont);
				};

				// Initialise slideshow
				this.init = function(direction) {					
					if (settings.invert === true) { this.prev(); } else { this.next(); }
					this.setDimensions();
					settings.callback.loaded( $('#plumeControl').val() );
				};

			};

			// Init functions
			var slider = new Slider();
			slider.init();
	
			// Next button
			slider.navNext.click(function(e){
				e.preventDefault();
				if (settings.invert === true) { slider.prev(); } else { slider.next(); }
				slider.resetInterval();
			});

			// Prev button
			slider.navPrev.click(function(e){
				e.preventDefault();
				if (settings.invert === true) { slider.next(); } else { slider.prev(); }
				slider.resetInterval();
			});

			// Bullet buttons
			slider.bullets.click(function(e){
				e.preventDefault();
				var slideNumber = $(this).attr('id').split('bullet-')[1];
				slider.goBullet( slideNumber );
				slider.resetInterval();
			});

			// Autoplay (using opt.interval time)
			if ( settings.autoplay == true ) {
				slider.autoplay();
			}

			// Call one time after resize screen (block multiple calls)
			var waitForFinalEvent = (function () {
				var timers = {};
				return function (callback, ms, uniqueId) {
					if (!uniqueId) {
						uniqueId = "Don't call this twice without a uniqueId";
					}
					if (timers[uniqueId]) {
						clearTimeout (timers[uniqueId]);
					}
					timers[uniqueId] = setTimeout(callback, ms);
				};
			})();

			// On resize
			$(window).resize(function () {
				waitForFinalEvent(function(){
					slider.setDimensions();
				}, (100));
			});
		});	
	};
})( jQuery );