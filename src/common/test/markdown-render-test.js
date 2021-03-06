/*
 * Copyright Adam Pritchard 2013
 * MIT License : http://adampritchard.mit-license.org/
 */

"use strict";
/*global chrome:false, markdownRender:false,
  htmlToText:false, marked:false, hljs:false*/
/*jshint devel:true*/


describe('Markdown-Render', function() {
  it('should exist', function() {
    expect(markdownRender).to.exist;
  });

  describe('convertHTMLtoMarkdown', function() {
    var convertHTMLtoMarkdown = markdownRender._testExports.convertHTMLtoMarkdown;

    it('should throw an exception for unsupported tags', function() {
      expect(_.partial(convertHTMLtoMarkdown, 'badtag')).to.throw(Error);
    });

    it('should not modify the string if there is no match', function() {
      var s = 'aaa <b>bbb</b> ccc <div>ddd</div> eee';
      expect(convertHTMLtoMarkdown('a', s)).to.equal(s);
    });

    it('should replace the given tag', function() {
      var s, target;

      s = 'aaa <b>bbb</b> ccc <div>ddd</div> eee <a href="fff">ggg</a> hhh';
      target = 'aaa <b>bbb</b> ccc <div>ddd</div> eee [ggg](fff) hhh';
      expect(convertHTMLtoMarkdown('a', s)).to.equal(target);

      s = 'aaa <b>bbb</b> ccc <div>ddd</div> eee <a href="fff">ggg</a> hhh <a href="iii">jjj <em>kkk</em></a> lll';
      target = 'aaa <b>bbb</b> ccc <div>ddd</div> eee [ggg](fff) hhh [jjj <em>kkk</em>](iii) lll';
      expect(convertHTMLtoMarkdown('a', s)).to.equal(target);
    });
  });

  describe('preprocessHtml', function() {
    var preprocessHtml = markdownRender._testExports.preprocessHtml;

    it ('should be okay with an empty string', function() {
      expect(preprocessHtml('', null).html).to.equal('');
    });
  });

  describe('markdownRender', function() {
    var userprefs = {};

    beforeEach(function() {
      userprefs = {
        'math-value': null,
        'math-enabled': false
      };
    });

    it('should be okay with an empty string', function() {
      expect(markdownRender(userprefs, htmlToText, marked, hljs, '', document, null)).to.equal('');
    });

    // Busted due to https://github.com/adam-p/markdown-here/issues/51, which
    // is busted due to https://github.com/chjj/marked/issues/56
    it('should NOT correctly handle links with URL text (busted due to issue #51)', function() {
      var s = '[http://example1.com](http://example2.com)';

      // Real target
      //var target = '<a href="http://example1.com>http://example2.com</a>';
      var target = '<a href="http://example1.com">http://example1.com</a>';
      expect(markdownRender(userprefs, htmlToText, marked, hljs, s, document, null)).to.contain(target);
    });

    it('should NOT quite correctly handle pre-formatted links with URL text (busted due to issue #51)', function() {
      var s = '<a href="http://example1.com">http://example2.com</a>';

      // Real target
      //var target = '<a href="http://example1.com>http://example2.com</a>';
      var target = '<a href="http://example1.com"><a href="http://example2.com">http://example2.com</a></a>';
      expect(markdownRender(userprefs, htmlToText, marked, hljs, s, document, null)).to.contain(target);
    });

    it('should retain pre-formatted links', function() {
      var s = '<a href="http://example1.com">aaa</a>';
      expect(markdownRender(userprefs, htmlToText, marked, hljs, s, document, null)).to.contain(s);
    });

  });

});
