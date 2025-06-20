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
import {Button, FAB, IconButton, MD3Colors, Modal, PaperProvider, Portal, TextInput} from "react-native-paper";
import {Agendamento} from "@/app/utils/types";
import {useNavigation} from "@react-navigation/core";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import {datasIguais, formatarDataBR, formatarHorarioBR, STORAGE_KEY} from "@/app/utils/utils";
import {useRoute} from "@react-navigation/native";

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
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center'
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
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        height: 180,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    }
})

const ListaDeItens = () => {
    const [itens, setItens] = useState<Agendamento[]>([])
    const [carregando, setCarregando] = useState(true)
    const [modalDeleteVisible, setModalDeleteVisible] = useState(false)
    const [data, setData] = useState<Date | undefined>(new Date())
    const navigation = useNavigation()
    const [mostrarPicker, setMostrarPicker] = useState(false);
    const [agendamentoSelecionado, setAgendamentoSelecionado] = useState<Agendamento | null>();
    const route = useRoute();

    const carregarItens = async () => {
        try {
            const dadosSalvos = await AsyncStorage.getItem(STORAGE_KEY)
            if (dadosSalvos) {
                const lista: Agendamento[] = JSON.parse(dadosSalvos)
                setItens(lista.filter(item => datasIguais(item.data, data)))
            }
        } catch (erro) {
            console.error('Erro ao carregar itens do AsyncStorage:', erro)
        } finally {
            setCarregando(false)
        }
    }

    const removerItem = async () => {
        if (!agendamentoSelecionado) return
        try {
            const json = await AsyncStorage.getItem(STORAGE_KEY);
            if (!json) return;

            const lista = JSON.parse(json);

            const novaLista = lista.filter((item: Agendamento) => !(
                datasIguais(item.data, agendamentoSelecionado.data) &&
                item.nome === agendamentoSelecionado.nome
            ));

            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novaLista));

            carregarItens()
            console.log('Item removido com sucesso!');
            setModalDeleteVisible(false)
        } catch (error) {
            console.error('Erro ao remover item:', error);
        }
    }

    useEffect(() => {
        carregarItens()
    }, [data])

    useEffect(() => {
        if (!route.params) return
        else if (route.params.reload) carregarItens()
    }, [route]);

    return (
        <PaperProvider>
            <View style={styles.container}>
                {carregando && (
                    <>
                        <ActivityIndicator size="large" color="#000" />
                        <Text>Carregando itens...</Text>
                    </>
                )}
                {itens.length > 0 ? (
                    <>
                        <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 18, marginBottom: 12 }}>
                            Clientes agendados para {datasIguais(data, new Date()) ? 'hoje' : formatarDataBR(data)}
                        </Text>
                        <FlatList
                            data={itens}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <View style={styles.item} key={item.nome}>
                                    <Text>{item.nome} - {formatarHorarioBR(item.horario)}</Text>

                                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                                        <IconButton
                                            icon="pencil"
                                            iconColor={MD3Colors.primary60}
                                            size={20}
                                            onPress={() => navigation.navigate('create', {cliente: item})}
                                        />
                                        <IconButton
                                            icon="delete"
                                            iconColor={MD3Colors.error50}
                                            size={20}
                                            onPress={() => {
                                                setAgendamentoSelecionado(item)
                                                setModalDeleteVisible(true)
                                            }}
                                        />
                                    </View>
                                </View>
                            )}
                        />
                    </>
                ) : <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 18, marginBottom: 12 }}>Nenhum cliente encontrado</Text>}
                <FAB
                    icon="plus"
                    style={styles.fab1}
                    onPress={() => navigation.navigate('create')}
                />
                <FAB
                    icon="calendar-edit"
                    style={styles.fab2}
                    onPress={() => setMostrarPicker(true)}
                />
                {mostrarPicker && (
                    <RNDateTimePicker
                        value={data ?? new Date()}
                        mode="date"
                        display="default"
                        onChange={(_evt, newDate) => {
                            setMostrarPicker(false)
                            setData(newDate)
                        }}
                    />
                )}
                <Portal>
                    <Modal visible={modalDeleteVisible} contentContainerStyle={styles.modalContainer} onDismiss={() => {
                        setAgendamentoSelecionado(null)
                        setModalDeleteVisible(false)
                    }}>
                        <Text>Deseja mesmo excluir agendamento?</Text>

                        <View style={{ display: 'flex', flexDirection: 'row', gap: 16 }}>
                            <Button mode="text" onPress={() => {
                                setAgendamentoSelecionado(null)
                                setModalDeleteVisible(false)
                            }}>
                                Cancelar
                            </Button>
                            <Button mode="outlined" onPress={() => removerItem()}>
                                Confirmar
                            </Button>
                        </View>
                    </Modal>
                </Portal>
            </View>
        </PaperProvider>
    )
}

export default ListaDeItens
