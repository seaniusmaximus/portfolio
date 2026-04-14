import { createElement, useEffect, useRef, useState } from 'react'
import './css/Skills.css'
import {
    SiReact,
    SiAngular,
    SiJavascript,
    SiHtml5,
    SiCss,
    SiNodedotjs,
    SiNpm,
    SiFigma,
    SiTypescript,
    SiVite,
    SiGreensock,
    SiWebpack,
    SiJest,
    SiChai,
    SiMocha
} from 'react-icons/si'
import {
    TbBrandAdobePhotoshop,
    TbBrandAdobeIllustrator,
    TbBrandAdobeIndesign,
    TbBrandAdobeAfterEffect
} from 'react-icons/tb'
import { FaAws } from 'react-icons/fa'

function Skills() {
    const [activeSkill, setActiveSkill] = useState(0)
    const [gridLayout, setGridLayout] = useState({
        cols: 5,
        hexSize: 120,
        hexStep: 116.4,
        hexHalf: 58.2,
        rowOverlap: 14
    })
    const gridRef = useRef(null)

    const skills = [
        { name: 'React', icon: SiReact, color: '#61DAFB' },
        { name: 'Angular', icon: SiAngular, color: '#DD0031' },
        { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
        { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
        { name: 'HTML5', icon: SiHtml5, color: '#E34F26' },
        { name: 'CSS3', icon: SiCss, color: '#1572B6' },
        { name: 'Node.js', icon: SiNodedotjs, color: '#339933' },
        { name: 'npm', icon: SiNpm, color: '#CB3837' },
        { name: 'Figma', icon: SiFigma, color: '#A259FF' },
        { name: 'Vite', icon: SiVite, color: '#646CFF' },
        { name: 'Webpack', icon: SiWebpack, color: '#8DD6F9' },
        { name: 'Jest', icon: SiJest, color: '#C21325' },
        { name: 'AWS', icon: FaAws, color: '#FF9900' },
        { name: 'Chai', icon: SiChai, color: '#A30701' },
        { name: 'Mocha', icon: SiMocha, color: '#8D6748' },
        { name: 'GreenSock', icon: SiGreensock, color: '#88CE02' },
        { name: 'Photoshop', icon: TbBrandAdobePhotoshop, color: '#31A8FF' },
        { name: 'Illustrator', icon: TbBrandAdobeIllustrator, color: '#FF9A00' },
        { name: 'InDesign', icon: TbBrandAdobeIndesign, color: '#FF3366' },
        { name: 'After Effects', icon: TbBrandAdobeAfterEffect, color: '#9999FF' }
    ]

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveSkill((prev) => {
                const next = Math.floor(Math.random() * skills.length)
                return next === prev ? (next + 1) % skills.length : next
            })
        }, 3000)

        return () => clearInterval(timer)
    }, [skills.length])

    useEffect(() => {
        const calculateGrid = () => {
            const gridWidth = gridRef.current?.clientWidth
            if (!gridWidth) return

            const viewportWidth = window.innerWidth
            const preferredSize = viewportWidth <= 600 ? 92 : viewportWidth <= 800 ? 98 : viewportWidth <= 1200 ? 108 : 120
            const rowOverlap = viewportWidth <= 800 ? 10 : 14
            const stepRatio = 0.97
            const preferredStep = preferredSize * stepRatio

            const maxColumns = Math.max(2, Math.floor((gridWidth + preferredStep / 2) / preferredStep))
            const cols = Math.min(skills.length, maxColumns)
            const hexStep = gridWidth / (cols + 0.5)
            const hexSize = hexStep / stepRatio

            setGridLayout({
                cols,
                hexSize,
                hexStep,
                hexHalf: hexStep / 2,
                rowOverlap
            })
        }

        const observer = new ResizeObserver(calculateGrid)
        if (gridRef.current) {
            observer.observe(gridRef.current)
        }
        calculateGrid()

        window.addEventListener('resize', calculateGrid)
        return () => {
            observer.disconnect()
            window.removeEventListener('resize', calculateGrid)
        }
    }, [skills.length])

    return (
        <section className="skills reveal-on-scroll" id="skills">
            <div className="skills-inner">
                <div className="skills-layout">
                    <ul
                        className="skills-grid"
                        ref={gridRef}
                        style={{
                            '--grid-cols': gridLayout.cols,
                            '--hex-size': `${gridLayout.hexSize}px`,
                            '--hex-step': `${gridLayout.hexStep}px`,
                            '--hex-half': `${gridLayout.hexHalf}px`,
                            '--hex-row-overlap': `${gridLayout.rowOverlap}px`
                        }}
                    >
                        {skills.map(({ name, icon, color }, index) => (
                            (() => {
                                const rowIndex = Math.floor(index / gridLayout.cols)
                                const isOffsetRow = rowIndex % 2 === 1
                                const isFirstRow = rowIndex === 0
                                return (
                            <li
                                className={`skills-item reveal-on-scroll ${index === activeSkill ? 'is-active' : ''}`}
                                key={name}
                                style={{
                                    '--skill-color': color,
                                    transitionDelay: `${index * 10}ms`,
                                    marginLeft: isOffsetRow ? `${gridLayout.hexHalf}px` : '0px',
                                    marginTop: isFirstRow ? '0px' : `${-gridLayout.rowOverlap}px`,
                                    marginBottom: `${-gridLayout.rowOverlap}px`
                                }}
                            >
                                <div className="skills-hex-border">
                                    <div className="skills-hex-inner">
                                        {createElement(icon, { size: 36, 'aria-hidden': 'true', focusable: 'false' })}
                                        <span>{name}</span>
                                    </div>
                                </div>
                            </li>
                                )
                            })()
                        ))}
                    </ul>
                    <div className="skills-copy">
                        <h3 className="noto-serif">Core Skills</h3>
                        <p>
                            I like to blend front-end engineering, visual design, and motion to
                            create digital experiences that are both beautiful and functional. From modern JavaScript
                            frameworks and testing workflows to animation platforms and Adobe Creative Suite tools, I
                            choose the right stack for the story, the brand, and the user.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Skills