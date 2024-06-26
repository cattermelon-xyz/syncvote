import {
  getGovernanceProgramVersion,
  getInstructionDataFromBase64,
  getSignatoryRecordAddress,
  ProgramAccount,
  TokenOwnerRecord,
  VoteType,
  withAddSignatory,
  withCreateProposal,
  withInsertTransaction,
  withSignOffProposal,
} from '@solana/spl-governance';
import { Connection, PublicKey, TransactionInstruction } from '@solana/web3.js';
import { chunk } from 'lodash';
import { sendSignAndConfirmTransactions } from '@blockworks-foundation/mangolana/lib/transactions';
import { SequenceType } from '@blockworks-foundation/mangolana/lib/globalTypes';

import * as buffer from 'buffer';
window.Buffer = buffer.Buffer;

export const createBase64Proposal = async (
  connection: Connection,
  wallet: any,
  tokenOwnerRecord: ProgramAccount<TokenOwnerRecord>,
  governance: PublicKey,
  realm: PublicKey,
  governanceProgram: PublicKey,
  proposalMint: PublicKey,
  name: string,
  descriptionLink: string,
  proposalIndex: number,
  base64Instructions: string[]
) => {
  const instructions: TransactionInstruction[] = [];
  const walletPk = wallet.publicKey;
  const governanceAuthority = walletPk;
  const signatory = walletPk;
  const payer = walletPk;

  // Changed this because it is misbehaving on my local validator setup.
  const programVersion = await getGovernanceProgramVersion(
    connection,
    governanceProgram
  );

  // V2 Approve/Deny configuration
  const voteType = VoteType.SINGLE_CHOICE;
  const options = ['Approve'];
  const useDenyOption = true;

  const proposalAddress = await withCreateProposal(
    instructions,
    governanceProgram,
    programVersion,
    realm,
    governance,
    tokenOwnerRecord.pubkey,
    name,
    descriptionLink,
    proposalMint,
    governanceAuthority,
    proposalIndex,
    voteType,
    options,
    useDenyOption,
    payer
  );

  await withAddSignatory(
    instructions,
    governanceProgram,
    programVersion,
    proposalAddress,
    tokenOwnerRecord.pubkey,
    governanceAuthority,
    signatory,
    payer
  );

  const signatoryRecordAddress = await getSignatoryRecordAddress(
    governanceProgram,
    proposalAddress,
    signatory
  );

  const insertInstructions: TransactionInstruction[] = [];
  for (const i in base64Instructions) {
    const instruction = getInstructionDataFromBase64(base64Instructions[i]);
    await withInsertTransaction(
      insertInstructions,
      governanceProgram,
      programVersion,
      governance,
      proposalAddress,
      tokenOwnerRecord.pubkey,
      governanceAuthority,
      Number(i),
      0,
      0,
      [instruction],
      payer
    );
  }
  withSignOffProposal(
    insertInstructions, // SingOff proposal needs to be executed after inserting instructions hence we add it to insertInstructions
    governanceProgram,
    programVersion,
    realm,
    governance,
    proposalAddress,
    signatory,
    signatoryRecordAddress,
    undefined
  );

  const txChunks = chunk([...instructions, ...insertInstructions], 2);

  await sendSignAndConfirmTransactions({
    connection,
    wallet,
    transactionInstructions: txChunks.map((txChunk) => ({
      instructionsSet: txChunk.map((tx) => ({
        signers: [],
        transactionInstruction: tx,
      })),
      sequenceType: SequenceType.Sequential,
    })),
  });
  return proposalAddress;
};
