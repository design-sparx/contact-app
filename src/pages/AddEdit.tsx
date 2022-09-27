import React, { useState } from 'react'
import { Button, Container, Paper, Stack, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { ContactTypes } from '../constants/Contact'
import { ref, set } from 'firebase/database'
import { db } from '../firebase'
import { toast } from 'react-toastify'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const initialState = {
  name: '',
  email: '',
  contact: ''
}
const AddEdit = (): JSX.Element => {
  const form = useForm({
    initialValues: initialState,
    validate: {
      name: (value) => (value.length > 2 ? null : 'Name must have at least 2 letters'),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      contact: (value) => (value.length > 2 ? null : 'Name must have at least 2 digits')
    }
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSubmit = (values: ContactTypes): void => {
    const {
      contact,
      name,
      email
    } = values

    if (!Boolean(contact) || !Boolean(name) || !Boolean(email)) {
      toast.warning('Please provide value to each input field!')
    } else {
      set(ref(db, 'contacts/' + `${name}-${contact}`), values)
        .then(() => {
          toast.success('Contact added successfully')
          form.reset()
        })
        .catch(err => {
          toast.error(err)
          console.log(err)
        })
    }
  }

  return (
    <Container size={420} my={40}>
      <Paper radius="md" p="xl">
        <Title order={3} align="center" mb="xl">create contact form</Title>
        <form onSubmit={form.onSubmit((values, event) => handleSubmit(values))}>
          <Stack>
            <TextInput
              required
              withAsterisk={false}
              label="Name"
              placeholder="Name"
              value={form.values.name}
              onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
              {...form.getInputProps('name')}
            />
            <TextInput
              required
              withAsterisk={false}
              label="Email"
              placeholder="Email"
              value={form.values.email}
              onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
              {...form.getInputProps('email')}
            />
            <TextInput
              required
              withAsterisk={false}
              label="Contact"
              placeholder="Contact"
              value={form.values.contact}
              onChange={(event) => form.setFieldValue('contact', event.currentTarget.value)}
              {...form.getInputProps('contact')}
            />
            <Button type="submit" fullWidth>Save</Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  )
}

export default AddEdit
