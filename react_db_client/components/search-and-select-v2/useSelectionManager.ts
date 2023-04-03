/* eslint-disable import/prefer-default-export */
import { IDocument, Uid } from '@react_db_client/constants.client-types';
import { useCallback, useEffect, useState } from 'react';

export interface IUseSelectionManagerArgs<ResultType extends IDocument> {
  results?: ResultType[];
  returnFieldOnSelect?: string;
  allowMultiple?: boolean;
  selectionOverride?: ResultType[];
  handleSelect: (data: null | ResultType) => void | ((data: null | ResultType[]) => void);
  liveUpdate?: boolean;
  labelField: string;
}

export interface IUseSelectionManagerReturn<ResultType extends IDocument> {
  handleItemSelect: (data: any, idField: string) => void;
  currentSelection: ResultType[];
  currentSelectionUid: Uid[];
  currentSelectionLabels: string[];
  selectAll: () => void;
  clearSelection: () => void;
  acceptSelection: () => void;
}

export const useSelectionManager = <ResultType extends IDocument>({
  results = [],
  returnFieldOnSelect = 'uid',
  allowMultiple,
  selectionOverride,
  handleSelect,
  liveUpdate,
  labelField = 'label',
}: IUseSelectionManagerArgs<ResultType>): IUseSelectionManagerReturn<ResultType> => {
  const [currentSelection, setCurrentSelection] = useState(selectionOverride || []);
  const [selectionChanged, setSelectionChanged] = useState(false);

  const acceptSelection = useCallback(() => {
    if (allowMultiple) {
      setSelectionChanged(false);
      // TODO: How do we handle different types of handle select
      (handleSelect as any)(
        // currentSelection.map((item) => item[returnFieldOnSelect] as TReturnField),
        currentSelection
      );
    }
  }, [allowMultiple, currentSelection, handleSelect]);

  useEffect(() => {
    // TODO: This is a hack to make sure current selection is set to data loaded from api
    // TODO: An alternate approach would be to load additional data from api each time selection changes
    if (
      allowMultiple &&
      selectionOverride &&
      currentSelection !== selectionOverride &&
      typeof selectionOverride[0] === 'object'
    ) {
      if (Array.isArray(selectionOverride) || !allowMultiple) {
        setCurrentSelection(selectionOverride);
      } else {
        setCurrentSelection([selectionOverride]);
      }
    }
  }, [currentSelection, selectionOverride, allowMultiple]);

  // if live update is true and we change the selection we need to call the handle select function
  useEffect(() => {
    if (allowMultiple && liveUpdate && results && selectionChanged) {
      acceptSelection();
    }
  }, [
    acceptSelection,
    allowMultiple,
    liveUpdate,
    results,
    handleSelect,
    returnFieldOnSelect,
    selectionChanged,
  ]);

  const handleItemSelect = (data: any, idField: string) => {
    const uid = data[idField];
    const selectedItemData =
      (results && results.find((r) => r[idField] === uid)) ||
      currentSelection.find((item) => item[idField] === uid);
    if (!selectedItemData) {
      console.info(idField, uid);
      console.log(currentSelection);
      console.log(results);
      throw Error(`Invalid Selection ${uid}`);
    }

    if (allowMultiple) {
      if (!Array.isArray(currentSelection)) {
        setCurrentSelection([selectedItemData]);
        return;
      }

      const indexInSelection = currentSelection.findIndex((item) => item[idField] === uid);
      if (indexInSelection >= 0) {
        //  remove from selection
        setCurrentSelection((prev) => {
          const currentSelectionNew = prev.filter((i) => i[idField] !== uid);
          return currentSelectionNew;
        });
      } else {
        // add to collection
        setCurrentSelection((prev) => {
          const currentSelectionNew = [...prev, selectedItemData];
          return currentSelectionNew;
        });
      }
    } else {
      // When selecting single selection return the requested field
      // const fieldValue: TReturnField = selectedItemData[returnFieldOnSelect];
      setCurrentSelection([selectedItemData]);
      (handleSelect as (r: ResultType) => void)(selectedItemData);
      // handleSelect(fieldValue, selectedItemData);
    }
    setSelectionChanged(true);
  };

  const selectAll = () => {
    setCurrentSelection(results);
    (handleSelect as unknown as (data: null | ResultType[]) => void)(results as ResultType[]);
  };

  const clearSelection = () => {
    setCurrentSelection([]);
    setSelectionChanged(true);
    if (liveUpdate) (handleSelect as any)(allowMultiple ? [] : null);
  };
  const currentSelectionLabels: string[] =
    currentSelection && currentSelection.map((item) => item[labelField]);

  return {
    handleItemSelect,
    currentSelection,
    currentSelectionUid: currentSelection && currentSelection.map((item) => item.uid),
    currentSelectionLabels,
    selectAll,
    clearSelection,
    acceptSelection,
  };
};
