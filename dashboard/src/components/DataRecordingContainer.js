const CHART_PLOT_DURATION = 30 * 1000;
const MINIMUM_DATA_AGE = 500;
const MAXIMUM_DATA_AGE = CHART_PLOT_DURATION + (2 * MINIMUM_DATA_AGE);
const MINIMUM_DATA_COUNT = 1;
const MAXIMUM_DATA_COUNT = 5000;

let timestampOffset = 0;

class DataRecordingContainer {

  constructor() {
    this.dataRecordings = {};
  }

  get dataRecordings() {
    return this._dataRecordings;
  }

  set dataRecordings(dataRecordings) {
    this._dataRecordings = dataRecordings;
  }

  getIds() {
    return Object.keys(this.dataRecordings);
  }

  getData(id) {
    if (!(id in this.dataRecordings)) {
      this.dataRecordings[id] = [];
    }
    return this.dataRecordings[id];
  }

  setData(id, data) {
    this.dataRecordings[id] = data;
  }

  addData(id, data) {
    this.setData(id, this.getData(id).concat(data));
  }

  addDataRecording(dataRecording) {
    this.addData(dataRecording.dataId, dataRecording.dataList);
  }

  getDataValuesInDimension(id, dimension) {
    let maximumAggregationTimestamp = Date.now() - MINIMUM_DATA_AGE - timestampOffset;
    return this.getData(id)
      .filter(data => data.aggregationTimestamp < maximumAggregationTimestamp)
      .map(data => {
        let value;
        if (data.hasOwnProperty('value')) {
          value = data.value;
        } else {
          const firstValue = data.values[0];
          if (firstValue instanceof Array) {
            value = firstValue[dimension];
          } else {
            value = data.values[dimension];
          }
        }
        return value;
      });
  }

  getDataValuesInDimensionForComparison(id, dimension, startTimestamp, endTimestamp) {
    return this.getData(id)
      .filter(data => data.aggregationTimestamp > startTimestamp && data.aggregationTimestamp < endTimestamp)
      .map(data => {
        let value;
        if (data.hasOwnProperty('value')) {
          value = data.value;
        } else {
          const firstValue = data.values[0];
          if (firstValue instanceof Array) {
            value = firstValue[dimension];
          } else {
            value = data.values[dimension];
          }
        }
        return value;
      });
  }

  getDataTimestamps(id) {
    let timestamps = [];
    let maximumAggregationTimestamp = Date.now() - MINIMUM_DATA_AGE - timestampOffset;
    this.getData(id)
      .filter(data => data.aggregationTimestamp < maximumAggregationTimestamp)
      .forEach(data => timestamps.push(data.aggregationTimestamp));
    return timestamps;
  }

  getDataTimestampsForComparison(id, startTimestamp, endTimestamp) {
    let timestamps = [];
    this.getData(id)
      .filter(data => data.aggregationTimestamp > startTimestamp && data.aggregationTimestamp < endTimestamp)
      .forEach(data => timestamps.push(data.aggregationTimestamp));
    return timestamps;
  }

  getDimensions(id) {
    let data = this.getData(id);
    if (data.length === 0) {
      return 0;
    }
    let firstData = data[0];
    if (firstData.hasOwnProperty('value')) {
      return 1;
    } else {
      let firstValue = firstData.values[0];
      if (firstValue instanceof Array) {
        return firstData.values.length * firstValue.length;
      } else {
        return firstData.values.length;
      }
    }
  }

  trim() {
    let minimumAggregationTimestamp = Date.now() - MAXIMUM_DATA_AGE - timestampOffset;
    this.getIds().forEach(function (id) {
      let trimmedData = this.getData(id);

      // trim based on count
      if (trimmedData.length > MAXIMUM_DATA_COUNT) {
        trimmedData = trimmedData.slice(-MAXIMUM_DATA_COUNT);
      }

      // trim based on age
      trimmedData = trimmedData.filter(
        data => data.aggregationTimestamp >= minimumAggregationTimestamp
      );

      // restore minimum count of data
      if (trimmedData.length < MINIMUM_DATA_COUNT) {
        trimmedData = this.getData(id).slice(-MINIMUM_DATA_COUNT);
      }

      this.setData(id, trimmedData);
    }, this);
  }

  static getReadableId(id) {
    let readableId = id.substring(id.lastIndexOf(".") + 1);
    readableId = readableId.replace('Rx', '');
    readableId = readableId.replace('Data', '');
    readableId = readableId.replace(/([A-Z])/g, ' $1').trim() // add spaces before capital letters
    return readableId;
  }

}

export default DataRecordingContainer;