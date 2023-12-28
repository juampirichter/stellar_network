<script setup lang="ts">
  //Import function ref
  import { ref } from 'vue';
  //Import functions stellar-sdk
  import * as StellarSdk from 'stellar-sdk'
  import { Networks } from "stellar-sdk";

  const amountInput = ref(0);
  const sourceSecretKey = ref("");
  const receiverPublicKey = ref("");

  // Function to make transaction
  const makeTransaction = async (amountInput: number, sourceSecretKey: string, receiverPublicKey: string) => {
    // From sourceSecretKey (ref), get the sourceKeyPair
    const sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecretKey);
    // Get public key from sourceKeyPair
    const sourcePublicKey = sourceKeypair.publicKey();


    // Configure StellarSdk to talk to the horizon server, TESTNET
    const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');

    // Transactions require a valid sequence number that is specific to this account.
    // We can fetch the current sequence number for the source account from Horizon.
    const account = await server.loadAccount(sourcePublicKey);

    // Fetch the base fee
    const fee = await server.fetchBaseFee();

    // Make de transaction's build with the next things
    const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: fee.toString(),
        networkPassphrase: Networks.TESTNET
    })
    // Make the operation of payment with the inputs that user entered (destination and amount) and the asset
    .addOperation(StellarSdk.Operation.payment({
        destination: receiverPublicKey,
        amount: amountInput.toString(),
        asset: StellarSdk.Asset.native()
    }))
    .setTimeout(30)
    .build();

    // Sign this transaction with the secret key
    transaction.sign(sourceKeypair);
    // Show in console.log the envelope
    console.log(transaction.toEnvelope().toXDR('base64'));

    // Submit the transaction to the Horizon server. The Horizon server will then
    // submit the transaction into the network for us.
    try {
      const transactionResult = await server.submitTransaction(transaction);
      console.log(JSON.stringify(transactionResult, null, 2));
      alert(`\nSuccesful transaction!`)
    } catch (e) {
      console.log('An error has occured:');
      console.log(e);
    }
  }
</script>

<template>
  <div class="container">
    <h1 class="title">Transaction (XLM)</h1>
    <div class="column items-center justify-center q-mx-lg header">
      <div>
        <input class="input" placeholder="Amount" v-model="amountInput" type="number">
        <input class="input" placeholder="From (Private Key)" v-model="sourceSecretKey" type="text">
        <input class="input" placeholder="To (Public Key)" v-model="receiverPublicKey" type="text">
      </div>
      <div>
        <button class="button" type="submit" @click="makeTransaction(amountInput, sourceSecretKey, receiverPublicKey)">Pay</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .title {
    text-align: center;
    font-family: 'Courier New', Courier, monospace;
    margin: 0;
    padding-top: 64px;
    margin-bottom: 64px;
  }

  .input {
    border: none;
    width: 200px;
    background-color: rgba(253, 217, 36, 0.445);
    border-radius: 5px;
    padding: 5px;
    margin-left: 5px;
    margin-right: 5px;
  }

  .input:focus {
    outline: none;
  }

  .button {
    border: none;
    background-color: rgb(253, 218, 36);
    border-radius: 5px;
    margin: 10px;
    margin-top: 20px;
    font-weight: 800;
    font-family: 'Courier New', Courier, monospace;
    cursor: pointer;
    padding: 5px 10px;
  }
  
</style>