import React, { useState } from "react";
import Modal from "./modal/Modal";
import OptionModal from "./modal/OptionModal";
import '../App.css';

function Sidebar(props) {
    const [howToUseModalOpen, setHowToUseModalOpen] = useState(false);
    const [optionModalOpen, setOptionModalOpen] = useState(false);
    const [developModalOpen, setDevelopModalOpen] = useState(false);
    const [value, setValue] = useState(12);

    const openHowToUseModal = () => {
        setHowToUseModalOpen(true);
    }
    const closeHowToUseModal = () => {
        setHowToUseModalOpen(false);
    }
    const opendevelopModal = () => {
        setDevelopModalOpen(true);
    }
    const closedevelopModal = () => {
        setDevelopModalOpen(false);
    }
    const openOptionModal = () => {
        setOptionModalOpen(true);
    }
    const closeOptionModal = () => {
        setOptionModalOpen(false);
    }

    const handleInputChange = (e) => {
        if (e.target.value < 0) {
            e.target.value = 0;
        }
        if (e.target.value > 500) {
            e.target.value = 500;
        }
        setValue(e.target.value);
    };

    const handleButtonClick = () => {
        props.changeOutputLimit(Number(value));
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
                                    <a onClick={openHowToUseModal}>How to do</a>
                                    <Modal open={howToUseModalOpen} close={closeHowToUseModal} header="How to do image search">
                                        <img className="eximg" src="/image-cropping-example.png"></img>
                                    </Modal>
                                </React.Fragment>
                            </li>
                            <li className="sidebarListItem">
                                <React.Fragment>
                                    <a onClick={opendevelopModal}>Developer</a>
                                    <Modal open={developModalOpen} close={closedevelopModal} header="Developers">
                                        <div className="developer">
                                            구윤형 (조장)
                                            <br />
                                            학번 : 20205112
                                        </div>
                                        <br />
                                        <div className="developer">
                                            ODONKHUU ZOLBOO
                                            <br />
                                            학번 : 20208008
                                        </div>
                                        <br />
                                        <div className="developer">
                                            강명재
                                            <br />
                                            학번 : 20215102
                                        </div>
                                    </Modal>
                                </React.Fragment>
                            </li>
                            <li className="sidebarListItem">
                                <React.Fragment>
                                    <a onClick={openOptionModal}>Option</a>
                                    <OptionModal open={optionModalOpen} close={closeOptionModal} header="change setting">
                                        <input type="number" value={value} onChange={handleInputChange}></input>
                                        <button onClick={handleButtonClick}>change</button>
                                    </OptionModal>
                                </React.Fragment>
                            </li>
                        </React.Fragment>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Sidebar;