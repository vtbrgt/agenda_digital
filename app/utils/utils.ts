export const datasIguais = (d1, d2) => {
    const d1Date = typeof d1 === "string" ? new Date(d1) : d1;
    const d2Date = typeof d2 === "string" ? new Date(d2) : d2;

    return (
        d1Date.getDate() === d2Date.getDate() &&
        d1Date.getMonth() === d2Date.getMonth() &&
        d1Date.getFullYear() === d2Date.getFullYear()
    );
}

export const STORAGE_KEY = 'clientes'

export const formatarDataBR = (data) => {
    const dateObject = typeof data === "string" ? new Date(data) : data;

    const dia = String(dateObject.getDate()).padStart(2, '0');
    const mes = String(dateObject.getMonth() + 1).padStart(2, '0'); // mês começa em 0
    const ano = dateObject.getFullYear();
    return `${dia}/${mes}/${ano}`;
}
export const formatarHorarioBR = (data) => {
    const dateObject = typeof data === "string" ? new Date(data) : data;

    const horas = String(dateObject.getHours()).padStart(2, '0');
    const minutos = String(dateObject.getMinutes()).padStart(2, '0');
    return `${horas}:${minutos}`;
}