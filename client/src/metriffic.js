import React, { useState, useRef, useCallback } from "react";
import { Navbar, Nav, NavDropdown, 
         Modal, Button } from 'react-bootstrap'
import { useSelector } from "react-redux"

import { DockLayout } from 'rc-dock'
import { KeysTab } from "./tabs/keys-tab";
import { ReactComponent as CheckIcon } from './assets/images/check.svg'
import metriffic_logo from './assets/images/metriffic.frontpage.png'

import 'rc-dock/dist/rc-dock.css'
import 'rc-dock/style/predefined-panels.less'
import 'bootstrap/dist/css/bootstrap.css'

import { store } from './redux/store'
import { set_modal_content } from './redux/utils-slice'

import "./application.css";

const Metriffic = () => {
    const [logged_in, set_logged_in] = useState(false)
    const [show_am_tab, set_show_am_tab] = useState(false)
    const [show_keys_tab, set_show_keys_tab] = useState(true)

    const modal_content = useSelector(state => state.utils.modal_content)


    React.useEffect(() => {
        fetch("/api")
        .then((res) => res.json())
        .then((data) => console.log(data.message));
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

    const on_login_click = () => {
        
    }

    const on_request_access_click = () => {

    }

    const ModalDialog = ({title}) => {
        return (
            <Modal
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={modal_content}>
                <Modal.Header >
                    <Modal.Title id="contained-modal-title-vcenter" style={{fontSize:14,fontWeight:'bold'}}>
                      {modal_content ? modal_content.title : 'missing title'}
                    </Modal.Title>
                </Modal.Header>
                {
                    !(modal_content && modal_content.action_in_progress) && 
                    (<Modal.Body style={{fontSize:12,fontWeight:'normal'}} >
                        {modal_content ? modal_content.content : 'missing content'}
                    </Modal.Body>)
                }
                {
                    !(modal_content && (modal_content.action_in_progress || modal_content.ok_cancel)) &&
                    (<Modal.Footer>
                        <Button className='basic_button' onClick={() => set_modal_content(null)}>Close</Button>
                    </Modal.Footer>)
                }
                {
                    (modal_content && modal_content.ok_cancel) &&
                    (<Modal.Footer>
                        <Button className='basic_button' onClick={modal_content.on_ok_click}>Ok</Button>
                        <Button className='basic_button' onClick={modal_content.on_cancel_click}>Cancel</Button>
                    </Modal.Footer>)
                }

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
                                    onClick={on_login_click}>
                                    login
                                </NavDropdown.Item>
                                <NavDropdown.Item
                                    // style={{width:'11em'}}
                                    onClick={on_request_access_click}>
                                    request access
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
