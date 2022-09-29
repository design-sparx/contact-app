import React, { useState } from 'react'
import { ref, remove } from 'firebase/database'
import { db } from '../firebase'
import { toast } from 'react-toastify'
import { ContactTypes } from '../constants/Contact'
import { Alert, Box, Button, Group, Modal, Stack, Table, Text } from '@mantine/core'
import { IconExclamationMark } from '@tabler/icons'

interface ContactsTableProps {
  data: ContactTypes[]
  refresh: any
  searchTerm?: string
}

const ContactsTable = ({ data, refresh, searchTerm }: ContactsTableProps): JSX.Element => {
  const [opened, setOpened] = useState(false)
  const [selected, setSelected] = useState<ContactTypes | null>(null)

  /**
   * handle contact delete
   */
  const handleDelete = (): void => {
    remove(ref(db, `contacts/${String(selected?.id)}`))
      .then(() => {
        toast.success('Contact deleted successfully')
        setOpened(false)
        refresh()
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
  return (
    <>
      {(data.length > 0)
        ? <Table>
          <thead>
          <tr>
            <th>No.</th>
            <th>Name</th>
            <th>Email</th>
            <th>Contact</th>
            <th>Action</th>
          </tr>
          </thead>
          <tbody>
          {
            data.map((c, i) => {
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
        : <Box>
          {(Boolean(searchTerm) || searchTerm !== null)
            ? <Text>No contact found with that name: {searchTerm}</Text>
            : <>
              <Text>No contact found.</Text>
              <Button>Take me to add contact page</Button>
            </>}
        </Box>
      }
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
    </>
  )
}

export default ContactsTable
