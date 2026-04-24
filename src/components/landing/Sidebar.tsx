'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Grid3X3, Tag, User, Zap, HelpCircle, ShoppingCart, Shield, ChevronUp } from 'lucide-react'
import Link from 'next/link'

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isFooterOpen, setIsFooterOpen] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const menuItems = [
    { id: 'home', label: 'Home', icon: <Home size={20} />, href: '#home' },
    { id: 'fitur', label: 'Fitur', icon: <Zap size={20} />, href: '#fitur' },
    { id: 'katalog', label: 'Katalog', icon: <Grid3X3 size={20} />, href: '#catalog' },
    { id: 'harga', label: 'Harga', icon: <Tag size={20} />, href: '#pricing' },
    { id: 'order', label: 'Order', icon: <ShoppingCart size={20} />, href: '#order' },
    { id: 'faq', label: 'FAQ', icon: <HelpCircle size={20} />, href: '#faq' },
    { id: 'admin', label: 'Admin', icon: <Shield size={20} />, href: '/login?role=admin' },
    { id: 'member', label: 'Member', icon: <User size={20} />, href: '/login?role=member' },
  ]

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      const element = document.getElementById(href.replace('#', ''))
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <>
      <div id="nav-bar" className={isOpen ? 'collapsed' : ''}>
        <input 
          type="checkbox" 
          id="nav-toggle" 
          checked={isOpen} 
          onChange={() => setIsOpen(!isOpen)} 
        />
        
        <div id="nav-header">
          <Link href="/" id="nav-title">
             AK<span>A</span>INVITATION
          </Link>
          <label htmlFor="nav-toggle">
            <span id="nav-toggle-burger"></span>
          </label>
        </div>

        <div id="nav-content">
          {menuItems.map((item, index) => (
            <a 
              key={item.id} 
              href={item.href} 
              className="nav-button"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={(e) => handleScroll(e, item.href)}
            >
              <i className="nav-icon">{item.icon}</i>
              <span>{item.label}</span>
            </a>
          ))}
          <div 
            id="nav-content-highlight" 
            style={{ 
              top: hoveredIndex !== null ? `${hoveredIndex * 54 + 16}px` : '-100px',
              opacity: hoveredIndex !== null ? 1 : 0
            }}
          />
        </div>

        <input 
          type="checkbox" 
          id="nav-footer-toggle" 
          checked={isFooterOpen}
          onChange={() => setIsFooterOpen(!isFooterOpen)}
        />
        <div id="nav-footer">
          <div id="nav-footer-heading">
            <div id="nav-footer-avatar">
              <img src="/logo.png" alt="Logo" onError={(e) => { e.currentTarget.src = 'https://gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' }} />
            </div>
            <div id="nav-footer-titlebox">
              <span id="nav-footer-title">AKA Team</span>
              <span id="nav-footer-subtitle">Support</span>
            </div>
            <label htmlFor="nav-footer-toggle">
              <ChevronUp size={20} />
            </label>
          </div>
          <div id="nav-footer-content">
            Platform undangan pernikahan digital terbaik dengan fitur terlengkap dan kemudahan pengelolaan data.
          </div>
        </div>
      </div>

      <style jsx global>{`
        :root {
          --background: #e0e5ec;
          --navbar-width: 256px;
          --navbar-width-min: 80px;
          --navbar-dark-primary: #9B1FE8;
          --navbar-dark-secondary: #7b19ba;
          --navbar-light-primary: #f5f6fa;
          --navbar-light-secondary: #e0e0e0;
        }

        #nav-bar {
          position: fixed;
          left: 1vw;
          top: 1vw;
          height: calc(100% - 2vw);
          background: var(--navbar-dark-primary);
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          color: var(--navbar-light-primary);
          font-family: 'Josefin Sans', sans-serif;
          overflow: hidden;
          user-select: none;
          z-index: 1000;
          transition: width .2s;
          width: var(--navbar-width);
          box-shadow: 10px 0 30px rgba(155, 31, 232, 0.2);
        }

        #nav-bar.collapsed {
          width: var(--navbar-width-min);
        }

        #nav-bar input[type="checkbox"] {
          display: none;
        }

        #nav-header {
          position: relative;
          width: 100%;
          min-height: 80px;
          display: flex;
          align-items: center;
          padding: 0 16px;
          transition: width .2s;
        }

        #nav-title {
          font-size: 1.2rem;
          font-weight: 900;
          letter-spacing: 1px;
          text-decoration: none;
          color: white;
          white-space: nowrap;
          transition: opacity .2s;
        }

        #nav-title span {
            color: #ffde59;
        }

        #nav-bar.collapsed #nav-title {
          opacity: 0;
          pointer-events: none;
        }

        label[for="nav-toggle"] {
          position: absolute;
          right: 16px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        #nav-bar.collapsed label[for="nav-toggle"] {
            right: 50%;
            transform: translateX(50%);
        }

        #nav-toggle-burger {
          position: relative;
          width: 16px;
          height: 2px;
          background: rgba(255,255,255,0.5);
          border-radius: 99px;
          transition: background .2s;
        }

        #nav-toggle-burger:before, #nav-toggle-burger:after {
          content: '';
          position: absolute;
          width: 12px;
          height: 2px;
          background: white;
          border-radius: 99px;
          transition: .2s;
        }

        #nav-toggle-burger:before {
          top: -6px;
          transform: translate(2px, 8px) rotate(30deg);
        }

        #nav-toggle-burger:after {
          top: 6px;
          transform: translate(2px, -8px) rotate(-30deg);
        }

        #nav-bar.collapsed #nav-toggle-burger {
            background: white;
        }
        #nav-bar.collapsed #nav-toggle-burger:before, 
        #nav-bar.collapsed #nav-toggle-burger:after {
            width: 16px;
            transform: none;
            left: 0;
        }
        #nav-bar.collapsed #nav-toggle-burger:before { top: -6px; }
        #nav-bar.collapsed #nav-toggle-burger:after { top: 6px; }

        #nav-content {
          margin: -16px 0;
          padding: 16px 0;
          position: relative;
          flex: 1;
          width: 100%;
          direction: rtl;
          overflow-y: auto;
          overflow-x: hidden;
        }

        #nav-content::-webkit-scrollbar {
          width: 4px;
        }
        #nav-content::-webkit-scrollbar-thumb {
          border-radius: 99px;
          background-color: rgba(255,255,255,0.2);
        }

        .nav-button {
          position: relative;
          margin-left: 16px;
          height: 54px;
          display: flex;
          align-items: center;
          color: rgba(255,255,255,0.7);
          direction: ltr;
          cursor: pointer;
          z-index: 1;
          transition: color .2s;
          text-decoration: none;
          padding: 0 16px;
        }

        .nav-button:hover {
          color: var(--navbar-dark-primary);
        }

        .nav-button span {
          transition: opacity .2s;
          margin-left: 16px;
          font-weight: 600;
          font-size: 0.9rem;
        }

        #nav-bar.collapsed .nav-button span {
          opacity: 0;
        }

        .nav-icon {
          min-width: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: min-width .2s;
        }

        #nav-bar.collapsed .nav-icon {
          min-width: calc(100% - 16px);
        }

        #nav-content-highlight {
          position: absolute;
          left: 16px;
          width: calc(100% - 16px);
          height: 54px;
          background: var(--background);
          border-radius: 16px 0 0 16px;
          transition: top .2s, opacity .2s;
          z-index: 0;
        }

        #nav-content-highlight:before, #nav-content-highlight:after {
          content: '';
          position: absolute;
          right: 0;
          width: 32px;
          height: 32px;
          border-radius: 50%;
        }

        #nav-content-highlight:before {
          bottom: 100%;
          box-shadow: 16px 16px var(--background);
        }

        #nav-content-highlight:after {
          top: 100%;
          box-shadow: 16px -16px var(--background);
        }

        #nav-footer {
          position: relative;
          width: calc(100% - 16px);
          margin: 8px;
          min-height: 54px;
          background: var(--navbar-dark-secondary);
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          z-index: 2;
          transition: height .2s;
          overflow: hidden;
        }

        #nav-footer-heading {
          position: relative;
          width: 100%;
          height: 54px;
          display: flex;
          align-items: center;
        }

        #nav-footer-avatar {
          position: relative;
          margin-left: 12px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          overflow: hidden;
          background: white;
          padding: 2px;
        }

        #nav-footer-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }

        #nav-footer-titlebox {
          position: relative;
          margin-left: 12px;
          flex: 1;
          display: flex;
          flex-direction: column;
          transition: opacity .2s;
        }

        #nav-footer-title {
            font-size: 0.8rem;
            font-weight: 700;
        }

        #nav-footer-subtitle {
          color: rgba(255,255,255,0.5);
          font-size: .6rem;
        }

        #nav-bar.collapsed #nav-footer-titlebox {
          opacity: 0;
        }

        label[for="nav-footer-toggle"] {
          width: 3rem;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform .2s;
        }

        #nav-bar.collapsed label[for="nav-footer-toggle"] {
            opacity: 0;
            pointer-events: none;
        }

        #nav-bar.collapsed #nav-footer {
            height: 54px;
        }

        #nav-footer-content {
          padding: 16px;
          color: rgba(255,255,255,0.7);
          font-size: .75rem;
          line-height: 1.4;
          border-top: solid 1px rgba(255,255,255,0.1);
        }

        #nav-bar:not(.collapsed) #nav-footer-toggle:checked + #nav-footer {
          height: 150px;
        }

        #nav-bar:not(.collapsed) #nav-footer-toggle:checked + #nav-footer label[for="nav-footer-toggle"] {
          transform: rotate(180deg);
        }
      `}</style>
    </>
  )
}
