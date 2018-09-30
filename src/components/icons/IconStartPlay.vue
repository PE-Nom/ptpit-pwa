<template>
  <g>
  <path v-on:click="clicked"
     id="path4153"
     d="M 17.905999,9.0220003 A 8.8499994,8.8499994 0 0 1 9.0559998,17.872 8.8499994,8.8499994 0 0 1 0.20600033,9.0220003 8.8499994,8.8499994 0 0 1 9.0559998,0.17200089 8.8499994,8.8499994 0 0 1 17.905999,9.0220003 Z"
     style="opacity:1;fill:#ffffff;fill-opacity:1;stroke:none;stroke-width:2.72900009;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
  <path v-on:click="clicked"
     id="path4154-1-4-0-0-1"
     d="M 17.479086,8.9869984 A 8.4710854,8.4710859 0 0 1 9.008,17.458086 8.4710854,8.4710859 0 0 1 0.53691435,8.9869984 8.4710854,8.4710859 0 0 1 9.008,0.51591277 8.4710854,8.4710859 0 0 1 17.479086,8.9869984 Z"
     style="opacity:1;fill:#ffffff;fill-opacity:1;stroke-width:0.9578287;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
  <path v-on:click="clicked"
     id="path4415"
     d="M 13.69023,8.7537018 5.9380316,12.799588 5.9386175,4.9365081 Z"
     style="opacity:1;fill-opacity:1;stroke-width:2.24793696;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
  </g>
</template>

<script>
export default {
  methods: {
    clicked () {
      console.log('start play  !!')
      this.$emit('startPlay')
    }
  }
}
</script>
