var expect = require('chai').expect;
var showdown = require('showdown');
require('../index');

describe('markflat.showdown', function () {
  it('should add default options', function () {
    expect(showdown.getOption('mbZoom')).to.be.equal(100);
    expect(showdown.getOption('mbEnableZoom')).to.be.equal(false);

    expect(showdown.getOption('mbTransposeBy')).to.be.equal(0);
    expect(typeof showdown.getOption('mbTranspose')).to.be.equal("function");

    expect(showdown.getOption('mbStyle').length).to.be.equal(829);
    expect(showdown.getOption('mbAddStyle')).to.be.equal(false);

    expect(showdown.getOption('mbAddMinorChordMarker')).to.be.equal(false);
  });
  it('should convert title/artist header, chords, and ~ blocks', function () {
    var converter = new showdown.Converter({ extensions: ['markflat'] });
    expect(converter.makeHtml("# Title - Artist\n1. first verse {F} lyrics\n~Chorus {a7}lyrics of {C}chorus"))
      .to.be.equal('<h1 id="titlespanclassmbartistartistspan">Title<span class="mb-artist"> - Artist</span></h1>\n<ol>\n<li class="mb-has-chords">first verse <span class="mb-ca"><span class="mb-chord">F</span>&nbsp;&nbsp;&nbsp;</span>lyrics</li>\n</ol>\n<ul><li class="mb-has-chords" list="Chorus"><span class="mb-ca"><span class="mb-chord">a<sup>7</sup></span>l</span>yrics of <span class="mb-ca"><span class="mb-chord">C</span>c</span>horus</li></ul>');
  });
});
