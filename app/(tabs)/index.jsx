import { View, StyleSheet, Platform } from 'react-native'
import Button from '@/components/Button'
import ImageViewer from '@/components/ImageViewer'
import * as ImagePicker from 'expo-image-picker'
import { useState, useRef } from 'react'
import { captureRef } from 'react-native-view-shot'
import CircleButton from '@/components/CircleButton'
import IconButton from '@/components/IconButton'
import EmojiPicker from '@/components/EmojiPicker'
import EmojiList from '@/components/EmojiList'
import EmojiSticker from '@/components/EmojiSticker'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import * as MediaLibrary from 'expo-media-library'
import domtoimage from 'dom-to-image'


const PlaceholderImage = require('@/assets/images/background-image.png')

const index = () => {
  const [status, requestPermission] = MediaLibrary.usePermissions()
  const [selectedImage, setSelectedImage] = useState(undefined)
  const [showAppOptions, setShowAppOptions] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [pickedEmoji, setPickedEmoji] = useState(undefined)

  const imageRef = useRef(null)

  if (status === null) {
    requestPermission()
  }

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    })


    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri)
      setShowAppOptions(true)
    } else {
      alert("You didn't select any image.")
    }
  }

  const onRest = () => {
    setShowAppOptions(false)
  }

  const onAddSticker = () => {
    setIsModalVisible(true)
  }

  const onModalClose = () => {
    setIsModalVisible(false)
  }


  const onSaveImageAsync = async () => {
    if (Platform.OS !== 'web') {
      try {
        const localUri = await captureRef(imageRef, {
          height: 440,
          quality: 1
        })
        await MediaLibrary.saveToLibraryAsync(localUri)
        if (localUri) {
          alert("Saved!")
        }
      } catch (e) {
        console.error(e)
      }
    } else {
      try{
        const dataUrl = await domtoimage.toJpeg(imageRef.current, {
          quality: 0.95,
          width: 320,
          height: 440,
        })

        let link = document.createElement('a')
        link.download = 'sticker-smash.jpeg'
        link.href = dataUrl
        link.click()
      } catch (e) {
        console.error(e)
      }
    }
  }


  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <View ref={imageRef} collapsable={false} style={styles.imageContainer}>
          <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} />
          {pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />}
        </View>
        {showAppOptions ? (
          <View style={styles.optionsContainer}>
            <View style={styles.optionsRow}>
              <IconButton icon='refresh' lable='Reset' onPress={onRest} />
              <CircleButton onPress={onAddSticker} />
              <IconButton icon='save-alt' lable='Save' onPress={onSaveImageAsync} />
            </View>
          </View>
        ) : (
          <View style={styles.footerContainer}>
            <Button theme="primary" lable="Choose a photo" onPress={pickImageAsync} />
            <Button lable="Use this photo" onPress={() => setShowAppOptions(true)} />
          </View>
        )}
        <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
          <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
        </EmojiPicker>
      </View>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  }
})

export default index