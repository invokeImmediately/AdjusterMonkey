// ==UserScript==
// @name         adj4rMnkyCmdLn.js
// @namespace    http://tampermonkey.net/
// @version      0.12.0
// @description  Web browser DevTools utility script that provides tools for front-end web development.
// @author       You
// @match        https://*/*
// @exclude      https://*.doubleclick.net/*
// @exclude      https://*.googlesyndication.com/*
// @exclude      https://*.googletagmanager.com/*
// @exclude      https://*.gravatar.com/*
// @exclude      https://*.mdn.mozilla.net/*
// @icon         https://d-c-rieck.com/dcrdc-logo_favico_modern.svg
// @grant        none
// ==/UserScript==

/*!*****************************************************************************
 * ▓▓▓▒ adj4rMnky ▄▀▀▀ ▐▀▄▀▌█▀▀▄ █    ▐▀▀▄ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▒▒▓▒▒▓▒▒▓▓▒▒▓▓▒▒▓▓▒▒▓
 * ▓▓▒▒▒▒▒▒▒▒▒▒▒  █    █ ▀ ▌█  █ █  ▄ █  ▐  ▒▒▒▒▒▒▒▒▒▒▒▒▒▓▒▒▓▒▒▓▒▒▓▓▒▒▓▓▒▒▓▓▒▒▓▓
 * ▓▒▒▒▒▒▒▒▒▒▒▒▒▒  ▀▀▀ █   ▀▀▀▀  ▀▀▀  ▀  ▐.js ▒▒▒▒▒▒▒▒▒▒▓▒▒▓▒▒▓▒▒▓▓▒▒▓▓▒▒▓▓▒▒▓▓▓
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
 *    structure, such as heading hierarchy and word usage.
 *
 * @version 0.12.0-0.5.1
 *
 * @author danielcrieck@gmail.com
 *  <danielcrieck@gmail.com>
 *  (https://github.com/invokeImmediately)
 *
 * @link https://github.com/invokeImmediately/AdjusterMonkey/blob/main/DevTools/adj4rMnkyCmdLn.js
 *
 * @license MIT — Copyright 2024 by Daniel C. Rieck.
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

//>/////////////////////////////////////////////////////////////////////////////
// TABLE OF CONTENTS:
// §1: adj4rMnkyCmdLn Object via IIFE......................................164
// §2: Adj4rMnkyCmdLn Class Declaration....................................169
//   §2.1: Constructor.....................................................174
//   §2.2: Data Representation.............................................181
//     §2.2.1: createDataTree..............................................184
//     §2.2.2: isUrlString.................................................190
//   §2.3: Process Timing..................................................201
//     §2.3.1: waitForDoc4tFocus...........................................204
//     §2.3.2: waitForTime.................................................217
//   §2.4: Console Messaging...............................................227
//     §2.4.1: getLabeledMsg...............................................230
//     §2.4.2: logMsg......................................................236
//     §2.4.3: logErrorMsg.................................................242
//     §2.4.4: #wrapMsgAtCharLen...........................................251
//   §2.5: Browser Control.................................................410
//     §2.5.1: openUrlInNewWindow..........................................413
// §3: CssScanner Class Declaration........................................428
//   §3.1: Constructor.....................................................439
//   §3.2: Data Representation.............................................446
//     §3.2.1: isUrlStringToCss............................................449
//     §3.2.2: #copyMediaRuleCSSToArrayBySel4rMat4g........................460
//     §3.2.3: #copyRulesCSSToArrayBySel4rMat4g............................488
//     §3.2.4: #sortAttrsFromSsLinks.......................................509
//   §3.3: Style Sheet References and Control..............................520
//     §3.3.1: addRefStyleSheet............................................523
//     §3.3.2: addRefStyleSheetFromClipboard...............................558
//     §3.3.3: clearRefSS..................................................578
//     §3.3.4: clearRefSSFromLocalStorage..................................587
//     §3.3.5: getRefStyleSheet............................................606
//     §3.3.6: matchDocSSIndexToSS.........................................627
//     §3.3.7: restoreRefSSFromStorage.....................................649
//   §3.4: CSS Class Analysis and Extraction...............................677
//     §3.4.1: classesUsedInPage...........................................680
//     §3.4.2: getClassesUsedInDocSS.......................................690
//     §3.4.3: getClassesUsedInReferenceSS.................................700
//     §3.4.4: getDocSSRulesBySelectorMatching.............................711
//     §3.4.5: getRefCssText...............................................727
//     §3.4.6: printClassesUsedInPage......................................748
//     §3.4.7: scanForClassesUsedInPage....................................758
//     §3.4.8: #checkDocSSIndex............................................764
//     §3.4.9: #extractClassesUsedInPage...................................785
//     §3.4.10: #findClassesUsedInMediaRule................................800
//     §3.4.11: #findClassesUsedInStyleRule................................814
//     §3.4.12: #getClassesUsedInSS........................................833
//   §3.5: Document Analysis...............................................860
//     §3.5.1: printDocSSList..............................................863
//     §3.5.2: printLinksAttrsList.........................................886
//     §3.5.3: printLinkedCssFiles.........................................892
//     §3.5.4: scanForCssFiles.............................................898
//     §3.5.5: scanLinkedCssFile...........................................942
//     §3.5.6: storeRefStyleSheetsLocally..................................980
//     §3.5.7: #extractAttrsFromSsLink....................................1003
//     §3.5.8: #fetchStyleSheetCode.......................................1012
//     §3.5.9: #findDocSSIndexFromURL.....................................1050
//     §3.5.10: #recon5tCssFromDoc........................................1067
//   §3.6: Browser Control................................................1094
//     §3.6.1: openDocSSInNewWindow.......................................1097
// §4: DomScanner Class Declaration.......................................1143
//   §4.1: Constructor....................................................1149
//   §4.2: Data Representation............................................1180
//     §4.2.1: #ele3tToString.............................................1183
//   §4.3: DOM Traversal..................................................1199
//     §4.3.1: #getParentsForEle3t........................................1202
//   §4.4: Analysis of Heading Hierarchy..................................1214
//     §4.4.1: printHeadingTextTree.......................................1217
//     §4.4.2: #compareH5gsParents........................................1225
//     §4.4.3: #createTextTreeFromH5gArray................................1250
//     §4.4.4: #placeH5gUpTreeBranch......................................1291
//     §4.4.5: #findH5gsClosestRootEle3t..................................1319
//   §4.5: Analysis of Writing Composition................................1333
//     §4.5.1: getListOfWordsUsedInDocument...............................1336
//     §4.5.2: getListsOfWordsUsedInHeadings..............................1378
//     §4.5.3: printUniqueWordsUsedInDocument.............................1412
//     §4.5.4: printUniqueWordsUsedInHeadings.............................1439
//   §4.6: Document Element Highlighting..................................1466
//     §4.6.1: highlightDomElements.......................................1469
//     §4.6.2: removeDomElementHighlights.................................1501
//     §4.6.3: #getRandomInd5rColor.......................................1521
//     §4.6.4: #interpretSel4rDom.........................................1547
// §5: DataTree Class Declaration.........................................1562
//   §5.1: Constructor....................................................1566
//   §5.2: Data Representation............................................1580
//     §5.2.1: toString...................................................1583
//     §5.2.2: nodeToString...............................................1629
//     §5.2.3: #wrapStrDataAtLength.......................................1649
//   §5.3: Searching the Tree.............................................1734
//     §5.3.1: findFirst..................................................1737
// §6: DataTreeNode Class Declaration.....................................1744
//   §6.1: Constructor....................................................1748
//   §6.2: Modification of Tree Structure.................................1759
//     §6.2.1: addChild...................................................1762
//     §6.2.2: addSibling.................................................1779
//   §6.3: Tree Traversal.................................................1800
//     §6.3.1: getNextSibling.............................................1803
//     §6.3.2: getPathToRoot..............................................1820
//     §6.3.3: getPreviousSibling.........................................1835
//   §6.4: Searching the Tree.............................................1849
//     §6.4.1: findFirst..................................................1852
// §7: Script Loading.....................................................1869
// §8: Execution Entry Point..............................................1901
//</////////////////////////////////////////////////////////////////////////////

//>///////////////////////////////////////////////////////////////////////////--
//< §1: adj4rMnkyCmdLn Object via IIFE
const adj4rMnkyCmdLn = (function(iife) {
  'use strict';

  //>/////////////////////////////////////////////////////////////////////////--
  //< §2: Adj4rMnkyCmdLn Class Declaration
  class Adj4rMnkyCmdLn {
    #prefix4Msgs = '(🐵 AdjusterMonkey 🛠️) =>';

    //>/////////////////////////////////////////////////////////////////////----
    //< §2.1: Constructor
    constructor() {
      this.cssScanner = new CssScanner(this);
      this.domScanner = new DomScanner(this);
    }

    //>/////////////////////////////////////////////////////////////////////----
    //< §2.2: Data Representation

    //»//////////////////////
    //« §2.2.1: createDataTree
    createDataTree(rootData) {
      return new DataTree(rootData);
    }

    //»///////////////////
    // §2.2.2: isUrlString
    isUrlString(value) {
      return (
        typeof value == 'string'
        && value.match(
          new RegExp( '^https?:\/\/(?:[-A-Za-z0-9]+\\.)*[-A-Za-z0-9]+\\.[-A-Za-z0-9]+(?:\/.*)?$' )
        ) !== null
      );
    }

    //>/////////////////////////////////////////////////////////////////////----
    //< §2.3: Process Timing

    //»///////////////////////////
    //« §2.3.1: waitForDoc4tFocus
    async waitForDoc4tFocus() {
      const checkDoc4tFocus = (resolve) => {
        if (document.hasFocus()) {
          resolve();
        } else {
          setTimeout(() => checkDoc4tFocus(resolve), 250);
        }
      }
      return new Promise(checkDoc4tFocus);
    }

    //»////////////////////
    //« §2.3.2: waitForTime
    waitForTime(timeInMs) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve('');
        }, timeInMs);
      });
    }

    //>/////////////////////////////////////////////////////////////////////----
    //< §2.4: Console Messaging

    //»//////////////////////
    //« §2.4.1: getLabeledMsg
    getLabeledMsg(msg, wrapLen) {
      return this.#wrapMsgAtCharLen(`${this.#prefix4Msgs} ${msg}`, wrapLen);
    }

    //»///////////////
    //« §2.4.2: logMsg
    logMsg(msgText, wrapLen) {
      console.log(this.getLabeledMsg(msgText, wrapLen));
    }

    //»////////////////////
    //« §2.4.3: logErrorMsg
    logErrorMsg(msgText, wrapLen) {
      console.log(
        this.getLabeledMsg('%cERROR —» ' + msgText, wrapLen),
        'background-color:#000000;color:#FF5E5E;'
      );
    }

    //»//////////////////////////
    //« §2.4.4: #wrapMsgAtCharLen
    #wrapMsgAtCharLen(msg, len) {
      // ·> Use a default line wrapping length.                               <·
      if (typeof len == 'undefined') {
        len = 80;
      }

      // ·> Convert the line wrapping length to a number if possible.         <·
      if (typeof len != 'number' && Number.isNaN(parseInt(len))) {
        return msg;
      } else if (typeof len != 'number') {
        len = parseInt(len);
      }

      // ·> Enforce minimum and maximum line wrapping lengths to ensure a      ·
      // ·  clean looking result.                                             <·
      if (len < 40) {
        len = 40;
      } else if (len > 100) {
        len = 100;
      }

      // ·> Re-indent the original message to allow template literals to be    ·
      // ·  used following clean coding practices when specifying the argu-    ·
      // ·  ment.                                                             <·
      let iterCount = 0;
      while (
        msg.length > 0
        && (
          msg.match(/[ \n]+\n/gi) !== null
          || msg.match(/\n[ \n]+/gi) !== null
        )
        && iterCount < 1024
      ) {
        msg = msg.replaceAll(/[ \n]+\n/gi, ' ');
        msg = msg.replaceAll(/\n[ \n]+/gi, ' ');
        iterCount++
      }
      msg = msg.replaceAll(/\n+/gi, ' ');
      if (msg.length < len) {
        return msg;
      }

      // ·> Replace a special tab escape sequence with indentation at this     ·
      // ·  later point following re-indentation so it correctly persists      ·
      // ·  into the final line-wrapped message.                              <·
      msg = msg.replaceAll(/\^↹/g, '  ');

      // ·> Scan through each character of the message to look for break-      ·
      // ·  point characters at appropriate wrapping locations to satisfy a    .
      // ·  specified line length limit. Insert newlines when they are en-     ·
      // ·  countered to produce a wrapped message where each line's length    ·
      // ·  is less than the desired limit and line breaks fall at desirable   ·
      // ·  break points.                                                     <·
      let newMsg = '';
      let startI3x = 0; // Starting index
      let scanI3x; // Scanning index
      while (startI3x < msg.length) {
        scanI3x = startI3x + len;

        // ·> Start scanning at a distance of the line length limit away from  ·
        // ·  the starting index, and work backward until a break-point char-  ·
        // ·  acter is encountered.                                           <·
        while (
          scanI3x < msg.length
          && scanI3x > startI3x
          && msg.charAt(scanI3x).match(/[- \/\\«»\(\)]/) === null
        ) {
          scanI3x--;
        }

        // ·> Handle edge cases where scanning found no break point or reached ·
        // ·  the end of the message.                                         <·
        if (scanI3x == startI3x) {
          scanI3x = scanI3x + len;
        } else if (scanI3x > msg.length) {
          scanI3x = msg.length;
        }

        // ·> Introduce a line break in such a manner that the first charac-   ·
        // ·  ter at beginning of the line is a space, with the first line     ·
        // ·  being excepted. This achieves a hanging indent that can help     ·
        // ·  with visually distinguishing distinct messages in the console.  <·
        // ·> To-do: Avoid manipulating the original string when working to    ·
        // ·  create a hanging indent to improve performance.                 <·
        if (
          msg.charAt(scanI3x).match(/[-\/\\«»\(\)]/) !== null
          && (startI3x == 0 || msg.charAt(startI3x) == ' ')
        ) {
          // Add an indentation to the next line.
          msg =
            msg.substring(0, scanI3x + 1 ) + " " +
            msg.substring(scanI3x + 1, msg.length);

          scanI3x++;
        } else if (
          msg.charAt(scanI3x).match(/[-\/\\«»\(\)]/) !== null
        ) {
          // Add an indentation to the next line.
          msg =
            msg.substring(0, scanI3x + 1) + " " +
            msg.substring(scanI3x + 1, msg.length);

          scanI3x++;

          // Add an indentation to the beginning of this line.
          msg =
            msg.substring(0, startI3x) + " " +
            msg.substring(startI3x, msg.length);

          scanI3x++;
        }

        // ·> Handle the edge case where a special break-point character was   ·
        // ·  not encountered while scanning. (For example, this can easily    ·
        // ·  happen when messages contain URLs.)                             <·
        if (
          scanI3x == startI3x + len
          && msg.charAt(startI3x) != ' '
          && startI3x != 0
        ) {
          msg =
            msg.substring(0, startI3x) + " " +
            msg.substring(startI3x, msg.length);
        }

        // ·> Handle the edge case where a special break-point character was   ·
        // ·  not encountered while scanning and we have reached the end of    ·
        // ·  the full original message.                                      <·
        if ( scanI3x == msg.length && msg.charAt(startI3x) != ' ' ) {
          msg =
            msg.substring(0, startI3x + 1) + " " +
            msg.substring(startI3x, msg.length);

          scanI3x =
            scanI3x - startI3x < len ?
            scanI3x + 1 :
            scanI3x;
        }

        // ·> Handle the case where a special break-point character was not    ·
        // ·  encountered while scanning. (For example, this can easily happen ·
        // ·  when messages contain URLs.)                                    <·
        if (startI3x != 0) {
          newMsg += '\n';
        }
        newMsg += msg.substring(startI3x, scanI3x);
        startI3x = scanI3x;
      }

      // ·> Process a special newline escape sequence following re-indenta-    ·
      // ·  tion so it correctly persists into the final line-wrapped mess-    ·
      // ·  age.                                                              <·
      newMsg = newMsg.replaceAll(/\^¶/g, '\n');

      return newMsg;
    }

    //>/////////////////////////////////////////////////////////////////////----
    //< §2.5: Browser Control

    //»///////////////////////////
    //« §2.5.1: openUrlInNewWindow
    openUrlInNewWindow(url) {
      if (!this.isUrlString(url)) {
        adj4rMnkyCmdLn.logMsg(
          `If you want me to open a document style sheet, please give me a
          string containing URL. The argument you gave me was
          «${whichStyleSheet}».`
        );
        return;
      }
      window.open(url, '_blank').focus();
    }
  }

  //>/////////////////////////////////////////////////////////////////////////--
  //< §3: CssScanner Class Declaration
  class CssScanner {
    #adj4rMnkyCmdLn;
    #classesUsedInPage;
    #linkedCssFiles;
    #linksAttrsList;
    #localStoragePrefix = 'adj4rMnkyCmdLn.cssScanner.referenceCssFiles.';
    #referenceCssFiles = [];
    #scannedCssFile;

    //>/////////////////////////////////////////////////////////////////////----
    //< §3.1: Constructor
    constructor(adj4rMnkyCmdLn) {
      this.#adj4rMnkyCmdLn = adj4rMnkyCmdLn;
      this.scanForCssFiles();
    }

    //>/////////////////////////////////////////////////////////////////////----
    //< §3.2: Data Representation

    //»/////////////////////////
    //« §3.2.1: isUrlStringToCss
    isUrlStringToCss(value) {
      return (
        typeof value == 'string'
        && value.match(new RegExp(
          '^https?:\/\/(?:[-A-Za-z0-9]+\\.)*[-A-Za-z0-9]+\\.[-A-Za-z0-9]+\/.+\\.css(?:\\?.+)?\/?$'
        )) !== null
      );
    }

    //»/////////////////////////////////////////////
    //« §3.2.2: #copyMediaRuleCSSToArrayBySel4rMat4g
    #copyMediaRuleCSSToArrayBySel4rMat4g(
      mediaRule, array, regExpNeedle
    ) {
      // ·> TO-DO: Add an option for unminifying copied CSS text.             <·
      const rules = mediaRule.cssRules;
      let results = [];

      for (let i = 0; i < rules.length; i++) {
        if (
          rules.item(i) instanceof CSSStyleRule
          && rules.item(i).selectorText.match(regExpNeedle)
        ) {
          results.push(rules.item(i).cssText);
        }
      }

      if (results.length > 0) {
        results = results.join('\n');
        results = results.replace(/^(?!$)/gm, "  ");
        results = "@media " + mediaRule.conditionText + " {\n" + results +
          "\n}";

        array.push( results );
      }
    }

    //»/////////////////////////////////////////
    //« §3.2.3: #copyRulesCSSToArrayBySel4rMat4g
    #copyRulesCSSToArrayBySel4rMat4g(cssRules, array, regExpNeedle) {
      // ·> TO-DO: Add an option for unminifying copied CSS text.             <·
      for (let i = 0; i < cssRules.length; i++) {
        if (
          cssRules.item(i) instanceof CSSStyleRule &&
          cssRules.item(i).selectorText.match(regExpNeedle)
        ) {
          array.push(cssRules.item(i).cssText);
        }

        if (
          cssRules.item(i) instanceof CSSMediaRule
        ) {
          this.#copyMediaRuleCSSToArrayBySel4rMat4g(cssRules.item(i),
            array, regExpNeedle);
        }
      }
    }

    //»//////////////////////////////
    //« §3.2.4: #sortAttrsFromSsLinks
    #sortAttrsFromSsLinks(attrsSet) {
      const attrs = [];
      for(const attr of attrsSet) {
        attrs.push(attr);
      }

      return attrs.toSorted();
    }

    //>/////////////////////////////////////////////////////////////////////----
    //< §3.3: Style Sheet References and Control

    //»///////////////////////////
    //« §3.3.1: addRefStyleSheet
    async addRefStyleSheet(urlOrCssText, docSSIndex, cssTextSrc) {
      if (typeof urlOrCssText != 'string') {
        return;
      }
      docSSIndex = this.#checkDocSSIndex(docSSIndex);
      let htmlId = null;
      if (docSSIndex !== null) {
        htmlId = document.styleSheets.item(docSSIndex).ownerNode.id;
      }
      if (this.isUrlStringToCss(urlOrCssText)) {
        cssTextSrc = urlOrCssText;
        urlOrCssText = await this.#fetchStyleSheetCode(urlOrCssText);
      }
      if (urlOrCssText == '') {
        return;
      }
      if (!this.isUrlStringToCss(cssTextSrc)) {
        cssTextSrc = '';
      }
      const newSS = new CSSStyleSheet();
      newSS.replaceSync(urlOrCssText);
      this.#referenceCssFiles.push({
        styleSheet: newSS,
        cssText: urlOrCssText,
        cssTextSrc: cssTextSrc,
        docSSIndex: docSSIndex,
        htmlId: htmlId,
      });
      this.#adj4rMnkyCmdLn.logMsg(`Reference CSS style sheet added at index
        ${this.#referenceCssFiles.length - 1} with ${newSS.cssRules.length}
        accepted style rules.`);
    }

    //»//////////////////////////////////////
    //« §3.3.2: addRefStyleSheetFromClipboard
    async addRefStyleSheetFromClipboard(docSSIndex, cssTextSrc) {
      this.#adj4rMnkyCmdLn.logMsg(`Ready to load the text on the clipboard as a
        reference style sheet. Please close DevTools and focus on the document
        when you are ready.`);

      await this.#adj4rMnkyCmdLn.waitForDoc4tFocus();

      await navigator.clipboard
        .readText()
        .then((clipboardText) => {
          this.addRefStyleSheet(clipboardText, docSSIndex, cssTextSrc);
        });

      window.alert(this.#adj4rMnkyCmdLn.getLabeledMsg(`The CSS code on the
        clipboard has been added as a reference style sheet and will be
        available for further analysis via the DevTools command line.`, 60));
    }

    //»///////////////////
    //« §3.3.3: clearRefSS
    clearRefSS() {
      const refSSCount = this.#referenceCssFiles.length;
      this.#referenceCssFiles.splice(0);
      this.#adj4rMnkyCmdLn.logMsg(`A total of ${refSSCount} reference style
        sheets have been cleared.`);
    }

    //»///////////////////////////////////
    //« §3.3.4: clearRefSSFromLocalStorage
    clearRefSSFromLocalStorage() {
      let i = 0;
      let key = `${this.#localStoragePrefix}${i}`;
      let value = window.localStorage.getItem(key);

      const iter4nLimit = 1024;
      while(i < iter4nLimit && value !== null) {
        window.localStorage.removeItem(key);
        i++;
        key = `adj4rMnkyCmdLn.cssScanner.referenceCssFiles.${i}`;
        value = window.localStorage.getItem(key);
      }

      this.#adj4rMnkyCmdLn.logMsg(`A total of ${i} reference style sheets were
        cleared from local storage.`);
    }

    //»/////////////////////////
    //« §3.3.5: getRefStyleSheet
    getRefStyleSheet(index) {
      if (
        typeof index == 'string' &&
        !Number.isNaN(parseInt(index, 10))
      ) {
        index = parseInt(index, 10);
      }

      if (
        typeof index != 'number' ||
        index < 0 ||
        index >= this.#referenceCssFiles.length
      ) {
        return null;
      }

      return this.#referenceCssFiles[index].styleSheet;
    }

    //»////////////////////////////
    //« §3.3.6: matchDocSSIndexToSS
    matchDocSSIndexToSS(docSSIndex, cssTextSrc) {
      docSSIndex = this.#checkDocSSIndex(docSSIndex);

      if (
        docSSIndex === null
        || document.styleSheets[docSSIndex].href != cssTextSrc
      ) {
        for (let i = 0; i < document.styleSheets.length; i++) {
          if (document.styleSheets[i].href == cssTextSrc) {
            docSSIndex = i;
            break;
          } else if (i == document.styleSheets.length - 1) {
            docSSIndex = null;
          }
        }
      }

      return docSSIndex;
    }

    //»////////////////////////////////
    //« §3.3.7: restoreRefSSFromStorage
    restoreRefSSFromStorage() {
      let i = 0;
      let key = `${this.#localStoragePrefix}${i}`;
      let value = window.localStorage.getItem( key );
      let styleSheetData;
      const iter4nLimit = 1024;

      while (i < iter4nLimit && value !== null) {
        styleSheetData = JSON.parse( value );

        styleSheetData.docSSIndex =
          this.matchDocSSIndexToSS(styleSheetData.docSSIndex,
            styleSheetData.cssTextSrc );

        this.addRefStyleSheet(styleSheetData.cssText, styleSheetData.docSSIndex,
          styleSheetData.cssTextSrc );

        i++;
        key = `adj4rMnkyCmdLn.cssScanner.referenceCssFiles.${i}`;
        value = window.localStorage.getItem(key);
      }

      this.#adj4rMnkyCmdLn.logMsg( `A total of ${i} reference style sheets were
        restored from local storage.` );
    }

    //>/////////////////////////////////////////////////////////////////////----
    //< §3.4: CSS Class Analysis and Extraction

    //»//////////////////////////
    //« §3.4.1: classesUsedInPage
    get classesUsedInPage() {
      if (this.#classesUsedInPage === undefined) {
        this.scanForClassesUsedInPage();
      }

      return Array.from( this.#classesUsedInPage ).toSorted().join( '\n' );
    }

    //»//////////////////////////////
    //« §3.4.2: getClassesUsedInDocSS
    getClassesUsedInDocSS(index) {
      if (index < 0 || index >= document.styleSheets.length) {
        return null;
      }

      return this.#getClassesUsedInSS(document.styleSheets[index]);
    }

    //»////////////////////////////////////
    //« §3.4.3: getClassesUsedInReferenceSS
    getClassesUsedInReferenceSS(index) {
      if (index < 0 || index >= this.#referenceCssFiles.length) {
        return null;
      }

      return this.#getClassesUsedInSS(this.#referenceCssFiles[index]
        .styleSheet);
    }

    //»////////////////////////////////////////
    //« §3.4.4: getDocSSRulesBySelectorMatching
    getDocSSRulesBySelectorMatching(sSIndex, regExpNeedle) {
      // ·> TO-DO: Check if sSIndex is an array and, if so, process multiple   ·
      // ·  style sheets with a single call.                                  <·
      if ( sSIndex < 0 || sSIndex >= document.styleSheets.length ) {
        return null;
      }

      const results = [];
      const rules = document.styleSheets[ sSIndex ].cssRules;
      this.#copyRulesCSSToArrayBySel4rMat4g(rules, results, regExpNeedle);

      return results;
    }

    //»//////////////////////
    //« §3.4.5: getRefCssText
    getRefCssText(index) {
      if (
        typeof index == 'string'
        && !Number.isNaN(parseInt(index, 10))
      ) {
        index = parseInt(index, 10);
      }

      if (
        typeof index != 'number'
        || index < 0
        || index >= this.#referenceCssFiles.length
      ) {
        return null;
      }

      return this.#referenceCssFiles[index].cssText;
    }

    //»///////////////////////////////
    //« §3.4.6: printClassesUsedInPage
    printClassesUsedInPage() {
      if (this.#classesUsedInPage === undefined) {
        this.scanForClassesUsedInPage();
      }

      console.log(Array.from(this.#classesUsedInPage).toSorted());
    }

    //»/////////////////////////////////
    //« §3.4.7: scanForClassesUsedInPage
    scanForClassesUsedInPage() {
      this.#classesUsedInPage = this.#extractClassesUsedInPage();
    }

    //»/////////////////////////
    //« §3.4.8: #checkDocSSIndex
    #checkDocSSIndex(docSSIndex) {
      if (
        typeof docSSIndex == 'string'
        && !Number.isNaN(parseInt(docSSIndex, 10))
      ) {
        docSSIndex = parseInt(docSSIndex, 10);
      }

      if (
        typeof docSSIndex != 'number'
        || docSSIndex < 0
        || docSSIndex >= document.styleSheets.length
      ) {
        docSSIndex = null;
      }

      return docSSIndex;
    }

    //»//////////////////////////////////
    //« §3.4.9: #extractClassesUsedInPage
    #extractClassesUsedInPage() {
      const cssClassSet = new Set();
      const bodyElems = document.querySelectorAll('body, body *');

      bodyElems.forEach((elem, index) => {
        for (let index = 0; index < elem.classList.length; index++) {
          cssClassSet.add(elem.classList.item(index));
        }
      });

      return cssClassSet;
    }

    //»/////////////////////////////////////
    //« §3.4.10: #findClassesUsedInMediaRule
    #findClassesUsedInMediaRule(mediaRule, setOfClasses) {
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

    //»/////////////////////////////////////
    //« §3.4.11: #findClassesUsedInStyleRule
    #findClassesUsedInStyleRule(styleRule, setOfClasses) {
      if (styleRule.selectorText === undefined) {
        return;
      }

      const classesFound =
        styleRule.selectorText.match(/\.-?[_a-zA-Z]+[_a-zA-Z0-9-]*/g);

      if( classesFound === null ) {
        return;
      }

      classesFound.forEach((match) => {
        setOfClasses.add(match.substring(1, match.length));
      });
    }

    //»/////////////////////////////
    //« §3.4.12: #getClassesUsedInSS
    #getClassesUsedInSS(styleSheet) {
      if (!(
        typeof styleSheet == 'object'
        && styleSheet instanceof CSSStyleSheet
      )) {
        return null;
      }

      const setOfClassesInSS = new Set();

      for (let i = 0; i < styleSheet.cssRules.length; i++) {
        if (styleSheet.cssRules.item(i) instanceof CSSStyleRule) {
          this.#findClassesUsedInStyleRule(styleSheet.cssRules.item(i),
            setOfClassesInSS);
        }

        if (styleSheet.cssRules.item(i) instanceof CSSMediaRule) {
          this.#findClassesUsedInMediaRule(styleSheet.cssRules.item(i),
            setOfClassesInSS);
        }
      }

      return Array.from(setOfClassesInSS).toSorted().join('\n');
    }

    //>/////////////////////////////////////////////////////////////////////----
    //< §3.5: Document Analysis

    //»///////////////////////
    //« §3.5.1: printDocSSList
    printDocSSList() {
      const docSSDetails = [];

      for (let index = 0; index < document.styleSheets.length; index++) {
        docSSDetails.push({
          href: document.styleSheets.item(index).href,
          tagName: document.styleSheets.item(index).ownerNode.tagName,
          tagID: document.styleSheets.item(index).ownerNode.id,
          innerTextHead: document.styleSheets.item(index)
            .ownerNode.innerText.substring(0, 64),
        });

        if (docSSDetails[index].innerTextHead.length == 64) {
          docSSDetails[index].innerTextHead += "…";
        }
      }

      console.table( docSSDetails, [ 'href', 'tagName', 'tagID',
        'innerTextHead' ] );
    }

    //»////////////////////////////
    //« §3.5.2: printLinksAttrsList
    printLinksAttrsList() {
      console.log(this.#linksAttrsList);
    }

    //»////////////////////////////
    //« §3.5.3: printLinkedCssFiles
    printLinkedCssFiles() {
      console.table( this.#linkedCssFiles, [ 'htmlId', 'section', 'ssUrl' ] );
    }

    //»////////////////////////
    //« §3.5.4: scanForCssFiles
    scanForCssFiles() {
      const cssFileLinks = document.querySelectorAll(
        'link[rel="stylesheet"]'
      );

      const scanResults = [];
      const linksAttrsList = new Set();

      cssFileLinks.forEach((link, index) => {
        this.#extractAttrsFromSsLink(link, linksAttrsList);

        // ·> Find the source URL for the linked CSS file.                    <·
        let hrefVal = link.href;

        if (hrefVal == '') {
          hrefVal = link.dataset.href;
        }

        if (hrefVal == '') {
          return;
        }

        // ·> Determine the section of the DOM, head or body, of the link.    <·
        let domSection = 'neither';

        if (link.closest('head') !== null) {
          domSection = 'head';
        } else if (link.closest('body') !== null) {
          domSection = 'body';
        }

        // ·> Store scan results for later.                                   <·
        scanResults.push({
          htmlId: link.id,
          section: domSection,
          ssUrl: hrefVal,
        });
      } );
      this.#linksAttrsList = this.#sortAttrsFromSsLinks(linksAttrsList);
      this.#linkedCssFiles = scanResults;
    }

    //»//////////////////////////
    //« §3.5.5: scanLinkedCssFile
    async scanLinkedCssFile(whichFile) {
      if (!(
        typeof whichFile === 'string'
        || typeof whichFile === 'number'
      )) {
        throw new TypeError( this.#adj4rMnkyCmdLn.getLabeledMsg( `I was given
          the following input for scanning a CSS file: ^¶⇥«${whichFile}».
          ^¶ This input was not a string or number as expected.` ) );
      }

      if (
        typeof whichFile === 'string'
        && !Number.isNaN(parseInt(whichFile))
      ) {
        whichFile = parseInt(whichFile);
      }

      if (
        typeof whichFile === 'number'
        && (whichFile < 0 || whichFile >= this.#linkedCssFiles.length)
      ) {
        throw new RangeError(this.#adj4rMnkyCmdLn.getLabeledMsg( `I was given
          the following index as input for scanning a CSS file: ^¶
          ⇥«${whichFile}»^¶ This index is out of range with respect to the
          number of linked CSS files loaded by this page.`));
      }

      if (typeof whichFile === 'number') {
        whichFile = this.#linkedCssFiles[ whichFile ].ssUrl;
      }

      this.#scannedCssFile = this.#fetchStyleSheetCode( whichFile );

      return this.#scannedCssFile;
    }

    //»///////////////////////////////////
    //« §3.5.6: storeRefStyleSheetsLocally
    storeRefStyleSheetsLocally() {
      try {
        for(let i = 0; i < this.#referenceCssFiles.length; i++) {
          window.localStorage.setItem(
            `${this.#localStoragePrefix}${i}`,
            JSON.stringify({
              cssText: this.#referenceCssFiles[i].cssText,
              cssTextSrc: this.#referenceCssFiles[i].cssTextSrc,
              docSSIndex: this.#referenceCssFiles[i].docSSIndex,
              htmlId: this.#referenceCssFiles[i].htmlId,
            }));
        }
        this.#adj4rMnkyCmdLn.logMsg(`A total of
          ${this.#referenceCssFiles.length} reference style sheets were placed
          in to local storage using the key pattern
          '${this.#localStoragePrefix}n'.`);
      } catch( error ) {
        this.#adj4rMnkyCmdLn.logMsg(error.message);
      }
    }

    //»////////////////////////////////
    //« §3.5.7: #extractAttrsFromSsLink
    #extractAttrsFromSsLink(link, attrsSet) {
      const numAttrs = link.attributes.length;
      for (let index = 0; index < numAttrs; index++) {
        attrsSet.add(link.attributes[index].name);
      }
    }

    //»/////////////////////////////
    //« §3.5.8: #fetchStyleSheetCode
    async #fetchStyleSheetCode(url) {
      let finalResponse = null;

      if (!this.isUrlStringToCss(url)) {
        throw new TypeError(this.#adj4rMnkyCmdLn.getLabeledMsg(
          `When attempting to fetch style sheet code, a URL I was given for a
          style sheet: ^¶⇥«${url}»^¶ does not take the expected form.`
        ));
      }

      await fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(this.#adj4rMnkyCmdLn.getLabeledMsg(
              `Unable to access resource: ^¶⇥« ${url} »^¶ Status returned was:
              «${response.status}».`
            ));
          }

          return response.text();
        })
        .then((response) => {
          finalResponse = response;
        })
        .catch((error) => {
          console.error(this.#adj4rMnkyCmdLn.getLabeledMsg(error.message));

          this.#adj4rMnkyCmdLn.logMsg(`Since I was unable to use the fetch API
            to request the style sheet, I will now open it in a new tab.`);

          this.#adj4rMnkyCmdLn.openUrlInNewWindow(url);
        } );

      return finalResponse;
    }

    //»///////////////////////////////
    //« §3.5.9: #findDocSSIndexFromURL
    #findDocSSIndexFromURL(urlOfSS) {
      let scanner = 0;
      let foundIndex = null;

      while(scanner < document.styleSheets.length && foundIndex === null) {
        if(document.styleSheets.item(scanner).href == urlOfSS) {
          foundIndex = scanner;
        }

        scanner++;
      }

      return foundIndex;
    }

    //»////////////////////////////
    //« §3.5.10: #recon5tCssFromDoc
    #recon5tCssFromDoc( urlOfCssSrc ) {
      let allCssText = '';

      try {
        const indexOfSS = this.#findDocSSIndexFromURL(urlOfCssSrc);
        if (indexOfSS === null) {
          throw new Error(this.#adj4rMnkyCmdLn.getLabeledMsg(`I was unable to
            find the requested style sheet among those loaded on the page.`));
        }

        const docSSRules = document.styleSheets.item(indexOfSS).cssRules;
        for(let index = 0; index < docSSRules.length; index++) {
          allCssText += docSSRules.item(index).cssText;
        }
      } catch (error) {
        console.error(this.#adj4rMnkyCmdLn.getLabeledMsg(error.message));
        this.#adj4rMnkyCmdLn.logMsg(`Since I was unable to reconstruct the
          style sheet from «document.styleSheets», I suggest you manually load
          the style sheet code for further analysis into my list of dynamically
          loaded reference style sheets.`);
      }

      return allCssText;
    }

    //>/////////////////////////////////////////////////////////////////////----
    //< §3.6: Browser Control

    //»/////////////////////////////
    //« §3.6.1: openDocSSInNewWindow
    openDocSSInNewWindow( whichStyleSheet ) {
      if (
        typeof whichStyleSheet == 'string' &&
        !Number.isNaN(parseInt(whichStyleSheet, 10))
      ) {
        whichStyleSheet = parseInt(whichStyleSheet, 10);
      }

      if (typeof whichStyleSheet != 'number') {
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

      if (document.styleSheets.item( whichStyleSheet ).href === null) {
        adj4rMnkyCmdLn.logMsg( `The index you gave me for the document style
          sheet to open of «${whichStyleSheet}» represents an internal style
          sheet.` );
        return;
      }

      adj4rMnkyCmdLn.logMsg(`Opening document style sheet «${whichStyleSheet}»
        with href «${document.styleSheets.item( whichStyleSheet ).href}» in a
        new window.`);

      window.open(
        `${document.styleSheets.item(whichStyleSheet).href}`,
        '_blank'
      ).focus();
    }
  }

  //>/////////////////////////////////////////////////////////////////////////--
  //< §4: DomScanner Class Declaration
  class DomScanner {
    #adj4rMnkyCmdLn;
    #commonWords;

    //>/////////////////////////////////////////////////////////////////////----
    //< §4.1: Constructor
    constructor(adj4rMnkyCmdLn) {
      this.#adj4rMnkyCmdLn = adj4rMnkyCmdLn;

      this.#commonWords =
        new Set([
          "a", "about", "after", "ago", "all", "also", "although", "an",
          "and", "any", "are", "as", "at", "because", "be", "before",
          "beside", "besides", "between", "but", "by", "can", "can't",
          "can’t", "could", "considering", "day", "despite", "did", "does",
          "doesn't", "doesn’t", "don't", "don’t", "enough", "even", "except", "for", "from",
          "get", "give", "given", "gives", "go", "had", "have", "has", "he", "he's",
          "he’s", "her", "his", "how", "i", "if", "in", "into", "is", "it",
          "it's", "it’s", "its", "just", "lest", "like", "made", "make", "may", "me",
          "moreover", "most", "my", "new", "no", "not", "notwithstanding",
          "now", "of", "off", "on", "once", "one", "only", "onto", "or",
          "other", "our", "out", "over", "people", "per", "provided",
          "providing", "save", "say", "seeing", "she", "she's", "she’s",
          "since", "so", "such", "supposing", "than", "that", "that's",
          "that’s", "the", "their", "theirs", "them", "there", "there's",
          "there’s", "these", "they", "this", "though", "through",
          "throughout", "thru", "till", "to", "too", "two", "unless", "until",
          "unto", "up", "upon", "us", "want", "we", "we're", "we’re", "were",
          "what", "what's", "what’s", "when", "whenever", "where", "whereas",
          "wherever", "which", "while", "whilst", "who", "whom", "will",
          "with", "within", "without", "without", "would", "you", "you'll",
          "you’ll", "you're", "you’re", "your"
        ]);
    }

    //>/////////////////////////////////////////////////////////////////////----
    //< §4.2: Data Representation

    //»///////////////////////
    //« §4.2.1: #ele3tToString
    #ele3tToString(ele3t) {
      const ele3tId =
        ele3t.id != '' ?
        '#' + ele3t.id :
        '';

      const ele3tClassList =
        ele3t.classList.length > 0 ?
        '.' + [...ele3t.classList].join( '.' ) :
        '';

      return ele3t.tagName + ele3tId + ele3tClassList;
    }

    //>/////////////////////////////////////////////////////////////////////----
    //< §4.3: DOM Traversal

    //»////////////////////////////
    //« §4.3.1: #getParentsForEle3t
    #getParentsForEle3t(ele3t) {
      const parents = [];
      while (ele3t.parentNode !== null) {
        parents.push(ele3t.parentNode);
        ele3t = ele3t.parentNode;
      }

      return parents;
    }

    //>/////////////////////////////////////////////////////////////////////----
    //< §4.4: Analysis of Heading Hierarchy

    //»/////////////////////////////
    //« §4.4.1: printHeadingTextTree
    printHeadingTextTree(maxLineLength = 100) {
      const h5gs = [...document.querySelectorAll('h1, h2, h3, h4, h5, h6')];
      const h5gTree = this.#createTextTreeFromH5gArray(h5gs);
      console.log(h5gTree.toString(maxLineLength));
    }

    //»////////////////////////////
    //« §4.4.2: #compareH5gsParents
    #compareH5gsParents(rootI3x, p5sRef5e, p5sCur3t) {
      let i, j;
      for (i = rootI3x; i < p5sRef5e.length; i++) {
        for (j = 0; j < p5sCur3t.length; j++) {
          if (p5sRef5e[i] == p5sCur3t[j]) {
            break;
          }
        }

        if (j == p5sCur3t.length) {
          continue;
        }

        if (i != rootI3x) {
          rootI3x = i;
        }

        break;
      }

      return rootI3x;
    }

    //»////////////////////////////////////
    //« §4.4.3: #createTextTreeFromH5gArray
    #createTextTreeFromH5gArray(h5gs) {
      if (h5gs.length == 0) {
        return null;
      }

      let h5gLevel = parseInt(h5gs[0].tagName.match(/([0-9])/)[0]);
      const rootEle3t = this.#findH5gsClosestRootEle3t(h5gs);
      const tree = new DataTree(`«${this.#ele3tToString(rootEle3t)}»`);
      let lastNode =
        tree.root.addChild(
          `${h5gs[0].innerText.trim()} «${this.#ele3tToString(h5gs[0])}»`
        );
      let prevH5gLevel = h5gLevel;

      for (let i = 1; i < h5gs.length; i++) {
        h5gLevel = parseInt( h5gs[ i ].tagName.match( /([0-9])/)[ 0 ] );

        if ( h5gLevel > prevH5gLevel ) {
          lastNode =
            lastNode.addChild(
              `${h5gs[i].innerText.trim()} «${this.#ele3tToString(h5gs[i])}»`
            );
        } else if ( h5gLevel == prevH5gLevel ) {
          lastNode =
            lastNode.addSibling(
              `${h5gs[i].innerText.trim()} «${this.#ele3tToString(h5gs[i])}»`
            );
        } else {
          lastNode =
            this.#placeH5gUpTreeBranch(h5gs[i], h5gLevel, tree, lastNode);
        }

        console.log(`Item #${ i } processed.`);
        prevH5gLevel = h5gLevel;
      }

      return tree;
    }

    //»//////////////////////////////
    //« §4.4.4: #placeH5gUpTreeBranch
    #placeH5gUpTreeBranch(h5g, h5gLevel, tree, lastNode) {
      let parentH5gLevel;

      while(lastNode.parent != tree.root) {
        parentH5gLevel = parseInt(lastNode.parent.data.match(/«H([0-9])/)[1]);
        if (h5gLevel >= parentH5gLevel) {
          lastNode =
            lastNode.parent.addSibling(
              `${h5g.textContent.trim()} «${this.#ele3tToString(h5g)}»`
            );
          return lastNode;
        } else {
          lastNode = lastNode.parent;
        }
      }

      if (lastNode.parent == tree.root) {
        lastNode =
          tree.root.addChild(
            `${h5g.textContent.trim()} «${this.#ele3tToString(h5g)}»`
          );
      }

      return lastNode;
    }

    //»//////////////////////////////////
    //« §4.4.5: #findH5gsClosestRootEle3t
    #findH5gsClosestRootEle3t(h5gs) {
      const p5sRef5e = this.#getParentsForEle3t(h5gs[0]);
      let p5sCur3t, rootI3x = 0;

      for (let i = 1; i < h5gs.length; i++) {
        p5sCur3t = this.#getParentsForEle3t(h5gs[ i ]);
        rootI3x = this.#compareH5gsParents(rootI3x, p5sRef5e, p5sCur3t);
      }

      return p5sRef5e[rootI3x];
    }

    //>/////////////////////////////////////////////////////////////////////----
    //< §4.5: Analysis of Writing Composition

    //»//////////////////////////////////////
    //« §4.5.1: getListsOfWordsUsedInDocument
    getListsOfWordsUsedInDocument(mainSel5 = 'main') {
      if (document.documentElement.lang !== "en" && document.documentElement.lang !== "en-US") {
        this.#adj4rMnkyCmdLn.logErrorMsg(
          `I am programmed to analyze the writing composition of documents written in English. The current document has a language setting of "${document.documentElement.lang}."`
        );
        return null;
      }

      if (typeof mainSel5 != 'string') {
        this.#adj4rMnkyCmdLn.logErrorMsg(
          `The selector I was given to isolate the "main" element of the page was not of the expected "string" type.`
        );
        return null;
      }

      const $main = document.querySelector(mainSel5);
      if ($main === null) {
        this.#adj4rMnkyCmdLn.logErrorMsg(
          `I am attempting to analyze the words used in this document, but I could not find a "main" element using the selector “${mainSel5}”.`
        );
        return null;
      }

      const words = $main.innerText.match(
        /\w+'\w+|\w+’\w+|\w+(?:[-–]\w+)+|-\w+|\w+/g
      );

      const results = {};
      results.allWords = words.sort();

      const uniqueWords = new Set();
      words.forEach(word => {
        uniqueWords.add(word.toLowerCase());
      });
      const uniqueWordsArr2 = [...uniqueWords];
      results.uniqueWords = uniqueWordsArr2.sort();

      return results;
    }

    //»//////////////////////////////////////
    //« §4.5.2: getListsOfWordsUsedInHeadings
    getListsOfWordsUsedInHeadings() {
      if (document.documentElement.lang !== "en" && document.documentElement.lang !== "en-US") {
        this.#adj4rMnkyCmdLn.logErrorMsg(
          `I am programmed to analyze the writing composition of documents written in English. The current document has a language setting of "${document.documentElement.lang}."`
        );
        return null;
      }

      const $hXs = [...document.querySelectorAll('h1, h2, h3, h4, h5, h6')];
      if ($hXs.length == 0) {
        this.#adj4rMnkyCmdLn.logErrorMsg(
          `I am attempting to analyze the words used in the headings of this document, but I could not find any heading elements.`
        );
        return null;
      }

      const uniqueWords = new Set();
      $hXs.forEach(function ($hX) {
        let words = $hX.innerText.match(
          /\w+'\w+|\w+’\w+|\w+(?:[-–]\w+)+|-\w+|\w+/g
        );
        if (words === null) {
          return;
        }
        words.forEach(function (word) {
          uniqueWords.add(word.toLowerCase());
        });
      });

      return [...uniqueWords].sort();
    }

    //»///////////////////////////////////////
    //« §4.5.3: printUniqueWordsUsedInDocument
    printUniqueWordsUsedInDoc4t(mainSel5 = undefined, removeCommonWords = false) {
      const wordsUsed = this.getListsOfWordsUsedInDocument(mainSel5);
      if (wordsUsed === null) {
        return;
      }

      let msgOutput =
        `I found a total of ${wordsUsed.allWords.length} words in the document that can be reduced to ${wordsUsed.uniqueWords.length} unique words`;
      let wordsOutput;

      if (!removeCommonWords) {
        msgOutput += "as follows:";
        wordsOutput = wordsUsed.uniqueWords.join('\n');
      } else {
        const wordsUsedSet = new Set(wordsUsed.uniqueWords);
        const wordsUsedArr2 = [...wordsUsedSet.difference(this.#commonWords)];
        wordsOutput = wordsUsedArr2.join('\n');
        msgOutput +=
          `. A total of ${wordsUsedArr2.length} unique words used which are not considered common are as follows:`;
      }

      this.#adj4rMnkyCmdLn.logMsg(msgOutput);
      console.log(wordsOutput);
    }

    //»///////////////////////////////////////
    //« §4.5.4: printUniqueWordsUsedInDocument
    printUniqueWordsUsedInHeadings(removeCommonWords = true) {
      const wordsUsed = this.getListsOfWordsUsedInHeadings();
      if (wordsUsed === null) {
        return;
      }

      let msgOutput =
        `I found a total of ${wordsUsed.length} unique words used in the headings of the document`;
      let wordsOutput;

      if (!removeCommonWords) {
        msgOutput += " as follows:";
        wordsOutput = wordsUsed.uniqueWords.join('\n');
      } else {
        const wordsUsedSet = new Set(wordsUsed);
        const wordsUsedArr2 = [...wordsUsedSet.difference(this.#commonWords)];
        wordsOutput = wordsUsedArr2.join('\n');
        msgOutput +=
          `. A total of ${wordsUsedArr2.length} unique words used which are not considered common are as follows:`;
      }

      this.#adj4rMnkyCmdLn.logMsg(msgOutput);
      console.log(wordsOutput);
    }

    //>/////////////////////////////////////////////////////////////////////----
    //< §4.6: Document Element Highlighting

    //»/////////////////////////////
    //  §4.6.1: highlightDomElements
    //«  Highlight elements within the DOM using a visual indicator.
    highlightDomElements(sel4r) {
      // const $navs = [...document.querySelectorAll('nav, [role="navigation"]')];
      sel4r = this.#interpretSel4rForDomHig5ts(sel4r);
      const $ele4s = [...document.querySelectorAll(sel4r)];
      const randomColor = this.#getRandomInd5rColorSpecStub();
      $ele4s.forEach(function ($ele3t) {
        const $spanInd5r = document.createElement('span');
        $spanInd5r.classList.add('adj4rMnky-ele3t-hig5t__ind5r');
        $spanInd5r.style.backgroundColor = randomColor + '.15)';
        $spanInd5r.style.border = '2px solid ' + randomColor + '.3)';
        $spanInd5r.style.bottom = '0';
        $spanInd5r.style.display = 'block';
        $spanInd5r.style.left = '0';
        $spanInd5r.style.pointerEvents = 'none';
        $spanInd5r.style.position = 'absolute';
        $spanInd5r.style.right = '0';
        $spanInd5r.style.top = '0';
        $spanInd5r.style.zIndex = '2147483647';

        const $ele3tStyle = window.getComputedStyle($ele3t);
        if ($ele3tStyle.position == '' || $ele3tStyle.position == 'static') {
            $ele3t.style.position = 'relative';
        }
        $ele3t.classList.add('adj4rMnky-ele3t-hig5t');
        $ele3t.appendChild($spanInd5r);
      });
    }


    //»///////////////////////////////////
    //  §4.6.2: removeDomElementHighlights
    //   Remove visual indicators that were previously added to the DOM to high-
    //«  light elements.
    removeDomElementHighlights() {
      // const $navs = [...document.querySelectorAll('nav, [role="navigation"]')];
      const $hig5tedEle4s =
        [...document.querySelectorAll('.adj4rMnky-ele3t-hig5t')];
      $hig5tedEle4s.forEach(($ele3t) => {
        $ele3t.classList.remove('adj4rMnky-ele3t-hig5t');
        // To-do: Remove relative property spec?
      });

      const $spanInd5rs =
        [...document.querySelectorAll('span.adj4rMnky-ele3t-hig5t__ind5r')];
      $spanInd5rs.forEach(($ele3t) => {
        $ele3t.remove();
      });
    }

    //»/////////////////////////////
    //  §4.6.3: #getRandomInd5rColor
    //   Get a substring that begins an rgba CSS function that will specify a
    //   randomly chosen color to be used in highlighting elements within the
    //   document. Assume the calling function will specify the opacity and
    //«  close the rgba function.
    #getRandomInd5rColorSpecStub() {
      let rVal, gVal, bVal;
      const roll = Math.random();
      if (roll <= 0.3333) {
        rVal = Math.round(Math.random() * 128) + 127;
        gVal = Math.round(Math.random() * 192);
        bVal = Math.round(Math.random() * 192);
      } else if (roll <= 0.6667) {
        rVal = Math.round(Math.random() * 192);
        gVal = Math.round(Math.random() * 128) + 127;
        bVal = Math.round(Math.random() * 192);
      } else {
        rVal = Math.round(Math.random() * 192);
        gVal = Math.round(Math.random() * 128);
        bVal = Math.round(Math.random() * 192) + 127;
      }

      return `rgba(${rVal}, ${gVal}, ${bVal}, `;
    }

    //»///////////////////////////
    //  §4.6.4: #interpretSel4rDom
    //   Interpret a selector that was passed to the DomScanner instance for the
    //«  purpose of highlighting elements within the DOM.
    #interpretSel4rForDomHig5ts(sel4r) {
      if (sel4r == '$nav') {
        sel4r = 'nav, [role="navigation"]';
      } else if (sel4r == '$hX' || sel4r == '$hx') {
        sel4r = 'h1, h2, h3, h4, h5, h6';
      }

      return sel4r;
    }
  }

  //>/////////////////////////////////////////////////////////////////////////--
  //< §5: DataTree Class Declaration
  class DataTree {

    //>/////////////////////////////////////////////////////////////////////----
    //< §5.1: Constructor
    constructor(root) {
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

    //>/////////////////////////////////////////////////////////////////////----
    //< §5.2: Data Representation

    //»/////////////////
    //« §5.2.1: toString
    toString(maxLineLength = 100) {
      let cur4Node = this.root.children[0];
      let out3Prefix = '';
      let ou3tString = out3Prefix + this.root.data + '\n';
      let counter = 0;

      while (cur4Node !== undefined) {
        out3Prefix = out3Prefix.replace('├──', '│  ');
        out3Prefix = out3Prefix.replace('└──', '   ');
        
        if (cur4Node.getNextSibling() === undefined) {
          out3Prefix += '└──';
        } else {
          out3Prefix += '├──';
        }

        ou3tString += this.#nodeToString(cur4Node, out3Prefix, maxLineLength);

        if (cur4Node.children.length) {
          cur4Node = cur4Node.children[0];
        } else if (cur4Node.getNextSibling() !== undefined) {
          cur4Node = cur4Node.getNextSibling();
          out3Prefix = out3Prefix.slice(0, out3Prefix.length - 3);
        } else {
          cur4Node = cur4Node.parent;
          out3Prefix = out3Prefix.slice(0, out3Prefix.length - 3);

          while (
            cur4Node !== undefined
            && cur4Node.getNextSibling() === undefined
          ) {
            cur4Node = cur4Node.parent;
            out3Prefix = out3Prefix.slice(0, out3Prefix.length - 3);
          }
          if (cur4Node !== undefined) {
            cur4Node = cur4Node.getNextSibling();
            out3Prefix = out3Prefix.slice(0, out3Prefix.length - 3);
          }
        }
      }

      return ou3tString;
    }

    //»/////////////////////
    //« §5.2.2: nodeToString
    #nodeToString(cur4Node, out3Prefix, maxLineLength) {
      let ou3tString;
      let maxDataLength = maxLineLength - out3Prefix.length;

      if (maxDataLength <= 40 || cur4Node.data.length <= maxDataLength) {
        ou3tString = out3Prefix + cur4Node.data + '\n';

        return ou3tString;
      }

      ou3tString = this.#wrapStrDataAtLength(cur4Node.data, maxDataLength);
      ou3tString = ou3tString.replace(/^(.)/, out3Prefix + '$1');
      out3Prefix = out3Prefix.replace('├──', '│  ').replace( '└──', '   ');
      ou3tString = ou3tString.replace(/(\n)(.)/g, '$1' + out3Prefix + '$2');

      return ou3tString + '\n';
    }

    //»/////////////////////////////
    //« §5.2.3: #wrapStrDataAtLength
    #wrapStrDataAtLength( strData, len ) {
      // ·> Use a default line wrapping length.                               <·
      if (typeof len == 'undefined') {
        len = 80;
      }

      // ·> Before proceeding, ensure the line wrapping length is a valid      ·
      // ·  number if possible. If not, just return the unwrapped message.    <·
      if (typeof len != 'number' && Number.isNaN(parseInt(len))) {
        return strData;
      } else if (typeof len != 'number') {
        len = parseInt(len);
      }

      // ·> Enforce minimum and maximum line wrapping lengths to ensure a      ·
      // ·  clean looking result within the console.                          <·
      if (len < 40) {
        len = 40;
      } else if (len > 120) {
        len = 120;
      }

      // ·> Encode any newlines that happen to be present in the message as    ·
      // ·  greek capital lambda characters.                                  <·
      strData = strData.replace('\n', ' \\n ');

      // ·> Apply line wrapping to the message using a reverse scanning tech-  ·
      // .  nique to identify appropriate break points for line wrapping.     <·
      let w5dStrData = '';
      let startI3x = 0;
      let scanI3x;
      while (startI3x < strData.length) {
        scanI3x = startI3x + len;

        // ·> Start scanning at a distance of the line length limit away from  ·
        // ·  the starting index, and work backward until a break-point char-  ·
        // ·  acter is encountered.                                           <·
        while (
          scanI3x < strData.length
          && scanI3x > startI3x
          && strData.charAt(scanI3x).match(/[-–— /\\«»()[\]{}]/) === null
        ) {
          scanI3x--;
        }

        // ·> Handle edge cases where scanning found no break point or reached ·
        // ·  the end of the full unwrapped message.                          <·
        if (scanI3x == startI3x) {
          scanI3x = scanI3x + len;
        } else if (scanI3x > strData.length) {
          scanI3x = strData.length;
        }

        // ·> Unless we are working on the first line of the wrapped message,  ·
        // ·  insert a newline character before appending the next portion of  ·
        // ·  the wrapped message just identified.                            <·
        if (startI3x != 0) {
          w5dStrData += '\n';
        }

        // ·> Avoid beginning lines of a wrapped message with a space char-    ·
        // ·  acter.                                                          <·
        if (startI3x != 0 && strData.charAt(startI3x) == ' ') {
          startI3x++;
        }

        // ·> Append the next portion of the wrapped message.                 <·
        w5dStrData += strData.substring(startI3x, scanI3x);

        // ·> Prepare to scan for the next break point in the full, unwrapped  ·
        // ·  message.                                                        <·
        startI3x = scanI3x;
        while (
          startI3x < strData.length
          && strData.charAt(startI3x) == ' '
        ) {
          startI3x++;
        }
      }

      return w5dStrData;
    }

    //>/////////////////////////////////////////////////////////////////////----
    //< §5.3: Searching the Tree

    //»//////////////////
    //« §5.3.1: findFirst
    findFirst(data) {
      return this.root.findFirst(data);
    }
  }

  //>/////////////////////////////////////////////////////////////////////////--
  //< §6: DataTreeNode Class Declaration
  class DataTreeNode {

    //>/////////////////////////////////////////////////////////////////////----
    //< §6.1: Constructor
    constructor(data, index, depth, parentNode, parentTree) {
      this.data = data;
      this.index = index;
      this.depth = depth;
      this.parent = parentNode;
      this.tree = parentTree
      this.children = [];
    }

    //>/////////////////////////////////////////////////////////////////////----
    //< §6.2: Modification of Tree Structure

    //»/////////////////
    //« §6.2.1: addChild
    addChild(data) {
      const newNode = new DataTreeNode(
        data,
        this.children.length,
        this.depth + 1,
        this,
        this.tree
      );

      this.children.push(newNode);
      this.tree.lastAdded = newNode;

      return newNode;
    }

    //»///////////////////
    //« §6.2.2: addSibling
    addSibling( data ) {
      let newNode = undefined;

      if (this.parent !== undefined) {
        newNode = new DataTreeNode(
          data,
          this.parent.children.length,
          this.depth,
          this.parent,
          this.tree
        );

        this.parent.children.push(newNode);
        this.tree.lastAdded = newNode;
      }

      return newNode;
    }

    //>/////////////////////////////////////////////////////////////////////----
    //< §6.3: Tree Traversal

    //»///////////////////////
    //« §6.3.1: getNextSibling
    getNextSibling() {
      let next;

      if (
        this.parent === undefined
        || this.index >= this.parent.children.length - 1
      ) {
        next = undefined;
      } else {
        next = this.parent.children[this.index + 1];
      }

      return next;
    }

    //»//////////////////////
    //« §6.3.2: getPathToRoot
    getPathToRoot() {
      const path = [];
      let curNode = this.parent;

      path.splice(0, 0, this.index);
      for (let i = this.depth - 1; i > 0; i--) {
        path.splice(0, 0, curNode.index);
        curNode = curNode.parent;
      }

      return path;
    }

    //»///////////////////////////
    //« §6.3.3: getPreviousSibling
    getPreviousSibling() {
      let previous;

      if (this.index == 0) {
        previous = undefined;
      } else {
        previous = this.parent.children[this.index - 1];
      }

      return previous;
    }

    //>/////////////////////////////////////////////////////////////////////----
    //< §6.4: Searching the Tree

    //»//////////////////
    //« §6.4.1: findFirst
    findFirst(data) {
      let result = undefined;

      if (data == this.data) {
        result = this;
      } else if (this.children.length) {
        for (let i = 0; !result && i < this.children.length; i++) {
          result = this.children[i].findFirst(data);
        }
      }

      return result;
    }
  }

  //>/////////////////////////////////////////////////////////////////////////--
  //< §7: Script Loading

  function retryLoadingScript(
    loadingStartTime, instCreatedMsg, instNotAddedMsg
  ) {
    // ·> Only proceed with loading AdjusterMonkey if the window represents a  ·
    // ·  web page the user is actively browsing.                             <·
    const elapsedTime = new Date() - loadingStartTime;
    if (
      !document.hasFocus()
      && elapsedTime < iife.loadWaitTime
      && typeof window.adj4rMnkyCmdLn == 'undefined'
    ) {
      console.log('Waiting ' + iife.loadWaitTime + 'ms for the document to ' +
        'receive focus so the AdjusterMonkey utility script can be loaded.');
      window.setTimeout(retryLoadingScript, 1000, loadingStartTime,
        instCreatedMsg, instNotAddedMsg);
      return;
    }

    // ·> Create instance of the AdjusterMonkey command-line utility inter-    ·
    // ·  face and add it safely to the window object for global access.      <·
    const adj4rMnkyCmdLn = new Adj4rMnkyCmdLn();
    if (typeof window.adj4rMnkyCmdLn == 'undefined') {
      window.adj4rMnkyCmdLn = adj4rMnkyCmdLn;
      adj4rMnkyCmdLn.logMsg(instCreatedMsg)
    } else {
      adj4rMnkyCmdLn.logMsg(instNotAddedMsg);
    }
  }

  //>/////////////////////////////////////////////////////////////////////////--
  //< §8: Execution Entry Point

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
    if (typeof document == 'undefined' || typeof document.hasFocus != 'function') {
      return;
    } else if (!document.hasFocus() && document.title.trim() != "") {
      const currentTime = new Date();
      window.setTimeout( retryLoadingScript, 1000, currentTime, instCreatedMsg,
        instNotAddedMsg );
      return;
    } else if (document.title.trim() == "") {
      return;
    }

    // ·> Create instance of the AdjusterMonkey command-line utility inter-    ·
    // ·  face and add it safely to the window object for global access.      <·
    const adj4rMnkyCmdLn = new Adj4rMnkyCmdLn();
    if (typeof window.adj4rMnkyCmdLn == 'undefined') {
      window.adj4rMnkyCmdLn = adj4rMnkyCmdLn;
      adj4rMnkyCmdLn.logMsg(instCreatedMsg);
    } else {
      adj4rMnkyCmdLn.logMsg(instNotAddedMsg);
    }

    return adj4rMnkyCmdLn;
  }

  return main();
})({
  version: '0.12.0-0.5.1',
  loadWaitTime: 30000,
});
