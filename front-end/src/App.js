import './App.css';
import Main from './comp/Main';
import Sidebar from './comp/Sidebar';

function App() {
  return (
    <div className="App">
      <div className="conatiner">
        <div className="sd">
          <Sidebar />
        </div>
        <div className="ma">
          <Main />
        </div>
      </div>
    </div>
  );
}

export default App;
