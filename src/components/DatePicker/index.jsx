import { Container } from './styles';
import { DayPicker } from 'react-day-picker';
import { ptBR } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';
import { useState } from 'react';

export function DatePickerr({selected, handle, onClick}) {


    return (
        <Container>
            <DayPicker 
                onClick={onClick}
                mode="single"
                locale={ptBR}
                selected={selected}
                onSelect={handle}
            />
        </Container>
    );
}
