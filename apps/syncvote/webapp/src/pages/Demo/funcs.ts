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

export const snapshotDesc = '<h4>IDLE transfer to Leagues</h4><p>&nbsp;</p><p>Authors&nbsp;</p><p>Treasury League and Development League &nbsp;</p><p>&nbsp;</p><p>Summary&nbsp;</p><p>The IIP transfers IDLE to the Treasury League multisig as part of the activities behind the launch of the IDLE 80-20 pool on Balancer. &nbsp;</p><p>&nbsp;</p><p>References&nbsp;</p><ul><li><a href="https://react-icons.github.io/react-icons/">AMM Liquidity Improvements</a> post&nbsp;<br>&nbsp;</li></ul><p>Rationale&nbsp;<br>At the beginning of July, <a href="https://react-icons.github.io/react-icons/">@Davide</a> published an analysis focusing on multiple improvements to IDLE tokenomics and related DEX activities. One of the proposals was the launch of an 80-20 pool on Balancer &nbsp;<br><br><a href="https://react-icons.github.io/react-icons/">AMM Liquidity Improvements&nbsp;</a></p><ol><li>Launch an 80-20 Balancer pool<br>Idle DAO was one of the early adopters of the <a href="https://react-icons.github.io/react-icons/">Smart Treasury,</a> a 90% IDLE - 10% WETH pool based on Balancer v1. With the release of Balancer v2, Idle DAO <a href="https://react-icons.github.io/react-icons/">discussed</a> its composable nature for interest-bearing tokens and decided to launch the Idle Boosted Pool at the beginning of this year. […]&nbsp;<br>The launch of an 80-20 IDLE/stablecoin pool would help foster volumes even without direct trades, as the use of a stablecoin pair would provide an alternative venue for arbitrage opportunity (with ETH price changes).&nbsp;<br>The target stablecoin can be chosen according to the following criteria:&nbsp;<br>- single-side assets like USDC or DAI;&nbsp;<br>- 3pool (DAI/USDC/USDT), which is almost unused on Balancer;&nbsp;<br>- Balancer Boosted Aave V3 USD (bb-a-usd), which benefits from boosted APR (2-5%) but increases swap costs;&nbsp;<br></li></ol>'