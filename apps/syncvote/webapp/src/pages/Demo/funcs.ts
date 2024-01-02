import { useState, useEffect } from 'react';

export function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState<any>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect runs only on mount and unmount

  return windowSize;
}

export const snapshotDesc = `Hello DAO members,

How's everyone doing?

If you're reading this proposal, it means that our team has successfully generated a Snapshot proposal through Syncvote. This marks a step in our ongoing efforts to enhance DAOs' autonomy through integrations on Syncvote.

DAOs which have already created governance workflows on Syncvote can now adopt this new automation feature. When it comes to the Snapshot (off-chain voting) stage of the governance process, proposal author only needs to:

<ul>
<li> Open our plugin</li>
<li> Click on one button</li>
<li> Draft the proposal</li>
<li> And the proposal will be automatically generated on Snapshot</li>
</ul>

In the near future, we will broaden our integrations with widely-used DAO apps and tools such as Discourse, Tally, Realms…

It will bring Syncvote one step closer to becoming a top-of-mind unified app to enforce DAO governance process.

To gain a better understanding of the context, please refer to this proposal:

[HIP14 - Proposal to utilize treasury for developing Syncvote](https://snapshot.org/#/hectagon.eth/proposal/0xadde5daee982803db92ba838ba3fefe5bc6b935baf44aef9643f010be5bbc7f3).

Thanks for reading.`;

export const body = snapshotDesc;
