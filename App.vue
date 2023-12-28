<script setup lang="ts">
  //Import function ref and computed
  import { ref, computed } from 'vue'
  //Components to be used
  import Transaction from './components/Transaction.vue'
  import Account from './components/Account.vue'
  import Activity from './components/Activity.vue'

  //Routes to transition between titles
  interface Routes {
    [key: string]: any;
  }

  const routes: Routes = {
    '/': Account,
    '/transaction': Transaction,
    '/activity': Activity
  }

  const currentPath = ref(window.location.hash)

  window.addEventListener('hashchange', () => {
    currentPath.value = window.location.hash
  })

  const currentView = computed(() => {
    return routes[currentPath.value.slice(1) || '/']
  })
</script>

<template>
  <div class="header items-center">
    <div class="row items-center justify-between q-mx-lg container">
      <div class="col">
        <a class="title" href="#/">STELLAR NETWORK</a>
      </div>
      <div class="col-auto">
        <div class="row items-center">
          <div class="account-div">
            <a class="account row items-center" href="#/">Account</a>
          </div>
          <div class="transaction-div">
            <a class="transaction row items-center" href="#/transaction">Transaction</a>
          </div>
          <div class="activity-div">
            <a class="activity row items-center" href="#/activity">Activity</a>
          </div>
        </div>
      </div>
        
    </div>
  </div>
  <component class="component" :is="currentView" />
</template>

<style scoped>
  .header {
    height: 80px;
    background-color: rgba(128, 128, 128, 0.082);
    box-shadow: 0px 2px 7px 0px rgb(128, 128, 128);
  }

  .component {
    height: calc(100vh - 80px);
  }

  .container {
    height: 80px;
    font-family: 'Courier New', Courier, monospace;
  }

  .title {
    font-size: 40px; 
    margin: 0;
    text-decoration: none;
    color: #000;
  }
  .account {
    font-size: 18px;
    text-decoration: none;
    color: #000;
    margin: 0;
    padding-left: 7px;
    padding-right: 7px;
    font-weight: 600;
    height: 80px;
  }
  .account:hover {
    background-color: rgb(253, 218, 36);
    transition: 0.5s ease-out;
  }
  .transaction{
    font-size: 18px;
    text-decoration: none;
    color: #000;
    margin: 0;
    padding-left: 7px;
    padding-right: 7px;
    font-weight: 600;
    height: 80px;
  }

  .transaction:hover{
    background-color: rgb(253, 218, 36);
    transition: 0.5s ease-out;
  }

  .activity{
    font-size: 18px;
    text-decoration: none;
    color: #000;
    margin: 0;
    padding-left: 7px;
    padding-right: 7px;
    font-weight: 600;
    height: 80px;
  }

  .activity:hover{
    background-color: rgb(253, 218, 36);
    transition: 0.5s ease-out;
  }
</style>
