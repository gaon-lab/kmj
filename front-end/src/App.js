import './App.css';
import Main from './comp/Main';
import Sidebar from './comp/Sidebar';
import {useState} from "react";

function App() {
  const [outputLimit, setOutputLimit] = useState(12);

  const changeOutputLimit = (limit) => {
    setOutputLimit(limit);
  }

  return (
    <div className="App">
      <div className="conatiner">
        <div className="sd">
          <Sidebar changeOutputLimit={changeOutputLimit}/>
        </div>
        <div className="ma">
          <Main outputLimit={outputLimit}/>
        </div>
      </div>
    </div>
  );
}

export default App;
