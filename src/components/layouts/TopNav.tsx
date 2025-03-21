"use client"

import { useState, useEffect, Fragment } from "react";
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
import { NavItem } from "./NavItem";
import { Drawer } from "@mui/material";

const TopNav = () => {
  const { t } = useTranslation()
  const [setups, setSetups] = useState<any>([])
  const [selectedSetup, setSelectedSetup] = useState<string>(() => {
    return localStorage.getItem("foxtow_id") || ""
  })
  const [isOpen, setIsOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
    void fetchSetup()
  }, [])

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
    // {to:"/truks",   label: t("trucks")}
  ]

  return (
      <Fragment>
        <div className="bg-[#002B7F] text-white px-4 py-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center">
              <button className="mr-3 menu-button block xl:hidden" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu size={24}/>
              </button>

              <div className="flex items-center">
                <Truck className="w-8 h-8 mr-2"/>
                <span className="text-xl font-bold">{t("brand.name")}</span>
              </div>
            </div>

            <nav className="xl:flex md:items-center hidden gap-2">
              {navItems.map((item) => (
                  <NavItem key={item.to} to={item.to} icon={item.icon} label={item.label}/>
              ))}
            </nav>

            <div className="relative z-50">
              <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center space-x-2 bg-blue-800 px-2 py-1 md:px-4 md:py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
              <span className="text-xs sm:text-sm">
                {selectedSetup
                    ? setups.find((s: any) => s.company === selectedSetup)?.company || t("setup.select")
                    : t("setup.select")}
              </span>

                <ChevronDown size={20} className={`transform transition-transform ${isOpen ? "rotate-180" : ""}`}/>
              </button>

              {isOpen && (
                  <div
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-[100] text-xs sm:text-sm">
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

        <Drawer open={isMobileMenuOpen}>
          <div className={`fixed inset-0 z-40`}>
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}/>

            <div className="absolute top-0 left-0 h-full w-64 bg-[#002B7F] shadow-lg transform transition-transform mobile-menu">
              <div className="flex justify-between items-center p-4 border-b border-blue-700">
                <div className="flex items-center text-white">
                  <Truck className="w-6 h-6 mr-2"/>
                  <span className="font-bold">{t("brand.name")}</span>
                </div>

                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X size={24} className="text-white"/>
                </button>
              </div>

              <nav className="flex flex-col p-4">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({isActive}) => `
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
        </Drawer>
      </Fragment>
  );
}

export default TopNav

