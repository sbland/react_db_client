// import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
// // import FilterSelection from './SearchAndSelectFilters';
// import cloneDeep from 'lodash/cloneDeep';

// import StyledSelectList from '../StyledSelectList/StyledSelectList';
// import './_searchAndSelect.scss';
// import FilterManager from '../FilterManager/FilterManager';
// import FilterObjectClass from '../FilterManager/FilterObjectClass';
// import filterTypes from '../../GenericConstants/filterTypes';
// import comparisons from '../../GenericConstants/comparisons';
// import useAsyncRequest from '../AsyncRequestManager';
// import Emoji from '../Emoji/Emoji';
// import { useSelectionManager } from './logic';
// import SelectionPreview from '../SelectionPreview/SelectionPreview';

// /**
//  * Search and Select Component
//  * Allows searching using a set of filters then selecting a result and returning to parent component
//  *
//  * Ensure handleSelect uses the React useCallback hook to avoid render loop
//  *
//  * The searchFunction argument should be an async function with the following sig:
//  * async (activeFilters: <Array[FilterType]>, sortBy: String, searchValue: String) => arrayOf({ uid: <String>})
//  *
//  * @param {*} {
//  *   initialFilters,
//  *   availableFilters, // same as field data
//  *   searchFunction,
//  *   headings,
//  *   handleSelect, // (returnFieldOnSelect, selectedData) => {}
//  *   selectionOverride,
//  *   autoUpdate,
//  *   forceUpdate,
//  *   allowFilters,
//  *   allowMultiple,
//  *   returnFieldOnSelect, - The field of the selection to pass to handle select. Default 'uid'
//  *   reverseSort
//  * }
//  * @returns
//  */
// const SearchAndSelect = ({
//   initialFilters,
//   availableFilters, // same as field data
//   searchFunction,
//   headings,
//   previewHeadings,
//   handleSelect,
//   selectionOverride,
//   autoUpdate,
//   // forceUpdate,
//   allowFilters,
//   allowMultiple,
//   returnFieldOnSelect,
//   showSearchField,
//   searchFieldTargetField,
//   acceptSelectionBtnText,
//   showRefreshBtn,
//   limitResultHeight,
//   sortBy: sortByOverride,
//   reverseSort = false,
//   reloadKey,
//   loadOnInit,
//   noEmptySearch,
//   liveUpdate,
//   autoWidth, // Auto calc column width
//   customParsers,
//   labelField,
//   allowSelectionPreview,
//   autoPreview,
// }) => {
//   const [showPreview, setShowPreview] = useState(autoPreview);
//   const [shouldReload, setShouldReload] = useState(loadOnInit);
//   const [singleLoad, setSingleLoad] = useState(false);
//   const [activeFilters, setActiveFilters] = useState(initialFilters || []);
//   const [searchValue, setSearchValue] = useState('');
//   const [sortBy] = useState(sortByOverride);
//   const [canLoad, setCanLoad] = useState(loadOnInit); // flag to stop loading on init

//   const {
//     response: results,
//     reload,
//     loading,
//     // hasLoaded,
//     error,
//   } = useAsyncRequest({
//     args: [],
//     callFn: searchFunction,
//     callOnInit: false,
//   });

//   const {
//     handleItemSelect,
//     currentSelection,
//     currentSelectionUid,
//     selectAll,
//     clearSelection,
//     acceptSelection,
//   } = useSelectionManager({
//     results,
//     returnFieldOnSelect,
//     allowMultiple,
//     selectionOverride,
//     handleSelect,
//     liveUpdate,
//     labelField,
//   });

//   useEffect(() => {
//     // VALIDATE INPUT
//     if (initialFilters && !Array.isArray(initialFilters))
//       throw TypeError('Initial Filters should be an array');
//   }, [initialFilters]);

//   useEffect(() => {
//     if (shouldReload && (autoUpdate || singleLoad)) {
//       setSingleLoad(false);
//       if (!noEmptySearch || activeFilters.length > 0 || searchValue) {
//         setShouldReload(false);
//         if (searchFieldTargetField) reload([activeFilters, sortBy, null, reverseSort]);
//         if (!searchFieldTargetField) reload([activeFilters, sortBy, searchValue, reverseSort]);
//       }
//     }
//   }, [
//     shouldReload,
//     activeFilters,
//     sortBy,
//     searchValue,
//     reload,
//     autoUpdate,
//     noEmptySearch,
//     searchFieldTargetField,
//     reverseSort,
//     singleLoad,
//   ]);

