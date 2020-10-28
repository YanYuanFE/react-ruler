import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import gestureObserver from '../../utils/gesture';
import './index.less';

// static propTypes = {
//   value: PropTypes.number,
//   start: PropTypes.number,
//   end: PropTypes.number,
//   step: PropTypes.number,
//   onDrag: PropTypes.func,
//   className: PropTypes.string,
// };
const Ruler = ({value, start, end, step, onChange, className = '' }) =>  {
  const [val, setValue] = useState(value);
  const [percentage, setPercent] = useState(0.0001);
  const [offsetWidth, setOffsetWidth] = useState(0);
  const startPercentRef = useRef(0);
  const containerWidthRef = useRef(0);
  const rulerRef = useRef();
  const pointRef = useRef();


  useEffect(() => {
    transform();
  }, []);

  useEffect(() => {
    onChange(val);
  }, [val]);

  useEffect(() => {
    initRulerDrag();
  }, [rulerRef.current]);

  useEffect(() => {
    initPointDrag();
  }, [pointRef.current]);

  // useEffect(() => {
  //   let newVal = value < start ? start : value > end ? end : value;
  //   console.log("props", value, newVal)
  //   setValue(newVal);
  //   transform(newVal);
  // }, [value, start, end]);

  useEffect(() => {
    if(!offsetWidth) return;
    let val =  Math.round((end - start) * offsetWidth / containerWidthRef.current + start);
    if (val < start) {
      val = start;
    } else if(val > end) {
      val = end;
    }
    setValue(val);
  }, [offsetWidth]);

  const transform = (offsetWidth) => {
    const left = offsetWidth || value;
    const percentage =  (left - start) / (end - start);
    setPercent(Math.max(percentage, 0.0001));
  }

  useEffect(() => {
    console.log("offset", percentage * containerWidthRef.current);
    setOffsetWidth(percentage * containerWidthRef.current);
  }, [percentage])

  const initRulerDrag = () => {
    if(!rulerRef.current) return;

    const width = rulerRef.current.offsetWidth;
    containerWidthRef.current = width;

    const barClickObserver = gestureObserver(rulerRef.current);

    const barClick = ({ x }) => {
      const wrapperLeft = rulerRef.current.getBoundingClientRect().left;
      let currPercentage = (x - wrapperLeft) / width;
      if (currPercentage < 0) currPercentage = 0.0001;

      setPercent(currPercentage);
    };

    barClickObserver.clicks.forEach(barClick);
  }

  const dragMoves = ({ x }) => {
    setPercent(prev => {
      console.log("move", startPercentRef.current, x)

      let currPercentage =  startPercentRef.current + x / containerWidthRef.current;

      if(currPercentage > 0.99) {
        currPercentage = 0.9999;
      }
      return Math.max(currPercentage, 0.0001)
    });
  };

  const initPointDrag = () => {
    if(!pointRef.current) return;

    const dragObserver = gestureObserver(pointRef.current);

    const dragStart = ({ x }) => {
      console.log("start", percentage);
      setPercent(prev => {
        startPercentRef.current = prev; // 记录开始位置
        return prev;
      });
      onDragStart(x);
    };

    const dragEnds = () => {
      onDragEnd(percentage);
    };

    dragObserver.horizontalMoveStarts.subscribe(dragStart);

    dragObserver.holds.subscribe(dragStart);

    dragObserver.dragMoves.subscribe(dragMoves);

    dragObserver.dragMoveEnds.subscribe(dragEnds);

    dragObserver.horizontalMoves.subscribe(dragMoves);

    dragObserver.horizontalMoveEnds.subscribe(dragEnds);
  }

  const onDragStart = (x) => {
    console.log(x);
  }

  const onDragEnd= (x) => {
    console.log(x);
  }

  const renderRuler = () => {
    const stepWidth = 100 * step /  (end - start);
    let ruleDom = [];
    let ruleDiv;
    for(let i = start; i < end + step; i += step) {
      if (i % 10 === 0 || i === end || (step === 1 && i % 5 === 0)) {
        ruleDiv = <div key={i} className="rule-mark" style={i === end + 1 || i === end ? {} : {width: `${stepWidth}%`}}><div className="line-text">{i === end + 1 ? end : i }</div><div className="line"/></div>;
      } else {
        ruleDiv = <span key={i} className="line" style={{width: `${stepWidth}%`}}/>;
      }
      ruleDom.push(ruleDiv);
    }
    return ruleDom;
  }

  return (
      <div className={`react-ruler-wrapper ${className}`}>
        <div className="ruler-container">
          <div className="ruler-wrapper" ref={rulerRef}>
            <div className="ruler-list">
              {
                renderRuler()
              }
            </div>
            <div
                className="ruler-drag"
                style={{
                  transform: `scaleX(${percentage})`
                }}
            >
              <div
                  className="ruler-point"
                  ref={pointRef}
                  style={{
                    transform: `scaleX(${1 / percentage})`
                  }}
              >
                <div className="point">{val || start}</div>
                <div className="ruler-line" />
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default Ruler;
