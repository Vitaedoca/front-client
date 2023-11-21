import { Route, Routes } from "react-router-dom";
import { Agendamento } from "../pages/Agendamento";
import { Profile } from "../pages/Profile";

export function AppRoutes() {
    return(
        <Routes>
            <Route path="/" element={<Agendamento/>}/>
            <Route path="/profile" element={<Profile/>}/>
        </Routes>
    )
}