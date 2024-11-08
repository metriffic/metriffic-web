import React, { useEffect, useRef } from "react";
import { Modal, Button } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.css';
import '../style.css';

import { store } from '../redux/store';
import { set_modal_content, set_logged_in_user } from '../redux/utils-slice';
import { fetch_post } from "../utils";

const ModalContentError = (props) => {
    return (
    <Modal
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={true}>
        <>
        <Modal.Header >
            <Modal.Title id="contained-modal-title-vcenter" style={{fontSize:14,fontWeight:'bold'}}>
            failure...
            </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{fontSize:13,fontWeight:'normal'}} >
            <div style={{ maxWidth: 300, textAlign:'center', margin:'0 auto'}}>
                <p style={{ textAlign:'center', margin:0 }}> 
                    {props.error}
                </p>
            </div>
        </Modal.Body>
        <Modal.Footer>
            <Button className='basic_button' onClick={() => store.dispatch(set_modal_content(null))}>Close</Button>
        </Modal.Footer>
        </>
    </Modal>);
}

const ModalContentSuccess = (props) => {
    return (
    <Modal
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={true}>
        <>
        <Modal.Header >
            <Modal.Title id="contained-modal-title-vcenter" style={{fontSize:14,fontWeight:'bold'}}>
            success!
            </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{fontSize:13,fontWeight:'normal'}} >
            <div style={{ maxWidth: 300, textAlign:'center', margin:'0 auto'}}>
                <p style={{ textAlign:'center', margin:0 }}> 
                    {props.message}
                </p>
            </div>
        </Modal.Body>
        </>
    </Modal>);
}

export {
    ModalContentError,
    ModalContentSuccess
};
