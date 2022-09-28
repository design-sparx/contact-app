import React, { useEffect, useState } from 'react'
import { Alert, Button, Container, Group, Modal, Stack, Table } from '@mantine/core'
import { db } from '../firebase'
import { get, ref, child, remove } from 'firebase/database'
import { ContactTypes } from '../constants/Contact'
import { IconExclamationMark } from '@tabler/icons'
import { toast } from 'react-toastify'

const Home = (): JSX.Element => {
  const [contacts, setContacts] = useState<ContactTypes[]>([])
  const [opened, setOpened] = useState(false)
  const [selected, setSelected] = useState<ContactTypes | null>(null)
  const dbRef = ref(db)

  /**
   * fetch contacts
   */
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

  /**
   * handle contact delete
   */
  const handleDelete = (): void => {
    remove(ref(db, `contacts/${String(selected?.id)}`))
      .then(() => {
        toast.success('Contact deleted successfully')
        setOpened(false)
        fetchContacts()
      })
      .catch(err => toast.error(err))
  }

  /**
   * handle confirm modal open
   */
  const handleOpen = (contact: ContactTypes): void => {
    setOpened(true)
    setSelected(contact)
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
                  <Button
                    component='a'
                    type="button"
                    color="dimmed"
                    href={`/view/${String(c.id)}`}
                    compact
                  >
                    view
                  </Button>
                  <Button
                    component='a'
                    type="button"
                    color="dimmed"
                    href={`/update/${String(c.id)}`}
                    compact
                  >
                    edit
                  </Button>
                  <Button compact onClick={() => handleOpen(c)}>delete</Button>
                </Group>
              </td>
            </tr>
          })
        }</tbody>
      </Table>
      {/* confirm delete */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={`Deleting ${String(selected?.name)}`}
        centered
      >
        <Stack>
          <Alert icon={<IconExclamationMark size={16}/>} title="Warning" color="red">
            Are you sure you want to delete this contact? This action is irreversible
          </Alert>
          <Group position="right">
            <Button variant="subtle">Close</Button>
            <Button onClick={handleDelete}>Delete</Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  )
}

export default Home
