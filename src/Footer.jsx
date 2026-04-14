import { ContactLinks } from './ContactLinks.jsx'
import './css/Footer.css'

function Footer() {
    return (
        <footer id="contact" className="reveal-on-scroll">
            <div className="footer-inner">
                <section className="footer-contact" aria-labelledby="contact-heading">
                    <h2 id="contact-heading" className="footer-contact-heading noto-serif">
                        Contact
                    </h2>
                    <ContactLinks
                        listClassName="footer-contact-links"
                        linkClassName="footer-contact-link"
                        iconClassName="footer-contact-icon"
                    />
                </section>                <div className="copyright">
                    <p>© Copyright {new Date().getFullYear()} Sean O&apos;Connor</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer