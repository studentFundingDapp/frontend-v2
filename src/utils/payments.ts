// Payment Transaction Builder
import { TransactionBuilder, Operation, Asset } from '@stellar/stellar-sdk';
import { server, networkPassphrase, getAccountInfo } from './stellar';

export interface PaymentParams {
  fromPublicKey: string;
  toPublicKey: string;
  amount: string;
  memo?: string;
}

export const createPaymentTransaction = async (params: PaymentParams) => {
  try {
    // Load sender account
    const senderAccount = await getAccountInfo(params.fromPublicKey);
    
    // Build transaction
    const transaction = new TransactionBuilder(senderAccount, {
      fee: '100000', // 0.01 XLM fee
      networkPassphrase,
    })
      .addOperation(
        Operation.payment({
          destination: params.toPublicKey,
          asset: Asset.native(), // XLM
          amount: params.amount,
        })
      )
      .setTimeout(30) // 30 seconds timeout
      .build();

  
    return transaction.toXDR();
  } catch (error) {
    console.error('Error creating payment transaction:', error);
    throw error;
  }
};

export const submitPaymentWithFreighter = async (params: PaymentParams) => {
  try {
    // Create transaction XDR
    const transactionXDR = await createPaymentTransaction(params);
    
    // Sign with Freighter
    const signedTransaction = await window.freighter.signTransaction(
      transactionXDR,
      networkPassphrase
    );
    
    // Submit to network
    const result = await server.submitTransaction(signedTransaction);
    
    return {
      success: true,
      hash: result.hash,
      result: result,
    };
  } catch (error) {
    console.error('Payment failed:', error);
    return {
      success: false,
      error: error.message || 'Payment failed',
    };
  }
};