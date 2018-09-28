<template>
  <g>
  <path v-on:click="clicked"
     id="rect5101"
     d="M 0.22157636,0.04500038 H 17.840423 c 0.07788,0 0.140577,0.06269706 0.140577,0.14057636 V 17.804424 c 0,0.07788 -0.0627,0.140576 -0.140577,0.140576 H 0.22157636 C 0.14369706,17.945 0.081,17.882303 0.081,17.804424 V 0.18557674 c 0,-0.0778793 0.06269706,-0.14057636 0.14057636,-0.14057636 z"
     style="opacity:1;fill:#ffffff;fill-opacity:1;stroke:none;stroke-width:1.16142738;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1" />
  <path v-on:click="clicked"
     style="fill-opacity:1;stroke:none;stroke-width:0.70902455;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
     id="path4142-5-8-1"
     d="m 8.9619619,10.718067 c -1.0206378,0 -1.8463282,-0.8444699 -1.8463282,-1.8739458 V 4.6337006 c 0,-1.041074 0.8256904,-1.8738794 1.8463282,-1.8738794 1.0206409,0 1.8463351,0.8444037 1.8463351,1.8738794 v 4.1988895 c 0,1.041007 -0.8256942,1.8854769 -1.8463351,1.8854769 z M 11.473429,7.6527036 h 1.238537 v 1.5962887 c 0,1.7813947 -1.38762,3.2504037 -3.1307363,3.3544857 v 1.307099 h 1.8577973 v 1.249244 H 6.4849006 V 13.910577 H 8.3426994 V 12.603478 C 6.5995824,12.499325 5.2119655,11.030387 5.2119655,9.2489923 V 7.6527036 h 1.2385297 v 1.5962887 c 0,1.1682887 0.9403671,2.1052457 2.0871559,2.1052457 h 0.8371561 c 1.1582558,0 2.0871568,-0.948557 2.0871568,-2.1052457 V 7.6527036 h 0.01147 z" />
  <path v-on:click="clicked"
     id="rect5094"
     d="M 0.68071638,0.54464287 H 17.243215 c 0.0742,0 0.133929,0.0597323 0.133929,0.13392899 V 17.24107 c 0,0.0742 -0.05973,0.133929 -0.133929,0.133929 H 0.68071638 c -0.0741967,0 -0.133929,-0.05973 -0.133929,-0.133929 V 0.67857186 c 0,-0.0741967 0.0597323,-0.13392899 0.133929,-0.13392899 z"
     style="opacity:1;fill:none;fill-opacity:1;stroke-width:0.90200001;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1" />
  </g>
</template>

<script>
export default {
  methods: {
    clicked () {
      console.log('icon-mic clicked')
      this.$emit('iconClick')
    }
  }
}
</script>
