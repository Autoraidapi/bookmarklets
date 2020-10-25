/*
 * Media Source
 * window.open([selector][index].currentSrc);
 */
(function(xs){
    for(var i = 0;i < xs.length;++i){
      if(xs[i].currentSrc){
        return window.open(xs[i].currentSrc);
      }
    }
  })(document.querySelectorAll('audio,video'));
