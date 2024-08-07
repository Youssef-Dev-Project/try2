import { StyleSheet, Text, View, Button, Pressable } from "react-native";
import React from "react";
import { useAuthentication } from "../hooks/useAuthentication";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function Maps() {

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Maps</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      padding: 16,
    },
    title: {
      fontSize: 24,
      marginBottom: 16,
      textAlign: "center",
    },

})