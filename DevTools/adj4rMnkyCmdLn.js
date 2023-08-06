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
 * @version 0.3.0
 *
 * @author danielcrieck@gmail.com
 *  <danielcrieck@gmail.com>
 *  (https://github.com/invokeImmediately)
 *
 * @link https://github.com/invokeImmediately/WSU-DAESA-JS…
 *  …/blob/main/Chrome-Snippets/github-extract-wds-constituents.js
 *
 * @license MIT — Copyright 2023 by Daniel C. Rieck.
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
  'use strict';

  class Adj4rMnkyCmdLn {
    constructor() {
      this.cssScanner = new CssScanner();
      console.log(
`( 🐵🛠️ AdjusterMonkey Notice ) => New instance of AdjusterMonkey DevTools
 command-line utility created.`
      );
    }
  }

  class CssScanner {
    #classesUsedInPage;
    #linkedCssFiles;
    #linksAttrsList;
    #scannedCssFile;

    constructor() {
      this.scanForCssFiles();
      console.log(
`( 🐵🛠️ AdjusterMonkey Notice ) => New CSS Scanner added to an AdjusterMonkey
 DevTools command-line utility.`
      );
    }

    #extractAttrsFromSsLink( link, attrsSet ) {
      const numAttrs = link.attributes.length;
      for( let index = 0; index < numAttrs; index++ ) {
        attrsSet.add( link.attributes[ index ].name );
      }
    }

    #extractClassesUsedInPage() {
      const cssClassSet = new Set();
      const bodyElems = document.querySelectorAll( 'body, body *' );
      bodyElems.forEach( ( elem, index ) => {
        for ( let index = 0; index < elem.classList.length; index++ ) {
          cssClassSet.add( elem.classList.item( index ) );
        }
      } );
      return cssClassSet;
    }

    async #fetchStylesheetCode( url ) {
      let finalResponse = null;
      if ( !(
        typeof url == 'string' &&
        url.match( /^https?:\/\/.+\.css(?:\?.+)?$/i )
      ) ) {
        throw new TypeError(
`( 🐵🛠️ AdjusterMonkey Notice ) => When attempting to fetch stylesheet code, a
 URL I was given for a stylesheet:
 « ${url} »
 does not take the expected form.`
        );
      }
      // TODO: Add error catching for situations including CORS violations.
      await fetch( url, { headers: { 'Content-Type': 'text/css' } } )
        .then( ( response ) => {
          if ( !response.ok ) {
            throw new Error(
`( 🐵🛠️ AdjusterMonkey Notice ) => Unable to access resource:
 « ${url} »
 Status returned was:
 « ${response.status} »`
            );
          }
          return response.text();
        } )
        .then( ( response ) => {
          finalResponse = response;
        } );
      return finalResponse;
    }

    #sortAttrsFromSsLinks( attrsSet ) {
      const attrs = [];
      for( const attr of attrsSet ) {
        attrs.push( attr );
      }
      return attrs.toSorted();
    }

    get classesUsedInPage() {
      if ( this.#classesUsedInPage === undefined ) {
        this.scanForClassesUsedInPage();
      }
      return Array.from( this.#classesUsedInPage ).toSorted().join( '\n' );
    }

    printClassesUsedInPage() {
      if ( this.#classesUsedInPage === undefined ) {
        this.scanForClassesUsedInPage();
      }
      console.log( Array.from( this.#classesUsedInPage ).toSorted() );
    }

    printLinksAttrsList() {
      console.log( this.#linksAttrsList );
    }

    printLinkedCssFiles() {
      console.table( this.#linkedCssFiles, [ 'htmlId', 'section', 'ssUrl' ] );
    }

    scanForClassesUsedInPage() {
      this.#classesUsedInPage = this.#extractClassesUsedInPage();
    }

    scanForCssFiles() {
      const cssFileLinks = document.querySelectorAll(
        'link[rel="stylesheet"]'
      );
      const scanResults = [];
      const linksAttrsList = new Set();
      cssFileLinks.forEach( ( link, index ) => {
        this.#extractAttrsFromSsLink( link, linksAttrsList );

        // Find the source URL for the linked CSS file
        let hrefVal = link.href;
        if ( hrefVal == '' ) {
          hrefVal = link.dataset.href;
        }
        if ( hrefVal == '' ) {
          return;
        }

        // Determine the section of the DOM, head or body, of the link
        let domSection = 'neither';
        if ( link.closest( 'head' ) !== null ) {
          domSection = 'head';
        } else if ( link.closest( 'body' ) !== null ) {
          domSection = 'body';
        }

        // Store scan results for later
        scanResults.push( {
          htmlId: link.id,
          section: domSection,
          ssUrl: hrefVal,
        } );
      } );
      this.#linksAttrsList = this.#sortAttrsFromSsLinks( linksAttrsList );
      this.#linkedCssFiles = scanResults;
    }

    async scanCssFile( whichFile ) {
      if ( !(
        typeof whichFile === 'string' || typeof whichFile === 'number'
      ) ) {
        throw new TypeError(
`I was given the following input for scanning a CSS file:
 « ${whichFile} »
 This input was not a string or number as expected.`
        );
      }
      if ( typeof whichFile === 'string' &&
        !Number.isNaN( parseInt( whichFile ) )
      ) {
        whichFile = parseInt( whichFile );
      }
      if ( typeof whichFile === 'number' && (
        whichFile < 0 || whichFile >= this.#linkedCssFiles.length
      ) ) {
        throw new RangeError(
`( 🐵🛠️ AdjusterMonkey Notice ) => I was given the following index as input for
 scanning a CSS file:
 « ${whichFile} »
 This index is out of range with respect to the number of linked CSS files
 loaded by this page.`
        );
      }
      if ( typeof whichFile === 'number' ) {
        whichFile = this.#linkedCssFiles[ whichFile ].ssUrl;
      }
      this.#scannedCssFile = this.#fetchStylesheetCode( whichFile );
      return this.#scannedCssFile;
    }
  }

  function main() {
    const adj4rMnkyCmdLn = new Adj4rMnkyCmdLn();
    if ( window.adj4rMnkyCmdLn === undefined ) {
      window.adj4rMnkyCmdLn = adj4rMnkyCmdLn;
      console.log(
`( 🐵🛠️ AdjusterMonkey Notice ) => An instance of the AdjusterMonkkey DevTools
 command-line utility has been added to the window object for use with the
 DevTools console.`
      );
    } else {
      console.log(
`( 🐵🛠️ AdjusterMonkey Notice ) => When attempting to add an instance of the
 AdjusterMonkkey DevTools command-line utility to the window object for use with
 the DevTools console, it was found that the adj4rMnkyCmdLn property was already
 present. Consequently, the instance was not added.`
      );
    }
    return adj4rMnkyCmdLn;
  }

  return main();
} )();
