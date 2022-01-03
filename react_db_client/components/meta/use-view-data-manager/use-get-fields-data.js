import { useEffect, useMemo } from 'react';

import { FilterObjectSimpleClass } from '@samnbuk/react_db_client.constants.client-types';
import { useAsyncRequest } from '@samnbuk/react_db_client.async-hooks.use-async-request';

export const getFieldsListFromTemplate = (templateData) => {
  const { main = {}, sidebar = {} } = templateData;
  const mainFields = Object.values(main).reduce((acc, section) => [...acc, ...section.fields], []);
  const sidebarFields = Object.values(sidebar).reduce(
    (acc, section) => [...acc, ...section.fields],
    []
  );
  return [...mainFields, ...sidebarFields].filter((value, index, self) => {
    return self.indexOf(value) === index;
  });
};

export const useGetFieldsData = ({ templateData, asyncGetDocuments }) => {
  const fieldsList = useMemo(() => getFieldsListFromTemplate(templateData), [templateData]);
  const {
    response: fieldsDataList,
    call: loadFieldsData,
    loading,
    hasLoaded,
  } = useAsyncRequest({
    callOnInit: false,
    callFn: async (f) => asyncGetDocuments('fields', f, 'all'),
  });

  useEffect(() => {
    // TODO: Store cache here
    if (!loading && fieldsList && fieldsList.length > 0) {
      const filters = [new FilterObjectSimpleClass('_id', fieldsList, 'fieldIdFilter')];
      loadFieldsData([filters]);
    }
  }, [fieldsList]);

  const fieldsData = hasLoaded
    ? fieldsDataList.reduce((acc, field) => ({ ...acc, [field._id]: field }), {})
    : {};

  return {
    fieldsData,
    hasLoaded,
    loading,
  };
};
