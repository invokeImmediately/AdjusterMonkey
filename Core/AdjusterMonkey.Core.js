// ==UserScript==
// @name         AdjusterMonkey Core
// @namespace    http://tampermonkey.net/
// @version      0.1.0-0.7.0
// @description  Core GUI that all AdjusterMonkey utility scripts employ to interface with the developer.
// @author       You
// @match        https://*.github.com/*
// @match        https://*.wsu.edu/*
// @exclude      https://*.doubleclick.net/*
// @exclude      https://*.googlesyndication.com/*
// @exclude      https://*.googletagmanager.com/*
// @exclude      https://*.gravatar.com/*
// @exclude      https://*.mdn.mozilla.net/*
// @icon         https://d-c-rieck.com/dcrdc-logo_favico_modern.svg
// @grant        none
// ==/UserScript==

/*!*****************************************************************************
 * ▓▓▓▒ AdjusterMonkey. ▄▀▀▀ ▄▀▀▄ █▀▀▄ █▀▀▀ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓
 * ▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ █    █  █ █▄▄▀ █▀▀  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓
 * ▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  ▀▀▀  ▀▀  ▀  ▀▄▀▀▀▀ .js ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓
 *
 * Tampermonkey script that serves as the core GUI that all AdjusterMonkey
 *  utility scripts employ to interface with the developer.
 *
 * Implements a GUI that serves as a foundation for each AdjusterMonkey variant
 *  to utilize in building a TamperMonkey-mediated enhancement script tailored
 *  to a target website or web app. Includes UI controls to expose core commands
 *  for web browser enhancements that are useful for work with any website.
 *
 * @version 0.1.0-0.7.0
 *
 * @author Daniel C. Rieck
 *  [daniel.rieck@wsu.edu]
 *  (https://github.com/invokeImmediately)
 *
 * @link https://github.com/invokeImmediately/d-c-rieck.com/blob/main/Core/AdjusterMonkey.Core.js
 *
 * @license MIT - Copyright (c) 2025 Daniel C. Rieck
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *   of this software and associated documentation files (the “Software”), to
 *   deal in the Software without restriction, including without limitation the
 *   rights to use, copy, modify, merge, publish, distribute, sublicense,
 *   and/or sell copies of the Software, and to permit persons to whom the
 *   Software is furnished to do so, subject to the following conditions:
 *  The above copyright notice and this permission notice shall be included in
 *   all copies or substantial portions of the Software.
 *  THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *   FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 *   DEALINGS IN THE SOFTWARE.
 ******************************************************************************/

