import React, { useRef, useEffect } from 'react'
import { useSelector } from "react-redux"
import { Button } from 'react-bootstrap';
import { set_logged_in_user, set_modal_content } from '../redux/utils-slice'
import { store } from '../redux/store';
import { fetch_post } from "../utils";
import { ModalContentError, ModalContentSuccess } from "../modals/general";


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

    const logged_in_user = useSelector(state => state.utils.logged_in_user);    

    const username_ref = useRef(null);
    const email_ref = useRef(null);
    const role_ref = useRef(null);
    const bastion_key_ref = useRef(null);
    const user_key_ref = useRef(null);

    useEffect(() => {
        if(logged_in_user) {
            username_ref.current.value = logged_in_user.username;
            email_ref.current.value = logged_in_user.email;
            role_ref.current.value = logged_in_user.role;
            bastion_key_ref.current.value = logged_in_user.bastionKey;
            user_key_ref.current.value = logged_in_user.userKey;
        }
    }, [logged_in_user])

    const on_save_click = async () => {
        const response = await fetch_post(
                '/save_user_profile', 
                logged_in_user.token, 
                {
                    username: username_ref.current.value,
                    bastion_key: bastion_key_ref.current.value,
                    user_key: user_key_ref.current.value
                });
        const rjson = await response.json();
        if(rjson.user) {
            rjson.user.token = logged_in_user.token;            
            store.dispatch(set_logged_in_user(rjson.user))
            store.dispatch(set_modal_content(<ModalContentSuccess message={rjson.message}/>))
            setTimeout(() => {store.dispatch(set_modal_content(null))}, 2000);
        }
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

        <div className="flex items-center space-x-4">
          <label className='basic_label'>role</label>
          <input
            type="role"
            ref={role_ref}
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
            onClick={on_save_click}
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
