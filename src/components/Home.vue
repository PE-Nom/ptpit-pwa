<template>
  <div class="banner-title">
    <div>
      <h1>{{ msg }}</h1>
      <div>
      <img src="../assets/safetyfirst.png" alt="安全第一">
      </div>
      <br>
      <br>
      <p class="explanation">{{system}}</p>
      <p class="explanation">{{subname}}</p>
      <p class="explanation">{{corporate}}</p>
    </div>
  </div>
</template>

<script>
export default {
  // name: 'Home',
  data () {
    return {
      msg: 'ピットさん',
      system: 'Safety And Nonconforming',
      subname: 'Management System',
      corporate: 'by Pitarpit Co.,Ltd.'
    }
  },
  created () {
    console.log('home created')
  },
  destroy () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .banner-title {
    height: 90vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  .explanation {
    font-weight: 100;
    font-size: 1rem;
  }
</style>
