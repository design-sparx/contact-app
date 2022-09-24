import React, { useEffect } from 'react'
import { useForm } from '@mantine/form'
import {
  Anchor,
  Button, Checkbox, Container,
  Divider,
  Group,
  Paper,
  PaperProps,
  PasswordInput,
  Stack,
  Text,
  TextInput
} from '@mantine/core'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { registerInitiate } from '../redux/actions'
import { SignupTypes } from '../constants/Signup'

const Register = (props: PaperProps): JSX.Element => {
  const { currentUser } = useSelector((state: any) => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const form = useForm({
    initialValues: {
      email: '',
      displayName: '',
      password: '',
      confirmPassword: '',
      terms: true
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

  const handleSubmit = (values: SignupTypes): any => {
    const {
      email,
      password,
      displayName,
      confirmPassword
    } = values
    if (password !== confirmPassword) {
      return
    }

    dispatch(registerInitiate({
      email,
      password,
      displayName
    }) as any)
  }

  const handleGoogleSubmit = (): void => {
    console.log('')
  }

  const handleFacebookSubmit = (): void => {
    console.log('')
  }

  return (
    <Container size={420} my={40}>
      <Paper radius="md" p="xl" withBorder {...props}>
        <Text size="lg" weight={500}>
          Welcome to Mantine
        </Text>

        <Stack my="md">
          <Button radius="xl" onClick={handleGoogleSubmit}>Sign in with Google</Button>
          <Button radius="xl" onClick={handleFacebookSubmit}>Sign in with Facebook</Button>
        </Stack>

        <Divider label="Or continue with email" labelPosition="center" my="lg"/>

        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <Stack>
            <TextInput
              label="Display name"
              placeholder="Your name"
              value={form.values.displayName}
              onChange={(event) => form.setFieldValue('displayName', event.currentTarget.value)}
            />
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
              placeholder="your password"
              value={form.values.password}
              onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
              error={form.errors.password === true && 'Password should include at least 6 characters'}
            />
            <PasswordInput
              required
              label="Confirm Password"
              placeholder="confirm password"
              value={form.values.confirmPassword}
              onChange={(event) => form.setFieldValue('confirmPassword', event.currentTarget.value)}
              error={form.errors.password === true && 'Password should include at least 6 characters'}
            />
            <Checkbox
              label="I accept terms and conditions"
              checked={form.values.terms}
              onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
            />
          </Stack>

          <Group position="apart" mt="xl">
            <Anchor<'a'>
              type="button"
              color="dimmed"
              size="xs"
              href="/login"
            >
              Already have an account? Login
            </Anchor>
            <Button type="submit">Sign up</Button>
          </Group>
        </form>
      </Paper>
    </Container>
  )
}

export default Register
