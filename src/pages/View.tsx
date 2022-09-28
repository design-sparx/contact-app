import React, { useEffect, useState } from 'react'
import { child, get, ref } from 'firebase/database'
import { useParams } from 'react-router-dom'
import { db } from '../firebase'
import { Container, Paper, Text, Title } from '@mantine/core'
import { ContactTypes } from '../constants/Contact'

const initialState = {
  name: '',
  email: '',
  contact: ''
}

const View = (): JSX.Element => {
  const dbRef = ref(db)
  const [state, setState] = useState<ContactTypes>(initialState)
  const { id } = useParams()

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
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    fetchContact()
  }, [id])

  return (
    <Container>
      <Title order={3}>User contact detail</Title>
      <Paper radius="md" p="xl">
        <Text>ID: {state.id}</Text>
        <Text>Name: {state.name}</Text>
        <Text>Email: {state.email}</Text>
        <Text>Contact: {state.contact}</Text>
      </Paper>
    </Container>
  )
}

export default View
