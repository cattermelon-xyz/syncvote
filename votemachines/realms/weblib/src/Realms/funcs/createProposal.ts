import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { createBase64Proposal } from '../helpers/createBase64Proposal';
import {
  getAllProposals,
  getTokenOwnerRecord,
  getTokenOwnerRecordAddress,
} from '@solana/spl-governance';
import { EndpointTypes } from '../constants/index';

const ENDPOINT_URL = 'https://api.devnet.solana.com';

const CLUSTER = 'devnet';

import * as buffer from 'buffer';
window.Buffer = buffer.Buffer;

export const createProposal = async (
  title: string,
  description: string,
  realms: String,
  wallet: any,
  governance_program: string,
  proposal_mint: string,
  governance_address: string
) => {
  //Load wallet from file system assuming its in default direction /Users/-USERNAME-/.config/solana/id.json

  const REALM = new PublicKey(realms);
  const GOVERNANCE_PROGRAM = new PublicKey(governance_program);
  const PROPOSAL_MINT = new PublicKey(proposal_mint);
  const governancePk = new PublicKey(governance_address);
  class GovernanceCli {
    private connectionContext = {
      cluster: CLUSTER as EndpointTypes,
      current: new Connection(ENDPOINT_URL, 'recent'),
      endpoint: ENDPOINT_URL,
    };
    wallet: any;
    constructor(wallet: any) {
      this.wallet = wallet;
      this.connectionContext.cluster = 'devnet';
    }

    async createProposal() {
      const delegatedWallet = '';
      const instructions: string[] = [];

      let tokenOwnerRecordPk: PublicKey | null = null;
      if (delegatedWallet) {
        tokenOwnerRecordPk = await getTokenOwnerRecordAddress(
          GOVERNANCE_PROGRAM,
          REALM,
          PROPOSAL_MINT,
          new PublicKey(delegatedWallet)
        );
      } else {
        tokenOwnerRecordPk = await getTokenOwnerRecordAddress(
          GOVERNANCE_PROGRAM,
          REALM,
          PROPOSAL_MINT,
          this.wallet.publicKey!
        );
      }
      const [tokenOwnerRecord, proposals] = await Promise.all([
        getTokenOwnerRecord(this.connectionContext.current, tokenOwnerRecordPk),
        getAllProposals(
          this.connectionContext.current,
          GOVERNANCE_PROGRAM,
          REALM
        ),
      ]);
      const proposalIndex = proposals.flatMap((x) => x).length;

      try {
        const address = await createBase64Proposal(
          this.connectionContext.current,
          this.wallet,
          tokenOwnerRecord,
          new PublicKey(governancePk),
          REALM,
          GOVERNANCE_PROGRAM,
          PROPOSAL_MINT,
          title,
          description,
          proposalIndex,
          [...instructions]
        );
        console.log(
          `Success proposal created url: https://realms.today/dao/${REALM.toBase58()}/proposal/${address.toBase58()}`
        );

        return { address: address.toBase58() };
      } catch (e) {
        console.log('ERROR: ', e);
        return { error: e };
      }
    }
  }
  const cli = new GovernanceCli(wallet);
  return await cli.createProposal();
};
