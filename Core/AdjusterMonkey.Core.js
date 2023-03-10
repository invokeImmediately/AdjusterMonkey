/*!*****************************************************************************
 * AdjusterMonkey. ▄▀▀▀ ▄▀▀▄ █▀▀▄ █▀▀▀ · · · · · · · · · · · · · · · · · · · · ·
 *  · · · · · · ·  █    █  █ █▄▄▀ █▀▀   · · · · · · · · · · · · · · · · · · · ·
 * · · · · · · · ·  ▀▀▀  ▀▀  ▀  ▀▄▀▀▀▀ .js · · · · · · · · · · · · · · · · · · ·
 * ·············································································
 * Tampermonkey script that serves as the core from which all AdjusterMonkey scritps are built.
 *
 * Implements a GUI that serves as a foundation for each AdjusterMonkey variant to utilize in building a TamperMonkey-mediated enhancement script tailored to a target website or web app. Includes core commands for web browser enhancements that are useful for use with any website.
 *
 * @version 0.1.0
 *
 * @author Daniel C. Rieck [daniel.rieck@wsu.edu] (https://github.com/invokeImmediately)
 * @link https://github.com/invokeImmediately/d-c-rieck.com/blob/main/Core/AdjusterMonkey.Core.js
 * @license MIT - Copyright (c) 2023 Daniel C. Rieck
 *   Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *   The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *   THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 ******************************************************************************/

