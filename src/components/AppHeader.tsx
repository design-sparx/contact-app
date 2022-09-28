import React from 'react'
import {
  createStyles,
  Header,
  Container,
  Group,
  Button,
  Burger
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconCode } from '@tabler/icons'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logoutInitiate } from '../redux/actions'

const HEADER_HEIGHT = 60

const useStyles = createStyles((theme) => ({
  inner: {
    height: HEADER_HEIGHT,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  links: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none'
    }
  },

  burger: {
    [theme.fn.largerThan('sm')]: {
      display: 'none'
    }
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0]
    }
  },

  active: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0]
  },

  linkLabel: {
    marginRight: 5
  }
}))

interface HeaderActionProps {
  links: Array<{ link: string, label: string, links?: Array<{ link: string, label: string }> }>
}

const AppHeader = ({ links }: HeaderActionProps): JSX.Element => {
  const { classes } = useStyles()
  const [opened, { toggle }] = useDisclosure(false)
  const location = useLocation()
  const { currentUser } = useSelector((state: any) => ({ ...state.user }))
  const dispatch = useDispatch()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAuth = (): void => {
    dispatch(logoutInitiate() as any)
  }

  /**
   * resolve current location
   * @param href
   */
  const urlResolver = (href: string): boolean => {
    return location.pathname === href
  }

  const items = links.map((link) =>
    <a
      key={link.label}
      href={link.link}
      className={urlResolver(link.link) ? classes.active : classes.link}
    >
      {link.label}
    </a>)

  return (
    <Header height={HEADER_HEIGHT} sx={{ borderBottom: 0 }} mb={120}>
      <Container className={classes.inner} fluid>
        <Group>
          <Burger opened={opened} onClick={toggle} className={classes.burger} size="sm"/>
          <IconCode size={28}/>
        </Group>
        <Group spacing={5} className={classes.links}>
          {items}
          {Boolean(currentUser)
            ? <Button radius="xl" sx={{ height: 30 }} onClick={handleAuth}>
              logout
            </Button>
            : <Button radius="xl" sx={{ height: 30 }}>
              login
            </Button>}
        </Group>
      </Container>
    </Header>
  )
}

export default AppHeader
