import ReactJson from 'react-json-view';

import React from 'react'

const JSONViewer = (props) => {
  return (
    <div>
        <ReactJson src={props.JText} theme="monokai" displayDataTypes={props.displayDataTypes} collapsed={props.collapsed} />

    </div>
  )
}

export default JSONViewer;