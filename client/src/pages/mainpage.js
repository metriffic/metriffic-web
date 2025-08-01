import React, { useState, useRef, useCallback, useEffect } from "react";
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'
import { useSelector } from "react-redux"
import { useNavigate } from 'react-router-dom';
import { DockLayout } from 'rc-dock'
import { KeysTab } from "../tabs/profile-tab";
import ReactGA from "react-ga4";
//https://www.svgrepo.com/svg/509711/align-justify
import { ReactComponent as CheckIcon } from '../assets/images/check.svg';
import { ReactComponent as MenuIcon } from '../assets/images/menu.svg';
import metriffic_logo from '../assets/images/metriffic.frontpage.png';
import { fetch_get } from "../utils";

import 'bootstrap/dist/css/bootstrap.css';
import 'rc-dock/dist/rc-dock.css';
import 'rc-dock/style/predefined-panels.less';
import '../style.css';


import { store } from '../redux/store';
import { set_modal_content, set_logged_in_user } from '../redux/utils-slice';
import { ModalContentSendOTP, ModalContentContact } from "../modals/account";



const Metriffic = () => {
    const navigate = useNavigate();

    const [show_am_tab, set_show_am_tab] = useState(false);
    const [show_profile_tab, set_show_profile_tab] = useState(false);

    const logged_in_user = useSelector(state => state.utils.logged_in_user);
    const modal_content = useSelector(state => state.utils.modal_content);
    const dock_layout = useRef(undefined);

    const dock_layout_wrapper = useCallback((node) => {
      dock_layout.current = node;
    }, []);

    useEffect(() => {
        ReactGA.initialize("G-0BB9RR5QRK");
        ReactGA.send({ hitType: "pageview", page: "/", title: "main" });
    }, [])

    useEffect(() => {
        if(logged_in_user && !show_profile_tab) on_view_keys_click();
    }, [logged_in_user]);

    let layout_center = {
        dockbox: {
            mode: "horizontal",
            panelLock: true,
            id: 'main_layout',
            children: [
                {
                    id: 'top_tabs_layout',
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
                            // tabs: [KeysTab.tab],
                            tabs:[],
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
            if (current_tab_id === "profile_tab") {
                set_show_profile_tab(false)
            }
        }
    }

    const on_view_keys_click = () => {
        const parent_panel = dock_layout.current.find('left_tabs_layout')
        if(!show_profile_tab) {
            const lt = KeysTab.reload_tab()
            dock_layout.current.dockMove(lt, parent_panel, 'left')
            set_show_profile_tab(true)
        } else {
            const tab = dock_layout.current.find("profile_tab");
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

    const on_signout_click = () => {
        store.dispatch(set_logged_in_user(null));
    }

    const on_signin_click = () => {
        ReactGA.event({
            category: 'signin_menu',
            action: 'Click'
        });
        store.dispatch(set_modal_content(<ModalContentSendOTP/>))
    }

    const on_contact_click = () => {
        ReactGA.event({
            category: 'contact_menu',
            action: 'Click'
        });
        store.dispatch(set_modal_content(<ModalContentContact/>))
    }

    const on_about_click = () => {
        navigate('/about');
    }

    const on_metriffic_cli_click = async () => {
        try {
            const response = await fetch('/download_metriffic_cli', {method: 'GET'})
            console.log('response', response)
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'metriffic-cli.zip';
                link.click();
                window.URL.revokeObjectURL(url);
            } else {
                throw new Error('Network response was not ok.');
            }
        } catch (error) {
            console.error('Download failed:', error);
        }
    }

    const styles = {
        container: {
          height: '80vh',
          width: '100%',
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        },
        title: {
          fontSize: '80px',
          color: 'black',
          fontWeight: 200,
          marginBottom: '8px',
        },
        subtitle: {
          fontSize: '15px',
          fontWeight: 400,
          color: 'black',
        },
      };


    const logged_in_page = () => (
        <>
        <Navbar
            id='top-panel'>
            <Nav>
                <NavDropdown
                    title="account"
                    id="basic-nav-dropdown"
                    renderMenuOnMount={true}>
                    <NavDropdown.Item
                        onClick={on_view_keys_click}>
                        keys
                        {show_profile_tab ? <CheckIcon style={{ width:14, height:14, float: 'right', marginTop:'4px', marginLeft:'5px'}} /> : ''}
                    </NavDropdown.Item>
                    <NavDropdown.Item
                        onClick={on_signout_click}>
                        sign out
                    </NavDropdown.Item>
                </NavDropdown>
                <NavDropdown
                    title="help"
                    id="basic-nav-dropdown"
                    renderMenuOnMount={true}>
                    <NavDropdown.Item
                        onClick={on_about_click}>
                        what is this?
                    </NavDropdown.Item>
                    <NavDropdown.Item
                        onClick={on_metriffic_cli_click}>
                        download metriffic-cli source
                    </NavDropdown.Item>
                </NavDropdown>
            </Nav>
        </Navbar>
        <div style={{ position: 'absolute', left: 5, top: 35, right: 5, bottom: 5 }}>
            <DockLayout
                defaultLayout={layout_center}
                ref={dock_layout_wrapper}
                onLayoutChange={on_layout_change}
                style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }}/>
        </div>
        { modal_content ? modal_content : (<></>) }
        </>
    )

    const logged_out_page = () => (
        <>
        <Navbar
            id='top-panel'>
            <Nav>
                <NavDropdown
                    title={<MenuIcon style={{ width:20, height:20 }}/>}
                    id="basic-nav-dropdown"
                    renderMenuOnMount={true}>
                    <NavDropdown.Item
                        // style={{width:'11em'}}
                        onClick={on_signin_click}>
                        sign in
                    </NavDropdown.Item>
                    <NavDropdown.Item
                        // style={{width:'11em'}}
                        onClick={on_contact_click}>
                        get in touch...
                    </NavDropdown.Item>
                    <NavDropdown.Item
                        // style={{width:'11em'}}
                        onClick={on_about_click}>
                        about
                    </NavDropdown.Item>
                </NavDropdown>
            </Nav>
        </Navbar>

        <div style={styles.container}>
            <h1 style={styles.title}>
                Metriffic
            </h1>
            <p style={styles.subtitle}>
                test | measure | analyze
            </p>
        </div>

        { modal_content ? modal_content : (<></>) }
        </>
    )

    return logged_in_user ? logged_in_page() : logged_out_page()
}

export default Metriffic;
