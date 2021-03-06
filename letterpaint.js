(function(){

  /* Get container elements */
  var container = document.querySelector('#container');
  var charscontainer = document.querySelector('#chars');

  /* Get buttons */
  var startbutton = document.querySelector('#intro button');
  var infobutton = document.querySelector('#infos');
  var installbutton = document.querySelector('#install');
  var winbutton = document.querySelector('#win button');
  var reloadbutton = document.querySelector('#reload');
  var soundbutton = document.querySelector('#sound');
  var errorbutton = document.querySelector('#error button');

  /* Get sounds */
  var winsound = document.querySelector('#winsound');
  var errorsound = document.querySelector('#errorsound');

  /* Prepare canvas */
  var c = document.querySelector('canvas');
  var cx = c.getContext('2d');
  var letter = null;
  var fontsize = 300;
  var paintcolour = [240, 240, 240];
  var textcolour = [255, 30, 20];
  var xoffset = 0;
  var yoffset = 0;
  var linewidth = 20;
  var pixels = 0;
  var letterpixels = 0;

  //canvas 2
  var can2 = document.createElement('canvas');
  var cx2 = can2.getContext('2d');

  var originalLetterPixels = 0;

  /* Mouse and touch events */
  var mousedown = false;
  var touched = false;
  var oldx = 0;
  var oldy = 0;

  /* Overall game presets */
  var state = 'intro';
  var sound = true;
  var currentstate;

  function init() {
    xoffset = container.offsetLeft;
    yoffset = container.offsetTop;
    fontsize = container.offsetHeight / 1.5;
    linewidth = container.offsetHeight / 19;
    paintletter();
    setstate('intro');
  }

  function togglesound() {
    if (sound) {
      sound = false;
      soundbutton.className = 'navbuttonoff';
    } else {
      sound = true;
      soundbutton.className = 'navbutton';
    }
  }

  function showerror() {
    setstate('error');
    if (sound) {
      errorsound.play();
    }
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
  }

  function showinfo() {
    if (state !== 'info') {
      setstate('info');
    } else {
      setstate('play');
    }
  }

  function setstate(newstate) {
    state = newstate;
    container.className = newstate;
    currentsate = state;
  }
  function moreneeded() {
    setstate('play');
    mousedown = false;
  }
  function retry(ev) {
    mousedown = false;
    oldx = 0;
    oldy = 0;
    paintletter(letter);
  }
  function winner() {
    paintletter();
  }
  function start() {
    paintletter(letter);
  }
  function cancel() {
    paintletter();
  }
  function paintletter(retryletter) {
    var chars = charscontainer.innerHTML.split('');
    letter = retryletter ||
             chars[parseInt(Math.random() * chars.length,10)];
    c.width = container.offsetWidth;
    c.height = container.offsetHeight;

    can2.width = c.width;
    can2.height = c.height;

    cx.font = 'bold ' + fontsize + 'px Open Sans';
    cx.fillStyle = 'rgb(' + textcolour.join(',') + ')';
    cx.strokeStyle = 'rgb(' + paintcolour.join(',') + ')';

    cx2.fillStyle = 'rgb(' + textcolour.join(',') + ')';
    cx2.strokeStyle = 'rgb(' + paintcolour.join(',') + ')';

    cx.shadowOffsetX = 2;
    cx.shadowOffsetY = 2;
    cx.shadowBlur = 4;
    cx.shadowColor = '#666';

    cx.textBaseline = 'baseline';
    cx.lineWidth = linewidth;
    cx.lineCap = 'butt';//round';
    cx.fillText(
      letter,
      (c.width - cx.measureText(letter).width) / 2,
      (c.height / 1.3)
    );
    pixels = cx.getImageData(0, 0, c.width, c.height);
    letterpixels = getpixelamount(
      textcolour[0],
      textcolour[1],
      textcolour[2]
    );
    cx.shadowOffsetX = 0;
    cx.shadowOffsetY = 0;
    cx.shadowBlur = 0;
    cx.shadowColor = '#333';
    setstate('play');


    //dbg
    console.log(getpixelamount(255,30,20));
    originalLetterPixels = getpixelamount(255,30,20);
  }

  function getpixelamount(r, g, b) {
    var pixels = cx.getImageData(0, 0, c.width, c.height);
    var all = pixels.data.length;
    var amount = 0;
    //console.log(pixels);
    for (i = 0; i < all; i += 4) {
      if (pixels.data[i] === r &&
          pixels.data[i+1] === g &&
          pixels.data[i+2] === b) {
          //if(pixels.data[i] != 255) debugger;
        //console.log(r,g,b);
        amount++;
      }
    }
    return amount;
  }

  function paint(x, y) {
    var rx = x - xoffset;
    var ry = y - yoffset;
    var colour = pixelcolour(x, y);
    if( colour.r === 0 && colour.g === 0 && colour.b === 0) {
      showerror();
    } else {

      

      /*
      //line2
      cx2.beginPath();
      cx2.globalCompositeOperation = "source-over";
      cx2.strokeStyle = "rgba(11,11,11,0)";
      cx2.lineWidth = 20;
      if (oldx > 0 && oldy > 0) {
        cx2.moveTo(oldx, oldy);
      }
      cx2.lineTo(rx, ry);
      cx2.stroke();
      cx2.closePath();*/

      cx2.globalCompositeOperation = "destination-out";
      cx2.strokeStyle = "rgba(240,240,240,1)";
      cx2.lineWidth = 100;

      cx2.beginPath();
      if (oldx > 0 && oldy > 0) {
        cx2.moveTo(oldx, oldy);
      }
      cx2.lineTo(rx, ry);
      cx2.stroke();
      cx2.closePath();

      cx.drawImage(can2, 0, 0);


      // delete px instead of drawing a new line.
      cx.globalCompositeOperation = "destination-out";
      cx.strokeStyle = "rgba(240,240,240,1)";
      cx.lineWidth = 100;

      cx.beginPath();
      if (oldx > 0 && oldy > 0) {
        cx.moveTo(oldx, oldy);
      }
      cx.lineTo(rx, ry);
      cx.stroke();
      cx.closePath();
      

      oldx = rx;
      oldy = ry;
    }
  }

  function pixelcolour(x, y) {
    var index = ((y * (pixels.width * 4)) + (x * 4));
    return {
      r:pixels.data[index],
      g:pixels.data[index + 1],
      b:pixels.data[index + 2],
      a:pixels.data[index + 3]
    };
  }

  function pixelthreshold() {
    if (state !== 'error') {

      console.log("GPA: ", parseInt(originalLetterPixels) - parseInt(getpixelamount(255,30,20)));
      
      console.log(originalLetterPixels, 
        parseInt(getpixelamount(255,30,20)));

      // if (getpixelamount(
      //   paintcolour[0],
      //   paintcolour[1],
      //   paintcolour[2]
      // ) / letterpixels > 0.35) {
      if( getpixelamount(255,30,20) < (originalLetterPixels * .15)) { //(originalLetterPixels / getpixelamount(255,30,20) > 0.25) {
       setstate('win');
       if (sound) {
         winsound.play();
       }
      }
      //dbg

      console.log(getpixelamount(255,30,20));
    }
  }


  function install() {
    if (navigator.mozApps) {
      var checkIfInstalled = navigator.mozApps.getSelf();
      checkIfInstalled.onsuccess = function () {
        if (checkIfInstalled.result) {
          installbutton.style.display = "none";
        } else {
          manifestURL = location.href.substring(0, location.href.lastIndexOf("/")) + "/manifest.webapp";
          var installApp = navigator.mozApps.install(manifestURL);
          installApp.onsuccess = function(data) {
            installbutton.style.display = "none";
          };
          installApp.onerror = function() {
            alert("Install failed\n\n:" + installApp.error.name);
          };
        }
      };
    }
  }

  /* Mouse event listeners */

  function onmouseup(ev) {
    ev.preventDefault();
    oldx = 0;
    oldy = 0;
    mousedown = false;
    pixelthreshold();

    
  }
  function onmousedown(ev) {
    ev.preventDefault();
    mousedown = true;
  }
  function onmousemove(ev) {
    ev.preventDefault();
    if (mousedown) {
      paint(ev.clientX, ev.clientY);
      ev.preventDefault();
    }
  }

  /* Touch event listeners */

  function ontouchstart(ev) {
    touched = true;
  }
  function ontouchend(ev) {
    touched = false;
    oldx = 0;
    oldy = 0;
    pixelthreshold();
  }
  function ontouchmove(ev) {
    if (touched) {
      paint(
        ev.changedTouches[0].pageX,
        ev.changedTouches[0].pageY
      );
      ev.preventDefault();
    }
  }

  /* Button event handlers */

  errorbutton.addEventListener('click', retry, false);
  infobutton.addEventListener('click', showinfo, false);
  installbutton.addEventListener('click', install, false);
  reloadbutton.addEventListener('click', cancel, false);
  soundbutton.addEventListener('click', togglesound, false);
  winbutton.addEventListener('click', winner, false);
  startbutton.addEventListener('click', start, false);

  /* Canvas event handlers */

  c.addEventListener('mouseup', onmouseup, false);
  c.addEventListener('mousedown', onmousedown, false);
  c.addEventListener('mousemove', onmousemove, false);
  c.addEventListener('touchstart', ontouchstart, false);
  c.addEventListener('touchend', ontouchend, false);
  c.addEventListener('touchmove', ontouchmove, false);

  window.addEventListener('load',init, false);
  window.addEventListener('resize',init, false);

  /* Cache update ready? Reload the page! */
  var cache = window.applicationCache;
  function refresh() {
    if (cache.status === cache.UPDATEREADY) {
     cache.swapCache();
     window.location.reload();
    }
  }
  cache.addEventListener('updateready', refresh, false);

})();