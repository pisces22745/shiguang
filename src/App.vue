<template>
  <div id="app">
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'app'
  }
</script>

<style>
  /*.fade-enter-active {*/
    /*transition: all .2s;*/
  /*}*/

  /*.fade-enter{!* .fade-leave-active in below version 2.1.8 *!*/
    /*-webkit-transform: translateX(-100%);*/
    /*transform: translateX(-100%);*/
    /*opacity: 0;*/
  /*}*/
  /*.fade-leave{*/
    /*-webkit-transform: translateX(100%);*/
    /*transform: translateX(100%);*/
    /*opacity: 0;*/
  /*}*/
  .fade-enter-active, .fade-leave-active {
    -webkit-transition: opacity .3s;
    transition: opacity .3s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active in below version 2.1.8 */ {
    opacity: 0;
  }
</style>

