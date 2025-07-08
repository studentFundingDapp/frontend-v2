/*
import Server, { Keypair, Networks, TransactionBuilder, Operation, Asset } from "stellar-sdk";
const HORIZON_URL = "https://horizon-testnet.stellar.org";
const NETWORK_PASSPHRASE = Networks.TESTNET;
const server = new Server(HORIZON_URL);

export const createAccount = () => {
  const pair = Keypair.random();
  return {
    publicKey: pair.publicKey(),
    secret: pair.secret(),
  };
};

export const checkBalance = async (publicKey: string) => {
  const account = await server.loadAccount(publicKey);
  return account.balances;
};

export const sendPayment = async (
  senderSecret: string,
  destination: string,
  amount: string
) => {
  const senderKeypair = Keypair.fromSecret(senderSecret);
  const senderAccount = await server.loadAccount(senderKeypair.publicKey());

  const tx = new TransactionBuilder(senderAccount, {
    fee: await server.fetchBaseFee(),
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      Operation.payment({
        destination,
        asset: Asset.native(),
        amount,
      })
    )
    .setTimeout(30)
    .build();

  tx.sign(senderKeypair);
  return server.submitTransaction(tx);
};
*/