/*!*****************************************************************************
 * ▓▓▓▒ adj4rMnky ▄▀▀▀ ▐▀▄▀▌█▀▀▄ █    ▐▀▀▄ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓
 * ▓▓▒▒▒▒▒▒▒▒▒▒▒  █    █ ▀ ▌█  █ █  ▄ █  ▐  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓
 * ▓▒▒▒▒▒▒▒▒▒▒▒▒▒  ▀▀▀ █   ▀▀▀▀  ▀▀▀  ▀  ▐.js ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓
 *
 * Web browser DevTools code snippet that implements a utility interface for
 *  use with a web browser's JS console's command line or the TamperMonkey web
 *  browser extension to provide enhanced tools for front-end web development.
 *
 * Utilities offered by the script are intended to be utilized alongside
 *  DevTools when working on the development of a site. Utilities include a CSS
 *  scanner that can quickly compare what is available in a website's
 *  stylesheets with the CSS classes it actually uses.
 *
 * @version 0.5.0
 *
 * @author danielcrieck@gmail.com
 *  <danielcrieck@gmail.com>
 *  (https://github.com/invokeImmediately)
 *
 * @link https://github.com/invokeImmediately/AdjusterMonkey…
 *  …/blob/main/DevTools/adj4rMnkyCmdLn.js
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
    #prefix4Msgs = '( 🐵 AdjusterMonkey 🛠️ ) =>';

    constructor() {
      this.cssScanner = new CssScanner( this );
      this.logMsg(
`A new instance of AdjusterMonkey for use with the DevTools command-line
 interface has been created.`
      );
    }

    getLabeledMsg( msg ) {
      return `${this.#prefix4Msgs} ${msg}`;
    }

    logMsg( msgText ) {
      console.log( this.getLabeledMsg( msgText ) );
    }
  }

  class CssScanner {
    #adj4rMnkyCmdLn;
    #classesUsedInPage;
    #linkedCssFiles;
    #linksAttrsList;
    #referenceCssFiles = [];
    #scannedCssFile;

    constructor( adj4rMnkyCmdLn ) {
      this.#adj4rMnkyCmdLn = adj4rMnkyCmdLn;
      this.scanForCssFiles();
      this.#adj4rMnkyCmdLn.logMsg(
`New CSS Scanner added to the AdjusterMonkey instance used with the DevTools
 command-line interface.`
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
        throw new TypeError( this.#adj4rMnkyCmdLn.getLabeledMsg(
`When attempting to fetch stylesheet code, a URL I was given for a stylesheet:
 « ${url} » does not take the expected form.`
        ) );
      }
      await fetch( url, { headers: { 'Content-Type': 'text/css' } } )
        .then( ( response ) => {
          if ( !response.ok ) {
            throw new Error( this.#adj4rMnkyCmdLn.getLabeledMsg(
`Unable to access resource: « ${url} ». Status returned was: «
 ${response.status} ».`
            ) );
          }
          return response.text();
        } )
        .then( ( response ) => {
          finalResponse = response;
        } )
        .catch( ( error ) => {
          console.error( error.message );
          this.#adj4rMnkyCmdLn.logMsg(
`Since I was unable to use the fetch API to request the stylesheet, I will
now reconstruct it using « document.styleSheets ».`
          );
          finalResponse = this.#recon5tCssFromDoc( url );
        } );
      return finalResponse;
    }

    #findDocSSIndexFromURL( urlOfSS ) {
      let scanner = 0;
      let foundIndex = null;
      while( scanner < document.styleSheets.length && foundIndex === null ) {
          if( document.styleSheets.item( scanner ).href == urlOfSS ) {
              foundIndex = scanner;
          }
          scanner++;
      }
      return foundIndex;
    }

    #recon5tCssFromDoc( urlOfCssSrc ) {
      let allCssText = '';
      try {
        const indexOfSS = this.#findDocSSIndexFromURL( urlOfCssSrc );
        const docSSRules = document.styleSheets.item( indexOfSS ).cssRules;
        for( let index = 0; index < docSSRules.length; index++ ) {
          allCssText += docSSRules.item( index ).cssText;
        }
      } catch( error ) {
        console.error( this.#adj4rMnkyCmdLn.getLabeledMsg( error.message ) );
        this.#adj4rMnkyCmdLn.logMsg(
`Since I was unable to reconstruct the stylesheet from « document.styleSheets »,
I suggest you manually load the stylesheet code for further analysis into my
list of dynamically loaded reference style sheets.`
        );
      }
      return allCssText;
    }

    #sortAttrsFromSsLinks( attrsSet ) {
      const attrs = [];
      for( const attr of attrsSet ) {
        attrs.push( attr );
      }
      return attrs.toSorted();
    }

    async addReferenceCssFile( urlOrCssText ) {
      if ( typeof urlOrCssText !== 'string' ) {
        return;
      }
      if ( urlOrCssText.match( /https?:\/\/.*/ ) ) {
        urlOrCssText = await this.#fetchStylesheetCode( urlOrCssText );
      }
      if ( urlOrCssText == '' ) {
        return;
      }
      const newSS = new CSSStyleSheet();
      newSS.replaceSync( urlOrCssText );
      this.#referenceCssFiles.push( newSS );
      this.#adj4rMnkyCmdLn.logMsg(
