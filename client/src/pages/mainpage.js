import React, { useState, useRef, useCallback } from "react";
import { Navbar, Nav, NavDropdown, 
         Modal, Button } from 'react-bootstrap'
import { useSelector } from "react-redux"
import { useNavigate } from 'react-router-dom';
import { DockLayout } from 'rc-dock'
import { KeysTab } from "../tabs/keys-tab";
import { ReactComponent as CheckIcon } from '../assets/images/check.svg';
import metriffic_logo from '../assets/images/metriffic.frontpage.png';

import 'rc-dock/dist/rc-dock.css';
import 'rc-dock/style/predefined-panels.less';
import 'bootstrap/dist/css/bootstrap.css';
import '../style.scss';

import { store } from '../redux/store';
import { set_modal_content } from '../redux/utils-slice';
import { fetch_post } from "../utils";

const Metriffic = () => {
    const navigate = useNavigate();

    const [logged_in, set_logged_in] = useState(false);
    const [show_am_tab, set_show_am_tab] = useState(false);
    const [show_keys_tab, set_show_keys_tab] = useState(true);

    
    const send_username_ref = useRef(null);
    const send_email_ref = useRef(null);
    const verify_username_ref = useRef(null);
    const verify_otp_ref = useRef(null);
    
    const modal_content = useSelector(state => state.utils.modal_content);


    React.useEffect(() => {
    }, []);

       
    const dock_layout = useRef(undefined);

    const dock_layout_wrapper = useCallback((node) => {
      dock_layout.current = node;
    }, []);

    let layout_center = {
        dockbox: {
            mode: "horizontal",
            panelLock: true,
            id: 'main_layout',
            children: [
                {
                    tabs: [],
                    size: 30,
                },
                {
                    mode: "vertical",
                    id: 'right_tabs_layout',
                    panelLock: true,
                    children: [
                        {
                            id: 'left_tabs_layout',
                            tabs: [],
                            size: 12,
                            panelLock: true,
                        },
                        {
                            tabs: [],
                        },
                        {
                            tabs: [/*LogTab.tab*/],   
                            size: 6,                         
                        }
                    ]
                },
            ]
        },
    }

    const on_layout_change = (new_layout, current_tab_id, direction) => {
        console.log('LCH', direction, current_tab_id)
        if(direction === 'active' || direction === 'update') {
        } else 
        if(direction === 'remove') {
            // if (current_tab_id === "markup_editor_tab") {
            //     set_show_me_tab(false)
            // } else 
            if (current_tab_id === "auto_markup_tab") {
                set_show_am_tab(false)
            } else 
            if (current_tab_id === "keys_tab") {
                set_show_keys_tab(false)
            }
        }        
    }

    const on_view_keys_click = () => {
        const parent_panel = dock_layout.current.find('right_tabs_layout')
        if(!show_keys_tab) {
            const lt = KeysTab.reload_tab()
            dock_layout.current.dockMove(lt, parent_panel, 'bottom')
            set_show_keys_tab(true)
        } else {
            const tab = dock_layout.current.find("keys_tab");
            dock_layout.current.dockMove(tab, null, 'remove')
        }        
    }

    const on_view_am_click = () => {
        // const parent_panel = dock_layout.current.find('markup_tabs_layout');
        // if(!show_am_tab) {
        //     const amt = AutoMarkupTab.reload_tab()
        //     dock_layout.current.dockMove(amt, parent_panel, 'middle')
        //     set_show_am_tab(true)
        // } else {
        //     const tab = dock_layout.current.find("auto_markup_tab");
        //     dock_layout.current.dockMove(tab, null, 'remove')
        // }        
    }

    const modal_content_send_otp = {
        title: 'sign in',
        content: <div style={{maxWidth:300, margin:'0 auto'}}>
                    <div style={{display:'flex', justifyContent:'center', alignItems:'center', marginBottom:10}}>
                    <label style={{width:'30%', textAlign:'right', marginRight:10}}>username:</label>
                    <input
                        className='basic_editbox'
                        placeholder='username'
                        ref={send_username_ref}
                        style={{width:'50%', textAlign:'left'}} />
                    </div>
                    <p style={{ textAlign:'center', margin:0 }}> 
                        we'll send a verification code to your registered email address...
                    </p>
                  </div>,
        ok_cancel: true,
        on_ok_click: async () => {
            const username = send_username_ref.current.value;
            const response = await fetch_post('/send_otp', {
                                username: username,
                            });
            const rjson = await response.json();
            if(rjson.status === 'success') {
                store.dispatch(set_modal_content(modal_content_verify_otp))
            } else {
                store.dispatch(set_modal_content(modal_content_error(rjson.message)))
            }
        },
        on_cancel_click: () => {
            store.dispatch(set_modal_content(null))
        },
    }; 

    const modal_content_verify_otp = {
        title: 'verify otp',
        content: <div style={{maxWidth:300, margin:'0 auto'}}>
                    <div style={{display:'flex', justifyContent:'center', alignItems:'center', marginBottom:10}}>
                    <label style={{width:'30%', textAlign:'right', marginRight:10}}>username:</label>
                    <input
                        className='basic_editbox'
                        placeholder='username'
                        ref={verify_username_ref}
                        style={{width:'50%', textAlign:'left'}} />
                    </div>
                    <div style={{display:'flex', justifyContent:'center', alignItems:'center', marginBottom:10}}>
                    <label style={{width:'30%', textAlign:'right', marginRight:10}}>OTP:</label>
                    <input
                        className="basic_editbox"
                        placeholder="otp"
                        ref={verify_otp_ref}
                        style={{width:'50%', textAlign:'left'}} />
                    </div>
                    <p style={{textAlign:'center', margin:0}}>
                    email with OTP is sent, copy the code to the field above to complete sign-in...
                    </p>
                </div>,
        ok_cancel: true,
        on_ok_click: async () => {
            const username = verify_username_ref.current.value;
            const otp = verify_otp_ref.current.value;
            const response = await fetch_post('/verify_otp', {
                                username: username,
                                otp: otp
                            });
            const rjson = await response.json();
            if(rjson.status === 'success') {
                store.dispatch(set_modal_content(modal_content_success(rjson.message)));
                setTimeout(() => {store.dispatch(set_modal_content(null))}, 2000);
            } else {
                store.dispatch(set_modal_content(modal_content_error(rjson.message)));
            }
        },
        on_cancel_click: () => {
            store.dispatch(set_modal_content(null))
        },
    }; 


    const modal_content_success = (message) => ({
        title: 'success',
        content: <div style={{ maxWidth: 300, textAlign:'center', margin:'0 auto'}}>
                    <p style={{ textAlign:'center', margin:0 }}> 
                        param pam pam: {message}
                    </p>
                 </div>,
    }); 

    const modal_content_error = (error) => ({
        title: 'failure...',
        content: <div style={{ maxWidth: 300, textAlign:'center', margin:'0 auto'}}>
                    <p style={{ textAlign:'center', margin:0 }}> 
                        {error}
                    </p>
                 </div>,
        close: true,
        on_ok_click: async () => {
            store.dispatch(set_modal_content(null))
        },
    }); 

    const on_signin_click = () => {
        store.dispatch(set_modal_content(modal_content_send_otp))    
    }

    const on_signup_click = () => {
        store.dispatch(set_modal_content({
            title: 'sign up',
            content: <div style={{maxWidth:300, margin:'0 auto'}}>
                    <div style={{display:'flex', justifyContent:'center', alignItems:'center', marginBottom:10}}>
                    <label style={{width:'30%', textAlign:'right', marginRight:10}}>username:</label>
                    <input
                        className='basic_editbox'
                        placeholder='username'
                        ref={send_username_ref}
                        style={{width:'50%', textAlign:'left'}} />
                    </div>
                    <div style={{display:'flex', justifyContent:'center', alignItems:'center', marginBottom:10}}>
                    <label style={{width:'30%', textAlign:'right', marginRight:10}}>email:</label>
                    <input
                        className="basic_editbox"
                        placeholder="otp"
                        ref={send_email_ref}
                        style={{width:'50%', textAlign:'left'}} />
                    </div>
                    <p style={{ textAlign:'center', margin:0 }}> submit a request to sign up</p>
                    <p style={{ textAlign:'center', margin:0 }}> (open for beta currently)</p>
                </div>,
            ok_cancel: true,
            on_ok_click: async () => {
                const username = send_username_ref.current.value;
                const email = send_email_ref.current.value;
                const response = await fetch_post('/signup', {
                                    username: username, 
                                    email: email
                                });
                const rjson = await response.json();
                store.dispatch(set_modal_content(null))
            },
            on_cancel_click: () => {
                store.dispatch(set_modal_content(null))
            },
        }))    
    }

    const on_whatisthis_click = () => {
        navigate('/whatisthis');
    }
    
    const ModalDialog = ({title}) => {
        return (
            <Modal
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={modal_content}>
                { modal_content && (<>
                    <Modal.Header >
                        <Modal.Title id="contained-modal-title-vcenter" style={{fontSize:14,fontWeight:'bold'}}>
                        {modal_content.title}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{fontSize:12,fontWeight:'normal'}} >
                        {modal_content ? modal_content.content : 'missing content'}
                    </Modal.Body>
                    {
                        modal_content.close &&
                        (<Modal.Footer>
                            <Button className='basic_button' onClick={() => store.dispatch(set_modal_content(null))}>Close</Button>
                        </Modal.Footer>)
                    }
                    {
                        modal_content.ok_cancel &&
                        (<Modal.Footer>
                            <Button className='basic_button' onClick={modal_content.on_ok_click}>Ok</Button>
                            <Button className='basic_button' onClick={modal_content.on_cancel_click}>Cancel</Button>
                        </Modal.Footer>)
                    }</>) }
            </Modal>
        )
    }

    return (
        logged_in ? (
                <>
                    <Navbar 
                        id='top-panel'>
                        <Nav>
                            <NavDropdown 
                                title="account" 
                                id="basic-nav-dropdown"
                                renderMenuOnMount={true}>
                                <NavDropdown.Item
                                    style={{width:'11em'}}
                                    onClick={on_view_keys_click}>
                                    keys
                                    {show_keys_tab ? <CheckIcon style={{ width:16, height:16, float: 'right', marginTop:'4px', marginLeft:'5px'}} /> : ''}
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar>
                    <div style={{ position: 'absolute', left: 10, top: 32, right: 10, bottom: 10 }}>
                        <DockLayout
                            defaultLayout={layout_center}
                            ref={dock_layout_wrapper}
                            onLayoutChange={on_layout_change}/>
                    </div>
                    <ModalDialog/>
                </>)
            : ( <>
                    <Navbar 
                        id='top-panel'>
                        <Nav>
                            <NavDropdown 
                                title="+" 
                                id="basic-nav-dropdown"
                                renderMenuOnMount={true}>
                                <NavDropdown.Item
                                    // style={{width:'11em'}}
                                    onClick={on_signin_click}>
                                    sign in
                                </NavDropdown.Item>
                                <NavDropdown.Item
                                    // style={{width:'11em'}}
                                    onClick={on_signup_click}>
                                    sign up
                                </NavDropdown.Item>
                                <NavDropdown.Item
                                    // style={{width:'11em'}}
                                    onClick={on_whatisthis_click}>
                                    what is this?
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar>
                    <div style={{ display:'flex', minHeight:'50vh', justifyContent: 'center', alignItems:'center' }}>
                        <img style={{maxWidth:'50%',maxHeight:'95vh', marginTop:30,
                                     border:'0px solid #ddd', borderRadius:4, padding:5}} 
                             src={metriffic_logo} alt="Metriffic"/>
                    </div>
                    <ModalDialog/>
                </>)
        )
}

export default Metriffic;
