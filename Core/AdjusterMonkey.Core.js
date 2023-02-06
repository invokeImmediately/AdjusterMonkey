/*!*************************************************************************************************
 * AdjusterMonkey. ▄▀▀▀ ▄▀▀▄ █▀▀▄ █▀▀▀ · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · ·
 *  · · · · · · ·  █    █  █ █▄▄▀ █▀▀   · · · · · · · · · · · · · · · · · · · · · · · · · · · · · ·
 * · · · · · · · ·  ▀▀▀  ▀▀  ▀  ▀▄▀▀▀▀ .js · · · · · · · · · · · · · · · · · · · · · · · · · · · · ·
 * ·································································································
 * Tampermonkey script that serves as the core from which all AdjusterMonkey scritps are built.
 *
 * Implements a GUI that serves as a foundation for each AdjusterMonkey variant to utilize in building a TamperMonkey-mediated enhancement script tailored to a target website or web app.
 *
 * @version 0.0.0
 *
 * @author Daniel C. Rieck [daniel.rieck@wsu.edu] (https://github.com/invokeImmediately)
 * @link https://github.com/invokeImmediately/d-c-rieck.com/blob/main/Core/AdjusterMonkey.Core.js
 * @license MIT - Copyright (c) 2023 Daniel C. Rieck
 *   Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *   The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *   THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 **************************************************************************************************/

const AdjusterMonkeyGui = ( function( iifeSettings ) {
  'use strict';

  class AdjusterMonkeyGui {
    domInsertionPointSelector = iifeSettings.selectors.domInsertionPoint;
    bemCssClasses = iifeSettings.bemCssClasses;
    #parentElement;
    #guiElements = {};

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
    }

    #insertGuiIntoDom() {
      const $insertionPoint = document.querySelector( this.domInsertionPointSelector );
      if ( $insertionPoint === null ) {
        return;
      } else {
        this.#parentElement = $insertionPoint;
      }
      this.#guiElements.gui = document.createElement( 'div' );
      this.#guiElements.gui.classList.add( this.bemCssClasses.gui );
      this.#guiElements.gui = document.createElement( 'h2' );
    }

    #setBemCssClasses( bemCssClasses ) {
      this.bemCssClasses.gui = this.#setPropertySafely( bemCssClasses.gui, this.bemCssClasses.gui );
      if( 'guiElements' in bemCssClasses && typeof bemCssClasses.guiElements === 'object' ) {
        this.#setGuiElementsClasses( bemCssClasses.guiElements );
      }
      if( 'guiModifiers' in bemCssClasses && typeof bemCssClasses.guiModifiers === 'object' ) {
        this.#setGuiModifiersClasses( bemCssClasses.guiModifiers );
      }
    }

    #setGuiElementsClasses( classes ) {
      this.bemCssClasses.guiElements.logo = this.#setPropertySafely( classes.logo, this.bemCssClasses.guiElements.logo );
      this.bemCssClasses.guiElements.title = this.#setPropertySafely( classes.title, this.bemCssClasses.guiElements.title );
      this.bemCssClasses.guiElements.changeSnap = this.#setPropertySafely( classes.changeSnap, this.bemCssClasses.guiElements.changeSnap );
      this.bemCssClasses.guiElements.changeSnapHorizontally = this.#setPropertySafely( classes.changeSnapHorizontally, this.bemCssClasses.guiElements.changeSnapHorizontally );
      this.bemCssClasses.guiElements.changeSnapVertically = this.#setPropertySafely( classes.changeSnapVertically, this.bemCssClasses.guiElements.changeSnapVertically );
      this.bemCssClasses.guiElements.command = this.#setPropertySafely( classes.command, this.bemCssClasses.guiElements.command );
      this.bemCssClasses.guiElements.commandsList = this.#setPropertySafely( classes.commandsList, this.bemCssClasses.guiElements.commandsList );
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
      console.log( `Settings for instance of AdjusterMonkeyGui are as follows:
  - domInsertionPointSelector: ${this.domInsertionPointSelector}
  - bemCssClasses.gui: ${this.bemCssClasses.gui}
  - bemCssClasses.guiElements
  --- .logo: ${this.bemCssClasses.guiElements.logo}
  --- .title: ${this.bemCssClasses.guiElements.title}
  --- .changeSnap: ${this.bemCssClasses.guiElements.changeSnap}
  --- .changeSnapHorizontally: ${this.bemCssClasses.guiElements.changeSnapHorizontally}
  --- .changeSnapVertically: ${this.bemCssClasses.guiElements.changeSnapVertically}
  --- .command: ${this.bemCssClasses.guiElements.command}
  --- .commandsList: ${this.bemCssClasses.guiElements.commandsList}
  - bemCssClasses.guiModifiers
  --- .expanded: ${this.bemCssClasses.guiModifiers.expanded}
  --- .snapToLowerLeft: ${this.bemCssClasses.guiModifiers.snapToLowerLeft}
  --- .snapToLowerRight: ${this.bemCssClasses.guiModifiers.snapToLowerRight}
  --- .snapToUpperLeft: ${this.bemCssClasses.guiModifiers.snapToUpperLeft}
  --- .snapToUpperRight: ${this.bemCssClasses.guiModifiers.snapToUpperRight}` );
    }
  }

  return AdjusterMonkeyGui;
} )( {
  bemCssClasses: {
    gui: 'adjuster-monkey-gui',
    guiElements: {
      logo: 'logo',
      title: 'title',
      changeSnap: 'change-snap',
      changeSnapHorizontally: 'change-snap-horizontally',
      changeSnapVertically: 'change-snap-vertically',
      command: 'command',
      commandsList: 'commands-list',
    },
    guiModifiers: {
      expanded: 'expand',
      snapToLowerLeft: 'snap-to-lower-left',
      snapToLowerRight: 'snap-to-lower-right',
      snapToUpperLeft: 'snap-to-upper-left',
      snapToUpperRight: 'snap-to-upper-right',
    },
  },
  selectors: {
    domInsertionPoint: 'main',
  },
} );

// NODE.JS TEST CODE:

// const gui = new AdjusterMonkeyGui( {
//   domInsertionPointSelector: 'body',
//   bemCssClasses: {
//     gui: 'adjuster-monkey-trello-gui',
//   },
// } );

// gui.printGuiSettings();
