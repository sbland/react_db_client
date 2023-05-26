import PropTypes from 'prop-types';
import React, { useState, useMemo } from 'react';
import { DataTableSimple } from '@react_db_client/components.datatable-legacy';
import { EFilterType, Uid } from '@react_db_client/constants.client-types';
import CSVReader from 'react-csv-reader';
import HeadingsMapper, { IHeading } from './HeadingsMapper';

export interface IHeadingEditorProps {
  headings: (string | number)[];
  acceptHeadings: (newHeadings: (string | number)[]) => void;
}

const HeadingEditor: React.FC<IHeadingEditorProps> = ({ headings: headingsIn, acceptHeadings }) => {
  const [headings, setHeadings] = useState(headingsIn);
  const updateHeadings = (i, t) => {
    const headingsEdited = [...headings];
    headingsEdited[i] = t;
    setHeadings(headingsEdited);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        acceptHeadings(headings);
      }}
      className="localFileUploader_headingForm"
    >
      {headings &&
        headings.map((h, i) => (
          <input type="text" value={h} onChange={(e) => updateHeadings(i, e.target.value)} />
        ))}
      <button type="submit" className="button-one">
        Update Headings
      </button>
    </form>
  );
};

HeadingEditor.propTypes = {
  headings: PropTypes.arrayOf(PropTypes.string).isRequired,
  acceptHeadings: PropTypes.func.isRequired,
};

const getHeadingsFromRawData = (data: any[][], headings: null | (string | number)[]) => {
  const columnCount = Math.max(...data.map((row) => row.length));
  const headingsNew = Array.from({ length: columnCount }, (_, i) =>
    headings ? headings[i] || i : i
  );
  return headingsNew;
};

export interface ILocalFileUploaderProps {
  label: string;
  onAccept: (newData: unknown[]) => void;
  onChange: (dataUpdated: unknown[]) => void;
  mapToHeadings: IHeading[];
  showAcceptButton?: boolean;
}

/**
 * A local file uploader that allows loading csv files and assigning headers.
 *
 */
export const LocalFileUploader: React.FC<ILocalFileUploaderProps> = ({
  label,
  onAccept,
  onChange,
  mapToHeadings,
  showAcceptButton,
}) => {
  const [hasHeader, setHasHeader] = useState(false);
  const [skipRows, setSkipRows] = useState(0);
  const [rawData, setRawData] = useState<unknown[][]>();

  const [headingsCustom, setHeadingsCustom] = useState<null | (string | number)[]>();
  // eslint-disable-next-line no-unused-vars
  const [, setFileInfo] = useState(null);
  const [error, setError] = useState<null | Error>();

  const dataCropped = useMemo(() => {
    return rawData ? rawData.slice(skipRows) : [];
  }, [rawData, skipRows]);

  const dataSliced = useMemo(() => {
    return hasHeader ? dataCropped.slice(1) : dataCropped;
  }, [hasHeader, dataCropped]);

  const rawHeadings = useMemo(() => {
    const headingsIn = hasHeader ? (dataCropped[0] as string[]) : null;
    return dataCropped ? getHeadingsFromRawData(dataCropped, headingsIn) : [];
  }, [dataCropped, hasHeader]);

  const headings = useMemo(() => {
    const headingsIn = headingsCustom || rawHeadings;
    return dataCropped ? getHeadingsFromRawData(dataCropped, headingsIn) : [];
  }, [dataCropped, headingsCustom, rawHeadings]);

  const dataDict = useMemo(() => {
    const dataUpdated = dataSliced.map((row, i) =>
      row.reduce((d: { [uid: Uid]: any }, c, j) => {
        const nd: { [uid: Uid]: any } = { ...d, uid: i };
        const heading = j < headings.length ? headings[j] : j;
        if (c !== null) nd[heading] = c;
        return nd;
      }, {})
    );
    if (onChange) onChange(dataUpdated);
    return dataUpdated;
  }, [dataSliced, headings, onChange]);

  const setHeadings = setHeadingsCustom;

  const handleHasHeaderCheckChange = () => {
    setHasHeader((prev) => !prev);
    setHeadingsCustom(null);
  };

  const handleUpdateSkipRowCount = (val) => {
    setSkipRows(val);
    setHeadingsCustom(null);
  };

  const handleFileUploaded = (dataNew, fileInfoNew) => {
    setRawData(dataNew);
    setFileInfo(fileInfoNew);
    setError(null);
    setHeadingsCustom(null);
  };

  const parserOptions = {
    header: false, // manually resolve this
    dynamicTyping: true,
    skipEmptyLines: false,
    transformHeader: (h) => h.toLowerCase().replace(/\W/g, '_'),
  };

  return (
    <div className="localFileUploader sectionWrapper">
      <section className="localFileUploader_selectFileSection">
        <h2>1. Select File</h2>
        <div>
          <label htmlFor="lfu-fileHasHeaderCheckbox">File has a header?</label>
          <input
            id="lfu-fileHasHeaderCheckbox"
            className="headerCheckbox"
            type="checkbox"
            onChange={() => handleHasHeaderCheckChange()}
            checked={hasHeader || false}
          />
        </div>
        <div>
          <label>Skip Rows: </label>
          <input
            type="number"
            name="skipRowsInput"
            className="skipRowsInput"
            onChange={(e) => handleUpdateSkipRowCount(e.target.value)}
            value={skipRows}
          />
        </div>
        <CSVReader
          label={label}
          parserOptions={parserOptions}
          onError={setError}
          onFileLoaded={handleFileUploaded}
        />
        <div>{error && JSON.stringify(error)}</div>
      </section>
      {/* If not mapping to headings allow renaming */}
      {rawHeadings && rawHeadings.length > 0 && !mapToHeadings && (
        <section className="localFileUploader_headingEditor">
          <h2>Edit Headings</h2>
          <HeadingEditor
            key={rawHeadings.join(',')}
            headings={rawHeadings}
            acceptHeadings={setHeadings}
          />
        </section>
      )}
      {rawHeadings && rawHeadings.length > 0 && mapToHeadings && (
        <section className="localFileUploader_headingMapper">
          <h2>Map Headings</h2>
          <HeadingsMapper
            key={rawHeadings.join(',')}
            headings={rawHeadings}
            mapToHeadings={mapToHeadings}
            handleAccept={setHeadings}
            errorCallback={setError}
          />
        </section>
      )}

      {/* TODO: Allow editing data before accepting */}
      {/* {headings && dataDict && (
        <DataTable
          headingsData={headings.map((h) => ({ uid: h, label: h, type: filterTypes.text }))}
          // tableData={{}}
          tableData={dataDict.map((d, i) => ({ ...d, uid: i }))}
          handleSaveData={(newData) => setData(
            arrObjsToMatrix(objToArray(newData)),
          )}
        />
      )} */}
      {headings && dataDict && headings.length > 0 && (
        <section className="localFileUploader_previewDataSection">
          <h2>Preview Data</h2>
          <DataTableSimple
            key={headings.join(',')}
            id="previewDataTable"
            headingsData={headings.map((h) => ({
              uid: h,
              label: String(mapToHeadings?.find((mh) => mh.uid === h)?.label || h),
              type: EFilterType.text,
            }))}
            tableData={dataDict as any}
            tableHeight={300}
            config={{}}
            showTotals={false}
          />
        </section>
      )}

      {/* {dataDict && JSON.stringify(dataDict)} */}
      {showAcceptButton && (
        <section className="localFileUploader_acceptButtonsSection">
          <button
            type="button"
            className="button-two"
            disabled={!rawData}
            onClick={() => onAccept(dataDict)}
          >
            Accept File
          </button>
        </section>
      )}
    </div>
  );
};

LocalFileUploader.propTypes = {
  label: PropTypes.string.isRequired,
  onAccept: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  //  @ts-ignore
  mapToHeadings: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      label: PropTypes.string,
    })
  ),
  showAcceptButton: PropTypes.bool,
};

LocalFileUploader.defaultProps = {
  onChange: () => {},
  mapToHeadings: [],
  showAcceptButton: false,
};

export default LocalFileUploader;
