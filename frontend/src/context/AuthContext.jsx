import { createContext, useContext, useState } from "react";
import authService from "../services/auth.service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const [usuario, setUsuario] = useState(function () {
        const usuarioGuardado = localStorage.getItem("usuario");

        return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
    });

    const [token, setToken] = useState(function () {
        return localStorage.getItem("token");
    });

    // Registra un usuario.
    async function registrar(datosUsuario) {
        return await authService.registrarUsuario(datosUsuario);
    }

    // Inicia sesión y guarda los datos de autenticación.
    async function login(datosUsuario) {
        const resultado = await authService.iniciarSesion(datosUsuario);

        localStorage.setItem("token", resultado.token);
        localStorage.setItem("usuario", JSON.stringify(resultado.usuario));

        setToken(resultado.token);
        setUsuario(resultado.usuario);

        return resultado;
    }

    // Cierra la sesión del usuario.
    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");

        setToken(null);
        setUsuario(null);
    }

    const valor = {
        usuario,
        token,
        autenticado: Boolean(token && usuario),
        registrar,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={valor}>
            {children}
        </AuthContext.Provider>
    );
}

// Permite consumir el contexto desde otros componentes.
export function useAuth() {
    return useContext(AuthContext);
}