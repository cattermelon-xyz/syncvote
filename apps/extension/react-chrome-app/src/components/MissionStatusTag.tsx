import { Tag } from 'antd';
// TODO: https://github.com/orgs/hectagon-finance/projects/2/views/1?pane=issue&itemId=50799761
// "Success" if proposal.status === 'STOPPED' && last checkpoint in happy path
// "Fail" if proposal.status === 'STOPPED' && last checkpoint NOT in happy path
// "Waiting for your action" if last checkpoint.participation.data[0] === user.email
// "Waiting for admin action" if last checkpoint.participation.data[0] !== user.email
// "Waiting fo community" if last checkpoint.participation.data[0] === null
export const MissionStatusTag = ({
  mission,
  user,
  className,
}: {
  mission: any;
  user: any;
  className?: string;
}) => {
  let tagClass = 'bg-gray-200';
  let color = 'default';
  let text = 'Draft';
  switch (mission.status) {
    case 'STOPPED':
      if (mission.checkpoint_inHappyPath) {
        color = 'success';
        text = 'Success';
      } else {
        color = 'failed';
        text = 'Fail';
      }
      break;
    case 'PUBLIC':
      color = 'inprogress';
      let participation;
      try {
        participation = JSON.parse(mission.checkpoint_participation);
      } catch (e) {}
      if (!participation) {
        text = 'Waiting for community';
      } else {
        switch (participation.type) {
          case 'identity':
            if (!participation.data) {
              text = 'Waiting for community';
            } else {
              if ((participation.data || []).length === 0) {
                text = 'Waiting for community';
              } else {
                if ((participation.data || []).indexOf(user.email) !== -1) {
                  text = 'Waiting for your action';
                } else {
                  text = 'Waiting for admin action';
                }
              }
            }
            break;
          default:
            text = 'Waiting for community';
            break;
        }
      }
      break;
  }
  switch (color) {
    case 'default':
      tagClass = 'border-0 ';
      break;
    case 'success':
      tagClass = 'text-[#1D713E] bg-[#EAF6EE] border-0 ';
      break;
    case 'success-border':
      tagClass = 'text-[#1D713E] bg-[#EAF6EE] border-[#1D713E] border-1 ';
      break;
    case 'failed':
      tagClass = 'text-[#A22C29] bg-[#F6EAEA] border-0 ';
      break;
    case 'inprogress':
      tagClass = 'text-[#D89531] bg-[#FBF4EA] border-0 ';
      break;
  }
  tagClass += ' rounded-xl ' + className ? className : '';
  return <Tag className={tagClass}>{text}</Tag>;
};
