"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  Truck,
  Map,
  Building2,
  FileText,
  Settings,
  Warehouse,
  ChevronDown,
  Menu,
  X,
} from "lucide-react"
import { supabase } from "../../lib/supabase"
import { useTranslation } from "react-i18next"

const TopNav = () => {
  const { t } = useTranslation()
  const [setups, setSetups] = useState<any>([])
  const [selectedSetup, setSelectedSetup] = useState<string>(() => {
    return localStorage.getItem("foxtow_id") || ""
  })
  const [isOpen, setIsOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile on mount and when window resizes
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  const fetchSetup = async () => {
    const { data, error } = await supabase.from("setup").select("company")

    const uniqueData = data?.reduce((acc: any, current: any) => {
      if (!acc.some((item: any) => item.company === current.company)) {
        acc.push(current)
      }
      return acc
    }, [])

    if (error) {
      console.error("Error fetching dispatch:", error)
    } else {
      setSetups([...uniqueData, { company: "FOXTOW" }])
    }
  }

  useEffect(() => {
    fetchSetup()
  }, []) // Added empty dependency array

  const handleSetupChange = (setupId: string) => {
    setSelectedSetup(setupId)
    localStorage.setItem("foxtow_id", setupId)
    setIsOpen(false)
    window.location.reload()
  }

  const navItems = [
    { to: "/dashboard", icon: <LayoutDashboard size={20} />, label: t("nav.dashboard") },
    { to: "/dispatch", icon: <Truck size={20} />, label: t("nav.dispatching") },
    { to: "/map", icon: <Map size={20} />, label: t("nav.map") },
    { to: "/impound", icon: <Warehouse size={20} />, label: t("nav.impounds") },
    { to: "/account", icon: <Building2 size={20} />, label: t("nav.accounts") },
    { to: "/report", icon: <FileText size={20} />, label: t("nav.reports") },
    { to: "/setting", icon: <Settings size={20} />, label: t("nav.settings") },
  ]

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (isMobileMenuOpen && !target.closest(".mobile-menu") && !target.closest(".menu-button")) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <div className="bg-[#002B7F] text-white px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {isMobile && (
              <button className="mr-3 menu-button" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                <Menu size={24} />
              </button>
            )}
            <div className="flex items-center">
              <Truck className="w-8 h-8 mr-2" />
              <span className="text-xl font-bold">{t("brand.name")}</span>
            </div>
          </div>

          {!isMobile && (
            <nav className="flex items-center space-x-4 ml-6">
              {navItems.map((item) => (
                <NavItem key={item.to} to={item.to} icon={item.icon} label={item.label} />
              ))}
            </nav>
          )}

          <div className="relative z-50">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center space-x-2 bg-blue-800 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span>
                {selectedSetup
                  ? setups.find((s: any) => s.company === selectedSetup)?.company || t("setup.select")
                  : t("setup.select")}
              </span>
              <ChevronDown size={20} className={`transform transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-[100]">
                {setups.map((setup: any) => (
                  <button
                    key={setup.company}
                    onClick={() => handleSetupChange(setup.company)}
                    className={`w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 ${
                      selectedSetup === setup.company ? "bg-gray-100" : ""
                    }`}
                  >
                    {setup.company}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobile && (
        <div className={`fixed inset-0 z-40 ${isMobileMenuOpen ? "block" : "hidden"}`}>
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="absolute top-0 left-0 h-full w-64 bg-[#002B7F] shadow-lg transform transition-transform mobile-menu">
            <div className="flex justify-between items-center p-4 border-b border-blue-700">
              <div className="flex items-center">
                <Truck className="w-6 h-6 mr-2" />
                <span className="text-white font-bold">{t("brand.name")}</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X size={24} className="text-white" />
              </button>
            </div>
            <nav className="flex flex-col p-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `
                    flex items-center px-3 py-3 rounded-lg cursor-pointer text-white
                    ${isActive ? "bg-blue-700" : "hover:bg-blue-800"}
                  `}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}

const NavItem = ({ icon, label, to }: { icon: React.ReactNode; label: string; to: string }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        flex items-center px-3 py-2 rounded-lg cursor-pointer
        ${isActive ? "bg-blue-700" : "hover:bg-blue-800"}
      `}
    >
      {icon}
      <span className="ml-2 text-sm">{label}</span>
    </NavLink>
  )
}

export default TopNav

