import type { FC, ReactNode } from "react";
import { NavLink } from "react-router-dom";

type Props = {
    icon: ReactNode;
    label: string;
    to: string
};

export const NavItem: FC<Props> = ({ icon, label, to }) => (
    <NavLink
        to={to}
        className={({isActive}) => `
        flex items-center px-3 py-2 rounded-lg cursor-pointer
        ${isActive ? "bg-blue-700" : "hover:bg-blue-800"}
      `}
    >
        {icon}
        <span className="ml-2 text-sm">{label}</span>
    </NavLink>
);
