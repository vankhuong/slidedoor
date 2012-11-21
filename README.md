Xây dựng plugin slide-door với jQuery
Lấy ý tưởng từ cửa kéo truyền thống Nhật Bản, và từ mẫu thiết kế của ông Yoshiki Kuraki cho hệ thống cửa hàng The Sushibar, tôi đã xây dựng một plugin đơn giản với jQuery, bài viết này sẽ giúp bạn hiểu hơn về cách thức để phát triển một plugin javaScript đơn giản với jQuery. Đầu tiên bạn cần chuẩn bị sẵn thư viện jQuery và một thư viện hiệu ứng mở rộng animation jQuery easing và đảm bảo nó đã được nhúng vào HTML của bạn:
<script type="text/javascript" src="jquery.min.js"></script>
<script type="text/javascript" src="jquery.easing.1.3.js"></script>
Chuẩn bị HTML với cấu trúc như sau:
<div class="vk-slidedoor">
        <div class="slidedoor-wrap">
            <dl>
                <dt>Bento & Set</dt>
                <dd><img src="#" /><div class="detail">Details</div></dd>
            </dl>
      <dl>
                <dt>Rice & Noodle</dt>
                <dd><img src="#" /><div class="detail">Details</div></dd>
            </dl>
	    ...
	</div>
