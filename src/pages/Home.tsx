import React, { useEffect, useState } from 'react'
import { Anchor, Button, Container, Group, Table } from '@mantine/core'
import { db } from '../firebase'
import { get, ref, child } from 'firebase/database'
import { ContactTypes } from '../constants/Contact'

const Home = (): JSX.Element => {
  const [contacts, setContacts] = useState<ContactTypes[]>([])
  const dbRef = ref(db)

  const fetchContacts = (): void => {
    get(child(dbRef, 'contacts'))
      .then((snapshot) => {
        const d: ContactTypes[] = []
        snapshot.forEach((childSnapshot) => {
          d.push({
            ...childSnapshot.val(),
            id: childSnapshot.key
          })
        })
        setContacts(d)
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    fetchContacts()
  }, [])

  return (
    <Container>
      <h1>welcome to our app</h1>
      <Table>
        <thead>
        <tr>
          <th>No.</th>
          <th>Name</th>
          <th>Email</th>
          <th>Contact</th>
          <th>Action</th>
        </tr>
        </thead>
        <tbody>{
          contacts?.map((c, i) => {
            return <tr key={i}>
              <td>{i + 1}</td>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.contact}</td>
              <td>
                <Group>
                  <Anchor<'a'>
                    type="button"
                    color="dimmed"
                    size="xs"
                    href={`/update/${String(c.id)}`}
                  >
                    edit
                  </Anchor>
                  <Button size="xs">delete</Button>
                </Group>
              </td>
            </tr>
          })
        }</tbody>
      </Table>
    </Container>
  )
}

export default Home
