<script setup lang="ts">
    //Import function ref
    import { ref } from 'vue';
    //Import functions from stellar.ts, localstorage.ts 
    import { createStellarAccount, getLumensBalanceForAccount } from './stellar';
    import { Account, getAllAccountsFromLocalStorage } from './localstorage';

    const name = ref('');
    let balance = ref<number | undefined>(undefined);

    //Function to create Account
    const createAccount = async (name: string) => {
        try {
            //Get the HTML element from accounts and balance
            const accountsDiv = document.getElementById("accounts");
            const balanceDiv = document.getElementById("balance");

            if (accountsDiv && balanceDiv) {
                //Display none to both elements
                balanceDiv.style.display = "none";
                accountsDiv.style.display = "none";
            }
            //If there is no name in the input
            if (!name.trim()) {
                alert('Please enter a name.');
                return;
            }
            await createStellarAccount(name)
            // Show messsage creation success
            alert(`Account ${name} created successfully`)
        } catch (error: any) {
            // Show message creation error
            alert(error.message)
        }
    }

    const showAccountBalance  = async (name: string) => {
        try {
            // If there is no name in the input
            if (!name.trim()) {
                alert('Please enter a name.');
                return;
            }
            // Show balance
            const result = await AccountBalance(name);
            balance.value = result; // Assigns the result to the ref balance
            // Display none to accounts element and display block to balance element
            if (result !== undefined) {
                const balanceDiv = document.getElementById("balance");
                const accountsDiv = document.getElementById("accounts");
                if (balanceDiv) {
                    if (accountsDiv) {
                        accountsDiv.style.display = "none";
                    }
                    balanceDiv.style.display = "block";
                }
            }
        } catch(error: any) {
            // Show message load error
            alert(error.message)
        }
    }

    const AccountBalance = async (name: string) => {
        try {
            // Load the stellar account to get the lumens balance
            const lumensBalance = await getLumensBalanceForAccount(name)
            return lumensBalance
        } catch(error: any) {
            // Show message load error
            alert(error.message)
        }
    }

    // An array for accounts with an object inside
    let accounts = ref<Array<{ name: string; publicKey: string; privateKey: string; balance: any }>>([]);

    const showAccounts = async () => {
        try {
            // Empty accounts array
            accounts.value.splice(0, accounts.value.length);
            // Load the stellar's accounts to get the lumens balance
            const allAccounts: Account[] = getAllAccountsFromLocalStorage();
            // Use Promise.all to wait for all AccountBalance calls
            const balances = await Promise.all(
            allAccounts.map(async (account) => {
                const balance = await AccountBalance(account.name);
                return { name: account.name, publicKey: account.publicKey, privateKey: account.privateKey, balance };
            })
            );
            balances.forEach(({ name, publicKey, privateKey, balance }) => {
                accounts.value.push({ name, publicKey, privateKey, balance });
                console.log(`Account: ${name} - PublicKey: ${publicKey} - PrivateKey: ${privateKey} - Balance: ${balance}`);
            });

            // Display none to balance element and display block to account element
            const accountsDiv = document.getElementById("accounts");

            if (accountsDiv) {
                const balanceDiv = document.getElementById("balance");
                if (balanceDiv) {
                    balanceDiv.style.display = "none";
                } 
                accountsDiv.style.display = "block";
            }
        } catch (error: any) {
            // Show message load error
            alert(error.message);
        }
    };
</script>

<template>
    <div class="template">
        <div class="container">
            <h1 class="title">Account</h1>
            <div class="column items-center justify-center q-mx-xl">
                <div>
                    <input placeholder="Name" class="input" v-model="name" />
                </div>
                <div>
                    <button class="button" type="submit" @click="createAccount(name)">Create account</button>
                    <button class="button" type="submit" @click="showAccountBalance(name)">Show Balance</button>
                    <button class="button" type="submit" @click="showAccounts()">Show Accounts</button>
                </div>
            </div>
            <div id="accounts">
                <h4 class="title" style="margin-bottom: 20px;">Accounts</h4>
                <div class="column justify-center q-mx-xl">
                    <div class="row justify-center text-center tabla">
                        <input class="q-mx-xs title-table" value="Name" readonly>
                        <input class="q-mx-xs title-table" value="PublicKey" readonly>
                        <input class="q-mx-xs title-table" value="PrivateKey" readonly>
                        <input class="q-mx-xs title-table" value="Balance" readonly>
                    </div>
                    <div class="row justify-center text-center tabla" v-for="(account) in accounts">
                        <input class="q-mx-xs max-width-content" v-model="account.name" readonly />
                        <input class="q-mx-xs max-width-content" v-model="account.publicKey" readonly />
                        <input class="q-mx-xs max-width-content" v-model="account.privateKey" readonly />
                        <input class="q-mx-xs max-width-content" v-model="account.balance" readonly />
                    </div>
                </div>
            </div>
            <div id="balance">
                <h4 class="title" style="margin-bottom: 20px;">Balance(XLM)</h4>
                <div class="column justify-center q-mx-xl">
                    <div class="row justify-center text-center tabla">
                        <input class="q-mx-xs title-table" style="width: 15%;" v-model="balance" readonly>
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
    #accounts {
        display: none;
        max-width: 1700px;
        margin: auto;
    }
    #balance {
        display: none;
        max-width: 1700px;
        margin: auto;
    }
    .tabla {
        width: 100%;
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

</style>