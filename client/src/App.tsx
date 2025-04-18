import { Outlet } from 'react-router'

function App() {

  return (

    <div className="app">
      <div className="title">Utah Freight Routes and Stops Visualization Tool</div>
      <div className='container'>
        <Outlet />
      </div>
    </div>

  )
}

export default App
