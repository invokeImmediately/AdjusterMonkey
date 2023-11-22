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
 *  DevTools when working on the development of a site. Utilities include:
 *  • A CSS scanner that can quickly compare what is available in a website's
 *    style sheets with the CSS classes in use on the page.
 *  • A DOM scanner that can quickly analyze and report properties of the page's
 *    structure, such as heading hierarchy.
 *
 * @version 0.12.0->rc+0.1.0
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

const adj4rMnkyCmdLn = ( function( iife ) {
  'use strict';

  class Adj4rMnkyCmdLn {
    #prefix4Msgs = '( 🐵 AdjusterMonkey 🛠️ ) =>';

    constructor() {
      this.cssScanner = new CssScanner( this );
      this.domScanner = new DomScanner( this );
    }

    createDataTree( rootData ) {
      return new DataTree( rootData );
    }

    isUrlString( value ) {
      return (
        typeof value == 'string' &&
        value.match(
          new RegExp( '^https?:\/\/(?:[-A-Za-z0-9]+\\.)*[-A-Za-z0-9]+\\.[-A-Z' +
            'a-z0-9]+(?:\/.*)?$' )
        ) !== null
      );
    }

    getLabeledMsg( msg, wrapLen ) {
      return this.#wrapMsgAtCharLen( `${this.#prefix4Msgs} ${msg}`, wrapLen );
    }

    logMsg( msgText, wrapLen ) {
      console.log( this.getLabeledMsg( msgText, wrapLen ) );
    }

    openUrlInNewWindow( url ) {
      if( !this.isUrlString( url ) ) {
        adj4rMnkyCmdLn.logMsg( `If you want me to open a document style sheet,
          please give me a string containing URL. The argument you gave me was
          «${whichStyleSheet}».`
        );
        return;
      }
      window.open(
        url,
        '_blank'
      ).focus();
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

    #wrapMsgAtCharLen( msg, len ) {
      // ·> Use a default line wrapping length.                               <·
      if ( typeof len == 'undefined' ) {
        len = 80;
      }

      // ·> Convert the line wrapping length to a number if possible.         <·
      if ( typeof len != 'number' && Number.isNaN( parseInt( len ) ) ) {
        return msg;
      } else if ( typeof len != 'number' ) {
        len = parseInt( len );
      }

      // ·> Enforce minimum and maximum line wrapping lengths to ensure a      ·
      // ·  clean looking result.                                             <·
      if ( len < 40 ) {
        len = 40;
      } else if ( len > 100 ) {
        len = 100;
      }

      // ·> Re-indent the original message to allow template literals to be    ·
      // ·  used following clean coding practices when specifying the argu-    ·
      // ·  ment.                                                             <·
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

      // ·> Replace a special tab escape sequence with indentation at this     ·
      // ·  later point following re-indentation so it correctly persists      ·
      // ·  into the final line-wrapped message.                              <·
      msg = msg.replaceAll( /\^↹/g, '  ' );

      // ·> Scan through each character of the message to look for break-      ·
      // ·  point characters at appropriate wrapping locations to satisfy a    .
      // ·  specified line length limit. Insert newlines when they are en-     ·
      // ·  countered to produce a wrapped message where each line's length    ·
      // ·  is less than the desired limit and line breaks fall at desirable   ·
      // ·  break points.                                                     <·
      let newMsg = '';
      let startI3x = 0;   // Starting index
      let scanI3x;        // Scanning index
      while( startI3x < msg.length ) {
        scanI3x = startI3x + len;

        // ·> Start scanning at a distance of the line length limit away from  ·
        // ·  the starting index, and work backward until a break-point char-  ·
        // ·  acter is encountered.                                           <·
        while(
          scanI3x < msg.length && scanI3x > startI3x &&
          msg.charAt( scanI3x ).match( /[- \/\\«»\(\)]/ ) === null
        ) {
          scanI3x--;
        }

        // ·> Handle edge cases where scanning found no break point or reached ·
        // ·  the end of the message.                                         <·
        if ( scanI3x == startI3x ) {
          scanI3x = scanI3x + len;
        } else if ( scanI3x > msg.length ) {
          scanI3x = msg.length;
        }

        // ·> Introduce a line break in such a manner that the first charac-   ·
        // ·  ter at beginning of the line is a space, with the first line     ·
        // ·  being excepted. This achieves a hanging indent that can help     ·
        // ·  with visually distinguishing distinct messages in the console.  <·
        // ·> To-do: Avoid manipulating the original string when working to    ·
        // ·  create a hanging indent to improve performance.                 <·
        if (
          msg.charAt( scanI3x ).match( /[-\/\\«»\(\)]/ ) !== null &&
          ( startI3x == 0 || msg.charAt( startI3x ) == ' ' )
        ) {
          msg = msg.substring( 0, scanI3x + 1 ) + " "   // <– Add an indent-
            + msg.substring( scanI3x + 1, msg.length ); // <– ation to the
          scanI3x++;                                    // <– next line.
        } else if (
          msg.charAt( scanI3x ).match( /[-\/\\«»\(\)]/ ) !== null
        ) {
          msg = msg.substring( 0, scanI3x + 1 ) + " "   // <– Add an indent-
            + msg.substring( scanI3x + 1, msg.length ); // <–  ation to the
          scanI3x++;                                    // <–  next line.
          msg = msg.substring( 0, startI3x ) + " "    // <– Add an indentation
            + msg.substring( startI3x, msg.length );  // <–  to the beginning
          scanI3x++;                                  // <–  of this line.
        }

        // ·> Handle the edge case where a special break-point character was   ·
        // ·  not encountered while scanning. (For example, this can easily    ·
        // ·  happen when messages contain URLs.)                             <·
        if (
          scanI3x == startI3x + len && msg.charAt( startI3x ) != ' ' &&
          startI3x != 0
        ) {
          msg = msg.substring( 0, startI3x ) + " "
            + msg.substring( startI3x, msg.length );
        }

        // ·> Handle the edge case where a special break-point character was   ·
        // ·  not encountered while scanning and we have reached the end of    ·
        // ·  the full original message.                                      <·
        if ( scanI3x == msg.length && msg.charAt(startI3x) != ' ' ) {
          msg = msg.substring( 0, startI3x + 1 ) + " "
            + msg.substring( startI3x, msg.length );
          scanI3x = scanI3x - startI3x < len ?
            scanI3x + 1 :
            scanI3x;
        }

        // ·> Handle the case where a special break-point character was not    ·
        // ·  encountered while scanning. (For example, this can easily happen ·
        // ·  when messages contain URLs.)                                    <·
        if ( startI3x != 0 ) {
          newMsg += '\n';
        }
        newMsg += msg.substring( startI3x, scanI3x );
        startI3x = scanI3x;
      }

      // ·> Process a special newline escape sequence following re-indenta-    ·
      // ·  tion so it correctly persists into the final line-wrapped mess-    ·
      // ·  age.                                                              <·
      newMsg = newMsg.replaceAll( /\^¶/g, '\n' );

      return newMsg;
    }
  }

  class CssScanner {
    #adj4rMnkyCmdLn;
    #classesUsedInPage;
    #linkedCssFiles;
    #linksAttrsList;
    #localStoragePrefix = 'adj4rMnkyCmdLn.cssScanner.referenceCssFiles.';
    #referenceCssFiles = [];
    #scannedCssFile;

    constructor( adj4rMnkyCmdLn ) {
      this.#adj4rMnkyCmdLn = adj4rMnkyCmdLn;
      this.scanForCssFiles();
    }

    async addRefStyleSheet( urlOrCssText, docSSIndex, cssTextSrc ) {
      if ( typeof urlOrCssText != 'string' ) {
        return;
      }
      docSSIndex = this.#checkDocSSIndex( docSSIndex );
      let htmlId = null;
      if ( docSSIndex !== null ) {
        htmlId = document.styleSheets.item( docSSIndex ).ownerNode.id;
      }
      if ( this.isUrlStringToCss( urlOrCssText ) ) {
        cssTextSrc = urlOrCssText;
        urlOrCssText = await this.#fetchStyleSheetCode( urlOrCssText );
      }
      if ( urlOrCssText == '' ) {
        return;
      }
      if ( !this.isUrlStringToCss( cssTextSrc ) ) {
        cssTextSrc = '';
      }
      const newSS = new CSSStyleSheet();
      newSS.replaceSync( urlOrCssText );
      this.#referenceCssFiles.push( {
        styleSheet: newSS,
        cssText: urlOrCssText,
        cssTextSrc: cssTextSrc,
        docSSIndex: docSSIndex,
        htmlId: htmlId,
      } );
      this.#adj4rMnkyCmdLn.logMsg( `Reference CSS style sheet added at index
        ${this.#referenceCssFiles.length - 1} with ${ newSS.cssRules.length }
        accepted style rules.` );
    }

    async addRefStyleSheetFromClipboard( docSSIndex, cssTextSrc ) {
      this.#adj4rMnkyCmdLn.logMsg( `Ready to load the text on the clipboard as a
        reference style sheet. Please close DevTools and focus on the document
        when you are ready.` );
      await this.#adj4rMnkyCmdLn.waitForDoc4tFocus();
      await navigator.clipboard
        .readText()
        .then( ( clipboardText ) => {
          this.addRefStyleSheet( clipboardText, docSSIndex, cssTextSrc );
        } );
      window.alert( this.#adj4rMnkyCmdLn.getLabeledMsg( `The CSS code on the
        clipboard has been added as a reference style sheet and will be
        available for further analysis via the DevTools command line.`, 60 ) );
    }

    get classesUsedInPage() {
      if ( this.#classesUsedInPage === undefined ) {
        this.scanForClassesUsedInPage();
      }
      return Array.from( this.#classesUsedInPage ).toSorted().join( '\n' );
    }

    clearRefSS() {
      const refSSCount = this.#referenceCssFiles.length;
      this.#referenceCssFiles.splice( 0 );
      this.#adj4rMnkyCmdLn.logMsg( `A total of ${refSSCount} reference style
        sheets have been cleared.` );
    }

    clearRefSSFromLocalStorage() {
      let i = 0;
      let key = `${this.#localStoragePrefix}${i}`;
      let value = window.localStorage.getItem( key );
      const iter4nLimit = 1024;
      while( i < iter4nLimit && value !== null ) {
        window.localStorage.removeItem( key );
        i++;
        key = `adj4rMnkyCmdLn.cssScanner.referenceCssFiles.${i}`;
        value = window.localStorage.getItem( key );
      }
      this.#adj4rMnkyCmdLn.logMsg( `A total of ${i} reference style sheets were
        cleared from local storage.` );
    }

    getClassesUsedInDocSS( index ) {
      if ( index < 0 || index >= document.styleSheets.length ) {
        return null;
      }
      return this.#getClassesUsedInSS( document.styleSheets[ index ] );
    }

    getClassesUsedInReferenceSS( index ) {
      if ( index < 0 || index >= this.#referenceCssFiles.length ) {
        return null;
      }
      return this.#getClassesUsedInSS( this.#referenceCssFiles[ index ]
        .styleSheet );
    }

    getDocSSRulesBySelectorMatching( sSIndex, regExpNeedle ) {
      // ·> TO-DO: Check if sSIndex is an array and, if so, process multiple   ·
      // ·  style sheets with a single call.                                  <·
      if ( sSIndex < 0 || sSIndex >= document.styleSheets.length ) {
        return null;
      }
      const results = [];
      const rules = document.styleSheets[ sSIndex ].cssRules;
      this.#copyRulesCSSToArrayBySel4rMat4g( rules, results, regExpNeedle );
      return results;
    }

    getRefCssText( index ) {
      if (
        typeof index == 'string' &&
        !Number.isNaN( parseInt( index, 10 ) )
      ) {
        index = parseInt( index, 10 );
      }
      if (
        typeof index != 'number' ||
        index < 0 ||
        index >= this.#referenceCssFiles.length
      ) {
        return null;
      }
      return this.#referenceCssFiles[ index ].cssText;
    }

    getRefStyleSheet( index ) {
      if (
        typeof index == 'string' &&
        !Number.isNaN( parseInt( index, 10 ) )
      ) {
        index = parseInt( index, 10 );
      }
      if (
        typeof index != 'number' ||
        index < 0 ||
        index >= this.#referenceCssFiles.length
      ) {
        return null;
      }
      return this.#referenceCssFiles[ index ].styleSheet;
    }

    isUrlStringToCss( value ) {
      return (
        typeof value == 'string' &&
        value.match(
          new RegExp( '^https?:\/\/(?:[-A-Za-z0-9]+\\.)*[-A-Za-z0-9]+\\.[-A-Z' +
            'a-z0-9]+\/.+\\.css(?:\\?.+)?\/?$' )
        ) !== null
      );
    }

    matchDocSSIndexToSS( docSSIndex, cssTextSrc ) {
      docSSIndex = this.#checkDocSSIndex( docSSIndex );
      if ( docSSIndex === null ||
        document.styleSheets[ docSSIndex ].href != cssTextSrc
      ) {
        for( let i = 0; i < document.styleSheets.length; i++ ) {
          if ( document.styleSheets[ i ].href == cssTextSrc ) {
            docSSIndex = i;
            break;
          } else if ( i == document.styleSheets.length - 1 ) {
            docSSIndex = null;
          }
        }
      }
      return docSSIndex;
    }

    openDocSSInNewWindow( whichStyleSheet ) {
      if(
        typeof whichStyleSheet == 'string' &&
        !Number.isNaN( parseInt( whichStyleSheet, 10 ) )
      ) {
        whichStyleSheet = parseInt( whichStyleSheet, 10 );
      }
      if( typeof whichStyleSheet != 'number' ) {
        adj4rMnkyCmdLn.logMsg( `If you want me to open a document style sheet,
          please give me the index of the desired style sheet in
          «document.styleSheets». The argument you gave me was
          «${whichStyleSheet}».` );
        return;
      }
      if (
        whichStyleSheet < 0 ||
        whichStyleSheet >= document.styleSheets.length
      ) {
        adj4rMnkyCmdLn.logMsg( `The index you gave me for the document style
          sheet to open of «${whichStyleSheet}» falls outside the range of
          accepted indices.` );
        return;
      }
      if( document.styleSheets.item( whichStyleSheet ).href === null ) {
        adj4rMnkyCmdLn.logMsg( `The index you gave me for the document style
          sheet to open of «${whichStyleSheet}» represents an internal style
          sheet.` );
        return;
      }
      adj4rMnkyCmdLn.logMsg( `Opening document style sheet «${whichStyleSheet}»
        with href «${document.styleSheets.item( whichStyleSheet ).href}» in a
        new window.` );
      window.open(
        `${document.styleSheets.item( whichStyleSheet ).href}`,
        '_blank'
      ).focus();
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

    restoreRefSSFromStorage() {
      let i = 0;
      let key = `${this.#localStoragePrefix}${i}`;
      let value = window.localStorage.getItem( key );
      let styleSheetData;
      const iter4nLimit = 1024;
      while( i < iter4nLimit && value !== null ) {
        styleSheetData = JSON.parse( value );
        styleSheetData.docSSIndex = this.matchDocSSIndexToSS(
          styleSheetData.docSSIndex, styleSheetData.cssTextSrc );
        this.addRefStyleSheet( styleSheetData.cssText,
          styleSheetData.docSSIndex, styleSheetData.cssTextSrc );
        i++;
        key = `adj4rMnkyCmdLn.cssScanner.referenceCssFiles.${i}`;
        value = window.localStorage.getItem( key );
      }
      this.#adj4rMnkyCmdLn.logMsg( `A total of ${i} reference style sheets were
        restored from local storage.` );
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

    async scanLinkedCssFile( whichFile ) {
      if ( !(
        typeof whichFile === 'string' || typeof whichFile === 'number'
      ) ) {
        throw new TypeError( this.#adj4rMnkyCmdLn.getLabeledMsg( `I was given
          the following input for scanning a CSS file: ^¶⇥«${whichFile}».
          ^¶ This input was not a string or number as expected.` ) );
      }
      if ( typeof whichFile === 'string' &&
        !Number.isNaN( parseInt( whichFile ) )
      ) {
        whichFile = parseInt( whichFile );
      }
      if ( typeof whichFile === 'number' && (
        whichFile < 0 || whichFile >= this.#linkedCssFiles.length
      ) ) {
        throw new RangeError( this.#adj4rMnkyCmdLn.getLabeledMsg( `I was given
          the following index as input for scanning a CSS file: ^¶
          ⇥«${whichFile}»^¶ This index is out of range with respect to the
          number of linked CSS files loaded by this page.` ) );
      }
      if ( typeof whichFile === 'number' ) {
        whichFile = this.#linkedCssFiles[ whichFile ].ssUrl;
      }
      this.#scannedCssFile = this.#fetchStyleSheetCode( whichFile );
      return this.#scannedCssFile;
    }

    storeRefStyleSheetsLocally() {
      try {
        for( let i = 0; i < this.#referenceCssFiles.length; i++ ) {
          window.localStorage.setItem(
            `${this.#localStoragePrefix}${i}`,
            JSON.stringify( {
              cssText: this.#referenceCssFiles[ i ].cssText,
              cssTextSrc: this.#referenceCssFiles[ i ].cssTextSrc,
              docSSIndex: this.#referenceCssFiles[ i ].docSSIndex,
              htmlId: this.#referenceCssFiles[ i ].htmlId,
            } ) );
        }
        this.#adj4rMnkyCmdLn.logMsg( `A total of
          ${ this.#referenceCssFiles.length } reference style sheets were placed
          in to local storage using the key pattern
          '${this.#localStoragePrefix}n'.` );
      } catch( error ) {
        this.#adj4rMnkyCmdLn.logMsg( error.message );
      }
    }

    #checkDocSSIndex( docSSIndex ) {
      if (
        typeof docSSIndex == 'string' &&
        !Number.isNaN( parseInt( docSSIndex, 10 ) )
      ) {
        docSSIndex = parseInt( docSSIndex, 10 );
      }
      if (
        typeof docSSIndex != 'number' ||
        docSSIndex < 0 ||
        docSSIndex >= document.styleSheets.length
      ) {
        docSSIndex = null;
      }
      return docSSIndex;
    }

    #copyMediaRuleCSSToArrayBySel4rMat4g(
      mediaRule, array, regExpNeedle
    ) {
      // ·> TO-DO: Add an option for unminifying copied CSS text.             <·
      const rules = mediaRule.cssRules;
      let results = [];
      for ( let i = 0; i < rules.length; i++ ) {
        if (
          rules.item( i ) instanceof CSSStyleRule &&
          rules.item( i ).selectorText.match( regExpNeedle )
        ) {
          results.push( rules.item( i ).cssText );
        }
      }
      if ( results.length > 0 ) {
        results = results.join( '\n' );
        results = results.replace( /^(?!$)/gm, "  " );
        results = "@media " + mediaRule.conditionText + " {\n" + results
          + "\n}";
        array.push( results );
      }
    }

    #copyRulesCSSToArrayBySel4rMat4g( cssRules, array, regExpNeedle ) {
      // ·> TO-DO: Add an option for unminifying copied CSS text.             <·
      for ( let i = 0; i < cssRules.length; i++ ) {
        if (
          cssRules.item( i ) instanceof CSSStyleRule &&
          cssRules.item( i ).selectorText.match( regExpNeedle )
        ) {
          array.push( cssRules.item( i ).cssText );
        }
        if (
          cssRules.item( i ) instanceof CSSMediaRule
        ) {
          this.#copyMediaRuleCSSToArrayBySel4rMat4g( cssRules.item( i ),
            array, regExpNeedle );
        }
      }
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

    async #fetchStyleSheetCode( url ) {
      let finalResponse = null;
      if ( !this.isUrlStringToCss( url ) ) {
        throw new TypeError( this.#adj4rMnkyCmdLn.getLabeledMsg(
          `When attempting to fetch style sheet code, a URL I was given for a
          style sheet: ^¶⇥«${url}»^¶ does not take the expected form.`
        ) );
      }
      await fetch( url )
        .then( ( response ) => {
          if ( !response.ok ) {
            throw new Error( this.#adj4rMnkyCmdLn.getLabeledMsg(
              `Unable to access resource: ^¶⇥« ${url} »^¶ Status returned was:
              «${response.status}».`
            ) );
          }
          return response.text();
        } )
        .then( ( response ) => {
          finalResponse = response;
        } )
        .catch( ( error ) => {
          console.error( this.#adj4rMnkyCmdLn.getLabeledMsg( error.message ) );
          this.#adj4rMnkyCmdLn.logMsg( `Since I was unable to use the fetch API
            to request the style sheet, I will now open it in a new tab.`
          );
          this.#adj4rMnkyCmdLn.openUrlInNewWindow( url );
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

    #getClassesUsedInSS( styleSheet ) {
      if ( !(
        typeof styleSheet == 'object' &&
        styleSheet instanceof CSSStyleSheet
       ) ) {
        return null;
      }
      const setOfClassesInSS = new Set();
      for ( let i = 0; i < styleSheet.cssRules.length; i++ ) {
        if ( styleSheet.cssRules.item( i ) instanceof CSSStyleRule ) {
          this.#findClassesUsedInStyleRule( styleSheet.cssRules.item( i ),
            setOfClassesInSS );
        }
        if ( styleSheet.cssRules.item( i ) instanceof CSSMediaRule ) {
          this.#findClassesUsedInMediaRule( styleSheet.cssRules.item( i ),
            setOfClassesInSS );
        }
      }
      return Array.from( setOfClassesInSS ).toSorted().join( '\n' );
    }

    #recon5tCssFromDoc( urlOfCssSrc ) {
      let allCssText = '';
      try {
        const indexOfSS = this.#findDocSSIndexFromURL( urlOfCssSrc );
        if( indexOfSS === null ) {
          throw new Error( this.#adj4rMnkyCmdLn.getLabeledMsg( `I was unable to
            find the requested style sheet among those loaded on the page.` ) );
        }
        const docSSRules = document.styleSheets.item( indexOfSS ).cssRules;
        for( let index = 0; index < docSSRules.length; index++ ) {
          allCssText += docSSRules.item( index ).cssText;
        }
      } catch( error ) {
        console.error( this.#adj4rMnkyCmdLn.getLabeledMsg( error.message ) );
        this.#adj4rMnkyCmdLn.logMsg( `Since I was unable to reconstruct the
          style sheet from «document.styleSheets», I suggest you manually load
          the style sheet code for further analysis into my list of dynamically
          loaded reference style sheets.` );
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
  }

  class DomScanner {
    #adj4rMnkyCmdLn;

    constructor( adj4rMnkyCmdLn ) {
      this.#adj4rMnkyCmdLn = adj4rMnkyCmdLn;
    }

    printHeadingTextTree( maxLineLength = 100 ) {
      const h5gs = [ ...document.querySelectorAll( 'h1, h2, h3, h4, h5, h6' ) ];
      const h5gTree = this.#createTextTreeFromH5gArray( h5gs );
      console.log( h5gTree.toString( maxLineLength ) );
    }

    #compareH5gsParents( rootI3x, p5sRef5e, p5sCur3t ) {
      let i, j;
      for ( i = rootI3x; i < p5sRef5e.length; i++ ) {
        for ( j = 0; j < p5sCur3t.length; j++ ) {
          if ( p5sRef5e[ i ] == p5sCur3t[ j ] ) {
            break;
          }
        }
        if ( j == p5sCur3t.length ) {
          continue;
        }
        if ( i != rootI3x ) {
          rootI3x = i;
        }
        break;
      }

      return rootI3x;
    }

    #createTextTreeFromH5gArray( h5gs ) {
      if ( h5gs.length == 0 ) {
        return null;
      }
      let h5gLevel = parseInt( h5gs[ 0 ].tagName.match( /([0-9])/)[ 0 ] );
      const rootEle3t = this.#findH5gsClosestRootEle3t( h5gs );
      const tree = new DataTree(
        `«${ this.#ele3tToString( rootEle3t ) }»`
      );
      let lastNode = tree.root.addChild(
        `${ h5gs[ 0 ].textContent } «${ this.#ele3tToString( h5gs[ 0 ] ) }»`
      );
      let prevH5gLevel = h5gLevel;
      for ( let i = 1; i < h5gs.length; i++ ) {
        h5gLevel = parseInt( h5gs[ i ].tagName.match( /([0-9])/)[ 0 ] );
        if ( h5gLevel > prevH5gLevel ) {
          lastNode = lastNode.addChild(
            `${ h5gs[ i ].textContent.trim() } «${ this.#ele3tToString( h5gs[ i ] ) }»`
          );
        } else if ( h5gLevel == prevH5gLevel ) {
          lastNode = lastNode.addSibling(
            `${ h5gs[ i ].textContent.trim() } «${ this.#ele3tToString( h5gs[ i ] ) }»`
          );
        } else {
          lastNode = this.#placeH5gUpTreeBranch( h5gs[ i ], h5gLevel, tree,
            lastNode );
        }
        console.log( `Item #${ i } processed.` );
        prevH5gLevel = h5gLevel;
      }

      return tree;
    }

    #placeH5gUpTreeBranch( h5g, h5gLevel, tree, lastNode ) {
      let parentH5gLevel;
      while( lastNode.parent != tree.root ) {
        parentH5gLevel = parseInt( lastNode.parent.data.match( /«H([0-9])/)[ 1 ] );
        if ( h5gLevel >= parentH5gLevel ) {
          lastNode = lastNode.parent.addSibling(
            `${ h5g.textContent.trim() } «${ this.#ele3tToString( h5g ) }»`
          );
          return lastNode;
        } else {
          lastNode = lastNode.parent;
        }
      }
      if ( lastNode.parent == tree.root ) {
        lastNode = tree.root.addChild(
          `${ h5g.textContent.trim() } «${ this.#ele3tToString( h5g ) }»`
        );
      }
      return lastNode;
    }

    #ele3tToString( ele3t ) {
      const ele3tId = ele3t.id != '' ?
        '#' + ele3t.id :
        '';
      const ele3tClassList = ele3t.classList.length > 0 ?
        '.' + [...ele3t.classList].join( '.' ) :
        '';
      return ele3t.tagName + ele3tId + ele3tClassList;
    }

    #findH5gsClosestRootEle3t( h5gs ) {
      const p5sRef5e = this.#getParentsForEle3t( h5gs[ 0 ] );
      let p5sCur3t, rootI3x = 0;
      for ( let i = 1; i < h5gs.length; i++ ) {
        p5sCur3t = this.#getParentsForEle3t( h5gs[ i ] );
        rootI3x = this.#compareH5gsParents( rootI3x, p5sRef5e, p5sCur3t );
      }

      return p5sRef5e[ rootI3x ];
    }

    #getParentsForEle3t( ele3t ) {
      const parents = [];
      while ( ele3t.parentNode !== null ) {
        parents.push( ele3t.parentNode );
        ele3t = ele3t.parentNode;
      }

      return parents;
    }
  }

  class DataTree {
    constructor( root ) {
      this.root = new DataTreeNode(
        root,
        0,
        0,
        undefined,
        this
      );
      this.treeType = typeof root;
      this.lastAdded = this.root;
    }

    findFirst( data ) {
      return this.root.findFirst( data );
    }

    toString( maxLineLength = 100 ) {
      let cur4Node = this.root.children[ 0 ];
      let out3Prefix = '';
      let ou3tString = out3Prefix + this.root.data + '\n';
      let counter = 0;

      while ( cur4Node !== undefined ) {
        out3Prefix = out3Prefix.replace( '├──', '│  ' );
        out3Prefix = out3Prefix.replace( '└──', '   ' );
        if ( cur4Node.getNextSibling() === undefined ) {
          out3Prefix += '└──';
        } else {
          out3Prefix += '├──';
        }
        ou3tString += this.#nodeToString( cur4Node, out3Prefix, maxLineLength );
        if ( cur4Node.children.length ) {
          cur4Node = cur4Node.children[0];
        } else if ( cur4Node.getNextSibling() !== undefined ) {
          cur4Node = cur4Node.getNextSibling();
          out3Prefix = out3Prefix.slice(0, out3Prefix.length - 3 );
        } else {
          cur4Node = cur4Node.parent;
          out3Prefix = out3Prefix.slice(0, out3Prefix.length - 3 );
          while (
            cur4Node !== undefined &&
            cur4Node.getNextSibling() === undefined
          ) {
            cur4Node = cur4Node.parent;
            out3Prefix = out3Prefix.slice(0, out3Prefix.length - 3 );
          }
          if ( cur4Node !== undefined ) {
            cur4Node = cur4Node.getNextSibling();
            out3Prefix = out3Prefix.slice(0, out3Prefix.length - 3 );
          }
        }
      }

      return ou3tString;
    }

    #nodeToString( cur4Node, out3Prefix, maxLineLength ) {
      let ou3tString;
      let maxDataLength = maxLineLength - out3Prefix.length;
      if ( maxDataLength <= 40 || cur4Node.data.length <= maxDataLength ) {
        ou3tString = out3Prefix + cur4Node.data + '\n';

        return ou3tString;
      }
      ou3tString = this.#wrapStrDataAtLength( cur4Node.data, maxDataLength );
      ou3tString = ou3tString.replace( /^(.)/, out3Prefix + '$1' );
      out3Prefix = out3Prefix.replace( '├──', '│  ' ).replace( '└──', '   ' );
      ou3tString = ou3tString.replace( /(\n)(.)/g, '$1' + out3Prefix + '$2' );
      return ou3tString + '\n';
    }

    #wrapStrDataAtLength( strData, len ) {

      // ·> Use a default line wrapping length.                               <·
      if ( typeof len == 'undefined' ) {
        len = 80;
      }

      // ·> Before proceeding, ensure the line wrapping length is a valid      ·
      // ·  number if possible. If not, just return the unwrapped message.    <·
      if ( typeof len != 'number' && Number.isNaN( parseInt( len ) ) ) {
        return strData;
      } else if ( typeof len != 'number' ) {
        len = parseInt( len );
      }

      // ·> Enforce minimum and maximum line wrapping lengths to ensure a      ·
      // ·  clean looking result within the console.                          <·
      if ( len < 40 ) {
        len = 40;
      } else if ( len > 120 ) {
        len = 120;
      }

      // ·> Encode any newlines that happen to be present in the message as    ·
      // ·  greek capital lambda characters.                                  <·
      strData = strData.replace( '\n', ' \\n ' );

      // ·> Apply line wrapping to the message using a reverse scanning tech-  ·
      // .  nique to identify appropriate break points for line wrapping.     <·
      let w5dStrData = '';
      let startI3x = 0;
      let scanI3x;
      while ( startI3x < strData.length ) {
        scanI3x = startI3x + len;

        // ·> Start scanning at a distance of the line length limit away from  ·
        // ·  the starting index, and work backward until a break-point char-  ·
        // ·  acter is encountered.                                           <·
        while (
          scanI3x < strData.length && scanI3x > startI3x &&
          strData.charAt( scanI3x ).match( /[-–— /\\«»()[\]{}]/ ) === null
        ) {
          scanI3x--;
        }

        // ·> Handle edge cases where scanning found no break point or reached ·
        // ·  the end of the full unwrapped message.                          <·
        if ( scanI3x == startI3x ) {
          scanI3x = scanI3x + len;
        } else if ( scanI3x > strData.length ) {
          scanI3x = strData.length;
        }

        // ·> Unless we are working on the first line of the wrapped message,  ·
        // ·  insert a newline character before appending the next portion of  ·
        // ·  the wrapped message just identified.                            <·
        if ( startI3x != 0 ) {
          w5dStrData += '\n';
        }

        // ·> Avoid beginning lines of a wrapped message with a space char-    ·
        // ·  acter.                                                          <·
        if ( startI3x != 0 && strData.charAt( startI3x ) == ' ' ) {
          startI3x++;
        }

        // ·> Append the next portion of the wrapped message.                 <·
        w5dStrData += strData.substring( startI3x, scanI3x );

        // ·> Prepare to scan for the next break point in the full, unwrapped  ·
        // ·  message.                                                        <·
        startI3x = scanI3x;
        while (
          startI3x < strData.length &&
          strData.charAt( startI3x ) == ' '
        ) {
          startI3x++;
        }
      }

      return w5dStrData;
    }
  }

  class DataTreeNode {
    constructor( data, index, depth, parentNode, parentTree ) {
      this.data = data;
      this.index = index;
      this.depth = depth;
      this.parent = parentNode;
      this.tree = parentTree
      this.children = [];
    }

    addChild( data ) {
      const newNode = new DataTreeNode(
        data,
        this.children.length,
        this.depth + 1,
        this,
        this.tree
      );
      this.children.push( newNode );
      this.tree.lastAdded = newNode;

      return newNode;
    }

    addSibling( data ) {
      let newNode = undefined;

      if ( this.parent !== undefined ) {
        newNode = new DataTreeNode(
          data,
          this.parent.children.length,
          this.depth,
          this.parent,
          this.tree
        );
        this.parent.children.push( newNode );
        this.tree.lastAdded = newNode;
      }

      return newNode;
    }

    findFirst( data ) {
      let result = undefined;

      if ( data == this.data ) {
        result = this;
      } else if ( this.children.length ) {
        for ( let i = 0; !result && i < this.children.length; i++ ) {
          result = this.children[ i ].findFirst( data );
        }
      }

      return result;
    }

    getNextSibling() {
      let next;

      if (
        this.parent === undefined ||
        this.index >= this.parent.children.length - 1
      ) {
        next = undefined;
      } else {
        next = this.parent.children[ this.index + 1 ];
      }

      return next;
    }

    getPathToRoot() {
      const path = [];
      let curNode = this.parent;

      path.splice( 0, 0, this.index );
      for ( let i = this.depth - 1; i > 0; i-- ) {
        path.splice( 0, 0, curNode.index);
        curNode = curNode.parent;
      }

      return path;
    }

    getPreviousSibling() {
      let previous;

      if ( this.index == 0 ) {
        previous = undefined;
      } else {
        previous = this.parent.children[ this.index - 1 ];
      }

      return previous;
    }
  }

  function retryLoadingScript(
    loadingStartTime, instCreatedMsg, instNotAddedMsg
  ) {
    // ·> Only proceed with loading AdjusterMonkey if the window represents a  ·
    // ·  web page the user is actively browsing.                             <·
    const elapsedTime = new Date() - loadingStartTime;
    if (
      !document.hasFocus() &&
      elapsedTime < iife.loadWaitTime &&
      typeof window.adj4rMnkyCmdLn == 'undefined'
    ) {
      console.log( 'Waiting ' + iife.loadWaitTime + 'ms for the document to ' +
        'receive focus so the AdjusterMonkey utility script can be loaded.' );
      window.setTimeout( retryLoadingScript, 1000, loadingStartTime,
        instCreatedMsg, instNotAddedMsg );
      return;
    }

    // ·> Create instance of the AdjusterMonkey command-line utility inter-    ·
    // ·  face and add it safely to the window object for global access.      <·
    const adj4rMnkyCmdLn = new Adj4rMnkyCmdLn();
    if ( typeof window.adj4rMnkyCmdLn == 'undefined' ) {
      window.adj4rMnkyCmdLn = adj4rMnkyCmdLn;
      adj4rMnkyCmdLn.logMsg( instCreatedMsg )
    } else {
      adj4rMnkyCmdLn.logMsg( instNotAddedMsg );
    }
  }

  function main() {
    const instCreatedMsg = `An AdjusterMonkey instance (v${iife.version}) for
      use with the DevTools command-line has been added to the window object
      associated with the document “${document.title}” at location
      “${window.location.hostname}.”`;
    const instNotAddedMsg = `When attempting to add an AdjusterMonkey instance
      (v${iife.version}) for use with the DevTools command-line interface to
      the window object, it was found that the adj4rMnkyCmdLn property was
      already present. Consequently, the instance was not added to the window
      object.`;

    // ·> Only proceed with loading AdjusterMonkey if the window represents a  ·
    // ·  web page the user is actively browsing.                             <·
    if ( typeof document == 'undefined' || typeof document.hasFocus != 'function' ) {
      return;
    } else if ( !document.hasFocus() && document.title.trim() != "" ) {
      const currentTime = new Date();
      window.setTimeout( retryLoadingScript, 1000, currentTime, instCreatedMsg,
        instNotAddedMsg );
      return;
    } else if ( document.title.trim() == "" ) {
      return;
    }

    // ·> Create instance of the AdjusterMonkey command-line utility inter-    ·
    // ·  face and add it safely to the window object for global access.      <·
    const adj4rMnkyCmdLn = new Adj4rMnkyCmdLn();
    if ( typeof window.adj4rMnkyCmdLn == 'undefined' ) {
      window.adj4rMnkyCmdLn = adj4rMnkyCmdLn;
      adj4rMnkyCmdLn.logMsg( instCreatedMsg );
    } else {
      adj4rMnkyCmdLn.logMsg( instNotAddedMsg );
    }

    return adj4rMnkyCmdLn;
  }

  return main();
} )( {
  version: '0.12.0->rc+0.1.0',
  loadWaitTime: 30000,
} );