`Reference CSS stylesheet added at index ${this.#referenceCssFiles.length - 1}
 with ${ newSS.cssRules.length } accepted style rules.`,
      );
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

    printDocSSList() {
      const docSSDetails = [];
      for( let index = 0; index < document.styleSheets.length; index++ ) {
        docSSDetails.push( {
          href: document.styleSheets.item( index ).href,
          tagName: document.styleSheets.item( index ).ownerNode.tagName,
          tagID: document.styleSheets.item( index ).ownerNode.id,
          innerTextHead: document.styleSheets.item( index )
            .ownerNode.innerText.substring( 0, 64 ),
        } );
        if ( docSSDetails[ index ].innerTextHead.length == 64 ) {
          docSSDetails[ index ].innerTextHead += "…";
        }
      }
      console.table( docSSDetails, [ 'href', 'tagName', 'tagID', 'innerTextHead' ] );
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
        throw new TypeError( this.#adj4rMnkyCmdLn.getLabeledMsg(
`I was given the following input for scanning a CSS file:
 « ${whichFile} »
 This input was not a string or number as expected.`
        ) );
      }
      if ( typeof whichFile === 'string' &&
        !Number.isNaN( parseInt( whichFile ) )
      ) {
        whichFile = parseInt( whichFile );
      }
      if ( typeof whichFile === 'number' && (
        whichFile < 0 || whichFile >= this.#linkedCssFiles.length
      ) ) {
        throw new RangeError( this.#adj4rMnkyCmdLn.getLabeledMsg(
`I was given the following index as input for scanning a CSS file: «
 ${whichFile} ». This index is out of range with respect to the number of linked
 CSS files loaded by this page.`
        ) );
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
    if ( typeof window.adj4rMnkyCmdLn == 'undefined' ) {
      window.adj4rMnkyCmdLn = adj4rMnkyCmdLn;
      adj4rMnkyCmdLn.logMsg(
`An AdjusterMonkey instance for use with the DevTools command-line has been
 added to the window object associated with the document
 “${window.document.title}” at location “${window.location}.”`
      );
    } else {
      adj4rMnkyCmdLn.logMsg(
`When attempting to add an AdjusterMonkey instance for use with the DevTools
 command-line interface to the window object, it was found that the
 adj4rMnkyCmdLn property was already present. Consequently, the instance was not
 added to the window object.`
      );
    }
    return adj4rMnkyCmdLn;
  }

  return main();
} )();