// Declare «AdjusterMonkeyGui» class.
const AdjusterMonkeyGui = (function(iife) {
  'use strict';

  class AdjusterMonkeyGui {
    guiVersion = iife.guiVersion;
    bemCssClasses = {
      guiBlock: '',
      guiElements: {},
      guiModifiers: {},
    };
    domInsertionPointSelector = iife.selectors.domInsertionPoint;
    elementIds = iife.elementIds;
    fieldNames = iife.fieldNames;
    logoDetails = iife.logoDetails;
    styleRules = iife.guiStyleRules;
    targetApplication = iife.targetApplication;
    #guiEl4ts = {};
    #parentElement = null;

    constructor(guiSettings) {
      if (typeof guiSettings == 'undefined') {
        guiSettings = {};
      }
      this.#applySettingsToGui(guiSettings);
      this.#setUndefinedElementIds();
      if (typeof document !== 'undefined') {
        this.#insertGuiIntoDom();
      }
    }

    #applySettingsToGui(settings) {
      this.domInsertionPointSelector =
        this.#setPropertySafely(settings.domInsertionPointSelector,
        this.domInsertionPointSelector);
      this.#setBemCssClasses(settings.bemCssClasses);
      this.guiVersion =
        this.#setPropertySafely(settings.guiVersion, this.guiVersion);
      this.targetApplication =
        this.#setPropertySafely(settings.targetApplication,
        this.targetApplication);
    }

    #collectReferencesToGuiElements() {
      this.#guiEl4ts.changeSnapHor9 =
        this.#guiEl4ts.gui.querySelector(
          `.${this.bemCssClasses.guiElements.changeSnapHorizontally}`
        );
      this.#guiEl4ts.changeSnapVer7 =
        this.#guiEl4ts.gui.querySelector(
          `.${this.bemCssClasses.guiElements.changeSnapVertically}`
        );
      this.#guiEl4ts.collapseGui =
        this.#guiEl4ts.gui.querySelector(
          `#${this.elementIds.collapseGui}`
        );
    }

    #convertCamelcaseToSnakeCase( inputString ) {
      if (typeof inputString !== 'string') {
        return null;
      }

      if (inputString == "" ) {
        return inputString;
      }

      let output = inputString[0].toLowerCase();
      for (let i = 1; i < inputString.length; i++) {
        if (
          this.#isCharacterUppercase(inputString[i])
          && (
            !this.#isCharacterUppercase(inputString[i - 1])
            || (
              i < inputString.length - 1
              && !this.#isCharacterUppercase(inputString[i + 1])
            )
          )
        ) {
          output += '-';
        }

        output += inputString[ i ].toLowerCase();
      }

      return output;
    }

    #createGuiElement() {
      const $gui = document.createElement('form');
      $gui.id = this.elementIds.adjusterMonkeyGui;
      $gui.classList.add(this.bemCssClasses.guiBlock,
        this.bemCssClasses.guiModifiers.snapToLowerRight);
      $gui.innerHTML = this.#generateHtmlForGui();

      return $gui;
    }

    #createGuiSSElement() {
      const $styleSheet = document.createElement('style');
      $styleSheet.type = 'text/css';
      $styleSheet.id = this.elementIds.styleSheet;
      $styleSheet.innerHTML = this.styleRules;

      return $styleSheet;
    }

    #findInsertionPoint() {
      const $ins5nP3t =
        this.#parentElement === null ?
          document.querySelector(this.domInsertionPointSelector) :
          this.#parentElement;
      if (this.#parentElement === null && $ins5nP3t !== null) {
        this.#parentElement = $ins5nP3t;
      }

      return $ins5nP3t;
    }

    #generateHtmlForGui() {
      const el5s = this.bemCssClasses.guiElements;
      const logo = this.logoDetails;
      const ids = this.elementIds;
      return `<header class="${el5s.header}">
        <figure class="${el5s.logoPlacementArea}">
          <img src="data:image/png;base64,${logo.base64Enc4g}" width="${logo.width}" height="${logo.height}" alt="AdjusterMonkey logo." class="${el5s.logo}">
          <h2 class="${el5s.title}">AdjusterMonkey: ${this.targetApplication} Enhancer (v${this.guiVersion})</h2>
          <p class="${el5s.tagline}">Enhancing the web using TamperMonkey scripts.</p>
        </figure>
        </header>
        <fieldset id="${ids.changeSnapButtons}" class="${el5s.changeSnapButtons}">
          <legend>Change snap position:</legend>
          <button id="${ids.changeSnapHorizontally}" class="${el5s.changeSnap} ${el5s.changeSnapHorizontally}" type="button" aria-label="Swap horizontal snap position to left edge.">←</button>
          <button id="${ids.changeSnapVertically}" class="${el5s.changeSnap} ${el5s.changeSnapVertically}" type="button" aria-label="Swap vertical snap position to top edge.">↑</button>
        </fieldset>
        <fieldset id="${ids.commandsList}" class="${el5s.commandsList}">
          <legend>Core commands:</legend>
          <button id="${ids.executeAboutAdjusterMonkey}" class="${el5s.command}" type="button"><b>About</b> AdjusterMonkey</button>
          <button id="${ids.executeGetReferenceToPage}" class="${el5s.command}" type="button">Get a linked <b>reference</b> to current page</button>
        </fieldset>
        <button id="${ids.collapseGui}" class="${el5s.command}" type="button" aria-label="Collapse AdjusterMonkey.">×</button>`;
    }

    #insertGuiIntoDom() {
      this.#insertGuiSSIntoDom();

      const $ins5nP3t = this.#findInsertionPoint();
      if ($ins5nP3t === null) {
        return;
      }

      this.#guiEl4ts.gui = this.#createGuiElement();
      this.#parentElement.append(this.#guiEl4ts.gui);

      // TODO: Populate references to elements within the GUI
      this.#collectReferencesToGuiElements();

      // TO-DO: Set up event handlers
      this.#registerEventHandlers();
    }

    #insertGuiSSIntoDom() {
      const $ins5nP3t = this.#findInsertionPoint();
      if ($ins5nP3t === null) {
        return;
      }

      this.#guiEl4ts.styleSheet = this.#createGuiSSElement();
      this.#parentElement.append(this.#guiEl4ts.styleSheet);
    }

    #isCharacterUppercase( character ) {
      if ( typeof character !== 'string' || character.length !== 1 ) {
        return null;
      }

      const regExTest = /[A-Z]/;
      return character.match( regExTest );
    }

    #registerEventHandlers() {
      this.#guiEl4ts.gui.addEventListener('click',
        this.expand.bind(this));
      this.#reg4rChangeSnapE3tH6s();
      this.#guiEl4ts.collapseGui.addEventListener('click',
        this.collapse.bind(this));
    }

    #reg4rChangeSnapE3tH6s() {
      this.#guiEl4ts.changeSnapHor9.addEventListener('click',
        this.changeHorizontalSnapPosition.bind(this));
      this.#guiEl4ts.changeSnapVer7.addEventListener('click',
        this.changeVerticalSnapPosition.bind(this));
    }

    #setBemCssClasses( bemCssClasses ) {
      this.bemCssClasses.guiBlock =
        this.#setPropertySafely(bemCssClasses.guiBlock,
        iife.bemCssClasses.guiBlock);

      if (
        !(
          'guiElements' in bemCssClasses
          && typeof bemCssClasses.guiElements === 'object'
        )
      ) {
        bemCssClasses = {
          guiElements: {},
        };
      }
      this.#setGuiElementsClasses( bemCssClasses.guiElements );

      if (
        !(
          'guiModifiers' in bemCssClasses
          && typeof bemCssClasses.guiModifiers === 'object'
        )
      ) {
        bemCssClasses = {
          guiModifiers: {},
        };
      }
      this.#setGuiModifiersClasses( bemCssClasses.guiModifiers );
    }

    #setGuiElementsClasses( classes ) {
      const blockPrefix = this.bemCssClasses.guiBlock + '__';

      this.bemCssClasses.guiElements.changeSnap =
        blockPrefix + this.#setPropertySafely(
          classes.changeSnap,
          iife.bemCssClasses.guiElements.changeSnap
        );

      console.log(iife.bemCssClasses.guiElements.changeSnap);
      this.bemCssClasses.guiElements.changeSnapButtons =
        blockPrefix + this.#setPropertySafely(
          classes.changeSnapButtons,
          iife.bemCssClasses.guiElements.changeSnapButtons
        );

      this.bemCssClasses.guiElements.changeSnapHorizontally =
        blockPrefix + this.#setPropertySafely(
          classes.changeSnapHorizontally,
          iife.bemCssClasses.guiElements.changeSnapHorizontally
        );

      this.bemCssClasses.guiElements.changeSnapVertically =
        blockPrefix + this.#setPropertySafely(
          classes.changeSnapVertically,
          iife.bemCssClasses.guiElements.changeSnapVertically
        );

      this.bemCssClasses.guiElements.command =
        blockPrefix + this.#setPropertySafely(
          classes.command,
          iife.bemCssClasses.guiElements.command
        );

      this.bemCssClasses.guiElements.commandsList =
        blockPrefix + this.#setPropertySafely(
          classes.commandsList,
          iife.bemCssClasses.guiElements.commandsList
        );

      this.bemCssClasses.guiElements.header =
        blockPrefix + this.#setPropertySafely(
          classes.header,
          iife.bemCssClasses.guiElements.header
        );

      this.bemCssClasses.guiElements.logo =
        blockPrefix + this.#setPropertySafely(
          classes.logo,
          iife.bemCssClasses.guiElements.logo
        );

      this.bemCssClasses.guiElements.logoPlacementArea =
        blockPrefix + this.#setPropertySafely(
          classes.logoPlacementArea,
          iife.bemCssClasses.guiElements.logoPlacementArea
        );

      this.bemCssClasses.guiElements.tagline =
        blockPrefix + this.#setPropertySafely(
          classes.tagline,
          iife.bemCssClasses.guiElements.tagline
        );


      this.bemCssClasses.guiElements.title =
        blockPrefix + this.#setPropertySafely(
          classes.title,
          iife.bemCssClasses.guiElements.title
        );
    }

    #setGuiModifiersClasses( classes ) {
      const blockPrefix = this.bemCssClasses.guiBlock + '--';

      this.bemCssClasses.guiModifiers.expanded =
        blockPrefix + this.#setPropertySafely(
          classes.expanded,
          iife.bemCssClasses.guiModifiers.expanded
        );

      this.bemCssClasses.guiModifiers.snapToLowerLeft =
        blockPrefix + this.#setPropertySafely(
          classes.snapToLowerLeft,
          iife.bemCssClasses.guiModifiers.snapToLowerLeft
        );

      this.bemCssClasses.guiModifiers.snapToLowerRight =
        blockPrefix + this.#setPropertySafely(
          classes.snapToLowerRight,
          iife.bemCssClasses.guiModifiers.snapToLowerRight
        );

      this.bemCssClasses.guiModifiers.snapToUpperLeft =
        blockPrefix + this.#setPropertySafely(
          classes.snapToUpperLeft,
          iife.bemCssClasses.guiModifiers.snapToUpperLeft
        );

      this.bemCssClasses.guiModifiers.snapToUpperRight =
        blockPrefix + this.#setPropertySafely(
          classes.snapToUpperRight,
          iife.bemCssClasses.guiModifiers.snapToUpperRight
        );
    }

    #setPropertySafely( prospectiveSetting, safeSetting ) {
      return typeof prospectiveSetting != 'undefined' ?
        prospectiveSetting :
        safeSetting;
    }

    #setUndefinedElementIds() {
      for (let key in this.elementIds) {
        if (key == 'adjusterMonkeyGui' && this.elementIds[key] === undefined) {
          this.elementIds[key] = this.#convertCamelcaseToSnakeCase(key);
        } else if (key != 'adjusterMonkeyGui') {
          this.elementIds[key] =
            this.elementIds.adjusterMonkeyGui + '_' +
            this.#convertCamelcaseToSnakeCase(key);
        }
      }
    }

    changeHorizontalSnapPosition(event) {
      if(event !== undefined) {
        event.stopPropagation();
      }
      const classes = this.#guiEl4ts.gui.classList;
      if (
        classes.contains(this.bemCssClasses.guiModifiers.snapToLowerLeft)
      ) {
        classes.remove(this.bemCssClasses.guiModifiers.snapToLowerLeft);
        classes.add(this.bemCssClasses.guiModifiers.snapToLowerRight);
        this.#guiEl4ts.changeSnapHor9.innerText = '←';
      } else if (
        classes.contains(this.bemCssClasses.guiModifiers.snapToLowerRight)
      ) {
        classes.remove(this.bemCssClasses.guiModifiers.snapToLowerRight);
        classes.add(this.bemCssClasses.guiModifiers.snapToLowerLeft);
        this.#guiEl4ts.changeSnapHor9.innerText = '→';
      } else if (
        classes.contains(this.bemCssClasses.guiModifiers.snapToUpperLeft)
      ) {
        classes.remove(this.bemCssClasses.guiModifiers.snapToUpperLeft);
        classes.add(this.bemCssClasses.guiModifiers.snapToUpperRight);
        this.#guiEl4ts.changeSnapHor9.innerText = '←';
      } else if (
        classes.contains(this.bemCssClasses.guiModifiers.snapToUpperRight)
      ) {
        classes.remove(this.bemCssClasses.guiModifiers.snapToUpperRight);
        classes.add(this.bemCssClasses.guiModifiers.snapToUpperLeft);
        this.#guiEl4ts.changeSnapHor9.innerText = '→';
      }
      this.#guiEl4ts.changeSnapHor9.blur();
    }

    changeVerticalSnapPosition(event) {
      if(event !== undefined) {
        event.stopPropagation();
      }
      const classes = this.#guiEl4ts.gui.classList;
      if (
        classes.contains(this.bemCssClasses.guiModifiers.snapToLowerLeft)
      ) {
        classes.remove(this.bemCssClasses.guiModifiers.snapToLowerLeft);
        classes.add(this.bemCssClasses.guiModifiers.snapToUpperLeft);
        this.#guiEl4ts.changeSnapVer7.innerText = '↓';
      } else if (
        classes.contains(this.bemCssClasses.guiModifiers.snapToUpperLeft)
      ) {
        classes.remove(this.bemCssClasses.guiModifiers.snapToUpperLeft);
        classes.add(this.bemCssClasses.guiModifiers.snapToLowerLeft);
        this.#guiEl4ts.changeSnapVer7.innerText = '↑';
      } else if (
        classes.contains(this.bemCssClasses.guiModifiers.snapToLowerRight)
      ) {
        classes.remove(this.bemCssClasses.guiModifiers.snapToLowerRight);
        classes.add(this.bemCssClasses.guiModifiers.snapToUpperRight);
        this.#guiEl4ts.changeSnapVer7.innerText = '↓';
      } else if (
        classes.contains(this.bemCssClasses.guiModifiers.snapToUpperRight)
      ) {
        classes.remove(this.bemCssClasses.guiModifiers.snapToUpperRight);
        classes.add(this.bemCssClasses.guiModifiers.snapToLowerRight);
        this.#guiEl4ts.changeSnapVer7.innerText = '↑';
      }
      this.#guiEl4ts.changeSnapVer7.blur();
    }

    collapse(event) {
      if(event !== undefined) {
        event.stopPropagation();
      }
      this.#guiEl4ts.gui.classList.remove(
        this.bemCssClasses.guiModifiers.expanded
      );
    }

    expand(event) {
      this.#guiEl4ts.gui.classList.add(
        this.bemCssClasses.guiModifiers.expanded
      );
    }

    printGuiSettings() {
      // TO-DO: Improve implementation
      console.log(
        `Settings for instance of AdjusterMonkeyGui are as follows:
${JSON.stringify(this)}`
      );
    }
  }

  return AdjusterMonkeyGui;
} )( {
  bemCssClasses: {
    guiBlock: 'adj5-mon3-gui',
    guiElements: {
      changeSnap: 'change-snap',
      changeSnapButtons: 'change-snap-buttons',
      changeSnapHorizontally: 'change-snap-horizontally',
      changeSnapVertically: 'change-snap-vertically',
      command: 'command',
      commandsList: 'commands-list',
      header: 'header',
      logo: 'logo',
      logoPlacementArea: 'logo-placement-area',
      tagline: 'tagline',
      title: 'title',
    },
    guiModifiers: {
      expanded: 'expand',
      snapToLowerLeft: 'snap-to-lower-left',
      snapToLowerRight: 'snap-to-lower-right',
      snapToUpperLeft: 'snap-to-upper-left',
      snapToUpperRight: 'snap-to-upper-right',
    },
  },
  elementIds: {
    adjusterMonkeyGui: 'adj5-mon3',
    changeSnapButtons: undefined,
    changeSnapHorizontally: undefined,
    changeSnapVertically: undefined,
    collapseGui: undefined,
    commandsList: undefined,
    executeAboutAdjusterMonkey: undefined,
    executeGetReferenceToPage: undefined,
    styleSheet: undefined,
  },
  fieldNames: {
    adjusterMonkeyGui: undefined,
  },
  guiVersion: '0.0.0',
  logoDetails: {
    base64Enc4g: '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YXAvMS4wLyIKICAgeG1wTU06RG9jdW1lbnRJRD0iZ2ltcDpkb2NpZDpnaW1wOjNhZWFlZDEyLTViZjItNDY5Ni1iZTU1LWU5MTlkYjllOTJhYSIKICAgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozYzQ3NjkyZi0xY2JjLTRjZGUtOTU2Yy01MmM4YmQ3ZTg5ZTAiCiAgIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo5MGI4NzYzOC1hOTQ4LTRmNDYtODQzZi03MTEyYWZiNGNjYWUiCiAgIGRjOkZvcm1hdD0iaW1hZ2UvcG5nIgogICBHSU1QOkFQST0iMi4wIgogICBHSU1QOlBsYXRmb3JtPSJXaW5kb3dzIgogICBHSU1QOlRpbWVTdGFtcD0iMTY3NDM0MTY0NDM5NDE1MCIKICAgR0lNUDpWZXJzaW9uPSIyLjEwLjMyIgogICB0aWZmOk9yaWVudGF0aW9uPSIxIgogICB4bXA6Q3JlYXRvclRvb2w9IkdJTVAgMi4xMCIKICAgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMzowMToyMVQxNDo1NDowMi0wODowMCIKICAgeG1wOk1vZGlmeURhdGU9IjIwMjM6MDE6MjFUMTQ6NTQ6MDItMDg6MDAiPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJzYXZlZCIKICAgICAgc3RFdnQ6Y2hhbmdlZD0iLyIKICAgICAgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo0MWMwZDEyNi02YWVmLTQxMWMtYjZlZi1iYmIwZmQ4ZWI4ZTIiCiAgICAgIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkdpbXAgMi4xMCAoV2luZG93cykiCiAgICAgIHN0RXZ0OndoZW49IjIwMjMtMDEtMjFUMTQ6NTQ6MDQiLz4KICAgIDwvcmRmOlNlcT4KICAgPC94bXBNTTpIaXN0b3J5PgogIDwvcmRmOkRlc2NyaXB0aW9uPgogPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg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',
    height: '132',
    url: 'https://d-c-rieck.com/dist/AdjusterMonkey-2wzx8mub/render_adjuster-monkey-logo_v20220918i03_96w132h.png',
    width: '96',
  },
  selectors: {
    domInsertionPoint: 'main',
  },
  targetApplication: 'Miscellaneous Website',
  guiStyleRules:
`/*!*****************************************************************************
 * ▓▓▓▒ AdjusterMonkey. ▄▀▀▀ ▄▀▀▄ █▀▀▄ █▀▀▀ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓
 * ▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ █    █  █ █▄▄▀ █▀▀  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓
 * ▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  ▀▀▀  ▀▀  ▀  ▀▄▀▀▀▀ .less ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓
 *
 * Syle rules for laying out and presenting the AdjusterMonkey Core GUI.
 *
 * @version 0.0.0-rc.4
 *
 * @author Daniel C. Rieck
 *  [daniel.rieck@wsu.edu]
 *  (https://github.com/invokeImmediately)
 *
 * @link https://github.com/invokeImmediately/d-c-rieck.com/blob/main/Core/…
 *  …AdjusterMonkey.Core.less
 *
 * @license MIT - Copyright (c) 2025 Daniel C. Rieck
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *   of this software and associated documentation files (the “Software”), to
 *   deal in the Software without restriction, including without limitation the
 *   rights to use, copy, modify, merge, publish, distribute, sublicense,
 *   and/or sell copies of the Software, and to permit persons to whom the
 *   Software is furnished to do so, subject to the following conditions:
 *  The above copyright notice and this permission notice shall be included in
 *   all copies or substantial portions of the Software.
 *  THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *   FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 *   DEALINGS IN THE SOFTWARE.
 ******************************************************************************/
/* VARIABLES: AdjusterMonkey (AM) GUI Settings */

/* ANIMATION: Reveal AdjusterMonkey (AM) GUI once Loaded */
@keyframes show-adj4r-m4y-gui {
  0% {
    opacity: 0;
    rotate: -45deg;
    scale: 0.5;
  }
  100% {
    opacity: 0.5;
    rotate: 0deg;
    scale: none;
  }
}

/* BLOCK: AM GUI */
#adj5-mon3.adj5-mon3-gui {
  animation: show-adj4r-m4y-gui 0.5s;
  background: transparent;
  bottom: auto;
  left: 50%;
  margin: 0;
  padding: 0;
  position: fixed;
  right: auto;
  top: 50%;
  transform: translate(-50%, -50%);
  transition: left 0.333s ease, top 0.333s ease, transform 0.333s ease;
  z-index: 2147483647;
  /* UNMODIFIED—» Default State: Collapsed */
  /* MODIFIED—» Expanded GUI */
}

#adj5-mon3.adj5-mon3-gui:not(:hover):not(:focus-within) {
  opacity: 0.5;
  transition: left 0.333s ease, opacity 0.2s ease, top 0.333s ease, transform 0.333s ease;
}

#adj5-mon3.adj5-mon3-gui :is(.adj5-mon3-gui__title, .adj5-mon3-gui__tagline, .adj5-mon3-gui__commands-list, #adj5-mon3_collapse-gui) {
  display: none;
}

#adj5-mon3.adj5-mon3-gui .adj5-mon3-gui__header {
  background: transparent;
  display: block;
  line-height: 1;
}

#adj5-mon3.adj5-mon3-gui :is(.adj5-mon3-gui__header, #adj5-mon3.adj5-mon3-gui .adj5-mon3-gui__logo-placement-area) {
  height: auto;
  margin: 0;
  padding: 0;
  width: auto;
}

#adj5-mon3.adj5-mon3-gui .adj5-mon3-gui__logo {
  margin: 0;
  max-width: none;
  padding: 0;
}

#adj5-mon3.adj5-mon3-gui .adj5-mon3-gui__change-snap-buttons {
  border: 0;
  color: transparent;
  height: 100%;
  left: 0;
  line-height: 1;
  margin: 0;
  overflow: visible;
  padding: 0;
  position: absolute;
  top: 0;
  width: 100%;
}

#adj5-mon3.adj5-mon3-gui :is(.adj5-mon3-gui__change-snap-buttons:after, #adj5-mon3.adj5-mon3-gui .adj5-mon3-gui__change-snap-buttons:before) {
  content: "";
  position: absolute;
}

#adj5-mon3.adj5-mon3-gui .adj5-mon3-gui__change-snap-buttons:after {
  height: 14px;
  width: 28px;
}

#adj5-mon3.adj5-mon3-gui .adj5-mon3-gui__change-snap-buttons:before {
  height: 28px;
  width: 14px;
}

#adj5-mon3.adj5-mon3-gui .adj5-mon3-gui__change-snap-buttons > legend {
  display: block;
  height: 0;
  margin: 0;
  overflow: hidden;
  padding: 0;
  width: 0;
}

#adj5-mon3.adj5-mon3-gui:not(:hover):not(:focus-within) .adj5-mon3-gui__change-snap-buttons {
  opacity: 0;
  transition: opacity 0.2s ease;
}

#adj5-mon3.adj5-mon3-gui .adj5-mon3-gui__change-snap {
  background: rgba(0, 0, 0, 0.5);
  border: 2px outset white;
  border-radius: 4px;
  color: white;
  height: 28px;
  line-height: 1;
  padding: 2px 4px 4px;
  position: absolute;
  text-shadow: 1px 1px 2px black;
  width: 28px;
}

#adj5-mon3.adj5-mon3-gui .adj5-mon3-gui__change-snap:hover {
  background: rgba(128, 128, 128, 0.5);
}

#adj5-mon3.adj5-mon3-gui .adj5-mon3-gui__change-snap:active {
  background: rgba(255, 255, 255, 0.85);
  border: 2px inset white;
  box-shadow: 0 0 1px 1px rgba(255, 255, 255, 0.5), 0 0 8px 2px rgba(255, 255, 255, 0.25);
  color: black;
}

#adj5-mon3.adj5-mon3-gui--snap-to-lower-left {
  left: 2rem;
  top: calc(100% - 2rem);
  transform: translate(0, -100%);
}

#adj5-mon3.adj5-mon3-gui--snap-to-lower-left .adj5-mon3-gui__change-snap-buttons:after {
  left: 50%;
  top: 0;
  transform: translate(-50%, -100%);
}

#adj5-mon3.adj5-mon3-gui--snap-to-lower-left .adj5-mon3-gui__change-snap-buttons:before {
  right: 0;
  top: 50%;
  transform: translate(100%, -50%);
}

#adj5-mon3.adj5-mon3-gui--snap-to-lower-left .adj5-mon3-gui__change-snap-horizontally {
  right: 0;
  top: 50%;
  transform: translate(150%, -50%);
}

#adj5-mon3.adj5-mon3-gui--snap-to-lower-left .adj5-mon3-gui__change-snap-vertically {
  left: 50%;
  top: 0;
  transform: translate(-50%, -150%);
}

#adj5-mon3.adj5-mon3-gui--snap-to-lower-right {
  left: calc(100% - 2rem);
  top: calc(100% - 2rem);
  transform: translate(-100%, -100%);
}

#adj5-mon3.adj5-mon3-gui--snap-to-lower-right .adj5-mon3-gui__change-snap-buttons:after {
  left: 50%;
  top: 0;
  transform: translate(-50%, -100%);
}

#adj5-mon3.adj5-mon3-gui--snap-to-lower-right .adj5-mon3-gui__change-snap-buttons:before {
  left: 0;
  top: 50%;
  transform: translate(-100%, -50%);
}

#adj5-mon3.adj5-mon3-gui--snap-to-lower-right .adj5-mon3-gui__change-snap-horizontally {
  left: 0;
  top: 50%;
  transform: translate(-150%, -50%);
}

#adj5-mon3.adj5-mon3-gui--snap-to-lower-right .adj5-mon3-gui__change-snap-vertically {
  left: 50%;
  top: 0;
  transform: translate(-50%, -150%);
}

#adj5-mon3.adj5-mon3-gui--snap-to-upper-left {
  left: 2rem;
  top: 2rem;
  transform: translate(0, 0);
}

#adj5-mon3.adj5-mon3-gui--snap-to-upper-left .adj5-mon3-gui__change-snap-buttons:after {
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0%);
}

#adj5-mon3.adj5-mon3-gui--snap-to-upper-left .adj5-mon3-gui__change-snap-buttons:before {
  right: 0;
  top: 50%;
  transform: translate(100%, -50%);
}

#adj5-mon3.adj5-mon3-gui--snap-to-upper-left .adj5-mon3-gui__change-snap-horizontally {
  right: 0;
  top: 50%;
  transform: translate(150%, -50%);
}

#adj5-mon3.adj5-mon3-gui--snap-to-upper-left .adj5-mon3-gui__change-snap-vertically {
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 100%);
}

#adj5-mon3.adj5-mon3-gui--snap-to-upper-right {
  left: calc(100% - 2rem);
  top: 2rem;
  transform: translate(-100%, 0);
}

#adj5-mon3.adj5-mon3-gui--snap-to-upper-right .adj5-mon3-gui__change-snap-buttons:after {
  left: 50%;
  bottom: 0;
  transform: translate(-50%, 0%);
}

#adj5-mon3.adj5-mon3-gui--snap-to-upper-right .adj5-mon3-gui__change-snap-buttons:before {
  left: 0;
  top: 50%;
  transform: translate(-100%, -50%);
}

#adj5-mon3.adj5-mon3-gui--snap-to-upper-right .adj5-mon3-gui__change-snap-horizontally {
  left: 0;
  top: 50%;
  transform: translate(-150%, -50%);
}

#adj5-mon3.adj5-mon3-gui--snap-to-upper-right .adj5-mon3-gui__change-snap-vertically {
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 100%);
}

#adj5-mon3.adj5-mon3-gui--expand {
  background-color: #282828;
  border-radius: 0.33em;
  box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.25), 2px 4px 6px rgba(0, 0, 0, 0.25), -2px 4px 6px rgba(0, 0, 0, 0.25), 0 6px 12px rgba(0, 0, 0, 0.25);
  color: white;
  display: block;
  font-size: 16px;
  width: 640px;
  padding: 1em;
}

#adj5-mon3.adj5-mon3-gui--expand :is(.adj5-mon3-gui__title, .adj5-mon3-gui__tagline, .adj5-mon3-gui__commands-list, #adj5-mon3_collapse-gui) {
  display: block;
}

#adj5-mon3.adj5-mon3-gui--expand #adj5-mon3_collapse-gui.adj5-mon3-gui__command {
  background-color: #000;
  border: 2px outset white;
  border-radius: 0.33em;
  color: white;
  font-family: monospace;
  font-weight: 600;
  position: absolute;
  right: 1rem;
  top: 1rem;
}

#adj5-mon3.adj5-mon3-gui--expand :is(#adj5-mon3_collapse-gui.adj5-mon3-gui__command:hover,  #adj5-mon3_collapse-gui.adj5-mon3-gui__command:focus) {
  background: #505050;
  box-shadow: 0 0 4px rgba(255, 255, 255, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.25);
}

#adj5-mon3.adj5-mon3-gui--expand #adj5-mon3_collapse-gui.adj5-mon3-gui__command:active {
  background: #fff;
  border: 2px inset white;
  box-shadow: 0 0 6px 1px rgba(255, 255, 255, 0.5);
  color: #000;
}

#adj5-mon3.adj5-mon3-gui--expand .adj5-mon3-gui__logo-placement-area {
  display: grid;
  grid-column-gap: 1.5em;
  grid-template-columns: 96px minmax(200px, 640px);
  grid-template-rows: 1fr 1fr;
  margin: 0;
  padding: 0 2em 0 0;
}

#adj5-mon3.adj5-mon3-gui--expand .adj5-mon3-gui__logo {
  grid-area: 1 / 1 / 3 / 2;
}

#adj5-mon3.adj5-mon3-gui--expand .adj5-mon3-gui__title {
  align-self: end;
  background: transparent;
  font-size: 1.5em;
  float: none;
  grid-area: 1 / 2 / 2 / 3;
  line-height: 1.2;
  margin: 0;
  padding: 0;
  position: relative;
}

#adj5-mon3.adj5-mon3-gui--expand .adj5-mon3-gui__tagline {
  font-size: 1em;
  grid-area: 2 / 2 / 3 / 3;
  line-height: 1.2;
  margin: 0.5em 0 0;
  padding: 0;
}

#adj5-mon3.adj5-mon3-gui--expand .adj5-mon3-gui__change-snap-buttons {
  height: auto;
  margin-top: 1em;
  position: static;
  width: auto;
}

#adj5-mon3.adj5-mon3-gui--expand .adj5-mon3-gui__change-snap-buttons > legend {
  height: auto;
  overflow: visible;
  width: auto;
}

#adj5-mon3.adj5-mon3-gui--expand:not(:hover):not(:focus-within) .adj5-mon3-gui__change-snap-buttons {
  opacity: 1;
}

#adj5-mon3.adj5-mon3-gui--expand :is(.adj5-mon3-gui__change-snap-buttons, .adj5-mon3-gui__commands-list) {
  background: repeating-linear-gradient(-45deg, #000, #000 8px, #282800 8px, #282800 16px);
  color: white;
  border: 1px solid white;
  border-radius: 0.333em;
  margin-top: 1.5em;
  padding: 1em;
}

#adj5-mon3.adj5-mon3-gui--expand :is(.adj5-mon3-gui__change-snap-buttons > legend, .adj5-mon3-gui__commands-list > legend) {
  font-family: monospace;
  font-weight: 600;
  padding: 0 0.5em;
}

#adj5-mon3.adj5-mon3-gui--expand :is(.adj5-mon3-gui__change-snap:hover, #adj5-mon3.adj5-mon3-gui--expand .adj5-mon3-gui__change-snap:focus) {
  background: #767676;
}

#adj5-mon3.adj5-mon3-gui--expand .adj5-mon3-gui__change-snap:active {
  background: #f0f0f0;
  color: #000;
}

#adj5-mon3.adj5-mon3-gui--expand.adj5-mon3-gui--snap-to-lower-left :is(.adj5-mon3-gui__change-snap-horizontally, .adj5-mon3-gui__change-snap-vertically),
#adj5-mon3.adj5-mon3-gui--expand.adj5-mon3-gui--snap-to-lower-right :is(.adj5-mon3-gui__change-snap-horizontally, .adj5-mon3-gui__change-snap-vertically),
#adj5-mon3.adj5-mon3-gui--expand.adj5-mon3-gui--snap-to-upper-left :is(.adj5-mon3-gui__change-snap-horizontally, .adj5-mon3-gui__change-snap-vertically),
#adj5-mon3.adj5-mon3-gui--expand.adj5-mon3-gui--snap-to-upper-right :is(.adj5-mon3-gui__change-snap-horizontally,.adj5-mon3-gui__change-snap-vertically) {
  bottom: 0;
  left: auto;
  position: static;
  right: auto;
  top: auto;
  transform: none;
}`,
} );

