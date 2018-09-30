<template>
  <g>
  <path v-on:click="clicked"
     id="path4168"
     d="M 17.845999,8.9985018 A 8.8374996,8.8374987 0 0 1 9.0084991,17.836 8.8374996,8.8374987 0 0 1 0.17099953,8.9985018 8.8374996,8.8374987 0 0 1 9.0084991,0.16100311 8.8374996,8.8374987 0 0 1 17.845999,8.9985018 Z"
     style="opacity:1;fill:#3f3f3f;fill-opacity:1;stroke:none;stroke-width:2.32542753;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
  <path v-on:click="clicked"
     id="path4532"
     d="M 17.402284,8.981003 A 8.4242119,8.4242168 0 0 1 8.9780725,17.405212 8.4242119,8.4242168 0 0 1 0.55386061,8.981003 8.4242119,8.4242168 0 0 1 8.9780725,0.55678846 8.4242119,8.4242168 0 0 1 17.402284,8.981003 Z"
     style="opacity:1;fill:none;fill-opacity:1;stroke-width:1.05157602;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1" />
  <path v-on:click="clicked"
     id="rect4534"
     d="m 0.20653437,6.3970301 1.74145273,0 c 0.011191,0 0.020193,0.018382 0.020193,0.038014 l 0,5.0919059 c 0,0.02145 -0.00901,0.03802 -0.020193,0.03802 l -1.74145273,0 c -0.0111864,0 -0.0201919,-0.01838 -0.0201919,-0.03802 l 0,-5.0919065 c 0,-0.021452 0.009006,-0.038014 0.0201919,-0.038013 z"
     style="opacity:1;fill:#3f3f3f;fill-opacity:1;stroke:#3f3f3f;stroke-width:0.17668483;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1" />
  <path v-on:click="clicked"
     id="path4529"
     style="fill-opacity:1;stroke-width:0.21072896"
     d="m 0,7.7380388 3.8114187,0 0,-0.8504466 1.7112496,2.0934118 -1.7112496,2.093404 0,-0.817738 -3.8114187,0 z" />
  <path v-on:click="clicked"
     id="path4166"
     style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:14.04124928px;line-height:125%;font-family:'Meiryo UI';-inkscape-font-specification:'Meiryo UI, Bold';text-align:start;letter-spacing:0px;word-spacing:0px;writing-mode:lr-tb;text-anchor:start;fill-opacity:1;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
     d="m 13.528308,5.5789658 -3.393759,0 0,8.6180912 -2.2625061,0 0,-8.6180912 -3.393759,0 0,-1.7140197 9.0500241,0 0,1.7140197 z" />
  </g>
</template>

<script>
export default {
  methods: {
    clicked () {
      console.log('convert text clicked')
      this.$emit('startConvert')
    }
  }
}
</script>
