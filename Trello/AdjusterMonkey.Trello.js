// ==UserScript==
// @name         AdjusterMonkey: Trello
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Enhance Trello workflows with adjustments to CSS and JS.
// @author       Daniel Rieck <danielcrieck@gmail.com> (https://github.com/invokeImmediately)
// @match        https://trello.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=trello.com
// @grant        none
// @license      MIT
// ==/UserScript==


/*!*************************************************************************************************
 * AdjusterMonkey.▐▀█▀▌█▀▀▄ █▀▀▀ █    █    ▄▀▀▄  · · · · · · · · · · · · · · · · · · · · · · · · · ·
 *  · · · · · · ·   █  █▄▄▀ █▀▀  █  ▄ █  ▄ █  █ · · · · · · · · · · · · · · · · · · · · · · · · · ·
 * · · · · · · · ·  █  ▀  ▀▄▀▀▀▀ ▀▀▀  ▀▀▀   ▀▀ .js · · · · · · · · · · · · · · · · · · · · · · · · ·
 * ·································································································
 * Tampermonkey script designed to enhance Trello workflows with adjustments to CSS and JS.
 *
 * @version 0.9.3
 *
 * @author Daniel C. Rieck [daniel.rieck@wsu.edu] (https://github.com/invokeImmediately)
 * @link https://github.com/invokeImmediately/d-c-rieck.com/blob/main/JS/AdjusterMonkey.Trello.js
 * @license MIT - Copyright (c) 2023 Daniel C. Rieck
 *   Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *   The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *   THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 **************************************************************************************************/

