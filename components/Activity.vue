<script setup lang="ts">
    //Import function ref
    import { ref } from 'vue';
    //Import functions from localstorage.ts and stellar-sdk
    import { Transaction, Networks } from 'stellar-sdk';
    import { getAccountFromLocalStorage } from './localstorage';

    const name = ref('');
    let publicKeyInput = ref('');
    // An array for activity with an object inside
    let activityArray = ref<Array<{ sourceAccount: string; sourceDestination: string; amount: any; date: any }>>([]);

    // Function to search all activity from an account
    const searchActivity = async (name: string) => {
        // Empty accounts array
        activityArray.value.splice(0, activityArray.value.length);
        // Function to find details from the transaction
        async function fetchTransactionDetails(linkEnvelope: string): Promise<string[]> {
            try {
                const response = await fetch(linkEnvelope);
                if (!response.ok) {
                throw new Error(`Error al recuperar transacciones. Código: ${response.status}`);
                }

                const json = await response.json();
                const transactions = json._embedded.records;

                // Get the envelope_xdr details
                const envelope_xdrs = transactions.map((transaction: any) => transaction.envelope_xdr);

                // Return the array
                return envelope_xdrs;
            } catch (error) {
                // On error, return an empty array
                return [];
            }
        }

        // The publicKey from the function getAccountFromLocalStorage(name)
        const publicKey = getAccountFromLocalStorage(name).publicKey;
        publicKeyInput.value = publicKey
        // Link with the publicKey inside to see transactions
        const linkEnvelope = 'https://horizon-testnet.stellar.org/accounts/' + publicKey + '/transactions?order=desc';
        const envelope_xdrs = await fetchTransactionDetails(linkEnvelope);

        // To remove the last index from the array (it's the friendbot payment)
        const lastIndex = envelope_xdrs.length - 1;

        // Loop through the entire array of envelope_xdrs
        if(envelope_xdrs.length > 1){
            for (const envelope_xdr of envelope_xdrs.slice(0, lastIndex)) {
                const transaction = new Transaction(envelope_xdr, Networks.TESTNET);

                console.log(transaction);
                // Get the transaction's date
                const date = transaction.timeBounds?.maxTime
                ? new Date(parseInt(transaction.timeBounds.maxTime) * 1000)
                : new Date();

                // Get the source account and if it's the name that the user enter, replace it
                let sourceAccountTransaction;

                if(transaction.source != publicKey){
                    sourceAccountTransaction = transaction.source;
                }else{
                    sourceAccountTransaction = name;
                }
                    
                // Get the source destination and if it's the name that the user enter, replace it
                const operation = transaction.operations[0];
                let sourceDestinationTransaction: any;

                if (operation.type === 'payment') {
                    if(operation.destination != publicKey){
                        sourceDestinationTransaction = operation.destination;
                    }else{
                            sourceDestinationTransaction = name;
                    }
                }

                // Get the transaction's fee
                const operationFeeTransaction = transaction.operations[0];

                let operationFee: string | undefined;

                if (operationFeeTransaction.type === 'payment') {
                    operationFee = operationFeeTransaction.amount;
                } else {
                    operationFee = undefined;
                }

                //All the data insdie the array
                activityArray.value.push({
                    sourceAccount: sourceAccountTransaction,
                    sourceDestination: sourceDestinationTransaction,
                    amount: operationFee,
                    date: date,
                });

                // Display block to activity element
                const activityDiv = document.getElementById("activity");

                if (activityDiv) {
                    activityDiv.style.display = "block";
                }
            }
        }else {
            alert("This account has no transactions!");
        }

    }

    
</script>

<template>
  <div class="template">
        <div class="container">
            <h1 class="title">Activity</h1>
            <div class="column items-center justify-center q-mx-xl header">
                <div>
                    <input placeholder="Name" class="input" v-model="name" />
                </div>
                <div>
                    <button class="button" type="submit" @click="searchActivity(name)">Search</button>
                </div>
            </div>
            <div id="activity">
                <div class="column justify-center q-mx-xl">
                    <div style="width: 100%; text-align: center;">
                        <h6 style="margin: 0; margin-top: 20px">Public Key:</h6>
                        <h6 style="margin: 0; margin-bottom: 20px;">{{ publicKeyInput }}</h6> 
                    </div>
                    <div class="row justify-center text-center tabla">
                        <input class="q-mx-xs title-table" value="Source Account" readonly>
                        <input class="q-mx-xs title-table" value="Source Destination" readonly>
                        <input class="q-mx-xs title-table" value="Amount(XLM)" readonly>
                        <input class="q-mx-xs title-table" value="Date" readonly>
                    </div>
                    <div class="row justify-center text-center tabla" v-for="(activityValue) in activityArray">
                        <input class="q-mx-xs max-width-content" v-model="activityValue.sourceAccount" readonly>
                        <input class="q-mx-xs max-width-content" v-model="activityValue.sourceDestination" readonly>
                        <input class="q-mx-xs max-width-content" v-model="activityValue.amount" readonly>
                        <input class="q-mx-xs max-width-content" v-model="activityValue.date" readonly>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
  .template {
        width: 100vw;
    }
    .container {
        width: 100%;
    }
    .title {
        text-align: center;
        font-family: 'Courier New', Courier, monospace;
        margin: 0;
        padding-top: 64px;
        margin-bottom: 64px;
    }
    .tabla {
        width: 100%;
    }

    #activity {
        display: none;
        max-width: 1700px;
        margin: auto;
        margin-top: 10px;
    }

    .max-width-content {
        width: 20%; 
        margin: 0 auto; 
        white-space: nowrap;
        text-align: center;
        border: none;
        background-color: rgba(253, 217, 36, 0.445);
        border-radius: 5px;
        padding: 5px;
        margin-bottom: 5px;
        font-family: 'Courier New', Courier, monospace;
    }

    .title-table {
        border: none;
        background-color: rgb(253, 218, 36);
        width: 20%; 
        margin: 0 auto; 
        text-align: center;
        border: none;
        border-radius: 5px;
        padding: 5px;
        margin-bottom: 5px;
        font-weight: 800;
        font-family: 'Courier New', Courier, monospace;
    }

    .title-table:focus{
        outline: none;
    }
    .max-width-content {
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
    .input {
        border: none;
        width: 200px;
        background-color: rgba(253, 217, 36, 0.445);
        border-radius: 5px;
        padding: 5px;
    }

    .input:focus {
        outline: none;
    }
</style>