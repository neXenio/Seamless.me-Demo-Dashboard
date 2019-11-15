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
        var values = [];
        var maximumAggregationTimestamp = Date.now() - MINIMUM_DATA_AGE - timestampOffset;
        this.getData(id)
            .filter(data => data.aggregationTimestamp < maximumAggregationTimestamp)
            .forEach(data => {
                var value;

                if (data.hasOwnProperty('value')) {
                    value = data.value;
                } else {
                    var firstValue = data.values[0];
                    if (firstValue instanceof Array) {
                        value = firstValue[dimension];
                    } else {
                        value = data.values[dimension];
                    }
                }

                values.push(value);
            });
        return values;
    }

    getDataTimestamps(id) {
        var timestamps = [];
        var maximumAggregationTimestamp = Date.now() - MINIMUM_DATA_AGE - timestampOffset;
        this.getData(id)
            .filter(data => data.aggregationTimestamp < maximumAggregationTimestamp)
            .forEach(data => timestamps.push(data.aggregationTimestamp));
        return timestamps;
    }

    getDimensions(id) {
        var data = this.getData(id);
        if (data.length == 0) {
            return 0;
        }
        var firstData = data[0];
        if (firstData.hasOwnProperty('value')) {
            return 1;
        } else {
            var firstValue = firstData.values[0];
            if (firstValue instanceof Array) {
                return firstData.values.length * firstValue.length;
            } else {
                return firstData.values.length;
            }
        }
    }

    trim() {
        var minimumAggregationTimestamp = Date.now() - MAXIMUM_DATA_AGE - timestampOffset;
        this.getIds().forEach(function (id) {
            var trimmedData = this.getData(id);

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
        var readableId = id.substring(id.lastIndexOf(".") + 1);
        readableId = readableId.replace('Rx', '');
        readableId = readableId.replace('Data', '');
        readableId = readableId.replace(/([A-Z])/g, ' $1').trim() // add spaces before capital letters
        return readableId;
    }

}


export default DataRecordingContainer;