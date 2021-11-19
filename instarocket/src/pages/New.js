import React, { Component } from 'react';
import ImagePicker from "react-native-image-picker";
import { View, StyleSheet, TouchableOpacity, Text, TextInput, Image } from 'react-native'

export default class New extends Component {

    static navigationOptions = {
        headerTitle: "Nova publicação"
    };

    state = {
        author: "",
        place: "",
        description: "",
        hashtags: "",
    } 

    handleSelectImage = () => {
        ImagePicker.showImagePicker({
            title: "Selecionar imagem",
        }, upload => {

        })
    }

    render() {
        return (
            <View style={ styles.container }>
                <TouchableOpacity style={ styles.selectButton } onPress={this.handleSelectImage}>
                    <Text style={ styles.selectButtonText }>Selecionar Imagem</Text>
                </TouchableOpacity>

                <TextInput
                    style={style.input}
                    autoCorrect={false}
                    autoCapitalize="none"
                    placeholder="Nome do autor"
                    placeholderTextColor="#999"
                    value={this.state.author}
                    onChangeText={author => this.setState({ author })}
                />
                
                <TextInput
                    style={style.input}
                    autoCorrect={false}
                    autoCapitalize="none"
                    placeholder="Local da Foto"
                    placeholderTextColor="#999"
                    value={this.state.place}
                    onChangeText={author => this.setState({ author })}
                />
                
                <TextInput
                    style={style.input}
                    autoCorrect={false}
                    autoCapitalize="none"
                    placeholder="Descrição"
                    placeholderTextColor="#999"
                    value={this.state.description}
                    onChangeText={author => this.setState({ author })}
                />
                
                <TextInput
                    style={style.input}
                    autoCorrect={false}
                    autoCapitalize="none"
                    placeholder="Hadhtags"
                    placeholderTextColor="#999"
                    value={this.state.hashtags}
                    onChangeText={author => this.setState({ author })}
                />
                
                <TouchableOpacity style={ styles.shareButton } onPress={() => {}}>
                    <Text style={ styles.shareButtonText }>Compartilhar</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({ 

    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 30,
    },  

    selectionButton: {
        borderRadius: 4,
        borderWidth: 1,
        boderColor: "#ccc",
        borderStyle: "dashed",
        height: 42,
        justifyContent: "center",
        aligntItems: "center",
    },

    selectionButtonText: {
        fontSize: 15,
        color: "#666",
    },

    preview: {
        widht: 100,
        height: 100,
        marginTop: 10,
        alginSekf: "center",
        borderRadius: 4,
    },

    input: {
        borderRadius:4,
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 15,
        marginTop: 10,
        fontSize: 16,
    },

    shareButton: {
        backgroundColor: "#7159c1",
        borderRadius: 4,
        height: 42,
        marginTop: 15,
        justifyContent: "center",
        alignItems: "center", 
    },

    shareButtonText: {
        fontWeight: "bold",
        fontSize: 16,
        color: "#FFF",
    },

});
