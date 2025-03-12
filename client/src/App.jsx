import { Link, Outlet } from "react-router-dom"

function App() {
  return (
    <>
      <ul>
        <li>
          <Link to="/">Start</Link>
        </li>
        <li>
          <Link to="/products/new">Skapa produkt</Link>
        </li>
      </ul>
      <Outlet />
    </>
  )
}

export default App
