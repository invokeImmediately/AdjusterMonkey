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
 * @version 0.8.1-rc1
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

    #wrapMsgByAtCharLen( msg, len ) {
      if ( typeof len == 'undefined' ) {
        len = 80;
      }
      if ( typeof len != 'number' && Number.isNaN( parseInt( len ) ) ) {
        return msg;
      } else if ( typeof len != 'number' ) {
        len = parseInt( len );
      }
      if ( len < 40 ) {
        len = 40;
      } else if ( len > 100 ) {
        len = 100;
      }
      let iterCount = 0;
      while(
        msg.length > 0 &&
        ( msg.match( /[ \n]+\n/gi ) !== null ||
        msg.match( /\n[ \n]+/gi ) !== null ) &&
        iterCount < 1024
      ) {
        msg = msg.replaceAll( /[ \n]+\n/gi, ' ' );
        msg = msg.replaceAll( /\n[ \n]+/gi, ' ' );
        iterCount++
      }
      msg = msg.replaceAll( /\n+/gi, ' ' );
      if ( msg.length < len ) {
        return msg;
      }
      let newMsg = '';
      let i_start = 0;
      let j_scan;
      let iterCount2 = 0;
      while( i_start < msg.length && iterCount2 < 1024) {
        j_scan = i_start + len;
        while(
          j_scan < msg.length && j_scan > i_start &&
          msg.charAt( j_scan ).match( /[- \/\\«»\(\)]/ ) === null
        ) {
          j_scan--;
        }
        if ( j_scan == i_start ) {
          j_scan = j_scan + len;
        } else if ( j_scan > msg.length ) {
          j_scan = msg.length;
        }
        if (
          msg.charAt( j_scan ).match( /[-\/\\«»\(\)]/ ) !== null &&
          i_start == 0
        ) {
          msg = msg.substring( 0, j_scan + 1 ) + " "
            + msg.substring( j_scan + 1, msg.length );
          j_scan++;
        } else if (
          msg.charAt( j_scan ).match( /[-\/\\«»\(\)]/ ) !== null
        ) {
          msg = msg.substring( 0, j_scan + 1 ) + " "
            + msg.substring( j_scan + 1, msg.length );
          j_scan++;
          msg = msg.substring( 0, i_start ) + " "
            + msg.substring( i_start, msg.length );
          j_scan++;
        }
        if ( j_scan == i_start + len && msg.charAt( i_start ) != ' ' ) {
          msg = msg.substring( 0, i_start ) + " "
            + msg.substring( i_start, msg.length );
        }
        if ( j_scan == msg.length && msg.charAt(i_start) != ' ' ) {
          msg = msg.substring( 0, i_start + 1 ) + " "
            + msg.substring( i_start, msg.length );
          j_scan = j_scan - i_start < len ?
            j_scan + 1 :
            j_scan;
        }
        if ( i_start != 0 ) {
          newMsg += '\n';
        }
        newMsg += msg.substring( i_start, j_scan );
        i_start = j_scan;
        iterCount2++;
      }
      newMsg.replaceAll( /^¶/g, '\n' );
      return newMsg;
    }

    getLabeledMsg( msg, wrapLen ) {
      return this.#wrapMsgByAtCharLen( `${this.#prefix4Msgs} ${msg}`, wrapLen );
    }

    logMsg( msgText, wrapLen ) {
      console.log( this.getLabeledMsg( msgText, wrapLen ) );
    }

    async waitForDoc4tFocus() {
      const checkDoc4tFocus = ( resolve ) => {
        if ( document.hasFocus() ) {
          resolve();
        } else {
          setTimeout( () => checkDoc4tFocus( resolve ), 250 );
        }
      }
      return new Promise( checkDoc4tFocus );
    }

    waitForTime( timeInMs ) {
      return new Promise( ( resolve ) => {
        setTimeout( () => {
          resolve( '' );
        }, timeInMs );
      } );
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
        url.match( /^https?:\/\/.+\.css(?:\?.+)?\/?$/i )
      ) ) {
        throw new TypeError( this.#adj4rMnkyCmdLn.getLabeledMsg(
`When attempting to fetch style sheet code, a URL I was given for a style sheet:
 ^¶«${url}»^¶ does not take the expected form.`
        ) );
      }
      await fetch( url )
        .then( ( response ) => {
          if ( !response.ok ) {
            throw new Error( this.#adj4rMnkyCmdLn.getLabeledMsg(
`Unable to access resource: ^¶« ${url} »^¶ Status returned was:
 «${response.status}».`
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
`Since I was unable to use the fetch API to request the style sheet, I will
 now reconstruct it using «document.styleSheets».`
          );
          finalResponse = this.#recon5tCssFromDoc( url );
        } );
      return finalResponse;
    }

    #findClassesUsedInMediaRule( mediaRule, setOfClasses ) {
      const cssRules = mediaRule.cssRules
      for ( let i = 0; i < cssRules.length; i++ ) {
        if ( cssRules.item( i ) instanceof CSSStyleRule ) {
          this.#findClassesUsedInStyleRule(
            cssRules.item( i ),
            setOfClasses
          );
        }
      }
    }

    #findClassesUsedInStyleRule( styleRule, setOfClasses ) {
      if ( styleRule.selectorText === undefined ) {
        return;
      }
      const classesFound = styleRule.selectorText
        .match( /\.-?[_a-zA-Z]+[_a-zA-Z0-9-]*/g );
      if( classesFound === null ) {
        return;
      }
      classesFound.forEach( ( match ) => {
        setOfClasses.add( match.substring( 1, match.length ) );
      } );
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
        if( indexOfSS === null ) {
          throw new Error( this.#adj4rMnkyCmdLn.getLabeledMsg(
`I was unable to find the requested style sheet among those loaded on the page.`
          ) );
        }
        const docSSRules = document.styleSheets.item( indexOfSS ).cssRules;
        for( let index = 0; index < docSSRules.length; index++ ) {
          allCssText += docSSRules.item( index ).cssText;
        }
      } catch( error ) {
        console.error( this.#adj4rMnkyCmdLn.getLabeledMsg( error.message ) );
        this.#adj4rMnkyCmdLn.logMsg(
`Since I was unable to reconstruct the style sheet from «document.styleSheets»,
 I suggest you manually load the style sheet code for further analysis into my
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

    async addRefStyleSheet( urlOrCssText ) {
      if ( typeof urlOrCssText !== 'string' ) {
        return;
      }
      if ( urlOrCssText.match( /^https?:\/\/.*/ ) ) {
        urlOrCssText = await this.#fetchStylesheetCode( urlOrCssText );
      }
      if ( urlOrCssText == '' ) {
        return;
      }
      const newSS = new CSSStyleSheet();
      newSS.replaceSync( urlOrCssText );
      this.#referenceCssFiles.push( newSS );
      this.#adj4rMnkyCmdLn.logMsg(
`Reference CSS style sheet added at index ${this.#referenceCssFiles.length - 1}
 with ${ newSS.cssRules.length } accepted style rules.`,
      );
    }

    async addRefStyleSheetFromClipboard() {
      this.#adj4rMnkyCmdLn.logMsg(
`Ready to load the text on the clipboard as a reference style sheet. Please
 close DevTools and focus on the document when you are ready.`
      );
      await this.#adj4rMnkyCmdLn.waitForDoc4tFocus();
      await navigator.clipboard
        .readText()
        .then( ( clipboardText ) => {
          this.addRefStyleSheet( clipboardText );
        } );
      window.alert( this.#adj4rMnkyCmdLn.getLabeledMsg(
`The CSS code on the clipboard has been added as a reference style sheet and
 will be available for further analysis via the DevTools command line.`, 60
      ) );
    }

    get classesUsedInPage() {
      if ( this.#classesUsedInPage === undefined ) {
        this.scanForClassesUsedInPage();
      }
      return Array.from( this.#classesUsedInPage ).toSorted().join( '\n' );
    }

    getClassesUsedInReferenceSS( index ) {
      if ( index < 0 || index >= this.#referenceCssFiles.length ) {
        return null;
      }
      const setOfClassesInSS = new Set();
      const cssRules = this.#referenceCssFiles[ index ].cssRules;
      // TODO: Make this more robust in handling media queries
      for ( let i = 0; i < cssRules.length; i++ ) {
        if ( cssRules.item( i ) instanceof CSSStyleRule ) {
          this.#findClassesUsedInStyleRule(
            cssRules.item( i ),
            setOfClassesInSS
          );
        }
        if ( cssRules.item( i ) instanceof CSSMediaRule ) {
          this.#findClassesUsedInMediaRule(
            cssRules.item( i ),
            setOfClassesInSS
          );
        }
      }
      return Array.from( setOfClassesInSS ).toSorted().join( '\n' );
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
      console.table( docSSDetails, [ 'href', 'tagName', 'tagID',
        'innerTextHead' ] );
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

        // ·> Find the source URL for the linked CSS file.                    <·
        let hrefVal = link.href;
        if ( hrefVal == '' ) {
          hrefVal = link.dataset.href;
        }
        if ( hrefVal == '' ) {
          return;
        }

        // ·> Determine the section of the DOM, head or body, of the link.    <·
        let domSection = 'neither';
        if ( link.closest( 'head' ) !== null ) {
          domSection = 'head';
        } else if ( link.closest( 'body' ) !== null ) {
          domSection = 'body';
        }

        // ·> Store scan results for later.                                   <·
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
`I was given the following input for scanning a CSS file: ^¶«${whichFile}».
 ^¶ This input was not a string or number as expected.`
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
`I was given the following index as input for scanning a CSS file:
 ^¶ «${whichFile}»^¶ This index is out of range with respect to the number of
 linked CSS files loaded by this page.`
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
    // ·> Only proceed with loading AdjusterMonkey if the window represents a  ·
    // ·  web page the user is actively browsing.                             <·
    if (
      typeof document == 'undefined' ||
      typeof document.hasFocus != 'function' ||
      !document.hasFocus()
    ) {
      return;
    }

    // ·> Create instance of the AdjusterMonkey command-line utility inter-    ·
    // ·  face and add it safely to the window object for global access.      <·
    const adj4rMnkyCmdLn = new Adj4rMnkyCmdLn();
    if ( typeof window.adj4rMnkyCmdLn == 'undefined' ) {
      window.adj4rMnkyCmdLn = adj4rMnkyCmdLn;
//      adj4rMnkyCmdLn.logMsg(
//`An AdjusterMonkey instance for use with the DevTools command-line has been
// added to the window object associated with the document
// “${window.document.title}” at location “${window.location}.”`
      adj4rMnkyCmdLn.logMsg(
`An AdjusterMonkey instance for use with the DevTools command-line has been
 added to the window object associated with the document
 “${document.title}” at location “${window.location.hostname}.”`
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
