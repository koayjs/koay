'use strict';

function UserAgent(userAgent) {
  if (!userAgent) {
    userAgent = '';
  }
  const os = this;
  os.webkit = userAgent.match(/WebKit\/([\d.]+)/);
  os.android = userAgent.match(/(Android)\s+([\d.]+)/) || userAgent.match(/Silk-Accelerated/);
  os.androidICS = os.android && userAgent.match(/(Android)\s4/);
  os.ipad = userAgent.match(/(iPad).*OS\s([\d_]+)/);
  os.iphone = !os.ipad && userAgent.match(/(iPhone\sOS)\s([\d_]+)/);
  os.ios7 = (os.ipad || os.iphone) && (userAgent.match(/7_/) || userAgent.match(/8_/));
  os.webos = userAgent.match(/(webOS|hpwOS)[\s/]([\d.]+)/);
  os.touchpad = os.webos && userAgent.match(/TouchPad/);
  os.ios = os.ipad || os.iphone;
  os.playbook = userAgent.match(/PlayBook/);
  os.blackberry10 = userAgent.match(/BB10/);
  os.blackberry = os.playbook || os.blackberry10 || userAgent.match(/BlackBerry/);
  os.chrome = userAgent.match(/Chrome/);
  os.opera = userAgent.match(/Opera/);
  os.safari = userAgent.match(/Safari\/([\d.]+)/);
  os.fennec = userAgent.match(/fennec/i) || userAgent.match(/Firefox/);
  const ie = userAgent.match(/MSIE\s([\d.]+)/) || userAgent.match(/(?:trident)(?:.*rv:([\w.]+))?/i);
  if (ie) {
    os.ie = parseFloat(ie[1]);
  }
  os.ieTouch = os.ie && userAgent.toLowerCase().match(/touch/i);
  os.tizen = userAgent.match(/Tizen/i);
  os.kindle = userAgent.match(/Silk-Accelerated/);
  os.wechat = userAgent.match(/MicroMessenger/i);
};

module.exports = UserAgent;
