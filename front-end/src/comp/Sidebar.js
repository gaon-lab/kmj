import React, { useState } from "react";
import Modal from "./Modal";
import '../App.css';

function Sidebar() {
    const [modalOpen, setModalOpen] = useState(false);

    const openModal = () => {
        setModalOpen(true);
    };
    const closeModal = () => {
        setModalOpen(false);
    };

    return (
        <div className="sidebar">
            <div className="sidebarWrapper">
                <div className="sidebarMenu">
                    <h3 className="sidebarTitle">Image Search</h3>
                    <ul className="sidebarList">
                        <React.Fragment>
                            <li className="sidebarListItem"><a href="/home">Home</a></li>
                            <li className="sidebarListItem">
                                <React.Fragment>
                                    <a onClick={openModal}>How to do</a>
                                    <Modal open={modalOpen} close={closeModal} header="How to do image search">
                                        <img className="eximg" src="/image-cropping-example.png"></img>
                                    </Modal>
                                </React.Fragment>
                            </li>
                            <li className="sidebarListItem">Option</li>
                        </React.Fragment>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Sidebar;