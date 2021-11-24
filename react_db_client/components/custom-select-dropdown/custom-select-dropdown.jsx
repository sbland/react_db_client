import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import './customSelectDropdown.scss';
import { DropDownItem } from './drop-down-item';

export const CustomSelectDropdown = ({
  options,
  handleSelect,
  isOpen,
  handleClose,
  firstItemRef,
  goBackToSearchField = () => {},
}) => {
  return <div>Hello</div>
  const menuRef = useRef(null);
  const itemRefs = useRef([]);
  const [currentItemFocus, setCurrentItemFocus] = useState(0);

  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, options.length);
  }, [options]);

  function handleClickOutside(event) {
    if (isOpen && menuRef.current && !menuRef.current.contains(event.target)) {
      handleClose();
    }
  }

  // TODO: Disabled as catches user input
  // useEffect(() => {
  //   if (isOpen) {
  //     // focus on first item when dropdown opened
  //     if (itemRefs.current[0]) itemRefs.current[0].focus();
  //   }
  // }, [isOpen]);

  useEffect(() => {
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  const handleItemKeyDown = (e) => {
    if (e.key === 'ArrowDown' && currentItemFocus < options.length - 1) {
      e.preventDefault();
      itemRefs.current[currentItemFocus + 1].focus();
      setCurrentItemFocus((prev) => prev + 1);
    }
    if (e.key === 'ArrowUp' && currentItemFocus > 0) {
      e.preventDefault();
      itemRefs.current[currentItemFocus - 1].focus();
      setCurrentItemFocus((prev) => prev - 1);
    }
    if (e.key === 'ArrowUp' && currentItemFocus === 0) {
      e.preventDefault();
      goBackToSearchField();
      setCurrentItemFocus(0);
    }
    if (e.key === 'Escape') goBackToSearchField();
  };

  const mapOptions = options.map((opt, i) => (
    <DropDownItem
      key={opt.uid}
      uid={opt.uid}
      label={opt.label}
      handleSelect={handleSelect}
      itemRef={(el) => {
        itemRefs.current[i] = el;
        // eslint-disable-next-line no-param-reassign
        if (i === 0) firstItemRef.current = el;
      }}
      handleKeyDown={(e) => handleItemKeyDown(e)}
      onFocus={() => setCurrentItemFocus(i)}
      isFocused={i === currentItemFocus}
    />
  ));
  // const mapOptions = <div>OPTIONS</div>

  const listDropdownClass = isOpen ? 'selectDropdown_list open' : 'selectDropdown_list';
  const menuDropdownClass = isOpen ? 'selectDropdown_menu open' : 'selectDropdown_menu';

  return (
    <div className="selectDropdown">
      <div className={menuDropdownClass} ref={menuRef}>
        {isOpen && <ul className={listDropdownClass}>{mapOptions}</ul>}
      </div>
    </div>
  );
};

CustomSelectDropdown.propTypes = {
  handleSelect: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ).isRequired,
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  firstItemRef: PropTypes.object.isRequired,
  goBackToSearchField: PropTypes.func.isRequired,
};

