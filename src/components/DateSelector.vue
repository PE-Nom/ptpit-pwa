<template>
  <div class="date-picker form-inline">
    <div class="form-group">
      <select class="form-control year" v-model="year" @change="onChangeYear">
        <option value="">......</option>
        <option v-for="(year, idx) in years" v-bind:key=idx :value="year">{{year}}</option>
      </select>
      <label>Year</label>
    </div>
    <div class="form-group">
      <select class="form-control mouth" v-model="month" @change="onChangeMonth">
        <option value="">......</option>
        <option v-for="(month, idx) in months" v-bind:key=idx :value="month">{{month+1}}</option>
      </select>
      <label>Mouth</label>
    </div>
    <div class="form-group">
      <select class="form-control day" v-model="day" @change="onChangeDay">
        <option value="">......</option>
        <option v-for="(day, idx) in days" v-bind:key=idx :value ="day">{{day}}</option>
      </select>
      <label>Day</label>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'date-selector',
  props: {
    format: {
      type: String,
      default: 'YYYY-MM-DD'
    },
    start: {
      type: String,
      default: '1900-01-01'
    },
    default: {
      type: String,
      default: '2018-01-01'
    },
    end: {
      type: String,
      default: '2030-12-31'
    }
  },
  data: function () {
    return {
      year: '',
      month: '',
      day: '',
      years: [],
      months: [],
      days: [],
      startDate: null,
      endDate: null
    }
  },
  computed: {
    date: {
      get: function () {
        return moment({
          year: this.year,
          month: this.month,
          day: this.day
        })
      },
      set: function (v) {
        // console.log('dateSelector:set ')
        // console.log(v)
        var _d = null
        if (moment.isMoment(v)) {
          _d = v
        } else {
          _d = moment(v, this.format)
        }
        if (!_d.isValid()) {
          console.log('Not valid moment or not valid time for format: ', this.format)
        }
        this.year = _d.year()
        this.month = _d.month()
        this.day = _d.date()
        // console.log('Current date: ', this.year, this.month, this.day)
      }
    }
  },
  watch: {
    default: function () {
      this.parseDate()
    }
  },
  created: function () {
    this.parseDate()
  },
  methods: {
    parseDate: function () {
      // console.log('parseDate')
      let _s = moment(this.start, this.format)
      let err
      if (!_s.isValid()) {
        err = 'Start date is not right, or format is not right.'
        console.log(err)
        // throw new Error(err)
      }
      var _d = moment(this.default, this.format)
      if (!_d.isValid()) {
        err = 'Default date is not right, or format is not right.'
        console.log(err)
        // throw new Error(err)
      }
      var _e = moment(this.end, this.format)
      if (!_e.isValid()) {
        err = 'End date is not right, or format is not right.'
        console.log(err)
        // throw new Error(err)
      }
      if (!_s.isBefore(_e)) {
        err = 'Start date must before end date.'
        console.log(err)
        // throw new Error(err)
      }
      if (!_d.isBetween(_s, _e)) {
        err = 'Default date must between start and end.'
        console.log(err)
        // throw new Error(err)
      }
      this.startDate = {year: _s.year(), month: _s.month(), day: _s.date()}
      this.endDate = {year: _e.year(), month: _e.month(), day: _e.date()}
      this.date = _d
      this.getYears()
      this.getMonths()
      this.getDays()
    },
    getYears: function () {
      var _to = this.endDate.year
      for (var _y = this.startDate.year; _y <= _to; _y++) {
        this.years.push(_y)
      }
    },
    getMonths: function () {
      this.months = []
      if (this.year === '') return
      var _to = 11
      var _m = 0
      if (this.year >= this.endDate.year) {
        _to = this.endDate.month
      }
      if (this.year <= this.startDate.year) {
        _m = this.startDate.month
      }
      for (; _m <= _to; _m++) {
        this.months.push(_m)
      }
    },
    getDays: function () {
      this.days = []
      if (this.year === '' || this.month === '') return
      var _to = this.date.daysInMonth()
      var _d = 1
      if (this.year <= this.startDate.year && this.month <= this.startDate.month) {
        _d = this.startDate.day
      }
      if (this.year >= this.endDate.year && this.month >= this.endDate.month) {
        _to = this.endDate.day
      }
      for (; _d <= _to; _d++) {
        this.days.push(_d)
      }
    },
    onChangeYear: function () {
      this.month = ''
      this.day = ''
      this.getMonths()
      this.getDays()
      this.$emit('date-change', this.date)
    },
    onChangeMonth: function () {
      this.day = ''
      this.getDays()
      this.$emit('date-change', this.date)
    },
    onChangeDay: function () {
      this.$emit('date-change', this.date)
    }
  }
}
</script>

<style scoped>
body {
  padding: 20px;
}
.date-picker .year .mouth .day {
  width: 120px;
}
.form-group {
  margin-right: 10px;
}
</style>
