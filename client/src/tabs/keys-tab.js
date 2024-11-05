import React, { useEffect } from 'react'
// import { set_log } from '../redux/logging-slice'
// import { useSelector } from "react-redux";

const KeysTitle = () => {
    const on_erase_log_click = () => {
        // set_log([])
    }
    return (
        <div style={{display:'flex'}}>
            <p style={{margin:0}}>log</p>
        </div>
    )
}

const Keys = () => {
    // const logmessages = useSelector(state => state.logging.log);

    useEffect(() => {  
    }, []) 

    return (
      <div id="keys-container" style={{display:'flex', flexDirection:'column'}}>
        {/* {logmessages.map(lm => (<span>{lm}</span>))} */}
      </div>)
}

const build_tab = () => {
    const t = {
        id: 'log_tab',
        title: <KeysTitle/>,
        content: <Keys/>,
        group: 'card',
        minWidth: 100,
        minHeight: 100,
        closable: true, 
        cached: true,
    }
    return t
}

let tab = build_tab()

const reload_tab = () => {
    tab = build_tab()
    return tab
}

export const KeysTab = {
    tab,
    reload_tab
}
