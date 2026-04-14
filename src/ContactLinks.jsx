import { FaEnvelope, FaLinkedin } from 'react-icons/fa'
import { getContactEmail } from './contactEmail.js'

export function ContactLinks({ listClassName, linkClassName, iconClassName, iconOnly = false }) {
    const email = getContactEmail()
    const mailto = email ? `mailto:${email}` : undefined

    return (
        <ul className={listClassName}>
            <li>
                <a
                    className={linkClassName}
                    href={mailto ?? '#'}
                    aria-label={iconOnly ? 'Send Sean an email' : undefined}
                >
                    <FaEnvelope className={iconClassName} aria-hidden="true" />
                    {iconOnly ? null : <span>{email}</span>}
                </a>
            </li>
            <li>
                <a
                    className={linkClassName}
                    href="https://www.linkedin.com/in/seanoconnor-info/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={iconOnly ? "Sean O'Connor on LinkedIn" : undefined}
                >
                    <FaLinkedin className={iconClassName} aria-hidden="true" />
                    {iconOnly ? null : <span>LinkedIn</span>}
                </a>
            </li>
        </ul>
    )
}
