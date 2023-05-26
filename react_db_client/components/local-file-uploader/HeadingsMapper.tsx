import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Uid } from '@react_db_client/constants.client-types';
import cloneDeep from 'lodash/cloneDeep';
import { MappedHeadingsList } from './styles';

export interface IHeading {
  uid: Uid;
  label: string;
}

export interface IHeadingsMapperProps {
  headings: (string | number)[];
  mapToHeadings: IHeading[];
  handleAccept: (acceptedHeadings: (string | number)[]) => void;
  errorCallback: (e: Error) => void;
}

const HeadingsMapper: React.FC<IHeadingsMapperProps> = ({
  headings,
  mapToHeadings,
  handleAccept: handleAcceptReturn,
  errorCallback,
}) => {
  // check if any headings already match
  const initialMappings = headings.reduce((p, c) => {
    const r = { ...p };
    if (mapToHeadings.map((h) => h.uid).indexOf(c) !== -1) r[c] = c;
    return r;
  }, {} as { [uid: Uid]: string | number });
  const [mappedHeadingsInput, setMappedHeadingsInput] = useState(initialMappings);

  const mapToHeadingsSelect = () =>
    mapToHeadings
      .map((h) => <option value={h.uid}>{h.label}</option>)
      .concat(<option value="">NA</option>);

  const handleChange = (source, target) => {
    const newMappedHeadingsInput = cloneDeep(mappedHeadingsInput);
    newMappedHeadingsInput[source] = target;
    setMappedHeadingsInput(newMappedHeadingsInput);
  };

  const handleAccept = () => {
    // TODO: Check no duplicates
    const vals = Object.values(mappedHeadingsInput).filter((v) => v);
    const uniqueVals = new Set(vals);
    if (vals.length !== uniqueVals.size) {
      errorCallback(new Error('Mappings must be unique'));
      return;
    }
    const acceptedHeadings = headings.map((h) => mappedHeadingsInput[h] || h);
    handleAcceptReturn(acceptedHeadings);
  };
  const mappedHeadings = headings.map((h) => (
    <li key={h} className="headingsMapper_heading">
      <label htmlFor={`headingSelect_${h}`}>{h}</label>
      <select
        id={`headingSelect_${h}`}
        value={mappedHeadingsInput[h] || ''}
        onChange={(e) => handleChange(h, e.target.value)}
      >
        {mapToHeadingsSelect()}
      </select>
    </li>
  ));

  return (
    <div className="headingsMapper" data-testid="lfu-headingsMapper">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAccept();
        }}
      >
        <MappedHeadingsList>{mappedHeadings}</MappedHeadingsList>
        <button type="button" className="button-two headingsAcceptButton" onClick={handleAccept}>
          Accept Headings Mapping
        </button>
      </form>
    </div>
  );
};

HeadingsMapper.propTypes = {
  headings: PropTypes.arrayOf(PropTypes.string).isRequired,
  // @ts-ignore
  mapToHeadings: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      label: PropTypes.string,
    })
  ).isRequired,
  handleAccept: PropTypes.func.isRequired,
  errorCallback: PropTypes.func,
};

HeadingsMapper.defaultProps = {
  errorCallback: alert,
};

export default HeadingsMapper;
