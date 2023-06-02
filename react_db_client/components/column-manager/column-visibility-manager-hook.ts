/* A react hook to manage visability of columns in a dataset
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Uid } from '@react_db_client/constants.client-types';

export type HeadingObject = {
  uid: Uid;
  label?: string;
  columnWidth?: number;
  hidden?: boolean;
};

const getVisableColumns = (headingsDataList: HeadingObject[]) =>
  headingsDataList.filter((d) => !d.hidden);

const getHiddenColumnIds = (headingsDataList: HeadingObject[]) =>
  headingsDataList.filter((d) => d.hidden).map((d) => d.uid);

export const useColumnVisabilityManager = (headingsDataList: HeadingObject[]) => {
  const [columnVisibilityState, setColumnVisibilityState] = React.useState(() => headingsDataList);
  const visableColumns = React.useMemo(
    () => getVisableColumns(columnVisibilityState),
    [columnVisibilityState]
  );
  const hiddenColumnIds = React.useMemo(
    () => getHiddenColumnIds(columnVisibilityState),
    [columnVisibilityState]
  );

  React.useEffect(() => {
    setColumnVisibilityState((prev) =>
      headingsDataList.map((d) => {
        const p = prev.find((p) => p.uid === d.uid);
        const hidden = p !== undefined ? p.hidden : d.hidden;

        // if(hidden === undefined) {
        //   console.info("Hidden is undefined", prev, d, p)
        // }
        return { ...d, hidden };
      })
    );
  }, [headingsDataList]);

  // console.info('useColumnVisabilityManager', { columnVisibilityState })
  const handleHideColumn = (columnId: string) => {
    setColumnVisibilityState((prev) =>
      prev.map((d) => (d.uid === columnId ? { ...d, hidden: !d.hidden } : d))
    );
  };

  return {
    handleHideColumn,
    visableColumns,
    hiddenColumnIds,
  };
};

useColumnVisabilityManager.propTypes = {
  headingsDataList: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      hidden: PropTypes.bool,
    })
  ).isRequired,
};
