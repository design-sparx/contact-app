import React, { useEffect, useState } from 'react'
import { equalTo, get, orderByChild, query, ref, remove } from 'firebase/database'
import { db } from '../firebase'
import { toast } from 'react-toastify'
import { ContactTypes } from '../constants/Contact'
import { Alert, Box, Button, Divider, Group, Modal, Select, Stack, Table, Text } from '@mantine/core'
import { IconExclamationMark } from '@tabler/icons'

interface ContactsTableProps {
  data: ContactTypes[]
  refresh: any
  searchTerm?: string
}

const ContactsTable = ({
  data,
  refresh,
  searchTerm
}: ContactsTableProps): JSX.Element => {
  const [contextData, setContextData] = useState<ContactTypes[]>([])
  const [status, setStatus] = useState<string | null>(null)
  const [sort, setSort] = useState<string | null>(null)
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

  /**
   * filters
   */
  const handleFilter = (): void => {
    const q = query(ref(db, 'contacts'), orderByChild('status'), equalTo(status))
    get(q)
      .then((snapshot) => {
        const d: ContactTypes[] = []
        snapshot.forEach((childSnapshot) => {
          d.push({
            ...childSnapshot.val(),
            id: childSnapshot.key
          })
        })
        setContextData(d)
      })
      .catch(err => console.log(err))
  }

  /**
   * sort
   */
  const handleSort = (): void => {
    if (sort != null) {
      const q = query(ref(db, 'contacts'), orderByChild(sort))
      get(q)
        .then((snapshot) => {
          const d: ContactTypes[] = []
          snapshot.forEach((childSnapshot) => {
            d.push({
              ...childSnapshot.val(),
              id: childSnapshot.key
            })
          })
          setContextData(d)
        })
        .catch(err => console.log(err))
    }
  }

  /**
   * reset filters and sorting
   */
  const handleReset = (): void => {
    setStatus(null)
    setSort(null)
    setContextData(data)
  }

  useEffect(() => {
    if (Boolean(status)) {
      handleFilter()
    } else {
      setContextData(data)
    }
  }, [status, data])

  useEffect(() => {
    if (Boolean(sort)) {
      handleSort()
    } else {
      setContextData(data)
    }
  }, [sort, data])

  return (
    <>
      {(data.length > 0)
        ? <Box>
          <Group align="end">
            <Select
              required
              withAsterisk={false}
              label="Filter by status"
              placeholder="select status"
              data={[
                {
                  value: '',
                  label: '--select status--'
                },
                {
                  value: 'active',
                  label: 'active'
                },
                {
                  value: 'inactive',
                  label: 'inactive'
                }
              ]}
              onChange={(value) => setStatus(value)}
            />
            <Select
              required
              withAsterisk={false}
              label="Sort by"
              placeholder="sort by"
              data={[
                {
                  value: '',
                  label: '--sort by--'
                },
                {
                  value: 'name',
                  label: 'name'
                },
                {
                  value: 'email',
                  label: 'email'
                },
                {
                  value: 'contact',
                  label: 'contact'
                },
                {
                  value: 'status',
                  label: 'status'
                }
              ]}
              onChange={(value) => setSort(value)}
            />
            <Button onClick={handleReset}>reset</Button>
          </Group>
          <Divider my="md"/>
          <Table>
            <thead>
            <tr>
              <th>No.</th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Contact</th>
              <th>Action</th>
            </tr>
            </thead>
            <tbody>
            {
              contextData.map((c, i) => {
                return <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.status}</td>
                  <td>{c.contact}</td>
                  <td>
                    <Group>
                      <Button
                        component="a"
                        type="button"
                        color="dimmed"
                        href={`/view/${String(c.id)}`}
                        compact
                      >
                        view
                      </Button>
                      <Button
                        component="a"
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
        </Box>
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
