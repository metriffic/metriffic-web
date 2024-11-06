import React, { useRef } from 'react'
import { Button } from 'react-bootstrap';
// import { set_log } from '../redux/logging-slice'
// import { useSelector } from "react-redux";

const UserProfileTitle = () => {
    const on_erase_log_click = () => {
        // set_log([])
    }
    return (
        <div style={{display:'flex'}}>
            <p style={{margin:0}}>profile</p>
        </div>
    )
}

const UserProfile = () => {

    const username_ref = useRef(null);
    const email_ref = useRef(null);
    const bastion_key_ref = useRef(null);
    const user_key_ref = useRef(null);
  
    const handle_save = () => {
      // Implement save logic here
      console.log({
        username: username_ref.current.value,
        email: email_ref.current.value,
        bastion_key: bastion_key_ref.current.value,
        user_key: user_key_ref.current.value
      });
    };
  
    return (
     <div id="keys-container" style={{display:'flex', flexDirection:'column', padding:10, fontSize:13}}>
        <div className="flex items-center space-x-4">
          <label className='basic_label'>username</label>
          <input
            type="text"
            ref={username_ref}
            className='basic_editbox'
            disabled
          />
        </div>
  
        <div className="flex items-center space-x-4">
          <label className='basic_label'>email</label>
          <input
            type="email"
            ref={email_ref}
            className='basic_editbox'
            disabled
          />
        </div>
  
        <div className="flex items-start space-x-4">
          <label className='basic_label'>bastion public key</label>
          <textarea
            ref={bastion_key_ref}
            className='basic_editarea'
          />
        </div>
  
        <div className="flex items-start space-x-4">
          <label className='basic_label'>user public key</label>
          <textarea
            ref={user_key_ref}
            className='basic_editarea'
          />
        </div>
  
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handle_save}
            className='basic_button'
          >
            Save
          </Button>
        </div>
      </div>
    );
  };

const build_tab = () => {
    const t = {
        id: 'profile_tab',
        title: <UserProfileTitle/>,
        content: <UserProfile/>,
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
