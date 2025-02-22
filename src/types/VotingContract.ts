import { BaseContract, ContractTransactionResponse } from "ethers";

export interface VotingContract extends BaseContract {
  getVote(language: string): Promise<number>;
  vote(language: string): Promise<ContractTransactionResponse>;
}
