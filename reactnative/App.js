import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image, Platform, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Speech from 'expo-speech';


export default function App() {
  const [image, setImage] = useState(null);
  const [imgwithoutURI, setimgwithoutURI] = useState(null);
  const [loading, setLoading] = useState(false)
  const [caption, setCaption] = useState("Bhoot khara hy smne ")
  const [_base64, setBase64] = useState("")

  const pickImage = async () => {
    setCaption(" ")
    setImage(null);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      base64: true,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setimgwithoutURI(result);
      setImage(result.uri);
      setBase64(result.base64)
    }
  };

  const uploadImage = async () => {
    try {
      const files = 'image'

      const data = new FormData();

      data.append('file', files)
      console.log(files)

      setLoading(true)
      const res = await fetch(
        'http://192.168.2.115:5002/after', {
        method: "POST",
        body: data
      }
      );
      const file = await res.json()
      console.log(file.secure_url)
    } catch (error) {
      console.log(error)
    }
  }

  const sendImage = () => {
    uploadImage(image)
  }

  const sendJson = async () => {
    setCaption("")
    const res = await fetch(
      'http://192.168.2.115:5002/test', {
      method: "POST",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ img: _base64 })
    }
    );
    const file = await res.json()

    console.log('file response', file)

    fetch('http://192.168.2.115:5002/after').then(
      response => response.json()
    )

    setTimeout(function () {
    
      fetch('http://192.168.2.115:5002/api').then(
        response => response.json()
      ).then(data => setCaption(data))
      //alert(caption.cap)
      console.log(caption)
    }, 2000);

  }
  const generateCap = () => {
    setCaption(" ")
    fetch('http://192.168.2.115:5002/after').then(
      response => response.json()
    )
    //alert(caption.cap)
    //console.log(caption)
  }
  const getCap = () => {
    fetch('http://192.168.2.115:5002/api').then(
      response => response.json()
    ).then(data => setCaption(data))
    //alert(caption.cap)
    console.log(caption.cap)
  }
  const speak = () => {
    //const thingToSay = caption.cap
    const thingToSay = caption.cap

    Speech.speak(thingToSay);
  };
  const tch = () => {
    setTimeout(function () {

      fetch('http://192.168.2.115:5002/bismillah').then(
        response => response.json()
      ).then(data => setCaption(data))
      //alert(caption.cap)
      console.log(caption)


    }, 0);

  };
  return (
    <View style={styles.container}>

      <TouchableOpacity onPress={pickImage} style={styles.btnText}  >
        <Text style={styles.btnText}>Pick an image from Gallery</Text>
      </TouchableOpacity>

      {/* <Button title="Pick an image from camera" onPress={pickImage} /> */}
      <View style={{
        shadowColor: '#14d6fc',
        shadowOffset: { width: 10, height: 10 },
        shadowRadius: 5,
        shadowOpacity: 0.48,
        shadowRadius: 11.95,
        elevation: 18,

      }}>
        {image && <Image source={{ uri: image }}
          style={{ width: 320, height: 250, borderColor: 'black', borderWidth: 1, marginHorizontal: 3, borderRadius: 35, }} />}

      </View>

      <Text> </Text>
      <Text> </Text>
      {/* <Button title="sendImage" onPress={sendJson} /> */}

      {/* <Button title="GenerateCaption" onPress={generateCap} /> */}
      {/* <Text> </Text> */}
      {/* <Button title="GetCaption" style={styles.btnSection} onPress={getCap} /> */}

      <TouchableOpacity style={styles.btnSection} onPress={sendJson} >
        <Text style={{ color: 'white' }}>GET CAPTION</Text>
      </TouchableOpacity>

      <Text></Text>
      <Text>  {caption.cap} </Text>
      
      {/* <Button title="Press to hear some words" onPress={speak} /> */}
      <StatusBar style="auto" />

      <View>
        <TouchableOpacity onPress={speak}>
          <Image source={require('./assets/mic.png')} style={{ width: 150, height: 150 }} />
        </TouchableOpacity>
      </View>


      {/* <Image
        source={{ uri: 'asset:/mic.png' }}
        style={{ width: 40, height: 40 }}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    textAlign: 'center',
    color: 'gray',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  btnSection: {
    width: 170,
    height: 50,
    backgroundColor: '#2696ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,

  },
});
