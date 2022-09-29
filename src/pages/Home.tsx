import React, { useEffect, useState } from 'react'
import { Container } from '@mantine/core'
import { db } from '../firebase'
import { get, ref, child } from 'firebase/database'
import { ContactTypes } from '../constants/Contact'
import ContactsTable from '../components/ContactsTable'

const Home = (): JSX.Element => {
  const [contacts, setContacts] = useState<ContactTypes[]>([])
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

  useEffect(() => {
    fetchContacts()
  }, [])

  return (
    <Container>
      <h1>welcome to our app</h1>
      <ContactsTable data={contacts} refresh={fetchContacts}/>
    </Container>
  )
}

export default Home