( function( iifeSettings ) {
  'use strict';

  console.log( 'AdjusterMonkey Script for enhancing Trello has loaded.' );

  function addNumbersToCards( cards ) {
    let cardNumber = 1;
    cards.forEach( ( card ) => {
      card.dataset.cardNumber = cardNumber.toString();
      cardNumber++;
    } );
  }

  function cycleWidenedList( cardList ) {
    if ( cardList.classList.contains( "js-list--1xl-wide" ) ) {
      cardList.classList.remove( "js-list--1xl-wide" )
      cardList.classList.add( "js-list--2xl-wide" )
    } else if ( cardList.classList.contains( "js-list--2xl-wide" ) ) {
      cardList.classList.remove( "js-list--2xl-wide" )
      cardList.classList.add( "js-list--3xl-wide" )
    } else if ( cardList.classList.contains( "js-list--3xl-wide" ) ) {
      cardList.classList.remove( "js-list--3xl-wide" )
    }
  }

  function enhanceTrello() {
    setUpCardNumbering();
    setUpListWidening();
    setUpKanbanSubBoards();
  }

  function iifeMain() {
    window.addEventListener( 'load', ( event ) => {
      loadCustomFontFromGoogle();
      monitorTrelloLocation();
      monitorForCustomTrelloHotkeys();
      window.setTimeout( enhanceTrello, 1000 );
      window.setTimeout( monitorBoard, 1000 );
    } );
  }

  function loadCustomFontFromGoogle() {
    const newLink = document.createElement( 'link' );
    newLink.type = 'text/css';
    newLink.rel = 'stylesheet';
    document.head.appendChild( newLink );
    newLink.href = 'https://fonts.googleapis.com/css?family=Source+Code+Pro:400,400i,700,700i|Sofia+Sans::400,400i,700,700i,800,800i&display=swap';
  }

  function monitorBoard() {
    console.log( 'AdjusterMonkey is monitoring the board for list changes.' );
    const board = document.querySelector( '#board' );
    if ( board === null ) {
      return;
    }
    let timerId = null;

    // Monitor lists on the board for content changes so event handling can be set up in response
    const observer = new MutationObserver( ( mutations ) => {
      mutations.forEach( ( mutation ) => {
        console.log( 'Adjuster monkey detected a change to the lists present on the board.' );
        if ( timerId !== null ) {
          window.clearTimeout( timerId );
          console.log( 'Clearing timer %s.', timerId );
          timerId = null;
        }
        timerId = window.setTimeout( enhanceTrello, 1000 );
      } );
    } );
    const observerConfig = {
      childList: true,
    };
    observer.observe( board, observerConfig );
    // TODO: Monitor list titles for name changes?
  }

  function monitorTrelloLocation() {
    console.log( 'AdjusterMonkey is now monitoring the location of the Trello web app.' );
    let currentLocation = document.location.href;
    const contentContainer = document.querySelector( '#content' );
    let timer1Id = null;
    let timer2Id = null;
    const observer = new MutationObserver( ( mutations ) => {
      mutations.forEach( ( mutation ) => {
        if ( currentLocation == document.location.href ) {
          return;
        }
        currentLocation = document.location.href;
        if ( timer1Id !== null ) {
          window.clearTimeout( timer1Id );
          console.log( 'Clearing timer %s.', timer1Id );
          timer1Id = null;
        }
        timer1Id = window.setTimeout( enhanceTrello, 1000 );
        if ( timer2Id !== null ) {
          window.clearTimeout( timer2Id );
          console.log( 'Clearing timer %s.', timer2Id );
          timer2Id = null;
        }
        timer2Id = window.setTimeout( monitorBoard, 1000 );
      } );
    } );
    const cfg = {
      childList: true,
    };
    observer.observe( contentContainer, cfg);
  }

  function monitorForCustomTrelloHotkeys() {
    console.log( 'AdjusterMonkey is adding additional hotkeys to Trello.' );
    window.addEventListener( 'keydown', ( event ) => {
      if( !( event.key == "PageDown" || event.key == "PageUp" ) ) {
        return;
      }
      if ( windowOverlayIsActive() ) {
        return;
      }
      const contentWrapper = document.querySelector('#content-wrapper');
      const board = document.querySelector('#board');
      if( contentWrapper === null || board === null ) {
        return;
      }
      const contentWrapperWidth = contentWrapper.clientWidth;
      const paddingValue = window.getComputedStyle( contentWrapper ).getPropertyValue('padding-left');
      const paddingAmount = parseInt( paddingValue.replace( 'px', '' ), 10 );
      const scrollAmount = contentWrapperWidth - paddingAmount;
      const scrollPosition = board.scrollLeft;
      if( event.key == "PageDown" ) {
        board.scrollTo( scrollPosition + scrollAmount, 0 );
      } else {
        board.scrollTo( scrollPosition - scrollAmount, 0 );
      }
    } );
  }

  function monitorListForCardChanges( cardList ) {
    if ( cardList.dataset.isTrackingCardNumbers === 'yes' ) {
      return;
    } else {
      cardList.dataset.isTrackingCardNumbers = 'yes';
    }
    const listCards = cardList.querySelector( '.list-cards' );
    let timerId = null;
    const observer = new MutationObserver( ( mutations ) => {
      mutations.forEach( ( mutation ) => {
        if ( timerId !== null ) {
          window.clearTimeout( timerId );
          timerId = null;
        }
        const cards = cardList.querySelectorAll( '.list-card' );
        timerId = window.setTimeout( addNumbersToCards, 250, cards );
      } );
    } );
    const config = {
      childList: true,
    };
    observer.observe( listCards, config );
  }

  function resetWidenedList( cardList ) {
      cardList.classList.remove( "js-list--1xl-wide", "js-list--2xl-wide", "js-list--3xl-wide" );
  }

  function setUpCardNumbering() {
    console.log( 'AdjusterMonkey is setting up numbering of cards.' );
    const cardLists = document.querySelectorAll( iifeSettings.selectors.cardLists );
    cardLists.forEach( ( cardList ) => {
      const cards = cardList.querySelectorAll( iifeSettings.selectors.cards );
      addNumbersToCards( cards );
      monitorListForCardChanges( cardList );
    } );
  }

  function setUpKanbanSubBoards() {
    console.log( 'AdjusterMonkey is setting up Kanban sub-boards.' );
    const cardLists = document.querySelectorAll( iifeSettings.selectors.cardLists );
    const upcomingRegEx = /Upcoming §(.+) Tasks/;
    const inProgressRegEx = /In Progress §(.+) Tasks/;
    const completedRegEx = /Completed §(.+) Tasks/;
    cardLists.forEach( ( cardList ) => {
      // Start with a clean slate by removing classes that could have been applied to the list in a previous Kanban sub board process.
      cardList.classList.remove( 'kanban-sub-board', 'kanban-sub-board--alt', 'kanban-sub-board--left', 'kanban-sub-board--middle', 'kanban-sub-board--right' );

      // Identify what role the list plays in its kanban sub board.
      const listHeading = cardList.querySelector( iifeSettings.selectors.listHeading ).textContent;
      let subBoardTopic = undefined;
      if( listHeading.match( upcomingRegEx ) ) {
        cardList.classList.add( 'kanban-sub-board', 'kanban-sub-board--left' );
        subBoardTopic = listHeading.match( upcomingRegEx )[ 1 ];
      } else if ( listHeading.match( inProgressRegEx ) ) {
        cardList.classList.add( 'kanban-sub-board', 'kanban-sub-board--middle' );
        subBoardTopic = listHeading.match( inProgressRegEx )[ 1 ];
      } else if ( listHeading.match( completedRegEx ) ) {
        cardList.classList.add( 'kanban-sub-board', 'kanban-sub-board--right' );
        subBoardTopic = listHeading.match( completedRegEx )[ 1 ];
      }

      // Set up alternating backgrounds between sequential kanban sub boards.
      const prevCardList = cardList.previousElementSibling;
      const prevListHeading = prevCardList !== null ? prevCardList.querySelector( '.list-header-name-assist' ).textContent : null;
      const prevListIsKanbanSubBoard = prevCardList !== null && prevCardList.classList.contains( 'kanban-sub-board' );
      let prevSubBoardTopic = undefined;
      if( prevListHeading && prevListHeading.match( upcomingRegEx ) ) {
        prevSubBoardTopic = prevListHeading.match( upcomingRegEx )[ 1 ];
      } else if ( prevListHeading && prevListHeading.match( inProgressRegEx ) ) {
        prevSubBoardTopic = prevListHeading.match( inProgressRegEx )[ 1 ];
      } else if ( prevListHeading && prevListHeading.match( completedRegEx ) ) {
        prevSubBoardTopic = prevListHeading.match( completedRegEx )[ 1 ];
      }
      if ( prevListIsKanbanSubBoard && subBoardTopic !== undefined && ( ( subBoardTopic != prevSubBoardTopic && !prevCardList.classList.contains( 'kanban-sub-board--alt' ) ) || ( subBoardTopic == prevSubBoardTopic && prevCardList.classList.contains( 'kanban-sub-board--alt' ) ) ) ) {
        cardList.classList.add( 'kanban-sub-board--alt' );
      }
    } );
  }

  function setUpListWidening() {
    console.log( 'AdjusterMonkey is setting up list widening.' );
    const cardLists = document.querySelectorAll( iifeSettings.selectors.cardLists );
    cardLists.forEach( ( cardList ) => {
      if ( cardList.dataset.hasListWidening === 'yes' ) {
        return;
      } else {
        cardList.dataset.hasListWidening = 'yes';
      }
      cardList.addEventListener( 'click', ( event ) => {
        if ( !shouldClickWidenList( cardList, event ) ) {
          return;
        }
        if ( event.shiftKey ) {
          resetWideningOnOtherLists( cardList );
        }
        if( event.ctrlKey ) {
          resetWidenedList( cardList );
          return;
        }
        const listHasBeenWidened = cardList.classList.contains( "js-list--1xl-wide" ) || cardList.classList.contains( "js-list--2xl-wide" ) || cardList.classList.contains( "js-list--3xl-wide" );
        if ( listHasBeenWidened ) {
          cycleWidenedList( cardList );
        } else {
          widenNewList( cardList );
        }
      } );
    } );
  }

  function resetWideningOnOtherLists( cardList ) {
    const allCardLists = document.querySelectorAll( '.js-list' );
    cardList.dataset.protectFromWideningReset = "true";
    allCardLists.forEach( ( otherList ) => {
      if ( 'protectFromWideningReset' in otherList.dataset ) {
        return;
      }
      resetWidenedList( otherList );
    } );
    delete cardList.dataset.protectFromWideningReset;
  }

  function shouldClickWidenList( cardList, event ) {
    const cardContent = cardList.querySelector( iifeSettings.selectors.cardContent );
    const listRect = cardContent.getBoundingClientRect();
    const triggerBottom = listRect.bottom;
    const triggerLeft = listRect.left + iifeSettings.cardListPadding;
    const triggerRight = listRect.right - iifeSettings.cardListPadding;
    const triggerTop = listRect.top;
    return ( event.pageX <= triggerLeft || event.pageX >= triggerRight ) && ( event.pageY >= triggerTop && event.pageY <= triggerBottom );
  }

  function windowOverlayIsActive() {
    const windowOverlay = document.querySelector( iifeSettings.selectors.windowOverlay );
    return window.getComputedStyle( windowOverlay ).getPropertyValue('display') != 'none';
  }

  function widenNewList( cardList ) {
    cardList.classList.add( "js-list--1xl-wide" );
  }

  iifeMain();
} )( {
  cardListPadding: 10,
  localStorageKeyPrefix: 'AdjusterMonkey.Trello.js',
  selectors: {
    cardContent: '.js-list-content',
    cards: '.list-card',
    cardLists: '.js-list',
    listHeading: '.list-header-name-assist',
    windowOverlay: '.window-overlay > .window',
  }
} );
