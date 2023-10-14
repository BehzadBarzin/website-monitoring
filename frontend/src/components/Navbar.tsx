import { FC, useState } from 'react';
import logo from '../assets/logo.svg';
import menu from '../assets/menu.svg';
import close from '../assets/close.svg';
import styles from '../constants/styles';
import {NavLink, useNavigate} from 'react-router-dom';
import { useIsAuthenticated, useSignOut } from 'react-auth-kit';

// --------------------------------------------------------------------------------------------------

const MyNavLink = ({ to, title }: {to: string, title: string}) => (
  <NavLink to={to} style={({isActive}) => isActive ? { color: 'white' } : { color: 'DarkGrey' }}>{title}</NavLink>
);

// --------------------------------------------------------------------------------------------------

type NavItemProps = {
  key: string,
  isMobile: boolean,
  isLast: boolean,
  children: string | JSX.Element | JSX.Element[]
}

const NavItem: FC<NavItemProps> = ({ key, isMobile, isLast, children }) => {
  if (!isMobile) {
    return (
      <li
      key={key}
      className={`font-poppins font-normal cursor-pointer text-[16px] ${isLast ? "mr-0" : "mr-10"}`}>
        {children}
    </li>
    );
  } else {
    return (
      <li
      key={key}
      className={`font-poppins font-medium cursor-pointer text-[16px] ${isLast ? "mb-0" : "mb-4"}`}>
      {children}
    </li>
    );
  }
}

// --------------------------------------------------------------------------------------------------
function Navbar() {
    const [toggle, setToggle] = useState(false); // Toggle the menu popup on the mobile view
    const isAuthenticated = useIsAuthenticated();
    const signOut = useSignOut();
    const navigate = useNavigate();

    return (
      <div className={`${styles.paddingX} ${styles.flexCenter}`}>
        <div className={`${styles.boxWidth}`}>
          <nav className="w-full flex py-6 justify-between items-center navbar">
              <img src={logo} alt="logo" className="w-[154px] h-[52px]" />
              
              {/* Desktop Menu */}
              <ul className="list-none sm:flex hidden justify-end items-center flex-1">
                  {/* Nav items */}
                  <NavItem key='home' isMobile={false} isLast={false}>
                    <MyNavLink to={'/'} title='Home' />
                  </NavItem>
                  {
                      isAuthenticated() 
                        ?
                      <NavItem key='websites' isMobile={false} isLast={false}>
                        <MyNavLink to={'/websites'} title='Websites' />
                      </NavItem> : null 
                  
                  }
                  {
                    isAuthenticated() 
                    ?
                    (
                      // If user is authenticated > show Logout
                      <NavItem key='logout' isMobile={false} isLast={true}>
                        <a href="" onClick={() => {
                          signOut();
                          navigate('/');
                        }}  style={{ color: 'DarkGrey' }}>Log Out</a>
                      </NavItem>
                      ) 
                      :
                      (
                      // If not authenticate > show Login
                      <NavItem key='login' isMobile={false} isLast={true}>
                        <MyNavLink to={'/login'} title='LogIn' />
                      </NavItem>
                      )
                  }
              </ul>

              {/* ------------------------------------------------------------- */}
              {/* Mobile Menu */}
              <div className="sm:hidden flex flex-1 justify-end items-center">
          <img
            src={toggle ? close : menu}
            alt="menu"
            className="w-[28px] h-[28px] object-contain"
            onClick={() => setToggle(!toggle)}
          />

          <div
            className={`${
              !toggle ? "hidden" : "flex"
            } p-6 bg-black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] rounded-xl sidebar`}
          >
            <ul className="list-none flex justify-end items-start flex-1 flex-col">
              {/* Mobile Nav Items */}
              {/* TODO: Should not repeat menu items for the mobile view */}
              <NavItem key='home' isMobile={true} isLast={false}>
                    <MyNavLink to={'/'} title='Home' />
              </NavItem>
              {
                  isAuthenticated() 
                    ?
                  <NavItem key='websites' isMobile={true} isLast={false}>
                    <MyNavLink to={'/websites'} title='Websites' />
                  </NavItem> : null 
              
              }
              {
                    isAuthenticated() 
                    ?
                    (
                      // If user is authenticated > show Logout
                      <NavItem key='logout' isMobile={true} isLast={true}>
                        <a href="" onClick={() => {
                          signOut();
                          navigate('/');
                        }}  style={{ color: 'DarkGrey' }}>Log Out</a>
                      </NavItem>
                      ) 
                      :
                      (
                      // If not authenticate > show Login
                      <NavItem key='login' isMobile={true} isLast={true}>
                        <MyNavLink to={'/login'} title='LogIn' />
                      </NavItem>
                      )
                  }
            </ul>
          </div>
        </div>
          </nav>
        </div>
      </div>
    );
}
        
export default Navbar