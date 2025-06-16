// import { Image } from 'expo-image';
// import { Platform, StyleSheet } from 'react-native';
//
// import { HelloWave } from '@/components/HelloWave';
// import ParallaxScrollView from '@/components/ParallaxScrollView';
// import { ThemedText } from '@/components/ThemedText';
// import { ThemedView } from '@/components/ThemedView';
//
// export default function HomeScreen() {
//   return (
//     <ParallaxScrollView
//       headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
//       headerImage={
//         <Image
//           source={require('@/assets/images/partial-react-logo.png')}
//           style={styles.reactLogo}
//         />
//       }>
//       <ThemedView style={styles.titleContainer}>
//         <ThemedText type="title">Welcome!</ThemedText>
//         <HelloWave />
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 1: Try it</ThemedText>
//         <ThemedText>
//           Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
//           Press{' '}
//           <ThemedText type="defaultSemiBold">
//             {Platform.select({
//               ios: 'cmd + d',
//               android: 'cmd + m',
//               web: 'F12',
//             })}
//           </ThemedText>{' '}
//           to open developer tools.
//         </ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 2: Explore</ThemedText>
//         <ThemedText>
//           {`Tap the Explore tab to learn more about what's included in this starter app.`}
//         </ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
//         <ThemedText>
//           {`When you're ready, run `}
//           <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
//           <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
//           <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
//           <ThemedText type="defaultSemiBold">app-example</ThemedText>.
//         </ThemedText>
//       </ThemedView>
//     </ParallaxScrollView>
//   );
// }
//
// const styles = StyleSheet.create({
//   titleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   stepContainer: {
//     gap: 8,
//     marginBottom: 8,
//   },
//   reactLogo: {
//     height: 178,
//     width: 290,
//     bottom: 0,
//     left: 0,
//     position: 'absolute',
//   },
// });

import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {FAB, Modal, PaperProvider, Portal} from "react-native-paper";

type Item = {
    id: string
    nome: string
}

const STORAGE_KEY = 'meus-itens'


const ListaDeItens = () => {
    const [itens, setItens] = useState<Item[]>([])
    const [carregando, setCarregando] = useState(true)
    const [modalVisible, setModalVisible] = React.useState(false)

    useEffect(() => {
        const exemplo = [
            { id: '1', nome: 'Item A' },
            { id: '2', nome: 'Item B' },
            { id: '3', nome: 'Item C' },
        ]

        AsyncStorage.setItem('meus-itens', JSON.stringify(exemplo))
    }, []);

    useEffect(() => {
        const carregarItens = async () => {
            try {
                const dadosSalvos = await AsyncStorage.getItem(STORAGE_KEY)
                if (dadosSalvos) {
                    const lista: Item[] = JSON.parse(dadosSalvos)
                    setItens(lista)
                }
            } catch (erro) {
                console.error('Erro ao carregar itens do AsyncStorage:', erro)
            } finally {
                setCarregando(false)
            }
        }

        carregarItens()
    }, [])

    // if (carregando) {
    //     return (
    //         <View style={styles.container}>
    //             <ActivityIndicator size="large" color="#000" />
    //             <Text>Carregando itens...</Text>
    //         </View>
    //     )
    // }
    //
    // if (!itens.length) {
    //     return (
    //         <View style={styles.container}>
    //             <Text>Nenhum item encontrado.</Text>
    //         </View>
    //     )
    // }

    return (
        <View style={styles.container}>
            {carregando && (
                <>
                    <ActivityIndicator size="large" color="#000" />
                    <Text>Carregando itens...</Text>
                </>
            )}
            {itens.length > 0 ? (
                <>
                    <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 18, marginBottom: 12 }}>Clientes agendados para hoje</Text>
                    <FlatList
                        data={itens}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.item}>
                                <Text>{item.nome}</Text>
                            </View>
                        )}
                    />
                </>
            ) : <Text>Nenhum item encontrado.</Text>}
            <FAB
                icon="plus"
                style={styles.fab1}
                onPress={() => console.log('Pressed1')}
            />
            <FAB
                icon="calendar-edit"
                style={styles.fab2}
                onPress={() => setModalVisible(true)}
            />
            <PaperProvider>
                <Portal>
                    <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)}>
                        <Text>Example Modal.  Click outside this area to dismiss.</Text>
                    </Modal>
                </Portal>
            </PaperProvider>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 60,
        backgroundColor: '#f8f8f8',
    },
    item: {
        backgroundColor: '#fff',
        padding: 16,
        marginBottom: 12,
        borderRadius: 8,
        elevation: 2,
    },
    fab1: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    fab2: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 72,
    },
})

export default ListaDeItens
