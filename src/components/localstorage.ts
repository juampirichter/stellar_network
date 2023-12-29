
const ACCOUNTS_LOCALSTORAGE_KEY = 'accounts'

export type Account = {
  name: string
  privateKey: string
  publicKey: string
}

export function saveAccountInLocalStorage(name: string, privateKey: string, publicKey: string){

  // Get the item from local storage. If not present return empty array in string
  const accountsItem = localStorage.getItem(ACCOUNTS_LOCALSTORAGE_KEY) || '[]'
  // The item must be parsed because accountsItem is a string
  const accounts = JSON.parse(accountsItem)

  const account = accounts
    .find((account: Account) => account.name === name)

  if (account) {
    // if account is present with that name, throw an error
    throw new Error(`Account exist with name: ${name}`)
  } else {
    // If account is not present, save the account in local storage
    const newAccount: Account = {
      name: name,
      privateKey: privateKey,
      publicKey: publicKey
    }
    accounts.push(newAccount)
    // Convert the array to string to save in local storage
    localStorage.setItem(ACCOUNTS_LOCALSTORAGE_KEY, JSON.stringify(accounts))
  }
}

export function getAccountFromLocalStorage(name: string): Account{
  // Get the item from local storage. If not present return empty array in string
  const accountsItem = localStorage.getItem(ACCOUNTS_LOCALSTORAGE_KEY) || '[]'
  // The item must be parsed because accountsItem is a string
  const accounts = JSON.parse(accountsItem)

  const account: Account = accounts
    .find((account: Account) => account.name === name)

  if (!account) {
    throw new Error(`Account ${name} does not exist in local storage`)
  }

  return account
}

//Another function to get all accounts
export function getAllAccountsFromLocalStorage(): Account[] {
  const accountsItem = localStorage.getItem('accounts') || '[]';
  return JSON.parse(accountsItem);
}