import { View } from 'react-native'
import { Image } from 'expo-image'

const EmojiSticker = ({ imageSize, stickerSource }) => {
  return (
    <View style={{ top: -350 }}>
      <Image source={stickerSource} style={{ width: imageSize, height: imageSize}}/>
    </View>
  )
}

export default EmojiSticker