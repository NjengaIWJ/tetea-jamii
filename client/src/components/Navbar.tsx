import React, { useCallback, useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo_tujitegemee.jpeg";
import {
	Book,
	Contact,
	DockIcon,
	Facebook,
	Handshake,
	Home,
	Instagram,
	Linkedin,
	LogInIcon,
	LogOutIcon,
	PersonStandingIcon,
	Twitter,
} from "lucide-react";
import useAdminStore from "../stores/admin.stores";
import { ThemeToggle } from "./ThemeToggle";

type MenuItem = {
	to: string;
	Icon: React.ReactElement;
	label: string;
};

const NavItem = React.memo(function NavItem({
	item,
	onClick,
}: {
		item: MenuItem;
		onClick?: () => void;
}) {
	return (
		<li>
			<NavLink
				to={item.to}
				onClick={onClick}
				className={({ isActive }) =>
					[
						"flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors duration-200 text-gray-600 hover:text-primary transition-colors",
						isActive
							? "bg-primary text-white font-semibold"
							: "text-gray-700 hover:text-primary hover:bg-primary/10",
					].join(" ")
				}
				aria-current="page"
			>
				{item.Icon}
				<span className="  absolute left-1/2 transform -translate-x-1/2 -top-8 
        px-2 py-1 text-xs text-white bg-gray-800 rounded-md 
        opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">{item.label}</span>
			</NavLink>
		</li>
	);
});

const ExternalLink: React.FC<{
	href: string;
	label: string;
	Icon?: React.ReactElement;
}> = ({ href, label, Icon }) => (
	<div className="relative group inline-block">
		<a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
			aria-label={label}
		>
			{Icon}
		</a>
		<span
			className="
        absolute left-1/2 transform -translate-x-1/2 -top-8 
        px-2 py-1 text-xs text-white bg-gray-800 rounded-md 
        opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap
      "
		>
			{label}
		</span>
	</div>
);

const Navbar: React.FC = () => {
	const isAuthenticated = useAdminStore((s) => s.isAuthenticated);
	const logout = useAdminStore((s) => s.logout);
	const navigate = useNavigate();

	const handleLogout = useCallback(() => {
		logout();
		navigate("/login");
	}, [logout, navigate]);

	const menu = useMemo<MenuItem[]>(
		() => [
			{ to: "/", Icon: <Home size={16} />, label: "Welcome Home" },
			{ to: "/us", Icon: <PersonStandingIcon size={16} />, label: "This is us" },
			{ to: "/stories", Icon: <Book size={16} />, label: "Stories" },
			{ to: "/docs", Icon: <DockIcon size={16} />, label: "What we do" },
			{ to: "/partners", Icon: <Handshake size={16} />, label: "Our Partners" },
			{ to: "/contact", Icon: <Contact size={16} />, label: "Contact Us" },
		],
		[]
	);

	return (
		<header
			className="w-full bg-white shadow-lg sticky top-0 z-50"
			role="banner"
		>
			<div className="container mx-auto px-4 py-3">
				<div className="flex flex-col md:flex-row items-start md:items-center gap-4">
					{/* Logo & Brand */}
					<div className="flex items-center gap-4 w-full md:w-auto">
						<img
							src={logo}
							alt="Tetea Jamii — community support logo"
							className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover"
						/>
						<div>
							<h1 className="text-lg font-bold text-primary">TETEA JAMII</h1>
							<div className="sr-only">Community support organisation</div>
						</div>
					</div>

					{/* Contact + Social Links */}
					<div className="flex-1 flex flex-col md:flex-row md:items-center gap-3 w-full md:w-auto justify-between">
						<div className="text-sm text-gray-500">
							<a
								className="hover:text-primary transition-colors"
								href="tel:+250788123456"
								aria-label="Telephone"
							>
								+250 788 123 456
							</a>
							<a
								className="hover:text-primary transition-colors ml-2"
								href="mailto:teteajamii@gm.com"
								aria-label="Email"
							>
								teteajamii@gm.com
							</a>
						</div>

						<div className="ml-auto flex items-center gap-3 flex-wrap md:gap-2">
							<ExternalLink
								href="https://www.facebook.com/teteajamii"
								label="Facebook"
								Icon={<Facebook size={16} />}
							/>
							<ExternalLink
								href="https://www.twitter.com/teteajamii"
								label="Twitter"
								Icon={<Twitter size={16} />}
							/>
							<ExternalLink
								href="https://www.instagram.com/teteajamii"
								label="Instagram"
								Icon={<Instagram size={16} />}
							/>
							<ExternalLink
								href="https://www.linkedin.com/company/teteajamii"
								label="LinkedIn"
								Icon={<Linkedin size={16} />}
							/>
						</div>
					</div>
				</div>

				{/* Navigation */}
				<nav
					aria-label="Main navigation"
					role="navigation"
					className="w-full border-t mt-3 pt-3"
				>
					<div className="flex items-center justify-between">
						<ul className="flex flex-col md:flex-row items-start md:items-center gap-3 list-none m-0 p-0">
							{menu.map((item) => (
								<NavItem key={item.to} item={item} />
							))}

							{!isAuthenticated ? (
								<li>
									<NavLink
										to="/login"
										className={({ isActive }) =>
											[
												"flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors duration-200",
												isActive
													? "bg-primary text-white font-semibold"
													: "text-gray-700 hover:text-primary hover:bg-primary/10",
											].join(" ")
										}
									>
										<LogInIcon size={16} /> <span>Log in</span>
									</NavLink>
								</li>
							) : (
									<li>
										<button
											type="button"
											onClick={handleLogout}
											className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
											aria-label="Log out"
										>
											<LogOutIcon size={16} /> <span>Log out</span>
										</button>
									</li>
							)}
						</ul>

						<ThemeToggle />
					</div>
				</nav>
			</div>
		</header>
	);
};

export default Navbar;
