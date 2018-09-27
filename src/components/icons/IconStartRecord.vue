<template>
  <g>
  <path v-on:click="clicked"
     d="M 17.526316,9 A 8.5263157,8.5263157 0 0 1 9,17.526316 8.5263157,8.5263157 0 0 1 0.47368431,9 8.5263157,8.5263157 0 0 1 9,0.47368431 8.5263157,8.5263157 0 0 1 17.526316,9 Z"
     style="opacity:1;fill:none;fill-opacity:1;stroke-width:0.94736844;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1" />
  <path v-on:click="clicked"
     d="M 14.684308,9 A 5.6843076,5.6842079 0 0 1 9,14.684208 5.6843076,5.6842079 0 0 1 3.3156924,9 5.6843076,5.6842079 0 0 1 9,3.3157921 5.6843076,5.6842079 0 0 1 14.684308,9 Z"
     style="opacity:1;fill-opacity:1;stroke:none;stroke-width:1.34095681;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1" />
  </g>
</template>

<script>
export default {
  methods: {
    clicked () {
      console.log('start record clicked')
      this.$emit('startRec')
    }
  }
}
</script>
