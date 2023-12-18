// ==UserScript==
// @name         AdjusterMonkey: Trello
// @namespace    http://tampermonkey.net/
// @version      0.11.0
// @description  Enhance Trello workflows with adjustments to CSS and JS.
// @author       Daniel Rieck <danielcrieck@gmail.com> (https://github.com/invokeImmediately)
// @match        https://trello.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=trello.com
// @grant        none
// @license      MIT
// ==/UserScript==

/*!*****************************************************************************
 * ▓▓▓ AdjusterMonkey.▐▀█▀▌█▀▀▄ █▀▀▀ █    █    ▄▀▀▄ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓
 * ▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  █  █▄▄▀ █▀▀  █  ▄ █  ▄ █  █ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓
 * ▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  █  ▀  ▀▄▀▀▀▀ ▀▀▀  ▀▀▀   ▀▀ .js ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓
 *
 * Tampermonkey script designed to enhance Trello workflows with adjustments to
 *  CSS and JS.
 *
 * @version 0.11.0
 *
 * @author Daniel C. Rieck
 *  [daniel.rieck@wsu.edu]
 *  (https://github.com/invokeImmediately)
 *
 * @link https://github.com/invokeImmediately/AdjusterMonkey/blob/main/Trello/AdjusterMonkey.Trello.js
 * @license MIT - Copyright (c) 2023 Daniel C. Rieck
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *   of this software and associated documentation files (the “Software”), to
 *   deal in the Software without restriction, including without limitation the
 *   rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 *   sell copies of the Software, and to permit persons to whom the Software is
 *   furnished to do so, subject to the following conditions:
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

(function(iifeSet5) {
  'use strict';

  console.log( 'AdjusterMonkey Script for enhancing Trello has loaded.' );

  function addNumbersToCards(cards) {
    console.log( 'Adding numbers to card.' );
    let cardNumber = 1;
    cards.forEach((card) => {
      card.dataset.cardNumber = cardNumber.toString();
      cardNumber++;
    });
  }

  function convertListNameToLocalStorageKey(cardList) {
    const boardName = getBoardNameFromDOMViaCardList(cardList);
    if (boardName === null) {
      return null;
    }
    const listHeading = getCardListHeadingFromDOM(cardList);
    return iifeSet5.localStorageKeyPrefix + '.' + boardName + '.' +
      listHeading;
  }

  function cycleWidenedList(cardList) {
    if (cardList.classList.contains(iifeSet5.listWid4gClasses.width1x)) {
      cardList.classList.remove(iifeSet5.listWid4gClasses.width1x);
      cardList.classList.add(iifeSet5.listWid4gClasses.width2x);
      window.localStorage.setItem(convertListNameToLocalStorageKey(cardList),
        iifeSet5.listWid4gClasses.width2x);
    } else if (cardList.classList.contains(
      iifeSet5.listWid4gClasses.width2x
    )) {
      cardList.classList.remove(iifeSet5.listWid4gClasses.width2x);
      cardList.classList.add(iifeSet5.listWid4gClasses.width3x);
      window.localStorage.setItem(
        convertListNameToLocalStorageKey(cardList),
        iifeSet5.listWid4gClasses.width3x
      );
    } else if (cardList.classList.contains("js-list--3xl-wide")) {
      cardList.classList.remove("js-list--3xl-wide");
      window.localStorage.removeItem(
        convertListNameToLocalStorageKey(cardList)
      );
    }
  }

  function enhanceTrello() {
    setUpCardNumbering();
    setUpListWidening();
    setUpKanbanSubBoards();
  }

  function getBoardNameFromDOMViaCardList(cardList) {
    const boardContentCon5r =
      cardList.closest(iifeSet5.sel5s.appContent);
    if (boardContentCon5r === null) {
      return null;
    }
    return boardContentCon5r.querySelector(
      iifeSet5.sel5s.boardHeader
    ).textContent;
  }

  function getCardListHeadingFromDOM( cardList ) {
    return cardList.querySelector(
      iifeSet5.sel5s.listHeading
    ).textContent;
  }

  function iifeMain() {
    window.addEventListener('load', (event) => {
      loadCustomFontFromGoogle();
      monitorTrelloLocation();
      monitorForCustomTrelloHotkeys();
      window.setTimeout(enhanceTrello, 2000);
      window.setTimeout(monitorBoard, 2000);
    });
  }

  function loadCustomFontFromGoogle() {
    const newLink = document.createElement('link');
    newLink.type = 'text/css';
    newLink.rel = 'stylesheet';
    document.head.appendChild(newLink);
    newLink.href = 'https://fonts.googleapis.com/css?family=Source+Code+Pro:400,400i,600,600i,700,700i|Sofia+Sans::400,400i,600,600i,700,700i,800,800i&display=swap';
  }

  function monitorBoard() {
    console.log('AdjusterMonkey is monitoring the board for list changes.');
    const board = document.querySelector(iifeSet5.sel5s.board);
    if (
      board === null
      && document.querySelector(iifeSet5.sel5s.membersBoardView) === null
    ) {
      window.setTimeout(monitorBoard, 1000);
      return;
    } else if (board === null) {
      return;
    }

    // Monitor lists on the board for content changes so event handling can be set up in response
    let timerId = null;
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        console.log(
          'Adjuster monkey detected a change to the lists present on the board.'
        );
        if (timerId !== null) {
          window.clearTimeout(timerId);
        }
        timerId = window.setTimeout(enhanceTrello, 1000);
      } );
    } );
    const observerConfig = {
      childList: true,
    };
    observer.observe( board, observerConfig );
    // TODO: Monitor list titles for name changes?
  }

  function monitorTrelloLocation() {
    console.log(
      'AdjusterMonkey is now monitoring the location of the Trello web app.'
    );
    let currentLocation = document.location.href;
    const contentContainer = document.querySelector('#content');
    let timer1Id = null;
    let timer2Id = null;
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (currentLocation == document.location.href) {
          return;
        }
        console.log('Page mutation sensed.');
        currentLocation = document.location.href;
        if (timer1Id !== null) {
          window.clearTimeout(timer1Id);
          console.log('Clearing timer %s.', timer1Id);
          timer1Id = null;
        }
        timer1Id = window.setTimeout(enhanceTrello, 1000);
        if (timer2Id !== null) {
          window.clearTimeout(timer2Id);
          console.log('Clearing timer %s.', timer2Id);
          timer2Id = null;
        }
        timer2Id = window.setTimeout(monitorBoard, 1000);
      });
    });
    const cfg = {
      childList: true,
    };
    observer.observe(contentContainer, cfg);
  }

  function monitorForCustomTrelloHotkeys() {
    console.log('AdjusterMonkey is adding additional hotkeys to Trello.');
    window.addEventListener('keydown', (event) => {
      if (!(event.key == "PageDown" || event.key == "PageUp")) {
        return;
      }
      if (windowOverlayIsActive()) {
        return;
      }
      const contentWrapper = document.querySelector('#content-wrapper');
      const board = document.querySelector('#board');
      if (contentWrapper === null || board === null) {
        return;
      }
      const contentWrapperWidth = contentWrapper.clientWidth;
      const paddingValue =
        window.getComputedStyle(contentWrapper)
        .getPropertyValue('padding-left');
      const paddingAmount = parseInt(paddingValue.replace('px', ''), 10);
      const scrollAmount = contentWrapperWidth - paddingAmount;
      const scrollPosition = board.scrollLeft;
      if (event.key == "PageDown") {
        board.scrollTo(scrollPosition + scrollAmount, 0);
      } else {
        board.scrollTo(scrollPosition - scrollAmount, 0);
      }
    });
  }

  function monitorListForCardChanges(cardList) {
    if (cardList.dataset.isTrackingCardNumbers === 'yes') {
      return;
    } else {
      cardList.dataset.isTrackingCardNumbers = 'yes';
    }
    const listCards = cardList.querySelector('ol[data-testid="list-cards"]');
    let timerId = null;
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (timerId !== null) {
          window.clearTimeout(timerId);
          timerId = null;
        }
        const cards = cardList.querySelectorAll(iifeSet5.sel5s.cards);
        timerId = window.setTimeout(addNumbersToCards, 250, cards);
      });
    });
    const config = {
      childList: true,
    };
    observer.observe(listCards, config);
  }

  function resetWidenedList(cardList) {
    cardList.classList.remove(
      iifeSet5.listWid4gClasses.width1x,
      iifeSet5.listWid4gClasses.width2x,
      iifeSet5.listWid4gClasses.width3x
    );
    window.localStorage.removeItem(convertListNameToLocalStorageKey(cardList));
  }

  function setListWideningStateFromLocalStorage(cardList) {
    const wideningClassToApply =
      window.localStorage.getItem(convertListNameToLocalStorageKey(cardList));
    if (
      wideningClassToApply === null
      || cardList.classList.contains(wideningClassToApply)
    ) {
      return;
    }
    cardList.classList.add(wideningClassToApply);
  }

  function setUpCardNumbering() {
    const cardLists =
      document.querySelectorAll(iifeSet5.sel5s.cardLists);
    if (cardLists === null) {
      cardLists = { length: 0 };
    }
    console.log(
      `AdjusterMonkey is setting up numbering of cards on ${cardLists.length} lists.`
    );
    cardLists.forEach((cardList) => {
      const cards = cardList.querySelectorAll(iifeSet5.sel5s.cards);
      addNumbersToCards(cards);
      monitorListForCardChanges(cardList);
    });
  }

  function setUpKanbanSubBoards() {
    console.log('AdjusterMonkey is setting up Kanban sub-boards.');
    const cardLists =
      document.querySelectorAll(iifeSet5.sel5s.cardLists);
    const upcomingRegEx = /Upcoming §(.+) Tasks/;
    const inProgressRegEx = /In Progress §(.+) Tasks/;
    const completedRegEx = /Completed §(.+) Tasks/;
    cardLists.forEach((cardList) => {
      // ·> Start with a clean slate by removing classes that could have been  ·
      // ·  applied to the list in a previous Kanban sub board process.       <·
      cardList.classList.remove('kanban-sub-board', 'kanban-sub-board--alt',
        'kanban-sub-board--left', 'kanban-sub-board--middle',
        'kanban-sub-board--right');

      // Identify what role the list plays in its kanban sub board.
      const listHeading = getCardListHeadingFromDOM(cardList);
      let subBoardTopic = undefined;
      if(listHeading.match(upcomingRegEx)) {
        cardList.classList.add('kanban-sub-board', 'kanban-sub-board--left');
        subBoardTopic = listHeading.match(upcomingRegEx)[1];
      } else if (listHeading.match(inProgressRegEx)) {
        cardList.classList.add('kanban-sub-board', 'kanban-sub-board--middle');
        subBoardTopic = listHeading.match(inProgressRegEx)[1];
      } else if (listHeading.match(completedRegEx)) {
        cardList.classList.add('kanban-sub-board', 'kanban-sub-board--right');
        subBoardTopic = listHeading.match(completedRegEx)[1];
      }

      // Set up alternating backgrounds between sequential kanban sub boards.
      const prevCardList = cardList.previousElementSibling;
      const prevListHeading =
        prevCardList !== null ?
        prevCardList.querySelector('.list-header-name-assist').textContent :
        null;
      const prevListIsKanbanSubBoard =
        prevCardList !== null
        && prevCardList.classList.contains('kanban-sub-board');
      let prevSubBoardTopic = undefined;
      if (prevListHeading && prevListHeading.match(upcomingRegEx)) {
        prevSubBoardTopic = prevListHeading.match(upcomingRegEx)[1];
      } else if (prevListHeading && prevListHeading.match(inProgressRegEx)) {
        prevSubBoardTopic = prevListHeading.match(inProgressRegEx)[1];
      } else if (prevListHeading && prevListHeading.match(completedRegEx)) {
        prevSubBoardTopic = prevListHeading.match(completedRegEx)[1];
      }
      if (
        prevListIsKanbanSubBoard && subBoardTopic !== undefined
        && (
          (
            subBoardTopic != prevSubBoardTopic
            && !prevCardList.classList.contains('kanban-sub-board--alt')
          ) || (
            subBoardTopic == prevSubBoardTopic
            && prevCardList.classList.contains('kanban-sub-board--alt')
          )
        )
      ) {
        cardList.classList.add('kanban-sub-board--alt');
      }
    } );
  }

  function setUpListWidening() {
    console.log('AdjusterMonkey is setting up list widening.');
    const cardLists =
      document.querySelectorAll(iifeSet5.sel5s.cardLists);
    cardLists.forEach((cardList) => {
      if (cardList.dataset.hasListWidening === 'yes') {
        return;
      } else {
        cardList.dataset.hasListWidening = 'yes';
      }
      setListWideningStateFromLocalStorage(cardList);
      cardList.addEventListener('click', (event) => {
        if (!shouldClickWidenList(cardList, event)) {
          return;
        }
        if (event.shiftKey) {
          resetWideningOnOtherLists(cardList);
        }
        if (event.ctrlKey) {
          resetWidenedList(cardList);
          return;
        }
        const listHasBeenWidened =
          cardList.classList.contains(iifeSet5.listWid4gClasses.width1x)
          || cardList.classList.contains(iifeSet5.listWid4gClasses.width2x)
          || cardList.classList.contains(iifeSet5.listWid4gClasses.width3x);
        if (listHasBeenWidened) {
          cycleWidenedList(cardList);
        } else {
          widenNewList(cardList);
        }
      });
    });
  }

  function resetWideningOnOtherLists(cardList) {
    const allCardLists = document.querySelectorAll('div[data-testid="list"]');
    cardList.dataset.protectFromWideningReset = "true";
    allCardLists.forEach((otherList) => {
      if ('protectFromWideningReset' in otherList.dataset) {
        return;
      }
      resetWidenedList( otherList );
    } );
    delete cardList.dataset.protectFromWideningReset;
  }

  function shouldClickWidenList(cardList, event) {
    const cardContent = cardList.querySelector('ol[data-testid="list-cards"]');
    const listRect = cardContent.getBoundingClientRect();
    const triggerBottom = listRect.bottom;
    const triggerLeft = listRect.left - iifeSet5.cardListPadding;
    const triggerRight = listRect.right + iifeSet5.cardListPadding;
    const triggerTop = listRect.top;
    console.log(
      `shouldClickWidenList fired with ${event.pageX}, ${event.pageY} / ${triggerBottom}, ${triggerLeft}, ${triggerRight}, ${triggerTop}`
    );
    return (
      event.pageX <= triggerLeft || event.pageX >= triggerRight
    ) && (
      event.pageY >= triggerTop && event.pageY <= triggerBottom
    );
  }

  function windowOverlayIsActive() {
    const windowOverlay =
      document.querySelector(iifeSet5.sel5s.windowOverlay);
    return window.getComputedStyle(windowOverlay)
      .getPropertyValue('display') != 'none';
  }

  function widenNewList(cardList) {
    cardList.classList.add(iifeSet5.listWid4gClasses.width1x);
    window.localStorage.setItem(convertListNameToLocalStorageKey(cardList),
      iifeSet5.listWid4gClasses.width1x);
  }

  iifeMain();
})({
  cardListPadding: 8,
  listWid4gClasses: {
    width1x: 'js-list--1xl-wide',
    width2x: 'js-list--2xl-wide',
    width3x: 'js-list--3xl-wide',
  },
  localStorageKeyPrefix: 'AdjusterMonkey.Trello.js',
  sel5s: {
    appContent: '#content',
    board: '#board',
    boardHeader: '.board-header h1[data-testid="board-name-display"]',
    cardContent: 'div[data-testid="trello-card"]',
    cards: 'li[data-testid="list-card"]',
    cardLists: 'div[data-testid="list"]',
    listHeading: 'h2[data-testid="list-name"]',
    memberBoardsView: '#content > .member-boards-view',
    windowOverlay: '.window-overlay > .window',
  }
});
