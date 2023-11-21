import { Container, Profile } from "./styles";
import { FiCalendar, FiClock } from "react-icons/fi"
import { useState } from "react";
export function Cabeleireiro({ name, imagem, onClick, selected}) {

    const [isActive, setIsActive] = useState(false);

    const handleClick = () => {
      setIsActive(!isActive);
      onClick && onClick();
    };

    return (
        <Container onClick={onClick} selected={selected}>
            <Profile>
                <img src={imagem} alt="" />
                <div>
                    <h3>{name}</h3>
                    <div className="info">
                        <span>

                            <FiCalendar/>
                            Segunda à sexta
                        </span>
                        <span>

                            <FiClock/>
                            8h às 18h
                        </span>
                    </div>
                </div>

            </Profile>
        </Container>
    )
}