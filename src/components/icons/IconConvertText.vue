<template>
  <g>
  <path v-on:click="clicked"
     id="rect4527"
     d="M 0.38127226,0.06300038 H 17.718728 C 17.874553,0.06300038 18,0.18844781 18,0.34427264 V 17.681728 C 18,17.837553 17.874553,17.963 17.718728,17.963 H 0.38127226 C 0.22544743,17.963 0.1,17.837553 0.1,17.681728 V 0.34427264 C 0.1,0.18844781 0.22544743,0.06300038 0.38127226,0.06300038 Z"
     style="opacity:1;fill:#ffffff;fill-opacity:1;stroke:none;stroke-width:1.91717458;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1" />
  <path v-on:click="clicked"
     id="path4532"
     d="M 17.450519,9.0310047 A 8.4472232,8.4721043 0 0 1 9.0032957,17.503101 8.4472232,8.4721043 0 0 1 0.55607257,9.0310047 8.4472232,8.4721043 0 0 1 9.0032957,0.5589027 8.4472232,8.4721043 0 0 1 17.450519,9.0310047 Z"
     style="opacity:1;fill:none;fill-opacity:1;stroke-width:0.95579702;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1" />
  <path v-on:click="clicked"
     id="rect4534"
     d="M 0.29392163,5.8449869 H 4.3228453 c 0.025891,0 0.046717,0.022665 0.046717,0.046871 v 6.2782891 c 0,0.02645 -0.020841,0.04687 -0.046717,0.04687 H 0.29392163 c -0.0258802,0 -0.0467149,-0.02266 -0.0467149,-0.04687 V 5.8918571 c 0,-0.026449 0.0208347,-0.046871 0.0467149,-0.04687 z"
     style="opacity:1;fill:#ffffff;fill-opacity:1;stroke:#ffffff;stroke-width:0.29841346;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1" />
  <path v-on:click="clicked"
     id="path4529"
     style="fill-opacity:1;stroke-width:0.21072896"
     d="m 0,7.4600368 h 3.8549904 v -1.07487 l 1.7308124,2.64584 -1.7308124,2.6458302 v -1.03353 H 0 Z" />
  <path v-on:click="clicked"
     id="path4548"
     style="font-style:italic;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:16.06990242px;font-family:sans-serif;-inkscape-font-specification:'sans-serif, Bold Italic';font-variant-ligatures:normal;font-variant-caps:normal;font-variant-numeric:normal;font-feature-settings:normal;text-align:center;writing-mode:lr-tb;text-anchor:middle;fill-opacity:1;stroke-width:0.40174758"
     d="M 15.651168,5.78778 H 12.01033 l -2.1735167,9.423805 h -3.0288 L 8.9815304,5.78778 H 5.3406931 L 5.8585709,3.5279499 H 16.169045 Z" />
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
