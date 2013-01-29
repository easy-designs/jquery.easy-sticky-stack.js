/*! (c) Aaron Gustafson (@AaronGustafson). MIT License. http://github.com/easy-designs/jquery.easy-sticky-stack.js
 *  Based on work by Chris Spittles http://stackoverflow.com/a/13293684 */

/* Sticky Stack API
 * 
 * This script enables elements to follow the user as they scroll vertically.
 * Each susequent sticky item replaces the one before it when it hits the top
 * of the viewport.
 * 
 * This behavior is automated using HTML5 `data-*` attributes:
 * 
 * 		<h1 data-easy-sticky-stack>Title</h1>
 * 		…
 * 		<h1 data-easy-sticky-stack>Another Title</h1>
 * 		…
 * 		<h1 data-easy-sticky-stack>Yet Another Title</h1>
 * 
 * To set a threshold for the sticky stack to be enabled, use the
 * `data-easy-sticky-stack-threshold` attribute with a valid CSS value
 * Note: You only need to set the threshold on the first sticky stack item.
 * 
 * 		<h1 data-easy-sticky-stack
 * 			data-easy-sticky-stack="40em">Title</h1>
 * 		…
 * 		<h1 data-easy-sticky-stack>Another Title</h1>
 * 		…
 * 		<h1 data-easy-sticky-stack>Yet Another Title</h1>
 * 
 **/
(function( $, window, NULL ){
	
	var NAME = 'easy-sticky-stack',
		ABSOLUTE = 'absolute',
		FIXED = 'fixed',
		WIDTH = 'width',
		SCROLL = 'scroll',
		TOP = 'top',
		WRAPPER = NAME + '-wrapper',
		DATA = 'data-' + NAME,
		THRESHOLD = NAME + '-threshold',
		$wrapper = $('<div/>'),
		$win = $(window),
		size = 0,
		css = '<style>' +
			  '.' + NAME + '{ position: relative; z-index: 1; }' +
			  '.' + NAME + '.fixed{ position: fixed; top: 0; z-index: 0; }' +
			  '.' + NAME + '.fixed.absolute { position: absolute; }'
			  '</style>';
	

	// resize watcher
	function watchResize(callback)
	{
		var resizing;
		function done()
		{
			clearTimeout( resizing );
			resizing = NULL;
			callback();
		}
		$win.on( 'resize', function(){
			if ( resizing )
			{
				clearTimeout( resizing );
				resizing = NULL;
			}
			resizing = setTimeout( done, 50 );
		});
		// init
		$win.on( 'load', callback );
	};
	
	
	function stripInlineStyle( $el, prop )
	{
		var regex = new RegExp( '(\;\s?)?' + prop + '[^;]*\;' ),
			STYLE = 'style';
		
		$el.attr( STYLE, $el.attr( STYLE ).replace( regex, '$1' ) );
	}
	
	
	function easyStickyStack( $stickies )
	{
		
		var count = $stickies.length;
		
	    this.init = function()
		{
			
			$('head').append( css );
	
			$stickies
				.addClass( NAME )
				.each(function(){

	            	var $sticky = $(this),
						only_child = $sticky.is(':only-child'),
						width = $sticky.width();
					
					if ( ! only_child )
					{
						$sticky.wrap(
							$wrapper.clone()
						);
					}
                    
					$sticky
						.width( width )
						.parent()
							.addClass( WRAPPER )
							.height( $sticky.outerHeight() );
                    
					$sticky.data( FIXED, $sticky.offset().top );
					$sticky.data( ABSOLUTE, $sticky.position().top );

		        });
		
		};
	
		this.scroll = function() {

	        $stickies.each(function( i, curr_sticky ){

				var $curr_sticky = $(curr_sticky),
					$next_sticky = i < count - 1 ? $stickies.eq( i + 1 ) : $([]),
	                $prev_sticky = i > 0 ? $stickies.eq( i - 1 ) : $([]),
	                curr_top = $curr_sticky.data( FIXED ),
					height = $curr_sticky.parent().height(),
					max_offset = 0,
					above_next = 0, 
					scroll_top = $win.scrollTop();
				
				if ( $next_sticky.length )
				{
					max_offset = $next_sticky.data( FIXED ) - height;
					above_next = $next_sticky.data( ABSOLUTE ) - height;
				}
				
				// Fixed positioning
				if ( curr_top <= scroll_top )
				{
	                $curr_sticky.addClass( FIXED );

	                // Position above current fixed item
					if ( $next_sticky.length > 0 &&
						 ! $curr_sticky.hasClass( ABSOLUTE ) &&
						 $curr_sticky.offset().top >= max_offset )
					{
						$curr_sticky
							.addClass( ABSOLUTE )
							.css( TOP, above_next );
	                }

	            }
				// End fixed positioning
				else
				{
	                $curr_sticky.removeClass( FIXED );

					// Return to normal flow
	                if ( $prev_sticky.length > 0 &&
						 $prev_sticky.hasClass( ABSOLUTE ) &&
						 scroll_top <= curr_top - $prev_sticky.outerHeight() )
					{
						stripInlineStyle(
							$prev_sticky.removeClass( ABSOLUTE ),
							TOP
						);
	                }

	            }
	        });
	
	    };
	
	};
	
	// Init
	watchResize(function(){
		
		var newStickies = new easyStickyStack( $('[' + DATA + ']') ),
			threshold = $('[data-' + THRESHOLD + ']').eq(0).data( THRESHOLD ),
			matches = true;
		
		newStickies.init();
		
		if ( 'matchMedia' in window )
		{
			matches = window.matchMedia('(min-width:' + threshold + ')').matches;
		}
		
		if ( matches )
		{
			$win.on( SCROLL, newStickies.scroll );
		}
		else
		{
			$win.off( SCROLL, newStickies.scroll );
		}
		
	});
	
}( jQuery, window, null ));