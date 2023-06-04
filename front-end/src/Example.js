import { useState, useRef, useEffect } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import axios from 'axios';
import './App.css';
import saveAs from 'file-saver';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

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

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);

  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.5/font/bootstrap-icons.min.css" />
      <div class="container-fluid">
        <div class="row">
          <div class="col-sm-auto bg-light sticky-top">
            <div class="d-flex flex-sm-column flex-row flex-nowrap bg-light align-items-center sticky-top">
              <a href="/" class="d-block p-3 link-dark text-decoration-none" title="" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Icon-only">
                <i class="bi-house fs-1"></i>
              </a>
              <ul class="nav nav-pills nav-flush flex-sm-column flex-row flex-nowrap mb-auto mx-auto text-center justify-content-between w-100 px-3 align-items-center">
                <li>
                  <a href="#" class="nav-link py-3 px-2" title="" data-bs-toggle="tooltip" onClick={research} data-bs-placement="right" data-bs-original-title="Dashboard">
                    <i class="bi bi-arrow-clockwise fs-1"></i>
                  </a>
                </li>
                <li>
                  <a href="#" class="nav-link py-3 px-2" title="" data-bs-toggle="tooltip" onClick={handleShow} data-bs-placement="right" data-bs-original-title="Customers">
                    <i class="bi-people fs-1"></i>
                  </a>
                </li>
                <li>
                  <a href="#" class="nav-link py-3 px-2" title="" data-bs-toggle="tooltip" onClick={handleShow2} data-bs-placement="right" data-bs-original-title="Customers">
                    <i class="bi bi-question-square fs-1"></i>
                  </a>
                </li>

              </ul>
    
            </div>
          </div>
          <div class="col-sm p-3 min-vh-100">
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

          </div>
        </div>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>개발자 소개</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          구윤형<br></br>
          강명재, 절버
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn_close" variant="secondary" onClick={handleClose}>
            닫기
          </Button>
        </Modal.Footer>
      </Modal>


      <Modal show={show2} onHide={handleClose2}>
        <Modal.Header>
          <Modal.Title>이미지 검색</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          이미지를 검색 할 수 있는 시스템 입니다<br />
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn_close" variant="secondary" onClick={handleClose2}>
            닫기
          </Button>
        </Modal.Footer>
      </Modal>


    </>
    //onClick={research}
  );
}
export default Example;
