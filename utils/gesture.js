import { Observable } from 'rxjs';

export default function getDragObservables(domItem) {
  const preventDefault = event => {
    return event.preventDefault();
  };
  const mouseEventToCoordinate = mouseEvent => {
    preventDefault(mouseEvent);
    return {x: mouseEvent.clientX, y: mouseEvent.clientY};
  };
  const touchEventToCoordinate = touchEvent => {
    preventDefault(touchEvent);
    return {x: touchEvent.changedTouches[0].clientX, y: touchEvent.changedTouches[0].clientY};
  };

  let mouseDowns = Observable.fromEvent(domItem, 'mousedown').map(mouseEventToCoordinate).do(() => console.log('mouse down'));
  let mouseMoves = Observable.fromEvent(window, 'mousemove').map(mouseEventToCoordinate).do(() => console.log('mouse move'));
  let mouseUps = Observable.fromEvent(window, 'mouseup').map(mouseEventToCoordinate).do(() => console.log('mouse up'));

  let touchStarts = Observable.fromEvent(domItem, 'touchstart').map(touchEventToCoordinate).do(() => console.log('touch start'));
  let touchMoves = Observable.fromEvent(domItem, 'touchmove').map(touchEventToCoordinate).do(() => console.log('touch move'));
  let touchEnds = Observable.fromEvent(window, 'touchend').map(touchEventToCoordinate).do(() => console.log('touch end'));
  let touchCancels = Observable.fromEvent(window, 'touchcancel').map(touchEventToCoordinate).do(() => console.log('touch cancel'));

  let _starts = mouseDowns.merge(touchStarts);
  let _moves = mouseMoves.merge(touchMoves);
  let _ends = mouseUps.merge(touchEnds).merge(touchCancels);

  const HOLDING_PERIOD = 200; // milliseconds

  // Clicks: Take the start-end pairs only if no more than 3 move events happen in between, and the end event is within the holding period
  let clicks = _starts.concatMap( () =>
    _ends.first()
      .takeUntil(_moves.elementAt(3))
      .takeUntil(Observable.timer(HOLDING_PERIOD))
      .do(() => console.log('click'))
      .catch(() => Observable.empty())
  );

  // Holds: Take those starts where no end event and no more than 3 move event occurs during the holding period
  let holds = _starts.concatMap(dragStartEvent =>
    Observable.timer(HOLDING_PERIOD)
      .takeUntil(_moves.elementAt(3))
      .takeUntil(_ends)
      .map(() => ({x: dragStartEvent.x, y: dragStartEvent.y}))
      .do(() => console.log('hold'))
      .catch(() => Observable.empty())
  );

  // Move starts with direction: Pair the move start events with the 3rd subsequent move event,
  // but only if it happens during the holdign period and no end event happens in between
  let moveStartsWithDirection = _starts.concatMap(dragStartEvent =>
    _moves
      .takeUntil(_ends)
      .takeUntil(Observable.timer(HOLDING_PERIOD))
      .elementAt(3)
      .catch(() => Observable.empty())
      .map(dragEvent => {
        const intialDeltaX = dragEvent.x - dragStartEvent.x;
        const initialDeltaY = dragEvent.y - dragStartEvent.y;
        return {x: dragStartEvent.x, y: dragStartEvent.y, intialDeltaX, initialDeltaY};
      })
  );

  // Vertical move starts: Keep only those move start events where the 3rd subsequent move event is rather vertical than horizontal
  let verticalMoveStarts = moveStartsWithDirection.filter(dragStartEvent =>
    Math.abs(dragStartEvent.intialDeltaX) < Math.abs(dragStartEvent.initialDeltaY)
  ).do(() => console.log('vertical move starts'));

  // Horizontal move starts: Keep only those move start events where the 3rd subsequent move event is rather horizontal than vertical
  let horizontalMoveStarts = moveStartsWithDirection.filter(dragStartEvent =>
    Math.abs(dragStartEvent.intialDeltaX) >= Math.abs(dragStartEvent.initialDeltaY)
  ).do(() => console.log('horizontal move starts'));

  // Take the moves until an end occurs
  const movesUntilEnds = dragStartEvent =>
    _moves.takeUntil(_ends).map(dragEvent => {
      const x = dragEvent.x - dragStartEvent.x;
      const y = dragEvent.y - dragStartEvent.y;
      return { x, y };
    });

  let verticalMoves = verticalMoveStarts.concatMap(movesUntilEnds).do(() => console.log('vertical move'));
  let horizontalMoves = horizontalMoveStarts.concatMap(movesUntilEnds).do(() => console.log('horizontal move'));
  let dragMoves = holds.concatMap(movesUntilEnds).do(() => console.log('dragging'));

  const fastMoveAtEnds = dragStartEvent =>
    _ends
      .first()
      .takeUntil(Observable.timer(HOLDING_PERIOD))
      .map(dragEndEvent => {
        const x = dragEndEvent.x - dragStartEvent.x;
        const y = dragEndEvent.y - dragStartEvent.y;
        return {x, y};
      });

  const lastMovesAtEnds = dragStartEvent =>
    _ends.first().map(dragEndEvent => {
      console.log(dragStartEvent, dragEndEvent);
      const x = dragEndEvent.x - dragStartEvent.x;
      const y = dragEndEvent.y - dragStartEvent.y;
      return {x, y};
    });

  // let ends = _starts.concatMap(lastMovesAtEnds);
  let verticalMoveEnds = verticalMoveStarts.concatMap(lastMovesAtEnds).do(() => console.log('vertical move end'));
  let horizontalMoveEnds = horizontalMoveStarts.concatMap(lastMovesAtEnds).do(() => console.log('horizontal move end'));
  let dragMoveEnds = holds.concatMap(lastMovesAtEnds).do(() => console.log('dragging end'));
  let verticalSwipe = verticalMoveStarts.concatMap(fastMoveAtEnds);
  let horizontalSwipe = horizontalMoveStarts.concatMap(fastMoveAtEnds);

  return {
    clicks, holds,
    verticalMoveStarts, horizontalMoveStarts,
    verticalMoves, horizontalMoves,
    verticalMoveEnds, horizontalMoveEnds,
    dragMoves, dragMoveEnds,
    verticalSwipe, horizontalSwipe
  };
}