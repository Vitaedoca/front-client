import { Container } from "./styles";


export function SelectService({ name, value, duration, onClick, image, selected}) {
    return(
        <Container onClick={onClick} selected={selected}>
            <img src={image} alt="" />
        
        <div>
            <h3>{name}</h3>
            <div className="description">
                <span><strong>R$ {value}</strong></span>
                <span>{duration} min</span>
            </div>
        </div>
        </Container>
    )
}