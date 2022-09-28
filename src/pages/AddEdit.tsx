import React, { useEffect, useState } from 'react'
import { Button, Container, Paper, Stack, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { ContactTypes } from '../constants/Contact'
import { ref, set, push, get, child } from 'firebase/database'
import { db } from '../firebase'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'

const initialState = {
  name: '',
  email: '',
  contact: ''
}
const AddEdit = (): JSX.Element => {
  const dbRef = ref(db)
  const { id } = useParams()
  const [state, setState] = useState<ContactTypes>(initialState)
  const navigate = useNavigate()
  const form = useForm({
    initialValues: state,
    validate: {
      name: (value) => (value.length > 2 ? null : 'Name must have at least 2 letters'),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      contact: (value) => (value.length > 2 ? null : 'Name must have at least 2 digits')
    }
  })

  const handleSubmit = (values: ContactTypes): void => {
    const {
      contact,
      name,
      email
    } = values
    if (!Boolean(id)) {
      if (!Boolean(contact) || !Boolean(name) || !Boolean(email)) {
        toast.warning('Please provide value to each input field!')
      } else {
        const contactsRef = ref(db, 'contacts')
        const newContactsRef = push(contactsRef)
        set(newContactsRef, values)
          .then(() => {
            toast.success('Contact added successfully')
            form.reset()
          })
          .catch(err => {
            toast.error(err)
            console.log(err)
          })
      }
    } else {
      set(ref(db, `contacts/${String(id)}`), values)
        .then(() => {
          toast.success('Contact updated successfully')
          navigate('/')
        })
        .catch((error) => {
          toast.error(error)
          console.log(error)
        })
    }
  }

  /**
   * fetch contact
   */
  const fetchContact = (): void => {
    get(child(dbRef, `contacts/${String(id)}`))
      .then((snapshot) => {
        setState({
          ...snapshot.val(),
          id: snapshot.key
        })
        form.setValues({
          ...snapshot.val(),
          id: snapshot.key
        })
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    fetchContact()
  }, [id])

  return (
    <Container>
      <Paper radius="md" p="xl">
        <Title order={3} align="center" mb="xl">create contact form</Title>
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
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
            <Button type="submit" fullWidth>{Boolean(id) ? 'Update' : 'Save'}</Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  )
}

export default AddEdit
