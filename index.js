(function (extension) {
  if (typeof showdown !== 'undefined') {
    // global (browser or nodejs global)
    extension(showdown);
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define(['showdown'], extension);
  } else if (typeof exports === 'object') {
    // Node, CommonJS-like
    module.exports = extension(require('showdown'));
  } else {
    // showdown was not found so we throw
    throw Error('Could not find showdown library');
  }
}(function (showdown) {
  // loading extension into shodown
  showdown.extension('markflat', function () {
    var artist = {
      type: 'lang',
      regex: /(# .*?)\s-\s(.*)$/mg,
      replace: '$1<span class="mb-artist"> - $2</span>'
    };
    var elements = {
      type: 'lang',
      filter: function (text, converter, options) {
        return text.replace(/~(.*?)[ \t]+([\s\S ]*?)(?=~|^\d+\. |^$)/mg, function(match, block, content) {
          var tmp = options.mbStyle;
          options.mbStyle = '';
          var ret = '<ul><li list="'+block+'">'+converter.makeHtml(content).replace(/<\/?p>/g, '')+'</li></ul>';
          options.mbStyle = tmp;
          return ret;
        });
      }
    };
    var chords = {
      type: 'lang',
      filter: function (text, converter, options) {
        return text.replace(/\{(.+?)\}([a-zA-Z' ]|_[a-zA-Z ]_|\.|$)/g, function(match, p1, p2) {
          var chord = p1.replace(/^([a-gA-G][#b]?m?)(.*?)(?:\/([a-gA-G][#b]?))?$/g, function(match, key = '', modifier = '', bass = '') {
            if (typeof options.mbTranspose == 'function') {
              key = options.mbTranspose(key);
              bass = options.mbTranspose(bass);
            }
            key = options.mbAddMinorChordMarker ? key.replace(/^([a-g][#b]?(?!m))$/, '$1'.toUpperCase()+'m') : key;
            // key = key.replace(/#/g, '\u266F').replace(/(?!^)b/g, '\u266D');
            modifier = modifier.replace(/(\d+)\+/g, 'maj$1').replace(/^.(2|4)$/g, 'sus$1');//.replace(/#/g, '\u266F').replace(/b/g, '\u266D');
            // bass = bass.replace(/#/g, '\u266F').replace(/([a-gA-G])b/g, '$1\u266D');
            return key+(modifier ? '<sup>'+modifier+'</sup>' : '')+(bass ? '<sub>/'+bass+'</sub>' : '');
          });
          var base = (p2 != '.') ? p2.replace(' ', '&nbsp;&nbsp;&nbsp;') : '';
          return base ? '<span class="mb-ca"><span class="mb-chord">'+chord+'</span>'+base+'</span>' : '<span class="mb-chord-inline">'+chord+'</span>';
        })
        .replace(/\{(\.\.\.|:?\|\|?:?|')\}([a-zA-Z ]|_[a-zA-Z ]_|\.|$)/g, function (match, tag, base) {
          base = (base != '.') ? base.replace(' ', '&nbsp;&nbsp;&nbsp;') : '';
          return base ? '<span class="mb-ca"><span class="mb-chord">'+tag+'</span>'+base+'</span>' : '<span class="mb-chord-inline">…</span>';
        });
        // .replace(/\{(\.\.\.|:?\|\|?:?|')\}([a-zA-Z ]|_[a-zA-Z ]_|\.|$)/g, function (match, tag, p2) {
        //   var base = (base != '.') ? p2.replace(' ', '&nbsp;&nbsp;&nbsp;') : '';
        //   return base ? '<span class="mb-ca"><span class="mb-chord">'+tag+'</span>'+base+'</span>' : '<span class="mb-chord-inline">…</span>';
        // });
      }
    };
    var styling = {
      type: 'output',
      filter: function (text, converter, options) {
        var zoom = options.mbEnableZoom && options.mbZoom != undefined && options.mbZoom > 0 ? '<style>body {font-size: '+options.mbZoom+'%;}</style>' : '';
        return (options.mbAddStyle ? options.mbStyle : "") + zoom + text.replace(/<li(.*?)>([\s\S]*?)<\/li>/g, function (match, tag, content) {
          var addClass = content.match(/class="mb-ca"/) ? ' class="mb-has-chords"' : '';
          return '<li'+addClass+tag+'>'+content+'</li>';
        });
      }
    };
    return [artist, elements, chords, styling];
  });
  showdown.setOption('mbZoom', 100);
  showdown.setOption('mbEnableZoom', false);

  showdown.setOption('mbTransposeBy', 0);
  showdown.setOption('mbTranspose',function(key) {
    if (key && this.mbTransposeBy != undefined && this.mbTransposeBy != 0) {
      var isMinor = key.match(/^[a-g]/);
      var scale = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
      if (key.length > 1 && key[key.length - 1] == 'b') {
        scale = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
      }
      key = key.length > 1 ? key[0].toUpperCase() + key.substr(1, key.length - 1) : key.toUpperCase();
      if (scale.indexOf(key) >= 0) {
        var i = (scale.indexOf(key) + this.mbTransposeBy) % scale.length;
        key = scale[ i < 0 ? i + scale.length : i ];
        if (isMinor) {
            key = key.toLowerCase();
        }
      }
    }
    return key;
  });
  showdown.setOption('mbAddMinorChordMarker', false);

  showdown.setOption('mbAddStyle', false);
  showdown.setOption('mbStyle', `<style>
    .mb-artist {
      float: right;
      font-size: 0.9em;
    }
    .mb ul {
      list-style: none;
    }
    .mb ul, ol {
      margin: 0;
      padding: 0 0 0 4.5em;
    }
    .mb ul li, .mb ol li {
      margin: 6px 0;
      line-height: 1.2em;
    }
    .mb ul li::before {
      position: absolute;
      width: 4em;
      left: 0;
      content: attr(list);
      text-align: right;
    }
    .mb-has-chords {
      line-height: 1.9em;
    }
    .mb-ca {
      position: relative;
    }
    .mb-chord {
      position: absolute;
      font-size: 0.9em;
      bottom: 0.6em;
    }
    .mb-chord, .mb-chord-inline {
      font-weight: bold;
      white-space: nowrap;
    }
    .mb-chord sup {
      font-size: 0.6em;
    }
    .mb em {
      font-style: normal;
      text-decoration: underline;
    }
  </style>`);
}));
