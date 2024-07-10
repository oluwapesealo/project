import React from 'react';
import { Image, Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import ProgressBar from './ProgressBar';

export function Uploading({ images, progress }) {
    return (
        <View style={styles.overlay}>
            <View style={styles.container}>
                {images && (
                    <Image
                        source={{ uri: images }} // Correct usage of the image URI
                        style={styles.images}
                    />
                )}
                <Text style={styles.text}>
                    Uploading...
                </Text>
                <ProgressBar progress={progress} />
                <View style={styles.separator} />
                <TouchableOpacity>
                    <Text style={styles.cancelButton}>
                        Cancel
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent black background
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    container: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // white with some transparency
        borderRadius: 10,
        paddingHorizontal: 70,
        paddingVertical : 30,
        alignItems: 'center',
    },
    images: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        borderRadius: 6,
    },
    text: {
        fontSize: 16,
        marginBottom: 10,
    },
    separator: {
        height: 1,
        borderWidth: StyleSheet.hairlineWidth,
        width: 120,
        borderColor: '#00000050',
        marginVertical: 15,
        marginTop:10,
        marginBottom:5
    },
    cancelButton: {
        fontWeight: '500',
        color: '#3478f6',
        fontSize: 17,
    },
});

export default Uploading;
