// Объект для определения, был ли клик (или быстрый тап),
// либо скролл, выделение и т.п.
// Нужно для определения, прятать ли менюшку.
var Detect = {
	threshold: {
		ts: 150,     // ms
		clientX: 2,  // px
		clientY: 2,  // px
		scrollTop: 2 // px
	},
	start: {
		ts: null,
		clientX: null,
		clientY: null,
		scrollTop: null
	},
	delta: {
		ts: null,
		clientX: null,
		clientY: null,
		scrollTop: null
	},
	init: function (event) {
		this.start.ts = event.timeStamp;
		this.start.clientX = event.clientX || 0;
		this.start.clientY = event.clientY || 0;
		this.start.scrollTop = document.body.scrollTop;
	},
	reset: function() {
		this.start.ts = null;
		this.start.clientX = null;
		this.start.clientY = null;
		this.start.scrollTop = null;
	},
	is_click: function (event) {
		this.delta.ts = Math.abs(event.timeStamp - this.start.ts);
		this.delta.clientX = Math.abs((event.clientX || 0) - this.start.clientX);
		this.delta.clientY = Math.abs((event.clientY || 0) - this.start.clientY);
		this.delta.scrollTop = Math.abs(document.body.scrollTop - this.start.scrollTop);
		this.reset();
		
		return this.delta.ts        <= this.threshold.ts
			&& this.delta.clientX   <= this.threshold.clientX
			&& this.delta.clientY   <= this.threshold.clientY
			&& this.delta.scrollTop <= this.threshold.scrollTop;
	}
};


function ready(fn) {
	if (document.readyState != 'loading'){
		fn();
	} else {
		document.addEventListener('DOMContentLoaded', fn);
	}
}

function show_nav(e) {
	e.preventDefault();
	document.getElementById("anchors").classList.add("open");
	return false;
}

function touchstart(e) {
	Detect.init(e);
}
function hide_nav(e) {	
	var tag = e.target;
	while (tag.tagName.toLowerCase() !== "nav" && tag.tagName.toLowerCase() !== "body") {
		tag = tag.parentNode;
	}
	var not_nav = tag.tagName.toLowerCase() !== "nav",
		is_click = Detect.is_click(e);
	
	if (not_nav && is_click) {
		document.getElementById("anchors").classList.remove("open");
	}
}

function getWindowWidth() {
	// vanilla JS window width and height
	var w = window,
		d = document,
		e = d.documentElement,
		g = d.getElementsByTagName('body')[0];
	return w.innerWidth || e.clientWidth || g.clientWidth;
}

ready(function () {
	document.getElementById("show-nav").addEventListener("click", show_nav);
	// document.getElementById("hide-nav").addEventListener("click", force_hide_nav);
	
	document.addEventListener("mousedown", touchstart);
	document.addEventListener("mouseup", hide_nav);
	document.addEventListener("touchstart", touchstart);
	document.addEventListener("touchend", hide_nav);
	
	smoothScroll.init({
	    speed: 500, // Integer. How fast to complete the scroll in milliseconds
	    easing: 'easeOutQuart', // Easing pattern to use
		callback: function(anchor, toggle) { // Function to run after scrolling
			if (getWindowWidth() < 900) {
				document.getElementById("anchors").classList.remove("open");
			}
		}
	});
	
});
