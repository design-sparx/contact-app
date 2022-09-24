import React, { useEffect } from 'react'
import { useForm } from '@mantine/form'
import {
  Anchor,
  Button, Container,
  Divider,
  Group,
  Paper,
  PaperProps,
  PasswordInput,
  Stack,
  Text,
  TextInput
} from '@mantine/core'
import { SignupTypes } from '../constants/Signup'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fbSignInInitiate, googleSignInInitiate, loginInitiate } from '../redux/actions'

const Login = (props: PaperProps): JSX.Element => {
  const { currentUser } = useSelector((state: any) => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const form = useForm({
    initialValues: {
      email: '',
      password: ''
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null)
    }
  })

  useEffect(() => {
    if (currentUser !== null) {
      navigate('/')
    }
  }, [currentUser, navigate])

  const handleSubmit = (values: SignupTypes, event: React.SyntheticEvent): void => {
    event.preventDefault()
    const {
      email,
      password
    } = values

    if ((email.length === 0) || (password.length === 0)) {
      return
    }

    dispatch(loginInitiate({
      email,
      password
    }) as any)
  }

  const handleGoogleSubmit = (): void => {
    dispatch(googleSignInInitiate() as any)
  }

  const handleFacebookSubmit = (): void => {
    dispatch(fbSignInInitiate() as any)
  }

  return (
    <Container size={420} my={40}>
      <Paper radius="md" p="xl" withBorder {...props}>
        <Text size="lg" weight={500}>
          Welcome back to Mantine
        </Text>

        <Stack my="md">
          <Button radius="xl" onClick={handleGoogleSubmit}>Sign in with Google</Button>
          <Button radius="xl" onClick={handleFacebookSubmit}>Sign in with Facebook</Button>
        </Stack>

        <Divider label="Or continue with email" labelPosition="center" my="lg"/>

        <form onSubmit={form.onSubmit((values, event) => handleSubmit(values, event))}>
          <Stack>
            <TextInput
              required
              label="Email"
              placeholder="hello@mantine.dev"
              value={form.values.email}
              onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
              error={form.errors.email === true && 'Invalid email'}
            />
            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              value={form.values.password}
              onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
              error={form.errors.password === true && 'Password should include at least 6 characters'}
            />
          </Stack>
          <Group position="apart" mt="xl">
            <Anchor<'a'>
              type="button"
              color="dimmed"
              size="xs"
              href="/register"
            >
              Don&apos;t have an account? Sign up
            </Anchor>
            <Button type="submit">Sign in</Button>
          </Group>
        </form>
      </Paper>
    </Container>
  )
}

export default Login
