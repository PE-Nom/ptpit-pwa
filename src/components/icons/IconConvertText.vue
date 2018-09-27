<template>
  <g>
  <path v-on:click="clicked"
     d="M 17.450519,9.0310047 A 8.4472232,8.4721043 0 0 1 9.0032957,17.503101 8.4472232,8.4721043 0 0 1 0.55607257,9.0310047 8.4472232,8.4721043 0 0 1 9.0032957,0.5589027 8.4472232,8.4721043 0 0 1 17.450519,9.0310047 Z"
     style="opacity:1;fill:none;fill-opacity:1;stroke-width:0.95579702;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1" />
  <path v-on:click="clicked"
     style="font-style:italic;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:10.58333302px;font-family:Constantia;-inkscape-font-specification:'Constantia, Bold Italic';font-variant-ligatures:normal;font-variant-caps:normal;font-variant-numeric:normal;font-feature-settings:normal;text-align:center;writing-mode:lr-tb;text-anchor:middle;fill-opacity:1;stroke-width:0.35223401"
     d="m 7.7557927,4.4530048 -0.8803711,2.0602759 -0.3509174,0.069176 0.2524147,-2.8828569 0.055409,-0.06144 q 0.7695542,0.015323 1.4775451,0.023058 0.7141469,0.00744 1.3975109,0.00744 h 1.6991767 q 0.707989,0 1.440606,-0.00744 0.738772,-0.00743 1.514483,-0.023058 l 0.02463,0.06144 -0.806494,2.8136663 -0.350916,0.069176 -0.08003,-2.1294665 h -1.797688 l -1.145097,7.4954494 q -0.06772,0.461261 -0.129286,0.837949 -0.05541,0.376702 -0.09234,0.6842 -0.01847,0.192189 0.1723797,0.26138 l 0.837275,0.29982 -0.04925,0.39207 q -1.1389407,-0.02305 -1.9885297,-0.02305 -0.9111524,0 -1.9823731,0.02305 l 0.024625,-0.39207 0.9296224,-0.315188 q 0.1723802,-0.05385 0.209319,-0.238321 0.055409,-0.299821 0.116978,-0.6842 0.061569,-0.384379 0.1292858,-0.84564 L 9.5350143,4.4529756 Z" />
  <path v-on:click="clicked"
     d="M 0.29392163,5.8449869 H 4.3228453 c 0.025891,0 0.046717,0.022665 0.046717,0.046871 v 6.2782891 c 0,0.02645 -0.020841,0.04687 -0.046717,0.04687 H 0.29392163 c -0.0258802,0 -0.0467149,-0.02266 -0.0467149,-0.04687 V 5.8918571 c 0,-0.026449 0.0208347,-0.046871 0.0467149,-0.04687 z"
     style="opacity:1;fill:#ffffff;fill-opacity:1;stroke:#ffffff;stroke-width:0.29841346;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1" />
  <path v-on:click="clicked"
     style="fill-opacity:1;stroke-width:0.24074548"
     d="m 0,7.4600368 h 5.0314268 v -1.07487 l 2.2590084,2.64584 -2.2590084,2.6458302 v -1.03353 H 0 Z" />
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
