import { useEffect } from 'react'
import Header from './Header.jsx'
import About from './About.jsx'
import Skills from './Skills.jsx'
import Work from './Work.jsx'
import Footer from './Footer.jsx'

function App() {
  useEffect(() => {
    const seen = new WeakSet()
    const getNodes = () => Array.from(document.querySelectorAll('.reveal-on-scroll'))
    const isRevealed = (node) => node.dataset.revealed === 'true'
    const markRevealed = (node) => {
      node.dataset.revealed = 'true'
    }
    const revealAll = () => {
      getNodes().forEach(markRevealed)
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      revealAll()
      return undefined
    }

    // Fallback for older/in-app mobile browsers where IntersectionObserver is missing.
    if (typeof window.IntersectionObserver !== 'function') {
      revealAll()
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            markRevealed(entry.target)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.18,
        rootMargin: '0px 0px -8% 0px'
      }
    )

    const registerNodes = () => {
      getNodes().forEach((node) => {
        if (seen.has(node) || isRevealed(node)) return
        seen.add(node)
        observer.observe(node)
      })
    }

    registerNodes()
    const failSafeTimer = window.setTimeout(revealAll, 3000)

    const mutationObserver = new MutationObserver(registerNodes)
    mutationObserver.observe(document.body, { childList: true, subtree: true })
    window.addEventListener('resize', registerNodes)

    return () => {
      window.clearTimeout(failSafeTimer)
      mutationObserver.disconnect()
      window.removeEventListener('resize', registerNodes)
      observer.disconnect()
    }
  }, [])

  return (
    <>
    <Header />
    <About />
    <Work />
    <Skills />
    <Footer />
    </>
  )
}

export default App