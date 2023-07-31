/*!*****************************************************************************
 * ▓▓▓▒ adj4rMnky ▄▀▀▀ ▐▀▄▀▌█▀▀▄ █    ▐▀▀▄ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓
 * ▓▓▒▒▒▒▒▒▒▒▒▒▒  █    █ ▀ ▌█  █ █  ▄ █  ▐  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓
 * ▓▒▒▒▒▒▒▒▒▒▒▒▒▒  ▀▀▀ █   ▀▀▀▀  ▀▀▀  ▀  ▐.js ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓
 *
 * Web browser DevTools code snippet that implements a command line interface
 *  for the JS console that provides Adjuster Monkey utilities to a front-end
 *  web developer.
 *
 * Utilities are intended to be utilized alongside DevTools when working on the
 *  development of a site. Utilities include a CSS scanner that can quickly
 *  identify a website's linked stylesheets.
 *
 * @version 0.0.0
 *
 * @author danielcrieck@gmail.com
 *  <danielcrieck@gmail.com>
 *  (https://github.com/invokeImmediately)
 *
 * @link https://github.com/invokeImmediately/WSU-DAESA-JS…
 *  …/blob/main/Chrome-Snippets/github-extract-wds-constituents.js
 *
 * @license MIT — Copyright 2021. by Washington State University
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *   of this software and associated documentation files (the "Software"), to
 *   deal in the Software without restriction, including without limitation the
 *   rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 *   sell copies of the Software, and to permit persons to whom the Software is
 *   furnished to do so, subject to the following conditions:
 *  The above copyright notice and this permission notice shall be included in
 *   all copies or substantial portions of the Software.
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *   FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 *   DEALINGS IN THE SOFTWARE.
 */

const adj4rMnkyCmdLn = ( function() {
  class Adj4rMnkyCmdLn {
    constructor() {
      this.cssScanner = new CssScanner();
      console.log(
`New Adjuster Monkey command line interface created.`
      );
    }
  }

  class CssScanner {
    constructor() {
      this.scanForCssFiles();
      console.log(
`New CSS Scanner created for an Adjuster Monkey command line interface.`
      );
    }

    #extractAttrsFromSsLink( link, attrsSet ) {
      const numAttrs = link.attributes.length;
      for( let index = 0; index < numAttrs; index++ ) {
        attrsSet.add( link.attributes[ index ].name );
      }
    }

    printLinksAttrsList() {
      console.log( this.linksAttrsList );
    }

    printLinkedCssFiles() {
      console.table( this.linkedCssFiles, [ 'htmlId', 'ssUrl' ] );
    }

    scanForCssFiles() {
      const linkedCssFiles = document.querySelectorAll(
        'head link[rel="stylesheet"]'
      );
      const scanResults = [];
      const linksAttrsList = new Set();
      linkedCssFiles.forEach( ( link, index ) => {
        this.#extractAttrsFromSsLink( link, linksAttrsList );
        let hrefVal = link.href;
        if ( hrefVal == '' ) {
          hrefVal = link.dataset.href;
        }
        if ( hrefVal == '' ) {
          return;
        }
        scanResults.push( {
          htmlId: link.id,
          ssUrl: hrefVal,
        } );
      } )
      this.linksAttrsList = this.#sortAttrsFromSsLinks( linksAttrsList );
      this.linkedCssFiles = scanResults;
    }

    #sortAttrsFromSsLinks( attrsSet ) {
      const attrs = [];
      for( const attr of attrsSet ) {
        attrs.push( attr );
      }
      return attrs.toSorted();
    }
  }

  function main() {
    const adj4rMnkyCmdLn = new Adj4rMnkyCmdLn();
    return adj4rMnkyCmdLn;
  }

  return main();
} )();