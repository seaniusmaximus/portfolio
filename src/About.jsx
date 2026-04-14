import { useMediaQuery } from 'react-responsive'
import { ContactLinks } from './ContactLinks.jsx'
import './css/About.css'
import headshot from './assets/headshot.jpg'

function About() {
    const Desktop = ({ children }) => {
    const isDesktop = useMediaQuery({ minWidth: 992 })
    return isDesktop ? children : null
    }
    const Tablet = ({ children }) => {
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 })
    return isTablet ? children : null
    }
    const Mobile = ({ children }) => {
    const isMobile = useMediaQuery({ maxWidth: 767 })
    return isMobile ? children : null
    }

    return (
    <>
    <Desktop>
        <section className="about reveal-on-scroll" id="about">
            <div className="copy">
                <h3 className="noto-serif">A versatile creative coder</h3>
                <p>with close to 20 years experience with titles such as Front-End Engineer, Interactive Developer, Graphic Designer, and Flash Animator. I’ve worked with a wide range of teams including sales, marketing, creative, and development. Whatever the role, I’m always ready to tackle a creative project.</p>
                <ContactLinks
                    listClassName="about-contact-links"
                    linkClassName="about-contact-link"
                    iconClassName="about-contact-icon"
                    iconOnly
                />
            </div>
            <div className='headshot'>
                <img className='headshot-hex' src={headshot} />
                <img className='headshot-bg' src={headshot} />
            </div>
        </section>
    </Desktop>

    <Tablet>
        <section className="about reveal-on-scroll" id="about">
            <div className="copy">
                <h3 className="noto-serif">A versatile creative coder</h3>
                <p>with close to 20 years experience with titles such as Front-End Engineer, Interactive Developer, Graphic Designer, and Flash Animator. I’ve worked with a wide range of teams including sales, marketing, creative, and development. Whatever the role, I’m always ready to tackle a creative project.</p>
                <ContactLinks
                    listClassName="about-contact-links"
                    linkClassName="about-contact-link"
                    iconClassName="about-contact-icon"
                    iconOnly
                />
            </div>
            <div className='headshot'>
                <img className='headshot-hex' src={headshot} />
                <img className='headshot-bg' src={headshot} />
            </div>
        </section>
    </Tablet>

    <Mobile>
        <section className="about reveal-on-scroll" id="about">
            <div className='headshot'>
                <img className='headshot-hex' src={headshot} />
                <img className='headshot-bg' src={headshot} />
            </div>
            <div className="copy">
                <h3 className="noto-serif">A versatile creative coder</h3>
                <p>with close to 20 years experience with titles such as Front-End Engineer, Interactive Developer, Graphic Designer, and Flash Animator. I’ve worked with a wide range of teams including sales, marketing, creative, and development. Whatever the role, I’m always ready to tackle a creative project.</p>
                <ContactLinks
                    listClassName="about-contact-links"
                    linkClassName="about-contact-link"
                    iconClassName="about-contact-icon"
                    iconOnly
                />
            </div>
        </section>
    </Mobile>
    </>
    )
}

export default About