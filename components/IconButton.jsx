import { Pressable, Text, StyleSheet } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'

const IconButton = ({ lable, icon, onPress }) => {
  return (
    <Pressable style={styles.iconButton} onPress={onPress}>
      <MaterialIcons name={icon} size={24} color='#fff' />
      <Text style={styles.iconButtonLable}>{lable}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  iconButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonLable: {
    color: '#fff',
    marginTop: 12,
  }
})

export default IconButton