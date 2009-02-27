
// Damn. This is way too big. :-(
// All this because MSIE does not respect padding in <input> elements.

var _MSIEShim = {
  onfocus: function(element) {
    this.base.apply(this, arguments);
    var behavior = this, timer;
    if (!shim.control) {
      var document = element.document;
      shim.control = document.createElement("!");
      document.body.insertBefore(shim.control, document.body.firstChild);
      shim.attach(shim.control);
    }
    shim.element = element;
    shim.behavior = behavior;
    var style = shim.control.style;
    style.cssText = "position:absolute;border:0;display:block;background-position-x:right";
    //;;; style.backgroundColor = "red";
    style.pixelHeight = element.clientHeight;
    style.pixelWidth = behavior.imageWidth;
    style.backgroundImage = element.currentStyle.backgroundImage;
    shim.layout();
    position();
    element.attachEvent("onpropertychange", change);
    element.attachEvent("onfocusout", function() {
      element.detachEvent("onpropertychange", change);
      element.detachEvent("onfocusout", arguments.callee);
      element.scrollLeft = 9999;
      shim.element = undefined;
      style.display = "none";
      detachEvent("onresize", resize);
    });
    function change(event) {
      if (event.propertyName == "value") element.scrollLeft = 9999;
    };
    function position() {
      var offset = behavior.getOffsetFromBody(element),
          rect = element.getBoundingClientRect(),
          adjustRight = rect.right - rect.left - element.offsetWidth;
      style.pixelLeft = offset.left + adjustRight + element.clientWidth - behavior.imageWidth + element.clientLeft;
      style.pixelTop = offset.top + element.clientTop;
      timer = null;
    };
    function resize() {
      if (!timer) timer = setTimeout(position, 50);
    };
    attachEvent("onresize", resize);
  },
  
  onmouseover: _shimMouseOverOut,
  onmouseout: _shimMouseOverOut,

  onkeydown: function(element, event, keyCode) {
    this.base(element, event, keyCode);
    if (shim.element == element) shim.layout();
  },

  onkeyup: function(element, event, keyCode) {
    if (!control._popup && keyCode == 35) { // END key
      element.scrollLeft = 9999;
    } else {
      this.base(element, event, keyCode);
    }
    if (shim.element == element) shim.layout();
  }
};

var shim = behavior.extend({
  onmousedown: _shimMouse,
  onmouseup: _shimMouse,
  onmousemove: _shimMouse,

  onmouseover: _shimMouseOverOut2,
  onmouseout: _shimMouseOverOut2,

  layout: function() {
    if (this.element) {
      this.control.style.backgroundPositionY = this.element.currentStyle.backgroundPositionY;
    }
  }
});

function _shimMouse(element, event, x, y, screenX, screenY) {
  if (event.type == "mousedown") {
    event.preventDefault();
    event.stopPropagation();
  }
  var offset = ElementView.getOffsetXY(this.element, event.clientX, event.clientY);
  this.behavior["on" + event.type](this.element, event, offset.x, offset.y, screenX, screenY);
  this.layout();
};

function _shimMouseOverOut(element, event) {
  if (!(element == shim.element && event.relatedTarget == shim.control)) {
    this.base(element, event);
  }
  if (shim.element == element) shim.layout();
};

function _shimMouseOverOut2(element, event) {
  if (event.relatedTarget != this.element) {
    this.behavior["on" + event.type](this.element, event);
  }
  this.layout();
};