</div>
Sau khi có được cấu trúc ta sẽ xây dựng trình bày với CSS, để plugin sử dụng gọn gàng hơn bạn hoàn toàn có thể dùng javaScript để tạo CSS cho phần tử nhưng điều này bạn cần hạn chế với những thuộc tính động thôi còn lại bạn viết CSS thì ứng dụng sẽ load nhanh hơn vì trình duyệt khỏi phải đọc javaScript trước khi trình bày, nội dung CSS bạn cần đảm bảo được một số thuộc tính CSS chủ yếu được trình bày như sau:
.vk-slidedoor{
    position: relative;
    overflow: hidden;
    height: 188px;
}
.vk-slidedoor .slidedoor-wrap{
    position: relative;
}
.vk-slidedoor dl{
    position: absolute; 
    height: 188px;
}
.vk-slidedoor dt{
    float: left;
    width: 28px;
    height: 188px;
    word-wrap: break-word;
}
.vk-slidedoor dd{
    float: left;
    width: 392px;
    height: 188px;
    position: relative;
    padding-left: 1px;
}
.vk-slidedoor dd img{
    width: 100%;
    height: 100%;
}
.vk-slidedoor .detail{
    position: absolute;
    bottom: 6px; right: 6px;
    width: 111px; height:  26px;
}
Đại khái là bạn cần có cấu trúc CSS như trên còn những phần thêm bớt cho màu mè là tùy bạn vì ở đây tôi đã lược bỏ bớt thuộc tính CSS, về kỹ thuật tạo hướng cho văn bản bạn có thể dùng transform rotate CSS3 và cách đem CSS transform đến IE cũ tôi cũng có nói đến ở bài viết trước, khi viết CSS bạn đừng quên reset giá trị CSS mặc định.
Sau khi có được cấu trúc và trình bày bây giờ ta tiến hành xây dựng kịch bản.
Tạo đối tượng lưu thông tin cấu hình
var ops = {
        speed : 500,
        easing : 'easeInCubic',
        autoplay : false,
        direction : 'ltr',
        looptimeout : 3000,
        dtwidth : 29,
        ddpadleft : 1,
        ddwidth : 392
    }
 Xây dựng phương thức jQuery tạo animation với giá trị chính là khoảng cách phần tử sẽ di chuyển
    $.fn.elemsMove = function (val){
        return this.each(function(){
            var leftcurr = $(this).css('left');
            var newcurr = parseInt(leftcurr) + val;
            $(this).stop(true,true).animate({
                left: newcurr
            },ops.speed,ops.easing);
        });
    }
  Xây dựng phương thức jQuery xác định phần tử sẽ di chuyển cho từng trường hợp di chuyển tự động hay khi click vào phần tử cũng như thiết lập tùy chọn hướng di chuyển tự động
	$.fn.activeDoors = function(indexthis){
		// Lấy index của phần tử hiện tại, lấy 1 mảng phần tử dl
		var $curr = this.find('.current');
		var indexcurr = $curr.index();
		var $dls = this.find('dl');
		var dlslen = $dls.length;
		// Bỏ class của phần tử hiện tại
		$curr.removeClass('current');
        
		
		// Chạy hoạt hình những phần tử dl 
		// theo bối cảnh giữa phần tử hiện tại và phần tử được click
		if(arguments.length == 1){
		$dls.each(function(index){
		// Nếu phần tử được click nằm sau phần tử hiện tại
                if(index <= indexthis && index > indexcurr){
                    $(this).elemsMove(-ops.ddwidth);
		// Nếu phần tử được click nằm trước phần tử hiện tại
                }else if(index <= indexcurr && index > indexthis){
                    $(this).elemsMove(ops.ddwidth);
                }
                // Thêm class current cho phần tử được click
                if(index == indexthis){
                    $(this).addClass('current');
                }
		});

		// Chạy hoạt hình phần tử kế tiếp trong trường hợp chạy tự động
		// Với tùy chọn chạy từ trái qua phải
		}else if(ops.direction == 'ltr'){
			// if current element is last child dl element
			if(indexcurr == (dlslen - 1)){
				this.find('dl:first-child').addClass('current')
				.nextAll('dl').elemsMove(ops.ddwidth);
			}else{
				$curr.next().elemsMove(-ops.ddwidth).addClass('current');
			}
		// Với tùy chọn chạy từ phải qua trái
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
Xây dựng phương thức jQuery chạy chính
$.fn.vkSlidedoor = function(cfg){
	// Ghì đè cấu hình khi gọi phương thức
        $.extend(ops,cfg);
        return this.each(function(){
	// Lấy một số phần tử cần thiết cho ứng dụng
            var $this = $(this);
            var $dls = $this.find('dl');
            var $dts = $this.find('dt');
            var $slidewrap = $this.find('.slidedoor-wrap');
            
	    // Sét ví trí left của các phần tử dl
	    // mặc định ban đầu khi trình duyệt được tải
            var i=0;
            $dls.each(function(){
                $(this).css("left", i +"px");
                i+=ops.dtwidth;
            });
	    // Tính toán chiều rộng của phần tử phía trên bao các phần tử dl
	    // và phần tử làm nhiệm vụ overflow hidden
            var overwidth = $dls.length * ops.dtwidth + ops.ddwidth - ops.ddpadleft;
            var mainwidth = overwidth + ops.ddwidth + 10;
	
	// Áp dụng CSS
            $this.width(overwidth);
            $slidewrap.width(mainwidth);
            
            
	    // Sét CSS mặc định cho phần tử đầu tiên được xác đing mở bởi class current
            $this.find('dl.current').nextAll('dl').elemsMove(ops.ddwidth);
            
	    // Chạy tự động nếu tùy chọn đước bật
            if(ops.autoplay){
               var timeout = setInterval(function(){$slidewrap.activeDoors()},ops.looptimeout);
            }
	    // Áp dụng cho hành động click lên phần tử dt
	    // tiến hành gọi phương thức activeDoors chạy ứng dụng, 
	    // đồng thời tắt chế độ chạy tự động
            $dts.click(function(){
                if(ops.autoplay){clearInterval(timeout)}
                // get index of this element
                var indexthis = $dts.index(this);
                $slidewrap.activeDoors(indexthis);
            });//end click
        });//end return 
    }
Vậy là đã xây dựng xong ứng dụng, để sử dụng bạn chỉ việc gọi phương thức vkSlidedoor cho phần tử ngoài cùng như cấu trúc HTML
$(document).ready(function(){
    $('.vk-slidedoor').vkSlidedoor({autoplay : true, direction : 'ltr', looptimeout : 5000});
});