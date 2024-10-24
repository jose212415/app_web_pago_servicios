import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Modules/Login";
import Register from "./Modules/Register";

import UserLayout from "./Modules/UserRole/UserLayout";
import DashboardUser from "./Modules/UserRole/DashboardUser";
import Cuenta from "./Modules/UserRole/Cuenta";
import RealizarPago from "./Modules/UserRole/RealizarPago";
import HistorialPagos from "./Modules/UserRole/HistorialPagos";
import EstadisticasUser from "./Modules/UserRole/EstadisticasUser";

import AdminLayout from "./Modules/AdminRole/AdminLayout";
import AdminHome from "./Modules/AdminRole/AdminHome";
import RegisterUserRequests from "./Modules/AdminRole/RegisterUserRequests";
import UsersAdministration from "./Modules/AdminRole/UsersAdministration";
import PayamentSupervision from "./Modules/AdminRole/PayamentSupervision";
import InvoiceGeneration from "./Modules/AdminRole/InvoiceGeneration";
import GlobalStatistics from "./Modules/AdminRole/GlobalStatistics";
import AdminNotifications from "./Modules/AdminRole/AdminNotifications";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/admin" element={<AdminLayout />}>
                    <Route path="admin-home" element={<AdminHome />} />
                    <Route path="register-user-requests" element={<RegisterUserRequests />}/>
                    <Route path="users-administration" element={<UsersAdministration />}/>
                    <Route path="invoice-generation" element={<InvoiceGeneration />}/>
                    <Route path="payament-supervision" element={<PayamentSupervision />}/>
                    <Route path="global-statistics" element={<GlobalStatistics />}/>
                    <Route path="admin-notifications" element={<AdminNotifications />}/>
                </Route>
                <Route path="/user" element={<UserLayout />}>
                    <Route path="dashboard-user" element={<DashboardUser />}/>
                    <Route path="cuenta-user" element={<Cuenta />}/>
                    <Route path="realizar-pago" element={<RealizarPago />}/>
                    <Route path="historial-pagos" element={<HistorialPagos />}/>
                    <Route path="estadisticas-user" element={<EstadisticasUser />}/>
                </Route>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </Router>
    );
}

export default App;