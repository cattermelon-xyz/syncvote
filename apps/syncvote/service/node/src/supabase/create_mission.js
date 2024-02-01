const { supabase } = require('../configs/supabaseClient');

const createMission = async () => {
  const { data: workflowVersion, error } = await supabase
    .from('workflow_version')
    .select('*')
    .eq('id', 319);

  const workflowVersionData = workflowVersion[0].data;

  const missionData = {
    creator_id: '8ce1c0ae-77f8-4f58-9cfd-8d863971e4c6',
    status: 'PUBLIC',
    title: 'Test create mission last time',
    data: workflowVersionData,
    start: workflowVersionData.start,
    workflow_version_id: workflowVersion[0].id,
    desc: 'This is test mission',
  };

  const res = await supabase.functions.invoke('create-mission', {
    body: missionData,
  });

  console.log(res);
};

createMission();

// (((status)::text = 'PUBLISHED'::text) OR ((status)::text = 'PUBLIC_COMMUNITY'::text) OR ((auth.uid() IN ( SELECT user_org.user_id
//   FROM user_org
//  WHERE (user_org.org_id IN ( SELECT workflow.owner_org_id
//           FROM workflow
//          WHERE (workflow.id = workflow_version.workflow_id))))) OR (auth.uid() IN ( SELECT workflow_version_editor.user_id
//   FROM workflow_version_editor
//  WHERE (workflow_version_editor.workflow_version_id = workflow_version.id)))))
