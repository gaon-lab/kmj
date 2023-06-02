import { useState, useRef, useEffect } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import axios from 'axios';
import './App.css';
import saveAs from 'file-saver';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Example() {
    const cropperRef = useRef(null);
    const [image, setImage] = useState(null);
    const [items, setItems] = useState([]);
    const [dragging, setDragging] = useState(false);
    const [processedData, setProcessedData] = useState([]);
    const [divContent, setDivContent] = useState('');

    const [hideList, setHideList] = useState(false); // 추가된 상태 변수  가리기용
    const [showupload, setuploadshow] = useState(false); // 추가된 상태 변수  가리기용

    // 유저가 첨부한 이미지
    const [inputImage, setInputImage] = useState(null);


    // 유저가 선택한 영역만큼 크롭된 이미지
    const [croppedImage, setCroppedImage] = useState(null);

    const onCrop = () => {
        setuploadshow(true);
        const imageElement = cropperRef?.current;
        const cropper = imageElement?.cropper;
        setCroppedImage(cropper.getCroppedCanvas().toDataURL());
        const data = new FormData();
        const croppedImage = cropper.getCroppedCanvas().toDataURL('image/jpeg');
        const blob = dataURItoBlob(croppedImage);
        data.append('filepath', blob, 'croppedImage.jpg');
    };


    const handleImageSend = () => {
        setDivContent(<div style={{ 'text-align': "center", }}><FontAwesomeIcon icon="fa-solid fa-spinner-third" spin /> 로딩중</div>); // myDiv의 내용을 비웁니다.
        setHideList(true);
        if (croppedImage) {
            const imageElement = cropperRef?.current;
            const cropper = imageElement?.cropper;
            const data = new FormData();
            const croppedImage = cropper.getCroppedCanvas().toDataURL('image/jpeg');
            const blob = dataURItoBlob(croppedImage);
            data.append('filepath', blob, 'croppedImage.jpg');

            const setting = { output_limit: 5 }; // 보낼 JSON 데이터
            data.append('setting', JSON.stringify(setting));


            fetch(`http://210.115.229.250:5000/process_image`, {
                method: 'POST',
                body: data,
            })
                .then(response => response.json())
                .then(data => {
                    setDivContent(''); // 컴포넌트가 처음으로 렌더링될 때 myDiv의 내용을 비웁니다.
                    setProcessedData(data);
                    console.log(data);
                    setHideList(false);
                })
                .catch(error => {
                    console.error('Error sending image:', error);
                });
        }
    };


    // Data URL을 Blob으로 변환하는 함수
    function dataURItoBlob(dataURI) {
        const byteString = atob(dataURI.split(',')[1]);
        const mimeString = 'image/jpeg';
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
    }


    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        setInputImage(URL.createObjectURL(file));
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };


    const research = () => {
        setuploadshow(false);
    };


    return (
        <>
            <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
                <div class="container">
                    <a class="navbar-brand" href="#">이미지 검색 시스템</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                            <li class="nav-item">
                                <a class="nav-link" aria-current="page" href="#" onClick={research}>재검색</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <br></br>

            <div className="container" >
                {/* 드래그앤드랍 + 이미지 첨부 */}
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    style={{
                        width: '100%',
                        minHeight: '300px',
                        border: '2px dashed gray',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        display: showupload ? 'none' : 'flex'
                    }}
                >
                    <input type="file" accept="image/*" onChange={e => setInputImage(URL.createObjectURL(e.target.files[0]))} />
                </div>
                {/* 종료 */}
                <br></br>

                {/* 이미지 자르기 영역 */}
                <div className="col-12" >
                    <Cropper
                        src={inputImage}
                        crop={onCrop}
                        ref={cropperRef}

                    />
                </div>
                {/* 종료 */}


                <br></br>
                <button type="button" class="btn btn-info col-12" onClick={handleImageSend}>이미지 보내기</button>

                <br /><br />
                <div id="myDiv" >
                    {divContent}

                    <div class="row" id="list" style={{ display: hideList ? 'none' : 'flex' }} >
                        {processedData.map((item, index) => (
                            <div id="{key}" class="col-md-4 col-lg-2 col-12">
                                <div class="card">
                                    <img style={{ "height": "200px" }} src={`http://210.115.229.250:5000/static/img/${item.class}/${item.path}`} ></img>
                                </div>
                                <br />
                            </div>
                        ))}
                    </div>
                </div>

                <hr></hr>
                <p>copyright &copy; oslab </p>
            </div>
        </>
    );
}
export default Example;