import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native'
import Constants from 'expo-constants'
import { Feather as Icon } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import MapView, { Marker } from 'react-native-maps'
import { SvgUri } from 'react-native-svg'
import applicationService from '../../services/applicationService'
import * as Location from 'expo-location'

interface Item {
  id: number
  title: string
  imageURL: string
}

interface Point {
  id: number
  name: string
  image: string
  latitude: number
  longitude: number
}

const Points = () => {
  const navigation = useNavigation()
  const [items, setItems] = useState<Item[]>([])
  const [points, setPoints] = useState<Point[]>([])
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [currentPosition, setCurrentPosition] = useState<[number, number]>([
    0,
    0,
  ])
  useEffect(() => {
    const doAsync = async () => {
      const response = await applicationService.get('items')
      setItems(response.data)
    }
    doAsync()
  }, [])

  useEffect(() => {
    const doAsync = async () => {
      const response = await applicationService.get('points', {
        params: {
          city: '',
          uf: '',
          items: selectedItems.join(','),
        },
      })
      setPoints(response.data)
    }
    doAsync()
  }, [selectedItems])

  useEffect(() => {
    const doAsync = async () => {
      const { status } = await Location.requestPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert(
          'Ops',
          'Precisamos de sua permissão para obter a localização'
        )
        return
      }
      const position = await Location.getCurrentPositionAsync()
      setCurrentPosition([position.coords.latitude, position.coords.longitude])
    }
    doAsync()
  }, [])

  function handleNavigateBack() {
    navigation.goBack()
  }
  function handleNavigateToDetail(id: number) {
    navigation.navigate('Details', { id })
  }

  function handleSelectedItem(id: number) {
    if (!selectedItems.includes(id)) setSelectedItems([...selectedItems, id])
    else setSelectedItems(selectedItems.filter((itemId) => itemId !== id))
  }

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name="arrow-left" size={20} color="#34CB79" />
        </TouchableOpacity>
        <Text style={styles.title}>Bem vindo.</Text>
        <Text style={styles.description}>
          Encontre no mapa um ponto de coleta.
        </Text>
        {currentPosition[0] !== 0 && (
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: currentPosition[0],
                longitude: currentPosition[1],
                latitudeDelta: 0.014,
                longitudeDelta: 0.014,
              }}
            >
              {points &&
                points.map((point) => (
                  <Marker
                    key={String(point.id)}
                    onPress={() => handleNavigateToDetail(point.id)}
                    style={styles.mapMarker}
                    coordinate={{
                      latitude: point.latitude,
                      longitude: point.longitude,
                    }}
                  >
                    <View style={styles.mapMarkerContainer}>
                      <Image
                        style={styles.mapMarkerImage}
                        source={{
                          uri: point.image,
                        }}
                      />
                      <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                    </View>
                  </Marker>
                ))}
            </MapView>
          </View>
        )}
      </View>
      <View style={styles.itemsContainer}>
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20 }}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {items &&
            items.map((item) => (
              <View key={String(item.id)}>
                <TouchableOpacity
                  activeOpacity={0.6}
                  style={[
                    styles.item,
                    selectedItems.includes(item.id) ? styles.selectedItem : {},
                  ]}
                  onPress={() => handleSelectedItem(item.id)}
                >
                  <SvgUri width={42} height={42} uri={item.imageURL} />
                  <Text style={styles.itemTitle}>{item.title}</Text>
                </TouchableOpacity>
              </View>
            ))}
        </ScrollView>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20 + Constants.statusBarHeight,
  },

  title: {
    fontSize: 20,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 4,
    fontFamily: 'Roboto_400Regular',
  },

  mapContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 16,
  },

  map: {
    width: '100%',
    height: '100%',
  },

  mapMarker: {
    width: 90,
    height: 80,
  },

  mapMarkerContainer: {
    width: 90,
    height: 70,
    backgroundColor: '#34CB79',
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
  },

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: 'cover',
  },

  mapMarkerTitle: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    color: '#FFF',
    fontSize: 13,
    lineHeight: 23,
  },

  itemsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 32,
  },

  item: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eee',
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'space-between',

    textAlign: 'center',
  },

  selectedItem: {
    borderColor: '#34CB79',
    borderWidth: 2,
  },

  itemTitle: {
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    fontSize: 13,
  },
})

export default Points
