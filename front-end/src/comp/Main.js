import React, {useState} from 'react';
import axios from 'axios';
import '../App.css';

function Main(props) {
    const [image, setImage] = useState(null);
    const [items, setItems] = useState([]);
    const [dragging, setDragging] = useState(false);
    let outputLimit = props.outputLimit;

    const handleDrop = async (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
            const base64data = reader.result;
            setImage(base64data);
            try {
                const formData = new FormData();
                formData.append("filepath", dataURItoBlob(base64data), file.name);

                const setting = {
                    "output_limit": outputLimit,
                };

                formData.append("setting", JSON.stringify(setting))

                const response = await axios.post('http://210.115.229.250:5000/process_image', formData);
                console.log(response.data);
                setItems(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        setDragging(false);
    };

    // dataURItoBlob 함수 추가
    const dataURItoBlob = (dataURI) => {
        const byteString = atob(dataURI.split(',')[1]);
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], {type: mimeString});
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragging(false);
    };

    return (
        <>
            <div className={dragging ? "dragging" : ""} onDrop={handleDrop} onDragOver={handleDragOver}
                 onDragLeave={handleDragLeave}>
                <h1 className="container">Drag and Drop Image Search</h1>
                <div className="dropzone">
                    <p>Drop an image here <br/> to search for similar images</p>
                </div>
                <div className="image-container">
                    {image && <img src={image} alt="Dropped Image"/>}
                </div>
            </div>
            <div>
                <div>
                    {
                        items.length === 0 ? <div className="intro-text">안녕하세요! 저희는 패션과 관련된 폐쇄형 유사 이미지 사이트를 운영하고 있습니다.
                            현재까지 6000장의 다양한 패션 이미지셋을 보유하고 있으며, 이 중 코트, 드레스, 후드티, 맨투맨, 스웨터, 셔츠의 6개 카테고리로 구분되어 각각 1000장씩 이미지를 저장하였습니다.
                            더불어, 우리 사이트는 사용자들에게 새로운 기능을 제공하고 있습니다. 단지 이미지를 드래그 앤 드롭하면, 원하는 패션 이미지와 유사한
                            이미지들을 추출해주는 기능을 제공하고 있습니다. 이 기능을 통해 사용자들은 자신의 취향과 스타일에 맞는 다양한 패션 아이템을 탐색하고 발견할 수 있습니다.
                            우리 사이트는 패션에 관심 있는 분들을 위한 창조적인 공간으로서, 다양한 스타일과 트렌드를 탐색하고 새로운 아이디어를 얻을 수 있는 장소입니다.
                            저희 사이트를 방문하여 즐거운 패션 여정을 시작해보세요!.<br /><br/>Hello! We run a fashion-related closed similar image site. So far, we have 6,000 different fashion images, and among them, we have saved 1,000 images each, divided into six categories: coat, dress, hoodie, sweatshirt, sweater, and shirt.

                            In addition, our site is providing new features to users. If you just drag and drop an image, it provides a function to extract images similar to the desired fashion image. This feature allows users to explore and discover a variety of fashion items that suit their tastes and styles.

                            Our site is a creative space for those interested in fashion, where you can explore various styles and trends and get new ideas. Visit our site and start a fun fashion journey! </div> : items.map((item, index) => (
                            <img key={index} src={`http://210.115.229.250:5000/static/img/${item.class}/${item.path}`
                            } alt={item.class}/>
                        ))}
                </div>
            </div>
        </>
    );
}

export default Main;
