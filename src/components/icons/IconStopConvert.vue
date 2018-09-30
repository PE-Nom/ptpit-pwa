<template>
  <g>
  <path v-on:click="clicked"
     id="path5254"
     d="M 17.861001,9.0839996 A 8.8500004,8.8500004 0 0 1 9.0110006,17.934 8.8500004,8.8500004 0 0 1 0.16100025,9.0839996 8.8500004,8.8500004 0 0 1 9.0110006,0.23399925 8.8500004,8.8500004 0 0 1 17.861001,9.0839996 Z"
     style="opacity:1;fill:#3f3f3f;fill-opacity:1;stroke:none;stroke-width:2.72900009;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
  <path v-on:click="clicked"
     id="path5603"
     d="M 17.496948,9.0689993 A 8.4789476,8.4789476 0 0 1 9.0180006,17.547947 8.4789476,8.4789476 0 0 1 0.53905296,9.0689993 8.4789476,8.4789476 0 0 1 9.0180006,0.59005165 8.4789476,8.4789476 0 0 1 17.496948,9.0689993 Z"
     style="opacity:1;fill:none;fill-opacity:1;stroke-width:0.94210523;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1" />
  <path v-on:click="clicked"
     id="rect5605"
     d="m 6.1233917,5.0689993 h 5.7892173 c 0.612387,0 1.105392,0.4930046 1.105392,1.1053914 v 5.7892173 c 0,0.612387 -0.493005,1.105391 -1.105392,1.105391 H 6.1233917 c -0.6123869,0 -1.1053914,-0.493004 -1.1053914,-1.105391 V 6.1743907 c 0,-0.6123868 0.4930045,-1.1053914 1.1053914,-1.1053914 z"
     style="opacity:1;fill-opacity:1;stroke:none;stroke-width:0.88014621;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1" />
  </g>
</template>

<script>
export default {
  methods: {
    clicked () {
      console.log('stop convert  !!')
      this.$emit('stopConvert')
    }
  }
}
</script>
