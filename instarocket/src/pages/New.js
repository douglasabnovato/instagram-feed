/* Nova publicação no app: escolhe imagem da galeria, preenche os campos e envia (API do image-picker v4) */
import React, { Component } from "react";
import { launchImageLibrary } from "react-native-image-picker";
import { StyleSheet, TouchableOpacity, Text, TextInput, Image, ScrollView, ActivityIndicator } from "react-native";
import api from "../services/api";

const FIELDS = [
  ["author", "Nome do autor"],
  ["place", "Local da foto"],
  ["description", "Descrição"],
  ["hashtags", "Hashtags"],
];

export default class New extends Component {
  static navigationOptions = { headerTitle: "Nova publicação" };

  state = { preview: null, image: null, author: "", place: "", description: "", hashtags: "", error: "", busy: false };

  /* Abre a galeria e guarda a imagem escolhida (antes: API removida no v4 e variável "exit" inexistente) */
  handleSelectImage = () => {
    launchImageLibrary({ mediaType: "photo", maxWidth: 1600, maxHeight: 1600, quality: 0.8 }, (res) => {
      if (res.didCancel) return;
      if (res.errorCode || !res.assets?.length) {
        this.setState({ error: "Não foi possível abrir a galeria." });
        return;
      }
      const asset = res.assets[0];
      const name = asset.fileName ? asset.fileName.replace(/\.heic$/i, ".jpg") : `${Date.now()}.jpg`;
      this.setState({ preview: { uri: asset.uri }, image: { uri: asset.uri, type: asset.type || "image/jpeg", name }, error: "" });
    });
  };

  /* Valida e envia a publicação */
  handleSubmit = async () => {
    const { image, author } = this.state;
    if (!image) return this.setState({ error: "Escolha uma imagem." });
    if (!author.trim()) return this.setState({ error: "Informe o autor." });
    const data = new FormData();
    data.append("image", image);
    for (const [k] of FIELDS) data.append(k, this.state[k]);
    this.setState({ busy: true, error: "" });
    try {
      await api.post("posts", data, { headers: { "Content-Type": "multipart/form-data" } });
      this.props.navigation.navigate("Feed");
    } catch (err) {
      const msg = err.response?.data?.errors?.join(" ") || "Falha ao publicar. Tente novamente.";
      this.setState({ error: msg, busy: false });
    }
  };

  render() {
    const { preview, error, busy } = this.state;
    return (
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.selectButton} onPress={this.handleSelectImage} accessibilityRole="button">
          <Text style={styles.selectButtonText}>Selecionar imagem</Text>
        </TouchableOpacity>
        {preview && <Image style={styles.preview} source={preview} accessibilityLabel="Pré-visualização da imagem" />}
        {FIELDS.map(([key, label]) => (
          <TextInput key={key} style={styles.input} autoCorrect={false} autoCapitalize={key === "hashtags" ? "none" : "sentences"}
            placeholder={label} accessibilityLabel={label} placeholderTextColor="#767676" value={this.state[key]}
            onChangeText={(text) => this.setState({ [key]: text })} />
        ))}
        {error ? <Text style={styles.error} accessibilityRole="alert">{error}</Text> : null}
        <TouchableOpacity style={styles.shareButton} onPress={this.handleSubmit} disabled={busy} accessibilityRole="button">
          {busy ? <ActivityIndicator color="#fff" /> : <Text style={styles.shareButtonText}>Compartilhar</Text>}
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 30, paddingBottom: 30 },
  selectButton: { borderRadius: 4, borderWidth: 1, borderColor: "#767676", borderStyle: "dashed", height: 44, justifyContent: "center", alignItems: "center" },
  selectButtonText: { fontSize: 15, color: "#444" },
  preview: { width: 100, height: 100, marginTop: 10, alignSelf: "center", borderRadius: 4 },
  input: { borderRadius: 4, borderWidth: 1, borderColor: "#767676", padding: 15, marginTop: 10, fontSize: 16 },
  error: { color: "#b3261e", marginTop: 10 },
  shareButton: { backgroundColor: "#5b45b0", borderRadius: 4, height: 44, marginTop: 15, justifyContent: "center", alignItems: "center" },
  shareButtonText: { fontWeight: "bold", fontSize: 16, color: "#FFF" },
});
/* Fim de New.js */
