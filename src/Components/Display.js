import React from 'react';
import hl7 from '../hl7.json';
import JSONViewer from './JSONViewer';
import { useState } from 'react';

const Display = () => {
    let JSONText = {};
    let eachMsgSeg = {};
    let [JText, setJText] = useState({});
    let arrayMsgSeg = ["OBX"];
    let arrayMsgSegValues = [];
    for(let p=0;p<arrayMsgSeg.length;p++) {
        arrayMsgSegValues[p] = [];
    }

    //function called on parseMessage button
    function parseMessage() {
        // const JSONText = document.querySelector('#parseMsg');
        const msg = document.querySelector('#msg').value;
        const mainMsgArr = msg.split('\n');
        let msgArr = [];
        let mKeys, mValues;
        JSONText = `{`;
        let msgIndex;
        setJText(JSONText);

        for(let k=0;k<mainMsgArr.length;k++) {
            msgArr = mainMsgArr[k].split("|");
            eachMsgSeg = `{`;
            console.log(msgArr);

            if(hl7[msgArr[0]]) {
                mKeys = Object.keys(hl7[msgArr[0]]);
                mValues = Object.values(hl7[msgArr[0]]);
                JSONText = `${JSONText}${k!==0 && JSONText!=='{'?",":""}\n\t"${msgArr[0]}": {`;
                for(let i=0;i<mKeys.length;i++) {

                    if(msgArr[0] === 'MSH')
                        msgIndex = i;
                    else
                        msgIndex = i+1;

                    JSONText = `${JSONText} \n\t "${mKeys[i]}":`;
                    eachMsgSeg = `${eachMsgSeg}\n\t "${mKeys[i]}":`;

                    if(typeof mValues[i] === "object") {
                        JSONText = `${JSONText} {\n\t\t`;
                        eachMsgSeg = `${eachMsgSeg}{\n\t\t`;
                        let subKey = Object.keys(mValues[i]);
                        
                        if(msgArr[msgIndex] && msgArr[msgIndex].includes('^')) {
                            let subValues = msgArr[msgIndex].split('^');
                            // console.log(subValues);
                            for(let j=0;j<subKey.length;j++) {
                                JSONText = `${JSONText} "${subKey[j]}": ${subValues[j]!==undefined?`"${subValues[j]}"`:"\"\""}${j!==subKey.length-1?",":""}\n\t\t`;
                                eachMsgSeg = `${eachMsgSeg}"${subKey[j]}": ${subValues[j]!==undefined?`"${subValues[j]}"`:"\"\""}${j!==subKey.length-1?",":""}\n\t\t`
                            }

                        } else {
                            JSONText = `${JSONText} "${subKey[0]}": "${msgArr[msgIndex]?msgArr[msgIndex]:""}",\n\t\t`;
                            eachMsgSeg = `${eachMsgSeg}"${subKey[0]}": "${msgArr[msgIndex]?msgArr[msgIndex]:""}",\n\t\t`;

                            for(let j=1;j<subKey.length;j++) {
                                JSONText = `${JSONText} "${subKey[j]}": ""${j!==subKey.length-1?",":""}\n\t\t`;
                                eachMsgSeg = `${eachMsgSeg} "${subKey[j]}": ""${j!==subKey.length-1?",":""}\n\t\t`
                            }
                        }
                        
                        JSONText = `${JSONText}}${i!==mKeys.length-1?",":""}`
                        eachMsgSeg = `${eachMsgSeg}}${i!==mKeys.length-1?",":""}`
                    }
                    else {
                        JSONText = `${JSONText} "${msgArr[msgIndex]?msgArr[msgIndex]==='MSH'?"|":msgArr[msgIndex]:""}"${i!==mKeys.length-1?",":""}`;
                        eachMsgSeg = `${eachMsgSeg} "${msgArr[msgIndex]?msgArr[msgIndex]:""}"${i!==mKeys.length-1?",":""}`;
                    }

                }
                JSONText = `${JSONText} \n }`;
                eachMsgSeg = `${eachMsgSeg} \n }`;
                console.log(JSONText);

                let index = arrayMsgSeg.indexOf(msgArr[0]);
                if(index !== -1)
                    arrayMsgSegValues[index].push(eachMsgSeg);
            }
            else {
                msgArr = [];
                mKeys = [];
                mValues = [];
            }   
        }
        // JSONText = `${JSONText}\n}`
        for(let i=0;i<arrayMsgSeg.length;i++) {
            if(arrayMsgSegValues[i].length !== 0) {
                JSONText = `${JSONText},\n"${arrayMsgSeg[i]}":[${arrayMsgSegValues[i]}]`
            }
        }
        JSONText = `${JSONText}\n}`
        console.log(JSONText);
        
        setJText(JSON.parse(JSONText));

    }

  return (
    <div className="container">
        <div className="row">
            <div className="col my-4">
                <p className="h2">Parse HL7 Message 2</p>
            </div>
        </div>
        <div className="row">
            <div className="col">
                <label className="form-label">Text Message</label>
                <textarea className="form-control" rows="12" id="msg"></textarea>
            </div>
        </div>
        <div className="row">
            <div className="col my-3">
                <button type="button" className="btn btn-primary" onClick={parseMessage}>Parse Message</button>
            </div>
        </div>
        <div className="row">
            <div className="col">
                <label className="form-label">Parse Message</label>
                <JSONViewer JText={JText} displayDataTypes={false} collapsed={2} />
            </div>
        </div>
        
    </div>
  )
}

export default Display;