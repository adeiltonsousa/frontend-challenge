import React, { useEffect, useState } from 'react'
import noImage from 'assets/noImage.png'
import { formatDate } from 'utils/formatDate'

import {
  DetailsArtists,
  Layout,
  SubHeader,
  CardAlbums,
  Loading,
} from 'components'
import { SomosClient } from 'utils'

const InfoArtist = props => {
  const [resultDetailsArtist, setResultDetailsArtist] = useState({})
  const [resultAlbumsArtist, setResultAlbumsArtist] = useState([])
  const [loading, setLoading] = useState(false)

  const searchDetailsArtists = id => {
    setLoading(true)
    SomosClient.searchDetailsArtists(id).then(
      res => {
        const { name, popularity, images, genres } = res.data
        const image = images.length ? images[0].url : noImage
        const genre = genres.length ? genres : ['Indisponível']

        const details = { name, popularity, image, genre }
        setResultDetailsArtist(details)
        setLoading(false)
      },
      err => {
        setLoading(false)
        console.log(err)
      },
    )
  }

  const searchAlbumsArtist = id => {
    setLoading(true)
    SomosClient.searchAlbumsArtist(id).then(
      res => {
        const dataAlbums = res.data.items.map(album => {
          const { name, release_date, images, id } = album
          const image = images.length ? images[0].url : noImage

          const releaseDate = formatDate(release_date)

          return { name, releaseDate, image, id }
        })

        setResultAlbumsArtist(dataAlbums)
        setLoading(false)
      },
      err => {
        setLoading(false)
        console.log(err)
      },
    )
  }

  useEffect(() => {
    // eslint-disable-next-line react/prop-types
    const { id } = props.match.params

    searchDetailsArtists(id)
    searchAlbumsArtist(id)
  }, [])

  return (
    <Layout>
      <SubHeader
        breadcrumb={[
          { text: 'Home', href: '/' },
          { text: 'Busca', href: '/busca' },
          { text: 'Informações Artista' },
        ]}
        buttonHref="/busca"
        heading={`Informações Artista: ${resultDetailsArtist.name} - Spotify`}
      />
      {loading ? (
        <Loading />
      ) : (
        <>
          <DetailsArtists resultDetailsArtist={resultDetailsArtist} />
          <CardAlbums resultAlbumsArtist={resultAlbumsArtist} />
        </>
      )}
    </Layout>
  )
}

export default InfoArtist
