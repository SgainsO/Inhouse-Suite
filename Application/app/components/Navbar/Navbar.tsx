"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  IconHome,
  IconInfoCircle,
  IconPhone,
  IconUsers,
  IconCalendarEvent,
  IconBuilding,
  IconUser,
  IconLogout,
  IconSwitchHorizontal,
} from '@tabler/icons-react';
import { Code, Group } from '@mantine/core';
import classes from './Navbar.module.css';


const data = [
  { link: '/home', label: 'Home', icon: IconHome },
  { link: '/about', label: 'About', icon: IconInfoCircle },
  { link: '/calls', label: 'Calls', icon: IconPhone },
  { link: '/people', label: 'People', icon: IconUsers },
  { link: '/events', label: 'Events', icon: IconCalendarEvent },
  { link: '/orgs', label: 'Orgs', icon: IconBuilding },
  { link: '/profile', label: 'Profile', icon: IconUser },
];

export default function NavbarSimple() {
  const pathname = usePathname();

  const links = data.map((item) => (
    <Link
      className={classes.link}
      data-active={item.link === pathname || undefined}
      href={item.link}
      key={item.label}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between">
          <Code fw={700}>v3.1.2</Code>
        </Group>
        {links}
      </div>

      <div className={classes.footer}>
        <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
          <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
          <span>Change account</span>
        </a>

        <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
}