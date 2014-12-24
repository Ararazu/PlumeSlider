/*
* Scripts JS
* Copyright 2014, Ararazu
* www.ararazu.com
*/

/* Scripts to initialize Plume Slider
================================================== */

	(function(){
		"use strict";
		
		// Variables
		var transitionTime	= 1200;
		var vW				= $(window).width();
		var vH				= $(window).height();
		var loading			= $('.loading');
		
		// Slider File:  js/plume-slider.js
		var sldshow = $('#slideshow');
		
		// <a href="#"... click return false
		$('a[href="#"]').on('click', function() { return false; });

		// Initialise Slideshow ( function .plumeSlider() )
		// ----------------------------------------------------
		sldshow.plumeSlider({
			// options
			width:		'full',		// full or customized width (only number - in pixels)
			height:		'full',		// full or customized height (only number - in pixels)
			type:		'fading',	// fading or carousel
			interval:	8000,		// the time that each slide remains on the screen
			transition:	1000,		// the time of slide transitions
			autoplay:	false,		// automatic slide transitions (after 'interval', go to the next)
			invert:		false,		// show the last slide as the first
			callback: {
				// Use your browser console to view these logs
				loaded: function(slideNumber) {				
					console.log('plumeSlider: Loaded slide -> ' + slideNumber);
				},
				start: function(slideNumber) {
					console.log('plumeSlider: Start Animation on slide -> ' + slideNumber);
				},
				complete: function(slideNumber) {
					console.log('plumeSlider: Animation Complete. Current slide is -> ' + slideNumber);
				}
			}
		});
		// ----------------------------------------------------

		$( window ).load(function() {
			loading.fadeOut(300); // Removing loading
		});

	})();