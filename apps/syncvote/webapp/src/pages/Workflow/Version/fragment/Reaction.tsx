import { useEffect, useState } from 'react';
import {
  getDataReactionCount,
  insertReaction,
  deleteReaction,
  getDataReactionByUser,
} from '@dal/data/reaction';
import {
  NotificationInstance,
  NotificationPlacement,
} from 'antd/es/notification/interface';
import parse from 'html-react-parser';
import './ReactionBox.css';
import { Button } from 'antd';
const ReactionBox = ({
  where,
  by_who,
  dispatch,
  api,
}: {
  where: any;
  by_who: any;
  dispatch: any;
  api: NotificationInstance;
}) => {
  const [dataReaction, setDataReaction] = useState<any[]>([]);
  const [selectedReactions, setSelectedReactions] = useState<string[]>([]);
  const fetchData = async () => {
    const data = await getDataReactionCount({ where, dispatch });
    setDataReaction(data);
  };
  const setBeginReaction = async () => {
    const reaction_by_user = await getDataReactionByUser({
      who: by_who,
      where: where,
      dispatch: dispatch,
    });

    if (reaction_by_user.length !== 0) {
      for (const element of reaction_by_user) {
        setSelectedReactions((prevSelectedReactions) => [
          ...prevSelectedReactions,
          element.reaction_type,
        ]);
      }
    }
  };

  useEffect(() => {
    fetchData();

    if (by_who !== undefined) {
      setBeginReaction();
    }
  }, []);

  const handleReactionClick = async (reactionId: string) => {
    if (by_who !== undefined) {
      const reaction = {
        by_who: by_who,
        reaction_type: parseInt(reactionId),
        where: where,
      };

      if (selectedReactions.includes(reactionId)) {
        await deleteReaction(reaction, dispatch);
        setSelectedReactions((prevSelectedReactions) =>
          prevSelectedReactions.filter((id) => id !== reactionId)
        );
        updateDataReaction(reactionId, -1);
      } else {
        await insertReaction(reaction, dispatch);
        setSelectedReactions((prevSelectedReactions) => [
          ...prevSelectedReactions,
          reactionId,
        ]);
        updateDataReaction(reactionId, 1);
      }
    } else {
      openNotification('top', 'Need login to reaction');
    }
  };

  const updateDataReaction = (reactionId: string, count: number) => {
    setDataReaction((prevDataReaction) =>
      prevDataReaction.map((reaction) => {
        if (reaction.id === reactionId) {
          const updatedCount = reaction.reaction[0]?.count
            ? reaction.reaction[0].count + count
            : count > 0
            ? 1
            : 0;
          return {
            ...reaction,
            reaction: [
              {
                ...reaction.reaction[0],
                count: updatedCount,
              },
            ],
          };
        }
        return reaction;
      })
    );
  };

  const openNotification = (
    placement: NotificationPlacement,
    content: String
  ) => {
    api.info({
      message: `Notification`,
      description: content,
      placement,
    });
  };

  return (
    <div
      className='m-1.5 cursor-pointer rounded-3xl'
      style={{
        border: '1px solid var(--foundation-grey-g-3, #E3E3E2)',
      }}
    >
      <div className='p-4 flex'>
        {dataReaction.map((reaction: any) => (
          <Button
            style={{
              borderRadius: '8px',
            }}
            key={reaction.id}
            className={`w-12 mr-3 flex items-center justify-center reaction ${
              selectedReactions.includes(reaction.id) ? 'selected' : ''
            }`}
            onClick={() => handleReactionClick(reaction.id)}
          >
            <div className='mr-1'>{parse(reaction?.icon)}</div>
            <div></div>
            {reaction?.reaction[0]?.count}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ReactionBox;
