import Nav from './Nav.jsx'
import './css/Header.css'

function Header() {
    return (
    <header>
        <div className="interior">
            <div className="title">
                <h1>Sean O'Connor</h1>
                <h2>Interactive Creative Developer</h2>
            </div>
            <Nav />
        </div>
    </header>
    )
}

export default Header