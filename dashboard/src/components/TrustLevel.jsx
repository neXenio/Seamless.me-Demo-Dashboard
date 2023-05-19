import { Badge } from "react-materialize";
import { useEffect, useState } from "react";


const getReadableValue = (value) => {
	if (value > 0.90) {
  	return "very high";
  } else if (value > 0.75) {
  	return "high";
  } else if (value > 0.50) {
  	return "moderate";
  } else if (value > 0.25) {
  	return "low";
  } else {
  	return "very low";
  }
}

const getTrustLevelData = (data) => {
    if (data.length !== 0) {
        const lastData = data[data.length - 1];
        const trustValue = lastData.values[0];
        const confidence = lastData.values[1];
        const readableConfidence = getReadableValue(confidence);
        const trustReadable = getReadableValue(trustValue);

        console.log("Latest trust level value: " + trustValue);

        return {
            trustValue,
            trustReadable,
            trustLevel: `${Math.round(trustValue * 100)}%`,
            trustLevelDescription: `Trust level is ${trustReadable} with a ${readableConfidence} confidence.`,
        }
    }

    return {
        trustValue: 0.7,
        trustReadable: getReadableValue(0.9),
        trustLevel: `${Math.round(0.9 * 100)}%`,
        trustLevelDescription: `Trust level is ${getReadableValue(0.9)} with a ${getReadableValue(0.6)} confidence.`,
    }
}


const TrustLevel = () => {
    const selectedDataId = window.selectedDataId;
    const [trustLevelData, setTrustLevelData] = useState();
    
    useEffect(() => {
        if (selectedDataId) {
            const data = window.dataRecordingContainer.getData(selectedDataId);
            setTrustLevelData(getTrustLevelData(data))
            // console.log(selectedDataId);
            // console.log(window.dataRecordingContainer.getData(selectedDataId));


        }
    }, [selectedDataId])
    
    console.log(trustLevelData);

    return (
        <>
            <a className="btn btn-small modal-trigger" href="#trustLevelDetails">
                <i className="material-icons left">phonelink_lock</i>
                Trust Level <Badge className="green" style={{ float: "none", color: "white" }}>{trustLevelData?.trustReadable || "?"}</Badge>
            </a>
        <div
            className="modal"
            id="trustLevelDetails"
            >
            <div class="modal-content">
                <h3>Trust Level Details</h3>    
                <p>{ trustLevelData?.trustLevelDescription || "no trust level available"}</p>
            </div>
            <div class="modal-footer">
              <a
                href="#!"
                class="modal-close waves-effect waves-green btn-flat"
              >
                Close
              </a>
            </div>
        </div>
            </>
    )
}

export default TrustLevel;
