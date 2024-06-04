
import { View, Text } from 'react-native';
import SvgComponent from '../assets/svg';

const EmptyState = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <SvgComponent />
      <Text style ={{color:"gray", marginTop:20}}>
        Upload a photo
      </Text>
    </View>
  );
};

export default EmptyState;