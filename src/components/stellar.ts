import * as StellarSdk from 'stellar-sdk'
import { saveAccountInLocalStorage, getAccountFromLocalStorage } from './localstorage';

const server = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");

export async function createStellarAccount(name: string): Promise<void>{
  const pair = StellarSdk.Keypair.random();
  const publicKey = pair.publicKey();
  const privateKey = pair.secret();

  const url = `https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`
  // This creates the account in Stellar Testnet, and it funds the account with 10000 lumens.
  await fetch(url);

  // Now that the account is in Stellar, save the account name, public key
  // and private key in local storage.
  // This way you can access the accounts later and you can do payments.
  saveAccountInLocalStorage(name, privateKey, publicKey)
}

export async function getLumensBalanceForAccount(name: string): Promise<number>{

  // Get the account from local storage
  const account = getAccountFromLocalStorage(name)

  // Get the account from stellar blockchain passing the public key you saved before.
  const stellarAccount = await server.loadAccount(account.publicKey);

  // Stellar account can have several balances. We only care about lumens
  // Lumens is the only balance with type 'native'
  const lumenBalance = stellarAccount.balances
    .find(balance => balance.asset_type === 'native')

  // parse the balance to float because stellar return the balance in string
  return lumenBalance?.balance ? parseFloat(lumenBalance.balance)  : 0
}