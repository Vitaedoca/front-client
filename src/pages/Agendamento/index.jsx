import { Container, Profile, Service } from "./styles";
import { DatePickerr } from "../../components/DatePicker";
import { Header } from "../../components/Header";
import { Cabeleireiro } from "../../components/Cabeleireiro";
import { SelectService } from "../../components/SelectService";
import { Horarios } from "../../components/Horarios";
import { Button } from "../../components/Button";
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { format, addMinutes, parseISO } from 'date-fns'; // Adicionado o import do 'addMinutes'
import { Swiper, SwiperSlide } from 'swiper/react';
import avatarPlaceholder from "../../assets/avatar_placeholder.svg";
import 'swiper/css';

export function Agendamento() {
    const [agendamento, setAgendamento] = useState("");
    const [services, setServices] = useState("");

    useEffect(() => {
        async function handleEvent() {
            const response = await api.get("/users");
            setAgendamento(response.data.barbeiros);
        }
        handleEvent();
    }, []);
    
    const [ user_id, setUser_id] = useState("");

    useEffect(() => {
        async function fetchServices() {
            if (user_id) {
                const responseSer = await api.get(`/services/showClient/${user_id}`);
                setServices(responseSer.data.services);
            }
        }
        fetchServices();
    }, [user_id]);

    const [selectedBarber, setSelectedBarber] = useState(null);
    const [service, setService] = useState("");
    
    const handleClickCabeleireiro = (id, name) => {
        setService(name);
        setUser_id(id);
        setSelectedBarber(id); 
    };

    const [selectedService, setSelectedService] = useState(null);
    const [selectedServiceData, setSelectedServiceData] = useState(null);

    function handleService(id, name, value, duration) {
        if (selectedService === id) {
            setSelectedService(null);
            setSelectedServiceData(null);
        } else {
            setSelectedService(id);
            setSelectedServiceData({
                id,
                name,
                value,
                duration
            });
        }
    }

    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateSelect = (date) => {
        setSelectedDate(format(date, 'yyyy-MM-dd'));
    };

    async function handleAgendamento(name, start, end, id) {
        await api.post("/agenda",  { name, start, end, id });
    }

    const [ hora, setHora ] = useState("");
    const [horario, setHorario] = useState([]);

    async function fetchHorarios() {
        if (user_id && selectedDate) {
            try {
                const response = await api.get(`/horarios/disponiveis/${user_id}/${selectedDate}`);
                setHorario(response.data.horariosDisponiveis);
            } catch (error) {
                console.error('Erro ao buscar horários disponíveis:', error);
                // Lide com o erro, como exibir uma mensagem para o usuário
            }
        }
    }

    const swiperParams = {
        slidesPerView: 5,
        spaceBetween: 10,
        loop: true,
    };

    return (
        <Container>
            <Header/>
            <Profile>
                <h2>Cabeleireiros</h2>
                {agendamento && agendamento.map(item => (
                    <Cabeleireiro
                        imagem={ item.avatar ? `${api.defaults.baseURL}/files/${item.avatar}` : avatarPlaceholder }
                        key={item.id}
                        name={item.name}
                        onClick={() => handleClickCabeleireiro(item.id, item.name)}
                        selected={selectedBarber === item.id}
                    />
                ))}
            </Profile>
            <Service>
                <h2>Serviços</h2>
                {services && services.map(item => (
                    <SelectService
                        image={ item.image ? `${api.defaults.baseURL}/files/${item.image}` : avatarPlaceholder }
                        key={item.id}
                        name={item.name}
                        value={item.value}
                        duration={item.duration}
                        onClick={() => handleService(item.id, item.name, item.value, item.duration)}
                        selected={selectedService === item.id}
                    />
                ))}
            </Service>
            <DatePickerr
                selected={selectedDate && fetchHorarios()}
                handle={handleDateSelect}
            />
            <Swiper className="swiper-container" {...swiperParams}>
                {horario && horario.map((h) => (
                    <SwiperSlide key={h.id}>
                        <Horarios
                            horario={h.horario}
                            onClick={() => setHora(h.horario)}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
            <Button
                title="Salvar"
                onClick={() => {
                    const dateTime = selectedDate ? selectedDate + "T" + hora : null;
                    if (!selectedServiceData || !dateTime) {
                        alert("Selecione um serviço e uma data/horário primeiro.");
                        return;
                    }
                    const durationInMinutes = selectedServiceData.duration;
                    const endDateTime = dateTime ? 
                        format(addMinutes(parseISO(dateTime), durationInMinutes), 'yyyy-MM-dd\'T\'HH:mm:ss') : null;
                    if (endDateTime) {
                        handleAgendamento(selectedServiceData.name, dateTime, endDateTime, user_id);
                        alert("Agendamento Realizado com sucesso!");
                        location.reload();
                    } else {
                        alert("Selecione uma data e horário primeiro.");
                    }
                }}
            />
        </Container>
    )
}
