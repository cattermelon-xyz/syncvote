import React from 'react';
import { useDispatch } from 'react-redux';
import { startLoading, finishLoading } from '@redux/reducers/ui.reducer';
import { supabase } from '@utils/supabaseClient';

export const useFetchData = () => {
  const [workflows, setWorkflows] = React.useState<any[]>([]);
  const dispatch = useDispatch();

  React.useEffect(() => {
    const fetchDataWorkflow = async () => {
      dispatch(startLoading({}));
      const { data, error } = await supabase.from('workflow').select(`*,
             versions: workflow_version(id, status),
             infoOrg: org(title)
             `);

      dispatch(finishLoading({}));
      if (data) {
        const workflowData = data.filter(
          (worfklow) => worfklow?.versions[0]?.status === 'PUBLIC_COMMUNITY'
        );
        setWorkflows(workflowData);
      }
    };

    fetchDataWorkflow();
  }, []);

  return {
    workflows,
  };
};