const AdjusterMonkeyGui = ( function( iifeSettings ) {
  'use strict';

  class AdjusterMonkeyGui {
    guiVersion = iifeSettings.guiVersion;
    bemCssClasses = iifeSettings.bemCssClasses;
    domInsertionPointSelector = iifeSettings.selectors.domInsertionPoint;
    elementIds = iifeSettings.elementIds;
    fieldNames = iifeSettings.fieldNames;
    logoDetails = iifeSettings.logoDetails;
    targetApplication = iifeSettings.targetApplication;
    #guiElements = {};
    #parentElement;

    constructor( guiSettings ) {
      if ( typeof guiSettings !== 'undefined' ) {
        this.#applySettingsToGui( guiSettings );
      }
      if ( typeof document !== 'undefined' ) {
        this.#insertGuiIntoDom();
      }
    }

    #applySettingsToGui( settings ) {
      this.domInsertionPointSelector = this.#setPropertySafely( settings.domInsertionPointSelector, this.domInsertionPointSelector );
      if ( 'bemCssClasses' in settings ) {
        this.#setBemCssClasses( settings.bemCssClasses );
      }
      this.guiVersion.gui = this.#setPropertySafely( settings.guiVersion, this.guiVersion );
      this.targetApplication = this.#setPropertySafely( settings.targetApplication, this.targetApplication );
    }

    #createGuiElement() {
      const $gui = document.createElement( 'form' );
      $gui.id = this.elementIds.adjusterMonkeyGui.id;
      $gui.classList.add( this.bemCssClasses.guiBlock );
      $gui.innerHTML = this.#generateInnerHtmlForGui();
      // TODO: Generate selectors to internal DOM Elements // this.#generateElementSelectors();
      // TODO: Populate references to elements within the GUI // this.#populateDOMElementReferences();
      // TODO: Set up event handlers // this.#registerEventHandlers();
      return $gui;
    }

    #generateInnerHtmlForGui() {
      return `<header>
  <figure class="${this.bemCssClasses.guiElements.logoPlacementArea}">
    <img src="${this.logoDetails.url}" width="${this.logoDetails.width}" height="${this.logoDetails.height}" alt="AdjusterMonkey logo." class="${this.bemCssClasses.guiElements.logo}">
    <h2 class="${this.bemCssClasses.guiElements.title}">AdjusterMonkey: ${this.targetApplication} Enhancer (v${this.guiVersion})</h2>
    <p class="${this.bemCssClasses.guiElements.tagline}">Enhancing the web using TamperMonkey scripts.</p>
  </figure>
</header>
<fieldset id="${this.elementIds.changeSnapButtons}" class="${this.bemCssClasses.guiElements.changeSnapButtons}">
  <legend>Change snap position:</legend>
  <button id="${this.elementIds.changeSnapHorizontally}" class="${this.bemCssClasses.guiElements.changeSnap} ${this.bemCssClasses.guiElements.changeSnapHorizontally}" type="button" aria-label="Swap horizontal snap position to left edge.">←</button>
  <button id="${this.elementIds.changeSnapVertically}" class="${this.bemCssClasses.guiElements.changeSnap} ${this.bemCssClasses.guiElements.changeSnapVertically}" type="button" aria-label="Swap vertical snap position to top edge.">↑</button>
</fieldset>
<fieldset id="${this.elementIds.commandsList}" class="${this.bemCssClasses.guiElements.commandsList}">
  <legend>Core commands:</legend>
  <button id="${this.elementIds.executeAboutAdjusterMonkey}" class="${this.bemCssClasses.guiElements.command}" type="button"><b>About</b> AdjusterMonkey</button>
  <button id="${this.elementIds.executeGetReferenceToPage}" class="${this.bemCssClasses.guiElements.command}" type="button">Get a linked <b>reference</b> to current page</button>
</fieldset>
<button id="${this.elementIds.collapseGui}" class="${this.bemCssClasses.guiElements.command}" type="button" aria-label="Collapse AdjusterMonkey.">×</button>`;
    }

    #insertGuiIntoDom() {
      const $insertionPoint = document.querySelector( this.domInsertionPointSelector );
      if ( $insertionPoint === null ) {
        return;
      } else {
        this.#parentElement = $insertionPoint;
      }
      this.#guiElements.gui = this.#createGuiElement();
      this.#parentElement.append( this.#guiElements.gui );
    }

    #setBemCssClasses( bemCssClasses ) {
      this.bemCssClasses.guiBlock = this.#setPropertySafely( bemCssClasses.guiBlock, this.bemCssClasses.guiBlock );
      if( 'guiElements' in bemCssClasses && typeof bemCssClasses.guiElements === 'object' ) {
        this.#setGuiElementsClasses( bemCssClasses.guiElements );
      }
      if( 'guiModifiers' in bemCssClasses && typeof bemCssClasses.guiModifiers === 'object' ) {
        this.#setGuiModifiersClasses( bemCssClasses.guiModifiers );
      }
    }

    #setGuiElementsClasses( classes ) {
      this.bemCssClasses.guiElements.changeSnap = this.#setPropertySafely( classes.changeSnap, this.bemCssClasses.guiElements.changeSnap );
      this.bemCssClasses.guiElements.changeSnapButtons = this.#setPropertySafely( classes.changeSnapButtons, this.bemCssClasses.guiElements.changeSnap );
      this.bemCssClasses.guiElements.changeSnapHorizontally = this.#setPropertySafely( classes.changeSnapHorizontally, this.bemCssClasses.guiElements.changeSnapHorizontally );
      this.bemCssClasses.guiElements.changeSnapVertically = this.#setPropertySafely( classes.changeSnapVertically, this.bemCssClasses.guiElements.changeSnapVertically );
      this.bemCssClasses.guiElements.command = this.#setPropertySafely( classes.command, this.bemCssClasses.guiElements.command );
      this.bemCssClasses.guiElements.commandsList = this.#setPropertySafely( classes.commandsList, this.bemCssClasses.guiElements.commandsList );
      this.bemCssClasses.guiElements.logo = this.#setPropertySafely( classes.logo, this.bemCssClasses.guiElements.logo );
      this.bemCssClasses.guiElements.logoPlacementArea = this.#setPropertySafely( classes.logoPlacementArea, this.bemCssClasses.guiElements.logoPlacementArea );
      this.bemCssClasses.guiElements.title = this.#setPropertySafely( classes.title, this.bemCssClasses.guiElements.title );
    }

    #setGuiModifiersClasses( classes ) {
      this.bemCssClasses.guiModifiers.expanded = this.#setPropertySafely( classes.expanded, this.bemCssClasses.guiModifiers.expanded );
      this.bemCssClasses.guiModifiers.snapToLowerLeft = this.#setPropertySafely( classes.snapToLowerLeft, this.bemCssClasses.guiModifiers.snapToLowerLeft );
      this.bemCssClasses.guiModifiers.snapToLowerRight = this.#setPropertySafely( classes.snapToLowerRight, this.bemCssClasses.guiModifiers.snapToLowerRight );
      this.bemCssClasses.guiModifiers.snapToUpperLeft = this.#setPropertySafely( classes.snapToUpperLeft, this.bemCssClasses.guiModifiers.snapToUpperLeft );
      this.bemCssClasses.guiModifiers.snapToUpperRight = this.#setPropertySafely( classes.snapToUpperRight, this.bemCssClasses.guiModifiers.snapToUpperRight );
    }

    #setPropertySafely( prospectiveSetting, safeSetting ) {
      return prospectiveSetting ? prospectiveSetting : safeSetting;
    }

    printGuiSettings() {
      console.log(
`Settings for instance of AdjusterMonkeyGui are as follows:
  ├─bemCssClasses:
  │ ├─.guiBlock: ${this.bemCssClasses.guiBlock}
  │ ├─.guiElements
  │ │ ├─.changeSnap: ${this.bemCssClasses.guiElements.changeSnap}
  │ │ ├─.changeSnapButtons: ${this.bemCssClasses.guiElements.changeSnapButtons}
  │ │ ├─.changeSnapHorizontally: ${this.bemCssClasses.guiElements.changeSnapHorizontally}
  │ │ ├─.changeSnapVertically: ${this.bemCssClasses.guiElements.changeSnapVertically}
  │ │ ├─.collapseGui: ${this.bem}
  │ │ ├─.command: ${this.bemCssClasses.guiElements.command}
  │ │ ├─.commandsList: ${this.bemCssClasses.guiElements.commandsList}
  │ │ ├─.logo: ${this.bemCssClasses.guiElements.logo}
  │ │ ├─.logoPlacementArea: ${this.bemCssClasses.guiElements.logoPlacementArea}
  │ │ ├─.tagline: ${this.bemCssClasses.guiElements.tagline}
  │ │ └─.title: ${this.bemCssClasses.guiElements.title}
  │ └─.guiModifiers
  │   ├─.expanded: ${this.bemCssClasses.guiModifiers.expanded}
  │   ├─.snapToLowerLeft: ${this.bemCssClasses.guiModifiers.snapToLowerLeft}
  │   ├─.snapToLowerRight: ${this.bemCssClasses.guiModifiers.snapToLowerRight}
  │   ├─.snapToUpperLeft: ${this.bemCssClasses.guiModifiers.snapToUpperLeft}
  │   └─.snapToUpperRight: ${this.bemCssClasses.guiModifiers.snapToUpperRight}
  ├─elementIds
  │ ├─.adjusterMonkeyGui: ${this.elementIds.adjusterMonkeyGui}
  │ ├─.changeSnapButtons: ${this.elementIds.changeSnapButtons}
  │ ├─.changeSnapHorizontally: ${this.elementIds.changeSnapHorizontally}
  │ ├─.changeSnapVertically: ${this.elementIds.changeSnapVertically}
  │ ├─.collapseGui: ${this.elementIds.collapseGui}
  │ ├─.commandsList: ${this.elementIds.commandsList}
  │ ├─.executeAboutAdjusterMonkey: ${this.elementIds.executeAboutAdjusterMonkey}
  │ └─.executeGetReferenceToPage: ${this.elementIds.executeGetReferenceToPage}
  ├─guiVersion: ${this.guiVersion}
  ├─logoDetails: ${this.fieldNames}
  │ ├─.height: ${this.logoDetails.height}
  │ ├─.width: ${this.logoDetails.width}
  │ └─.url: ${this.logoDetails.url}
  ├─selectors:
  │ └─.domInsertionPoint: ${this.selectors.domInsertionPoint}
  └─targetApplication: ${this.targetApplication}
` );
    }
  }

  return AdjusterMonkeyGui;
} )( {
  bemCssClasses: {
    guiBlock: 'adjuster-monkey-gui',
    guiElements: {
      changeSnap: 'change-snap',
      changeSnapButtons: 'change-snap-buttons',
      changeSnapHorizontally: 'change-snap-horizontally',
      changeSnapVertically: 'change-snap-vertically',
      command: 'command',
      commandsList: 'commands-list',
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
    adjusterMonkeyGui: undefined,
    changeSnapButtons: undefined,
    changeSnapHorizontally: undefined,
    changeSnapVertically: undefined,
    collapseGui: undefined,
    commandsList: undefined,
    executeAboutAdjusterMonkey: undefined,
    executeGetReferenceToPage: undefined,
  },
  fieldNames: {
    adjusterMonkeyGui: undefined,
  },
  guiVersion: '0.0.0',
  logoDetails: {
    height: '132',
    width: '96',
    url: 'https://d-c-rieck.com/dist/AdjusterMonkey-2wzx8mub/render_adjuster-monkey-logo_v20220918i03_96w132h.png',
  },
  selectors: {
    domInsertionPoint: 'main',
  },
  targetApplication: 'Miscellaneous Website',
} );

// NODE.JS TEST CODE:

// const gui = new AdjusterMonkeyGui( {
//   domInsertionPointSelector: 'body',
//   bemCssClasses: {
//     gui: 'adjuster-monkey-trello-gui',
//   },
// } );

// gui.printGuiSettings();
