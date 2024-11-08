import React, { useEffect, useRef } from "react";
import { Modal, Button } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.css';
import '../style.css';

import { store } from '../redux/store';
import { set_modal_content, set_logged_in_user } from '../redux/utils-slice';
import { fetch_post } from "../utils";
import { ModalContentError, ModalContentSuccess } from "./general";

const ModalContentSignup = () => {
    const send_username_ref = useRef(null);
    const send_email_ref = useRef(null);

    const on_ok_click = async () => {
        const username =send_username_ref.current.value;
        const email = send_email_ref.current.value;
        const response = await fetch_post(
                        '/signup', 
                        undefined,
                        {
                            username: username, 
                            email: email
                        });
        const rjson = await response.json();
        store.dispatch(set_modal_content(<ModalContentSuccess message={rjson.message}/>))
        setTimeout(() => {store.dispatch(set_modal_content(null))}, 1000);
    }
    const on_cancel_click = () => {
        store.dispatch(set_modal_content(null))
    }
    const on_key_press = (e) => {
        if(e.keyCode === 13) on_ok_click();
    }

    return (
    <Modal
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={true}>
        <>
            <Modal.Header >
                <Modal.Title id="contained-modal-title-vcenter" style={{fontSize:14,fontWeight:'bold'}}>
                sign up
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{fontSize:13,fontWeight:'normal'}} >
                <div style={{maxWidth:300, margin:'0 auto'}}>
                    <div style={{display:'flex', justifyContent:'center', alignItems:'center', marginBottom:10}}>
                    <label style={{width:'30%', textAlign:'right', marginRight:10}}>username:</label>
                    <input
                        autoFocus
                        className='basic_editbox'
                        placeholder='username'
                        ref={send_username_ref}
                        style={{width:'50%', textAlign:'left'}} 
                        onKeyDown={on_key_press}/>
                    </div>
                    <div style={{display:'flex', justifyContent:'center', alignItems:'center', marginBottom:10}}>
                    <label style={{width:'30%', textAlign:'right', marginRight:10}}>email:</label>
                    <input
                        className="basic_editbox"
                        placeholder="email"
                        ref={send_email_ref}
                        style={{width:'50%', textAlign:'left'}} 
                        onKeyDown={on_key_press}/>
                    </div>
                    <p style={{ textAlign:'center', margin:0 }}> submit a request to sign up</p>
                    <p style={{ textAlign:'center', margin:0 }}> (open for beta currently)</p>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button className='basic_button' onClick={on_ok_click}>Ok</Button>
                <Button className='basic_button' onClick={on_cancel_click}>Cancel</Button>
            </Modal.Footer>
            </>
    </Modal>
    );
}

const ModalContentVerifyOTP = (params) => {
    const verify_username_ref = useRef(null);
    const verify_otp_ref = useRef(null);
    
    useEffect(() => {
        verify_username_ref.current.value = params.username;
    },[])

    const on_ok_click = async () => {
        const username = verify_username_ref.current.value;
        const otp = verify_otp_ref.current.value;
        const response = await fetch_post(
                        '/verify_otp', 
                        undefined,
                        {
                            username: username,
                            otp: otp
                        });
        const rjson = await response.json();
        if(rjson.status === 'success') {
            store.dispatch(set_modal_content(<ModalContentSuccess message={rjson.message}/>));
            setTimeout(() => {store.dispatch(set_modal_content(null))}, 1000);
            store.dispatch(set_logged_in_user(rjson.user));
        } else {
            store.dispatch(set_modal_content(<ModalContentError error={rjson.message}/>));
        }
    }
    const on_cancel_click = () => {
        store.dispatch(set_modal_content(null))
    }
    const on_key_press = (e) => {
        if(e.keyCode === 13) on_ok_click();
    }

    return (
    <Modal
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={true}>
        <>
            <Modal.Header >
                <Modal.Title id="contained-modal-title-vcenter" style={{fontSize:14,fontWeight:'bold'}}>
                verify OTP
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{fontSize:13,fontWeight:'normal'}} >
            <div style={{maxWidth:300, margin:'0 auto'}}>
                    <div style={{display:'flex', justifyContent:'center', alignItems:'center', marginBottom:10}}>
                    <label style={{width:'30%', textAlign:'right', marginRight:10}}>username:</label>
                    <input
                        className='basic_editbox'
                        placeholder='username'
                        ref={verify_username_ref}
                        style={{width:'50%', textAlign:'left'}} 
                        onKeyDown={on_key_press}/>
                    </div>
                    <div style={{display:'flex', justifyContent:'center', alignItems:'center', marginBottom:10}}>
                    <label style={{width:'30%', textAlign:'right', marginRight:10}}>OTP:</label>
                    <input
                        autoFocus
                        className="basic_editbox"
                        placeholder="otp"
                        ref={verify_otp_ref}
                        style={{width:'50%', textAlign:'left'}} 
                        onKeyDown={on_key_press}/>
                    </div>
                    <p style={{textAlign:'center', margin:0}}>
                    email with OTP is sent, copy the code to the field above to complete sign-in...
                    </p>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button className='basic_button' onClick={on_ok_click}>Ok</Button>
                <Button className='basic_button' onClick={on_cancel_click}>Cancel</Button>
            </Modal.Footer>
        </>
    </Modal>);
}

const ModalContentSendOTP = () => {
    
    const send_username_ref = useRef(null);

    const on_ok_click = async () => {
        const username = send_username_ref.current.value;

        const response = await fetch_post(
                        '/send_otp', 
                        undefined, 
                        {
                            username: username,
                        });
        const rjson = await response.json();
        if(rjson.status === 'success') {
            store.dispatch(set_modal_content(<ModalContentVerifyOTP username={username}/>))
        } else {
            store.dispatch(set_modal_content(<ModalContentError error={rjson.message}/>))
        }
    }
    const on_cancel_click = () => {
        store.dispatch(set_modal_content(null))
    }
    const on_key_press = (e) => {
        if(e.keyCode === 13) on_ok_click();
     }

    return (
    <Modal
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={true}>
        <Modal.Header >
            <Modal.Title id="contained-modal-title-vcenter" style={{fontSize:14,fontWeight:'bold'}}>
            sign in
            </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{fontSize:13,fontWeight:'normal'}} >
            <div style={{maxWidth:300, margin:'0 auto'}}>
                <div style={{display:'flex', justifyContent:'center', alignItems:'center', marginBottom:10}}>
                <label style={{width:'30%', textAlign:'right', marginRight:10}}>username:</label>
                <input
                    autoFocus
                    className='basic_editbox'
                    placeholder='username'
                    ref={send_username_ref}
                    style={{width:'50%', textAlign:'left'}} 
                    onKeyDown={on_key_press}/>
                </div>
                <p style={{ textAlign:'center', margin:0 }}> 
                    we'll send a verification code to your registered email address...
                </p>
            </div>
        </Modal.Body>
        <Modal.Footer>
            <Button className='basic_button' onClick={on_ok_click}>Ok</Button>
            <Button className='basic_button' onClick={on_cancel_click}>Cancel</Button>
        </Modal.Footer>
    </Modal>) 
}

export {
    ModalContentSendOTP,
    ModalContentSignup
};