//   useEffect(() => {
//     // TODO: Test this
//     if (reloadKey > 0) setShouldReload(true);
//   }, [reloadKey]);

//   const handleSearchFieldInput = (e) => {
//     const newSearchString = e.target.value;

//     setSearchValue(newSearchString);
//     if (!canLoad) setCanLoad(true);
//     setShouldReload(true);

//     setActiveFilters((prev) => {
//       // Remove previous search string filter and create a new one
//       const filtersCopy = prev ? [...prev.filter((f) => f.uid !== 'search')] : [];
//       if (newSearchString && searchFieldTargetField) {
//         filtersCopy.push(
//           new FilterObjectClass({
//             uid: 'search',
//             field: searchFieldTargetField,
//             value: newSearchString,
//             operator: comparisons.contains,
//             type: filterTypes.text,
//           })
//         );
//         return filtersCopy;
//       }
//       return filtersCopy;
//     });
//   };

//   const handleAddFilter = (newFilterObj) => {
//     setActiveFilters((prev) => prev.concat([newFilterObj]));
//     if (!canLoad) setCanLoad(true);
//     setShouldReload(true);
//   };

//   const handleDeleteFilter = (index) => {
//     setActiveFilters((prevFilterData) => prevFilterData.filter((f, i) => i !== index));
//     if (!canLoad) setCanLoad(true);
//     setShouldReload(true);
//   };

//   const handleUpdateFilter = (index, newFilter) => {
//     setActiveFilters((prevFilterData) => {
//       const newFilterData = cloneDeep(prevFilterData);
//       newFilterData[index] = newFilter;
//       return newFilterData;
//     });
//     if (!canLoad) setCanLoad(true);
//     setShouldReload(true);
//   };

//   const handleClearFilters = () => setActiveFilters([]);

//   return (
//     <div className="searchAndSelect sas_wrap sectionWrapper">
//       <section
//         className="sas_filtersSection"
//         style={{
//           display: 'flex',
//           justifyContent: 'space-between',
//         }}
//       >
//         {allowSelectionPreview && (
//           <button
//             type="button"
//             className={showPreview ? 'button-two' : 'button-one'}
//             onClick={() => setShowPreview((prev) => !prev)}
//           >
//             Show Preview
//           </button>
//         )}
//         {allowFilters && (
//           <FilterManager
//             filterData={activeFilters}
//             clearFilters={handleClearFilters}
//             addFilter={(newFilterData) => handleAddFilter(newFilterData)}
//             deleteFilter={(filterId) => handleDeleteFilter(filterId)}
//             updateFilter={(filterId, newFilterData) => handleUpdateFilter(filterId, newFilterData)}
//             fieldsData={availableFilters}
//           />
//         )}

//         {showSearchField && (
//           <div
//             style={{
//               marginLeft: '1rem',
//               flexGrow: 1,
//               display: 'flex',
//             }}
//           >
//             <label>Search: </label>
//             <input
//               className="searchField"
//               style={{ flexGrow: 1 }}
//               type="text"
//               placeholder="search..."
//               value={searchValue}
//               onChange={handleSearchFieldInput}
//             />
//           </div>
//         )}
//         {showRefreshBtn && (
//           <button
//             type="button"
//             className="button-reset refreshBtn"
//             onClick={() => {
//               setShouldReload(true);
//               setSingleLoad(true);
//             }}
//             style={{
//               width: '2rem',
//               height: '2rem',
//               textAlign: 'center',
//               fontSize: '1.5rem',
//             }}
//           >
//             <Emoji emoj="🔄" label="refresh" />
//           </button>
//         )}
//       </section>

//       <section
//         className="sas_resultsSection"
//         style={{
//           minWidth: '100%',
//         }}
//       >
//         <div className="sas_resultsList">
//           {/* TODO: Add option to turn on results title */}
//           {/* <h4>Results</h4> */}
//           <div
//             style={{
//               cursor: loading ? 'progress' : 'default',
//             }}
//           >
//             <StyledSelectList
//               listInput={results || []}
//               headings={headings}
//               handleSelect={loading ? () => {} : handleItemSelect}
//               currentSelection={currentSelectionUid}
//               limitHeight={limitResultHeight}
//               selectionField="uid"
//               autoWidth={autoWidth}
//               customParsers={customParsers}
//             />
//           </div>
//           {loading && (
//             <div
//               className={`sas_loadingWrap ${loading ? '' : 'hidden'}`}
//               style={{ hidden: loading }}
//             >
//               Loading results...
//             </div>
//           )}
//           {!loading && (!results || results.length === 0) && (
//             <div className="sas_resultsList-empty">
//               No results found. Try adjusting the filters above.
//             </div>
//           )}
//           {!loading && error && <div className="sas_resultsList-empty">{error}</div>}

