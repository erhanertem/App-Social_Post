/* eslint-disable react/prop-types */
import { NavLink } from 'react-router-dom';

import MobileToggle from '../MobileToggle/MobileToggle';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';

import './MainNavigation.css';

const MainNavigation = (props) => (
  <nav className='main-nav'>
    <MobileToggle onOpen={props.onOpenMobileNav} />
    <div className='main-nav__logo'>
      <NavLink to='/' exact='true'>
        <Logo />
      </NavLink>
    </div>
    <div className='spacer' />
    <ul className='main-nav__items'>
      <NavigationItems isAuth={props.isAuth} onLogout={props.onLogout} />
    </ul>
  </nav>
);

export default MainNavigation;