// ·> Create an instance of the «AdjusterMonkeyGui» class to be accessed
// ·  through the «Adj4rMnkyCmdLn» object once the latter has been added to
// ·< «window» object.
(function(AdjusterMonkeyGui, iifeS6s) {
  'use strict';

  function main() {
    const currentTime = new Date();
    window.setTimeout(tryBindingAdj4rM4yLoader, 1000, currentTime);
  }

  function tryLoadingAdj4rM4yGui(loadingStartTime) {
    const elapsedTime = new Date() - loadingStartTime;

    if (
      typeof window.adj4rMnkyCmdLn == 'object' &&
      typeof window.adj4rMnkyCmdLn.constructor == 'function' &&
      window.adj4rMnkyCmdLn.constructor.name == 'Adj4rMnkyCmdLn'
    ) {
      window.adj4rMnkyCmdLn.adj4rMnkyGui = new AdjusterMonkeyGui({
        domInsertionPointSelector: 'body',
        bemCssClasses: {
          gui: 'adjuster-monkey-trello-gui',
        },
      });
    } else if (elapsedTime <= iifeS6s.loadWaitTime) {
      window.setTimeout(tryLoadingAdj4rM4yGui, 1000, loadingStartTime);
    }
  }

  function tryBindingAdj4rM4yLoader(loadingStartTime) {
    const elapsedTime = new Date() - loadingStartTime;

    if (
      typeof window.adj4rMnkyCmdLn == 'object' &&
      typeof window.adj4rMnkyCmdLn.constructor == 'function' &&
      window.adj4rMnkyCmdLn.constructor.name == 'Adj4rMnkyCmdLn'
    ) {
      window.addEventListener("keydown", (event) => {
        if (event.key == "M" && event.ctrlKey && event.altKey) {
          const currentTime = new Date();
          window.setTimeout(tryLoadingAdj4rM4yGui, 250, currentTime);
        }
      });
    } else if (elapsedTime <= iifeS6s.loadWaitTime) {
      window.setTimeout(tryBindingAdj4rM4yLoader, 1000, loadingStartTime);
    }
  }

  return main();
})(AdjusterMonkeyGui, {
  loadWaitTime: 35000,
});

// ·> TO-DO for 0.1.0-0.7.0:                                                   ·
// ·  - Insert html for message window                                         ·
// ·  - Set up keyboard event handlers                                         ·
// ·  - Write handlers for current commands of about AM, get a ref to page    <·