//           {showPreview && (
//             <section className="selectionPreviewWrap">
//               <SelectionPreview
//                 headings={previewHeadings}
//                 currentSelectionData={currentSelection[0] || {}}
//                 customParsers={customParsers}
//               />
//             </section>
//           )}
//         </div>
//       </section>

//       {allowMultiple && (
//         <section className="sas_manageSelectionSection">
//           {!liveUpdate && (
//             <button
//               type="button"
//               className="button-two acceptSelectionBtn"
//               onClick={() => acceptSelection()}
//               disabled={!currentSelection || currentSelection.length === 0}
//             >
//               {acceptSelectionBtnText}
//             </button>
//           )}

//           <button type="button" className="button-one selectAllBtn" onClick={selectAll}>
//             Select All
//           </button>
//           <button
//             type="button"
//             className="button-one clearSelectionButton"
//             onClick={clearSelection}
//           >
//             Clear Selection
//           </button>
//         </section>
//       )}
//     </div>
//   );
// };

// SearchAndSelect.propTypes = {
//   searchFunction: PropTypes.func.isRequired,
//   initialFilters: PropTypes.arrayOf(PropTypes.instanceOf(FilterObjectClass)),
//   availableFilters: PropTypes.objectOf(
//     PropTypes.shape({
//       uid: PropTypes.string.isRequired,
//       label: PropTypes.string.isRequired,
//       type: PropTypes.string.isRequired,
//       value: PropTypes.any,
//     })
//   ).isRequired,
//   handleSelect: PropTypes.func.isRequired,
//   headings: PropTypes.arrayOf(
//     PropTypes.shape({
//       uid: PropTypes.string.isRequired,
//       label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
//     })
//   ).isRequired,
//   previewHeadings: PropTypes.arrayOf(
//     PropTypes.shape({
//       uid: PropTypes.string.isRequired,
//       label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
//     })
//   ),
//   selectionOverride: PropTypes.shape({
//     uid: PropTypes.string.isRequired,
//   }),
//   autoUpdate: PropTypes.bool,
//   // forceUpdate: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
//   allowFilters: PropTypes.bool,
//   allowMultiple: PropTypes.bool,
//   returnFieldOnSelect: PropTypes.string,
//   showSearchField: PropTypes.bool,
//   searchFieldTargetField: PropTypes.string,
//   acceptSelectionBtnText: PropTypes.string,
//   showRefreshBtn: PropTypes.bool,
//   limitResultHeight: PropTypes.bool,
//   sortBy: PropTypes.string,
//   reverseSort: PropTypes.bool,
//   reloadKey: PropTypes.number,
//   loadOnInit: PropTypes.bool,
//   noEmptySearch: PropTypes.bool,
//   liveUpdate: PropTypes.bool,
//   autoWidth: PropTypes.bool,
//   customParsers: PropTypes.objectOf(PropTypes.func),
//   labelField: PropTypes.string,
//   allowSelectionPreview: PropTypes.bool,
//   autoPreview: PropTypes.bool,
// };

// SearchAndSelect.defaultProps = {
//   selectionOverride: null,
//   initialFilters: [],
//   previewHeadings: [],
//   autoUpdate: false,
//   // forceUpdate: false,
//   allowFilters: true,
//   allowMultiple: false,
//   returnFieldOnSelect: 'uid',
//   showSearchField: false,
//   searchFieldTargetField: null,
//   acceptSelectionBtnText: 'Accept Selection',
//   showRefreshBtn: false,
//   limitResultHeight: false,
//   sortBy: 'uid',
//   reverseSort: false,
//   reloadKey: 0,
//   loadOnInit: true,
//   noEmptySearch: false,
//   liveUpdate: false,
//   autoWidth: true,
//   customParsers: {},
//   labelField: 'label',
//   allowSelectionPreview: false,
//   autoPreview: false,
// };

// export default SearchAndSelect;