import React, { useState, Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { MinimizeButton } from "./buttons";

const SidebarWrap = ({ children }) => {
  return (
    <div>
      <div className="sidebarWrap">
        {children[0]}
        <div className="sidebarWrap_main">{children[1]}</div>
      </div>
    </div>
  );
};

SidebarWrap.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};
export default SidebarWrap;

export const SidebarWrapSide = ({ children }) => {
  const [sidebarOpen, setsidebarOpen] = useState(true);
  return (
    <div className={`sidebarWrap_side ${(sidebarOpen && " ") || "collapsed"}`}>
      <div className={`sidebarWrap_sideContent ${(sidebarOpen && " ") || "collapsed"}`}>
        {children}
        <div className="sidebarWrap_sideButton mobile">
          <button
            type="button"
            // className={(sidebarOpen && 'button-two') || 'button-one'}
            className="button_reset"
            onClick={() => {
              setsidebarOpen(!sidebarOpen);
            }}
          >
            <p>{(sidebarOpen && "<") || ">"}</p>
          </button>
        </div>
      </div>
      <div className="sidebarWrap_sideButton">
        <button
          type="button"
          // className={(sidebarOpen && 'button-two') || 'button-one'}
          className="button_reset"
          onClick={() => {
            setsidebarOpen(!sidebarOpen);
          }}
        >
          <p>{(sidebarOpen && "<") || ">"}</p>
        </button>
      </div>
    </div>
  );
};

SidebarWrapSide.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export const SidebarWrapSideSection = ({
  children,
  title,
  startCollapsed,
  position,
  editButtons,
  showTitle,
}) => {
  const [expanded, setexpanded] = useState(!startCollapsed);

  useEffect(() => {
    setexpanded(!startCollapsed);
  }, [startCollapsed]);

  const classNames = expanded
    ? "sidebarWrap_side_section_content"
    : "sidebarWrap_side_section_content closed";
  return (
    <div
      className="sidebarWrap_side_section"
      style={{
        order: position,
      }}
    >
      {showTitle && (
        <div className="sidebarWrap_side_section_headingWrap">
          <p className="sidebarWrap_side_section_heading">{title}</p>
          <div className="sidebarWrap_side_section_editBtns">
            {editButtons}
            <MinimizeButton
              handleMinimize={() => {
                setexpanded(!expanded);
              }}
              isExpanded={expanded}
            />
          </div>
        </div>
      )}
      <div className={classNames}>{expanded && children}</div>
    </div>
  );
};

SidebarWrapSideSection.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  startCollapsed: PropTypes.bool,
  position: PropTypes.number,
  editButtons: PropTypes.node,
  showTitle: PropTypes.bool,
};
SidebarWrapSideSection.defaultProps = {
  startCollapsed: false,
  position: 0,
  editButtons: null,
  showTitle: true,
};

export const SidebarWrapMain = ({ children }) => (
  <Fragment>{children}</Fragment>
  // <div className="sidebarWrap_main">{children}</div>
);

SidebarWrapMain.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export const SidebarSectionSubHeading = ({ title, editButtons, uid }) => (
  <div className="sidebarWrap_side_section_subHeadingWrap">
    <label className="sidebarWrap_side_section_subHeading" id={uid}>{title}</label>
    <div className="sidebarWrap_side_section_subHeading_editBtns">{editButtons}</div>
  </div>
);

SidebarSectionSubHeading.propTypes = {
  title: PropTypes.string.isRequired,
  editButtons: PropTypes.node,
};

SidebarSectionSubHeading.defaultProps = {
  editButtons: null,
};

// export const SidebarWrapMainSection = ({
//   children,
//   title,
//   startCollapsed,
//   position,
//   editButtons,
// }) => {
//   const [expanded, setexpanded] = useState(!startCollapsed);

//   useEffect(() => {
//     setexpanded(!startCollapsed);
//   }, [startCollapsed]);

//   const classNames = (expanded) ? 'sidebarWrap_main_section_content' : 'sidebarWrap_main_section_content closed';
//   return (
//     <div
//       className="sidebarWrap_main_section"
//       style={{
//         order: position,
//       }}
//     >
//       <div className="sidebarWrap_main_section_headingWrap">
//         <p className="sidebarWrap_main_section_heading">{title}</p>
//         {editButtons}

//         <MinimizeButton
//           handleMinimize={() => { setexpanded(!expanded); }}
//           isExpanded={expanded}
//         />
//       </div>
//       <div className={classNames}>
//         {expanded && children}
//       </div>
//     </div>
//   );
// };

// SidebarWrapMainSection.propTypes = {
//   title: PropTypes.string.isRequired,
//   children: PropTypes.oneOfType([
//     PropTypes.arrayOf(PropTypes.node),
//     PropTypes.node,
//   ]).isRequired,
//   startCollapsed: PropTypes.bool,
//   position: PropTypes.number,
// };
// SidebarWrapMainSection.defaultProps = {
//   startCollapsed: false,
//   position: 0,
// };

// export const SidebarMainSectionSubHeading = ({ title }) => (
//   <p className="sidebarWrap_main_section_subHeading">{title}</p>
// );

// SidebarMainSectionSubHeading.propTypes = {
//   title: PropTypes.string.isRequired,
// };
