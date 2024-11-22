import { View, Text } from 'react-native'
import React from 'react'

export default function Task(props) {
  return (
    <View style={{
        display:"flex",
        justifyContent:"center",
        alignItems:"center"
    }}>
        <View style={{
            width:350,
            backgroundColor:"#ddeced",
            borderColor:"grey",
            borderWidth:1,
            borderRadius:10,
            margin:5
           
        }}>
        <Text style={{
            padding:10,
            fontSize:15
        }}>{props.text}</Text>
        </View>
    </View>
  )
}