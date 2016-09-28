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
	isClick: function (event) {
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
	if (document.readyState !== 'loading'){
		fn();
	} else {
		document.addEventListener('DOMContentLoaded', fn);
	}
}

function showNav(e) {
	e.preventDefault();
	document.getElementById("anchors").classList.add("open");
	return false;
}

function hideNav(e) {	
	var tag = e.target;
	while (tag.tagName.toLowerCase() !== "a" && tag.tagName.toLowerCase() !== "body") {
		tag = tag.parentNode;
	}
	var not_a = tag.tagName.toLowerCase() !== "a",
		is_click = Detect.isClick(e);
	
	if (not_a && is_click) {
		document.getElementById("anchors").classList.remove("open");
	}
}
function onTouchstart(e) {
	Detect.init(e);
}

function getWindowWidth() {
	// vanilla JS window width and height
	var w = window,
		d = document,
		e = d.documentElement,
		g = d.getElementsByTagName('body')[0];
	return w.innerWidth || e.clientWidth || g.clientWidth;
}

function changeTheme(e) {
	e.preventDefault();
	document.body.className = e.target.id;
	var theme_selectors = document.querySelectorAll("#themes-selector > a");
	for (var i = 0; i < theme_selectors.length; i++) {
		theme_selectors[i].classList.remove("selected");
	}
	e.target.classList.add("selected");
	localStorage.setItem("oneginTheme", e.target.id);
	return false;
}


ready(function () {
	// Восстановление выбранной цветовой схемы после перезагрузки страницы
	var theme = localStorage.getItem("oneginTheme") || "white";
	document.body.className = theme;
	document.getElementById(theme).classList.add("selected");
	
	// Открывашка менюшки и переключатели цветовой схемы
	document.getElementById("roast-beef").addEventListener("click", showNav);
	var theme_selectors = document.querySelectorAll("#themes-selector > a");
	for (var i = 0; i < theme_selectors.length; i++) {
		theme_selectors[i].addEventListener("click", changeTheme);
	}
	
	// Обработчики кликов-тапов для скрытия менюшки
	document.addEventListener("mousedown", onTouchstart);
	document.addEventListener("touchstart", onTouchstart);
	
	document.addEventListener("mouseup", hideNav);
	document.addEventListener("touchend", hideNav);
	
	// Плавный скролл до строфы
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
