import {Button, Modal, PaperProvider, Portal, TextInput} from "react-native-paper";
import {StyleSheet, Text, View} from "react-native";
import React, {useEffect, useState} from "react";
import {Agendamento} from "@/app/utils/types";
import {useRoute} from "@react-navigation/native";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {datasIguais, STORAGE_KEY} from "@/app/utils/utils";
import {useNavigation} from "@react-navigation/core";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 60,
        backgroundColor: '#f8f8f8',
    }
})

const CriarCliente = () => {
    const [dataInput, setDataInput] = useState<Date | undefined>(new Date())
    const [horario, setHorario] = useState<Date | undefined>(new Date())
    const [nome, setNome] = useState("")
    const [agendamento, setAgendamento] = useState<Agendamento | null>(null);
    const navigation = useNavigation()
    const route = useRoute();
    const [mostrarPickerData, setMostrarPickerData] = useState(false);
    const [mostrarPickerHorario, setMostrarPickerHorario] = useState(false);

    const agendarCliente = async () => {
        try {
            const json = await AsyncStorage.getItem(STORAGE_KEY);
            if (!json) return;

            const lista: Agendamento[] = JSON.parse(json)

            const novoAgendamento = {
                nome,
                horario,
                data: dataInput
            }

            const novaLista = [...lista, novoAgendamento];

            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novaLista));

            console.log('Agendamento criado com sucesso!');
            setNome('')
            setDataInput(new Date())
            setHorario(new Date())
            navigation.navigate('index', {reload: true})
        } catch (error) {
            console.error('Erro ao criar agendamento:', error);
        }
    }
    const editarCliente = async () => {
        if (!agendamento) return
        try {
            const json = await AsyncStorage.getItem(STORAGE_KEY);
            if (!json) return;

            const lista: Agendamento[] = JSON.parse(json)

            const agendamentoEditado = {
                nome,
                horario,
                data: dataInput
            }

            const novaLista = lista.map(item =>
                datasIguais(item.data, agendamento.data) &&
                item.nome === agendamento.nome ? agendamentoEditado : item
            );

            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novaLista));

            console.log('Agendamento editado com sucesso!');
            setNome('')
            setDataInput(new Date())
            setHorario(new Date())
            navigation.navigate('index', {reload: true})
        } catch (error) {
            console.error('Erro ao editar agendamento:', error);
        }
    }

    useEffect(() => {
        if (!route.params) return
        else if (route.params.cliente) {
            const cliente = route.params.cliente as Agendamento
            setAgendamento(cliente)
            setNome(cliente.nome)
            setHorario(new Date(cliente.horario))
            setDataInput(new Date(cliente.data))
        }
    }, [route]);

    return (
        <PaperProvider>
            <View style={styles.container}>
                <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 18, marginBottom: 12 }}>{agendamento ? 'Editar' : 'Criar novo'} agendamento</Text>

                <TextInput
                    label="Nome do cliente"
                    value={nome}
                    onChangeText={text => setNome(text)}
                    style={{ marginBottom: 12 }}
                />
                <Button style={{ marginBottom: 12 }} mode='contained-tonal' onPress={() => setMostrarPickerData(true)}>
                    Selecionar data
                </Button>
                <Button style={{ marginBottom: 12 }} mode='contained-tonal' onPress={() => setMostrarPickerHorario(true)}>
                    Selecionar horário
                </Button>

                {mostrarPickerData && (
                    <RNDateTimePicker
                        value={dataInput ?? new Date()}
                        mode="date"
                        display="default"
                        onChange={(_evt, newDate) => {
                            setMostrarPickerData(false)
                            setDataInput(newDate)
                        }}
                    />
                )}
                {mostrarPickerHorario && (
                    <RNDateTimePicker
                        value={horario ?? new Date()}
                        mode="time"
                        display="default"
                        onChange={(_evt, newDate) => {
                            setMostrarPickerHorario(false)
                            setHorario(newDate)
                        }}
                        is24Hour={true}
                    />
                )}


                <Button mode="outlined" onPress={() => agendamento ? editarCliente() : agendarCliente()}>
                    {agendamento ? 'Editar' : 'Criar'}
                </Button>
            </View>
        </PaperProvider>
    )
}

export default CriarCliente