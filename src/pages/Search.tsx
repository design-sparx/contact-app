import React, { useEffect, useState } from 'react'
import { Container, Title } from '@mantine/core'
import { useLocation } from 'react-router-dom'
import { db } from '../firebase'
import { get, ref, orderByChild, equalTo, query } from 'firebase/database'
import { ContactTypes } from '../constants/Contact'
import ContactsTable from '../components/ContactsTable'

const Search = (): JSX.Element => {
  const [data, setData] = useState<ContactTypes[]>([])
  const useQuery = (): any => {
    return new URLSearchParams(useLocation().search)
  }

  const queryParam = useQuery()
  const search = queryParam.get('name')

  /**
   * search
   */
  const searchData = (): any => {
    const q = query(ref(db, 'contacts'), orderByChild('name'), equalTo(search))
    get(q)
      .then((snapshot) => {
        const d: ContactTypes[] = []
        snapshot.forEach((childSnapshot) => {
          d.push({
            ...childSnapshot.val(),
            id: childSnapshot.key
          })
        })
        setData(d)
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    searchData()
  }, [search])

  return (
    <Container>
      <Title>Search</Title>
      <ContactsTable data={data} refresh={searchData} searchTerm={search}/>
    </Container>
  )
}

export default Search
