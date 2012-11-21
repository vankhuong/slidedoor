/**
 * Do not remove this if you are using
 * jQuery vkSlidedoor
 * Author: Van Khuong <vankhuong@sothichweb.com>
 * http://sothichweb.com
 */

;(function($){
    // configuration application
    var ops = {
        speed : 500,
        easing : 'easeInCubic',
        autoplay : false,
        direction : 'ltr', // or 'rtl'(right to left), direction slide-door, apply for the mode autoplay is true
        looptimeout : 3000, // set timeout for slide-door, apply for the mode autoplay is true
        dtwidth : 29,
        ddpadleft : 1,
        ddwidth : 392
    }
    
    $.fn.vkSlidedoor = function(cfg){
        $.extend(ops,cfg);
        return this.each(function(){
            var $this = $(this);
            var $dls = $this.find('dl');
            var $dts = $this.find('dt');
            var $slidewrap = $this.find('.slidedoor-wrap');
            
            // Default set left CSS for dl elements
            var i=0;
            $dls.each(function(){
                $(this).css("left", i +"px");
                i+=ops.dtwidth;
            });
            //caculate width of over element
            var overwidth = $dls.length * ops.dtwidth + ops.ddwidth - ops.ddpadleft;
            var mainwidth = overwidth + ops.ddwidth + 10;
            $this.width(overwidth);
            
            // Default set width css dor slidedoor-wrap element
            $slidewrap.width(mainwidth);
            
            // Set CSS default open door for current dl elements
            $this.find('dl.current').nextAll('dl').elemsMove(ops.ddwidth);
            
            if(ops.autoplay){
               var timeout = setInterval(function(){$slidewrap.activeDoors()},ops.looptimeout);
            }
            $dts.click(function(){
                if(ops.autoplay){clearInterval(timeout)}
                // get index of this element
                var indexthis = $dts.index(this);
                $slidewrap.activeDoors(indexthis);
            });//end click
        });//end return 
    }
	// active animation the doors
	$.fn.activeDoors = function(indexthis){
    // get current element and index, get dl elements
		var $curr = this.find('.current');
		var indexcurr = $curr.index();
		var $dls = this.find('dl');
		var dlslen = $dls.length;
		$curr.removeClass('current');
        
		// animation with current element and this element with click event context
		if(arguments.length == 1){
			$dls.each(function(index){
                // if this element affter current element
                if(index <= indexthis && index > indexcurr){
                    $(this).elemsMove(-ops.ddwidth);
                // if this element before current element
                }else if(index <= indexcurr && index > indexthis){
                    $(this).elemsMove(ops.ddwidth);
                }
                // add current class for this element
                if(index == indexthis){
                    $(this).addClass('current');
                }
			});

		// animation for element next in the automatic mode
		}else if(ops.direction == 'ltr'){
			// if current element is last child dl element
			if(indexcurr == (dlslen - 1)){
				this.find('dl:first-child').addClass('current').nextAll('dl').elemsMove(ops.ddwidth);
			}else{
				$curr.next().elemsMove(-ops.ddwidth).addClass('current');
			}
		}else if(ops.direction == 'rtl'){
			 // if current element is first child dl element
			if(indexcurr == 0){
				$curr.nextAll('dl').elemsMove(-ops.ddwidth);
				this.find('dl:last-child').addClass('current');
			}else{
				$curr.elemsMove(ops.ddwidth);
				$curr.prev().addClass('current');
			}
		}
	}
  
	// animation the doors with value of position
    $.fn.elemsMove = function (val){
        return this.each(function(){
            var leftcurr = $(this).css('left');
            var newcurr = parseInt(leftcurr) + val;
            $(this).stop(true,true).animate({
                left: newcurr
            },ops.speed,ops.easing);
        });
    }
})(jQuery);