import React, { Component } from "react";
import { MdDehaze, MdAdd, MdSave } from "react-icons/md";

export default class Navbar extends Component {
    render(){
        const { toggleSidebar, closeSidebar, openSaveModal, wordIsInLimit, history } = this.props;
        return(
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow" onClick={e => closeSidebar(e)}>
                <button className="sidebar-toggler" onClick={e => toggleSidebar(e)}><MdDehaze/></button>
                <span className="navbar-brand m-0 ml-4 h1">Text Editor</span>
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item" 
                        onClick={() => history.push({
                            pathname: "/",
                            state: "new"
                        })}>
                        <span className="nav-link"><MdAdd className="mb-md-1"/> Create</span>
                    </li>
                    <li 
                        className={`nav-item ${wordIsInLimit ? "" : "disabled"}`}
                        onClick={e => openSaveModal(e)}>
                        <span className="nav-link"><MdSave className="mb-md-1"/> Save</span>
                    </li>
                </ul>
            </nav>
        )
    }
}